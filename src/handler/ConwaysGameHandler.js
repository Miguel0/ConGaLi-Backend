const ExceptionCatcher = require('../exception/ExceptionCatcher')
const AppException = require('../exception/AppException')

const logger = require('log4js').getLogger('Conway\'s Game Handler')

class ConwaysGameHandlerConfigurator {
  constructor (io, businessLogicManagersHolder) {
    this.createdOn = new Date()
    this.io = io
    this.gameTickHandler = {}
    this.exceptionCatcher = new ExceptionCatcher(this.sendErrorToClient.bind(this))
    this.conwaysGameBusinessLogicManager = businessLogicManagersHolder.ConwaysGameBusinessLogicManager
    this.userBusinessLogicManager = businessLogicManagersHolder.UserBusinessLogicManager

    io.on(
      'connection',
      socket => this.configureSocketUponConnection(socket, io))
  }

  configureSocketUponConnection (socket, io) {
    socket
      .on('createGame', data => this.createGame(socket, data))
      .on('startGame', data => this.startGame(socket, data))
      .on('getTemplateCellsOptions', () => this.sendTemplateCellsOptionsToSocket(socket))
      .on('forceEnd', () => this.forceStopGame(socket))
      .on('createCell', data => this.createCell(socket, data))
      .on('createTemplate', data => this.createTemplate(socket, data))
      .on('killCell', data => this.killCell(socket, data))
      .on('joinGame', data => this.joinGame(socket, data))
  }

  getGameChannel (game) {
    return this.io.to(game.getRoomId())
  }

  sendErrorToClient (appException) {
    this.getGameChannel().emit(appException.isUnexpected() ? 'error' : 'appException', appException.toString())
  }

  sendGridRefreshToClient (game) {
    let jsonData = game.toJSONObject()
    logger.debug(`Sending data table to client: ${JSON.stringify(jsonData)}`)

    this.getGameChannel(game).emit('refreshCellsGrid', jsonData)
  }

  checkValidRoomForUser (game, userId) {
    if (!game.retrieveUserWithId(userId)) {
      throw new AppException(
        'error.game.invalidGameForUser.title',
        'error.game.invalidGameForUser.body',
        userId
      )
    }
  }

  startGame (socket, data) {
    logger.debug(`Received request for game start with arguments #${JSON.stringify(data)}`)
    let game = this.conwaysGameBusinessLogicManager.getGameForUserId(data.game.id, data.game.ownerId)
    this.checkValidRoomForUser(game, data.user.id)

    logger.debug(`Starting game #${game.id}`)

    this.gameTickHandler[game.id] = setInterval(
      () => {
        let game = this.conwaysGameBusinessLogicManager.getGameForUserId(data.game.id, data.game.ownerId)
        game.refreshCellsGrids()

        let jsonData = game.toJSONObject()
        logger.debug(`Sending data table to client: ${JSON.stringify(jsonData)}`)

        this.getGameChannel(game).emit('refreshCellsGrid', jsonData)
      },
      game.refreshInterval)

    logger.debug(`Game #${data.game.id} started`)
  }

  releaseResourcesFor (userId) {
    let games = this.conwaysGameBusinessLogicManager.getGamesForUserId(userId)

    for (let i = 0; i < games.length; i++) {
      this.forceStopGame(games[i])
    }
  }

  forceStopGame (game) {
    clearInterval(this.gameTickHandler[game.id])
  }

  joinGame (socket, data) {
    logger.debug(`Joining to game with data sent by client: ${JSON.stringify(data)}`)
    let game = this.conwaysGameBusinessLogicManager.getGameForUserId(data.game.id, data.game.ownerId)
    let user = this.userBusinessLogicManager.getUserById(data.user.id)
    game.addUser({id: user.id, name: user.name, color: data.user.color})

    this.doJoinRoom(socket, game, (socket, game) => {
      logger.debug(`Sending the signal for joining a game with data: ${JSON.stringify(data)}`)
      socket.emit('joinedToGame', data)
    })
  }

  removeUser () {
  }

  updateUser () {
  }

  updateConfiguration () {
  }

  createCell (socket, cellCreationData) {
    logger.debug(`Just received cell creation data from client: ${JSON.stringify(cellCreationData)}`)

    let game = this.conwaysGameBusinessLogicManager.getGameForUserId(cellCreationData.game.id, cellCreationData.game.ownerId)

    let cellRawData = cellCreationData.eventPosition

    logger.debug(`Creating cell with data: ${JSON.stringify(cellRawData)}`)

    game.createCellsBy(cellCreationData.user.id, 0, [cellRawData])
    this.sendGridRefreshToClient(game)
  }

  createTemplate (socket, templateCreationData) {
    logger.debug(`Creating template with ${JSON.stringify(templateCreationData)}`)

    let game = this.conwaysGameBusinessLogicManager.getGameForUserId(templateCreationData.game.id, templateCreationData.game.ownerId)

    game.createCellsOfTemplateBy(templateCreationData.user.id, 0, templateCreationData)
    this.sendGridRefreshToClient(game)
  }

  killCell (cellAssasinationData, socket) {
    let game = this.conwaysGameBusinessLogicManager.getGameForUserId(cellAssasinationData.game.id, cellAssasinationData.game.ownerId)
    game.cellsGrids[0].killCellsByAsync(cellAssasinationData.user, cellAssasinationData instanceof Array ? cellAssasinationData : [cellAssasinationData])
      .catch(this.exceptionCatcher.dealWithException.bind(this.exceptionCatcher))
  }

  sendTemplateCellsOptionsToSocket (game) {
    this.getGameChannel(game).emit(
      'setTemplateCellsOptions',
      game.getPresetConfigurations())
  }

  createGame (socket, data) {
    logger.debug(`Just received game creation data from client: ${JSON.stringify(data)}`)
    let user = this.userBusinessLogicManager.getUserById(data.user.id)
    let game = this.conwaysGameBusinessLogicManager.createGame(data, {id: user.id, name: user.name, color: data.user.color})

    this.doJoinRoom(socket, game, (socket, game) => {
      let gameData = game.getDescriptiveJSONObject()
      logger.debug(`Sending the signal for game created with data: ${JSON.stringify(gameData)}`)
      this.io.to(socket.id).emit('gameCreated', gameData)
    })
  }

  doJoinRoom (socket, game, clientEventSender) {
    logger.debug(`Wiring socket with the propper events for the channel ${game.getRoomId()}`)
    socket.join(
      game.getRoomId(),
      () => {
        let gameChannel = this.getGameChannel(game)
        logger.debug(`Wiring socket with the propper events for the channel ${game.getRoomId()}`)

        gameChannel.on('updateConfiguration', this.updateConfiguration)
        gameChannel.on('removeUser', this.removeUser)
        gameChannel.on('updateUser', this.updateUser)

        logger.debug(`Sending replies to the owner of the game at socket #${socket.id}`)

        clientEventSender.call(this, socket, game)

        this.sendGridRefreshToClient(game)
        this.sendTemplateCellsOptionsToSocket(game)
      }
    )
  }
}

module.exports = ConwaysGameHandlerConfigurator

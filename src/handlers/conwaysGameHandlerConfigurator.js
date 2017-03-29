const Promise = require('bluebird')
const ConwaysGame = require('../model/ConwaysGame.js')
const ExceptionCatcher = require('../utils/ExceptionCatcher')

class ConwaysGameHandlerConfigurator {
  constructor (io, socket) {
    this.game = null
    this.gameTickHandler = []
    this.exceptionCatcher = new ExceptionCatcher(this.sendErrorToClient.bind(this))
    this.io = io

    socket.on('createGame', data => this.createGame(data, socket))
    socket.on('startGame', data => this.startGame(data, socket))
    socket.on('getTemplateCellsOptions', () => this.sendTemplateCellsOptionsToSocket(socket))
    socket.on('forceEnd', this.forceStopGame)
  }

  getGameChannel () {
    return this.game ? this.io.to(this.game.name) : this.io
  }

  sendErrorToClient (appException) {
    this.getGameChannel().emit(appException.isUnexpected() ? 'error' : 'appException', appException.toString())
  }

  sendGridRefreshToClient () {
    let jsonData = this.game.toJSONObject()
    console.log(`${new Date().toISOString()} sending data table to client: ${JSON.stringify(jsonData)}`)

    this.getGameChannel().emit('refreshCellsGrid', jsonData)
  }

  checkValidRoomForUser (roomId, socket) {
    // TODO see how to check using something like (socket.rooms.indexOf(data.cellsGridId) > -1)
    return true
  }

  startGame (data, socket) {
    this.checkValidRoomForUser(data.cellsGridId, socket)

    console.log(`${new Date().toISOString()} starting game for board ${data.cellsGridId}`)

    for (let i = 0; i < this.game.cellsGrids.length; i++) {
      this.gameTickHandler[i] = setInterval(
        () => {
          this.game.refreshCellsGrid(data.cellsGridId)
          let jsonData = this.game.toJSONObject()
          console.log(`${new Date().toISOString()} sending data table to client: ${JSON.stringify(jsonData)}`)

          this.getGameChannel().emit('refreshCellsGrid', jsonData)
        },
        this.game.refreshInterval)
    }

    console.log(`${new Date().toISOString()} game started for board ${data.cellsGridId}`)
  }

  release () {
    this.forceStopGame()
  }

  forceStopGame (data) {
    if (this.game) {
      for (let i = 0; i < this.game.cellsGrids.length; i++) {
        clearInterval(this.gameTickHandler[i])
      }
    }
  }

  addUser (socketId, userData) {
    this.game.addUser(socketId, userData)
  }

  removeUser () {
  }

  updateUser () {
  }

  updateConfiguration () {
  }

  createCell (cellCreationData, socket) {
    console.log('Receive cell creation data from client: ' + JSON.stringify(cellCreationData))

    let cellRawData = cellCreationData.eventPosition

    console.log('creating cell with data: ' + JSON.stringify(cellRawData))

    this.game.createCellsByAsync(socket.id, 0, [cellRawData])
      .then(this.sendGridRefreshToClient.bind(this))
      .catch(this.exceptionCatcher.dealWithException.bind(this.exceptionCatcher))
  }

  createTemplate (templateCreationData, socket) {
    console.log('creating template with ' + JSON.stringify(templateCreationData))

    this.game.createCellsOfTemplateByAsync(socket.id, 0, templateCreationData)
      .then(this.sendGridRefreshToClient.bind(this))
      .catch(this.exceptionCatcher.dealWithException.bind(this.exceptionCatcher))
  }

  killCell (cellAssasinationData, socket) {
    this.game.cellsGrids[0].killCellsByAsync(cellAssasinationData.user, cellAssasinationData instanceof Array ? cellAssasinationData : [cellAssasinationData])
      .catch(this.exceptionCatcher.dealWithException.bind(this.exceptionCatcher))
  }

  sendTemplateCellsOptionsToSocket (socket) {
    this.getGameChannel().emit(
      'setTemplateCellsOptions',
      (this.game ? this.game.getPresetsConfiguration() : ConwaysGame.PRESETS_CONFIGURATION))
  }

  createGame (data, socket) {
    this.exceptionCatcher.gameName = data.gameName

    this.game = Promise.promisifyAll(new ConwaysGame())
    this.game.name = data.gameName

    if (data.refreshInterval) {
      this.game.refreshInterval = parseInt(data.refreshInterval)
    }

    // TODO have to improve this in the near future
    if (data.resolution) {
      this.game.cellsGrids[0].resolution = parseInt(data.resolution)
    }

    this.addUser(socket.id, data.userData)

    socket.join(this.game.name, () => {
      let gameChannel = this.getGameChannel()
      gameChannel.on('updateConfiguration', this.updateConfiguration)
      gameChannel.on('addUser', this.addUser)
      gameChannel.on('removeUser', this.removeUser)
      gameChannel.on('updateUser', this.updateUser)

      console.log(`Game successfully created with data: ${JSON.stringify(data)}`)

      this.io.to(socket.id).emit('gameCreated', data)
      this.sendGridRefreshToClient()
      this.sendTemplateCellsOptionsToSocket(socket)
    })

    socket.on(
      'createCell',
      data => {
        console.log(`Query: ${JSON.stringify(socket.handshake.query)}`)
        this.createCell(data, socket)
      }
    ).on(
      'createTemplate',
      data => {
        console.log(`Query: ${JSON.stringify(socket.handshake.query)}`)
        this.createTemplate(data, socket)
      }
    ).on(
      'killCell',
      data => {
        console.log(`Query: ${JSON.stringify(socket.handshake.query)}`)
        this.killCell(data, socket)
      }
    )
  }
}

module.exports = ConwaysGameHandlerConfigurator

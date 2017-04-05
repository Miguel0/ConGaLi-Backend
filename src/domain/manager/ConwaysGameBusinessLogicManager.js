const logger = require('log4js').getLogger('Business Logic Manager')
const ConwaysGame = require('../model/ConwaysGame.js')

class ConwaysGameService {
  constructor (storageDAO) {
    this.storageDAO = storageDAO
  }

  getGameActualData (gameId, userId) {
    return this.storageDAO.getGame(gameId)
  }

  startGame (gameId, userId) {
    let game = this.getGameActualData(gameId, userId)
    game.startedOn = new Date()

    delete game.stoppedOn
    delete game.pausedOn

    return game
  }

  stopGame (gameId, userId) {
    let game = this.getGameActualData(gameId, userId)
    game.stoppedOn = new Date()

    return game
  }

  pauseGame (gameId, userId) {
    let game = this.getGameActualData(gameId, userId)
    game.pausedOn = new Date()

    return game
  }

  forceStopGame (data) {
    if (this.game) {
      for (let i = 0; i < this.game.cellsGrids.length; i++) {
        clearInterval(this.gameTickHandler[i])
      }
    }
  }

  addUser (gameId, ownerUserId, userData) {
    this.game.addUser(userData)
  }

  removeUser (gameId, ownerUserId, userData) {
  }

  createCell (gameId, userId, cellCreationData) {
    logger.log('Receive cell creation data from client: ' + JSON.stringify(cellCreationData))

    let cellRawData = cellCreationData.eventPosition

    console.log('creating cell with data: ' + JSON.stringify(cellRawData))

    this.game.createCellsByAsync(userId, 0, [cellRawData])
  }

  createTemplate (gameId, userId, templateCreationData) {
    console.log('creating template with ' + JSON.stringify(templateCreationData))

    this.game.createCellsOfTemplateByAsync(userId, 0, templateCreationData)
  }

  killCell (gameId, userId, cellAssasinationData) {
    this.game.cellsGrids[0].killCellsByAsync(cellAssasinationData.user, cellAssasinationData instanceof Array ? cellAssasinationData : [cellAssasinationData])
  }

  getPresetsConfiguration (gameId, userId) {
    return this.game.getPresetsConfiguration()
  }

  createGame (data, userId) {
    let userData = data.userData
    let game = new ConwaysGame(userId)
    this.game.name = data.gameName

    if (data.refreshInterval) {
      this.game.refreshInterval = parseInt(data.refreshInterval)
    }

    // TODO have to improve this in the near future
    if (data.resolution) {
      this.game.cellsGrids[0].resolution = parseInt(data.resolution)
    }

    this.addUser(userId, userData)

    return game
  }
}

module.exports = ConwaysGameService

/**
 * ConwaysGameService it's a class that implements the behavior for the business logic specifically
 * associated with the instances of the game.
 */

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

  getGamesForUserId (ownerUserId) {
    return this.storageDAO.getGamesForUserId(ownerUserId)
  }

  getGameForUserId (gameId, ownerUserId) {
    return this.storageDAO.getGameForUserId(gameId, ownerUserId)
  }

  addUserToGame (gameId, ownerUserId, userData) {
    let game = this.storageDAO.getGameForUserId(gameId, ownerUserId)

    game.addUser(userData)
  }

  removeUser (gameId, ownerUserId, userData) {
  }

  createCell (gameId, userId, cellCreationData) {
    logger.debug(`Receive cell creation data from client: ${JSON.stringify(cellCreationData)}`)

    let cellRawData = cellCreationData.eventPosition

    logger.debug(`Creating cell with data: ${JSON.stringify(cellRawData)}`)

    this.game.createCellsByAsync(userId, 0, cellRawData)
  }

  createTemplate (gameId, userId, templateCreationData) {
    logger.debug('creating template with ' + JSON.stringify(templateCreationData))

    this.game.createCellsOfTemplateByAsync(userId, 0, ...templateCreationData)
  }

  killCell (gameId, userId, cellAssasinationData) {
    this.game.cellsGrids[0].killCellsByAsync(cellAssasinationData.user, cellAssasinationData instanceof Array ? cellAssasinationData : [cellAssasinationData])
  }

  getPresetsConfiguration (gameId, userId) {
    return this.game.getPresetsConfiguration()
  }

  createGame (data, user) {
    let game = new ConwaysGame(user)
    game.name = data.name
    game.presetConfigurations = this.storageDAO.getCellsTemplates()

    if (data.refreshInterval) {
      game.refreshInterval = parseInt(data.refreshInterval)
    }

    // TODO have to improve this in the near future
    if (data.resolution) {
      let resolution = parseInt(data.resolution)

      for (let i = 0; i < game.cellsGrids.length; i++) {
        game.cellsGrids[i].resolution = resolution
      }
    }

    return this.storageDAO.saveGame(game)
  }
}

module.exports = ConwaysGameService

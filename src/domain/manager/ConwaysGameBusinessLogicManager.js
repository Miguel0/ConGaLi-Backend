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

  getGameById (gameId) {
    return this.storageDAO.getGameById(gameId)
  }

  getGamesContainingUserId (gameId) {
    return this.storageDAO.getGamesContainingUserId(gameId)
  }

  addUserToGame (gameId, ownerUserId, userData) {
    let game = this.storageDAO.getGameForUserId(gameId, ownerUserId)

    game.addUser(userData)
  }

  removeGamesForUserId (userId) {
    let games = this.getGamesContainingUserId(userId)
    let gamesAffected = {
      deleted: [],
      changedOwnership: []
    }

    for (let i = 0; i < games.length; i++) {
      let game = games[i]
      let previousOwner = game.ownerId

      game.removeUserById(userId)

      if (game.hasOwner()) {
        // save the game, this time associated with his new owner
        this.storageDAO.saveGame(game)

        if (previousOwner !== game.ownerId) {
          gamesAffected.changedOwnership.push(game)
        }
      } else {
        gamesAffected.deleted.push(game)
      }

      // this is necessary here just because whe are not using a copy of the game to remove
      // the user. Else, this should be into the save/update game behavior of the storageDAO.
      this.storageDAO.removeUserGameById(userId, game.id)
    }

    return gamesAffected
  }

  removeUserByIdFromGame (gameId, userId) {
    let game = this.storageDAO.getGameById(gameId)

    game.removeUserById(userId)

    if (game.hasOwner()) {
      // save the game, this time associated with his new owner
      this.storageDAO.saveGame(game)
    }

    // this is necessary here just because whe are not using a copy of the game to remove
    // the user. Else, this should be into the save/update game behavior of the storageDAO.
    this.storageDAO.removeUserGameById(userId, game.id)
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

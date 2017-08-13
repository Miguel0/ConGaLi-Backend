const AppException = require('../exception/AppException')
const DefaultCellsTemplatesConfig = require('./defaultCellsTemplatesConfigurations')
const cuid = require('cuid')

const logger = require('log4js').getLogger('Storage DAO')

/**
 * StorageDAO implements the agregated behavior that handle the storage of data
 * of different objects representing several concepts required for the system
 * behavior.
 *
 * It holds Games, Users and cells templates, but we have to bear in mind that this
 * behavior will be decoupled across the different microservices impmenentation
 * that are planed in mid term.
 */
class StorageDAO {
  constructor () {
    this.createdOn = new Date()
    this.cellsTemplates = DefaultCellsTemplatesConfig
    this.users = {}
    this.gamesByUserId = {}
  }

  removeUserGameById (userId, gameId) {
    logger.debug(`Removing game: ${gameId} of userId ${userId}`)

    delete this.gamesByUserId[userId][gameId]
  }

  saveUser (user) {
    logger.debug(`Checking user: ${JSON.stringify(user)}`)

    if (this.getUserByName(user.name)) {
      throw new AppException(
        'error.user.alreadyExists.title',
        'error.user.alreadyExists.body'
      )
    } else {
      user.id = cuid()
    }

    logger.debug(`Saving user: ${JSON.stringify(user)}`)
    this.users[user.id] = user
    this.gamesByUserId[user.id] = {}
    return user
  }

  getUserByName (name) {
    for (let userId in this.users) {
      if (this.users[userId].name === name) {
        return this.users[userId]
      }
    }
    return null
  }

  getUserById (userId) {
    return this.users[userId]
  }

  saveGame (game) {
    logger.debug(`Checking game: ${JSON.stringify(game)}`)
    game.id = cuid()

    if (this.getGameWithName(game.name, game.ownerId)) {
      throw new AppException(
        'error.game.save.alreadyExists.title',
        'error.game.save.alreadyExists.body'
      )
    }

    logger.debug(`Saving game: ${JSON.stringify(game)}`)
    this.gamesByUserId[game.ownerId][game.id] = game

    return game
  }

  getGameWithName (name, userId) {
    let usersGames = this.gamesByUserId[userId]
    for (let gameId in usersGames) {
      if (usersGames[gameId].name === name) {
        return usersGames[gameId]
      }
    }
    return null
  }

  getGameById (gameId) {
    logger.debug(`Retrieving game with id: ${gameId}`)

    for (let userId in this.gamesByUserId) {
      let gameFound = this.gamesByUserId[userId][gameId]
      if (gameFound) {
        return gameFound
      }
    }

    return null
  }

  getGameForUserId (gameId, userId) {
    logger.debug(`Retrieving game with id: ${gameId} for owner: ${userId}`)
    return this.gamesByUserId[userId][gameId]
  }

  getGamesForUserId (userId) {
    let result = []
    let usersGames = this.gamesByUserId[userId]
    for (let gameId in usersGames) {
      result.push(usersGames[gameId])
    }
    return result
  }

  getGamesContainingUserId (userId) {
    let result = []

    this.forEachGame(game => {
      if (game.containsUserId(userId)) {
        result.push(game)
      }
    })

    return result
  }

  forEachGame (eachFunction) {
    let gamesUsersId = Object.keys(this.gamesByUserId)

    for (let userId in gamesUsersId) {
      let gamesForUser = this.gamesByUserId[gamesUsersId[userId]]
      for (let gameId in gamesForUser) {
        eachFunction.call(eachFunction, gamesForUser[gameId])
      }
    }
  }

  forEachGameOfUser (userId, eachFunction) {
    let gamesForUser = this.gamesByUserId[userId]
    for (let gameId in gamesForUser) {
      eachFunction.call(eachFunction, gamesForUser[gameId])
    }
  }

  getCellsTemplates () {
    return this.cellsTemplates.slice(0)
  }
}

module.exports = StorageDAO

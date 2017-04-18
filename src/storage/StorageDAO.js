const AppException = require('../exception/AppException')
const DefaultCellsTemplatesConfig = require('./defaultCellsTemplatesConfigurations')

const logger = require('log4js').getLogger('Storage DAO')

class StorageDAO {
  constructor () {
    this.createdOn = new Date()
    this.cellsTemplates = DefaultCellsTemplatesConfig
    this.users = []
    this.gamesByUserId = {}
  }

  saveUser (user) {
    logger.debug(`Checking user: ${JSON.stringify(user)}`)

    if (this.getUserByName(user.name)) {
      throw new AppException(
        'error.user.alreadyExists.title',
        'error.user.alreadyExists.body'
      )
    } else {
      user.id = this.users.length
    }

    logger.debug(`Saving user: ${JSON.stringify(user)}`)
    this.users.push(user)
    this.gamesByUserId[user.id] = []
    return user
  }

  getUserByName (name) {
    return this.users.find(storedUser => storedUser.name === name)
  }

  getUserById (userId) {
    return this.users.find(storedUser => storedUser.id === userId)
  }

  saveGame (game) {
    logger.debug(`Checking game: ${JSON.stringify(game)}`)
    game.id = this.gamesByUserId[game.ownerId].length

    if (this.getGameWithName(game.name, game.ownerId)) {
      throw new AppException(
        'error.game.alreadyExists.title',
        'error.user.alreadyExists.body'
      )
    }

    logger.debug(`Saving game: ${JSON.stringify(game)}`)
    this.gamesByUserId[game.ownerId].push(game)

    return game
  }

  getGameWithName (name, userId) {
    return this.gamesByUserId[userId].filter(storedGame => storedGame.name === name)[0]
  }

  getGameForUserId (gameId, userId) {
    logger.debug(`Retrieving game with id: ${gameId} for owner: ${userId}`)

    return this.gamesByUserId[userId][gameId]
  }

  getGamesForUserId (userId) {
    return this.gamesByUserId[userId].slice(0)
  }

  forEachGame (eachFunction) {
    for (let userId in Object.keys(this.gamesByUserId)) {
      for (let i = 0; i < this.gamesByUserId[userId].length; i++) {
        eachFunction.call(eachFunction, this.gamesByUserId[userId][i])
      }
    }
  }

  forEachGameOfUser (userId, eachFunction) {
    for (let i = 0; i < this.gamesByUserId[userId].length; i++) {
      eachFunction.call(eachFunction, this.gamesByUserId[userId][i])
    }
  }

  getCellsTemplates () {
    return this.cellsTemplates.slice(0)
  }
}

module.exports = StorageDAO

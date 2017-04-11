const logger = require('log4js').getLogger('Business Logic Manager')

/**
 * This class defines the behavior for a service that deals with general
 * information retrieval from the system to outer layers, such as the one
 * of the WebSocket handlers.
 */
class GeneralCommunicationService {
  constructor (storageDAO) {
    this.createdOn = new Date()
    this.storageDAO = storageDAO
  }

  getAvailableGamesDescriptionFor (userId) {
    let games = []
    logger.debug(`searching game definitions for user id: ${userId}`)

    this.storageDAO.forEachGame(game => games.push(game.getDescriptiveJSONObject()))

    logger.debug(`games calculated:${JSON.stringify(games)}`)
    return games
  }
}

module.exports = GeneralCommunicationService

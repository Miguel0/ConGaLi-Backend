/**
 * GeneralCommunicationHandlerConfigurator it's a class that implements the behavior needed to handle the
 * eventualities associated with the behavior of the game itself, by providing the proper WebSocket
 * interface to clients. In particular, it provides events to query the availability of games than the
 * platform has.
 *
 * It colaborates with a specific Logic manager (generalCommunicationBusinessLogicManager) on those mathers
 * related with business logic behavior implementation.
 *
 * THIS HANDLER WILL BE PART OF A REST MICROSERVICE IN THE NEAR FUTURE!!!!!!!!!!!
 */

const logger = require('log4js').getLogger('General Communication Handler')
const ExceptionCatcher = require('../exception/ExceptionCatcher')

class GeneralCommunicationHandlerConfigurator {
  constructor (io, businessLogicManagersHolder) {
    this.createdOn = new Date()
    this.generalCommunicationBusinessLogicManager = businessLogicManagersHolder.GeneralCommunicationBusinessLogicManager

    io.on(
      'connection',
      socket => this.configureSocketUponConnection(socket, io))
  }

  configureSocketUponConnection (socket) {
    logger.info(`Starting configuration of socket (#${socket.id})...`)

    let exceptionCatcher = new ExceptionCatcher(errorObject => socket.emit('appException', errorObject))

    socket.on(
      'getAvailableGames',
      data => exceptionCatcher.runProtected(() => socket.emit('receiveAvailableGames', this.retrieveAvailableGamesDescription(data.user.id))))

    logger.info(`Configuration of socket (#${socket.id}) finished`)
  }

  retrieveAvailableGamesDescription (userId) {
    logger.debug('searching game definitions...')

    let games = this.generalCommunicationBusinessLogicManager.getAvailableGamesDescriptionFor(userId)

    logger.debug(`games calculated:${JSON.stringify(games)}`)
    return games
  }
}

module.exports = GeneralCommunicationHandlerConfigurator

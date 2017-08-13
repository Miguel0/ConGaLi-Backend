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

const logger = require('log4js').getLogger('User Session Handler Configurator')
const AppException = require('../exception/AppException')
const ExceptionCatcher = require('../exception/ExceptionCatcher')

class UserHandlerConfigurator {
  constructor (io, gameHandlerConfigurator, BusinessLogicManagersHolder) {
    this.createdOn = new Date()
    this.openSessions = {}
    this.userBusinessLogicManager = BusinessLogicManagersHolder.UserBusinessLogicManager
    this.gameHandlerConfigurator = gameHandlerConfigurator

    io.on(
      'connection',
      socket => this.configureSocketUponConnection(socket, io))
  }

  configureSocketUponConnection (socket, io) {
    logger.info(`Starting configuration of socket (#${socket.id})...`)

    let exceptionCatcher = new ExceptionCatcher(errorObject => socket.emit('appException', errorObject))

    socket.on(
      'signUp',
      data => exceptionCatcher.runProtected(() => this.signUp(data, socket)))

    socket.on(
      'logIn',
      data => exceptionCatcher.runProtected(() => this.logIn(data, socket)))

    socket.on(
      'logOut',
      data => exceptionCatcher.runProtected(() => this.logOut(data, socket)))

    // TODO add a disconnection handler
    logger.info(`Configuration of socket (#${socket.id}) finished`)
  }

  signUp (data, socket) {
    logger.debug(`Starting signUp process with data: ${JSON.stringify(data)}...`)
    let userSession = this.getActiveSesion(data.user.id)

    if (!userSession) {
      let user = this.userBusinessLogicManager.createUser(data)
      logger.debug(`Active session not found for userId (#${user.id})`)

      this.openSessions[user.id] = { userId: user.id }

      logger.debug(`Sending signUp confirmation signal to client with data: ${JSON.stringify(user.toJSONObject())}...`)
      socket.emit('signedUp', user.toJSONObject())
    } else {
      let exception = new AppException(
        'error.session.signUp.alreadyStarted.title',
        'error.session.signUp.alreadyStarted.body'
      )

      logger.debug(`Sending exception to client since session was already started ${JSON.stringify(exception)}...`)
      socket.emit('appException', exception)
    }
  }

  logIn (data, socket) {
    logger.debug(`Starting logIn process with data: ${JSON.stringify(data)}...`)
    let user = this.userBusinessLogicManager.getUserByName(data.user)
    logger.debug(`User retrieved! ${JSON.stringify(user)}`)

    if (user && user.password === data.password) {
      logger.debug(`Existing sessions: ${JSON.stringify(this.openSessions)}`)
      if (!this.getActiveSesion(user.id)) {
        logger.debug(`Active session not found for userId (#${user.id})`)

        this.openSessions[user.id] = { userId: user.id }

        logger.debug(`Sending logIn confirmation signal to client with data: ${JSON.stringify(user.toJSONObject())}...`)
        socket.emit('loggedIn', user.toJSONObject())
      } else {
        let exception = new AppException(
          'error.session.logIn.alreadyOpen.title',
          'error.session.logIn.alreadyOpen.body'
        )

        logger.debug(`Sending exception to client since session was already open ${JSON.stringify(exception)}...`)
        socket.emit('appException', exception)
      }
    } else {
      let exception = new AppException(
        'error.session.logIn.wrongUserOrPassword.title',
        'error.session.logIn.wrongUserOrPassword.body',
        data
      )

      logger.debug(`Sending exception to client since data had wrong user or password ${JSON.stringify(exception)}...`)
      socket.emit('appException', exception)
    }
  }

  logOut (data, socket) {
    logger.debug(`Starting logOut process with data: ${JSON.stringify(data)}...`)
    let userSession = this.getActiveSesion(data.user.id)

    if (userSession) {
      logger.debug(`User session retrieved! ${JSON.stringify(userSession)}`)
      delete this.openSessions[userSession.userId]

      this.gameHandlerConfigurator.releaseResourcesFor(socket, data)

      logger.debug(`Sending logged out signal to client...`)
      socket.emit('loggedOut')
    } else {
      socket.emit(
        'appException',
        new AppException(
          'error.session.alreadyClosed.title',
          'error.session.alreadyClosed.body'
        )
      )
    }
  }

  getActiveSesion (userId) {
    return this.openSessions[userId]
  }
}

module.exports = UserHandlerConfigurator

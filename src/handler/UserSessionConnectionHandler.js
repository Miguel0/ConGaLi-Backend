const logger = require('log4js').getLogger('User Session Handler Configurator')
const AppException = require('../exception/AppException')

class UserHandlerConfigurator {
  constructor (io, BusinessLogicManagersHolder) {
    this.createdOn = new Date()
    this.openSessions = {}
    this.userBusinessLogicManager = BusinessLogicManagersHolder.UserBusinessLogicManager

    io.on(
      'connection',
      socket => this.configureSocketUponConnection(socket, io))
  }

  configureSocketUponConnection (socket, io) {
    logger.info(`Starting configuration of socket (#${socket.id})...`)

    socket.on(
      'signUp',
      data => this.signUp(data, socket))

    socket.on(
      'logIn',
      data => this.logIn(data, socket))

    socket.on(
      'logOut',
      data => this.logOut(data, socket))

    // TODO add a disconnection handler
    logger.info(`Configuration of socket (#${socket.id}) finished`)
  }

  signUp (data, socket) {
    logger.debug(`Starting signUp process with data: ${JSON.stringify(data)}...`)
    let userSession = this.getActiveSesion(socket)

    if (!userSession) {
      logger.debug(`Active session not found for socket (#${socket.id})`)

      let user = this.userBusinessLogicManager.createUser(data)
      this.openSessions[socket.id] = { userId: user.id }

      logger.debug(`Sending signUp confirmation signal to client with data: ${JSON.stringify(user)}...`)
      socket.emit('signedUp', user)
    } else {
      let exception = new AppException(
        'error.signUp.session.alreadyStarted.title',
        'error.signUp.session.alreadyStarted.body'
      )

      logger.debug(`Sending exception to client since session was already started ${JSON.stringify(exception)}...`)
      socket.emit('appException', exception)
    }
  }

  logIn (data, socket) {
    logger.debug(`Starting logIn process with data: ${JSON.stringify(data)}...`)
    let userSession = this.getActiveSesion(socket)

    if (!userSession) {
      logger.debug(`Active session not found for socket (#${socket.id})`)
      let user = this.userBusinessLogicManager.getUserByName(data.user)

      if (user && user.password === data.password) {
        this.openSessions[socket.id] = { userId: user.id }

        logger.debug(`Sending logIn confirmation signal to client with data: ${JSON.stringify(user)}...`)
        socket.emit('loggedIn', user)
      } else {
        let exception = new AppException(
          'error.logIn.session.wrongUserOrPassword.title',
          'error.logIn.session.wrongUserOrPassword.body',
          data
        )

        logger.debug(`Sending exception to client since data had wrong user or password ${JSON.stringify(exception)}...`)
        socket.emit('appException', exception)
      }
    } else {
      let exception = new AppException(
        'error.logIn.session.alreadyOpen.title',
        'error.logIn.session.alreadyOpen.body'
      )

      logger.debug(`Sending exception to client since session was already open ${JSON.stringify(exception)}...`)
      socket.emit('appException', exception)
    }
  }

  logOut (data, socket) {
    let userSession = this.getActiveSesion(socket)

    if (userSession) {
      delete this.openSessions[socket.id]

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

  getActiveSesion (socket) {
    return this.openSessions[socket.id]
  }
}

module.exports = UserHandlerConfigurator

const logger = require('log4js').getLogger('Connection Handler')
const ExceptionCatcher = require('../exception/ExceptionCatcher')
const config = require('../../config/config.dev')

class ConnectionHandlerConfigurator {
  constructor (io, businessLogicManagersHolder) {
    this.createdOn = new Date()
    this.socketsConnected = {}

    io.on(
      'connection',
      socket => this.configureSocketUponConnection(socket, io))
  }

  getSocketIp (socket) {
    return socket.request.connection.remoteAddress
  }

  getSocketConnectionIdentifier (socket) {
    if (!config.handler.connection.useSocketByIp) {
      return socket.id
    } else {
      return this.getSocketIp(socket)
    }
  }

  onDisconnection (socket, close) {
    let socketId = this.getSocketConnectionIdentifier(socket)
    let deleteOpTimeoutCreationDate = new Date()
    let clientIP = this.getSocketIp(socket)

    setTimeout(
      () => {
        // TODO handle exceptions to avoid memory leaks
        logger.debug(`Trying to remove data for socket id #${socketId} @ ${clientIP}`)

        let socketData = this.socketsConnected[socketId]
        if (socketData && deleteOpTimeoutCreationDate > socketData.lastConnectedOn) {
          // TODO RELEASE ASSOCIATED RESOURCES

          delete this.socketsConnected[socketId]
          logger.debug(`Socket data #${JSON.stringify(socketData.toString())} removed!!!!`)
        }
      },
      config.handler.connection.deletingSocketDataInterval)

    logger.debug(`Socket with id #${socket.id} disconnected  @ ${clientIP}!!!!`)
  }

  configureSocketUponConnection (socket, io) {

    let exceptionCatcher = new ExceptionCatcher( errorObject => socket.emit('appException', errorObject))

    socket.on('disconnect', close => exceptionCatcher.runProtected(() => this.onDisconnection(socket, close)))

    let socketConnectionData = this.socketsConnected[this.getSocketConnectionIdentifier(socket)]
    let actualDate = new Date()

    if (!socketConnectionData) {
      socketConnectionData = {
        socketId: socket.id,
        createdOn: actualDate,
        lastConnectedOn: actualDate
      }

      this.socketsConnected[this.getSocketConnectionIdentifier(socket)] = socketConnectionData
    } else {
      socketConnectionData = actualDate
    }

    logger.debug(`Socket with id #${socketConnectionData.socketId} @ ${this.getSocketIp(socket)} connected`)
  }
}

module.exports = ConnectionHandlerConfigurator

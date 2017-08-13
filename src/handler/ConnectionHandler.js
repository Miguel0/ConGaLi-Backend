/**
 * ConnectionHandlerConfigurator it's a class that implements the behavior needed to handle the
 * eventualities that could arise during the life span of the system.
 *
 * It's reponsible of maintaining in sync the data of the sockets connected to the system, and
 * cleaning up upon client's socket desconnection.
 */

const logger = require('log4js').getLogger('Connection Handler')
const ExceptionCatcher = require('../exception/ExceptionCatcher')

class ConnectionHandlerConfigurator {
  constructor (io, config, businessLogicManagersHolder) {
    this.createdOn = new Date()
    this.socketsConnected = {}
    this.config = config
    io.on(
      'connection',
      socket => this.configureSocketUponConnection(socket, io))
  }

  getSocketIp (socket) {
    return socket.request.connection.remoteAddress
  }

  getSocketConnectionIdentifier (socket) {
    if (!this.config.handler.connection.useSocketByIp) {
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
          delete this.socketsConnected[socketId]
          logger.debug(`Socket data #${JSON.stringify(socketData.toString())} removed!!!!`)
        }
      },
      this.config.handler.connection.deletingSocketDataInterval)

    logger.debug(`Socket with id #${socket.id} disconnected  @ ${clientIP}!!!!`)
  }

  configureSocketUponConnection (socket, io) {
    let exceptionCatcher = new ExceptionCatcher(errorObject => socket.emit('appException', errorObject))

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

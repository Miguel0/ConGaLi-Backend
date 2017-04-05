const logger = require('log4js').getLogger('Connection Handler')
const deletingSocketDataInterval = 10000
const useSocketByIp = false

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
    if (!useSocketByIp) {
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
        logger.debug(`Trying to remove data for socket id #${socketId} @ ${clientIP} being ${new Date().toISOString()}!!!!`)

        let socketData = this.socketsConnected[socketId]
        if (socketData && deleteOpTimeoutCreationDate > socketData.lastConnectedOn) {
          // TODO RELEASE ASSOCIATED RESOURCES

          delete this.socketsConnected[socketId]
          logger.debug(`Socket data #${JSON.stringify(socketData.toString())} removed at ${new Date().toISOString()}!!!!`)
        }
      },
      deletingSocketDataInterval)

    logger.debug(`Socket with id #${socket.id} disconnected  @ ${clientIP} being ${deleteOpTimeoutCreationDate.toISOString()}!!!!`)
  }

  configureSocketUponConnection (socket, io) {
    socket.on('disconnect', close => this.onDisconnection(socket, close))

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

    logger.debug(`Socket with id #${socketConnectionData.socketId} @ ${this.getSocketIp(socket)} connected being ${new Date().toISOString()}!!!!`)
  }
}

module.exports = ConnectionHandlerConfigurator

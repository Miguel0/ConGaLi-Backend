const GameHandlerConfigurator = require('./conwaysGameHandlerConfigurator.js')
const deletingSocketDataInterval = 10000
const useSocketByIp = false

class ConnectionHandlerConfigurator {
  constructor (io, storageHandler) {
    this.createOn = new Date()
    this.socketsConnected = {}

    io.on('connection', socket => this.onConnection(socket, io, storageHandler))
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
        console.log(`Trying to remove data for socket id #${socketId} @ ${clientIP} being ${new Date().toISOString()}!!!!`)

        let socketData = this.socketsConnected[socketId]
        if (socketData && deleteOpTimeoutCreationDate > socketData.lastConnectedOn) {
          // Releasing resources
          socketData.gameHandler.release()

          delete this.socketsConnected[socketId]
          console.log(`Socket data #${JSON.stringify(socketData)} removed at ${new Date().toISOString()}!!!!`)
        }
      },
      deletingSocketDataInterval)

    console.log(`Socket with id #${socket.id} disconnected  @ ${clientIP} being ${deleteOpTimeoutCreationDate.toISOString()}!!!!`)
  }

  onConnection (socket, io, storageHandler) {
    socket.on('disconnect', close => this.onDisconnection(socket, close))

    let socketConnectionData = this.socketsConnected[this.getSocketConnectionIdentifier(socket)]
    let actualDate = new Date()

    if (!socketConnectionData) {
      socketConnectionData = {
        socketId: socket.id,
        createdOn: actualDate,
        lastConnectedOn: actualDate,
        gameHandler: new GameHandlerConfigurator(io, storageHandler, socket)
      }

      this.socketsConnected[this.getSocketConnectionIdentifier(socket)] = socketConnectionData
    } else {
      socketConnectionData = actualDate
    }

    console.log(`Socket with id #${socketConnectionData.socketId} @ ${this.getSocketIp(socket)} connected being ${new Date().toISOString()}!!!!`)
  }
}

module.exports = ConnectionHandlerConfigurator

const ConwaysGame = require('../model/ConwaysGame.js')

class ConwaysGameHandlerConfigurator {
  constructor (io, storageHandler, socket) {
    this.game = null
    this.gameTickHandler = []

    socket.on('createGame', data => this.createGame(data, socket, io))
    socket.on('startGame', data => this.startGame(data, io, socket))
    socket.on('forceEnd', this.forceStopGame)
  }

  checkValidRoomForUser (roomId, socket) {
    // TODO see how to check using something like (socket.rooms.indexOf(data.boardId) > -1)
    return true
  }

  startGame (data, io, socket) {
    this.checkValidRoomForUser(data.boardId, socket)

    console.log(`${new Date().toISOString()} starting game for board ${data.boardId}`)

    for (let i = 0; i < this.game.boards.length; i++) {
      this.gameTickHandler[i] = setInterval(
        () => {
          this.game.refreshBoard(data.boardId)
          let jsonData = this.game.toJSONObject()
          console.log(`${new Date().toISOString()} sending data table to client: ${JSON.stringify(jsonData)}`)

          io.to(this.game.name).emit('refreshBoard', jsonData)
        },
        this.game.refreshInterval)
    }

    console.log(`${new Date().toISOString()} game started for board ${data.boardId}`)
  }

  release () {
    this.forceStopGame()
  }

  forceStopGame (data) {
    if (this.game) {
      for (let i = 0; i < this.game.boards.length; i++) {
        clearInterval(this.gameTickHandler[i])
      }
    }
  }

  addUser (socketId, userData) {
    this.game.addUser(socketId, userData)
  }

  removeUser () {
  }

  updateUser () {
  }

  updateConfiguration () {
  }

  createCell (cellCreationData, socket) {
    console.log('creating cell with ' + JSON.stringify(cellCreationData))
    this.game.createCellBy(0, cellCreationData)
  }

  killCell (data) {
    this.game.boards[0].KillCellBy(data.user, data.x, data.y)
  }

  createGame (data, socket, io) {
    this.game = new ConwaysGame()
    this.game.name = data.gameName

    if (data.refreshInterval) {
      this.game.refreshInterval = parseInt(data.refreshInterval)
    }

    this.addUser(socket.id, data.userData)

    socket.join(this.game.name, () => {
      io.to(this.game.name).on('updateConfiguration', this.updateConfiguration)
      io.to(this.game.name).on('addUser', this.addUser)
      io.to(this.game.name).on('removeUser', this.removeUser)
      io.to(this.game.name).on('updateUser', this.updateUser)
      io.to(this.game.name).on('createCell', this.createCell)
      io.to(this.game.name).on('killCell', this.killCell)

      console.log(`Game successfully created with data: ${JSON.stringify(data)}`)

      io.to(socket.id).emit('gameCreated', data)
    })

    socket.on(
      'createCell',
      data => {
        console.log(`Query: ${socket.handshake.query}`)
        this.createCell(data, socket)
      }
    )
  }
}

module.exports = ConwaysGameHandlerConfigurator

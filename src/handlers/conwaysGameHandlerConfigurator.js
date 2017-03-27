const Promise = require('bluebird')
const ConwaysGame = require('../model/ConwaysGame.js')
const AppException = require('../exception/AppException')
const ExceptionCatcher = require('../utils/ExceptionCatcher')

class ConwaysGameHandlerConfigurator {
  constructor (io, storageHandler, socket) {
    this.game = null
    this.gameTickHandler = []
    this.exceptionCatcher = new ExceptionCatcher(socket, io)

    socket.on('createGame', data => this.createGame(data, socket, io))
    socket.on('startGame', data => this.startGame(data, io, socket))
    socket.on('getTemplateCellsOptions', () => this.sendTemplateCellsOptionsToSocket(io, socket))
    socket.on('forceEnd', this.forceStopGame)
  }

  checkValidRoomForUser (roomId, socket) {
    // TODO see how to check using something like (socket.rooms.indexOf(data.cellsGridId) > -1)
    return true
  }

  startGame (data, io, socket) {
    this.checkValidRoomForUser(data.cellsGridId, socket)

    console.log(`${new Date().toISOString()} starting game for board ${data.cellsGridId}`)

    for (let i = 0; i < this.game.cellsGrids.length; i++) {
      this.gameTickHandler[i] = setInterval(
        () => {
          this.game.refreshCellsGrid(data.cellsGridId)
          let jsonData = this.game.toJSONObject()
          console.log(`${new Date().toISOString()} sending data table to client: ${JSON.stringify(jsonData)}`)

          io.to(this.game.name).emit('refreshCellsGrid', jsonData)
        },
        this.game.refreshInterval)
    }

    console.log(`${new Date().toISOString()} game started for board ${data.cellsGridId}`)
  }

  release () {
    this.forceStopGame()
  }

  forceStopGame (data) {
    if (this.game) {
      for (let i = 0; i < this.game.cellsGrids.length; i++) {
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

  createCell (cellCreationData, socket, gameChannel) {
    console.log('creating cell with ' + JSON.stringify(cellCreationData))

    this.game.createCellsByAsync(socket.id, 0, [cellCreationData])
      .then( function (done) {
        let jsonData = this.game.toJSONObject()
        console.log(`${new Date().toISOString()} sending data table to client: ${JSON.stringify(jsonData)}`)

        gameChannel.emit('refreshCellsGrid', jsonData)
        done()
      })
      .catch(e => this.exceptionCatcher.dealWithException(e))
  }

  createTemplate (templateCreationData, socket, gameChannel) {
    console.log('creating template with ' + JSON.stringify(templateCreationData))

    this.game.createCellsOfTemplateByAsync(socket.id, 0, templateCreationData)
      .then( () => {
        let jsonData = this.game.toJSONObject()
        console.log(`${new Date().toISOString()} sending data table to client: ${JSON.stringify(jsonData)}`)

        gameChannel.emit('refreshCellsGrid', jsonData)
      })
      .catch(this.exceptionCatcher.dealWithException.bind(this.exceptionCatcher))
  }

  killCell (data) {
    this.game.cellsGrids[0].killCellBy(data.user, data.x, data.y)
  }

  sendTemplateCellsOptionsToSocket (io, socket) {
    io.to(socket.id).emit('setTemplateCellsOptions', this.game.getPresetsConfiguration())
  }

  createGame (data, socket, io) {
    this.exceptionCatcher.gameName = data.gameName

    this.game = Promise.promisifyAll(new ConwaysGame())
    this.game.name = data.gameName

    if (data.refreshInterval) {
      this.game.refreshInterval = parseInt(data.refreshInterval)
    }

    this.addUser(socket.id, data.userData)

    socket.join(this.game.name, () => {
      let gameChannel = io.to(this.game.name)
      gameChannel.on('updateConfiguration', this.updateConfiguration)
      gameChannel.on('addUser', this.addUser)
      gameChannel.on('removeUser', this.removeUser)
      gameChannel.on('updateUser', this.updateUser)
      gameChannel.on('createCell', data => this.createCell(data, socket, gameChannel))
      gameChannel.on('createTemplate', data => this.createTemplate(data, socket, gameChannel))
      gameChannel.on('killCell', this.killCell)

      console.log(`Game successfully created with data: ${JSON.stringify(data)}`)

      io.to(socket.id).emit('gameCreated', data)
      this.sendTemplateCellsOptionsToSocket(io, socket)
    })

    socket.on(
      'createCell',
      data => {
        console.log(`Query: ${JSON.stringify(socket.handshake.query)}`)
        this.createCell(data, socket)
      }
    )
  }
}

module.exports = ConwaysGameHandlerConfigurator

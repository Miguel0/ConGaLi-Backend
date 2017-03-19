const Exception = require('../utils/Exception')
const ConwaysGame = require('../model/ConwaysGame.js')

class ConwaysGameHandlerConfigurator {

    startGame(client, boardId, io, socket) {

        for (let i = 0; i < this.game.boards.length; i++) {
            this.gameTickHandler[i] = setInterval(
                () => {
                    io.of(this.game.name).broadcast.emit('refreshBoard', this.game.refreshBoard(boardId).toJSONObject())
                },
                this.game.refreshInterval)
        }

        socket.on('forceEnd', forceStopGame)
    }

    forceStopGame(boardId) {
        for (let i = 0; i < this.game.boards.length; i++) {
            clearInterval(this.gameTickHandler[i])
        }
    }

    addUser(socketId, userData) {
        this.game.addUser(socketId, userData)
    }

    removeUser() {
        
    }

    updateUser() {
        
    }

    updateConfiguration() {
        
    }

    createCell(data) {
        this.game.boards[0].createCellBy(data.user, data.x, data.y)
    }

    killCell() {
        this.game.boards[0].KillCellBy(data.user, data.x, data.y)
    }

    createBoard(socket, io) {
        this.game.createBoard()

        socket.to(this.game.name).on('updateUser', this.updateUser)
        socket.to(this.game.name).on('createCell', this.createCell)
        socket.to(this.game.name).on('killCell', this.killCell)
    }

    createGame(data, socket, io) {
        this.game = new ConwaysGame()
        this.game.name = data.gameName
        this.createBoard(socket, io)
        this.addUser(socket.id, data.userData)

        socket.join(
            this.game.name,
            () => {
                socket.to(this.game.name).on('startGame', () => this.startGame(client, boardId, io, socket))
                socket.to(this.game.name).on('updateConfiguratthis.ion', this.updateConfiguration)
                socket.to(this.game.name).on('addUser', this.addUser)
                socket.to(this.game.name).on('removeUser', this.removeUser)
                socket.to(this.game.name).on('updateUser', this.updateUser)
            }
        )

        console.log(`Game successfully created with data: ${JSON.stringify(data)}`)
    }

    constructor( io, storageHandler, socket ) {
        this.game = null
        this.gameTickHandler = []

        socket.on('createGame', data => this.createGame(data, socket, io))
    }
}

module.exports = ConwaysGameHandlerConfigurator
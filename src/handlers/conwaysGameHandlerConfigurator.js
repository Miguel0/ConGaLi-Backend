const Exception = require('../exception/Exception')
const ConwaysGame = require('../model/ConwaysGame.js')

class ConwaysGameHandlerConfigurator {

    constructor( io, storageHandler, socket ) {
        this.game = null
        this.gameTickHandler = []

        socket.on('createGame', data => this.createGame(data, socket, io))
        socket.on('startGame', (data) => this.startGame(data, io, socket))
        socket.on('forceEnd', this.forceStopGame)
    }

    checkValidRoomForUser(roomId, socket) {
        // TODO see how to check using something like (socket.rooms.indexOf(data.boardId) > -1)
        return true
    }

    startGame(data, io, socket) {
        this.checkValidRoomForUser(data.boardId, socket)

        console.log(`starting game for board ${data.boardId}`)

        for (let i = 0; i < this.game.boards.length; i++) {
            this.gameTickHandler[i] = setInterval(
                () => {
                    console.log(`tick at: ${new Date().toISOString()}`)
                    this.game.refreshBoard(data.boardId)

                    io.to(this.game.name).emit('refreshBoard', this.game.toJSONObject())
                },
                this.game.refreshInterval)
        }
    }

    release() {
        this.forceStopGame()
    }

    forceStopGame(data) {
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

    killCell(data) {
        this.game.boards[0].KillCellBy(data.user, data.x, data.y)
    }

    createGame(data, socket, io) {
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
    }
}

module.exports = ConwaysGameHandlerConfigurator
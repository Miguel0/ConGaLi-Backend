const Exception = require('../utils/Exception')
const ConwaysGame = require('../model/ConwaysGame.js')

function ConwaysGameHandlerConfigurator ( io, storageHandler, socket ) {
    let self = this
    this.game = null
    this.gameTickHandler = []

    socket.on('createGame', (data) => self.createGame.apply(data, socket, io))
}

ConwaysGameHandlerConfigurator.prototype.startGame = function (client, boardId, io, socket) {
    let self = this

    for (let i = 0; i < this.game.boards.length; i++) {
        this.gameTickHandler[i] = setInterval(
            () => {
                io.of(self.game.name).broadcast.emit('refreshBoard', self.game.refreshBoard(boardId).toJSONObject())
            },
            this.game.refreshInterval)
    }

    socket.on('forceEnd', forceStopGame)
}

ConwaysGameHandlerConfigurator.prototype.forceStopGame = function (boardId) {
    for (let i = 0; i < this.game.boards.length; i++) {
        clearInterval(this.gameTickHandler[i])
    }
}

ConwaysGameHandlerConfigurator.prototype.addUser = function (socketId, userData) {
    if (userData && !this.game.boards[0].users[socketId]) {
        if (this.game.boards[0].users.find( user => user.id === socketId || user.name === userData.name)) {
            throw new Exception(
                'error.game.userAlreadyExists.title',
                'error.game.userAlreadyExists.body',
                userData
            )
        }

        this.game.boards[0].users[socketId] = {
            id: this.socketId,
            name: userData.name,
            color: userData.color
        }
    }
}

ConwaysGameHandlerConfigurator.prototype.removeUser = function () {
    
}

ConwaysGameHandlerConfigurator.prototype.updateUser = function () {
    
}

ConwaysGameHandlerConfigurator.prototype.updateConfiguration = function () {
    
}

ConwaysGameHandlerConfigurator.prototype.createCell = function (data) {
    this.game.boards[0].createCellBy(data.user, data.x, data.y)
}

ConwaysGameHandlerConfigurator.prototype.killCell = function () {
    this.game.boards[0].KillCellBy(data.user, data.x, data.y)
}

ConwaysGameHandlerConfigurator.prototype.createGame = function (data, socket, io) {
    let self = this

    this.game = new ConwaysGame()
    this.game.name = data.gameName
    this.addUser(socket.id, data.userData)
    this.createBoard(socket, io)

    socket.join(
        this.game.name,
        () => {
            socket.to(self.game.name).on('startGame', () => self.startGame(client, boardId, io, socket))
            socket.to(self.game.name).on('updateConfiguratthis.ion', self.updateConfiguration)
            socket.to(self.game.name).on('addUser', self.addUser)
            socket.to(self.game.name).on('removeUser', self.removeUser)
            socket.to(self.game.name).on('updateUser', self.updateUser)
        }
    );

    console.log(`Game successfully created with data: ${data}`)
}

ConwaysGameHandlerConfigurator.prototype.createBoard = function (socket, io) {
    this.game.createBoard()

    socket.to(this.game.name).on('updateUser', this.updateUser)
    socket.to(this.game.name).on('createCell', this.createCell)
    socket.to(this.game.name).on('killCell', this.killCell)
}

module.exports = ConwaysGameHandlerConfigurator
const Exception = require('../utils/Exception')
const ConwaysGame = require('../model/ConwaysGame.js')

function ConwaysGameHandlerConfigurator ( io, storageHandler, socket ) {
    this.game = null
    this.users = {}
    this.gameTickHandler = []
    this.nameSpace = null

    function startGame(client, boardId) {
        for (let i = 0; i < this.game.boards.length; i++) {
            this.gameTickHandler[i] = setInterval(
                () => {
                    this.nameSpace.broadcast.emit('refreshBoard', this.game.refreshBoard(boardId).toJSONObject())
                },
                this.game.refreshInterval)
        }

        this.nameSpace.on('forceEnd', forceStopGame)
    }

    function forceStopGame(boardId) {
        for (let i = 0; i < this.game.boards.length; i++) {
            clearInterval(this.gameTickHandler[i])
        }
    }

    function addUser(socketId, userData) {
        if (userData && !users[socketId]) {
            if (users.find( user => user.id === socketId || user.name === userData.name)) {
                throw new Exception(
                    'error.game.userAlreadyExists.title',
                    'error.game.userAlreadyExists.body',
                    userData
                )
            }

            users[socketId] = {
                id: socketId,
                name: userData.name,
                color: userData.color
            }
        }
    }

    function removeUser() {
        
    }

    function updateUser() {
        
    }

    function updateConfiguration() {
        
    }

    function createCell(data) {
        this.board.createCellBy(data.user, data.x, data.y)
    }

    function killCell() {
        this.board.KillCellBy(data.user, data.x, data.y)
    }

    function createGame(data) {
        this.game = new ConwaysGame()
        this.game.name = data.gameName
        this.addUser(socket.id, data.userData)

        socket.join(
            this.game.name,
            () => {
                socket.to(this.game.name).on('startGame', startGame)
                socket.to(this.game.name).on('updateConfiguration', updateConfiguration)
                socket.to(this.game.name).on('addUser', addUser)
                socket.to(this.game.name).on('removeUser', removeUser)
                socket.to(this.game.name).on('updateUser', updateUser)
            }
        );

        console.log(`Game successfully created with data: ${data}`)
    }

    function createBoard(data) {
        this.board = this.game.createBoard()

        socket.to(this.game.name).on('updateUser', updateUser)
        socket.to(this.game.name).on('createCell', createCell)
        socket.to(this.game.name).on('killCell', killCell)
    }

    socket.on('createGame', createGame)
}

module.exports = ConwaysGameHandlerConfigurator
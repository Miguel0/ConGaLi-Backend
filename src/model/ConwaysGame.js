const Board = require('./Board')

class ConwaysGame {

    constructor() {
        this.createdOn = new Date()
        this.name = null
        this.refreshInterval = 1000
        this.boards = []
        this.users = {}

        this.createBoard()
    }

    addUser(userId, userData) {
        if (userData && this.boards[0].users[userId]) {
            if (this.boards[0].users.find( user => user.id === userId || user.name === userData.name)) {
                throw new Exception(
                    'error.game.userAlreadyExists.title',
                    'error.game.userAlreadyExists.body',
                    userData
                )
            }

            this.boards[0].users[userId] = {
                id: userId,
                name: userData.name,
                color: userData.color
            }
        }
    }
    
    createCellBy(user, x, y) {
        this.addCell(new ContextUnawareCell(), x, y)
    }

    killCellBy(user, x, y) {
        this.removeCell(x, y)
    }

    createBoard() {
        this.boards.push(new Board())
    }

    refreshBoard(boardId) {
        this.boards[boardId].stablishCellsNewGeneration()
    }

    toJSONObject() {
        let json = {}
        json.createdOn = this.createdOn.toISOString()
        json.name = this.name
        json.boards = []

        for (var i = 0; i < this.boards.length; i++) {
            json.boards[i] = this.boards[i].toJSONObject()
        }

        return json
    }
}

module.exports = ConwaysGame
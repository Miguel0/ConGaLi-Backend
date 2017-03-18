const Board = require('./Board')

function ConwaysGame () {
    this.createdOn = new Date()
    this.name = null
    this.refreshInterval = 1000
    this.boards = []
    this.users = {}
}

ConwaysGame.prototype.createCellBy = function (user, x, y) {
    this.addCell(new ContextUnawareCell(), x, y)
}

ConwaysGame.prototype.killCellBy = function (user, x, y) {
    this.removeCell(x, y)
}

ConwaysGame.prototype.toJSONObject = function () {
    let json = {}
    json.createdOn = this.createdOn.toISOString()
    json.name = this.name
    json.boards = []

    for (var i = 0; i < this.boards.length; i++) {
        json.boards[i] = this.boards[i].toJSONObject()
    }

    return json
}

module.exports = ConwaysGame
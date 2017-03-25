const CellsGrid = require('./CellsGrid')
const AppException = require('../exception/AppException')

class ConwaysGame {
  constructor () {
    this.createdOn = new Date()
    this.name = null
    this.refreshInterval = 1000
    this.cellsGrids = []
    this.users = {}

    this.createCellsGrid()
  }

  addUser (userId, userData) {
    if (this.users[userId]) {
      throw new AppException(
        'error.game.userAlreadyExists.title',
        'error.game.userAlreadyExists.body',
        userData
      )
    }

    this.users[userId] = {
      id: userId,
      name: userData.name,
      color: userData.color
    }
  }

  createCellBy (userId, cellsGridId, data) {
    this.cellsGrids[cellsGridId].createCellBy(this.users[userId], data.x, data.y)
  }

  killCellBy (user, x, y) {
    this.removeCell(x, y)
  }

  createCellsGrid () {
    this.cellsGrids.push(new CellsGrid())
  }

  refreshCellsGrid (cellsGridId) {
    this.cellsGrids[cellsGridId].stablishCellsNewGeneration()
  }

  toJSONObject () {
    let json = {}
    json.createdOn = this.createdOn.toISOString()
    json.name = this.name
    json.cellsGrids = []

    for (let i = 0; i < this.cellsGrids.length; i++) {
      json.cellsGrids[i] = this.cellsGrids[i].toJSONObject()
    }

    return json
  }
}

module.exports = ConwaysGame

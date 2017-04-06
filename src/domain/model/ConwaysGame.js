const CellsGrid = require('./CellsGrid')
const AppException = require('../../exception/AppException')

class ConwaysGame {
  constructor (ownerUserId) {
    this.createdOn = new Date()
    this.ownerSocketId = ownerUserId
    this.name = null
    this.refreshInterval = 1000
    this.cellsGrids = []
    this.users = {}
    this.presetConfigurations = []

    this.createCellsGrid()
  }

  retrieveUserWithId (userId) {
    return this.users[userId]
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

  createCellsBy (userId, cellsGridId, rawPoints, done) {
    this.cellsGrids[cellsGridId].addCellsBy(this.users[userId], rawPoints)
    return done()
  }

  createCellsOfTemplateBy (userId, cellsGridId, templateCreationData, done) {
    let templateGroups = this.getPresetsConfiguration()
    let template

    for (let i = 0; i < templateGroups.length; i++) {
      let group = templateGroups[i]

      template = group.cellsTemplates.find(template => template.name === templateCreationData.name)

      if (template) {
        break
      }
    }

    if (template) {
      let resolution = this.cellsGrids[cellsGridId].resolution

      let offsettedPoints = template.points.map(point => {
        return {
          x: templateCreationData.position.x + (resolution * point.x),
          y: templateCreationData.position.y + (resolution * point.y)
        }
      })

      console.log(`Offsetting points from ${JSON.stringify(template.points)} to ${JSON.stringify(offsettedPoints)}`)

      return this.createCellsBy(userId, 0, offsettedPoints, done)
    } else {
      return done(new AppException(
        'error.gridTemplate.wrongCellsTemplate.title',
        'error.gridTemplate.wrongCellsTemplate.body'
      ))
    }
  }

  getRoomId () {
    return `${this.name}@${this.ownerUserId}`
  }

  killCellBy (user, points) {
    for (let i = 0; i < points.length; i++) {
      this.removeCell(points[i].x, points[i].y)
    }
  }

  createCellsGrid () {
    this.cellsGrids.push(new CellsGrid())
  }

  forEachCellsGrid (aFunction) {
    for (let i = 0; i < this.cellsGrids.length; i++) {
      aFunction.call(aFunction, this.cellsGrids[i])
    }
  }

  refreshCellsGrids () {
    this.forEachCellsGrid(cellsGrid => cellsGrid.stablishCellsNewGeneration())
  }

  getPresetConfigurations () {
    return this.presetConfigurations
  }

  getDescriptiveJSONObject () {
    let json = {}
    json.createdOn = this.createdOn.toISOString()
    json.name = this.name
    json.ownerSocketId = this.ownerSocketId
    json.users = []

    for (let user in this.users) {
      json.users.push({
        id: user.id,
        name: user.name,
        color: user.color
      })
    }

    return json
  }

  toJSONObject () {
    let json = this.getDescriptiveJSONObject()

    json.cellsGrids = []

    for (let i = 0; i < this.cellsGrids.length; i++) {
      json.cellsGrids.push(this.cellsGrids[i].toJSONObject())
    }

    return json
  }
}

module.exports = ConwaysGame

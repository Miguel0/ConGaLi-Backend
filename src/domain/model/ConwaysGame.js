const CellsGrid = require('./CellsGrid')
const AppException = require('../../exception/AppException')

class ConwaysGame {
  constructor (user) {
    this.createdOn = new Date()
    this.ownerUserId = user.id
    this.name = null
    this.refreshInterval = 1000
    this.cellsGrids = []
    this.users = {}
    this.presetConfigurations = []

    this.addUser(user)
    this.createCellsGrid()
  }

  retrieveUserWithId (userId) {
    return this.users[userId]
  }

  addUser (user) {
    if (this.users[user.id]) {
      throw new AppException(
        'error.game.userAlreadyExists.title',
        'error.game.userAlreadyExists.body',
        user
      )
    }

    this.users[user.id] = user
  }

  createCellsBy (userId, cellsGridId, rawPoints) {
    this.cellsGrids[cellsGridId].addCellsBy(this.users[userId], rawPoints)
  }

  createCellsOfTemplateBy (userId, cellsGridId, templateCreationData) {
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

      return this.createCellsBy(userId, 0, offsettedPoints)
    } else {
      throw new AppException(
        'error.gridTemplate.wrongCellsTemplate.title',
        'error.gridTemplate.wrongCellsTemplate.body'
      )
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
    return this.presetConfigurations.map( templateGroup => templateGroup.toJSONObject())
  }

  getDescriptiveJSONObject () {
    let json = {}
    json.createdOn = this.createdOn.toISOString()
    json.name = this.name
    json.id = this.id
    json.ownerUserId = this.ownerUserId
    json.users = []

    for (let user in this.users) {
      json.users.push( {
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

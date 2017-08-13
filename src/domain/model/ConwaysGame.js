/**
 * ConwaysGame is a Class that represents the game that has an owner, a name
 * and the cellsGrid array and the users besides preset configurations.
 */

const CellsGrid = require('./CellsGrid')
const AppException = require('../../exception/AppException')
const logger = require('log4js').getLogger('Conway\'s Game')

class ConwaysGame {
  constructor (user) {
    this.createdOn = new Date()
    this.ownerId = user.id || null
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
    if (this.containsUserId(user.id)) {
      throw new AppException(
        'error.game.users.userAlreadyExists.title',
        'error.game.users.userAlreadyExists.body',
        user
      )
    }

    this.users[user.id] = user
  }

  removeUserById (userId) {
    if (!this.containsUserId(userId)) {
      throw new AppException(
        'error.game.users.userDoesntExists.title',
        'error.game.users.userDoesntExists.body',
        userId
      )
    }

    delete this.users[userId]

    if (this.ownerId === userId) {
      if (Object.keys(this.users).length > 0) {
        // Hand the game ownership to another player
        this.ownerId = this.users[Object.keys(this.users)[0]]
      } else {
        this.ownerId = null
      }
    }
  }

  containsUserId (userId) {
    return !!this.users[userId]
  }

  hasOwner () {
    return this.ownerId !== null
  }

  createCellsBy (userId, cellsGridId, rawPoints) {
    logger.debug(`Creating cell with data: ${JSON.stringify(rawPoints)}`)
    this.cellsGrids[cellsGridId].addCellsBy(this.users[userId], ...rawPoints)
  }

  createCellsOfTemplateBy (userId, cellsGridId, templateCreationData) {
    let templateGroups = this.getPresetConfigurations()
    let template

    for (let i = 0; i < templateGroups.length; i++) {
      let group = templateGroups[i]

      logger.debug(`Template Group retrieved: ${JSON.stringify(group)}`)
      template = group.templates.find(template => template.name === templateCreationData.name)

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
        'error.game.gridTemplate.wrongCellsTemplate.title',
        'error.game.gridTemplate.wrongCellsTemplate.body',
        templateCreationData
      )
    }
  }

  getRoomId () {
    return `${this.name}@${this.ownerId}`
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
    return this.presetConfigurations.map(templateGroup => templateGroup.toJSONObject())
  }

  getDescriptiveJSONObject () {
    let json = {}
    json.createdOn = this.createdOn.toISOString()
    json.name = this.name
    json.id = this.id
    json.ownerId = this.ownerId
    json.users = {}

    for (let userId in this.users) {
      let user = this.users[userId]

      json.users[user.id] = {
        id: user.id,
        name: user.name,
        color: user.color
      }
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

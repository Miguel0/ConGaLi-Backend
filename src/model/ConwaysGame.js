const CellsGrid = require('./CellsGrid')
const AppException = require('../exception/AppException')
const PRESETS_CONFIGURATIONS = [
  {
    title: 'Still lifes',
    cellsTemplates: [
      {
        name: 'Block',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Game_of_life_block_with_border.svg',
        attribution: 'By None (Own work) [Public domain], via Wikimedia Commons',
        points: [{x: 0, y: 0}, {x: 1, y: 0},
                {x: 0, y: 1}, {x: 1, y: 1}]
      },
      {
        name: 'Beehive',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Game_of_life_beehive.svg',
        attribution: 'By None (Own work) [Public domain], via Wikimedia Commons',
        points: [{x: 1, y: 0}, {x: 2, y: 0},
                {x: 0, y: 1}, {x: 3, y: 1},
                {x: 1, y: 2}, {x: 2, y: 2}]
      },
      {
        name: 'Loaf',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Game_of_life_loaf.svg',
        attribution: 'By None (Own work) [Public domain], via Wikimedia Commons',
        points: [{x: 1, y: 0}, {x: 2, y: 0},
                {x: 0, y: 1}, {x: 3, y: 1},
                {x: 1, y: 2}, {x: 3, y: 2},
                {x: 2, y: 3}]
      },
      {
        name: 'Boat',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Game_of_life_boat.svg',
        attribution: 'By Bryan.burgers (Own work) [Public domain], via Wikimedia Commons',
        points: [{x: 0, y: 0}, {x: 1, y: 0},
                {x: 0, y: 1}, {x: 2, y: 1},
                {x: 1, y: 2}]
      },
      {
        name: 'Flower',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Game_of_life_flower.svg',
        attribution: 'By Harsh Srivastava (Own work) [CC BY-SA 4.0 (http://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons',
        points: [{x: 1, y: 0},
                {x: 0, y: 1}, {x: 2, y: 1},
                {x: 1, y: 2}]
      }
    ]
  },
  {
    title: 'Oscillators',
    cellsTemplates: [
      {
        name: 'Blinker',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Game_of_life_blinker.gif',
        details: '(period 2)',
        attribution: 'By JokeySmurf at en.wikipedia [Public domain], via Wikimedia Commons',
        points: [{x: 1, y: 0},
                {x: 1, y: 1},
                {x: 1, y: 2}]
      },
      {
        name: 'Toad',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Game_of_life_toad.gif',
        details: '(period 2)',
        attribution: 'By JokeySmurf [Public domain], via Wikimedia Commons',
        points: [{x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0},
                {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}]
      },
      {
        name: 'Beacon',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Game_of_life_beacon.gif',
        details: '(period 2)',
        attribution: 'By JokeySmurf at en.wikipedia [Public domain], via Wikimedia Commons',
        points: [{x: 0, y: 0}, {x: 1, y: 0},
                  {x: 0, y: 1},
                  {x: 3, y: 2},
                  {x: 2, y: 3}, {x: 3, y: 3}]
      },
      {
        name: 'Pulsar',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Game_of_life_pulsar.gif',
        attribution: 'By JokeySmurf at en.wikipedia [Public domain], via Wikimedia Commons',
        details: '(period 3)',
        points: [{x: 4, y: 0}, {x: 10, y: 0},
                {x: 4, y: 1}, {x: 10, y: 1},
                {x: 4, y: 2}, {x: 5, y: 2}, {x: 9, y: 2}, {x: 10, y: 2},
                {x: 0, y: 4}, {x: 1, y: 4}, {x: 2, y: 4}, {x: 5, y: 4}, {x: 6, y: 4}, {x: 8, y: 4}, {x: 9, y: 4}, {x: 12, y: 4}, {x: 13, y: 4}, {x: 14, y: 4},
                {x: 2, y: 5}, {x: 4, y: 5}, {x: 6, y: 5}, {x: 8, y: 5}, {x: 10, y: 5}, {x: 12, y: 5}, {x: 8, y: 5},
                {x: 4, y: 6}, {x: 5, y: 6}, {x: 9, y: 6}, {x: 10, y: 6},
                {x: 4, y: 8}, {x: 5, y: 8}, {x: 9, y: 8}, {x: 10, y: 8},
                {x: 2, y: 9}, {x: 4, y: 9}, {x: 6, y: 9}, {x: 8, y: 9}, {x: 10, y: 9}, {x: 12, y: 9}, {x: 8, y: 9},
                {x: 0, y: 10}, {x: 1, y: 10}, {x: 2, y: 10}, {x: 5, y: 10}, {x: 6, y: 10}, {x: 8, y: 10}, {x: 9, y: 10}, {x: 12, y: 10}, {x: 13, y: 10}, {x: 14, y: 10},
                {x: 4, y: 12}, {x: 5, y: 12}, {x: 9, y: 12}, {x: 10, y: 12},
                {x: 4, y: 13}, {x: 10, y: 13},
                {x: 4, y: 14}, {x: 10, y: 14}]
      },
      {
        name: 'Pentadecathlon',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/I-Column.gif',
        details: '(period 15)',
        attribution: 'Unknown',
        points: [{x: 1, y: 0},
                {x: 1, y: 1},
                {x: 0, y: 2}, {x: 2, y: 2},
                {x: 1, y: 3},
                {x: 1, y: 4},
                {x: 1, y: 5},
                {x: 1, y: 6},
                {x: 0, y: 7}, {x: 2, y: 7},
                {x: 1, y: 8},
                {x: 1, y: 9}]
      }
    ]
  },
  {
    title: 'Spaceships',
    cellsTemplates: [
      {
        name: 'Glider',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Game_of_life_animated_glider.gif',
        details: 'it moves by the cells grid',
        attribution: 'Unknown',
        points: [{x: 1, y: 0},
                {x: 2, y: 1},
                {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}]
      },
      {
        name: 'Lightweight spaceship (LWSS)',
        imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Game_of_life_animated_LWSS.gif',
        details: 'it moves by the cells grid',
        attribution: 'Unknown',
        points: [{x: 0, y: 0}, {x: 3, y: 0},
                {x: 4, y: 1},
                {x: 0, y: 2}, {x: 4, y: 2},
                {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}]
      }
    ]
  }
]

class ConwaysGame {
  constructor (ownerUserId) {
    this.createdOn = new Date()
    this.ownerSocketId = ownerUserId
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

  killCellBy (user, points) {
    for (let i = 0; i < points.length; i++) {
      this.removeCell(points[i].x, points[i].y)
    }
  }

  createCellsGrid () {
    this.cellsGrids.push(new CellsGrid())
  }

  refreshCellsGrid (cellsGridId) {
    this.cellsGrids[cellsGridId].stablishCellsNewGeneration()
  }

  getPresetsConfiguration () {
    return PRESETS_CONFIGURATIONS
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

    for (let i = 0; i < this.cellsGrids.length; i++) {
      json.cellsGrids[i] = this.cellsGrids[i].toJSONObject()
    }

    return json
  }
}

ConwaysGame.PRESETS_CONFIGURATIONS = PRESETS_CONFIGURATIONS

module.exports = ConwaysGame

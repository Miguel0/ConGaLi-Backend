const AppException = require('../../exception/AppException')
const ContextUnawareCell = require('./ContextUnawareCell')

class CellsGrid {
  constructor () {
    this.createdOn = new Date()
    this.name = null
    this.cells = {}
    this.maxWidth = 3200
    this.maxHeight = 3200
    this.resolution = 10
  }

  addCell (cell, position, avoidException) {
    if (this.checkValidPosition(position, avoidException)) {
      if (!this.cells[position.x]) {
        this.cells[position.x] = {}
      }

      console.log(`Adding Cells: ${JSON.stringify(cell)} at ${JSON.stringify(position)}`)

      if (this.cells[position.x][position.y]) {
        throw new AppException(
          'error.cellsGrid.cellCantBeOverride.title',
          'error.cellsGrid.cellCantBeOverride.body',
          { cell: this.cells[position.x][position.y] }
        )
      } else {
        this.cells[position.x][position.y] = cell
      }
    }
  }

  removeCell (position) {
    this.checkValidPosition(position)

    // TODO Review if this is the best approach memory-wise
    delete this.cells[position.x][position.y]
  }

  /**
   * This will normalize the given coordinates to they possible positions in the grid given a raw position that doesn't have
   * into account the resolution of the grid
   */
  normalizeGridPosition (rawPosition) {
    return {
      x: Math.round((rawPosition.x - (this.resolution / 2)) / this.resolution) * this.resolution,
      y: Math.round((rawPosition.y - (this.resolution / 2)) / this.resolution) * this.resolution}
  }

  checkValidPosition (position, avoidThrowingException) {
    let validBoundsReceived = (Array.prototype.slice.call(arguments).length > 0) && position instanceof Object && !isNaN(parseFloat(position.x)) && !isNaN(parseFloat(position.y))
    validBoundsReceived = validBoundsReceived && (position.x <= this.maxWidth && position.x >= 0) && (position.y <= this.maxHeight && position.y >= 0)

    if (!validBoundsReceived && !avoidThrowingException) {
      let exception = new AppException(
        'error.cellsGrid.cellCantBeRemoved.title',
        'error.cellsGrid.cellCantBeRemoved.body'
      )

      if (position) {
        exception.arguments = { invalidPosition: { x: position.x, y: position.y } }
      }

      throw exception
    }

    return validBoundsReceived
  }

  nearbyPositions (stringX, stringY) {
    let x = parseInt(stringX)
    let y = parseInt(stringY)

    this.checkValidPosition({ x: x, y: y })

    let positionsArray = [
      { x: x - this.resolution, y: y + this.resolution },
      { x: x - this.resolution, y: y },
      { x: x - this.resolution, y: y - this.resolution },
      { x: x, y: y + this.resolution },
      { x: x, y: y - this.resolution },
      { x: x + this.resolution, y: y },
      { x: x + this.resolution, y: y + this.resolution },
      { x: x + this.resolution, y: y - this.resolution }
    ]

    positionsArray = positionsArray.filter(position => this.checkValidPosition(position, true))

    // console.log(`Nearby position of ${x}@${y} calculated: ${JSON.stringify(positionsArray)}`)

    return positionsArray
  }

  nearbyCellsOfPosition (stringX, stringY) {
    let positionsArray = this.nearbyPositions(stringX, stringY)

    let result = []

    for (let i = 0; i < positionsArray.length; i++) {
      let position = positionsArray[i]

      let cell = this.cells[position.x] && this.cells[position.x][position.y]

      if (cell) {
        result.push(cell)
      }
    }

    console.log(`Nearby cells of cell (${stringX}@${stringY}) calculated: ${JSON.stringify(result)}`)

    return result
  }

  forEachCell (aParticularFunction) {
    for (let x in this.cells) {
      for (let y in this.cells[x]) {
        aParticularFunction.call(aParticularFunction, this.cells[x][y], x, y)
      }
    }
  }

  calculatePossibleDeadCellsPositions () {
    // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    // Any live cell with more than three live neighbours dies, as if by overcrowding.
    let possibleDeadCells = []

    this.forEachCell((cell, x, y) => {
      let nearCellsCount = this.nearbyCellsOfPosition(x, y).length

      if (nearCellsCount > 3 || nearCellsCount < 2) {
        possibleDeadCells.push({ x: x, y: y })
      }
    })

    return possibleDeadCells
  }

  /** Expects input as 'nnnnnn' where each nn is a 2 character hex number for an RGB color value
   * e.g. #3f33c6
   * Returns the average as a hex number without leading #
   */
  averageRGB (arrayOfColours) {
    // Keep helper stuff in closures
    let hexRegex = /^[a-f\d]{6}$/gi

    let arrayOfHexColours = arrayOfColours
      .map(string => string.toLowerCase())
      .filter(color => color.match(hexRegex))
      .map(string => parseInt(string, 16))

    if (arrayOfHexColours.length !== arrayOfColours.length) {
      throw new AppException(
        'error.cellsGrid.malformedColor.title',
        'error.cellsGrid.malformedColor.body',
        arrayOfColours
      )
    }

    let result = arrayOfHexColours
      .reduce((total, element) => total + element)

    result = parseInt(result / arrayOfHexColours.length)
    result = `000000${result.toString(16)}`.slice(-6)

    console.log(`Processing color for: ${JSON.stringify(arrayOfHexColours)} led to: ${result}`)

    return result
  }

  addCellsBy (user, rawPositions) {
    let validCells = rawPositions
      .map(position => this.normalizeGridPosition(position))
      .filter(position => this.checkValidPosition(position, true))
      .filter(position => !this.cells[position.x] || !this.cells[position.x][position.y])
      .map(position => {
        let cell = new ContextUnawareCell()
        cell.color = user.color
        return { position: position, cell: cell }
      })

    if (validCells.length === rawPositions.length) {
      for (let i = 0; i < validCells.length; i++) {
        let cellConfig = validCells[i]

        if (!this.cells[cellConfig.position.x]) {
          this.cells[cellConfig.position.x] = {}
        }

        console.log(`Adding cell: ${JSON.stringify(cellConfig)}`)
        this.cells[cellConfig.position.x][cellConfig.position.y] = cellConfig.cell
      }
    } else {
      throw new AppException(
        'error.cellsGrid.cellCantBeOverride.title',
        'error.cellsGrid.cellCantBeOverride.body',
        { originalAttributes: rawPositions, validCells: validCells }
      )
    }
  }

  killCellBy (user, position) {
    this.removeCell(this.normalizeGridPosition(position))
  }

  automaticallyCreateNewCells () {
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    let newCells = []

    // TODO investigate a better way to deal with this use case.
    let newCellsMapping = {}

    // getting the cells that are around the already existing cells
    this.forEachCell((cell, x, y) => {
      let nearPositions = this.nearbyPositions(x, y)
        .filter(position => !this.cells[position.x] || !this.cells[position.x][position.y])

      for (let i = 0; i < nearPositions.length; i++) {
        let position = nearPositions[i]

        if (!(position.x === parseInt(x) && position.y === parseInt(y))) {
          if (!newCellsMapping[position.x]) {
            newCellsMapping[position.x] = {}
          }

          newCellsMapping[position.x][position.y] = position
        }
      }
    })

    for (let x in newCellsMapping) {
      for (let y in newCellsMapping[x]) {
        let nearCells = this.nearbyCellsOfPosition(x, y)

        if (nearCells.length === 3) {
          let newCell = new ContextUnawareCell()
          newCell.color = this.averageRGB(nearCells.map(cell => { return cell.color }))

          newCells.push({ x: x, y: y, cell: newCell })
        }
      }
    }

    return newCells
  }

  stablishCellsNewGeneration () {
    let newCells = this.automaticallyCreateNewCells()
    console.log(`new Cells about to be added: ${JSON.stringify(newCells)}`)

    let deadCellPositions = this.calculatePossibleDeadCellsPositions()
    console.log(`Cells about to die: ${JSON.stringify(deadCellPositions)}`)

    for (let i = 0; i < deadCellPositions.length; i++) {
      let deadCellPosition = deadCellPositions[i]

      this.removeCell(deadCellPosition)
    }

    for (let i = 0; i < newCells.length; i++) {
      let newCellData = newCells[i]
      this.addCell(newCellData.cell, newCellData, true)
    }
  }

  toJSONObject () {
    let json = {}
    json.createdOn = this.createdOn.toISOString()
    json.name = this.name
    json.cells = {}
    json.maxWidth = this.maxWidth
    json.maxHeight = this.maxHeight
    json.resolution = this.resolution

    this.forEachCell((cell, x, y) => {
      if (!json.cells[x]) {
        json.cells[x] = {}
      }

      json.cells[x][y] = cell.toJSONObject()

      // adding contextual values to the cell serializated data
      json.cells[x][y].gridPosition = {x: x, y: y}
    })

    return json
  }
}

module.exports = CellsGrid

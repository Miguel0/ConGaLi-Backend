const Exception = require('../exception/Exception')
const ContextUnawareCell = require('./ContextUnawareCell')

class Board {

    constructor() {
        this.createdOn = new Date()
        this.name = null
        this.boardCells = {}
        this.users = {}
        this.maxBoardWidth = 3200
        this.maxBoardHeight = 3200
        this.resolution = 10
        // TODO implement this functionality for better debug and user experience.
        this.log = []
    }

    addCell(cell, x, y, avoidException) {
        if (this.checkValidPosition(x, y, avoidException)) {

            if (!this.boardCells[x]) {
                this.boardCells[x] = {}
            }

            console.log(`Adding Cells: ${JSON.stringify(cell)} at ${x}@${y}`)

            this.boardCells[x][y] = cell
        }
    }

    removeCell(x, y) {
        this.checkValidPosition(x, y)

        // TODO Review if this is the best approach memory-wise
        delete this.boardCells[x][y]
    }

    checkValidPosition(x, y, avoidException) {
        let invalidBoundsReceived = x > this.maxBoardWidth || x < 0 || y > this.maxBoardHeight || y < 0
        if (invalidBoundsReceived && !avoidException) {
            throw new Exception(
                'error.board.cellCantBeRemoved.title',
                'error.board.cellCantBeRemoved.body'
            )
        }

        return !invalidBoundsReceived
    }

    nearbyPositions(stringX, stringY) {
        let x = parseInt(stringX)
        let y = parseInt(stringY)
        
        let positionsArray = [
            {x: x - this.resolution, y: y + this.resolution },
            {x: x - this.resolution, y: y },
            {x: x - this.resolution, y: y - this.resolution },
            {x: x, y: y + this.resolution },
            {x: x, y: y - this.resolution },
            {x: x + this.resolution, y: y },
            {x: x + this.resolution, y: y + this.resolution },
            {x: x + this.resolution, y: y - this.resolution }
        ]

        console.log(`Nearby position of ${x}@${y} calculated: ${JSON.stringify(positionsArray)}`)

        return positionsArray
    }

    nearbyCellsOfPosition(stringX, stringY) {
        let positionsArray = this.nearbyPositions(stringX, stringY)

        let result = []

        for (var i = 0; i < positionsArray.length; i++) {
            let position = positionsArray[i]

            let cell = this.boardCells[position.x] && this.boardCells[position.x][position.y]

            if (cell) {
                result.push(cell)
            }
        }

        console.log(`Nearby cells of cell (${stringX}@${stringY}) calculated: ${JSON.stringify(result)}`)

        return result
    }

    forEachCell(aParticularFunction) {
        for (let x in this.boardCells) {
            for (let y in this.boardCells[x]) {
                aParticularFunction.call(aParticularFunction, this.boardCells[x][y], x, y)
            }
        }
    }

    calculatePossibleDeadCellsPositions() {
        // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
        // Any live cell with more than three live neighbours dies, as if by overcrowding.
        let possibleDeadCells = []

        this.forEachCell((cell, x, y) => {
            let nearCellsCount = this.nearbyCellsOfPosition(x, y).length

            if (nearCellsCount > 3 || nearCellsCount < 2) {
                possibleDeadCells.push({ x:x, y:y })
            }
        })

        return possibleDeadCells
    }

    /** Expects input as 'nnnnnn' where each nn is a 2 character hex number for an RGB color value
     * e.g. #3f33c6
     * Returns the average as a hex number without leading #
     */
    averageRGB(arrayOfColours) {

        // Keep helper stuff in closures
        let reSegment = /[\da-z]{2}/gi

        return arrayOfColours.reduce(
            (totalString, elementString) => {

            // Split into parts
            let totalValue = totalString.match(reSegment)
            let elementValue = elementString.match(reSegment)
            let partialResult, result = []

            // Average each set of hex numbers going via dec
            // always rounds down
            for (let i = totalValue.length; i;) {
                partialResult = (parseInt(totalValue[--i],16) + parseInt(elementValue[i],16) >> 1 ).toString(16)

                // Add leading zero if only one character
                result[i] = (partialResult.length == 2? '' : '0') + partialResult
            }
            return  result.join('')
            }
        )
    }

    createCellBy(user, x, y) {
        this.addCell(new ContextUnawareCell(), x, y)
    }

    killCellBy(user, x, y) {
        this.removeCell(x, y)
    }

    automaticallyCreateNewCells() {
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        let newCells = []

        // TODO investigate a better way to deal with this use case.
        let newCellsMapping = {}
        
        this.forEachCell((cell, x, y) => {

            let nearPositions = this.nearbyPositions(x, y)

            for (let i = 0; i < nearPositions.length; i++) {
                let position = nearPositions[i]

                if (!(position.x === parseInt(x) && position.y === parseInt(y))) {

                    if (!newCellsMapping[position.x]) {
                        newCellsMapping[position.x] = {}
                    }

                    newCellsMapping[position.x][position.y] = position
                }
            }
        });

        for (let x in newCellsMapping) {
            for (let y in newCellsMapping[x]) {
                
                let position = newCellsMapping[x][y]

                let nearCells = this.nearbyCellsOfPosition(x, y)

                if (nearCells.length === 3) {
                    let newCell = new ContextUnawareCell()
                    newCell.color = this.averageRGB(nearCells.map( (cell) => {return cell.color}))

                    newCells.push({x: x, y: y, cell: newCell})
                }
            }
        }
        
        return newCells
    }

    stablishCellsNewGeneration() {
        let newCells = this.automaticallyCreateNewCells()
        console.log(`new Cells created: ${JSON.stringify(newCells)}`)

        let deadCellPositions = this.calculatePossibleDeadCellsPositions()
        console.log(`Cells about to die: ${JSON.stringify(deadCellPositions)}`)

        for (let i = 0; i < deadCellPositions.length; i++) {
            let deadCellPosition = deadCellPositions[i]

            this.removeCell(deadCellPosition.x, deadCellPosition.y)
        }

        for (let i = 0; i < newCells.length; i++) {
            let newCellData = newCells[i]
            this.addCell(newCellData.cell, newCellData.x, newCellData.y, true)
        }
    }

    toJSONObject() {
        let json = {}
        json.createdOn = this.createdOn.toISOString()
        json.name = this.name
        json.cells = {}
        json.maxBoardWidth = this.maxBoardWidth
        json.maxBoardHeight = this.maxBoardHeight

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

module.exports = Board
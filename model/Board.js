const Exception = require('../utils/Exception')
const ContextUnawareCell = require('./ContextUnawareCell')

class Board {

    addCell(x, y) {
        checkValidPosition(x, y)

        if (this.boardCells[x][y]) {
            throw new Exception(
                'error.board.cellIsOccupied.title',
                'error.board.cellIsOccupied.body'
            )
        }

        this.boardCells[x][y] = cell
    }

    addCell(x, y) {
        checkValidPosition(x, y)

        if (this.boardCells[x][y]) {
            throw new Exception(
                'error.board.cellIsOccupied.title',
                'error.board.cellIsOccupied.body'
            )
        }

        this.boardCells[x][y] = cell
    }

    checkValidPosition(x, y) {
        if (!this.boardCells[x][y]) {
            throw new Exception(
                'error.board.cellCantBeRemoved.title',
                'error.board.cellCantBeRemoved.body'
            )
        }

        // TODO Review if this is the best approach memory-wise
        this.boardCells[x][y] = null
    }

    nearbyCellsOfPosition(x, y) {
        let topLeftCell = this.boardCells[x-1] && this.boardCells[x-1][y+1]
        let leftCell = this.boardCells[x-1] && this.boardCells[x-1][y]
        let bottomLeftCell = this.boardCells[x-1] && this.boardCells[x-1][y-1]
        let topCell = this.boardCells[x] && this.boardCells[x][y+1]
        let bottomCell = this.boardCells[x] && this.boardCells[x][y-1]
        let rightCell = this.boardCells[x+1] && this.boardCells[x+1][y]
        let topRightCell = this.boardCells[x+1] && this.boardCells[x+1][y+1]
        let bottomRightCell = this.boardCells[x+1] && this.boardCells[x+1][y-1]

        return [topLeftCell, topCell, topRightCell, leftCell, rightCell, bottomLeftCell, bottomCell, bottomRightCell]
                    .filter((nearCell) => nearCell)
    }

    forEachCell(aParticularFunction) {
        let horizontalKeys = Object.keys(this.boardCells)

        for (let x_element_index = 0; x_element_index < horizontalKeys.length; x_element_index++) {
            let x = horizontalKeys[x_element_index]
            let verticalKeys = Object.keys(this.boardCells[x])

            for (let y_element_index = 0; y_element_index < verticalKeys.length; y_element_index++) {
                let y = verticalKeys[y_element_index]

                let cell = this.boardCells[x][y]

                if (cell) {
                    aParticularFunction.apply(cell, x, y)
                }
            }
        }

        return possibleDeadCells
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
        
        this.forEachCell((cell, x, y) => {
            let nearCells = this.nearbyCellsOfPosition(x, y)
            
            if (nearCells.length === 3) {
                let newCell = new ContextUnawareCell()
                newCell.color = this.averageRGB(nearCells.map( (cell) => {return cell.color}))

                newCells.push({x: x, y: y, cell: newCell})
            }
        });
        
        return newCells
    }

    stablishCellsNewGeneration() {
        let newCells = this.automaticallyCreateNewCells()

        let deadCellPositions = this.calculatePossibleDeadCellsPositions()

        for (let i = 0; i < deadCellPositions.length; i++) {
            let deadCellPosition = deadCellPositions[i]

            removeCell(deadCellPosition.x, deadCellPosition.y)
        }

        for (let i = 0; i < newCells.length; i++) {
            let newCellData = newCells[i]
            this.addCell(newCellData.cell, newCellData.x, newCellData.y)
        }
    }

    toJSONObject() {
        let json = {}
        json.createdOn = this.createdOn.toISOString()
        json.name = this.name
        json.cells = [[]]
        json.maxBoardWidth = this.maxBoardWidth
        json.maxBoardHeight = this.maxBoardHeight

        this.forEachCell((cell, x, y) => {
            json.cells[x][y] = cell.toJSONObject()
        })

        return json
    }

    constructor() {
        this.createdOn = new Date()
        this.name = null
        this.users = {}
        this.boardCells = [[]]
        this.maxBoardWidth = 20
        this.maxBoardHeight = 20
        // TODO implement this functionality for better debug and user experience.
        this.log = []
    }        
}

module.exports = Board
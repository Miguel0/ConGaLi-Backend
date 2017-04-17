const chai = require('chai')
const expect = chai.expect

const TestUtils = require('../../helpers/TestUtils')
const AppException = require('../../../../src/exception/AppException')
const User = require('../../../../src/domain/model/User')
const CellsGrid = require('../../../../src/domain/model/CellsGrid')
const Cell = require('../../../../src/domain/model/ContextUnawareCell')

describe('CellsGrid', function () {
  let cellsGrid

  beforeEach(() => {
    try {
      cellsGrid = new CellsGrid()
    } catch (e) {
      // let the first test to fail, and the rest also
    }
  })

  it('should be able to be created', function () {
    expect(() => cellsGrid = new CellsGrid()).to.not.throw(Error)
    
    expect(cellsGrid).to.not.be.null
  })

  describe('Checking instance values upon creation', function () {
    it('should have default values set already', function () {
      expect(cellsGrid).to.have.property('createdOn').and.not.be.null
      expect(cellsGrid).to.have.property('name').and.to.be.null
      expect(cellsGrid).to.have.property('cells').and.to.be.empty
      expect(cellsGrid).to.have.property('maxWidth').and.to.be.equal(3200)
      expect(cellsGrid).to.have.property('maxHeight').and.to.be.equal(3200)
      expect(cellsGrid).to.have.property('resolution').and.to.be.equal(10)
    })

    it('should return a proper JSON representation', function () {
      let jsonObject = cellsGrid.toJSONObject()

      expect(jsonObject).to.have.property('createdOn').and.to.be.a('string').and.to.match(TestUtils.getISOStringRegex())
      expect(jsonObject).to.have.property('name').and.to.be.null
      expect(jsonObject).to.have.property('cells').and.to.be.empty
      expect(jsonObject).to.have.property('maxWidth').and.to.be.equal(3200)
      expect(jsonObject).to.have.property('maxHeight').and.to.be.equal(3200)
      expect(jsonObject).to.have.property('resolution').and.to.be.equal(10)
      expect(Object.keys(jsonObject)).lengthOf(6)
    })
  })

  describe('Checking validator function against point (x, y) over cellsGrid bounds', function () {
    it('should fail if there\'s no arguments', function () {
      expect(() => cellsGrid.checkValidPosition())
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellAtInvalidPosition.title')
    })

    it('should throw an AppException if the arguments are empty', function () {
      expect(() => cellsGrid.checkValidPosition(''))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellAtInvalidPosition.title')
    })

    it('should throw an AppException if the arguments are null', function () {
      expect(() => cellsGrid.checkValidPosition(null))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellAtInvalidPosition.title')
    })

    it('should return false if the arguments are null', function () {
      expect(cellsGrid.checkValidPosition(null, true)).to.be.false
    })

    it('should return false if the arguments are empty', function () {
      expect(cellsGrid.checkValidPosition('', true)).to.be.false
    })

    it('should not throw an AppException if the arguments are the same as the maxHeight and maxWidth', function () {
      expect(() => cellsGrid.checkValidPosition({ x: cellsGrid.maxWidth, y: cellsGrid.maxHeight })).to.not.throw(AppException)
    })

    it('should not throw an AppException if the arguments are both equal to 0', function () {
      expect(() => cellsGrid.checkValidPosition({x: 0, y: 0})).to.not.throw(AppException)
    })

    it('should throw an AppException if the width is greater than the maxWidth', function () {
      expect(() => cellsGrid.checkValidPosition({x: (cellsGrid.maxWidth + 1), y: 0}))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellAtInvalidPosition.title')
    })

    it('should throw an AppException if the height is greater than the maxHeight', function () {
      expect(() => cellsGrid.checkValidPosition({x: 0, y: (cellsGrid.maxHeight + 1)}))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellAtInvalidPosition.title')
    })
  })

  describe('Checking nearby valid points generator calculation', function () {
    it('should fail if there\'s no arguments', function () {
      expect(() => cellsGrid.nearbyPositions()).to.throw(AppException)
    })

    it('should throw an AppException if the arguments are empty', function () {
      expect(() => cellsGrid.nearbyPositions('', '')).to.throw(AppException)
    })

    it('should throw an AppException if the arguments are null', function () {
      expect(() => cellsGrid.nearbyPositions(null, null)).to.throw(AppException)
    })

    it('should return 3 elements with parameters for each one of the corners of the grid', function () {
      expect(cellsGrid.nearbyPositions(cellsGrid.maxWidth, cellsGrid.maxHeight).length).to.be.equal(3)
      expect(cellsGrid.nearbyPositions(cellsGrid.maxWidth, 0).length).to.be.equal(3)
      expect(cellsGrid.nearbyPositions(0, cellsGrid.maxHeight).length).to.be.equal(3)
      expect(cellsGrid.nearbyPositions(0, 0).length).to.be.equal(3)
    })

    it('should return 8 elements with parameters setted at cellsGrid.resolution@cellsGrid.resolution', function () {
      expect(cellsGrid.nearbyPositions(cellsGrid.resolution, cellsGrid.resolution).length).to.be.equal(8)
    })
  })

  describe('Average color calculation', function () {
    it('should fail if there\'s no arguments', function () {
      expect(() => cellsGrid.averageRGB()).to.throw(Error)
    })

    it('should fail if the argument is empty', function () {
      expect(() => cellsGrid.averageRGB([])).to.throw(Error)
    })

    it('should fail if the arguments are malformed', function () {
      expect(() => cellsGrid.averageRGB(['#000','asdf'])).to.throw(AppException)
    })

    it('should return a string without a "#" as first char', function () {
      expect(cellsGrid.averageRGB(['000000']).charAt(0)).to.not.be.equal('#')
    })

    it('should return a the same first element on the array of length 1 received', function () {
      expect(cellsGrid.averageRGB(['000000'])).to.be.equal('000000')
    })

    it('should return the same if all the arguments are the same', function () {
      expect(cellsGrid.averageRGB(['000000','000000'])).to.be.equal('000000')
    })

    it('should return the middle value for two opposite extreme values', function () {
      expect(cellsGrid.averageRGB(['000000','FFFFFF'])).to.be.equal('7fffff')
    })

    it('should return the same if all the arguments are the average', function () {
      expect(cellsGrid.averageRGB(['3cfAA0','FFFFFF', '7a0058'])).to.be.equal('9253a7')
    })
  })

  describe('Position normalization', function () {
    it('should throw exception upon nonexistent/faltsy resolution', function () {
      cellsGrid.resolution = null
      expect(() => cellsGrid.normalizeGridPosition({x: 0, y: 0})).to.throw(AppException)
    })

    it('should throw exception upon negative resolution', function () {
      cellsGrid.resolution = -1
      expect(() => cellsGrid.normalizeGridPosition({x: 0, y: 0})).to.throw(AppException)
    })

    it('should normalize negative zero to unsigned zero', function () {
      cellsGrid.resolution = 1
      expect(cellsGrid.normalizeGridPosition({x: 0, y: 0})).to.be.deep.equal({x: 0, y: 0})
    })

    it('should throw exception upon wrong/nonexistent/faltsy resolution', function () {
      cellsGrid.resolution = 1
      expect(cellsGrid.normalizeGridPosition({x: 150, y: -150})).to.be.deep.equal({x: 150, y: -150})
      expect(cellsGrid.normalizeGridPosition({x: -150, y: 150})).to.be.deep.equal({x: -150, y: 150})
      expect(cellsGrid.normalizeGridPosition({x: -150, y: -150})).to.be.deep.equal({x: -150, y: -150})
    })
  })

  describe('Cells blind addition', function () {
    it('shouldn\'t fail if there\'s no arguments', function () {
      expect(() => cellsGrid.doAddCells())
        .to.not.throw(AppException)
    })

    it('should fail if there\'s no position', function () {
      expect(() => cellsGrid.doAddCells({cell: new Cell()}))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellAtInvalidPosition.title')
    })

    it('should fail if there\'s invalid position', function () {
      expect(() => cellsGrid.doAddCells({cell: new Cell(), position: {x: -1, y: -1}}))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellAtInvalidPosition.title')
    })

    it('should add new cell', function () {
      let cell =  new Cell()

      expect(() => cellsGrid.doAddCells({cell: cell, position: {x: 0, y: 0}}))
        .to.not.throw(AppException)
      expect(cellsGrid.cells[0][0]).to.be.equal(cell)
    })

    it('should throw exception upon cell override', function () {
      cellsGrid.doAddCells({cell: new Cell(), position: {x: 0, y: 0}})

      expect(() => cellsGrid.doAddCells({cell: new Cell(), position: {x: 0, y: 0}}))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellCantBeOverride.title')
    })

    it('should return a proper JSON representation', function () {
      let user = new User()
      user.color = 'FFFFFF'

      cellsGrid.doAddCells({cell: new Cell(user), position: {x: 0, y: 2}}, {cell: new Cell(user), position: {x: 0, y: 3}}, {cell: new Cell(user), position: {x: 1, y: 4}})

      let jsonObject = cellsGrid.toJSONObject()

      expect(jsonObject).to.have.property('cells').and.to.have.all.keys(['0', '1'])
      expect(jsonObject.cells[0]).and.to.have.all.keys(['2', '3'])
      expect(jsonObject.cells[0][1]).to.be.faltsy
      expect(jsonObject.cells[0][2]).to.have.property('color').and.to.equal('#FFFFFF')
      expect(jsonObject.cells[0][2]).to.have.property('createdOn').and.to.match(TestUtils.getISOStringRegex())
      expect(jsonObject.cells[0][2]).to.have.property('gridPosition').and.to.be.deep.equal({ x: '0', y: '2' })
    })
  })

  describe('Cells user addition', function () {
    it('shouldn\'t fail if there\'s no arguments', function () {
      let functionToValidate = () => cellsGrid.addCellsBy(new User())

      expect(functionToValidate).to.not.throw(AppException)
      expect(functionToValidate).to.not.throw(Error)
    })

    it('shouldn\'t fail if there\'s no positions', function () {
      let functionToValidate = () => cellsGrid.addCellsBy(new User())

      expect(functionToValidate).to.not.throw(AppException)
      expect(functionToValidate).to.not.throw(Error)
    })

    it('shouldn\'t fail if receives an empty array of positions', function () {
      let functionToValidate = () => cellsGrid.addCellsBy(new User(), [])

      expect(functionToValidate).to.not.throw(AppException)
      expect(functionToValidate).to.not.throw(Error)
    })

    it('should fail if there\'s invalid position', function () {
      expect(() => cellsGrid.addCellsBy(new User(), [{x: -1, y: -1}]))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellAtInvalidPosition.title')
    })

    it('should add new cell', function () {
      expect(() => cellsGrid.addCellsBy(new User(), [{x: 0, y: 0}]))
        .to.not.throw(AppException)
      expect(cellsGrid.cells[0][0]).to.be.not.null
    })

    it('should throw exception upon cell override', function () {
      cellsGrid.addCellsBy(new User(), [{x: 0, y: 0}])

      expect(() => cellsGrid.addCellsBy(new User(), [{x: 0, y: 0}]))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellCantBeOverride.title')
    })
  })

  describe('Cells iteration', function () {
    it('shouldn\'t iterate over empty cellsGrid', function () {
      let count = 0

      cellsGrid.forEachCell(cell => count++)
      expect(count).to.be.equal(0)
    })

    it('should iterate single element cells holder', function () {
      let count = 0
      
      cellsGrid.doAddCells({cell: new Cell(), position: {x: 0, y: 0}})
      cellsGrid.doAddCells({cell: new Cell(), position: {x: 0, y: 1}})
      
      cellsGrid.forEachCell(cell => count++)
      expect(count).to.be.equal(2)
    })
  })

  describe('blind removal', function () {
    it('shouldn\'t fail if there\'s no arguments', function () {
      expect(() => cellsGrid.removeCells())
        .to.not.throw(AppException)
    })

    it('should fail if there\'s no position', function () {
      expect(() => cellsGrid.removeCells({position: null}))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellAtInvalidPosition.title')
    })

    it('should fail if there\'s invalid position', function () {
      expect(() => cellsGrid.removeCells({position: {x: -1, y: -1}}))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.cellAtInvalidPosition.title')
    })

    it('should remove existent cell', function () {
      cellsGrid.doAddCells({cell: new Cell(), position: {x: 0, y: 0}})

      expect(() => cellsGrid.removeCells({position: {x: 0, y: 0}}))
        .to.not.throw(AppException)

      let count = 0
      cellsGrid.forEachCell( cell => {console.log(JSON.stringify(cell)); count++})

      expect(count).to.be.equal(0)
    })

    it('should throw exception upon non existent cell removal', function () {
      expect(() => cellsGrid.removeCells({position: {x: 0, y: 0}}))
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.cellsGrid.canNotRemoveCellThatDoesNotExists.title')
    })
  })
})

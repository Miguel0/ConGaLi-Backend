const chai = require('chai')
const expect = chai.expect

const TestUtils = require('../../helpers/TestUtils')
const AppException = require('../../../../src/exception/AppException')
const CellsGrid = require('../../../../src/model/CellsGrid')
const Cell = require('../../../../src/model/ContextUnawareCell')

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
      expect(cellsGrid).to.have.property('users').and.to.be.empty
      expect(cellsGrid).to.have.property('maxWidth').and.to.be.equal(3200)
      expect(cellsGrid).to.have.property('maxHeight').and.to.be.equal(3200)
      expect(cellsGrid).to.have.property('resolution').and.to.be.equal(10)
      expect(cellsGrid).to.have.property('log').and.to.be.empty
    })

    it('should return a proper JSON representation', function () {
      let jsonObject = cellsGrid.toJSONObject()

      expect(jsonObject).to.have.property('createdOn').and.to.be.a('string').and.to.match(TestUtils.getISOStringRegex())
      expect(jsonObject).to.have.property('name').and.to.be.null
      expect(jsonObject).to.have.property('cells').and.to.be.empty
      expect(jsonObject).to.have.property('maxWidth').and.to.be.equal(3200)
      expect(jsonObject).to.have.property('maxHeight').and.to.be.equal(3200)
    })
  })

  describe('Checking validator function against point (x, y) over cellsGrid bounds', function () {
    it('should fail if there\'s no arguments', function () {
      expect(() => cellsGrid.checkValidPosition()).to.throw(AppException)
    })

    it('should throw an AppException if the arguments are empty', function () {
      expect(() => cellsGrid.checkValidPosition('', '')).to.throw(AppException)
    })

    it('should throw an AppException if the arguments are null', function () {
      expect(() => cellsGrid.checkValidPosition(null, null)).to.throw(AppException)
    })

    it('should return false if the arguments are null', function () {
      expect(cellsGrid.checkValidPosition(null, null, true)).to.be.false
    })

    it('should return false if the arguments are empty', function () {
      expect(cellsGrid.checkValidPosition('', '', true)).to.be.false
    })

    it('should not throw an AppException if the arguments are the same as the maxHeight and maxWidth', function () {
      expect(() => cellsGrid.checkValidPosition(cellsGrid.maxWidth, cellsGrid.maxHeight)).to.not.throw(AppException)
    })

    it('should not throw an AppException if the arguments are both equal to 0', function () {
      expect(() => cellsGrid.checkValidPosition(0, 0)).to.not.throw(AppException)
    })

    it('should throw an AppException if the width is greater than the maxWidth', function () {
      expect(() => cellsGrid.checkValidPosition(cellsGrid.maxWidth + 1, 0)).to.throw(AppException)
    })

    it('should throw an AppException if the height is greater than the maxHeight', function () {
      expect(() => cellsGrid.checkValidPosition(0, cellsGrid.maxHeight + 1)).to.throw(AppException)
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

    it('should return 8 elements with parameters setted at 4@4', function () {
      expect(cellsGrid.nearbyPositions(4, 4).length).to.be.equal(8)
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
      expect(cellsGrid.averageRGB(['000000']).charAt(0)).to.not.be.equal('000000')
    })

    it('should return the same if all the arguments are the same', function () {
      expect(cellsGrid.averageRGB(['000000','000000'])).to.not.be.equal('000000')
    })

    it('should return the middle value for two opposite extreme values', function () {
      expect(cellsGrid.averageRGB(['000000','FFFFFF'])).to.be.equal('7fffff')
    })

    it('should return the same if all the arguments are the average', function () {
      expect(cellsGrid.averageRGB(['3cfAA0','FFFFFF', '7a0058'])).to.be.equal('9253a7')
    })
  })
})

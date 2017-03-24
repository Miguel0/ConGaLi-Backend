const chai = require('chai')
const expect = chai.expect

const AppException = require('../../../../src/exception/AppException')
const CellsGrid = require('../../../../src/model/CellsGrid')
const Cell = require('../../../../src/model/ContextUnawareCell')

describe('CellsGrid', function () {
  let board

  beforeEach(() => {
    try {
      board = new CellsGrid()
    } catch (e) {
      // let the first test to fail, and the rest also
    }
  })

  it('should be able to be created', function () {
    expect(() => board = new CellsGrid()).to.not.throw(Error)
    
    expect(board).to.not.be.null
  })

  describe('Average color calculation', function () {
    it('should fail if there\'s no arguments', function () {
      expect(() => board.averageRGB()).to.throw(Error)
    })

    it('should fail if the argument is empty', function () {
      expect(() => board.averageRGB([])).to.throw(Error)
    })

    it('should fail if the arguments are malformed', function () {
      expect(() => board.averageRGB(['#000','asdf'])).to.throw(AppException)
    })

    it('should return a string without a "#" as first char', function () {
      expect(board.averageRGB(['000000']).charAt(0)).to.not.be.equal('#')
    })

    it('should return a the same first element on the array of length 1 received', function () {
      expect(board.averageRGB(['000000']).charAt(0)).to.not.be.equal('000000')
    })

    it('should return the same if all the arguments are the same', function () {
      expect(board.averageRGB(['000000','000000'])).to.not.be.equal('000000')
    })

    it('should return the middle value for two opposite extreme values', function () {
      expect(board.averageRGB(['000000','FFFFFF'])).to.be.equal('7fffff')
    })

    it('should return the same if all the arguments are the average', function () {
      expect(board.averageRGB(['3cfAA0','FFFFFF', '7a0058'])).to.be.equal('9253a7')
    })

  })
})

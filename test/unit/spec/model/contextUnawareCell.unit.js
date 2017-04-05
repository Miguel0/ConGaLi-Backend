const chai = require('chai')
const expect = chai.expect

const Cell = require('../../../../src/domain/model/ContextUnawareCell')
const TestUtils = require('../../helpers/TestUtils')

describe('ContextUnawareCell', function () {
  let cell = null

  it('should be able to be created', function () {
    expect(() => cell = new Cell()).to.not.throw(Error)
    
    expect(cell).to.not.be.null
  })

  cell = new Cell()

  describe('Checking instance values upon creation', function () {
    it('should have default values set already', function () {
      expect(cell).to.have.property('createdOn').and.not.be.null
      expect(cell).to.have.property('color').and.to.be.equal('000000')
    })

    it('should return a proper JSON representation', function () {
      let jsonObject = cell.toJSONObject()
      
      expect(jsonObject).to.have.property('createdOn').and.to.be.a('string').and.to.match(TestUtils.getISOStringRegex())
      expect(jsonObject).to.have.property('color').and.to.be.equal('#000000')
    })
  })

  describe('Checking instance values modification', function () {
    it('should have proper values set', function () {
      cell.createdOn = null
      cell.color = 'FFFAFC'

      expect(cell).to.have.property('createdOn').and.be.null
      expect(cell).to.have.property('color').and.to.be.equal('FFFAFC')
    })

    it('should throw exception with null createdOn date', function () {
      expect(() => cell.toJSONObject()).to.throw(Error)
    })

    it('should return a proper JSON representation', function () {
      cell.createdOn = new Date()

      expect(cell.toJSONObject()).to.have.property('createdOn').and.to.be.a('string').and.to.match(TestUtils.getISOStringRegex())
      expect(cell.toJSONObject()).to.have.property('color').and.to.be.equal('#FFFAFC')
    })
  })
})

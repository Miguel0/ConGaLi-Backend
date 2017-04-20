const chai = require('chai')
const expect = chai.expect

const CellsTemplateDefinition = require('../../../../src/domain/model/CellsTemplateDefinition')

describe('CellsTemplateDefinition', function () {
  let cellsTemplateDefinition = null

  it('should be able to be created', function () {
    expect(() => cellsTemplateDefinition = new CellsTemplateDefinition()).to.not.throw(Error)
    
    expect(cellsTemplateDefinition).to.not.be.null
  })

  cellsTemplateDefinition = new CellsTemplateDefinition()

  describe('Checking instance values upon creation', function () {
    it('should have default values set already', function () {
      expect(cellsTemplateDefinition).to.have.property('createdOn').and.not.be.null
      expect(cellsTemplateDefinition).to.have.property('name').and.to.be.equal('')
      expect(cellsTemplateDefinition).to.have.property('imgSrc').and.to.be.equal('')
      expect(cellsTemplateDefinition).to.have.property('attribution').and.to.be.equal('')
      expect(cellsTemplateDefinition).to.have.property('points').and.to.be.instanceof(Array).and.lengthOf(0)
      expect(cellsTemplateDefinition).to.have.property('details').and.to.be.null
    })

    it('should return a proper JSON representation without details', function () {
      let jsonObject = cellsTemplateDefinition.toJSONObject()
      
      expect(jsonObject).to.have.property('name').and.to.be.equal('')
      expect(jsonObject).to.have.property('imgSrc').and.to.be.equal('')
      expect(jsonObject).to.have.property('attribution').and.to.be.equal('')
      expect(jsonObject).to.have.property('points').and.to.be.instanceof(Array).and.lengthOf(0)
      expect(jsonObject).to.not.have.property('details')
      expect(Object.keys(jsonObject)).lengthOf(4)
    })

    it('should return a proper JSON representation with details', function () {
      cellsTemplateDefinition.details = 'asdf'

      let jsonObject = cellsTemplateDefinition.toJSONObject()
      
      expect(jsonObject).to.have.property('name').and.to.be.equal('')
      expect(jsonObject).to.have.property('imgSrc').and.to.be.equal('')
      expect(jsonObject).to.have.property('attribution').and.to.be.equal('')
      expect(jsonObject).to.have.property('points').and.to.be.instanceof(Array).and.lengthOf(0)
      expect(jsonObject).to.have.property('details').and.not.be.null
      expect(Object.keys(jsonObject)).lengthOf(5)
    })
  })

  describe('Checking instance values modification', function () {
    it('should have proper values set', function () {
      cellsTemplateDefinition.createdOn = null
      cellsTemplateDefinition.name = 'adfasdf'
      cellsTemplateDefinition.imgSrc = null
      cellsTemplateDefinition.attribution = null
      cellsTemplateDefinition.details = null
      cellsTemplateDefinition.points = null

      expect(cellsTemplateDefinition).to.have.property('createdOn').and.be.null
      expect(cellsTemplateDefinition).to.have.property('name').and.to.be.equal('adfasdf')
      expect(cellsTemplateDefinition).to.have.property('points').and.be.null
      expect(cellsTemplateDefinition).to.have.property('imgSrc').and.be.null
      expect(cellsTemplateDefinition).to.have.property('details').and.be.null
      expect(cellsTemplateDefinition).to.have.property('attribution').and.be.null
    })

    it('should throw exception with null createdOn date', function () {
      expect(() => cellsTemplateDefinition.toJSONObject()).to.throw(Error)
    })
  })
})

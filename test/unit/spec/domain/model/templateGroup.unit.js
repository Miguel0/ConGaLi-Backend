const chai = require('chai')
const expect = chai.expect
const CellsTemplateDefinition = require('../../../../../src/domain/model/CellsTemplateDefinition')
const TemplateGroup = require('../../../../../src/domain/model/TemplateGroup')

describe('TemplateGroup', function () {
  let templateGroup = null

  it('should be able to be created', function () {
    expect(() => templateGroup = new TemplateGroup()).to.not.throw(Error)

    expect(templateGroup).to.not.be.null
  })

  templateGroup = new TemplateGroup()

  describe('Checking instance values upon creation', function () {
    it('should have default values set already', function () {
      expect(templateGroup).to.have.property('createdOn').and.not.be.null
      expect(templateGroup).to.have.property('name').and.to.be.equal('')
      expect(templateGroup).to.have.property('templates').and.to.be.instanceof(Array).and.lengthOf(0)
    })

    it('should return a proper JSON representation', function () {
      let jsonObject = templateGroup.toJSONObject()

      expect(jsonObject).to.have.property('name').and.to.be.a('string')
      expect(jsonObject).to.have.property('templates').and.to.be.instanceof(Array).and.lengthOf(0)
      expect(Object.keys(jsonObject)).lengthOf(2)
    })
  })

  describe('Checking instance values modification', function () {
    it('should have proper values set', function () {
      templateGroup.createdOn = null
      templateGroup.name = 'adfasdf'
      templateGroup.templates = null

      expect(templateGroup).to.have.property('createdOn').and.be.null
      expect(templateGroup).to.have.property('name').and.to.be.equal('adfasdf')
      expect(templateGroup).to.have.property('templates').and.be.null
    })

    it('should throw exception with null createdOn date', function () {
      expect(() => templateGroup.toJSONObject()).to.throw(Error)
    })

    it('should return a proper JSON representation', function () {
      templateGroup.createdOn = new Date()
      templateGroup.templates = [new CellsTemplateDefinition()]

      let jsonObject = templateGroup.toJSONObject()

      expect(jsonObject).to.have.property('name').and.to.be.a('string')
      expect(jsonObject).to.have.property('templates').and.to.be.instanceof(Array).and.lengthOf(1)
      expect(jsonObject.templates[0]).to.be.deep.equal(new CellsTemplateDefinition().toJSONObject())
      expect(Object.keys(jsonObject)).lengthOf(2)
    })
  })
})

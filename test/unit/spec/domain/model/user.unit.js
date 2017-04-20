const chai = require('chai')
const expect = chai.expect

const User = require('../../../../../src/domain/model/User')
const AppException = require('../../../../../src/exception/AppException')

describe('User', function () {
  let user = null

  it('should be able to be created', function () {
    expect(() => user = new User()).to.not.throw(Error)

    expect(user).to.not.be.null
  })


  beforeEach(() => {
    user = new User()
  })

  describe('Checking instance values upon creation', function () {
    it('should have default values set already', function () {
      expect(user).to.have.property('createdOn').and.not.be.null
      expect(user).to.have.property('id').and.to.be.null
      expect(user).to.have.property('name').and.to.be.equal('')
      expect(user).to.have.property('email').and.to.be.equal('')
      expect(user).to.have.property('password').and.to.be.equal('')
    })

    it('should return a proper JSON representation', function () {
      let jsonObject = user.toJSONObject()

      expect(jsonObject).to.have.property('id').and.to.be.null
      expect(jsonObject).to.have.property('name').and.to.be.a('string')
      expect(jsonObject).to.have.property('createdOn').and.not.be.null
      expect(jsonObject).to.have.property('color').and.be.null

      expect(Object.keys(jsonObject)).lengthOf(4)
    })
  })

  describe('Checking instance values modification', function () {
    it('should have proper values set', function () {
      user.createdOn = null
      user.name = 'adfasdf'

      expect(user).to.have.property('createdOn').and.be.null
      expect(user).to.have.property('name').and.to.be.equal('adfasdf')
    })

    it('should return a proper JSON representation', function () {
      user.createdOn = new Date()
      user.id = 'asdf'

      let jsonObject = user.toJSONObject()

      expect(jsonObject).to.have.property('name').and.to.be.a('string')
      expect(jsonObject).to.have.property('id').and.to.not.be.null
      expect(jsonObject).to.have.property('createdOn').and.to.not.be.null
    })
  })

  describe('Checking integrity', function () {
    it('missing or wrong type createdOn attribute', function () {
      user.createdOn = null

      expect(() => user.checkIntegrity())
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.user.integrity.createdOn.title')

      user.createdOn = 'null'

      expect(() => user.checkIntegrity())
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.user.integrity.createdOn.title')
    })

    it('missing or wrong type name attribute', function () {

      expect(() => user.checkIntegrity())
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.user.integrity.name.title')

      user.name = new Date()

      expect(() => user.checkIntegrity())
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.user.integrity.name.title')
    })

    it('missing or wrong type password attribute', function () {
      user.name= 'asdf'

      expect(() => user.checkIntegrity())
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.user.integrity.authData.title')
    })

    it('missing or wrong type color attribute', function () {
      user.name = 'asdf'
      user.password = 'asdf'

      expect(() => user.checkIntegrity())
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.user.integrity.color.title')

      user.color = 'asdf'

      expect(() => user.checkIntegrity())
        .to.throw(AppException)
        .and.to.have.property('titleKey')
        .and.to.be.equal('error.user.integrity.color.title')
    })
  })
})

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')

const GeneralCommunicationService = require('../../../../../src/domain/manager/GeneralCommunicationBusinessLogicManager')
const StorageDAO = require('../../../../../src/storage/StorageDAO')
const ConwaysGame = require('../../../../../src/domain/model/ConwaysGame')
const User = require('../../../../../src/domain/model/User')

const sandbox = sinon.sandbox.create()

describe('GeneralCommunicationService', function () {
  let generalCommunicationService = null
  let storageDAO = new StorageDAO()

  beforeEach(function () {
  });

  afterEach(function () {
      // completely restore all fakes created through the sandbox
      sandbox.restore()
  });

  it('should be able to be created', function () {

    expect(() => generalCommunicationService = new GeneralCommunicationService(storageDAO)).to.not.throw(Error)

    expect(generalCommunicationService).to.not.be.null
  })

  it('sould tolerate no arguments being sent', function () {
    let forEachGame = sandbox.stub(storageDAO, 'forEachGame')
    forEachGame.callsFake(() => {})

    let descriptions =  generalCommunicationService.getAvailableGamesDescriptionFor('someUserId')

    expect(descriptions).to.be.lengthOf(0)
  })

  it('sould tolerate an empty array response', function () {
    let descriptions = generalCommunicationService.getAvailableGamesDescriptionFor('someUserId')

    expect(descriptions).to.be.lengthOf(0)
  })

  it('sould tolerate a iteration over at least one record', function () {
    storageDAO.gamesByUserId = {
      'someUserId': []
    }

    storageDAO.gamesByUserId['someUserId'].push(new ConwaysGame(new User()))
    storageDAO.gamesByUserId['someUserId'].push(new ConwaysGame(new User()))
    storageDAO.gamesByUserId['someUserId'].push(new ConwaysGame(new User()))

    let descriptions = generalCommunicationService.getAvailableGamesDescriptionFor('someUserId')

    expect(descriptions).to.be.lengthOf(3)
  })
})

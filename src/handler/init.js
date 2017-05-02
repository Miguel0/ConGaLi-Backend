const ConnectionHandler = require('./ConnectionHandler')
const GeneralCommunicationHandler = require('./GeneralCommunicationHandler')
const UserSessionConnectionHandler = require('./UserSessionConnectionHandler')
const GameHandlerConfigurator = require('./ConwaysGameHandler')
const businessLogicManagersHolder = require('../domain/manager/businessLogicManagersHolder')
const logger = require('log4js').getLogger('Socket Event Handler')

module.exports = function (io, config) {
  /* const Promise = require("bluebird")
  Promise.promisifyAll(require("request")); */
  let userHandler = new UserSessionConnectionHandler(io, businessLogicManagersHolder)
  logger.info(`User Session Connection Handler created at ${userHandler.createdOn.toISOString()}`)

  let gCH = new GeneralCommunicationHandler(io, businessLogicManagersHolder)
  logger.info(`General Communication Handler created at ${gCH.createdOn.toISOString()}`)

  let cH = new ConnectionHandler(io, config, businessLogicManagersHolder)
  logger.info(`Connection Handler created at ${cH.createdOn.toISOString()}`)

  let cGH = new GameHandlerConfigurator(io, businessLogicManagersHolder)
  logger.info(`Game Handler Configurator created at ${cGH.createdOn.toISOString()}`)
}

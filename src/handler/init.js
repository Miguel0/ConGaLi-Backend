/**
 * This module coordinates the handler's instantiation across the system.
 */

const ConnectionHandler = require('./ConnectionHandler')
const GeneralCommunicationHandler = require('./GeneralCommunicationHandler')
const UserSessionConnectionHandler = require('./UserSessionConnectionHandler')
const GameHandlerConfigurator = require('./ConwaysGameHandler')
const businessLogicManagersHolder = require('../domain/manager/businessLogicManagersHolder')
const logger = require('log4js').getLogger('Socket Event Handler')

module.exports = function (io, config) {
  let cGH = new GameHandlerConfigurator(io, businessLogicManagersHolder)
  logger.info(`Game Handler Configurator created at ${cGH.createdOn.toISOString()}`)

  let userHandler = new UserSessionConnectionHandler(io, cGH, businessLogicManagersHolder)
  logger.info(`User Session Connection Handler created at ${userHandler.createdOn.toISOString()}`)

  let gCH = new GeneralCommunicationHandler(io, businessLogicManagersHolder)
  logger.info(`General Communication Handler created at ${gCH.createdOn.toISOString()}`)

  let cH = new ConnectionHandler(io, config, businessLogicManagersHolder)
  logger.info(`Connection Handler created at ${cH.createdOn.toISOString()}`)
}

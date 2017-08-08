/**
 * This module coordinates the logic manager's instantiation across the system.
 */

const logger = require('log4js').getLogger('Business Logic Manager')
const ConwaysGameBusinessLogicManager = require('./ConwaysGameBusinessLogicManager')
const GeneralCommunicationBusinessLogicManager = require('./GeneralCommunicationBusinessLogicManager')
const UserBusinessLogicManager = require('./UserBusinessLogicManager')
const StorageDAO = require('../../storage/StorageDAO')

let storageDAO = new StorageDAO()

logger.info('Creating Business Logic Managers...')

module.exports.ConwaysGameBusinessLogicManager = new ConwaysGameBusinessLogicManager(storageDAO)
module.exports.GeneralCommunicationBusinessLogicManager = new GeneralCommunicationBusinessLogicManager(storageDAO)
module.exports.UserBusinessLogicManager = new UserBusinessLogicManager(storageDAO)

logger.info(`Done creating Business Logic Managers...`)

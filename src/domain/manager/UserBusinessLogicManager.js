const logger = require('log4js').getLogger('Business Logic Manager')
const User = require('../model/User')

/**
 * This class defines the behavior for a service that deals with User operations
 * from the system to outer layers, such as one of the WebSocket handlers.
 */
class UserService {
  constructor (storageDAO) {
    this.createdOn = new Date()
    this.storageDAO = storageDAO
  }

  createUser (userData) {
    let newUser = new User()
    newUser.name = userData.user
    newUser.email = userData.email
    newUser.password = userData.password

    logger.debug(`Adding a user with data: ${JSON.stringify(userData)}`)

    newUser.checkIntegrity()
    return this.storageDAO.saveUser(newUser)
  }

  getUserById (userId) {
    logger.debug(`Retrieving a user with Id: ${userId}`)
    return this.storageDAO.getUserById(userId)
  }

  getUserByName (userName) {
    logger.debug(`Retrieving a user with name: ${userName}`)
    return this.storageDAO.getUserByName(userName)
  }
}

module.exports = UserService

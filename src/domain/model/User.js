const AppException = require('../../exception/AppException')

/**
 * This is a simple implementation of the user of the game. It lacks the security measure of encripting the password,
 * But it has the responsibility of knowing how to check it's own integrity and to create the JSON object that will
 * be handed to the potential game users.
 */
class User {
  constructor (data) {
    this.createdOn = new Date()
    this.id = null
    this.name = ''
    this.email = ''
    this.password = ''
    this.color = null
  }

  checkIntegrity () {
    if (!this.createdOn || !(this.createdOn instanceof Date)) {
      throw new AppException(
        'error.user.integrity.createdOn.title',
        'error.user.integrity.createdOn.body',
        { user: this.toJSONObject() }
      )
    }

    if (!this.name || !(typeof this.name === 'string' || this.name instanceof String)) {
      throw new AppException(
        'error.user.integrity.name.title',
        'error.user.integrity.name.body',
        { user: this.toJSONObject() }
      )
    }

    if (!this.password || !(typeof this.password === 'string' || this.password instanceof String)) {
      throw new AppException(
        'error.user.integrity.authData.title',
        'error.user.integrity.authData.body',
        { user: this.toJSONObject() }
      )
    }

    if (!this.color || !(typeof this.color === 'string' || this.color instanceof String) || !this.color.match(/^[a-f\d]{6}$/gi)) {
      throw new AppException(
        'error.user.integrity.color.title',
        'error.user.integrity.color.body',
        { user: this.toJSONObject() }
      )
    }
  }

  toJSONObject () {
    let json = {}

    json.id = this.id
    json.name = this.name
    json.createdOn = this.createdOn
    json.color = this.color

    return json
  }
}
module.exports = User

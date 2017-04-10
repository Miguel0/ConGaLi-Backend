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
  }

  checkIntegrity () {
    // TODO check integrity here
  }

  toJSONObject () {
    let json = {}

    json.id = this.id
    json.name = this.name
    json.createdOn = this.createdOn

    return json
  }
}
module.exports = User

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

  asJSONObject () {
    let json = {}

    json.id = this.id
    json.name = this.name
    json.createdOn = this.createdOn

    return json
  }
}
module.exports = User

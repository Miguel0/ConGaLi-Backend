class AppException {
  constructor (titleKey, bodyKey, extraArguments) {
    this.titleKey = titleKey
    this.bodyKey = bodyKey
    this.arguments = extraArguments || {}
  }

  toString () {
  	return JSON.stringify(this)
  }
}

module.exports = AppException

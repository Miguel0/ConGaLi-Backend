class AppException {
  constructor (titleKey, bodyKey, extraArguments) {
    this.titleKey = titleKey
    this.bodyKey = bodyKey
    this.arguments = extraArguments || {}
  }
}

module.exports = AppException

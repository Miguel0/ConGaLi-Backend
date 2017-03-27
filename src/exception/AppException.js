class AppException {
  constructor (titleKey, bodyKey, extraArguments) {
    this.titleKey = titleKey
    this.bodyKey = bodyKey

    if (extraArguments) {
      this.arguments = extraArguments
    }
  }

  isUnexpected () {
    return this.e !== undefined && (this.e instanceof Error)
  }

  toString () {
    return JSON.stringify(this)
  }
}

module.exports = AppException

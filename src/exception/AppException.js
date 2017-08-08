/**
 * AppException it's a model that represents an expected exception thrown by the application.
 * It can be converted to a JSON representation that holds several attributes that contains the
 * data that could be converted to a proper string that the system can show tothe client.
 *
 * The attributes held by the instances of this class are:
 * - createdOn: UTC date ISO string of the moment in which the instance of the AppException
 *              was created.
 * - scope: (Optional) This represents a namespace that can be nominated for semantic reasons.
 * - level: a String that reprents the level of severity this error represents:
            AppException.INFO || AppException.DEBUG || AppException.ERROR || AppException.WARNING
 * - titleKey: A short String of the generated error. This could be a key to be translated using a
 *             i18n framework.
 * - bodyKey: A String describing the reason of the exception. This could be a key to be translated
 *            using a i18n framework.
 * - e: The original exception, if any, that triggered the App Exception creation.
 * - arguments: JSON object that contains the arguments provided from the context and could help to
 *              understand the causes of the error.
 */

class AppException {
  constructor (titleKey, bodyKey, extraArguments) {
    let configHolder = {extraArguments: JSON.parse(JSON.stringify({value: extraArguments})).value}

    if (!bodyKey && !extraArguments) {
      configHolder = titleKey
      if (configHolder.e) {
        this.e = configHolder.e
      }
    } else {
      configHolder.titleKey = titleKey
      configHolder.bodyKey = bodyKey
    }

    this.createdOn = new Date().toISOString()
    this.titleKey = configHolder.titleKey
    this.bodyKey = configHolder.bodyKey
    this.scope = configHolder.scope || null
    this.level = configHolder.level || AppException.ERROR

    if (configHolder.extraArguments) {
      this.arguments = configHolder.extraArguments

      if (this.arguments.e) {
        this.e = this.arguments.e
        delete this.arguments.e
      }
    }
  }

  isUnexpected () {
    return this.e !== undefined && (this.e instanceof Error)
  }

  toString () {
    return JSON.stringify(this)
  }
}

AppException.prototype.INFO = 'INFO'
AppException.prototype.DEBUG = 'DEBUG'
AppException.prototype.ERROR = 'ERROR'
AppException.prototype.WARNING = 'WARNING'

module.exports = AppException

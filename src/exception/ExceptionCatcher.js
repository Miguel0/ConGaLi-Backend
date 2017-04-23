const AppException = require('./AppException')
const logger = require('log4js').getLogger('ExceptionCatcher')

class ExceptionCatcher {
  constructor (errorBroadcastFunction) {
    this.broadcastFunction = errorBroadcastFunction
  }

  dealWithException (e) {
    let exception = e

    if (!(exception instanceof AppException)) {
      exception = new AppException(
        'error.unexpectedError.title',
        'error.unexpectedError.body',
        JSON.stringify(e)
      )

      logger.error('Exception captured stacktrace:', e)
      logger.error('Exception captured stacktrace:', e.stack)
    }

    logger.error('About to be thrown}:', exception)

    this.broadcastFunction.call(this.broadcastFunction, exception)
  }

  runProtected (aFunction) {
    try {
      aFunction.apply()
    } catch (e) {
      this.dealWithException(e)
    }
  }
}

module.exports = ExceptionCatcher

const AppException = require('./AppException')
const logger = require('log4js').getLogger('ExceptionCatcher')

class ExceptionCatcher {
  constructor (errorBroadcastFunction) {
    this.errorBroadcastFunction = errorBroadcastFunction
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

    logger.error(JSON.stringify(exception))

    this.broadcastFunction.apply(this.broadcastFunction, exception)
  }
}

module.exports = ExceptionCatcher

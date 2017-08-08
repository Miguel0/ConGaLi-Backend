/**
 * ExceptionCatcher it's a class that implements the behavior needed to catch any exception thrown
 * inside a function received as argument in the runProtected method. In case of catching an exception,
 * it returns an AppException thrown deliverately from the internal behavior of the function called, or
 * an AppException that wraps other kinds of exceptions.
 */

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

      logger.error('Exception captured stacktrace: ', e)
      logger.error('Exception captured stacktrace: ', e.stack)
    }

    logger.error('About to be thrown: ', exception)

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

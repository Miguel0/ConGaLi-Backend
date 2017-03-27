const AppException = require('../exception/AppException')

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
        e.toString()
      )

      console.trace()
      console.error(e.stack)
    }

    console.error(JSON.stringify(exception))

    this.broadcastFunction.apply(exception)
  }
}

module.exports = ExceptionCatcher

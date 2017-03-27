const AppException = require('../exception/AppException')

class ExceptionCatcher {
  constructor (socket, io, gameName) {
    // TODO deal with the possibility to not knowing what socket will be calling this catcher
    this.socket = socket
    this.io = io
    this.gameName = this.gameName
  }

  dealWithException (e) {
    let exception = e
    
    if (!(exception instanceof AppException)) {
      exception = new AppException(
        'error.unexpectedError.title',
        'error.unexpectedError.body',
        e.toString()
      )
    }

    let receiver = this.io

    if (this.gameName) {
      receiver = receiver.to(this.gameName)
    }

    receiver.emit('appException', exception.toString())
  }
}

module.exports = ExceptionCatcher

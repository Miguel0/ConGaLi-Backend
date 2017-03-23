const AppException = require('../exception/Exception')

class ExceptionCatcher {

    constructor(socket, io) {
        // TODO deal with the possibility to not knowing what socket will be calling this catcher
        this.socket = socket
        this.io = io
    }

    wrappExecution(functionWrapped) {
        let self = this

        return clientData => {
            try {
                functionWrapped.apply(clientData, io, socket)
            } catch (e) {
                if (e instanceof AppException) {
                    // TODO deal with this eventualities in a mucho more fine grained manner
                    io.emit('appException', e)
                } catch {
                    console.log(JSON.stringify(e))
                }
            }
        }
    }
}

module.exports = (socket, io) => {
    return new ExceptionCatcher(socket, io)
}
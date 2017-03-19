const ConnectionHandler = require('./connectionHandler.js')

function HandlersConfigurator (io, storageHandler ) {
    ConnectionHandler(io, storageHandler)
}

module.exports = HandlersConfigurator
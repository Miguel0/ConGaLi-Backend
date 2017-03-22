const ConnectionHandler = require('./connectionHandler.js')

function HandlersConfigurator (io, storageHandler ) {
    new ConnectionHandler(io, storageHandler)
}

module.exports = HandlersConfigurator
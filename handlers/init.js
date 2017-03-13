function HandlersConfigurator (io, storageHandler ) {
    require('./connectionHandler.js')(io, storageHandler);
    require('./boardHandlerConfigurator.js')(io, storageHandler);
}

module.exports = HandlersConfigurator
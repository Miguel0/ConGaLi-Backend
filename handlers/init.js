function HandlersConfigurator (io, storageHandler ) {
    require('./connectionHandler.js')(io, storageHandler);
    require('./conwaysGameHandlerConfigurator.js')(io, storageHandler);
}

module.exports = HandlersConfigurator
function HandlersConfigurator (io, storageHandler ) {
    require('./connectionHandler.js')(io, storageHandler);
}

module.exports = HandlersConfigurator
function ConnectionHandlerConfigurator ( io, storageHandler ) {

    function onDisconnection() {

    }

    function onConnection(socket) {
        client.on('disconnect', onDisconnection);
    }
    
    io.on('connection', onConnection);
}

module.exports = ConnectionHandlerConfigurator;
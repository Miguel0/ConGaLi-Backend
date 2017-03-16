function ConnectionHandlerConfigurator ( io, storageHandler ) {

    function onDisconnection() {

    }

    function onConnection(socket) {
        socket.on('disconnect', onDisconnection);
    }
    
    io.on('connection', onConnection);
}

module.exports = ConnectionHandlerConfigurator;
function ConnectionHandlerConfigurator ( io, storageHandler ) {

    function onDisconnection(socket, close) {
    	console.log(`Socket with id #${socket.id} disconnected!!!!`)
    }

    function onConnection(socket) {
        socket.on('disconnect', (close) => onDisconnection(socket, close))

        require('./conwaysGameHandlerConfigurator.js')(io, storageHandler, socket);
        
        console.log(`Socket with id #${socket.id} connected!!!!`)
    }
    
    io.on('connection', onConnection)
}

module.exports = ConnectionHandlerConfigurator
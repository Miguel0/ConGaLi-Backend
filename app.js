const util = require('util');
const server = require('http').createServer();
const io = require('socket.io')(server);
const process = require('process');
const config = require('./config/config.dev.js');
	
// Starting App

const storage = require('./src/storage/init.js');
require('./src/handlers/init.js')(io, storage);
// Starting ws interface

server.listen(
    3000,
    () => {
        console.log(util.format('Listening as %s on %s on port %s', process.pid, config.hostName, config.port));
        console.log('This platform is ' + process.platform);
    }
);
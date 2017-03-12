
const util = require('util');
const server = require('http').createServer();
const io = require('socket.io')(server);
const process = require('process');
const port = 3000;

io.on('connection', function(client){
  client.on('event', function(data){});
  client.on('disconnect', function(){});
});

server.listen(
    3000,
    () => {
        console.log(util.format('Listening as %s on %s on port %s', process.pid, 'localhost', port));
        console.log('This platform is ' + process.platform);
    }
);
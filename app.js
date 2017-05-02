const server = require('http').createServer()
const io = require('socket.io')(server)
const process = require('process')
const logger = require('log4js').getLogger('Main App')

let configFileName = ''

switch (process.env.ENVIRONMENT) {
  case 'dev':
    configFileName = 'dev'
    logger.info('Building development config...')
    break;
  default:
    configFileName = 'prod'
    logger.info('Building production config...')
}

const config = require(`./config/config.${configFileName}`)

logger.info('Configuration read:')
logger.info(JSON.stringify(config))

logger.info('Starting App...')

require('./src/handler/init.js')(io, config)

server.listen(
    config.port,
    () => {
        logger.info(`Listening with PID ${process.pid} on ${config.hostName} on port ${config.port}`)
        logger.info(`This platform is ${process.platform}`)
    }
);

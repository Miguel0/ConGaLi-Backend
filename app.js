const app = require('express')()
const server = require('http').Server(app)

const io = require('socket.io')(server)
const process = require('process')
const logger = require('log4js').getLogger('Main App')

let programArgs = require('commander')

programArgs
  .version('0.0.1')
  .option('-e, --environment [String]', 'Environment option ["dev", "prod"]("prod" is the default and fallback configuration)')
  .parse(process.argv)

let configFileName = ''

switch (programArgs.environment) {
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


app.use((req, res, next) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header('Access-Control-Request-Method', '*')
  res.header('Access-Control-Allow-Methods', '*')

  next()
})

server.listen(
    config.port,
    () => {
        logger.info(`Listening with PID ${process.pid} on ${config.hostName} on port ${config.port}`)
        logger.info(`This platform is ${process.platform}`)
    }
);

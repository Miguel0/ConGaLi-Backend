function StorageConfigurator (config) {
  const storageDriver = require('./storage.js')(config)
  return storageDriver
}

module.exports = StorageConfigurator

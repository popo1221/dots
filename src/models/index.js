const util = require('util')
const mongoose = require('mongoose')
const config = require('../../config')
const logger = require('../common/logger')
const uri = util.format('mongodb://%s:%d/%s', config.mongodbHost, config.mongodbPort, config.mongodbDatabase)

//mongoose.set('debug', config.debug);

mongoose.connect(uri, 
// {
//     user: config.mongodbUserName,
//     pass: config.mongodbPassword,
// }, 
(err) => {
    if (err) {
        logger.error('connect to %s error: ', config.mongodbDatabase, err.message);
        process.exit(1)
    }
})

mongoose.connection.on('error', (err) => {
    logger.error('mongodb error: ' + err)
})

// models
require('./resource')

exports.Resource = mongoose.model('Resource')
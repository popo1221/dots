'use strict'

const mongoose = require('mongoose')
const {
    mongodbHost, 
    mongodbPort,
    mongodbDatabase,
} = require('../../config')
const logger = require('../common/logger')

const uri = `mongodb://${mongodbHost}:${mongodbPort}/${mongodbDatabase}`
mongoose.connect(uri, (err) => {
    if (err) {
        logger.error('connect to %s error: ', mongodbDatabase, message);
        process.exit(1)
    }
})

mongoose.connection.on('error', (err) => {
    logger.error('mongodb error: ' + err)
})

// models
require('./resource')

exports.Resource = mongoose.model('Resource')
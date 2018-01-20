'use strict'

const redis = require('redis')
const bluebird = require('bluebird')
const logger = require('./logger')
const config = require('../../config')


bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const client = redis.createClient(config.redisPort, config.redisHost)

client.on("error", function (error) {
    logger.error('redis error: ' + error)
})

client.on('end', function () {
    logger.info('redis服务器连接被断开')
})

module.exports = client
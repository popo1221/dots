'use strict';

var redis = require('./../common/redis');

module.exports = {
    sadd: async (infohash) => {
        await redis.saddAsync('infohash', infohash)
    },

    spop: async() => {
        return await redis.spopAsync('infohash')
    },
}
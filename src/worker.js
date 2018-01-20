'use strict'

const infohash = require('./redis/infohash')
const DHTSpider = require('dhtspider')

class Worker {
    constructor(port = 6881) {
        this.spider = new DHTSpider()
        this.spider.on('ensureHash', this.onInfoHash)
        this.spider.on('unensureHash', this.onInfoHash)
        this.spider.listen(port)

        console.log(`A DHT spider created on port ${port} `)
    }

    onInfoHash(hash) {
        console.log(hash)
        infohash.sadd(hash)
    }
}

// 创建一个worker
module.exports = (port) => new Worker(port)
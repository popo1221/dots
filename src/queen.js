'use strict';

/**
 * Worker - 收集infohash
 * Male   - 根据infohash下载torrent文件
 * Female - 解析torrent文件，存入mongodb
 */

const logger = require('./common/logger')
const util = require('util')
const Male = require('./male')
const Female = require('./female')
const Worker0 = require('./worker0')

const method = process.argv.slice(2)[0]
const port = process.argv.slice(2)[1]

if (method === 'male') {
    Male.run()
} else if (method === 'female') {
    Female.run()
} else {
    Worker0.create(port)

}
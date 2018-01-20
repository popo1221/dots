'use strict'

const fs = require('fs-extra')
const path = require('path')
const config = require('../config')
//    elasticsearch = require('elasticsearch'),
//    client = new elasticsearch.Client({
//        host: config.elasticsearchHost,
//        log: 'error'
//    }),
// const infohash = require('./redis/infohash')
// const sysInfo = require('./redis/sysInfo')
// const Resource = require('./proxy/resource')
// const logger = require('./common/logger')
const parseTorrentFile = require('parse-torrent-file')

const run = async () => {
    const dir = path.join(__dirname + '/../.temp/')
    const num = files.length
    let files = fs.readdirSync(dir)

    if (num <= 0) {
        // 等10s再启动
        setTimeout(next, 10 * 1000)
        return
    }

    let  file = files[Math.floor(num * Math.random())]
    let filePath = path.join(dir, file)
    let _id = file.split('.')[0].toLowerCase()
    let torrentData = null

    files = null

    try {
        // 尝试读取并且解析文件
        const content = fs.readFile(filePath)
        torrentData = parseTorrentFile(content)
    } catch (error) {
        // 删除
        torrentData = null
        fs.unlinkSync(filePath)
        next()
        return
    }

    // 记录到mongodb
    Resource.addResource(
        _id,
        torrentData.n,
        torrentData.f,
        torrentData.t,
        torrentData.s,
        (error, product) => {
            // 11000是_id重复了，忽略，为保证数据完整，再插入一次elasticsearch
            if (error && error.code !== 11000) {
                logger.error(error)

                // 删除torrent文件
                fs.unlinkSync(filePath)
                next()
            } else {
                // 新增成功，同步到elasticsearch
                sysInfo.incrInfohash()

                // 删除torrent文件
                fs.unlinkSync(filePath)
                next()
            }
        },
    )

    torrentData = null
}

const next = () => {
    setImmediate(run)
}

exports.run = run
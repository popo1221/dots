'use strict'

const fs = require('fs')
const path = require('path')
const config = require('../config')
const infohash = require('./redis/infohash')
const sysInfo = require('./redis/sysInfo')
const Resource = require('./proxy/resource')
const logger = require('./common/logger')
const torrent = require('./common/torrent')

const run = () => {
    const dir = path.join(__dirname + '/../.temp/')
    let files = fs.readdirSync(dir)
    const num = files.length

    if (num <= 0) {
        // 等10s再启动
        console.log('waiting......')
        setTimeout(next, 10 * 1000)
        return
    }

    const file = files[Math.floor(num * Math.random())]
    const filePath = path.join(dir, file)
    const _id = file.split('.')[0].toLowerCase()
    let torrentData = null

    files = null

    try {
        //console.log('尝试读取并且解析文件')
        // 尝试读取并且解析文件
        torrentData = torrent(fs.readFileSync(filePath))
    } catch (error) {
        // 删除
        console.error('---------------')
        console.error(error.message)
        console.error(_id.toUpperCase())
        console.error('---------------')
        torrentData = null
        fs.unlinkSync(filePath)
        next()
        return
    }

    // 记录到mongodb
    //console.log('记录到mongodb')
    Resource.addResource(_id, torrentData.n, torrentData.f, torrentData.t, torrentData.s, (error, product) => {
        if (error) {
            if (error.code === 11000) {
                console.log('==================================')
                console.error('已存在')
                console.log('==================================')
            } else {
                logger.error(error)
            }
            // 删除torrent文件
            fs.unlinkSync(filePath)
            next()
        } else {
            console.log(_id)
            //console.log('==================================')
            sysInfo.incrInfohash()

            // 删除torrent文件
            fs.unlinkSync(filePath)
            next()
        }
    })

    torrentData = null
}

const next = () => {
    setImmediate(run)
}

console.log('run')
run()
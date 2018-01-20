'use strict'

const path = require('path')
const fs = require('fs-extra')
const shuffle = require('shuffle-array')
const magnetToTorrent = require('magnet-to-torrent')
const infohash = require('./redis/infohash')
const logger = require('./common/logger')
const downloadTorrent = require('./common/download')
const failureInfohash = path.join(__dirname, '/../log/failureInfohash.txt')

const runMale = async () => {
    // 随机取出并且删除一个infohash
    let hash = await infohash.spop()
    
    // 转为大写
    hash = hash.toUpperCase()

    console.log(`${hash} downloading...`)

    try {
        const url = await magnetToTorrent.getLink(`magnet:?xt=urn:btih:${hash}`)
        console.log(`find torrent url ==> ${url}`)
        const filepath = path.join(__dirname, `/../.temp/${hash}.torrent`)
        await downloadTorrent(url, filepath)
    } catch(err) {
        console.log(err)
        failure(hash)
    }

    next()
}

// 记录失败的infohash
const failure = async (hash) => {
    const message = `magnet:?xt=urn:btih:${hash}\n`
    await fs.appendFile(failureInfohash, message)
}

const next = function () {
    setImmediate(runMale)
}

module.exports = runMale
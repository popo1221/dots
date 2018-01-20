'use strict'

const fs = require('fs')
const path = require('path')
const async = require('async')
const util = require('util')
const config = require('../config')
const infohash = require('./redis/infohash')
const logger = require('./common/logger')
const download = require('./common/download')

const run = () => {
    // 随机取出并且删除一个infohash
    infohash.spop((error, _infohash) => {
        if (error || !_infohash) {
            console.log('waiting.......')
            setTimeout(next, 3000)
            return
        }

        // 转为大写
        _infohash = _infohash.toUpperCase()

        // 随机生成一个队列
        const list = []
        const urls = [
            // util.format('http://zoink.it/torrent/%s.torrent', _infohash),
            // util.format('http://bt.box.n0808.com/%s/%s/%s.torrent', _infohash.substr(0, 2), _infohash.substr(_infohash.length - 2, 2), _infohash),
            // util.format('http://torrage.com/torrent/%s.torrent', _infohash),
            // util.format('http://torrage.luisaranguren.com/torrent/%s.torrent', _infohash),
            util.format('http://torcache.net/torrent/%s.torrent', _infohash),
        ]

        list.push(urls.splice(Math.floor(urls.length * Math.random()), 1)[0])
        while (urls.length) {
            list.push(Math.random() > 0.5 ? urls.pop() : urls.shift())
        }

        // 按照队列的顺序下载资源
        async.whilst(
            () => list.length > 0, 
            (callback) => {
                let url = list.pop()
                let timer = null

                // 下载3分钟，返回失败
                timer = setTimeout(function () {
                    callback(null)
                }, 3 * 60 * 1000)

                download(url, (err, data) => {
                    clearTimeout(timer)
                    if (err) {
                        // 下载失败，但是这里要响应为'成功'，以进入下一个地址的下载
                        callback(null)
                    } else {
                        console.log(url)
                        save(_infohash, data)
                        callback('success')
                    }
                })
            },
            (err) => {
                // err存在，主动断开，表示下载成功
                if (!err) {
                    // 下载失败，记录下来
                    console.log('fail: ' + _infohash)
                }
                next()
            },
        )
    })
}

// 保存文件
const save = (_infohash, data) => {
    const filePath = path.join(__dirname + '/../.temp/' + _infohash + '.torrent')
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            logger.error(err)
        }
    })
}

// 记录失败的infohash
const failure = (_infohash) => {
    const filePath = path.join(__dirname + '/../log/failureInfohash.txt')
    const message = util.format('magnet:?xt=urn:btih:%s\n', _infohash)

    fs.appendFile(filePath, message)
}

const next = () => {
    setImmediate(run)
}

run()
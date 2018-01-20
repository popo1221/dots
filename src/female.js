'use strict'

const fs = require('fs-extra')
const path = require('path')
const config = require('../config')
const Resource = require('./proxy/resource')
const parseTorrentFile = require('parse-torrent-file')
const torrentPath = path.join(__dirname, '/../.temp/')


// 获取主文件类型
const getFileType = (files) => {
    if (!files) {
        return ''
    }

    const mainFile = files.reduce((prev, next) => next.length > prev.length ? next : prev, {length: 0})
    return path.extname(mainFile['path.utf-8'] || mainFile['path'])
}

function buildResource(info) {
    const {
        files,
        infoHash,
    } = info
    
    if (files) {
        return {
            _id: infoHash,
            // 种子文件名
            name: String(info['name.utf-8'] || info.name),
            // 主文件类型
            type: getFileType(files),
            // 包含的文件列表
            files: files.map(file => ({
                size: file.length,
                name: (file['path.utf-8'] || file['path'])[file.path.length - 1].toString()
            })),
            // 总大小
            size: files.reduce((prev, next) => prev + next.length, 0),
        }
    } 

    const name = String(info['name.utf-8'] || info.name)
    return  {
        _id: infoHash,
        // 种子文件名
        name,
        // 主文件类型
        type: path.extname(name),
        // 包含的文件列表
        files: [
            {
                name,
                size: info.length,
            }
        ],
        // 总大小
        size: info.length,
    }
}

const run = async () => {
    let torrents = await fs.readdir(torrentPath)
    if (torrents.length <= 0) {
        // 等10s再启动
        setTimeout(next, 10 * 1000)
        return
    }

    for (let torrent of torrents) {
        const filepath = path.join(torrentPath, torrent)
        try {
            // 尝试读取并且解析文件
            const content = await fs.readFile(filepath)
            const torrentData = parseTorrentFile(content)
            await Resource.addResource(buildResource(torrentData))
            console.log(`${torrent} added`)
        } catch (error) {
            // await fs.unlink(filepath)
        }
        // 删除
        await fs.unlink(filepath)
    }

    next()
}

const next = () => {
    setImmediate(run)
}

module.exports = run
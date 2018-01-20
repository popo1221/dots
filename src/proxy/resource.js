const { Resource } = require('../models')
const config = require('../../config')

// 新增一个资源
exports.addResource = async (resource) => {
    const instance = new Resource({
        ...resource
    })
    await instance.save()
}

// 根据infohash获取资源
exports.getResourceByInfohash = async (infohash) => {
    return await Resource.findOne({_id: infohash})
}

// 热度+1
exports.incrResource = async (infohash) => {
    const resource = await Resource.findOne({_id: infohash})
    if (!resource) return 

    // , function (err, resource) {
    //     if (err || !resource) {
    //         return
    //     }

    //     // 只保留2周
    //     for (let i = resource.hs.length - 1; i >= 0; i--) {
    //         if (moment.utc(resource.hs[i].t).isBefore(moment.utc().subtract(config.hotCounts || 14, 'day'))) {
    //             // 删除
    //             resource.hs.splice(i, 1)
    //         } else {
    //             break
    //         }
    //     }

    //     // 更新最近2周的热度
    //     var now = moment.utc().format('YYYY-MM-DD')
    //     if (!resource.hs || resource.hs.length <= 0) {
    //         resource.hs = [
    //             {t: now, v: 1}
    //         ]
    //     } else if (moment.utc(now).isSame(resource.hs[0].t, 'day')) {
    //         ++resource.hs[0].v
    //     } else {
    //         resource.hs.unshift({t: now, v: 1})
    //     }

    //     //刷新最新热度
    //     resource.h = resource.hs[0].v

    //     // 刷新更新时间
    //     resource.u = moment.utc()

    //     // 保存
    //     resource.markModified('hs')
    //     resource.save()
    // })
}
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Resource = new Schema({

    // 设置_id为infohash
    _id: { type: String, required: true },

    // name 资源名称
    name: { type: String, required: true },

    // type 资源类型
    type: {type: String },

    // size 资源总大小
    size: {type: Number },

    // files 包含文件
    files: [
        {
            _id: false,
            // name 文件名
            name: { type: String },
            // size 文件大小
            size: { type: Number, default: 0 }
        }
    ],

    // hot 最新热度值
    hot: { type: Number, default: 0 },

    // hots 最近2周热度值, key:value 例如: 12-20:1000
    hots: [
        {
            _id: false,
            // 时间
            time: { type: String },
            // 热度值
            value: { type: Number, default: 0 }
        }
    ],

    // createDate 收录时间
    createdDate: { type: Date, default: Date.now },

    // updateDate 更新时间
    updatedDate: { type: Date, default: Date.now },

    // disable 是否被禁用
    disable: { type: Boolean },

})

mongoose.model('Resource', Resource)
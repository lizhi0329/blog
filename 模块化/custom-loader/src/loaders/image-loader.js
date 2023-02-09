
const images = require('images')
const fs = require('fs')
// 根据全路径取文件后缀
// const { getExtByPath } = require('../utils')
// const { CleanPlugin } = require('webpack')

const schema = {
    type: 'object',
    properties: {
        quality: {
            type: 'number'
        }
    }
}
module.exports = function (content) {
    const options = this.getOptions(schema) || { quality: 50 }
    const { quality } = options
    // console.log(this);
    const ext = 'png'
    // const ext = getExtByPath(this)
    const tempname = `./temp.${ext}`
    // 根据传入的压缩程度，生成一张新图片
    images(content).save(tempname, { quality })
    // 读取新图片的内容
    const newContent = fs.readFileSync(tempname)
    fs.unlinkSync(tempname)
    // 返回新图片的内容
    return newContent
}
module.exports.raw = true
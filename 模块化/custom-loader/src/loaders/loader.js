// ./src/loaders/loader.js
module.exports = function (source) {
    // source 为compiler 传递给 loader 的一个文件的源内容
    // const options = this.getOptions();
    // console.log(source, this.query);

    return source.replace('li', this.query.name);
}
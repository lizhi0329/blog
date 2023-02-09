class FileList {
  static defaultOptions = {
    outputFile: 'assets.md',
  };

  constructor(options = {}) {
    // 可以接收自定义的options，如文件名等，进行合并
    this.options = { ...FileList.defaultOptions, ...options };
  }
  apply(compiler) {
    // 在 emit 钩子里执行，他是异步钩子，所以我们需要使用tapAsync来注册，并且必须调用cb函数
    compiler.hooks.emit.tapAsync('FileList', (compilation, cb) => {
      const fileListName = this.options.outputFile;
      // compilation.assets有我们所有的资源文件
      let len = Object.keys(compilation.assets).length;
      // 
      console.log(compilation.assets, 'assets');
      let content = `# 一共有${len}个文件\n\n`;
      // 遍历资源文件，获取name进行拼接
      for (let filename in compilation.assets) {
        content += `- ${filename}\n`
      }
      // 在compilation.assets这资源对象中新添加一个名为fileListName的文件
      compilation.assets[fileListName] = {
        // 文件内容
        source: function () {
          return content;
        },
        // 文件的长度
        size: function () {
          return content.length;
        }
      }
      cb()
    })
  }
}

module.exports = FileList;
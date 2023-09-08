class ChunkTestPlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    const options = this.options;

    compiler.hooks.thisCompilation.tap("ChunkTestPlugin", (compilation) => {
      compilation.hooks.optimizeChunks.tap("ChunkTestPlugin", (chunks) => {
        console.log('chunks: ', chunks);
        
        // return true;
      });
    });
  }
}

module.exports = ChunkTestPlugin;

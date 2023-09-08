let less = require('less');

const IS_MODULE_IMPORT =
  /^~([^/]+|[^/]+\/|@[^/]+[/][^/]+|@[^/]+\/?|@[^/]+[/][^/]+\/)$/;

function lessLoader(source) {
  const callback = this.async();
  // console.log(source, 'source');
  less.render(source).then((output) => {
    // console.log(output, 'output');
    callback(null, output.css);
  }, (err) => {
    console.log(err);
  })
}

module.exports = lessLoader
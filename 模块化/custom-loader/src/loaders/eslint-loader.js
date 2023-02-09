const childProcess = require('child_process')
// const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

const exec = (command, cb) => {
  // console.log('$ ' + command);
    childProcess.exec(command, (error, stdout) => {
        cb && cb(error, stdout)
    })
}
const schema = {
    type: 'object',
    properties: {
        fix: 'boolean'
    }
}
let id = 0

module.exports = function (content) {
    const resourcePath = this.resourcePath
    const callback = this.async()
    const command = `npx eslint ${resourcePath}`
    // console.log(resourcePath);
    const fix = this.query
    if (fix) {
      const tempName = `./${id++}.js`
      const fullPath = path.resolve(__dirname, tempName)
      // 写入新文件
      fs.writeFileSync(fullPath, content, { encoding: 'utf8' })
      const command = `npx eslint ${fullPath} --fix`
      exec(command, (error, stdout) => {
        if (error) {
          // chalk.red(stdout)
          console.log(stdout);
        }
        const newContent = fs.readFileSync(fullPath, { encoding: 'utf8' })
        fs.unlinkSync(fullPath)
        callback(null, newContent)
      })
      return
    }
    exec(command, (error, stdout) => {
        if (error) {
          // chalk.red(stdout)
          console.log(stdout);
        }
        callback(null, content)
    })
}
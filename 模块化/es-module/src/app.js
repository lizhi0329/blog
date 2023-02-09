// 命名输出，支持as重命名
// import { test, getName, name as newName } from './modules/1.js'
// 整体输入
// import * as m1 from './modules/1.js'

// console.log(getName(), m1, test(), newName);

console.log('main.js开始执行')
import say from './modules/3.js'
import say1 from './modules/4.js'
console.log('main.js执行完毕')

import('./modules/5.js').then((res) => {
  console.log(res, 'res');
})
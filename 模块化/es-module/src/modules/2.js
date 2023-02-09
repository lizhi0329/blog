// 重定向导出

export * from './1.js' // 第一种方式
export { name, getName } from './1.js' // 第二种方式
export {  name as otherName } from './1.js' //第三种方式
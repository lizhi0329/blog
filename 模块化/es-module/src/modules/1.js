// 命名输出
export const name = 'es module'
export const getName = () => {
  return name
}
export function test(){
  return name
}

// 指定输出的一组变量
const year = 2023
const age = 18
export {
  year,
  age,
  // 支持重命名 通过as
  name as newName
}

// 默认输出
// 一个模块中只能有一个默认导出export default， 即只能使用一次
export default test
// export default {
//   test,
//   name
// }
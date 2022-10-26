// // 作用：将css内容，通过style标签插入到页面中
// // source为要处理的css源文件
// function loader(source) {
//   let style = `
//     let style = document.createElement('style');
//     style.setAttribute("type", "text/css"); 
//     style.innerHTML = ${source};
//     document.head.appendChild(style)`;
//   return style;
// }
// module.exports = loader;


function loader(source) {
  console.log(source)
  return `export default ${ JSON.stringify(source) }`;
}

module.exports =  loader
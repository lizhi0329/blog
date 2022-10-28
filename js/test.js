// let a = () => {
//   setTimeout(() => {
//     console.log('任务队列函数1')
//   }, 3000)
//   for (let i = 0; i < 5; i++) {
//     console.log('a的for循环')
//   }
//   console.log('a事件执行完')
// }
// let b = () => {
//   setTimeout(() => {
//     console.log('任务队列函数2')
//   }, 0)
//   for (let i = 0; i < 5; i++) {
//     console.log('b的for循环')
//   }
//   console.log('b事件执行完')
// }
// let c = () => {
//   setTimeout(() => {
//     console.log('任务队列函数3')
//   }, 0)
//   for (let i = 0; i < 5; i++) {
//     console.log('c的for循环')
//   }
//   console.log('c事件执行完')
// }


// a();
// b();
// c();

    // 执行顺序问题，考察频率挺高的，先自己想答案**
    setTimeout(function () {
      console.log(1);
  });
  new Promise(function(resolve,reject){
      console.log(2)
      resolve(3)
  }).then(function(val){
      console.log(val);
  })
  console.log(4);
[].includes
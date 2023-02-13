
const buttonEle = document.createElement('button')
buttonEle.innerHTML = 'btn'
document.body.appendChild(buttonEle)

buttonEle.onclick = function () {
  import("./test").then((module) => {
    const print = module.default;
    print();
  });
};
function ref(value) {
  // if (isRef(value)) {
  //   return value;
  // }
  let _value = value;
  // const dep = new Dep();
  return Object.defineProperty(
    {
      get value() {
        console.log("收集");
        return _value;
      },
      set value(newValue) {
        console.log("触发");
        _value = newValue;
        // dep.notify();
      },
    },
    "value",
    {
      enumerable: true,
    }
  );
}

export default ref;

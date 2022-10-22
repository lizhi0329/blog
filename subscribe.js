class PubSub {
  constructor () {
    this.events = {}
  }
  // 订阅
  on(type, cb) {
    if (this.events[type]) {
      this.events[type].push(cb)
      return
    }
    this.events[type] = [cb]
  }
}
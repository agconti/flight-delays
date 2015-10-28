class Airport {

  constructor(airport, parent){
    this.name = airport.name
    this.delay = airport.delay
    this.reason = airport.reason
    this.parent = parent
    this.children = parent.children
  }

  set reason (reason) {
    if (this.reason !== reason) {
      let reasonElement = this.children.filter(el => el.className = 'reason')[0]
      this.reason = reason
      reasonElement.innerHTML = reason
    }
  }
  
  set delay (delay) {
    if (this.delay !== delay) {
      let delayElement = this.children.filter(el => el.className = 'delay')[0]
      this.delay = delay
      delayElement.innerHTML = delay
    }
  }
}

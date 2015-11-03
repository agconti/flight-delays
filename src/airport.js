export class Airport {

  constructor(airport, el){
    this.el = el
    this.children = this.el.children
    this.IATA = airport.IATA
    this.delay = airport.delay
    this.reason = airport.status.reason
  }

   update(property, value) {
    let el

    if (this[property] !== value) {

      let i = 0
        , childrenLength = this.children.length
      for (; i < this.children.length; i++) {
        let child = this.children[i]

        if (child.classList.contains(property)){
          el = child
          break
        }
      }

      el.innerHTML = value
      this[property] = value
    }

  }
}

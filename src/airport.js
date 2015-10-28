export class Airport {

  constructor(airport, el){
    this.el = el
    this.children = this.el.children
    this.IATA = airport.IATA
    this.delay = airport.delay
    this.reason = airport.status.reason
  }

   update(property, value) {

    if (this[property] !== value) {

      let el
        , prop
        , child
      for (prop in this.children){
        let child = this.children[prop]

        if (child.className == property){
          el = child
        }
      }

      el.innerHTML = value
      this[property] = value
    }

  }
}

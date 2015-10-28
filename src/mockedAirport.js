function MockedAirport () {
  this.IATA = 'JFK'
  this.delay = false
  this.status = { reason: 'Things are great!' }
}


function airportFactory () {
  let airport = new MockedAirport()
  const number = Math.random()

  if (number > 0.5) {
    airport.delay = !airport.delay
    airport.status.reason = `Oh no, we're delayed: Reference Code: ${number}`
  }

  return airport
}

export function getAirport(url){
  return new Promise((res, rej) => {

    setTimeout(() => {
      let airport = airportFactory()
      res(airport)
    }, 500)
  })
}

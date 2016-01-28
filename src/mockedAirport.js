import {airportCodes} from './airports'
import {delayReasons} from './delayReasons'


class MockedAirport {
  constructor(airport, delay, status){
    this.IATA = airport
    this.delay = delay
    this.status = status
  }
  chooseDelay(reasons){
    let reason = this.getRandomItem(reasons)
    this.status = { reason }
  }
  getRandomItem(array){
    return array[Math.floor(Math.random() * array.length)]
  }
}


function airportFactory (airportCode) {
  const number = Math.random()
  let airport = new MockedAirport(airportCode, false, { reason: 'Things are great!' })

  if (number > 0.5) {
    airport.delay = true
    airport.chooseDelay(delayReasons)
  }

  return airport
}

export function getAirport(url){
  return new Promise((res, rej) => {
   let airportCode = url.split(/[\/|?]+/)[4]

    setTimeout(() => {
      let airport = airportFactory(airportCode)
      res(airport)
    }, 300)
  })
}

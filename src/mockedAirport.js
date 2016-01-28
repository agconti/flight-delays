import {airportCodes} from './airports'
import {delayReasons} from './delayReasons'


class MockedAirport {
  constructor(airports, delay, status){
    this.delay = delay
    this.status = status || { reason: 'Things are great!' }
    this.chooseAirport(airports)
  }
  chooseAirport(airports){
    this.IATA = this.getRandomItem(airports)
  }
  chooseDelay(reasons){
    this.status.reason = this.getRandomItem(reasons)
  }
  getRandomItem(array){
    return array[Math.floor(Math.random() * array.length)]
  }
}


function airportFactory () {
  const number = Math.random()
  let airport = new MockedAirport(airportCodes, false)

  if (number > 0.5) {
    airport.delay = true
    airport.chooseDelay(delayReasons)
  }

  return airport
}

export function getAirport(url){
  return new Promise((res, rej) => {

    setTimeout(() => {
      let airport = airportFactory()
      res(airport)
    }, 300)
  })
}

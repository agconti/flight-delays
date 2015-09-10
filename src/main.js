import {airportCodes} from 'airports'

let main = document.getElementsByTagName('main')[0]
  , airportCodesStream =  Rx.Observable.fromArray(airportCodes)
  , requestUrlStream = airportCodesStream
      .map(code => `http://services.faa.gov/airport/status/${code}?format=json`)
  , responseStream = requestUrlStream
      .flatMap((url) => Rx.Observable.fromPromise(jQuery.getJSON(url)))

responseStream.subscribe((airport) => {
  let delay = airport.delay
    , p = document.createElement('p')

  if (delay === 'true'){
    p.classList.add('delay')
  }
  p.innerHTML += `${airport.IATA} | Delay: ${delay} reason: ${airport.status.reason}`
  main.appendChild(p)
})

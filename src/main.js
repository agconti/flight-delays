import {airportCodes} from './airports'
import {Airport} from './airport'


let main = document.getElementsByTagName('main')[0]
  , airportCodesStream =  Rx.Observable.fromArray(airportCodes)
  , requestUrlStream = airportCodesStream
      .map(code => `http://services.faa.gov/airport/status/${code}?format=json`)
  , responseStream = requestUrlStream
      .flatMap((url) => Rx.Observable.fromPromise(getAirport(url)))
  , intervalResponseStream = Rx.Observable.interval(3000).timeInterval().flatMap(interval => responseStream)

responseStream
  .subscribe(airportData => {
    airportData.delay = JSON.parse(airportData.delay)

    let source = document.getElementById("airport-template").innerHTML
      , template = Handlebars.compile(source)
      , airportTemplate = template(airportData)
      , el = $(airportTemplate)[0]
      , airport = new Airport(airportData, el)


    let delayUpdateStream = intervalResponseStream
      .filter(airportData => airportData.delay !== airport.delay)
      .subscribe( airportData => {
                    airport.update('delay', airportData.delay)
                    airport.update('reason', airportData.status.reason)
                  }
                , err => console.error(err))

    main.appendChild(el)


    }
  , err => console.error(err)
  )

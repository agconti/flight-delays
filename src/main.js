import {airportCodes} from './airports'
import {Airport} from './airport'


let main = document.getElementsByTagName('main')[0]
  , airportCodesStream =  Rx.Observable.fromArray(airportCodes)
  , requestUrlStream = airportCodesStream
      .map(code => `http://services.faa.gov/airport/status/${code}?format=json`)
  , responseStream = requestUrlStream
      .flatMap((url) => Rx.Observable.fromPromise(getAirport(url)))
      // .flatMap((url) => Rx.Observable.fromPromise(jQuery.getJSON(url)))
  , intervalResponseStream = Rx.Observable.interval(1000).timeInterval().take(3).flatMap(interval => responseStream)

responseStream
  .subscribe((airportData) => {
    airportData.delay = JSON.parse(airportData.delay)

    let source = document.getElementById("airport-template").innerHTML
      , template = Handlebars.compile(source)
      , airportTemplate = template(airportData)
      , el = $(airportTemplate)[0]

    main.appendChild(el)

    let airport = new Airport(airportData, el)

    intervalResponseStream
      .filter(airportData => airportData.delay !== airport.delay)
      .subscribe((airportData) => {
          airport.update('delay', airportData.delay)
        }
      , err => console.error(err)
      )

    intervalResponseStream
      .filter(airportData => airportData.status.reason !== airport.reason)
      .subscribe((airportData) => { airport.update('reason', airportData.status.reason)}
                , err => console.error(err)
                )

    }
  , err => console.error(err)
  )

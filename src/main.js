import {airportCodes} from 'airports'

let main = document.getElementsByTagName('main')[0]
  , airportCodesStream =  Rx.Observable.fromArray(airportCodes)
  , requestUrlStream = airportCodesStream
      .map(code => `http://services.faa.gov/airport/status/${code}?format=json`)
  , responseStream = requestUrlStream
      .flatMap((url) => Rx.Observable.fromPromise(jQuery.getJSON(url)))
  , intervalResponseStream = Rx.Observable.interval(3000).timeInterval().flatMap(interval => responseStream)

responseStream
  .subscribe((airportData) => {
    airportData.delay = JSON.parse(airportData.delay)

    let source = document.getElementById("airport-template").innerHTML
      , template = Handlebars.compile(source)
      , airportTemplate = template(airportData)
    console.log(airportTemplate.parentNode)

    let airport = new Airport(airportData, airportTemplate.parent)
    intervalResponseStream
      .filter(airportData => airportData.delay !== airport.delay)
      .subscribe((airportData) => {
          airport.delay = airportData.delay
        }
      , err => console.error(err)
      )

      intervalResponseStream
        .filter(airportData => airportData.reason !== airport.reason)
        .subscribe((airportData) => {
            airport.reason = airportData.reason
          }
        , err => console.error(err)
        )

    main.innerHTML += airportTemplate
    }
  , err => console.error(err)
  )

import {airportCodes} from 'airports'

let main = document.getElementsByTagName('main')[0]
  , airportCodesStream =  Rx.Observable.fromArray(airportCodes)
  , intervalStream = Rx.Observable.interval(1000).flatMap(interval => airportCodesStream)
  , requestUrlStream = intervalStream
      .map(code => `http://services.faa.gov/airport/status/${code}?format=json`)
  , responseStream = requestUrlStream
      .flatMap((url) => Rx.Observable.fromPromise(jQuery.getJSON(url)))

responseStream
  .subscribe((airport) => {
    airport.delay = JSON.parse(airport.delay)

    let source = document.getElementById("airport-template").innerHTML
      , template = Handlebars.compile(source)
      , airportTemplate = template(airport)

    main.innerHTML += airportTemplate
    }
  , err => console.error(err)
  )

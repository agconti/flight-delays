import {airportCodes} from 'airports'

let airportsRef = new Firebase("https://publicdata-airports.firebaseio.com/")
  , main = document.getElementsByTagName('main')[0]


airportCodes.forEach((code) => {

  airportsRef.child(code).on("value", (data) => {
    let airport = data.val()
      , delay = airport.delay
      , p = document.createElement('p')

    if (delay){
      p.classList.add('delay')
    }
    p.innerHTML += `${airport.IATA} | Delay: ${airport.delay} reason: ${airport.status.reason}`
    main.appendChild(p)
  })
})

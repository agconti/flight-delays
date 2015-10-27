'use strict';

var airportCodes = ['ATL', 'BNA', 'BOS', 'BWI', 'CLE', 'CLT', 'CVG', 'DCA', 'DEN', 'DFW', 'DTW', 'EWR', 'FLL', 'IAD', 'IAH', 'IND', 'JFK', 'LAS', 'LAX', 'LGA', 'MCI', 'MCO', 'MDW', 'MEM', 'MIA', 'MSP', 'ORD', 'PDX', 'PHL', 'PHX', 'PIT', 'RDU', 'SAN', 'SEA', 'SFO', 'SJC', 'SLC', 'STL', 'TEB', 'TPA'];
'use strict';

var main = document.getElementsByTagName('main')[0],
    airportCodesStream = Rx.Observable.fromArray(airportCodes),
    intervalStream = Rx.Observable.interval(1000).flatMap(function (interval) {
  return airportCodesStream;
}),
    requestUrlStream = intervalStream.map(function (code) {
  return 'http://services.faa.gov/airport/status/' + code + '?format=json';
}),
    responseStream = requestUrlStream.flatMap(function (url) {
  return Rx.Observable.fromPromise(jQuery.getJSON(url));
});

responseStream.subscribe(function (airport) {
  var delay = airport.delay,
      p = document.createElement('p');

  if (delay === 'true') {
    p.classList.add('delay');
  }
  p.innerHTML += airport.IATA + ' | Delay: ' + delay + ' reason: ' + airport.status.reason;
  main.appendChild(p);
}, function (err) {
  return console.error(err);
});
//# sourceMappingURL=all.js.map

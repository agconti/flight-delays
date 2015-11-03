"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Airport = (function () {
  function Airport(airport, el) {
    _classCallCheck(this, Airport);

    this.el = el;
    this.children = this.el.children;
    this.IATA = airport.IATA;
    this.delay = airport.delay;
    this.reason = airport.status.reason;
  }

  _createClass(Airport, [{
    key: "update",
    value: function update(property, value) {
      var el = undefined;

      if (this[property] !== value) {

        var i = 0,
            childrenLength = this.children.length;
        for (; i < this.children.length; i++) {
          var child = this.children[i];

          if (child.classList.contains(property)) {
            el = child;
            break;
          }
        }

        el.innerHTML = value;
        this[property] = value;
      }
    }
  }]);

  return Airport;
})();
'use strict';

var airportCodes = ['ATL', 'BNA', 'BOS', 'BWI', 'CLE', 'CLT', 'CVG', 'DCA', 'DEN', 'DFW', 'DTW', 'EWR', 'FLL', 'IAD', 'IAH', 'IND', 'JFK', 'LAS', 'LAX', 'LGA', 'MCI', 'MCO', 'MDW', 'MEM', 'MIA', 'MSP', 'ORD', 'PDX', 'PHL', 'PHX', 'PIT', 'RDU', 'SAN', 'SEA', 'SFO', 'SJC', 'SLC', 'STL', 'TEB', 'TPA'];
'use strict';

var main = document.getElementsByTagName('main')[0],
    airportCodesStream = Rx.Observable.fromArray(airportCodes),
    requestUrlStream = airportCodesStream.map(function (code) {
  return 'http://services.faa.gov/airport/status/' + code + '?format=json';
}),
    responseStream = requestUrlStream
// .flatMap((url) => Rx.Observable.fromPromise(getAirport(url)))
.flatMap(function (url) {
  return Rx.Observable.fromPromise(jQuery.getJSON(url));
}),
    intervalResponseStream = Rx.Observable.interval(3000).timeInterval().take(3).flatMap(function (interval) {
  return responseStream;
});

responseStream.subscribe(function (airportData) {
  airportData.delay = JSON.parse(airportData.delay);

  var source = document.getElementById("airport-template").innerHTML,
      template = Handlebars.compile(source),
      airportTemplate = template(airportData),
      el = $(airportTemplate)[0],
      airport = new Airport(airportData, el);

  intervalResponseStream.filter(function (airportData) {
    return airportData.delay !== airport.dealy;
  }).subscribe(function (airportData) {
    airport.update('delay', airportData.delay);
  }, function (err) {
    return console.error(err);
  });
  intervalResponseStream.filter(function (airportData) {
    return airportData.status.reason !== airport.reason;
  }).subscribe(function (airportData) {
    airport.update('reason', airportData.status.reason);
  }, function (err) {
    return console.error(err);
  });

  main.appendChild(el);
}, function (err) {
  return console.error(err);
});
'use strict';

function MockedAirport() {
  this.IATA = 'JFK';
  this.delay = false;
  this.status = { reason: 'Things are great!' };
}

function airportFactory() {
  var airport = new MockedAirport();
  var number = Math.random();

  if (number > 0.5) {
    airport.delay = !airport.delay;
    airport.status.reason = 'Oh no, we\'re delayed: Reference Code: ' + number;
  }

  return airport;
}

function getAirport(url) {
  return new Promise(function (res, rej) {

    setTimeout(function () {
      var airport = airportFactory();
      res(airport);
    }, 500);
  });
}
//# sourceMappingURL=all.js.map

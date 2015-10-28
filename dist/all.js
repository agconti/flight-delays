'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Airport = (function () {
  function Airport(airport, parent) {
    _classCallCheck(this, Airport);

    this.name = airport.name;
    this.delay = airport.delay;
    this.reason = airport.reason;
    this.parent = parent;
    this.children = parent.children;
  }

  _createClass(Airport, [{
    key: 'reason',
    set: function set(reason) {
      if (this.reason !== reason) {
        var reasonElement = this.children.filter(function (el) {
          return el.className = 'reason';
        })[0];
        this.reason = reason;
        reasonElement.innerHTML = reason;
      }
    }
  }, {
    key: 'delay',
    set: function set(delay) {
      if (this.delay !== delay) {
        var delayElement = this.children.filter(function (el) {
          return el.className = 'delay';
        })[0];
        this.delay = delay;
        delayElement.innerHTML = delay;
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
    responseStream = requestUrlStream.flatMap(function (url) {
  return Rx.Observable.fromPromise(jQuery.getJSON(url));
}),
    intervalResponseStream = Rx.Observable.interval(3000).timeInterval().flatMap(function (interval) {
  return responseStream;
});

responseStream.subscribe(function (airportData) {
  airportData.delay = JSON.parse(airportData.delay);

  var source = document.getElementById("airport-template").innerHTML,
      template = Handlebars.compile(source),
      airportTemplate = template(airportData);
  console.log(airportTemplate.parentNode);

  var airport = new Airport(airportData, airportTemplate.parent);
  intervalResponseStream.filter(function (airportData) {
    return airportData.delay !== airport.delay;
  }).subscribe(function (airportData) {
    airport.delay = airportData.delay;
  }, function (err) {
    return console.error(err);
  });

  intervalResponseStream.filter(function (airportData) {
    return airportData.reason !== airport.reason;
  }).subscribe(function (airportData) {
    airport.reason = airportData.reason;
  }, function (err) {
    return console.error(err);
  });

  main.innerHTML += airportTemplate;
}, function (err) {
  return console.error(err);
});
//# sourceMappingURL=all.js.map

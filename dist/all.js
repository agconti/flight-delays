'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
    key: 'toggleDelay',
    value: function toggleDelay(el, delayed) {
      if (delayed) {
        el.classList.remove('ontime');
        return el.classList.add('delayed');
      }
      el.classList.remove('delayed');
      el.classList.add('ontime');
    }
  }, {
    key: 'update',
    value: function update(property, value) {
      var el = undefined;

      if (this[property] !== value) {

        var i = 0,
            childrenLength = this.children.length;
        for (; i < this.children.length; i++) {
          var child = this.children[i];

          if (child.classList.contains(property)) {
            el = child;

            if (property === 'delay') {
              this.toggleDelay(el, value);
            }

            break;
          }
        }

        el.innerHTML = property.toUpperCase() + ': ' + value;
        this[property] = value;
      }
    }
  }]);

  return Airport;
})();
'use strict';

var airportCodes = ['ATL', 'BNA', 'BOS', 'BWI', 'CLE', 'CLT', 'CVG', 'DCA', 'DEN', 'DFW', 'DTW', 'EWR', 'FLL', 'IAD', 'IAH', 'IND', 'JFK', 'LAS', 'LAX', 'LGA', 'MCI', 'MCO', 'MDW', 'MEM', 'MIA', 'MSP', 'ORD', 'PDX', 'PHL', 'PHX', 'PIT', 'RDU', 'SAN', 'SEA', 'SFO', 'SJC', 'SLC', 'STL', 'TEB', 'TPA'];
'use strict';

var delayReasons = ['Geese! Everywhere. OH MY GOD.', 'A nasty blizzard is dumping 10 feet of snow.', 'Severe Thunderstorms.', 'Tornadoes.', 'Sharknadoes.', 'Extreme flooding.', 'Low visibility.', 'Lot\'s of fog.', 'Fuel shortage.'];
'use strict';

var main = document.getElementsByTagName('main')[0],
    airportCodesStream = Rx.Observable.fromArray(airportCodes),
    requestUrlStream = airportCodesStream.map(function (code) {
  return 'http://services.faa.gov/airport/status/' + code + '?format=json';
}),
    responseStream = requestUrlStream.flatMap(function (url) {
  return Rx.Observable.fromPromise(getAirport(url));
}),
    intervalResponseStream = Rx.Observable.interval(3000).timeInterval().flatMap(function (interval) {
  return responseStream;
});

responseStream.subscribe(function (airportData) {
  airportData.delay = JSON.parse(airportData.delay);

  var source = document.getElementById("airport-template").innerHTML,
      template = Handlebars.compile(source),
      airportTemplate = template(airportData),
      el = $(airportTemplate)[0],
      airport = new Airport(airportData, el);

  var delayUpdateStream = intervalResponseStream.filter(function (airportData) {
    return airportData.delay !== airport.delay;
  }).subscribe(function (airportData) {
    airport.update('delay', airportData.delay);
    airport.update('reason', airportData.status.reason);
  }, function (err) {
    return console.error(err);
  });

  main.appendChild(el);
}, function (err) {
  return console.error(err);
});
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MockedAirport = (function () {
  function MockedAirport(airport, delay, status) {
    _classCallCheck(this, MockedAirport);

    this.IATA = airport;
    this.delay = delay;
    this.status = status;
  }

  _createClass(MockedAirport, [{
    key: 'chooseDelay',
    value: function chooseDelay(reasons) {
      var reason = this.getRandomItem(reasons);
      this.status = { reason: reason };
    }
  }, {
    key: 'getRandomItem',
    value: function getRandomItem(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
  }]);

  return MockedAirport;
})();

function airportFactory(airportCode) {
  var number = Math.random();
  var airport = new MockedAirport(airportCode, false, { reason: 'Things are great!' });

  if (number > 0.5) {
    airport.delay = true;
    airport.chooseDelay(delayReasons);
  }

  return airport;
}

function getAirport(url) {
  return new Promise(function (res, rej) {
    var airportCode = url.split(/[\/|?]+/)[4];

    setTimeout(function () {
      var airport = airportFactory(airportCode);
      res(airport);
    }, 300);
  });
}
//# sourceMappingURL=all.js.map

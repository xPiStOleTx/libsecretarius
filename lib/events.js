(function() {
  var Source, listen, ports, url;

  Source = null;

  url = '/sseupdate';

  listen = function(cb) {
    var emit, sse;
    emit = function(name) {
      return function(event) {
        var msg;
        msg = {
          data: JSON.parse(event.data),
          name: name
        };
        return cb(msg);
      };
    };
    sse = new Source(url);
    sse.addEventListener('changed', emit('changed'), false);
    sse.addEventListener('inbox', emit('inbox'), false);
    sse.addEventListener('deleted', emit('deleted'), false);
    return sse.addEventListener('new', emit('new'), false);
  };

  if (typeof module !== "undefined" && module !== null) {
    Source = require('eventsource');
    module.exports = function(host, cb) {
      url = "" + host + url;
      return listen(cb);
    };
  } else {
    Source = EventSource;
    ports = [];
    self.addEventListener('connect', (function(e) {
      var port;
      ports.push(port = e.ports[0]);
      return port.start();
    }));
    listen(function(msg) {
      var port, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = ports.length; _i < _len; _i++) {
        port = ports[_i];
        _results.push(port.postMessage(msg));
      }
      return _results;
    });
  }

}).call(this);

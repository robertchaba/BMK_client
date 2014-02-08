/*
 Jasmine-Ajax : a set of helpers for testing AJAX requests under the Jasmine
 BDD framework for JavaScript.

 Supports both Prototype.js and jQuery.

 http://github.com/pivotal/jasmine-ajax

 Jasmine Home page: http://pivotal.github.com/jasmine

 Copyright (c) 2008-2010 Pivotal Labs

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

// Jasmine-Ajax interface
var ajaxRequests = [];

function mostRecentAjaxRequest() {
  if (ajaxRequests.length > 0) {
    return ajaxRequests[ajaxRequests.length - 1];
  } else {
    return null;
  }
}

function clearAjaxRequests() {
  ajaxRequests = [];
}

// Fake XHR for mocking Ajax Requests & Responses
function FakeXMLHttpRequest() {
  var extend = Object.extend || $.extend;
  extend(this, {
    requestHeaders: {},

    open: function() {
      this.method = arguments[0];
      this.url = arguments[1];
      this.readyState = 1;
    },

    setRequestHeader: function(header, value) {
      this.requestHeaders[header] = value;
    },

    abort: function() {
      this.readyState = 0;
    },

    readyState: 0,

    onreadystatechange: function(isTimeout) {
    },

    status: null,

    send: function(data) {
      this.params = data;
      this.readyState = 2;
    },

    getResponseHeader: function(name) {
      return this.responseHeaders[name];
    },

    getAllResponseHeaders: function() {
      var responseHeaders = [];
      for (var i in this.responseHeaders) {
        if (this.responseHeaders.hasOwnProperty(i)) {
          responseHeaders.push(i + ': ' + this.responseHeaders[i]);
        }
      }
      return responseHeaders.join('\r\n');
    },

    responseText: null,

    response: function(response) {
      this.status = response.status;
      this.responseText = response.responseText || "";
      this.readyState = 4;
      this.responseHeaders = response.responseHeaders ||
      {"Content-type": response.contentType || "application/json" };
      // uncomment for jquery 1.3.x support
      // jasmine.Clock.tick(20);

      this.onreadystatechange();
    },
    responseTimeout: function() {
      this.readyState = 4;
      jasmine.Clock.tick(jQuery.ajaxSettings.timeout || 30000);
      this.onreadystatechange('timeout');
    }
  });

  return this;
}


jasmine.Ajax = {

  isInstalled: function() {
    return jasmine.Ajax.installed == true;
  },

  assertInstalled: function() {
    if (!jasmine.Ajax.isInstalled()) {
      throw new Error("Mock ajax is not installed, use jasmine.Ajax.useMock()")
    }
  },

  useMock: function() {
    if (!jasmine.Ajax.isInstalled()) {
      var spec = jasmine.getEnv().currentSpec;
      spec.after(jasmine.Ajax.uninstallMock);

      jasmine.Ajax.installMock();
    }
  },

  installMock: function() {
    if (typeof jQuery != 'undefined') {
      jasmine.Ajax.installJquery();
    } else if (typeof Prototype != 'undefined') {
      jasmine.Ajax.installPrototype();
    } else {
      throw new Error("jasmine.Ajax currently only supports jQuery and Prototype");
    }
    jasmine.Ajax.installed = true;
  },

  installJquery: function() {
    jasmine.Ajax.mode = 'jQuery';
    jasmine.Ajax.real = jQuery.ajaxSettings.xhr;
    jQuery.ajaxSettings.xhr = jasmine.Ajax.jQueryMock;

  },

  installPrototype: function() {
    jasmine.Ajax.mode = 'Prototype';
    jasmine.Ajax.real = Ajax.getTransport;

    Ajax.getTransport = jasmine.Ajax.prototypeMock;
  },

  uninstallMock: function() {
    jasmine.Ajax.assertInstalled();
    if (jasmine.Ajax.mode == 'jQuery') {
      jQuery.ajaxSettings.xhr = jasmine.Ajax.real;
    } else if (jasmine.Ajax.mode == 'Prototype') {
      Ajax.getTransport = jasmine.Ajax.real;
    }
    jasmine.Ajax.reset();
  },

  reset: function() {
    jasmine.Ajax.installed = false;
    jasmine.Ajax.mode = null;
    jasmine.Ajax.real = null;
  },

  jQueryMock: function() {
    var newXhr = new FakeXMLHttpRequest();
    ajaxRequests.push(newXhr);
    return newXhr;
  },

  prototypeMock: function() {
    return new FakeXMLHttpRequest();
  },

  installed: false,
  mode: null
}


// Jasmine-Ajax Glue code for Prototype.js
if (typeof Prototype != 'undefined' && Ajax && Ajax.Request) {
  Ajax.Request.prototype.originalRequest = Ajax.Request.prototype.request;
  Ajax.Request.prototype.request = function(url) {
    this.originalRequest(url);
    ajaxRequests.push(this);
  };

  Ajax.Request.prototype.response = function(responseOptions) {
    return this.transport.response(responseOptions);
  };
}

(function() {
  function extend(destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }
    return destination;
  }

  function MockAjax(global) {
    var requestTracker = new RequestTracker(),
      stubTracker = new StubTracker(),
      realAjaxFunction = global.XMLHttpRequest,
      mockAjaxFunction = fakeRequest(requestTracker, stubTracker);

    this.install = function() {
      global.XMLHttpRequest = mockAjaxFunction;
    };

    this.uninstall = function() {
      global.XMLHttpRequest = realAjaxFunction;
    };

    this.stubRequest = function(url) {
      var stub = new RequestStub(url);
      stubTracker.addStub(stub);
      return stub;
    };

    this.withMock = function(closure) {
      this.install();
      try {
        closure();
      } finally {
        this.uninstall();
      }
    };

    this.requests = requestTracker;
    this.stubs = stubTracker;
  }

  function StubTracker() {
    var stubs = [];

    this.addStub = function(stub) {
      stubs.push(stub);
    };

    this.reset = function() {
      stubs = [];
    };

    this.findStub = function(url) {
      for (var i = stubs.length - 1; i >= 0; i--) {
        var stub = stubs[i];
        if (stub.url === url) {
          return stub;
        }
      }
    };
  }

  function fakeRequest(requestTracker, stubTracker) {
    function FakeXMLHttpRequest() {
      requestTracker.track(this);
    }

    extend(FakeXMLHttpRequest.prototype, window.XMLHttpRequest);
    extend(FakeXMLHttpRequest.prototype, {
      requestHeaders: {},

      open: function() {
        this.method = arguments[0];
        this.url = arguments[1];
        this.username = arguments[3];
        this.password = arguments[4];
        this.readyState = 1;
      },

      setRequestHeader: function(header, value) {
        this.requestHeaders[header] = value;
      },

      abort: function() {
        this.readyState = 0;
      },

      readyState: 0,

      onload: function() {
      },

      onreadystatechange: function(isTimeout) {
      },

      status: null,

      send: function(data) {
        this.params = data;
        this.readyState = 2;

        var stub = stubTracker.findStub(this.url);
        if (stub) {
          this.response(stub);
        }
      },

      data: function() {
        var data = {};
        if (typeof this.params !== 'string') { return data; }
        var params = this.params.split('&');

        for (var i = 0; i < params.length; ++i) {
          var kv = params[i].replace(/\+/g, ' ').split('=');
          var key = decodeURIComponent(kv[0]);
          data[key] = data[key] || [];
          data[key].push(decodeURIComponent(kv[1]));
          data[key].sort();
        }
        return data;
      },

      getResponseHeader: function(name) {
        return this.responseHeaders[name];
      },

      getAllResponseHeaders: function() {
        var responseHeaders = [];
        for (var i in this.responseHeaders) {
          if (this.responseHeaders.hasOwnProperty(i)) {
            responseHeaders.push(i + ': ' + this.responseHeaders[i]);
          }
        }
        return responseHeaders.join('\r\n');
      },

      responseText: null,

      response: function(response) {
        this.status = response.status;
        this.responseText = response.responseText || "";
        this.readyState = 4;
        this.responseHeaders = response.responseHeaders ||
          {"Content-type": response.contentType || "application/json" };

        this.onload();
        this.onreadystatechange();
      },

      responseTimeout: function() {
        this.readyState = 4;
        jasmine.clock().tick(30000);
        this.onreadystatechange('timeout');
      }
    });

    return FakeXMLHttpRequest;
  }

  function RequestTracker() {
    var requests = [];

    this.track = function(request) {
      requests.push(request);
    };

    this.first = function() {
      return requests[0];
    };

    this.count = function() {
      return requests.length;
    };

    this.reset = function() {
      requests = [];
    };

    this.mostRecent = function() {
      return requests[requests.length - 1];
    };

    this.at = function(index) {
      return requests[index];
    };
  }

  function RequestStub(url) {
    this.url = url;

    this.andReturn = function(options) {
      this.status = options.status || 200;

      this.contentType = options.contentType;
      this.responseText = options.responseText;
    };
  }

  if (typeof window === "undefined" && typeof exports === "object") {
    exports.MockAjax = MockAjax;
    jasmine.Ajax = new MockAjax(exports);
  } else {
    window.MockAjax = MockAjax;
    jasmine.Ajax = new MockAjax(window);
  }
}());

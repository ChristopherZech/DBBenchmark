// Generated by CoffeeScript 1.8.0
var Chart, ChartManager, Configurator, DiskList, EventEmitter, SelectList, SelectListManager, Serie, chartManager, selectCallBack, start, theChart,
  __slice = [].slice,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Configurator = (function() {
  var config;

  function Configurator() {}

  config = null;

  Configurator.get = function() {
    if (config == null) {
      config = $.getJSON("../assets/fullConfig.json").responseJSON;
    }
    return config;
  };

  Configurator.getComputer = function() {
    var computer, _results;
    _results = [];
    for (computer in this.get()) {
      if (computer !== "layouts" && computer !== "tests") {
        _results.push(computer);
      }
    }
    return _results;
  };

  Configurator.getHdd = function(computer) {
    var d, _i, _len, _ref, _results;
    console.log(this.get()[computer]);
    _ref = this.get()[computer].disks;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      d = _ref[_i];
      _results.push(d.replace("/dev/", ""));
    }
    return _results;
  };

  Configurator.getLayouts = function() {
    var key, _results;
    _results = [];
    for (key in this.get().layouts) {
      _results.push(key);
    }
    return _results;
  };

  Configurator.getTests = function() {
    var test, _i, _len, _ref, _results;
    console.log(this.get().tests);
    _ref = this.get().tests;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      test = _ref[_i];
      _results.push(test.name);
    }
    return _results;
  };

  return Configurator;

})();

EventEmitter = (function() {
  function EventEmitter() {
    this.events = {};
  }

  EventEmitter.prototype.emit = function() {
    var args, event, listener, _i, _len, _ref;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!this.events[event]) {
      return false;
    }
    _ref = this.events[event];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      listener.apply(null, args);
    }
    return true;
  };

  EventEmitter.prototype.addListener = function(event, listener) {
    var _base;
    this.emit('newListener', event, listener);
    ((_base = this.events)[event] != null ? _base[event] : _base[event] = []).push(listener);
    return this;
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.once = function(event, listener) {
    var fn;
    fn = (function(_this) {
      return function() {
        _this.removeListener(event, fn);
        return listener.apply(null, arguments);
      };
    })(this);
    this.on(event, fn);
    return this;
  };

  EventEmitter.prototype.removeListener = function(event, listener) {
    var l;
    if (!this.events[event]) {
      return this;
    }
    this.events[event] = (function() {
      var _i, _len, _ref, _results;
      _ref = this.events[event];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l !== listener) {
          _results.push(l);
        }
      }
      return _results;
    }).call(this);
    return this;
  };

  EventEmitter.prototype.removeAllListeners = function(event) {
    delete this.events[event];
    return this;
  };

  return EventEmitter;

})();

Chart = (function() {
  function Chart(id, title) {
    this.id = id;
    this.title = title;
    this.chartData = {
      chart: {
        zoomType: "xy"
      },
      title: {
        text: ""
      },
      series: [],
      yAxis: {
        title: {
          text: "Time in s"
        },
        min: 0
      },
      xAxis: {
        title: {
          text: "Size in MB"
        }
      }
    };
    console.log(JSON.stringify(this.chartData));
  }

  Chart.prototype.addSerie = function(serie) {
    this.chartData.series.push(serie.get());
    return console.log(this.chartData);
  };

  Chart.prototype.getChartData = function() {
    return this.chartData;
  };

  Chart.prototype.draw = function() {
    console.log("THE CHART: " + JSON.stringify(this.getChartData()));
    console.log($("#" + this.id));
    return $("#" + this.id).highcharts(this.getChartData());
  };

  return Chart;

})();

ChartManager = (function() {
  function ChartManager() {
    this.currentChart = new Chart("currentChart", "Noch kein Name vergeben");
    this.currentChart.draw();
  }

  ChartManager.prototype.addSerie = function(serieConfig) {
    var aSerie;
    this.serieConfig = serieConfig;
    aSerie = new Serie(this.serieConfig.computer, this.serieConfig.hdd, this.serieConfig.test, this.serieConfig.layout);
    aSerie.color = Highcharts.getOptions().colors[this.currentChart.chartData.series.length];
    this.currentChart.addSerie(aSerie);
    return this.currentChart.draw();
  };

  return ChartManager;

})();

Serie = (function() {
  function Serie(computer, disk, test, layout, chartType) {
    this.computer = computer;
    this.disk = disk;
    this.test = test;
    this.layout = layout;
    this.chartType = chartType != null ? chartType : "line";
    this.query();
    this.formatData();
  }

  Serie.prototype.query = function() {
    $.ajaxSetup({
      async: false
    });
    return this.rawData = $.getJSON("../results/" + this.computer + "-" + this.disk + "-" + this.test + "-" + this.layout + ".json").responseJSON;
  };

  Serie.prototype.formatData = function() {
    var d, _i, _len, _ref;
    this.data = [];
    if (this.chartType === "line") {
      if (this.rawData.measurements.length === 1) {
        this.data.push([0, this.rawData.measurements[0].duration / 1000000000]);
      }
      _ref = this.rawData.measurements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        this.data.push([d.size / 1024, d.duration / 1000000000]);
      }
    } else {
      this.data.push(this.rawData.measurements[0].duration / 1000000000);
    }
    return 0;
  };

  Serie.prototype.get = function() {
    return {
      type: this.chartType,
      name: this.test,
      data: this.data
    };
  };

  return Serie;

})();

SelectList = (function(_super) {
  __extends(SelectList, _super);

  function SelectList(id, multiple, values) {
    this.id = id;
    this.multiple = multiple != null ? multiple : false;
    this.values = values;
    this.clickHandler = __bind(this.clickHandler, this);
    this.render();
    this.setEventHandler();
  }

  SelectList.prototype.setEventHandler = function() {
    return $("#" + this.id + " a").on("click", this.clickHandler);
  };

  SelectList.prototype.clickHandler = function(event) {
    if (!this.multiple) {
      $(event.target).parent().children().removeClass("active");
    }
    if (!$(event.target).hasClass("active")) {
      $(event.target).addClass("active");
    } else {
      $(event.target).removeClass("active");
    }
    return event.preventDefault();
  };

  SelectList.prototype.getValue = function() {
    if ($("#" + this.id + " a.active").length === 1) {
      return $("#" + this.id + " a.active").text();
    } else {
      return getValues();
    }
  };

  SelectList.prototype.getValues = function() {
    var element, _i, _len, _ref, _results;
    _ref = $("#" + this.id);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      if ($(element).hasClass("active")) {
        _results.push($(element).text());
      } else {

      }
    }
    return _results;
  };

  SelectList.prototype.render = function() {
    var e, html, _i, _len, _ref;
    html = "";
    _ref = this.values;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      html += "<a class='list-group-item' href='#'>" + e + "</a>";
    }
    return $("#" + this.id).html(html);
  };

  return SelectList;

})(EventEmitter);

DiskList = (function(_super) {
  __extends(DiskList, _super);

  function DiskList() {
    return DiskList.__super__.constructor.apply(this, arguments);
  }

  return DiskList;

})(SelectList);

selectCallBack = function() {
  return this.getValue();
};

SelectListManager = (function() {
  function SelectListManager() {
    this.hddInit = __bind(this.hddInit, this);
    this.config = Configurator.get();
    console.log(this.config);
    this.run();
  }

  SelectListManager.prototype.run = function() {
    this.initSelectLists();
    return $("#computer a").on("click", (function(_this) {
      return function() {
        return _this.hddInit();
      };
    })(this));
  };

  SelectListManager.prototype.initSelectLists = function() {
    this.initComputer();
    this.initLayout();
    return this.initTest();
  };

  SelectListManager.prototype.initComputer = function() {
    return this.computerSelect = new SelectList("computer", false, Configurator.getComputer());
  };

  SelectListManager.prototype.hddInit = function() {
    console.log(this.computerSelect.getValue());
    this.selectedComputer = this.computerSelect.getValue();
    return this.hddSelect = new SelectList("hdd", false, Configurator.getHdd(this.selectedComputer));
  };

  SelectListManager.prototype.initLayout = function() {
    return this.layoutSelect = new SelectList("layout", false, Configurator.getLayouts());
  };

  SelectListManager.prototype.initTest = function() {
    return this.testSelect = new SelectList("test", false, Configurator.getTests());
  };

  SelectListManager.prototype.getValues = function() {
    return {
      computer: this.computerSelect.getValue(),
      hdd: this.hddSelect.getValue(),
      layout: this.layoutSelect.getValue(),
      test: this.testSelect.getValue()
    };
  };

  return SelectListManager;

})();

$.ajaxSetup({
  async: false
});

theChart = null;

chartManager = null;

start = function() {
  var selectListManager;
  selectListManager = new SelectListManager();
  chartManager = new ChartManager();
  return $("#addBtn").on("click", function() {
    chartManager.addSerie(selectListManager.getValues());
    console.log("click");
    return theChart = chartManager;
  });
};

$(document).ready(start);

"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * visual.js
 * 
 * Visualization 메뉴 스크립트
 */
// E-Chart 인스턴스
var chartInstance = {
  cpu: null // 차트 데이터

};
var chartData = {
  cpu: {
    value: [],
    category: []
  }
};

var createChart = function createChart(type, data) {
  var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '%';
  var option = {
    // title: {
    //   text: type.toUpperCase()
    // },
    bindto: '#visual_' + type,
    data: {
      x: 'x',
      columns: [data[type].category].concat(_toConsumableArray(data[type].data))
    },
    axis: {
      x: {
        type: 'category'
      }
    },
    tooltip: {
      format: {
        value: function value(val) {
          return val + unit;
        }
      }
    }
  };
  console.log('Create', option);
  chartInstance[type] = c3.generate(option);
};

var updateChart = function updateChart(type, data) {
  chartInstance[type].load({
    columns: [data[type].category].concat(_toConsumableArray(data[type].data))
  });
};
/**
 * E-Chart에 사용할 수 있는 타입으로 데이터 전처리
 * 
 * @param {any} data ES 조회 데이터
 */


var dataProcessing = function dataProcessing(data) {
  var dataList = data.body.hits.hits.reverse();
  var cpu = {
    user: [],
    system: [],
    steal: [],
    irq: [],
    softirq: [],
    nice: [],
    iowait: []
  };
  var memory = {
    total: 0,
    free: 0,
    used: [],
    swap: []
  };
  var network = {
    "in": {
      dropped: [],
      bytes: [],
      packets: [],
      errors: []
    },
    out: {
      dropped: [],
      bytes: [],
      packets: [],
      errors: []
    }
  };

  function timeToString(x) {
    function padding(d) {
      d = d.toString();
      return d.length === 1 ? '0' + d : d;
    }

    var _ = new Date(x);

    var h = padding(_.getHours());
    var m = padding(_.getMinutes());
    var s = padding(_.getSeconds());
    return "".concat(h, ":").concat(m, ":").concat(s);
  }

  var cpuCategoryData = ['x'];
  dataList.filter(function (d) {
    return d._source.metricset.name === 'cpu';
  }).forEach(function (d) {
    var cpuInfo = d._source.system.cpu;
    cpuCategoryData.push(timeToString(d._source['@timestamp']));
    cpu.user.push(parseFloat((cpuInfo.user.pct || 0) * 100).toFixed(2));
    cpu.system.push(parseFloat((cpuInfo.system.pct || 0) * 100).toFixed(2));
    cpu.steal.push(parseFloat((cpuInfo.steal.pct || 0) * 100).toFixed(2));
    cpu.irq.push(parseFloat((cpuInfo.irq.pct || 0) * 100).toFixed(2));
    cpu.softirq.push(parseFloat((cpuInfo.softirq.pct || 0) * 100).toFixed(2));
    cpu.nice.push(parseFloat((cpuInfo.nice.pct || 0) * 100).toFixed(2));
    cpu.iowait.push(parseFloat((cpuInfo.iowait.pct || 0) * 100).toFixed(2)); // cpu.idle.push(parseFloat((cpuInfo.idle.pct || 0) * 100).toFixed(2))
    // cpu.total.push(parseFloat((cpuInfo.total.pct || 0) * 100).toFixed(2))
  });
  var cpuChartData = [];
  Object.keys(cpu).forEach(function (k) {
    cpuChartData.push([k].concat(_toConsumableArray(cpu[k])));
  });
  var memoryCategoryData = ['x'];
  dataList.filter(function (d) {
    return d._source.metricset.name === 'memory';
  }).forEach(function (d) {
    var memInfo = d._source.system.memory;
    memoryCategoryData.push(timeToString(d._source['@timestamp']));
    memory.total = memInfo.total;
    memory.free = memInfo.free;
    memory.used.push(parseFloat((memInfo.used.pct || 0) * 100).toFixed(2));
    memory.swap.push(parseFloat((memInfo.swap.pct || 0) * 100).toFixed(2));
  });
  var memoryChartData = [];
  memoryChartData.push(['used'].concat(_toConsumableArray(memory.used)));
  memoryChartData.push(['swap'].concat(_toConsumableArray(memory.swap)));
  var networkCategoryData = ['x'];
  dataList.filter(function (d) {
    return d._source.metricset.name === 'network';
  }).forEach(function (d) {
    var networkInfo = d._source.system.network;
    networkCategoryData.push(timeToString(d._source['@timestamp']));
    network["in"].dropped.push(networkInfo["in"].dropped);
    network["in"].bytes.push(networkInfo["in"].bytes);
    network["in"].packets.push(networkInfo["in"].packets);
    network["in"].errors.push(networkInfo["in"].errors);
    network.out.dropped.push(networkInfo.out.dropped);
    network.out.bytes.push(networkInfo.out.bytes);
    network.out.packets.push(networkInfo.out.packets);
    network.out.errors.push(networkInfo.out.errors);
  });
  var networkChartData = {
    "in": [],
    out: []
  };
  Object.keys(network).forEach(function (k) {
    Object.keys(network[k]).forEach(function (nk) {
      networkChartData[k].push([k + ':' + nk].concat(_toConsumableArray(network[k][nk])));
    });
  });
  var res = {
    cpu: {
      category: cpuCategoryData,
      data: cpuChartData
    },
    memory: {
      category: memoryCategoryData,
      data: memoryChartData
    },
    network: {
      category: networkCategoryData,
      data: networkChartData
    }
  };
  console.log(res);
  return res;
};

var pollingGroup = [];

var registPollingGroup = function registPollingGroup(handler) {
  pollingGroup.push(handler);
};

var poll = function poll() {
  var tick = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;
  setTimeout(function () {
    getMetricData(function (data) {
      var pData = dataProcessing(data);
      pollingGroup.forEach(function (h) {
        return h(pData);
      });
    });

    if (true) {
      poll();
    }
  }, tick);
};
/**
 * Metric 정보 수집
 */


var getMetricData = function getMetricData(callback) {
  $.ajax({
    url: '/API/getMetric',
    type: 'GET',
    dataType: 'JSON',
    success: function success(res) {
      callback(res);
    },
    error: function error(jqXHR, state) {
      console.error(jqXHR, state);
      callback();
    }
  });
};

$(function () {
  getMetricData(function (mData) {
    var pData = dataProcessing(mData);
    createChart('cpu', pData);
    createChart('memory', pData);
    registPollingGroup(function (data) {
      updateChart('cpu', data);
      updateChart('memory', data);
    });
    poll();
  });
});
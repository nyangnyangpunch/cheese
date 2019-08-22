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
  chartInstance[type] = c3.generate({
    bindto: '#visual_' + type,
    data: {
      columns: data[type]
    }
  });
};

var updateChart = function updateChart(type, data) {
  chartInstance[type].load({
    columns: data[type].data
  });
};
/**
 * E-Chart에 사용할 수 있는 타입으로 데이터 전처리
 * 
 * @param {any} data ES 조회 데이터
 */


var dataProcessing = function dataProcessing(data) {
  var dataList = data.body.hits.hits;
  var cpu = {
    total: [],
    user: [],
    system: [],
    nice: [],
    idle: [],
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
  var cpuCategoryData = [];
  dataList.filter(function (d) {
    d._source.metricset.name === 'cpu';
  }).forEach(function (d) {
    var cpuInfo = d._source.system.cpu;
    cpuCategoryData.push(d._source['@timestamp']);
    cpu.total.push(cpuInfo.total.pct);
    cpu.user.push(cpuInfo.user.pct);
    cpu.system.push(cpuInfo.system.pct);
    cpu.nice.push(cpuInfo.nice.pct);
    cpu.idle.push(cpuInfo.idle.pct);
    cpu.iowait.push(cpuInfo.iowait.pct);
  });
  var cpuChartData = [];
  Object.keys(cpu).forEach(function (k) {
    cpuChartData.push([k].concat(_toConsumableArray(cpu[k])));
  });
  var memoryCategoryData = [];
  dataList.filter(function (d) {
    d._source.metricset.name === 'memory';
  }).forEach(function (d) {
    var memInfo = d._source.system.memory;
    memoryCategoryData.push(d._source['@timestamp']);
    memory.total = memInfo.total;
    memory.free = memInfo.free;
    memory.used.push(memInfo.used.pct);
    memory.swap.push(memInfo.swap.pct);
  });
  var memoryChartData = [];
  memoryChartData.push(['used'].concat(_toConsumableArray(memory.used)));
  memoryChartData.push(['swap'].concat(_toConsumableArray(memory.swap)));
  var networkCategoryData = [];
  dataList.filter(function (d) {
    d._source.metricset.name === 'network';
  }).forEach(function (d) {
    var networkInfo = d._source.system.network;
    networkCategoryData.push(d._source['@timestamp']);
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
    data: {
      q: 'cpu'
    },
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
    registPollingGroup(function (data) {
      updateChart('cpu', data);
    });
    poll();
  });
});
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
    columns: data[type]
  });
};
/**
 * E-Chart에 사용할 수 있는 타입으로 데이터 전처리
 * 
 * @param {any} data ES 조회 데이터
 */


var dataProcessing = function dataProcessing(data) {
  var dataList = data.body.hits.hits.filter(function (d) {
    return d._source.service && d._source.service.type === 'system';
  });
  var timestamp = [];
  var cpu = {
    user: [],
    system: [],
    nice: [],
    idle: [],
    iowait: []
  };
  dataList.forEach(function (d) {
    timestamp.push(d._source['@timestamp']);
  });
  dataList.forEach(function (d) {
    var cpuInfo = d._source.system.cpu; // const cores = cpuInfo.cores

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
  var res = {
    category: timestamp,
    cpu: cpuChartData
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
    registPollingGroup(function (data) {
      updateChart('cpu', data);
    });
    poll();
  });
});
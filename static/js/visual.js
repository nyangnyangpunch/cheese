"use strict";

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
  var option = {
    title: {
      text: type.toUpperCase() + ' Metric data'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function formatter(params) {
        return 'Value: ' + params[0].data;
      },
      axisPointer: {
        animation: false
      },
      xAxis: {
        type: 'category',
        data: data.category
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        type: 'line',
        data: data[type].series
      }]
    }
  };
  chartInstance[type] = echarts.init(document.getElementById('visual_' + type));
  chartInstance[type].setOption(option);
};

var updateChart = function updateChart(type, data) {
  chartInstance[type].setOption({
    xAxis: {
      data: data.category
    },
    series: data[type].series
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
    cpuChartData.push({
      name: k,
      type: 'line',
      data: cpu[k]
    });
  });
  var res = {
    category: timestamp,
    cpu: {
      series: cpuChartData
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
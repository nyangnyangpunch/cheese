"use strict";

/**
 * visual.js
 * 
 * Visualization 메뉴 스크립트
 */
var testChart = null;
var globalValue = null;
var globalCategory = null;

var createTestChart = function createTestChart() {
  var testChartOption = {
    title: {
      text: 'Metric data test'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function formatter(params) {
        params = params[0];
        var date = new Date(params.name);
        return date.toLocaleString();
      },
      axisPointer: {
        animation: false
      },
      xAxis: {
        type: 'category',
        splitLine: {
          show: false
        },
        data: globalCategory
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      series: [{
        name: 'Test',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: globalValue
      }]
    }
  };
  testChart = echarts.init(document.getElementById('visual'));
  testChart.setOption(testChartOption);
};
/**
 * E-Chart에 사용할 수 있는 타입으로 데이터 전처리
 * 
 * @param {any} data ES 조회 데이터
 */


var dataProcessing = function dataProcessing(data) {
  var dataList = data.body.hits.hits.filter(function (d) {
    return d._source.metricset && d._source.metricset.name === 'process';
  });
  var value = dataList.map(function (d) {
    var cpuInfo = d._source.system.process.cpu;
    return cpuInfo.total.value;
  });
  var category = dataList.map(function (d) {
    var date = new Date(d._source['@timestamp']);
    return [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
  });
  var res = {
    value: value,
    category: category
  };
  console.log(res);
  return res;
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
    globalValue = pData.value;
    globalCategory = pData.category;
    createTestChart();
    setInterval(function () {
      getMetricData(function (mmData) {
        globalValue.shift();
        globalCategory.shift();
        globalValue.push(dataProcessing(mmData).value[0]);
        globalCategory.push(dataProcessing(mmData).category[0]);
        testChart.setOption({
          series: [{
            name: 'Test',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: globalValue
          }]
        });
      });
    }, 3000);
  });
});
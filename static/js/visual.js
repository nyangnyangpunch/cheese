"use strict";

/**
 * visual.js
 * 
 * Visualization 메뉴 스크립트
 */
var testChart = null;
var data = null;

var createTestChart = function createTestChart() {
  var testChartOption = {
    title: {
      text: 'Metric data test'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function formatter(params) {
        params = params[0];
        var date = new Date(params.timestamp);
        return date.toLocaleString();
      },
      axisPointer: {
        animation: false
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [{
        name: 'Test',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: data
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
  }).map(function (d) {
    var cpuInfo = d._source.system.process.cpu;
    return {
      timestamp: d._source['@timestamp'],
      value: cpuInfo.total.value
    };
  });
  console.log(dataList);
  return dataList;
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
  getMetricData(function (data) {
    data = dataProcessing(data);
    createTestChart();
    setInterval(function () {
      getMetricData(function (mData) {
        data.shift();
        data.push(dataProcessing(mData)[0]);
        testChart.setOption({
          series: [{
            data: data
          }]
        });
      });
    }, 3000);
  });
});
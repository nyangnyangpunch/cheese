/**
 * visual.js
 * 
 * Visualization 메뉴 스크립트
 */

var testChart = null
var globalData = null
const createTestChart = () => {

  const testChartOption = {
    title: {
      text: 'Metric data test'
    },
    tooltip: {
      trigger: 'axis',
      formatter (params) {
        params = params[0]
        var date = new Date(params.timestamp)
        return date.toLocaleString()
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
        data: globalData
      }]
    }
  }

  testChart = echarts.init(document.getElementById('visual'))
  testChart.setOption(testChartOption)
}


/**
 * E-Chart에 사용할 수 있는 타입으로 데이터 전처리
 * 
 * @param {any} data ES 조회 데이터
 */
const dataProcessing = data => {
  const dataList = data.body.hits.hits
    .filter(d => d._source.metricset && d._source.metricset.name === 'process')
    .map(d => {
      const cpuInfo = d._source.system.process.cpu

      return {
        timestamp: d._source['@timestamp'],
        value: cpuInfo.total.value
      }
    })
  
  console.log(dataList)
  return dataList
}


/**
 * Metric 정보 수집
 */
const getMetricData = (callback) => {
  $.ajax({
    url: '/API/getMetric',
    type: 'GET',
    dataType: 'JSON',
    success (res) {
      callback(res)
    },
    error (jqXHR, state) {
      console.error(jqXHR, state)
      callback()
    }
  })
}


$(function () {
  getMetricData(mData => {
    globalData = dataProcessing(mData)
    createTestChart()

    setInterval(() => {
      getMetricData(mmData => {
        globalData.shift()
        globalData.push(dataProcessing(mmData)[0])

        testChart.setOption({
          series: [{
            data: globalData
          }]
        })
      })
    }, 3000)
  })
})

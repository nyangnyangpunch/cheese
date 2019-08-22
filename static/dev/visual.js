/**
 * visual.js
 * 
 * Visualization 메뉴 스크립트
 */


// E-Chart 인스턴스
const chartInstance = {
  cpu: null
}

// 차트 데이터
const chartData = {
  cpu: {
    value: [],
    category: []
  }
}

const createChart = (type, data) => {

  const option = {
    title: {
      text: type.toUpperCase() + ' Metric data'
    },
    tooltip: {
      trigger: 'axis',
      formatter (params) {
        return 'Value: ' + params[0].data
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
  }

  chartInstance[type] = echarts.init(document.getElementById('visual_' + type))
  chartInstance[type].setOption(option)
}

const updateChart = (type, data) => {
  chartInstance[type].setOption({
    xAxis: {
      data: data.category
    },
    series: data[type].series
  })
}


/**
 * E-Chart에 사용할 수 있는 타입으로 데이터 전처리
 * 
 * @param {any} data ES 조회 데이터
 */
const dataProcessing = data => {
  const dataList = data.body.hits.hits
    .filter(d => d._source.service && d._source.service.type === 'system')

  const timestamp = []
  const cpu = {
    user: [],
    system: [],
    nice: [],
    idle: [],
    iowait: []
  }

  dataList.forEach(d => {
    timestamp.push(d._source['@timestamp'])
  })
  
  dataList.forEach(d => {
    const cpuInfo = d._source.system.cpu
    // const cores = cpuInfo.cores
    cpu.user.push(cpuInfo.user.pct)
    cpu.system.push(cpuInfo.system.pct)
    cpu.nice.push(cpuInfo.nice.pct)
    cpu.idle.push(cpuInfo.idle.pct)
    cpu.iowait.push(cpuInfo.iowait.pct)
  })

  const cpuChartData = []
  Object.keys(cpu).forEach(k => {
    cpuChartData.push({
      name: k,
      type: 'line',
      data: cpu[k]
    })
  })

  const res = {
    category: timestamp,
    cpu: {
      series: cpuChartData
    }
  }

  console.log(res)
  return res
}

const pollingGroup = []
const registPollingGroup = (handler) => {
  pollingGroup.push(handler)
}

const poll = (tick = 5000) => {
  setTimeout(() => {
    getMetricData(data => {
      const pData = dataProcessing(data)
      pollingGroup.forEach(h => h(pData))
    })
  }, tick)
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
    const pData = dataProcessing(mData)
    createChart('cpu', pData)

    registPollingGroup(data => {
      updateChart('cpu', data)
    })

    poll()
  })
})

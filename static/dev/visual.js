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
  chartInstance[type] = c3.generate({
    bindto: '#visual_' + type,
    data: {
      columns: data[type]
    }
  })
}

const updateChart = (type, data) => {
  chartInstance[type].load({
    columns: data[type]
  })
}


/**
 * E-Chart에 사용할 수 있는 타입으로 데이터 전처리
 * 
 * @param {any} data ES 조회 데이터
 */
const dataProcessing = data => {
  const dataList = data.body.hits.hits

  const timestamp = []
  const cpu = {
    total: [],
    user: [],
    system: [],
    nice: [],
    idle: [],
    iowait: []
  }

  const memory = {
    total: 0,
    free: 0,
    used: [],
    swap: []
  }

  const network = {
    in: {
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
  }

  dataList.forEach(d => {
    timestamp.push(d._source['@timestamp'])
  })
  
  dataList
    .filter(d => { d._source.metricset.name === 'cpu' })
    .forEach(d => {
    const cpuInfo = d._source.system.cpu
    // const cores = cpuInfo.cores
    cpu.total.push(cpuInfo.total.pct)
    cpu.user.push(cpuInfo.user.pct)
    cpu.system.push(cpuInfo.system.pct)
    cpu.nice.push(cpuInfo.nice.pct)
    cpu.idle.push(cpuInfo.idle.pct)
    cpu.iowait.push(cpuInfo.iowait.pct)
  })

  const cpuChartData = []
  Object.keys(cpu).forEach(k => {
    cpuChartData.push([k, ...cpu[k]])
  })


  dataList
    .filter(d => { d._source.metricset.name === 'memory' })
    .forEach(d => {
    const memInfo = d._source.system.memory
    memory.total = memInfo.total
    memory.free = memInfo.free
    memory.used.push(memInfo.used.pct)
    memory.swap.push(memInfo.swap.pct)
  })

  const memoryChartData = []
  memoryChartData.push(['used', ...memory.used])
  memoryChartData.push(['swap', ...memory.swap])


  dataList
    .filter(d => { d._source.metricset.name === 'network' })
    .forEach(d => {
    const networkInfo = d._source.system.network
    network.in.dropped.push(networkInfo.in.dropped)
    network.in.bytes.push(networkInfo.in.bytes)
    network.in.packets.push(networkInfo.in.packets)
    network.in.errors.push(networkInfo.in.errors)
    network.out.dropped.push(networkInfo.out.dropped)
    network.out.bytes.push(networkInfo.out.bytes)
    network.out.packets.push(networkInfo.out.packets)
    network.out.errors.push(networkInfo.out.errors)
  })

  const networkChartData = {
    in: [],
    out: []
  }
  Object.keys(network).forEach(k => {
    Object.keys(network[k]).forEach(nk => {
      networkChartData[k].push([k + ':' + nk, ...network[k][nk]])
    })
  })

  const res = {
    category: timestamp,
    cpu: cpuChartData,
    memory: memoryChartData,
    network: networkChartData
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
    data: {
      q: 'cpu'
    },
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

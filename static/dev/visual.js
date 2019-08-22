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
    // title: {
    //   text: type.toUpperCase()
    // },
    bindto: '#visual_' + type,
    data: {
      columns: data[type].data
    }
  }
  console.log('Create', option)
  chartInstance[type] = c3.generate(option)
}

const updateChart = (type, data) => {
  chartInstance[type].load({
    columns: data[type].data
  })
}


/**
 * E-Chart에 사용할 수 있는 타입으로 데이터 전처리
 * 
 * @param {any} data ES 조회 데이터
 */
const dataProcessing = data => {
  const dataList = data.body.hits.hits.reverse()

  const cpu = {
    user: [],
    system: [],
    steal: [],
    irq: [],
    softirq: [],
    nice: [],
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
  

  const cpuCategoryData = []
  dataList
    .filter(d => d._source.metricset.name === 'cpu')
    .forEach(d => {
    const cpuInfo = d._source.system.cpu
    cpuCategoryData.push(d._source['@timestamp'])
    cpu.user.push(cpuInfo.user.pct)
    cpu.system.push(cpuInfo.system.pct)
    cpu.steal.push(cpuInfo.steal.pct)
    cpu.irq.push(cpuInfo.irq.pct)
    cpu.softirq.push(cpuInfo.softirq.pct)
    cpu.nice.push(cpuInfo.nice.pct)
    cpu.iowait.push(cpuInfo.iowait.pct)
    // cpu.idle.push(cpuInfo.idle.pct)
    // cpu.total.push(cpuInfo.total.pct)
  })

  const cpuChartData = []
  Object.keys(cpu).forEach(k => {
    cpuChartData.push([k, ...cpu[k]])
  })


  const memoryCategoryData = []
  dataList
    .filter(d => d._source.metricset.name === 'memory')
    .forEach(d => {
    const memInfo = d._source.system.memory
    memoryCategoryData.push(d._source['@timestamp'])
    memory.total = memInfo.total
    memory.free = memInfo.free
    memory.used.push(memInfo.used.pct)
    memory.swap.push(memInfo.swap.pct)
  })

  const memoryChartData = []
  memoryChartData.push(['used', ...memory.used])
  memoryChartData.push(['swap', ...memory.swap])


  const networkCategoryData = []
  dataList
    .filter(d => d._source.metricset.name === 'network')
    .forEach(d => {
    const networkInfo = d._source.system.network
    networkCategoryData.push(d._source['@timestamp'])
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

    if (true) {
      poll()
    }
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
    createChart('memory', pData)

    registPollingGroup(data => {
      updateChart('cpu', data)
      updateChart('memory', data)
    })

    poll()
  })
})

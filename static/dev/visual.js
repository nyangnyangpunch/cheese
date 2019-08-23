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

const createChart = (type, data, _option = {}, unit = '%') => {
  const option = {
    // title: {
    //   text: type.toUpperCase()
    // },
    bindto: '#visual_' + type,
    data: {
      x: 'x',
      columns: [
        data[type].category,
        ...data[type].data
      ]
    },
    ..._option,
    tooltip: {
      format: {
        value: val => val + unit
      }
    }
  }
  console.log('Create', option)
  chartInstance[type] = c3.generate(option)
}

const updateChart = (type, data) => {
  chartInstance[type].flow({
    columns: [
      data[type].category,
      ...data[type].data
    ],
    duration: 500,
    length: 1
  })
}


/**
 * E-Chart에 사용할 수 있는 타입으로 데이터 전처리
 * 
 * @param {any} data ES 조회 데이터
 */
const dataProcessing = (data, all = true) => {
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

  function timeToString (x) {
    function padding (d) {
      d = d.toString()
      return d.length === 1 ? '0' + d : d
    }
    const _ = new Date(x)
    const h = padding(_.getHours())
    const m = padding(_.getMinutes())
    const s = padding(_.getSeconds())
    return `${h}:${m}:${s}`
  }
  

  const cpuCategoryData = ['x']
  dataList
    .filter(d => d._source.metricset.name === 'cpu')
    .forEach(d => {
    const cpuInfo = d._source.system.cpu
    cpuCategoryData.push(timeToString(d._source['@timestamp']))
    cpu.user.push(parseFloat((cpuInfo.user.pct || 0) * 100).toFixed(2))
    cpu.system.push(parseFloat((cpuInfo.system.pct || 0) * 100).toFixed(2))
    cpu.steal.push(parseFloat((cpuInfo.steal.pct || 0) * 100).toFixed(2))
    cpu.irq.push(parseFloat((cpuInfo.irq.pct || 0) * 100).toFixed(2))
    cpu.softirq.push(parseFloat((cpuInfo.softirq.pct || 0) * 100).toFixed(2))
    cpu.nice.push(parseFloat((cpuInfo.nice.pct || 0) * 100).toFixed(2))
    cpu.iowait.push(parseFloat((cpuInfo.iowait.pct || 0) * 100).toFixed(2))
    // cpu.idle.push(parseFloat((cpuInfo.idle.pct || 0) * 100).toFixed(2))
    // cpu.total.push(parseFloat((cpuInfo.total.pct || 0) * 100).toFixed(2))
  })

  const cpuChartData = []
  Object.keys(cpu).forEach(k => {
    cpuChartData.push([k, ...(all ? cpu[k] : [cpu[k].pop()])])
  })


  const memoryCategoryData = ['x']
  dataList
    .filter(d => d._source.metricset.name === 'memory')
    .forEach(d => {
    const memInfo = d._source.system.memory
    memoryCategoryData.push(timeToString(d._source['@timestamp']))
    memory.total = memInfo.total
    memory.free = memInfo.free
    memory.used.push(parseFloat((memInfo.used.pct || 0) * 100).toFixed(2))
    memory.swap.push(parseFloat((memInfo.swap.pct || 0) * 100).toFixed(2))
  })

  const memoryChartData = []
  memoryChartData.push(['used', ...(all ? memory.used : [memory.used.pop()])])
  memoryChartData.push(['swap', ...(all ? memory.swap : [memory.swap.pop()])])


  const networkCategoryData = ['x']
  dataList
    .filter(d => d._source.metricset.name === 'network')
    .forEach(d => {
    const networkInfo = d._source.system.network
    networkCategoryData.push(timeToString(d._source['@timestamp']))
    network.in.dropped.push(networkInfo.in.dropped)
    network.in.bytes.push(networkInfo.in.bytes)
    network.in.packets.push(networkInfo.in.packets)
    network.in.errors.push(networkInfo.in.errors)
    network.out.dropped.push(networkInfo.out.dropped)
    network.out.bytes.push(networkInfo.out.bytes)
    network.out.packets.push(networkInfo.out.packets)
    network.out.errors.push(networkInfo.out.errors)
  })

  const networkChartData = []
  Object.keys(network).forEach(k => {
    Object.keys(network[k]).forEach(nk => {
      let value = []
      network[k][nk].forEach(v => {
        if (nk === 'out') {
          value.push(v * -1)
        } else {
          value.push(v)
        }
      })
      networkChartData.push([k + ':' + nk, ...(all ? value : [value.pop()])])
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
      const pData = dataProcessing(data, false)
      pollingGroup.forEach(h => h(pData))
    })

    if (true) {
      requestAnimationFrame(poll)
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
    createChart('cpu', pData, {
      axis: {
        x: {
          type: 'category',
          label: 'Timestamp'
        },
        y: {
          min: 0,
          max: 100,
          label: 'Usage'
        }
      }
    })

    createChart('memory', pData, {
      axis: {
        x: {
          type: 'category',
          label: 'Timestamp'
        },
        y: {
          min: 0,
          max: 100,
          label: 'Usage'
        }
      }
    })

    createChart('network', pData, {
      types: {
        in: 'area',
        out: 'area'
      }
    }, 'Mbit/s')

    registPollingGroup(data => {
      updateChart('cpu', data)
      updateChart('memory', data)
      updateChart('network', data)
    })

    requestAnimationFrame(poll)
  })
})

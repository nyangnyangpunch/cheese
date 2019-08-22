const { logger } = require('../util/logger')
const { executeCommand } = require('../util/command')
const es = require('./elastic/elasticsearch')
const k8s = require('./k8s/k8s')
const API_ENDPOINT = '/API'

module.exports = app => {
  app.get(API_ENDPOINT + '/testApi', async (req, res) => {
    const text = req.query.text.split(' ')
    const cmd = text[0]
    const args = text.slice(1)
    logger.debug(`${cmd} ${args}`)

    try {
      var response = await executeCommand(cmd, args)
    } catch (e) {
      logger.error(e)
    }

    res.json(response)
  })

  app.get(API_ENDPOINT + '/getPods', async (_req, res) => {
    let resData = null
    try {
      resData = await k8s.getPods()
    } catch (e) {
      logger.error(e)
    }
    res.json(resData)
  })

  app.get(API_ENDPOINT + '/getMetric', async (_req, res) => {
    let resData = null
    try {
      resData = await es.search('metricbeat-*', {
        'query': {
          'bool': {
            'must': [
              {
                'bool': {
                  'should': [
                    {
                      'match': {
                        'metricset.name': 'cpu'
                      }
                    },
                    {
                      'match': {
                        'metricset.name': 'memory'
                      }
                    },
                    {
                      'match': {
                        'metricset.name': 'network'
                      }
                    }
                  ]
                }
              },
              {
                'range': {
                  '@timestamp': {
                    'gte': 'now-12h',
                    'lte': 'now/m'
                  }
                }
              }
            ]     
          }
        },
        'sort': [
          { '@timestamp' : 'desc' }
        ],
        'size': 360
      })
    } catch (e) {
      logger.error(e)
    }
    res.json(resData)
  })
}

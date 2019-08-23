const { logger } = require('../util/logger')
const { executeCommand } = require('../util/command')

const es = require('./elastic/elasticsearch')
const k8s = require('./k8s/k8s')
const path = require('path')
const fs = require('fs')
const API_ENDPOINT = '/API'
const YAML_FILE = 'cheese.yaml'

module.exports = app => {
  app.post(API_ENDPOINT + '/createPod', async (req, res) => {
    const yaml = req.body.yaml
    let response = null
    logger.info('Create pod - yaml\n' + yaml)

    try {
      await new Promise ((resolve, reject) => {
        fs.writeFile(path.resolve(global.__root, YAML_FILE), yaml, err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })

      response = await executeCommand('kubectl', [
        'create',
        '-f',
        path.resolve(global.__root, YAML_FILE)
      ])
    } catch (e) {
      logger.error(e)
    }

    res.json(response)
  })

  app.post(API_ENDPOINT + '/deletePod', async (req, res) => {
    const name = req.body.name
    let response = null
    logger.warning(`Delete pod - ${name}`)

    try {
      response = await executeCommand('kubectl', [
        'delete',
        'pod',
        name
      ])
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

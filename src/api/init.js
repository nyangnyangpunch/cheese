const { logger } = require('../util/logger')
const { executeCommand } = require('../util/command')

const es = require('./elastic/elasticsearch')
const k8s = require('./k8s/k8s')
const path = require('path')
const fs = require('fs')
const API_ENDPOINT = '/API'
const YAML_FILE = 'cheese.yaml'

module.exports = app => {

  /*app.post(API_ENDPOINT + '/autoScale', async (req, res) => {
    const podname = req.body.podname;
    const namespace = req.body.namespace;
    const min = parseInt(req.body.min);
    const max = parseInt(req.body.max);
    let response = null;

    logger.info('kubectl autoscale deployment '+namespace+'/' + podname + ' --min=' + min + ' --max=' + max);
    try {
      let autoScaler = await k8s.getAutoScaler(podname, namespace)
      if(autoScaler.kind == 'Status'){
        logger.info(autoScaler)
        autoScaler = {
          apiVersion: 'autoscaling/v1',
          kind: 'HorizontalPodAutoscaler',
          metadata: {
            name: podname,
            namespace: namespace
          },
          spec: {
            scaleTargetRef:{
              apiVersion: 'apps/v1',
              kind: 'Deployment',
              name: podname
            },
            maxReplicas: max,
            minReplicas: min,
            targetCPUUtilizationPercentage: 50
          }
        };
        response = await k8s.createAutoScaler(namespace, autoscalerBody)
      }else{
        logger.info(autoScaler)
        autoScaler.spec.maxReplicas = max
        autoScaler.spec.minReplicas = min
        response = await k8s.replaceAutoScaler(podname, namespace, autoScaler)
      }
    } catch (e) {
      logger.error(e)
    }
    res.json(response)
  })*/

  //  kubectl scale deployments/test --replicas=1
  app.post(API_ENDPOINT + '/selfScale', async (req, res) => {
    const podname = req.body.podname;
    const namespace = req.body.namespace!=''?req.body.namespace:'default'
    const max = parseInt(req.body.max);
    let response = null;

    logger.info('kubectl scale deployments '+namespace+'/' + podname + ' --replicas=' + max);

    try {
      let deployBody = await k8s.getDeployment(podname, namespace)
      logger.info(deployBody)

      let scaleBody = await k8s.getReplicaSetScale(podname, namespace)
      scaleBody.spec.replicas = max
      scaleBody.metadata.creationTimestamp = scaleBody.metadata.creationTimestamp.toISOString()
      response = await k8s.replaceReplicaSetScale(podname, namespace, scaleBody)
    } catch (e) {
      logger.error(e)
    }
    res.json(response)
  })

  app.get(API_ENDPOINT + '/getReplicaSets', async (_req, res) => {
    let resData = null
    try {
      resData = await k8s.getReplicaSets()
    } catch (e) {
      logger.error(e)
    }
    res.json(resData)
  })

  /*app.post(API_ENDPOINT + '/createPod', async (req, res) => {
    const yaml = req.body.yaml
    const namespace = req.body.namespace
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

      response = await createPods(, path.resolve(global.__root, YAML_FILE))
    } catch (e) {
      logger.error(e)
    }
    res.json(response)
  })*/

  app.post(API_ENDPOINT + '/deletePod', async (req, res) => {
    const name = req.body.name
    const namespace = req.body.namespace
    let response = null
    logger.warning(`Delete pod - ${name}`)

    try {
      response = await k8s.deletePod(name, namespace)
    } catch (e) {
      logger.error(e)
    }
    res.json(response)
  })



    ///////////////////////////////////////////////////////////////////////////////
    //by jung_min
    ///////////////////////////////////////////////////////////////////////////////


  //  kubectl autoscale deployment test --min=1 --max=4
  app.post(API_ENDPOINT + '/autoScale', async (req, res) => {
    var namespace = req.body.namespace;
    var podname = req.body.podname;
    var min = req.body.min;
    var max = req.body.max;
    let response = null;

    logger.info('kubectl autoscale deployment ' + podname + ' --min=' + min + ' --max=' + max+' -n '+namespace);
    try {
      if(namespace!=''){
        response = await executeCommand('kubectl autoscale deployment ' + podname + ' --min=' + min + ' --max=' + max+' -n '+namespace)
      }
      else{
        response = await executeCommand('kubectl autoscale deployment ' + podname + ' --min=' + min + ' --max=' + max)
      }
    } catch (e) {
      logger.error(e)
    }
    res.json(response)
  })

  /*//  kubectl scale deployments/test --replicas=1
  app.post(API_ENDPOINT + '/selfScale', async (req, res) => {
    const podname = req.body.podname;
    const min = req.body.min;
    let response = null;

    logger.info('kubectl scale deployments ' + podname + ' --replicas=' + min);

    try {
      response = await executeCommand('kubectl', [
        'scale',
        'deployments',
        podname,
        '--replicas=',
        min
      ])
    } catch (e) {
      logger.error(e)
    }
    res.json(response)
  })
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

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
        name,
        '--wait=false',
        '--now'
      ])
    } catch (e) {
      logger.error(e)
    }

    res.json(response)
  })*/

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

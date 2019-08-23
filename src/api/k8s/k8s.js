const { logger } = require('../../util/logger')
const k8s = require('@kubernetes/client-node')

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

const k8sApi = kc.makeApiClient(k8s.CoreV1Api)

/**
 * Pods 정보를 불러옵니다.
 * @param {string} namespace Pods 네임스페이스 (기본: default)
 */
const getPods = async (namespace = 'default') => {
  return new Promise(resolve => {
    k8sApi.listNamespacedPod(namespace).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      resolve(null)
    })
  })
}

exports.getPods = getPods

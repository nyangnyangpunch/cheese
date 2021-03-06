const { logger } = require('../../util/logger')
const k8s = require('@kubernetes/client-node')

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

const k8sApi = kc.makeApiClient(k8s.CoreV1Api)
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api)
const k8sAutoscalingApi = kc.makeApiClient(k8s.AutoscalingV1Api)


/**
 * Namespace 정보를 불러옵니다.
 *
 */
const getNamespaces = async () => {
  return new Promise(resolve => {
    k8sApi.listNamespace().then(({body}) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      resolve(null)
    })
  })
}

/**
 * AutoScaler 생성
 * @param {string} namespace AutoScaler 네임스페이스 (기본: default)
 * @param {V1HorizontalPodAutoscaler} autoscalerBody
 */
const createAutoScaler = async (namespace = 'default', autoscalerBody) => {
  return new Promise(resolve => {
    k8sAutoscalingApi.createNamespacedHorizontalPodAutoscaler(namespace, autoscalerBody).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      resolve(null)
    })
  })
}
/**
 * AutoScaler 읽기
 * @param {string} name AutoScaler 이름
 * @param {string} namespace AutoScaler 네임스페이스 (기본: default)
 */
const getAutoScaler = async (name, namespace = 'default') => {
  return new Promise(resolve => {
    k8sAutoscalingApi.readNamespacedHorizontalPodAutoscaler(name, namespace).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      resolve(null)
    })
  })
}
/**
 * AutoScaler 수정
 * @param {string} name AutoScaler 이름
 * @param {string} namespace AutoScaler 네임스페이스 (기본: default)
 * @param {V1HorizontalPodAutoscaler} autoscalerBody
 */
const replaceAutoScaler = async (name, namespace = 'default', autoscalerBody) => {
  return new Promise(resolve => {
    k8sAutoscalingApi.replaceNamespacedHorizontalPodAutoscaler(name, namespace, autoscalerBody).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      resolve(null)
    })
  })
}

/**
 * ReplicaSets 정보를 불러옵니다.
 * @param {string} namespace ReplicaSet 네임스페이스 (기본: default)
 */
const getReplicaSets = async (namespace = 'default') => {
  return new Promise(resolve => {
    k8sAppsApi.listNamespacedReplicaSet(namespace).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      resolve(null)
    })
  })
}
/**
 * ReplicaSet 정보를 불러옵니다.
 * @param {string} name ReplicaSet 이름
 * @param {string} namespace ReplicaSet 네임스페이스 (기본: default)
 */
const getReplicaSet = async (name, namespace = 'default') => {
  return new Promise(resolve => {
    k8sAppsApi.readNamespacedReplicaSet(name, namespace).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      resolve(null)
    })
  })
}
/**
 * ReplicaSet scale 읽기
 * @param {string} name ReplicaSet 이름
 * @param {string} namespace ReplicaSet 네임스페이스 (기본: default)
 *
 */
const getReplicaSetScale = async (name, namespace = 'default') => {
  return new Promise(resolve => {
    k8sAppsApi.readNamespacedReplicaSetScale (name, namespace).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      resolve(null)
    })
  })
}
/**
 * ReplicaSet scale 변경
 * @param {string} name ReplicaSet 이름
 * @param {string} namespace ReplicaSet 네임스페이스 (기본: default)
 * @param {V1Scale} scaleBody
 */
const replaceReplicaSetScale = async (name, namespace = 'default', scaleBody) => {
  return new Promise(resolve => {
    k8sAppsApi.replaceNamespacedReplicaSetScale(name, namespace, scaleBody).then(({ body }) => {
    //k8sAppsApi.patchNamespacedReplicaSetScale(name, namespace, scaleBody).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      logger.error(e.response.body.message)
      resolve(null)
    })
  })
}

/**
 * Deployment 읽기
 * @param {string} name Deployment 이름
 * @param {string} namespace Deployment 네임스페이스 (기본: default)
 */
const getDeployment = async (name, namespace = 'default') => {
  return new Promise(resolve => {
    k8sAppsApi.readNamespacedDeployment (name, namespace).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      logger.error(e.response.body.message)
      resolve(null)
    })
  })
}
/**
 * Deployment 변경
 * @param {string} name ReplicaSet 이름
 * @param {string} namespace ReplicaSet 네임스페이스 (기본: default)
 * @param {V1Deployment} deployBody
 */
const replaceDeployment = async (name, namespace = 'default', deployBody) => {
  return new Promise(resolve => {
    k8sAppsApi.replaceNamespacedDeployment(name, namespace, deployBody).then(({ body }) => {
    //k8sAppsApi.patchNamespacedReplicaSetScale(name, namespace, scaleBody).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      logger.error(e.response.body.message)
      resolve(null)
    })
  })
}

/**
 * Pod 삭제
 * @param {string} namespace Pod 네임스페이스 (기본: default)
 * @param {string} name Pod 이름
 */
const deletePod = async (name, namespace = 'default') => {
  return new Promise(resolve => {
    k8sApi.deleteNamespacedPod(name, namespace).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      resolve(null)
    })
  })
}
/**
 * Pod 생성
 * @param {string} namespace Pod 네임스페이스 (기본: default)
 * @param {V1Pod} podBody Pod 생성 정보
 */
const createPod = async (namespace = 'default', podBody) => {
  return new Promise(resolve => {
    k8sApi.createNamespacedPod (namespace, podBody).then(({ body }) => {
      resolve(body)
    }).catch(e => {
      logger.error(e)
      resolve(null)
    })
  })
}
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
exports.createPod = createPod
exports.deletePod = deletePod
exports.getDeployment = getDeployment
exports.replaceDeployment = replaceDeployment
exports.replaceReplicaSetScale = replaceReplicaSetScale
exports.getReplicaSetScale = getReplicaSetScale
exports.getReplicaSets = getReplicaSets
exports.getReplicaSet = getReplicaSet
exports.createAutoScaler = createAutoScaler
exports.getAutoScaler = getAutoScaler
exports.getNamespaces = getNamespaces

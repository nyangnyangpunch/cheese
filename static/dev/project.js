/**
 * project.js
 * 
 * Project 메뉴 스크립트
 */

const showPodsList = pods => {
  if (!pods) {
    $('#project').html(`
      <div class="text">프로젝트를 생성하세요! (아직 프로젝트가 존재하지 않습니다)</div>
      <div class="panel-control">
        <button class="button white">불러오기</button>
      </div>
      <div class="panel-control">
        <button class="button green">새로 만들기</button>
      </div>
    `)
    return
  }

  let template = ''
  pods.forEach(pod => {
    let containers = ''
    pod.spec.containers.forEach(container => {
      containers += `
        <div class="container">${container.image}</div>
      `
    })

    template += `
      <div class="pod">
        <div class="pod-name">${pod.metadata.name}</div>
        <div class="pod-namespace">(${pod.metadata.namespace})</div>
        <div class="host">
          ${pod.spec.nodeName}<b class="sub">(${pod.status.hostIP})</b> - ${pod.status.phase}
        </div>
        <div class="pod-containers">
          Container(s)
          ${containers}
        </div>
        <div class="start">${pod.status.startTime}</div>
      </div>
    `
  })

  $('#project').html(template)
}

const getPods = () => {
  $.ajax({
    url: '/API/getPods',
    type: 'GET',
    dataType: 'JSON',
    success (res) {
      console.log('getPods: ' + res.apiVersion)
      showPodsList(res.items)
    },
    error (jqXHR, state) {
      console.error(jqXHR, state)
      showPodsList()
    }
  })
}

$(function () {
  getPods()
})

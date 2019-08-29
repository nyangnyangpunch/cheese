/**
 * manage.js
 * 
 * Management 메뉴 스크립트
 */


const showPodsList = pods => {
  $('.delete').off()
  if (!pods) {
    $('#project').html(`
      <div class="text">프로젝트를 생성하세요! (아직 프로젝트가 존재하지 않습니다)</div>
      <div class="panel-control">
        <button class="button white">불러오기</button>
      </div>
      <div class="panel-control">
        <button class="button green">새로운 Pod 만들기</button>
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
      <div class="pod-wrap">
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
          <div class="start">
            <button class="button red delete" data-name="${pod.metadata.name}">Delete</button>
          </div>
        </div>
      </div>
    `
  })

  $('#project').html(template)
  $('.delete').on('click', function () {
    const name = $(this).data('name')

    if (name && confirm(`Delete ${name}?`)) {
      $.ajax({
        url: '/API/deletePod',
        type: 'POST',
        dataType: 'JSON',
        data: { name },
        success (res) {
          if (res) {
            location.reload()
          }
        },
        error (jqXHR, state) {
          console.error(jqXHR, state)
        }
      })
    }
  })
}

const getPods = () => {
  $.ajax({
    url: '/API/getPods',
    type: 'GET',
    dataType: 'JSON',
    success (res) {
      showPodsList(res && res.items)
    },
    error (jqXHR, state) {
      console.error(jqXHR, state)
      showPodsList()
    }
  })
}

const poll = (tick = 5000) => {
  setTimeout(() => {
    getPods()

    if (__globalPollPod) {
      poll()
    }
  }, tick)
}

const SAMPLE_YAML =
`apiVersion: v1
kind: Pod
metadata:
  name: POD_NAME
spec:
  containers:
  - name: CONTAINER_NAME
    image: ubuntu
    ports:
    - containerPort: 7777`

$(function () {
  getPods()

  $('#create').click(function () {
    $('#collapse').toggleClass('show')
    if ($('#collapse').hasClass('show')) {
      $('#yaml').val(SAMPLE_YAML)
    }
  })

  $('#yaml_submit').click(function () {
    const yaml = $('#yaml').val()
    if (yaml) {
      $.ajax({
        url: '/API/createPod',
        type: 'POST',
        dataType: 'JSON',
        data: { yaml },
        success(res) {
          if (res) {
            location.reload()
          }
        },
        error (jqXHR, state) {
          console.error(jqXHR, state)
        }
      })
    } else {
      console.error('yaml is empty')
    }
  })
})

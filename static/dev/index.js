var __globalPollControl = false,
    __globalPollPod = false

const menuList = [
  {
    target: 'project',
    name: 'Project'
  },
  {
    target: 'setting',
    name: 'Setting'
  },
  {
    target: 'help',
    name: 'Help'
  },
  {
    target: 'visual',
    name: 'Visualization'
  },
  {
    target: 'manage',
    name: 'Management'
  }
]

/* 좌측 메뉴 이벤트 설정 */
const initMenu = () => {
  menuList.forEach(({ target, name }) => {
    $(`#menu_${target}`).click(function (event) {
      __globalPollControl = target === 'visual'
      __globalPollPod = target === 'project'
      event.stopPropagation()
      $('.drawer-item').removeClass('active')
      $(`#menu_${target}`).addClass('active')
      loadContent(target, name)
    })
  })
}

/* 상단 Header 우측의 타이틀 변경 */
const changeTitle = title => {
  $('#header_title').text(title)
}

/* 해당 페이지 로드 후 #content에 표시 */
const loadContent = (target, name) => {
  contentLoading(true)
  $('#content').css('opacity', '0')
  $('#content').load(`/${target}`, () => {
    setTimeout(() => {
      changeTitle(name)
      $('#content').css('opacity', '1')
      contentLoading(false)
    }, 1000)
  })
}

/* 로딩영역 show/hide */
const contentLoading = show => {
  if (show) {
    $('#loading').removeClass('hide')
  } else {
    $('#loading').addClass('hide')
  }
}

/* Quit 메뉴 */
const quit = () => {
  alert('페이지를 종료합니다')
}



/*========== load ========== */
$(function () {
  $('#menu_quit').click(quit)

  // 페이지 첫 로드시 Project 메뉴 보이기
  let { target, name } = menuList[0]
  loadContent(target, name)
  initMenu()
})


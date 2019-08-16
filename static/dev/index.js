const menuList = [
  {
    name: 'project'
  },
  {
    name: 'setting'
  },
  {
    name: 'help'
  }
]

/* 좌측 메뉴 이벤트 설정 */
const initMenu = () => {
  menuList.forEach(({ name }) => {
    $(`#menu_${name}`).click(function () {
      $('.drawer-item').removeClass('active')
      $(`#menu_${name}`).addClass('active')
      loadContent(name)
    })
  })
}

/* 상단 Header 우측의 타이틀 변경 */
const changeTitle = text => {
  const title = text.substring(0, 1).toUpperCase() +
                text.substring(1, text.length)
  $('#header_title').text(title)
}

/* 해당 페이지 로드 후 #content에 표시 */
const loadContent = name => {
  contentLoading(true)
  $('#content').css('opacity', '0')
  $('#content').load(`/${name}`, () => {
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
  alert('Quit')
}



/*========== load ========== */
$(function () {
  $('#menu_quit').click(quit)

  // 페이지 첫 로드시 Project 메뉴 보이기
  loadContent('project')
  initMenu()
})

const menuList = [
  {
    target: 'project',
    name: 'Project',
    hook (end) {
      $.ajax({
        url: '/API/getPods',
        type: 'GET',
        dataType: 'JSON',
        success (res) {
          console.log(res)
          end()
        },
        error (jqXHR, state) {
          console.error(jqXHR, state)
          end()
        }
      })
    }
  },
  {
    target: 'setting',
    name: 'Setting',
    hook (end) {
      end()
    }
  },
  {
    target: 'help',
    name: 'Help',
    hook (end) {
      end()
    }
  },
  {
    target: 'visual',
    name: 'Visualization',
    hook (end) {
      end()
    }
  },
  {
    target: 'manage',
    name: 'Management',
    hook (end) {
      end()
    }
  }
]

/* 좌측 메뉴 이벤트 설정 */
const initMenu = () => {
  menuList.forEach(({ target, name, hook }) => {
    $(`#menu_${target}`).click(function (event) {
      event.stopPropagation()
      $('.drawer-item').removeClass('active')
      $(`#menu_${target}`).addClass('active')
      loadContent(target, name, hook)
    })
  })
}

/* 상단 Header 우측의 타이틀 변경 */
const changeTitle = title => {
  $('#header_title').text(title)
}

/* 해당 페이지 로드 후 #content에 표시 */
const loadContent = (target, name, hook) => {
  contentLoading(true)
  $('#content').css('opacity', '0')
  $('#content').load(`/${target}`, () => {
    hook(() => {
      setTimeout(() => {
        changeTitle(name)
        $('#content').css('opacity', '1')
        contentLoading(false)
      }, 1000)
    })
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
  let { target, name, hook } = menuList[0]
  loadContent(target, name, hook)
  initMenu()
})

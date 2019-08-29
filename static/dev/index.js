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

//언어변경
$.lang = {};// 언어팩 선언.


$.lang.ko = {
    1: '프로젝트를 생성하세요!',
	2: '새로운 Pod 만들기',
	3: '언어',
	4: '치즈의 기본 언어를 변경합니다',
    5: '검색',
    6: '적용',
    7: '검색',
    8: '적용',
    9: '1.질문',
    10: 'create에 yaml을 넣은뒤 pod를 생성했는데, 잘 동작하지 않습니다.<p>해결법 -> 생성된 pod를 하나의 service로 묶어 줄 yaml를 재정의해 create 하세요.<p>',
    11: '2.질문',
    12: 'delete를 해도 삭제가 되지 않습니다.<p>해결법 -> 삭제가 되는데 오랜시간이 걸리거나, 오류가 발생했을 수도 있습니다.<br>delete --force --period=0을 활용하여 강제 종료 하십시오.<p>',
    13: '개발자',
    14: '냥냥펀치 팀',
    15: '더 보기',
    16: '치즈 저장소',
    17: '더 보기'
};

$.lang.en = {
    1: 'Create New Project!',
	2: 'Create New Pod',
	3: 'Language',
	4: 'Change The Cheese Language',
    5: 'Search',
    6: 'Apply',
    7: 'Search',
    8: 'Apply',
    9: '1.Question',
    10: 'created a pod after putting yaml in create but is not work.<p>Solution -> redefine and create a yaml that will bind the generated pods into one service.<p>',
    11: '2.Question',
    12: 'Delete does not work.<p>Solution -> The deletion may take a long time or an error may have occurred.<br>Use delete --force --period=0 to force quit.<p>',
    13: 'Developer',
    14: 'NyanNyanPunch Team',
    15: 'View More',
    16: 'Cheese Storage',
    17: 'View More'
};

function setLanguage(currentLanguage) {
  console.log('setLanguage', arguments);
  
  $('[data-langNum]').each(function() {
    var $this = $(this); 
    $this.html($.lang[currentLanguage][$this.data('langnum')]); 
  });	
}  

// 언어 변경
$('button').click(function() {
  var lang = $(this).data('lang');
  setLanguage(lang); 
});

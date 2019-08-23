"use strict";

var __globalPollControl = false;
var menuList = [{
  target: 'project',
  name: 'Project'
}, {
  target: 'setting',
  name: 'Setting'
}, {
  target: 'help',
  name: 'Help'
}, {
  target: 'visual',
  name: 'Visualization'
}, {
  target: 'manage',
  name: 'Management'
}];
/* 좌측 메뉴 이벤트 설정 */

var initMenu = function initMenu() {
  menuList.forEach(function (_ref) {
    var target = _ref.target,
        name = _ref.name;
    $("#menu_".concat(target)).click(function (event) {
      __globalPollControl = target === 'visual';
      event.stopPropagation();
      $('.drawer-item').removeClass('active');
      $("#menu_".concat(target)).addClass('active');
      loadContent(target, name);
    });
  });
};
/* 상단 Header 우측의 타이틀 변경 */


var changeTitle = function changeTitle(title) {
  $('#header_title').text(title);
};
/* 해당 페이지 로드 후 #content에 표시 */


var loadContent = function loadContent(target, name) {
  contentLoading(true);
  $('#content').css('opacity', '0');
  $('#content').load("/".concat(target), function () {
    setTimeout(function () {
      changeTitle(name);
      $('#content').css('opacity', '1');
      contentLoading(false);
    }, 1000);
  });
};
/* 로딩영역 show/hide */


var contentLoading = function contentLoading(show) {
  if (show) {
    $('#loading').removeClass('hide');
  } else {
    $('#loading').addClass('hide');
  }
};
/* Quit 메뉴 */


var quit = function quit() {
  alert('Quit');
};
/*========== load ========== */


$(function () {
  $('#menu_quit').click(quit); // 페이지 첫 로드시 Project 메뉴 보이기

  var _menuList$ = menuList[0],
      target = _menuList$.target,
      name = _menuList$.name;
  loadContent(target, name);
  initMenu();
});
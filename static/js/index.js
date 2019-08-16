"use strict";

var menuList = [{
  name: 'project'
}, {
  name: 'setting'
}, {
  name: 'help'
}];
/* 좌측 메뉴 이벤트 설정 */

var initMenu = function initMenu() {
  menuList.forEach(function (_ref) {
    var name = _ref.name;
    $("#menu_".concat(name)).click(function () {
      $('.drawer-item').removeClass('active');
      $("#menu_".concat(name)).addClass('active');
      loadContent(name);
    });
  });
};
/* 상단 Header 우측의 타이틀 변경 */


var changeTitle = function changeTitle(text) {
  var title = text.substring(0, 1).toUpperCase() + text.substring(1, text.length);
  $('#header_title').text(title);
};
/* 해당 페이지 로드 후 #content에 표시 */


var loadContent = function loadContent(name) {
  contentLoading(true);
  $('#content').load("/".concat(name), function () {
    setTimeout(function () {
      changeTitle(name);
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

  loadContent('project');
  initMenu();
});
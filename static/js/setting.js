"use strict";

/**
 * setting.js
 *
 * Setting 메뉴 스크립트
 */
$(function () {
  $('#pod_replica_auto').click(function(){
    var pod_name = $('#pod_name_auto').val();
    var namespace = $('#namespace_auto').val();
    var min = $('#min_auto').val();
    var max = $('#max_auto').val();

    if(min && max){
      $.ajax({
        url: '/API/autoScale',
        type: 'POST',
        dataType: 'JSON',
        data: {
          podname: pod_name,
          namespace: namespace,
          min: min,
          max: max
        },
        success: function success(res){
          if(res){
            location.reload();
          }
        },
        error: function error(jqXHR, state){
          console.error(jqXHR, state);
        }
      });
    }
  });
  $('#pod_replica_scale').click(function(){
    var pod_name = $('#pod_name_self').val();
    var namespace = $('#namespace_self').val();
    var max = $('#max_scale').val();

    if(max){
      $.ajax({
        url: '/API/selfScale',
        type: 'POST',
        dataType: 'JSON',
        data: {
          podname: pod_name,
          namespace: namespace,
          max: max
        },
        success: function success(res){
          if(res){
            location.reload();
          }
        },
        error: function error(jqXHR, state){
          console.error(jqXHR, state);
        }
      });
    }
  });
});

// 언어팩 선언.
$.lang = {};

$.lang.ko = {
    0: '자바스크립트 다국어 처리.',
	1: '안녕하세요',
	2: '오늘은 금요일 입니다.',
	3: '불금을 즐겨 보아요.'
};

$.lang.en = {
    0: 'Javascript Language Localization.',
	1: 'Hello.',
	2: 'Today is Friday',
	3: 'Fire~!!'
};
	
$.lang.ja = {
    0: 'JavaScriptの言語',
	1: 'こんにちは',
	2: '今日は金曜日です。',
	3: 'ガンバレ~!!'
};

/**
* setLanguage 
* use $.lang[currentLanguage][languageNumber]
*/
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

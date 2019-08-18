"use strict";

/**
 * project.js
 * 
 * Project 메뉴 스크립트
 */
$(function () {
  // API 테스트
  $('#send').click(function () {
    $.ajax({
      url: '/api/testApi',
      method: 'GET',
      data: {
        text: $('#api_test').val()
      },
      dataType: 'JSON',
      success: function success(res) {
        alert('Sucess: ' + JSON.stringify(res));
      },
      error: function error() {
        alert('Error');
      }
    });
  });
});
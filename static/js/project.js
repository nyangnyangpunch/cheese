"use strict";

/**
 * project.js
 * 
 * Project 메뉴 스크립트
 */
var timeout = null;
$(function () {
  $('#create').click(function () {
    $('#modal').removeClass('hidden');
    setTimeout(function () {
      $('#modal').addClass('show');
    }, 20);
  });
  $('#close').click(function () {
    $('#modal').removeClass('show');
    clearTimeout(setTimeout);
    timeout = setTimeout(function () {
      $('#modal').addClass('hidden');
    }, 300);
  });
});
/**
 * help.js
 * 
 * Help 메뉴 스크립트
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
      success (res) {
        alert('Sucess: ' + JSON.stringify(res))
      },
      error () {
        alert('Error')
      }
    })
  })
})

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

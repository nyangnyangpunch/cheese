"use strict";

/**
 * setting.js
 * 
 * Setting 메뉴 스크립트
 */
//$(function () {});




 //////////////////////////////////////////////
 // by jung min
// ////////////////////////////////////////////
$(function () {

    $('#pod_replica_auto').click(function () {

        var pod_name = $('#pod_name_auto').val();
        var min = $('#min_auto').val();
        var max = $('#max_auto').val();

        if (min && max) {
            $.ajax({
                url: '/API/autoScale',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    podname:pod_name,
                    min: min,
                    max: max
                },
                success: function success(res) {
                    if (res) {
                        location.reload();
                    }
                },
                error: function error(jqXHR, state) {
                    console.error(jqXHR, state);
                }
            });
        }
    });

    $('#pod_replica_scale').click(function () {

        var pod_name = $('#pod_name_self').val();
        var min = $('#max_scale').val();
        
        if (min) {
            $.ajax({
                url: '/API/selfScale',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    podname:pod_name,
                    min: min
                },
                success: function success(res) {
                    if (res) {
                        location.reload();
                    }
                },
                error: function error(jqXHR, state) {
                    console.error(jqXHR, state);
                }
            });
        }
    });

});

// ////////////////////////////////////////////

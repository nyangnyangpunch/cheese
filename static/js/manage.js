"use strict";

/**
 * manage.js
 * 
 * Management 메뉴 스크립트
 */
var showPodsList = function showPodsList(pods) {
  $('.delete').off();

  if (!pods) {
    $('#project').html("\n      <div class=\"text\">\uD504\uB85C\uC81D\uD2B8\uB97C \uC0DD\uC131\uD558\uC138\uC694! (\uC544\uC9C1 \uD504\uB85C\uC81D\uD2B8\uAC00 \uC874\uC7AC\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4)</div>\n      <div class=\"panel-control\">\n        <button class=\"button white\">\uBD88\uB7EC\uC624\uAE30</button>\n      </div>\n      <div class=\"panel-control\">\n        <button class=\"button green\">\uC0C8\uB85C\uC6B4 Pod \uB9CC\uB4E4\uAE30</button>\n      </div>\n    ");
    return;
  }

  var template = '';
  pods.forEach(function (pod) {
    var containers = '';
    pod.spec.containers.forEach(function (container) {
      containers += "\n        <div class=\"container\">".concat(container.image, "</div>\n      ");
    });
    template += "\n      <div class=\"pod-wrap\">\n        <div class=\"pod\">\n          <div class=\"pod-name\">".concat(pod.metadata.name, "</div>\n          <div class=\"pod-namespace\">(").concat(pod.metadata.namespace, ")</div>\n          <div class=\"host\">\n            ").concat(pod.spec.nodeName, "<b class=\"sub\">(").concat(pod.status.hostIP, ")</b> - ").concat(pod.status.phase, "\n          </div>\n          <div class=\"pod-containers\">\n            Container(s)\n            ").concat(containers, "\n          </div>\n          <div class=\"start\">").concat(pod.status.startTime, "</div>\n          <div class=\"start\">\n            <button class=\"button red delete\" data-name=\"").concat(pod.metadata.name, "\">Delete</button>\n          </div>\n        </div>\n      </div>\n    ");
  });
  $('#project').html(template);
  $('.delete').on('click', function () {
    var name = $(this).data('name');

    if (name && confirm("Delete ".concat(name, "?"))) {
      $.ajax({
        url: '/API/deletePod',
        type: 'POST',
        dataType: 'JSON',
        data: {
          name: name
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
};

var getPods = function getPods() {
  $.ajax({
    url: '/API/getPods',
    type: 'GET',
    dataType: 'JSON',
    success: function success(res) {
      showPodsList(res && res.items);
    },
    error: function error(jqXHR, state) {
      console.error(jqXHR, state);
      showPodsList();
    }
  });
};

var poll = function poll() {
  var tick = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;
  setTimeout(function () {
    getPods();

    if (__globalPollPod) {
      poll();
    }
  }, tick);
};

var SAMPLE_YAML = "apiVersion: v1\nkind: Pod\nmetadata:\n  name: POD_NAME\nspec:\n  containers:\n  - name: CONTAINER_NAME\n    image: ubuntu\n    ports:\n    - containerPort: 7777";
$(function () {
  getPods();
  $('#create').click(function () {
    $('#collapse').toggleClass('show');

    if ($('#collapse').hasClass('show')) {
      $('#yaml').val(SAMPLE_YAML);
    }
  });
  $('#yaml_submit').click(function () {
    var yaml = $('#yaml').val();

    if (yaml) {
      $.ajax({
        url: '/API/createPod',
        type: 'POST',
        dataType: 'JSON',
        data: {
          yaml: yaml
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
    } else {
      console.error('yaml is empty');
    }
  });
});
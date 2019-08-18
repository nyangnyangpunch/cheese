const colors = require('colors')

// 로그 레벨 정의 (콘솔 출력 색상)
const LEVELS = {
  'DEBUG': colors.reset,
  'INFO': colors.blue,
  'SUCCESS': colors.green,
  'WARNING': colors.yellow,
  'DANGER': colors.red,
  'CRITICAL': colors.magenta
}


/**
 * 호출 시점의 시간을 문자열로 변환
 * @return {string} 시간 포맷 문자열
 */
const timeStamp = () => {
  function pad (t, s, w = '0') {
    t = t.toString()
    while (t.length < s) t = w + t
    return t
  }

  // Current date
  const _ = new Date()
  const yyyy = pad(_.getFullYear(), 4)
  const MM = pad(_.getMonth() + 1, 2)
  const dd = pad(_.getDate(), 2)
  const hh = pad(_.getHours(), 2)
  const mm = pad(_.getMinutes(), 2)
  const ss = pad(_.getSeconds(), 2)
  const ms = pad(_.getMilliseconds(), 3)

  return `[${yyyy}.${MM}.${dd} ${hh}:${mm}:${ss}.${ms}]`
}


/**
 * 로그 출력 인터페이스
 * @param {string} msg 로그 출력 메시지
 * @param {string} level 로그 레벨
 */
const log = (msg, level) => {
  console.log(timeStamp(), LEVELS[level](level), '-', msg)
}


/**
 * 로거 객체
 */
const logger = {
  debug (msg) {
    log(msg, 'DEBUG')
  },
  info (msg) {
    log(msg, 'INFO')
  },
  success (msg) {
    log(msg, 'SUCCESS')
  },
  warning (msg) {
    log(msg, 'WARNING')
  },
  danger (msg) {
    log(msg, 'DANGER')
  },
  critical (msg) {
    log(msg, 'CRITICAL')
  }
}

exports.logger = logger

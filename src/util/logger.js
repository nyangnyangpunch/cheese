const colors = require('colors')

const LEVELS = {
  'DEBUG': colors.reset,
  'INFO': colors.blue,
  'SUCCESS': colors.green,
  'WARNING': colors.yellow,
  'DANGER': colors.red,
  'CRITICAL': colors.magenta
}

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

const log = (msg, level) => {
  console.log(timeStamp(), LEVELS[level](level), '-', msg)
}

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

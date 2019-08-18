const config = require('config')
const path = require('path')
const fs = require('fs')

/**
 * Config의 static 옵션 경로에 있는 파일을 로드하고 반환 (HTML)
 * @param {string} fileName 파일명
 * @return {Promise}
 */
const render = fileName => {
  return new Promise(resolve => {
    fs.readFile(path.join(global.__root, config.get('static'), fileName),
                'utf8',
                (err, data) => {
      if (err) {
        resolve(err)
      } else {
        resolve(data)
      }
    })
  })
}

exports.render = render

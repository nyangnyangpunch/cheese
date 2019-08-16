const config = require('config')
const path = require('path')
const fs = require('fs')

// HTML 파일 읽고 반환
exports.render = fileName => {
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

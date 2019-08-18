const { logger } = require('./src/util/logger')
const express = require('express')
const config = require('config')
const app = express()

const PORT = config.get('port')

global.__root = __dirname
require('./src/init')(app)

// 예기치않은 예외 처리
process.on('uncaughtException', err => {
  logger.critical(err)
})

// 서버 실행
app.listen(PORT, () => logger.info(`Server started, port: ${PORT}`))

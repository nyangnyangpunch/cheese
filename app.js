const { logger } = require('./src/util/logger')
const express = require('express')
const config = require('config')
const app = express()

const PORT = config.get('port')

global.__root = __dirname
require('./src/init')(app)

// 서버 실행
app.listen(PORT, () => logger.info(`Server started, port: ${PORT}`))

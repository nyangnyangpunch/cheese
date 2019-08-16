const { logger } = require('./src/util/logger')
const express = require('express')
const config = require('config')
const app = express()

global.__root = __dirname
require('./src/init')(app)

// 서버 실행
app.listen(config.get('port'), () => logger.info('Server started'))

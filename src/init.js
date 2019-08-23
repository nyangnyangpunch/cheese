const { logger } = require('./util/logger')
const es = require('./api/elastic/elasticsearch')

const bodyParser = require('body-parser')
const express = require('express')
const config = require('config')
const path = require('path')

// 서버 초기화 스크립트
module.exports = app => {
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  // 서버 접속 로깅
  app.use('*', (_, res, next) => {
    const afterResponse = () => {
      res.removeListener('finish', afterResponse)
      res.removeListener('close', afterResponse)
      logger.info(`${res.req.method} ${res.statusCode} - ${res.req.originalUrl}`)
    }

    // 리스너 등록
    res.on('finish', afterResponse)
    res.on('close', afterResponse)
    next()
  })


  /* 정적파일 경로 */
  app.use('/js', express.static(
    path.join(global.__root, config.get('static'), '/js')))
  app.use('/css', express.static(
    path.join(global.__root, config.get('static'), '/css')))
  app.use('/resource', express.static(
    path.join(global.__root, config.get('static'), '/resource')))
  
  /* 페이지 및 API 라우터 등록 */
  require('./page/route')(app)
  require('./api/init')(app)

  /* ElasticSearch 클라이언트 초기화 */
  es.init()
}

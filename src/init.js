const express = require('express')
const config = require('config')
const path = require('path')

// 서버 초기화 스크립트
module.exports = app => {
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
}

// 서버 초기화 스크립트
module.exports = app => {
  require('./page/route')(app)
  require('./api/init')(app)
}

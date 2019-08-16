const { logger } = require('../util/logger')
const API_ENDPOINT = '/API'

module.exports = app => {
  app.get(API_ENDPOINT + '/testApi', async (req, res) => {
    logger.debug('Recieved: ' + req.query.text)
    res.json({ name: 'catpunch' })

    // TODO: 명령어 받고 서버측에서 커맨드 실행하기
  })
}

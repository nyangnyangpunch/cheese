const { render } = require('../util/util')

module.exports = app => {
  // root 페이지
  app.get('/', async (_, res) => {
    res.send(await render('index.html'))
  })

  app.get('/test', async (_, res) => {
    res.send('Test')
  })
}

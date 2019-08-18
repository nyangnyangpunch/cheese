const { render } = require('../util/util')

module.exports = app => {
  // root 페이지
  app.get('/', async (_, res) => {
    res.send(await render('index.html'))
  })

  /*----- HTML 페이지 제공 -----*/
  // Project 메뉴
  app.get('/project', async (_, res) => {
    res.send(await render('project.html'))
  })

  // visual 메뉴
  app.get('/visual', async (_, res) => {
    res.send(await render('visualization.html'))
  })

  // manage 메뉴
  app.get('/manage', async (_, res) => {
    res.send(await render('management.html'))
  })

  // Setting 메뉴
  app.get('/setting', async (_, res) => {
    res.send(await render('setting.html'))
  })

  // Help 메뉴
  app.get('/help', async (_, res) => {
    res.send(await render('help.html'))
  })
}

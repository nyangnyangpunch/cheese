const API_ENDPOINT = '/API'

module.exports = app => {
  app.get(API_ENDPOINT + '/testApi', async (req, res) => {
    res.json({ name: 'catpunch' })
  })
}

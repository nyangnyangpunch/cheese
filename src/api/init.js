const { logger } = require('../util/logger')
const { executeCommand } = require('../util/command')
const API_ENDPOINT = '/API'

module.exports = app => {
  app.get(API_ENDPOINT + '/testApi', async (req, res) => {
    const text = req.query.text.split(' ')
    const cmd = text[0]
    const args = text.slice(1)
    logger.debug(`${cmd} ${args}`)

    try {
      var response = await executeCommand(cmd, args)
    } catch (e) {
      logger.error(e)
    }

    res.json(response)
  })
}

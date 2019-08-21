const { logger } = require('../../util/logger')
const { Client } = require('@elastic/elasticsearch')

class ElasticSearchManager {
  constructor () {
    this.host = 'http://localhost:9200'
    this.client = null
  }

  init () {
    this.client = new Client({ node: this.host })
  }

  async search (index, options) {
    let result = null
    try {
      result = await this.client.search({
        index,
        body: options
      })
    } catch (e) {
      logger.error(e)
    }
    return result
  }
}

module.exports = new ElasticSearchManager()

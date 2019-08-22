const { logger } = require('../../util/logger')
const { Client } = require('@elastic/elasticsearch')
const request = require('request')

class ElasticSearchManager {
  constructor () {
    this.host = 'http://localhost'
    this.port = 9200
    this.client = null
  }

  init () {
    this.client = new Client({
      node: this.host + ':' + this.port
    })
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

  async requestSearch (index, q='', option = {}) {
    return new Promise(resolve => {
      request({
        hostname: this.host,
        port: this.port,
        path: '/' + index + '/_search' + q,
        json: option
      }, (err, res, body) => {
        if (err) {
          resolve({})
        } else {
          resolve(JSON.parse(body))
        }
      })
    })
  }
}

module.exports = new ElasticSearchManager()

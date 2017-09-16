'use strict'

const f = require('node-fetch')

class Net {
  static fetch (url, params) {
    var urlencoded = ''
    for (var i in params) {
      urlencoded += '&' + i + '=' + params[i] // in the format &[key]=[value]
    }

    urlencoded = '?' + urlencoded.substring(1)

    return f(url + urlencoded)
  }
}

module.exports = Net
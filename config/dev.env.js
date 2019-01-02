'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  BASE_API: '"http://192.168.0.104:8081"',
  NODE_ENV: '"development"'
})

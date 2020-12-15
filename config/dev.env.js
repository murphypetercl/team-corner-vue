'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const dotenv = require('dotenv');
dotenv.config();

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_BACKEND_GRAPHQL: JSON.stringify(process.env.VUE_APP_BACKEND_GRAPHQL),
  VUE_APP_ORGANIZATION: JSON.stringify(process.env.VUE_APP_ORGANIZATION),
  VUE_APP_TEAM: JSON.stringify(process.env.VUE_APP_TEAM)
})

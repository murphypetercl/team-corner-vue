'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_BACKEND_GRAPHQL: '"http://localhost:3000/admin/api"',
  VUE_APP_ORGANIZATION: '"My GAA Club"',
  VUE_APP_TEAM: '"My Team"'
})

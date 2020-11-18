'use strict'
module.exports = {
  NODE_ENV: '"production"',
  VUE_APP_BACKEND_GRAPHQL: JSON.stringify(process.env.VUE_APP_BACKEND_GRAPHQL),
  VUE_APP_ORGANIZATION: JSON.stringify(process.env.VUE_APP_ORGANIZATION),
  VUE_APP_TEAM: JSON.stringify(process.env.VUE_APP_TEAM)
}

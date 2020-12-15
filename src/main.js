// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import App from './App'
import { router } from './router'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import { BootstrapVue, BootstrapVueIcons, IconsPlugin } from 'bootstrap-vue'
import { VueCsvImportPlugin } from 'vue-csv-import'
import { store } from './store'
import VueKonva from 'vue-konva'
import dotenv from 'dotenv'

Vue.use(VueKonva)

Vue.use(VueCsvImportPlugin)

Vue.config.productionTip = false

dotenv.config()

console.log('Backend=' + process.env.VUE_APP_BACKEND_GRAPHQL)

const httpEndpoint = process.env.VUE_APP_BACKEND_GRAPHQL

const httpLink = new HttpLink({
  uri: httpEndpoint
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from localstorage if it exists
  const token = localStorage.getItem('team-corner-token')

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

// Install the vue plugin
Vue.use(VueApollo)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(IconsPlugin)

extend('required', {
  ...required,
  message: 'This field is required'
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  apolloProvider,
  template: '<App/>',
  components: { App }
})

<template>
    <div id="app">
        <div>
            <b-navbar toggleable="lg" fixed="top" :sticky=true type="dark" variant="primary">
              <router-link to="/">
                <p class="h3 mb-1">
                  <b-navbar-brand><b-icon icon="house-door" variant="light"/> Team Corner</b-navbar-brand>
                </p>
              </router-link>

              <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

              <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item v-show="isLoggedIn==false" to="/register">Register</b-nav-item>
                    <b-nav-item v-show="isAdmin" to="/user/registration/list">All User Registrations</b-nav-item>
                    <b-nav-item :href="allOrganizations[0].webSite">{{allOrganizations[0].name}}</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto" v-if="authenticatedUser && authenticatedUser.id!=''">
                    <b-nav-item-dropdown right>
                        <template v-slot:button-content>
                            <em>{{authenticatedUser.firstName}} {{authenticatedUser.lastName}}</em>
                        </template>
                        <b-dropdown-item href="#">Profile</b-dropdown-item>
                        <b-dropdown-item @click="logOut">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
              </b-collapse>
          </b-navbar>
        </div>

          <b-container fluid>
            <b-row>
                <b-col align-self="start" sm=10 offset=0>
                    <transition name="slide-fade">
                        <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
                    </transition>
                    <router-view></router-view>
                </b-col>
            </b-row>
          </b-container>
        <div>
            <!-- credits -->
            <div class="text-center">
                <p>
                    <a href="https://www.linkedin.com/in/peter-murphy-61493974/" target="_top">Created by Peter Murphy</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { AUTHENTICATED_USER_QUERY, LOGOUT_MUTATION, ALL_ORG_QUERY } from '@/graphql'
import { handleError } from '@/errorHandler'

export default {
  name: 'app',
  data () {
    return {
      authenticatedUser: {
        firstName: '',
        lastName: '',
        id: '',
        isAdmin: false
      },
      allOrganizations: [
        {
          name: '',
          webSite: ''
        }
      ]
    }
  },
  apollo: {
    authenticatedUser: {
      query: AUTHENTICATED_USER_QUERY
    },
    allOrganizations: {
      query: ALL_ORG_QUERY,
      variables () {
        return {
          where: {
            name: process.env.VUE_APP_ORGANIZATION
          }
        }
      }
    }
  },
  computed: {
    isAdmin () {
      if (this.authenticatedUser) { return this.authenticatedUser.isAdmin } else { return false }
    },
    isLoggedIn () {
      if (this.authenticatedUser) { return true } else { return false }
    },
    ...mapState({
      alert: state => state.alert
    })
  },
  methods: {
    ...mapActions({
      clearAlert: 'alert/clear'
    }),
    logOut () {
      this.$apollo
        .mutate({
          mutation: LOGOUT_MUTATION,
          update: (store, { data: { unauthenticateUser } }) => {
            // read data from cache for this query
            const data = store.readQuery({ query: AUTHENTICATED_USER_QUERY })

            data.authenticatedUser.id = ''
            data.authenticatedUser.firstName = ''
            data.authenticatedUser.lastName = ''
            data.authenticatedUser.email = ''
            data.authenticatedUser.isAdmin = false

            // write data back to the cache
            store.writeQuery({ query: AUTHENTICATED_USER_QUERY, data })
          }
        })
        .then(response => {
          // save user token to localstorage
          localStorage.removeItem('team-corner-token')

          // redirect user
          this.$router.replace('/login')
        })
        .catch((error) => {
          // Error
          handleError(error, this.$store, this.$router)
        })
    }
  },
  watch: {
    $route (to, from) {
      // clear alert on location change
      this.clearAlert()
    }
  }
}
</script>

<style>
@import '/style/team-corner.css';
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';
@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-vue/dist/bootstrap-vue.css';
</style>

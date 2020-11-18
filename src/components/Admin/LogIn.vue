<template>
  <b-overlay :show="loggingIn" spinner-variant="primary" rounded="sm">
    <section class="section">
        <div class="columns">
            <div class="column is-4 is-offset-4">
                <b-form method="POST" @submit.prevent="login">
                  <b-container fluid>
                      <b-row class="my-1">
                        <b-col sm="3">
                          <h2 class="title has-text-centered">Login</h2>
                          <label class="label">E-Mail Address</label>
                          <p class="control">
                            <input type="email" class="form-control" v-model="email">
                          </p>
                          <label class="label">Password</label>
                          <p class="control">
                            <input type="password" class="form-control" v-model="password">
                          </p>
                          <p class="control">
                            <button class="btn btn-primary">Login</button>
                          </p>
                        </b-col>
                      </b-row>
                  </b-container>
                </b-form>
            </div>
        </div>
    </section>
  </b-overlay>
</template>

<script>
import { LOGIN_MUTATION, AUTHENTICATED_USER_QUERY } from '@/graphql'

export default {
  name: 'LogIn',
  data () {
    return {
      email: '',
      password: '',
      loggingIn: false
    }
  },
  methods: {
    login () {
      this.loggingIn = true

      this.$apollo
        .mutate({
          mutation: LOGIN_MUTATION,
          variables: {
            email: this.email,
            password: this.password
          },
          update: (store, { data: { authenticateUserWithPassword } }) => {
          // read data from cache for this query
            const data = store.readQuery({ query: AUTHENTICATED_USER_QUERY })

            const authenticatedUser = {}
            authenticatedUser.__typename = authenticateUserWithPassword.__typename
            authenticatedUser.id = authenticateUserWithPassword.item.id
            authenticatedUser.firstName = authenticateUserWithPassword.item.firstName
            authenticatedUser.lastName = authenticateUserWithPassword.item.lastName
            authenticatedUser.email = authenticateUserWithPassword.item.email
            authenticatedUser.isAdmin = authenticateUserWithPassword.item.isAdmin
            authenticatedUser.isMember = !authenticateUserWithPassword.item.isAdmin

            data.authenticatedUser = authenticatedUser
            // write data back to the cache
            store.writeQuery({ query: AUTHENTICATED_USER_QUERY, data })
          }
        }
        )
        .then(response => {
          // save user token to localstorage
          localStorage.setItem('team-corner-token', response.data.authenticateUserWithPassword.token)
          this.loggingIn = false
          // redirect user
          this.$router.replace('/')
        })
        .catch((error) => {
          // Error
          this.$store.dispatch('alert/error', error, { root: true })
          this.loggingIn = false
        })
    }
  }
}
</script>

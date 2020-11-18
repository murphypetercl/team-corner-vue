<template>
    <div>
        <h1>Hi {{authenticatedUser.firstName}}!</h1>
        <p>Welcome to Team Corner!!</p>
        <b-container fluid>
          <b-row>
              <b-col>
                  <p>
                      <router-link to="/admin/games">
                        <b-card
                          title="Games"
                          img-src="/static/games.PNG"
                          img-alt="Games"
                          img-top
                          img-height=200
                          img-width=230
                          tag="article"
                          style="max-width: 25rem;"
                          class="mb-2"
                        >
                          <b-card-text>
                            Games, statistics, logs and more...
                          </b-card-text>
                        </b-card>
                      </router-link>
                  </p>
                  <p>
                      <router-link to="/admin/schedule">
                        <b-card
                          title="Schedule"
                          img-src="/static/schedule.PNG"
                          img-alt="Schedule"
                          img-top
                          img-height=200
                          img-width=230
                          tag="article"
                          style="max-width: 25rem;"
                          class="mb-2"
                        >
                          <b-card-text>
                            Schedule for matches, training and any other team activities...
                          </b-card-text>
                        </b-card>
                      </router-link>
                  </p>
              </b-col>
          </b-row>
        </b-container>
    </div>
</template>

<script>
import { AUTHENTICATED_USER_QUERY } from '@/graphql'
import { handleError } from '@/errorHandler'

export default {
  name: 'Home',
  data () {
    return {
      authenticatedUser: {}
    }
  },
  apollo: {
    authenticatedUser: {
      query: AUTHENTICATED_USER_QUERY,
      error (error) {
        handleError(error, this.$store, this.$router)
      },
      result (result, key) {
        if (result.data.authenticatedUser == null) {
          // save user token to localstorage
          localStorage.removeItem('team-corner-token')

          // redirect user
          this.$router.replace('/login')
        }
      }
    }
  }
}
</script>

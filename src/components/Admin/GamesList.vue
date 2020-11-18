<template>
    <div>
      <p></p>
      <b-button-group>
        <router-link v-show="authenticatedUser.isAdmin" to="/admin/game/create">
          <b-button variant=primary>Create Game</b-button>
        </router-link>
      </b-button-group>

      <p></p>

      <div v-if="$apollo.queries.allGames.loading" class="d-flex justify-content-center mb-3">
        <b-spinner variant="primary" label="Loading..."></b-spinner>
      </div>

      <div v-for="game in allGamesSorted" :key="game.id">
        <router-link :to="{path: '/admin/game', query: {id: game.id}}">
          <b-card bg-variant="light" text-variant="black" v-bind:title=game.competition>
            <b-card-text v-if="game.gameStatSummary!=null">
                {{team}} {{ game.gameStatSummary.goalsForSelf }}-{{ game.gameStatSummary.pointsForSelf }}  {{ game.opposition }} {{ game.gameStatSummary.goalsForOpposition }}-{{ game.gameStatSummary.pointsForOpposition }}
            </b-card-text>
            <b-card-text v-else>
                {{team}} vs {{ game.opposition }}
            </b-card-text>

            <b-card-text>
                <b>Venue:</b> {{ game.venue }}
            </b-card-text>

            <b-card-text>
               <b>Date:</b> {{ game.date }}
            </b-card-text>
          </b-card>
        </router-link>
        <p></p>
      </div>
    </div>
</template>

<script>
import { ALL_GAMES_QUERY, AUTHENTICATED_USER_QUERY } from '@/graphql'
import { handleError } from '@/errorHandler'
import { sortGames } from '@/dataHelper'

export default {
  name: 'GamesList',
  data () {
    return {
      allGames: [],
      authenticatedUser: {}
    }
  },
  computed: {
    team: function () {
      return process.env.VUE_APP_TEAM
    },
    allGamesSorted: function () {
      return sortGames(this.allGames, 'date', 'desc')
    }
  },
  apollo: {
    allGames: {
      query: ALL_GAMES_QUERY,
      error (error) {
        handleError(error, this.$store, this.$router)
      }
    },
    authenticatedUser: {
      query: AUTHENTICATED_USER_QUERY,
      error (error) {
        handleError(error, this.$store, this.$router)
      },
      result (_result, key) {
        if (_result.data.authenticatedUser == null) {
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

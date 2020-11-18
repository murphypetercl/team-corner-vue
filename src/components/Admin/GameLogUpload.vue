<template>
    <div>
        <h2>Upload Game Logs</h2>
        <vue-csv-import
            v-model="csv"
            :map-fields="{team: 'Team Name',
            playerNumber: 'Player Number',
            playerName:'Player Name',
            stat: 'Statistic',
            gameTimeMin: 'Game Time Mins',
            gameTimeSec: 'Game Time Secs',
            formattedTime: 'Formatted Time (hh:mm:ss)',
            half: 'Half'}"
            buttonClass="btn btn-primary"
            headers=true
            >
        </vue-csv-import>
        <div v-if="uploading" class="d-flex justify-content-center mb-3">
            <b-spinner variant="primary" label="Loading..."></b-spinner>
        </div>
        <div class="form-group">
        <button :disabled="uploadButtonEnabled" class="btn btn-primary" @click="createGameLogs()">Upload Logs</button>
        </div>

        <ul>
        <b-button-group>
        <router-link :to="{name: 'Game', query: { id: this.id }}" class="btn btn-link">Skip</router-link>
        </b-button-group>
        <p></p>
        </ul>

    </div>
</template>

<script>
import { GAME_UPDATE, GAME_QUERY } from '@/graphql'
import { gameStatSummary } from '@/gameStats'
import { handleError } from '@/errorHandler'

export default {
  name: 'GameLogUpload',
  props: ['id'],
  data () {
    return {
      csv: null,
      Game: {},
      uploading: false
    }
  },
  computed: {
    // a computed getter
    uploadButtonEnabled: function () {
      // `this` points to the vm instance
      return this.csv == null
    },
    editMode: function () {
      if (this.createMode || this.edit) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    createGameLogs () {
      this.uploading = true
      const gameid = this.id
      const { csv } = this
      const myApollo = this.$apollo

      const gqlcsv = []
      for (var i = 0; i < csv.length; i++) {
        var obj = csv[i]
        obj.gameId = gameid
        gqlcsv.push(obj)
      }

      const gameData = {
        gameLogs: {create: gqlcsv}
      }

      this.Game = this.$apollo
        .query({
          query: GAME_QUERY,
          variables: {
            id: gameid
          }
        })

      // upload the logs first
      this.$apollo
        .mutate({
          mutation: GAME_UPDATE,
          variables: {
            id: gameid,
            data: gameData
          }
        })
        .then(response => {
          // then get the summary stats and update
          const gameStats = gameStatSummary(gameid, response.data.updateGame.gameLogs)
          const gameData = {
            gameStatSummary: {create: gameStats}
          }

          myApollo
            .mutate({
              mutation: GAME_UPDATE,
              variables: {
                id: gameid,
                data: gameData
              }
            })
            .then(response => {
              // this.$router.push({name: 'Game', query: {id: gameid}})
              this.$router.replace({name: 'GamePuckoutsUpload', query: {id: response.data.updateGame.id}})
              this.uploading = false
              setTimeout(() => {
                // display success message after route change completes
                this.$store.dispatch('alert/success', 'Game Logs uploaded and Summary Statistics generated.', { root: true })
              })
            })
            .catch((error) => {
              this.uploading = false
              // Error
              handleError(error, this.$store, this.$router)
            })
        })
        .catch((error) => {
          this.uploading = false
          // Error
          handleError(error, this.$store, this.$router)
        })
    }
  }
}

</script>

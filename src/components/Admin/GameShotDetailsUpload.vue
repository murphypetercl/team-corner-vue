<template>
    <div>
        <h2>Upload Game Shot Details</h2>
        <vue-csv-import
            v-model="csv"
            :map-fields="{
              teamName: 'Team Name',
              playerName:'Player Name',
              number: 'Number',
              shotFromFreeOrPlay: 'Shot From Free Or Play',
              shotOutcome: 'Shot Outcome',
              xPosition: 'X Pos',
              yPosition: 'Y Pos',
              half: 'Half',
              gameTime: 'Game Time',
              }"
            buttonClass="btn btn-primary"
            headers=true
            >
        </vue-csv-import>
        <div v-if="uploading" class="d-flex justify-content-center mb-3">
            <b-spinner variant="primary" label="Loading..."></b-spinner>
        </div>
        <div class="form-group">
        <button :disabled="uploadButtonEnabled" class="btn btn-primary" @click="uploadGameShots()">Upload Game Shots</button>
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
import { GAME_QUERY, AUTHENTICATED_USER_QUERY, GAMELOGS_UPDATE } from '@/graphql'
import { handleError } from '@/errorHandler'

export default {
  name: 'GameShotDetailsUpload',
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
  apollo: {
    Game: {
      query: GAME_QUERY,
      variables () {
        return {
          id: this.id
        }
      }
    },
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
  },
  methods: {
    uploadGameShots () {
      const jsonAggregate = require('json-aggregate')

      this.uploading = true
      const gameid = this.id
      const { csv } = this

      var gameLogsJson = JSON.stringify(this.Game.gameLogs)
      const collection = jsonAggregate.create(gameLogsJson)
      const logShots = jsonAggregate.create(JSON.stringify(collection.match(item => item.stat.indexOf('From') >= 0).exec())).data
      console.log(logShots)

      var uploadedShotsJson = JSON.stringify(csv)
      const uploadedShots = jsonAggregate.create(uploadedShotsJson)
      console.log(uploadedShots)

      var shot, gameTime, log
      const updatedLogs = []

      for (log in logShots) {
        gameTime = logShots[log].gameTimeMin.concat(' mins ').concat(logShots[log].gameTimeSec).concat(' secs')
        shot = uploadedShots.match(item => item.gameTime.indexOf(gameTime) >= 0).exec()

        updatedLogs.push(
          {
            id: logShots[log].id,
            data: {
              formattedTime: logShots[log].formattedTime,
              gameTimeMin: logShots[log].gameTimeMin,
              gameTimeSec: logShots[log].gameTimeSec,
              half: logShots[log].half,
              playerName: logShots[log].playerName,
              playerNumber: logShots[log].playerNumber,
              stat: logShots[log].stat,
              team: logShots[log].team,
              x: shot[0].xPosition,
              y: shot[0].yPosition
            }
          }
        )
      }

      // upload the logs first
      this.$apollo
        .mutate({
          mutation: GAMELOGS_UPDATE,
          variables: {
            data: updatedLogs
          }
        })
        .then(response => {
          this.$router.push({name: 'Game', query: {id: gameid}})
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
    }
  }
}

</script>

<template>
    <div>
        <h2>Upload Game Puckouts</h2>
        <vue-csv-import
            v-model="csv"
            :map-fields="{
              teamPuckout: 'Team Puckout',
              teamThatWonPuckout: 'Team that Won Puckout',
              playerName:'Player Name',
              number: 'Number',
              cleanCatchOrBreak: 'Clean Catch Or Breaking Ball',
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
        <button :disabled="uploadButtonEnabled" class="btn btn-primary" @click="uploadGamePuckouts()">Upload Game Puckouts</button>
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
  name: 'GamePuckoutsUpload',
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
    uploadGamePuckouts () {
      const jsonAggregate = require('json-aggregate')

      this.uploading = true
      const gameid = this.id
      const { csv } = this

      var gameLogsJson = JSON.stringify(this.Game.gameLogs)
      const collection = jsonAggregate.create(gameLogsJson)
      const logPuckouts = jsonAggregate.create(JSON.stringify(collection.match(item => item.stat.indexOf('Puckout') >= 0).exec())).data
      console.log(logPuckouts)

      var uploadedPuckoutsJson = JSON.stringify(csv)
      const uploadedPuckouts = jsonAggregate.create(uploadedPuckoutsJson)
      console.log(uploadedPuckouts)

      var puckout, gameTime, log
      const updatedLogs = []

      for (log in logPuckouts) {
        gameTime = logPuckouts[log].gameTimeMin.concat(' mins ').concat(logPuckouts[log].gameTimeSec).concat(' secs')
        puckout = uploadedPuckouts.match(item => item.gameTime.indexOf(gameTime) >= 0).exec()

        updatedLogs.push(
          {
            id: logPuckouts[log].id,
            data: {
              formattedTime: logPuckouts[log].formattedTime,
              gameTimeMin: logPuckouts[log].gameTimeMin,
              gameTimeSec: logPuckouts[log].gameTimeSec,
              half: logPuckouts[log].half,
              playerName: logPuckouts[log].playerName,
              playerNumber: logPuckouts[log].playerNumber,
              stat: logPuckouts[log].stat,
              team: logPuckouts[log].team,
              x: puckout[0].xPosition,
              y: puckout[0].yPosition
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

<template>
    <div>
      <b-overlay :show="loading" spinner-variant="primary" rounded="sm">
        <div class="form-group">
          <b-dropdown v-show="authenticatedUser.isAdmin" id="dropdown-1" text="Mode" size="sm" class="m-md-2">
              <b-dropdown-item @click="activateEditMode">Edit</b-dropdown-item>
              <b-dropdown-item @click="deactivateEditMode"> Display</b-dropdown-item>
          </b-dropdown>
        </div>
        <h2>Game Overview</h2>
        <ValidationObserver v-slot="{ invalid }">
          <b-form @submit.prevent="updateGame">
            <b-container fluid>
              <b-row class="my-1" v-for="fields in overviewFields" :key="fields.name">
                <b-col sm="2">
                  <b><label :for="`${fields.name}`">{{ fields.label }}</label></b>
                </b-col>
                <b-col sm="3">
                  <div v-show="editMode==false">{{ Game[fields.name] }}</div>
                  <b-form-datepicker v-if="fields.type=='date' && editMode==true" :type="fields.type" v-model="Game[fields.name]" :name="`${fields.name}`"></b-form-datepicker>
                  <b-form-input v-else v-show="editMode==true" :type="fields.type" v-model="Game[fields.name]" :name="`${fields.name}`"></b-form-input>
                </b-col>
              </b-row>
            </b-container>
            <div v-if="showScore">
              <h3>Score</h3>
              <strong>{{ team }} {{ Game.gameStatSummary.goalsForSelf }}-{{ Game.gameStatSummary.pointsForSelf }}  {{ Game.opposition }} {{ Game.gameStatSummary.goalsForOpposition }}-{{ Game.gameStatSummary.pointsForOpposition }}</strong>
            </div>
            <hr>
            <h3>Team Sheet</h3>
            <b-container fluid>
              <b-row class="my-1">
                <b-col sm="5">
                  <b-table striped hover :items="sortedTeamSheet" :fields="teamSheetfields" :primary-key="id">
                    <template v-slot:cell(number)="row">
                      {{row.item.number }}
                    </template>
                    <template v-slot:cell(name)="row">
                      <b-form-select v-show="editMode==true" v-model="row.item.name" :options="playerOptions" value-field="text" class="form-control" />
                      <div v-show="editMode==false" >{{row.item.name }} </div>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row align-h="end">
                <b-col cols="8" align-self="start">
                  <button v-show="editMode==true" @click="addPlayer" class="btn btn-primary" ><b-icon icon="person-plus"></b-icon></button>
                </b-col>
              </b-row>
            </b-container>
            <div class="form-group">
                  <button v-show="editMode==true" :disabled="invalid" type="submit" class="btn btn-primary" >Save</button>
                  <b-button  variant="danger" v-show="editMode==true" :disabled="invalid" @click="deleteGame" class="btn btn-primary" ><b-icon icon="trash"></b-icon></b-button>
                  <img v-show="status.updating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                  <router-link v-show="editMode==true" to="/admin/games" class="btn btn-link">Cancel</router-link>
            </div>
          </b-form>
        </ValidationObserver>
      </b-overlay>
    </div>
</template>

<script>
import { GAME_QUERY, GAME_UPDATE, GAME_DELETE, ALL_GAMES_QUERY, GAMELOGS_DELETE, AUTHENTICATED_USER_QUERY, GAMESTATSUMMARY_DELETE, ALL_PLAYERS_QUERY } from '@/graphql'
import { handleError } from '@/errorHandler'
import { sortTeamSheet } from '@/dataHelper'

export default {
  name: 'Game',
  props: ['id'],
  data () {
    return {
      Game: {
        gameLogs: [],
        gameLineOut: []
      },
      editMode: false,
      status: {},
      csv: null,
      authenticatedUser: {isAdmin: false},
      overviewFields: [
        { label: 'Competition', type: 'text', name: 'competition' },
        { label: 'Opposition', type: 'text', name: 'opposition' },
        { label: 'Venue', type: 'text', name: 'venue' },
        { label: 'Date', type: 'date', name: 'date' }
      ],
      teamSheetfields: [
        { key: 'number', label: 'Number' },
        { key: 'name', label: 'Full Name' }
      ],
      teamSheet: [],
      loading: true
    }
  },
  apollo: {
    Game: {
      query: GAME_QUERY,
      variables () {
        return {
          id: this.id
        }
      },
      result (_result, key) {
        const lineOut = _result.data.Game.gameLineOut
        var player = {}
        this.teamSheet = []
        for (player in lineOut) {
          this.teamSheet.push({
            number: lineOut[player].number,
            name: lineOut[player].player.firstName.concat(' ').concat(lineOut[player].player.lastName)
          })
        }
        this.loading = false
      }
    },
    allPlayers: {
      query: ALL_PLAYERS_QUERY
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
  },
  computed: {
    sortedTeamSheet: function () {
      return sortTeamSheet(this.teamSheet, 'number', 'asc')
    },
    showScore: function () {
      if (this.Game.gameStatSummary) {
        return true
      } else {
        return false
      }
    },
    disabled: function () {
      if (this.editMode === true) {
        return false
      } else { return true }
    },
    team: function () {
      return process.env.VUE_APP_TEAM
    },
    playerOptions: function () {
      const options = []
      var player = {}
      for (player in this.allPlayers) {
        options.push({value: this.allPlayers[player].id, text: this.allPlayers[player].firstName.concat(' ').concat(this.allPlayers[player].lastName)})
      }
      return options
    }
  },
  methods: {
    activateEditMode () {
      this.editMode = true
    },
    deactivateEditMode () {
      this.editMode = false
    },
    addPlayer (evt) {
      evt.preventDefault()
      this.teamSheet.push({
        number: this.teamSheet.length + 1,
        name: ''
      })
    },
    updateGame (e) {
      const { Game } = this
      delete Game.__typename
      delete Game.id
      delete Game.gameLogs
      delete Game.gameStatSummary
      const gameid = this.id

      var player = {}
      const lineup = []

      for (player in this.teamSheet) {
        lineup.push({
          gameId: gameid,
          number: this.teamSheet[player].number,
          player: {connect: {id: this.getPlayerId(this.teamSheet[player].name)}}
        })
      }
      Game.gameLineOut = {disconnectAll: true, create: lineup}

      // Call to the graphql mutation
      this.$apollo
        .mutate({
          mutation: GAME_UPDATE,
          variables: {
            id: gameid,
            data: Game
          },
          update: (store, { data: { updateGame } }) => {
            // read data from cache for this query
            const data = store.readQuery({ query: ALL_GAMES_QUERY })

            const gameToUpdate = data.allGames.find(g => g.id === gameid)

            gameToUpdate.competition = Game.competition
            gameToUpdate.opposition = Game.opposition
            gameToUpdate.venue = Game.venue
            gameToUpdate.date = Game.date
            gameToUpdate.gameLineOut = Game.gameLineOut

            // write data back to the cache
            store.writeQuery({ query: ALL_GAMES_QUERY, data })
          }
        })
        .then(response => {
          this.$router.replace('/admin/games')
          setTimeout(() => {
            // display success message after route change completes
            this.$store.dispatch('alert/success', 'Game updated.', { root: true })
          })
        })
        .catch((error) => {
          // Error
          handleError(error, this.$store, this.$router)
        })
    },
    getPlayerId (name) {
      var player = {}
      for (player in this.playerOptions) {
        if (this.playerOptions[player].text === name) {
          return this.playerOptions[player].value
        }
      }
      return null
    },
    async deleteGame (evt) {
      evt.preventDefault()
      const value = await this.$root.$bvModal.msgBoxConfirm('Are you sure?')

      if (value) {
        const { Game } = this
        const gameid = this.id
        const gameLogIds = []
        if (Game.gameLogs) {
          const gameLogs = Game.gameLogs

          for (var i = 0; i < gameLogs.length; i++) {
            if (gameLogs[i].id) { gameLogIds.push(gameLogs[i].id) }
          }
        }

        try {
          // delete the stats
          if (Game.gameStatSummary) {
            await this.$apollo
              .mutate({
                mutation: GAMESTATSUMMARY_DELETE,
                variables: {
                  id: Game.gameStatSummary.id
                }
              })
              .then(response => {
              })
              .catch((error) => {
              // Error
                handleError(error, this.$store, this.$router)
              })
          }
          // delete the logs
          await this.$apollo
            .mutate({
              mutation: GAMELOGS_DELETE,
              variables: {
                ids: gameLogIds
              }
            })
          // delete the game itself
          await this.$apollo
            .mutate({
              mutation: GAME_DELETE,
              variables: {
                id: gameid
              },
              update: (store, { data: { deleteGame } }) => {
              // read data from cache for this query
                const data = store.readQuery({ query: ALL_GAMES_QUERY })

                const gameToDelete = data.allGames.find(g => g.id === gameid)

                const idx = data.allGames.indexOf(gameToDelete)

                if (idx >= 0) {
                  data.allGames.splice(idx, 1)
                  store.writeQuery({ query: ALL_GAMES_QUERY, data })
                }
              }
            })

          this.$router.replace('/admin/games')
          setTimeout(() => {
            // display success message after route change completes
            this.$store.dispatch('alert/success', 'Game deleted.', { root: true })
          })
        } catch (error) {
          // Error
          handleError(error, this.$store, this.$router)
        }
      }
    }
  }
}

</script>

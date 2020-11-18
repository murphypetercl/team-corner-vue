<template>
    <div>
      <div class="form-group">
        <b-dropdown id="dropdown-1" text="Mode" class="m-md-2">
            <b-dropdown-item @click="activateEditMode">Edit</b-dropdown-item>
            <b-dropdown-item @click="deactivateEditMode"> Display</b-dropdown-item>
        </b-dropdown>
        <router-link :to="{name: 'GameLogs', query: { id: this.id }}" class="btn btn-link">Back</router-link>
      </div>
          <h2>Game Log</h2>
      <!--    <div v-if="$apollo.queries.GameLog.loading" class="d-flex justify-content-center mb-3">
            <b-spinner variant="primary" label="Loading..."></b-spinner>
          </div> -->
          <ValidationObserver v-slot="{ invalid }">
            <form @submit.prevent="updateGameLog">
                <div class="form-group">
                    <label for="competition">Team</label>
                    <em v-show="editMode==false">{{ GameLog.team }}</em>
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <input v-show="editMode==true" type="text" v-model="GameLog.team" name="team" class="form-control" />
                      <span>{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form-group">
                    <label for="competition">Player Number</label>
                    <em v-show="editMode==false">{{ GameLog.playerNumber }}</em>
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <input v-show="editMode==true" type="text" v-model="GameLog.playerNumber" name="playerNumber" class="form-control" />
                      <span>{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form-group">
                    <label for="competition">Player Name</label>
                    <em v-show="editMode==false">{{ GameLog.playerName }}</em>
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <input v-show="editMode==true" type="text" v-model="GameLog.playerName" name="playerName" class="form-control" />
                      <span>{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form-group">
                    <label for="competition">Statistic</label>
                    <em v-show="editMode==false">{{ GameLog.stat }}</em>
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <input v-show="editMode==true" type="text" v-model="GameLog.stat" name="stat" class="form-control" />
                      <span>{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form-group">
                    <label for="competition">Game Time (Minute)</label>
                    <em v-show="editMode==false">{{ GameLog.gameTimeMin }}</em>
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <input v-show="editMode==true" type="text" v-model="GameLog.gameTimeMin" name="gameTimeMin" class="form-control" />
                      <span>{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form-group">
                    <label for="competition">Game Time (Second)</label>
                    <em v-show="editMode==false">{{ GameLog.gameTimeSec }}</em>
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <input v-show="editMode==true" type="text" v-model="GameLog.gameTimeSec" name="gameTimeSec" class="form-control" />
                      <span>{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form-group">
                    <label for="competition">Half</label>
                    <em v-show="editMode==false">{{ GameLog.half }}</em>
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <input v-show="editMode==true" type="text" v-model="GameLog.half" name="half" class="form-control" />
                      <span>{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
            </form>
              <div class="form-group">
                  <button v-show="editMode==true" :disabled="invalid" @click="updateGameLog" class="btn btn-primary" >Update</button>
                  <button v-show="editMode==true" @click="deleteGameLog" class="btn btn-primary" >Delete</button>
                  <img v-show="status.updating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                  <router-link v-show="editMode==true" to="/admin/games" class="btn btn-link">Cancel</router-link>
              </div>
          </ValidationObserver>
    </div>
</template>

<script>
import { GAMELOG_QUERY, GAMELOG_UPDATE, GAMELOG_DELETE, GAME_QUERY, GAMESTATS_UPDATE } from '@/graphql'
import { gameStatSummary } from '@/gameStats'
import { handleError } from '@/errorHandler'

export default {
  name: 'GameLog',
  props: ['id', 'logid'],
  data () {
    return {
      Game: {},
      GameLog: {},
      editMode: true,
      // submitted: false,
      status: {}
    }
  },
  apollo: {
    GameLog: {
      query: GAMELOG_QUERY,
      variables () {
        return {
          id: this.logid
        }
      }
    }
  },
  computed: {
    // a computed getter
    uploadButtonEnabled: function () {
      // `this` points to the vm instance
      return this.csv == null
    }
  },
  methods: {
    activateEditMode () {
      this.editMode = true
    },
    deactivateEditMode () {
      this.editMode = false
    },
    getHalf (val) {
      if (val === '1') { return 'First' } else { return 'Second' }
    },
    updateGameLog (e) {
      const { GameLog } = this
      delete GameLog.__typename
      delete GameLog.id
      const gameid = this.id
      const myApollo = this.$apollo
      // const gamelogid = this.logid
      // this.submitted = true

      // Call to the graphql mutation
      this.$apollo
        .mutate({
          mutation: GAMELOG_UPDATE,
          variables: {
            // id: gamelogid,
            id: this.logid,
            data: GameLog
          }
        })
        .then(response => {
          // then get the summary stats and update
          myApollo
            .query({
              query: GAME_QUERY,
              variables: {
                id: gameid
              }
            }).then(response => {
              // then get the summary stats and update
              const gameStats = gameStatSummary(gameid, response.data.Game.gameLogs)

              myApollo
                .mutate({
                  mutation: GAMESTATS_UPDATE,
                  variables: {
                    id: response.data.Game.gameStatSummary.id,
                    data: gameStats
                  },
                  update: (store, { data: { updateUser } }) => {
                    const data = store.readQuery({ query: GAME_QUERY,
                      variables: {
                        id: gameid
                      } })

                    const gameStatSummary = data.Game.gameStatSummary
                    gameStatSummary.goalsForSelf = gameStats.goalsForSelf
                    gameStatSummary.pointsForSelf = gameStats.pointsForSelf
                    gameStatSummary.goalsForOpposition = gameStats.goalsForOpposition
                    gameStatSummary.pointsForOpposition = gameStats.pointsForOpposition
                    gameStatSummary.hookBlock = gameStats.hookBlock
                    gameStatSummary.turnover = gameStats.turnover
                    gameStatSummary.interception = gameStats.interception
                    gameStatSummary.looseBall = gameStats.looseBall
                    gameStatSummary.homePuckoutWonH1 = gameStats.homePuckoutWonH1
                    gameStatSummary.homePuckoutLostH1 = gameStats.homePuckoutLostH1
                    gameStatSummary.homePuckoutWonH2 = gameStats.homePuckoutWonH2
                    gameStatSummary.homePuckoutLostH2 = gameStats.homePuckoutLostH2
                    gameStatSummary.oppositionPuckoutWonH1 = gameStats.oppositionPuckoutWonH1
                    gameStatSummary.oppositionPuckoutLostH1 = gameStats.oppositionPuckoutLostH1
                    gameStatSummary.oppositionPuckoutWonH2 = gameStats.oppositionPuckoutWonH2
                    gameStatSummary.oppositionPuckoutLostH2 = gameStats.oppositionPuckoutLostH2
                    gameStatSummary.scoresFromPlayH1 = gameStats.scoresFromPlayH1
                    gameStatSummary.shotsFromPlayH1 = gameStats.shotsFromPlayH1
                    gameStatSummary.scoresFromPlayH2 = gameStats.scoresFromPlayH2
                    gameStatSummary.shotsFromPlayH2 = gameStats.shotsFromPlayH2
                    gameStatSummary.scoresFromFrees = gameStats.scoresFromFrees
                    gameStatSummary.shotsFromFrees = gameStats.shotsFromFrees
                    gameStatSummary.scoresFrom65s = gameStats.scoresFrom65s
                    gameStatSummary.shotsFrom65s = gameStats.shotsFrom65s
                    gameStatSummary.freesWon = gameStats.freesWon
                    gameStatSummary.freesConceded = gameStats.freesConceded
                    gameStatSummary.yellowCards = gameStats.yellowCards
                    gameStatSummary.redCards = gameStats.redCards

                    store.writeQuery({ query: GAME_QUERY,
                      variables: {
                        id: this.id
                      },
                      data })
                  }
                })
                .then(response => {
                  this.$router.replace({name: 'GameLogs', query: {id: gameid}})
                  setTimeout(() => {
                    // display success message after route change completes
                    this.$store.dispatch('alert/success', 'Game Log updated and Summary Statistics regenerated.', { root: true })
                  })
                })
                .catch((error) => {
                  // Error
                  handleError(error, this.$store, this.$router)
                })
            })
            .catch((error) => {
              // Error
              handleError(error, this.$store, this.$router)
            })
        })
        .catch((error) => {
          // Error
          handleError(error, this.$store, this.$router)
        })
    },
    deleteGameLog (e) {
      this.$bvModal.msgBoxConfirm('Are you sure?')
        .then(value => {
          if (value) {
            const gameid = this.id
            const myApollo = this.$apollo
            const logid = this.logid
            // Call to the graphql mutation

            this.Game = this.$apollo
              .query({
                query: GAME_QUERY,
                variables: {
                  id: gameid
                }
              })

            this.$apollo
              .mutate({
                mutation: GAMELOG_DELETE,
                variables: {
                  id: this.logid
                },
                update: (store, { data: { deleteGameLog } }) => {
                  // read data from cache for this query
                  const data = store.readQuery({ query: GAME_QUERY,
                    variables: {
                      id: gameid
                    } })

                  const gameLogToDelete = data.Game.gameLogs.find(g => g.id === logid)

                  const idx = data.Game.gameLogs.indexOf(gameLogToDelete)

                  if (idx >= 0) {
                    data.Game.gameLogs.splice(idx, 1)
                    store.writeQuery({ query: GAME_QUERY,
                      variables: {
                        id: this.id
                      },
                      data })
                  }
                }
              })
              .then(response => {
                myApollo
                  .query({
                    query: GAME_QUERY,
                    variables: {
                      id: gameid
                    }
                  }).then(response => {
                    // then get the summary stats and update
                    const gameStats = gameStatSummary(gameid, response.data.Game.gameLogs)

                    myApollo
                      .mutate({
                        mutation: GAMESTATS_UPDATE,
                        variables: {
                          id: response.data.Game.gameStatSummary.id,
                          data: gameStats
                        },
                        update: (store, { data: { updateUser } }) => {
                          const data = store.readQuery({ query: GAME_QUERY,
                            variables: {
                              id: gameid
                            } })

                          const gameStatSummary = data.Game.gameStatSummary
                          gameStatSummary.goalsForSelf = gameStats.goalsForSelf
                          gameStatSummary.pointsForSelf = gameStats.pointsForSelf
                          gameStatSummary.goalsForOpposition = gameStats.goalsForOpposition
                          gameStatSummary.pointsForOpposition = gameStats.pointsForOpposition
                          gameStatSummary.hookBlock = gameStats.hookBlock
                          gameStatSummary.turnover = gameStats.turnover
                          gameStatSummary.interception = gameStats.interception
                          gameStatSummary.looseBall = gameStats.looseBall
                          gameStatSummary.homePuckoutWonH1 = gameStats.homePuckoutWonH1
                          gameStatSummary.homePuckoutLostH1 = gameStats.homePuckoutLostH1
                          gameStatSummary.homePuckoutWonH2 = gameStats.homePuckoutWonH2
                          gameStatSummary.homePuckoutLostH2 = gameStats.homePuckoutLostH2
                          gameStatSummary.oppositionPuckoutWonH1 = gameStats.oppositionPuckoutWonH1
                          gameStatSummary.oppositionPuckoutLostH1 = gameStats.oppositionPuckoutLostH1
                          gameStatSummary.oppositionPuckoutWonH2 = gameStats.oppositionPuckoutWonH2
                          gameStatSummary.oppositionPuckoutLostH2 = gameStats.oppositionPuckoutLostH2
                          gameStatSummary.scoresFromPlayH1 = gameStats.scoresFromPlayH1
                          gameStatSummary.shotsFromPlayH1 = gameStats.shotsFromPlayH1
                          gameStatSummary.scoresFromPlayH2 = gameStats.scoresFromPlayH2
                          gameStatSummary.shotsFromPlayH2 = gameStats.shotsFromPlayH2
                          gameStatSummary.scoresFromFrees = gameStats.scoresFromFrees
                          gameStatSummary.shotsFromFrees = gameStats.shotsFromFrees
                          gameStatSummary.scoresFrom65s = gameStats.scoresFrom65s
                          gameStatSummary.shotsFrom65s = gameStats.shotsFrom65s
                          gameStatSummary.freesWon = gameStats.freesWon
                          gameStatSummary.freesConceded = gameStats.freesConceded
                          gameStatSummary.yellowCards = gameStats.yellowCards
                          gameStatSummary.redCards = gameStats.redCards

                          store.writeQuery({ query: GAME_QUERY,
                            variables: {
                              id: this.id
                            },
                            data })
                        }
                      })
                      .then(response => {
                        this.$router.replace({name: 'GameLogs', query: {id: gameid}})
                        setTimeout(() => {
                          // display success message after route change completes
                          this.$store.dispatch('alert/success', 'Game Log deleted and Summary Statistics regenerated.', { root: true })
                        })
                      })
                      .catch((error) => {
                        // Error
                        this.$store.dispatch('alert/error', error, { root: true })
                      })
                  })
                  .catch((error) => {
                    // Error
                    handleError(error, this.$store, this.$router)
                  })
              })
              .catch((error) => {
                // Error
                handleError(error, this.$store, this.$router)
              })
          }
        })
        .catch(err => {
          this.$store.dispatch('alert/error', err, { root: true })
        })
    }
  }
}

</script>

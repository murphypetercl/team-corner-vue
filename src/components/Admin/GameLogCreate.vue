<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-9">
                    <h2 class="title">Create Game Log Entry</h2>
                    <ValidationObserver v-slot="{ invalid }">
                      <form @submit.prevent="createGameLog">

                            <div class="form-group">
                                <label for="team">Team</label>
                                <ValidationProvider rules="required" v-slot="{ errors }">
                                    <input type="text" v-model="gameLog.team" name="team" class="form-control" :class="{ 'is-invalid': submitted && errors.has('team') }"/>
                                    <span>{{ errors[0] }}</span>
                                </ValidationProvider>
                                <div v-if="submitted && errors.has('team')" class="invalid-feedback">{{ errors.first('team') }}</div>
                            </div>
                            <div class="form-group">
                                <label for="playerNumber">Player Number</label>
                                <ValidationProvider rules="required" v-slot="{ errors }">
                                <input type="text" v-model="gameLog.playerNumber" name="playerNumber" class="form-control" :class="{ 'is-invalid': submitted && errors.has('playerNumber') }"/>
                                <span>{{ errors[0] }}</span>
                                </ValidationProvider>
                                <div v-if="submitted && errors.has('playerNumber')" class="invalid-feedback">{{ errors.first('playerNumber') }}</div>
                            </div>
                            <div class="form-group">
                                <label for="playerName">Player Name</label>
                                <ValidationProvider rules="required" v-slot="{ errors }">
                                <input type="text" v-model="gameLog.playerName" name="playerName" class="form-control" :class="{ 'is-invalid': submitted && errors.has('playerName') }"/>
                                <span>{{ errors[0] }}</span>
                                </ValidationProvider>
                                <div v-if="submitted && errors.has('playerName')" class="invalid-feedback">{{ errors.first('playerName') }}</div>
                            </div>
                            <div class="form-group">
                                <label for="stat">Statistic</label>
                                <ValidationProvider rules="required" v-slot="{ errors }">
                                <input type="text" v-model="gameLog.stat" name="stat" class="form-control" :class="{ 'is-invalid': submitted && errors.has('statistic') }"/>
                                <span>{{ errors[0] }}</span>
                                </ValidationProvider>
                                <div v-if="submitted && errors.has('stat')" class="invalid-feedback">{{ errors.first('stat') }}</div>
                            </div>
                            <div class="form-group">
                                <label for="gameTimeMin">Game Time (Minute)</label>
                                <ValidationProvider rules="required" v-slot="{ errors }">
                                <input type="text" v-model="gameLog.gameTimeMin" name="gameTimeMin" class="form-control" :class="{ 'is-invalid': submitted && errors.has('gameTimeMin') }"/>
                                <span>{{ errors[0] }}</span>
                                </ValidationProvider>
                                <div v-if="submitted && errors.has('gameTimeMin')" class="invalid-feedback">{{ errors.first('gameTimeMin') }}</div>
                            </div>
                            <div class="form-group">
                                <label for="gameTimeSec">Game Time (Second)</label>
                                <ValidationProvider rules="required" v-slot="{ errors }">
                                <input type="text" v-model="gameLog.gameTimeSec" name="gameTimeSec" class="form-control" :class="{ 'is-invalid': submitted && errors.has('gameTimeSec') }"/>
                                <span>{{ errors[0] }}</span>
                                </ValidationProvider>
                                <div v-if="submitted && errors.has('gameTimeSec')" class="invalid-feedback">{{ errors.first('gameTimeSec') }}</div>
                            </div>
                            <div class="form-group">
                                <label for="half">Half</label>
                                <ValidationProvider rules="required" v-slot="{ errors }">
                                <input type="text" v-model="gameLog.half" name="half" class="form-control" :class="{ 'is-invalid': submitted && errors.has('half') }"/>
                                <span>{{ errors[0] }}</span>
                                </ValidationProvider>
                                <div v-if="submitted && errors.has('half')" class="invalid-feedback">{{ errors.first('half') }}</div>
                            </div>
                            <div class="form-group">
                              <button class="btn btn-primary" :disabled="invalid">Continue</button>
                              <img v-show="status.creating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                          <!--    <router-link :to="{name: 'GameLogs', query: { id: this.id }}" class="btn btn-link">Cancel</router-link> -->
                            </div>

                        </form>
                    </ValidationObserver>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { GAME_UPDATE, GAMESTATS_UPDATE } from '@/graphql'
import { gameStatSummary } from '@/gameStats'
import { handleError } from '@/errorHandler'

export default {
  name: 'GameLogCreate',
  props: ['id'],
  data () {
    return {
      gameLog: {},
      status: {},
      submitted: false
    }
  },
  methods: {
    createGameLog () {
      const { gameLog } = this
      gameLog.gameId = this.id
      gameLog.formattedTime = ''
      const myApollo = this.$apollo
      const gameid = this.id

      const gameLogs = {gameLogs: {create: gameLog}}

      this.$apollo
        .mutate({
          mutation: GAME_UPDATE,
          variables: {
            id: this.id,
            data: gameLogs
          }
        })
        .then(response => {
          // then get the summary stats and update
          const gameStats = gameStatSummary(gameid, response.data.updateGame.gameLogs)

          myApollo
            .mutate({
              mutation: GAMESTATS_UPDATE,
              variables: {
                id: response.data.updateGame.gameStatSummary.id,
                data: gameStats
              }
            })
            .then(response => {
              this.$router.replace({name: 'GameLogs', query: {id: response.data.updateGameStatSummary.gameId}})
              setTimeout(() => {
                // display success message after route change completes
                this.$store.dispatch('alert/success', 'Game Log created.', { root: true })
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
  }
}
</script>

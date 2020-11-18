<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-9">
                    <h2 class="title">Create Game</h2>
                    <ValidationObserver v-slot="{ invalid }">
                      <b-form @submit.prevent="createGame">
                          <hr/>
                          <h3 class="title">Overview</h3>
                          <div class="form-group">
                              <label for="competition">Competition</label>
                              <ValidationProvider rules="required" v-slot="{ errors }">
                                <b-form-input type="text" v-model="game.competition" name="competition" class="form-control" :class="{ 'is-invalid': submitted && errors.has('competition') }" />
                                <span>{{ errors[0] }}</span>
                              </ValidationProvider>
                              <div v-if="submitted && errors.has('competition')" class="invalid-feedback">{{ errors.first('competition') }}</div>
                          </div>
                          <div class="form-group">
                              <label for="opposition">Opposition</label>
                              <ValidationProvider rules="required" v-slot="{ errors }">
                                <b-form-input type="text" v-model="game.opposition" name="opposition" class="form-control" :class="{ 'is-invalid': submitted && errors.has('opposition') }" />
                                <span>{{ errors[0] }}</span>
                              </ValidationProvider>
                              <div v-if="submitted && errors.has('opposition')" class="invalid-feedback">{{ errors.first('opposition') }}</div>
                          </div>
                          <div class="form-group">
                              <label for="venue">Venue</label>
                              <ValidationProvider rules="required" v-slot="{ errors }">
                                <b-form-input type="text" v-model="game.venue" name="venue" class="form-control" :class="{ 'is-invalid': submitted && errors.has('venue') }" />
                                <span>{{ errors[0] }}</span>
                              </ValidationProvider>
                              <div v-if="submitted && errors.has('venue')" class="invalid-feedback">{{ errors.first('venue') }}</div>
                          </div>
                          <div class="form-group">
                              <label for="date">Date</label>
                              <ValidationProvider rules="required" v-slot="{ errors }">
                                <b-form-datepicker type="date" v-model="game.date" name="date" class="form-control" :class="{ 'is-invalid': submitted && errors.has('date') }" />
                                <span>{{ errors[0] }}</span>
                              </ValidationProvider>
                              <div v-if="submitted && errors.has('date')" class="invalid-feedback">{{ errors.first('date') }}</div>
                          </div>
                          <hr/>
                          <div class="form-group">
                              <button class="btn btn-primary" :disabled="invalid">Continue</button>
                              <img v-show="status.creating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                              <router-link to="/admin/games" class="btn btn-link">Cancel</router-link>
                          </div>
                      </b-form>
                    </ValidationObserver>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { CREATE_GAME_MUTATION, ALL_GAMES_QUERY, ALL_PLAYERS_QUERY } from '@/graphql'
import { handleError } from '@/errorHandler'

export default {
  name: 'CreateGame',
  data () {
    return {
      game: {},
      status: {},
      submitted: false,
      allPlayers: []
    }
  },
  apollo: {
    allPlayers: {
      query: ALL_PLAYERS_QUERY
    }
  },
  computed: {
    playerOptions: function () {
      const options = []
      var player = {}
      for (player in this.allPlayers) {
        options.push({value: this.allPlayers[player].id, text: this.allPlayers[player].firstName.concat(' ').concat(this.allPlayers[player].lastName)})
      }
      return options
    },
    playerFields: function () {
      const fields = []
      var i = 0
      var label = ''
      var name = ''
      for (i = 1; i <= 35; i++) {
        label = i.toString().concat('.')
        name = 'player'.concat(i)
        fields.push({ label: label, name: name })
      }
      return fields
    }
  },
  methods: {
    createGame () {
      const { game } = this
      var i = 0
      var id = ''
      const lineup = []

      for (i = 1; i < 35; i++) {
        id = this.playerFields[i - 1].name
        if (id && id !== '' && id.search('player') === -1) {
          lineup.push({
            number: i,
            player: {connect: {id: id}}
          })
        }
      }

      this.$apollo
        .mutate({
          mutation: CREATE_GAME_MUTATION,
          variables: {
            data: game
          },
          update: (store, { data: { createGame } }) => {
            // read data from cache for this query
            const data = store.readQuery({ query: ALL_GAMES_QUERY })

            data.allGames.push(createGame)

            // write data back to the cache
            store.writeQuery({ query: ALL_GAMES_QUERY, data })
          },
          error (error) {
            handleError(error, this.$store, this.$router)
          }
        })
        .then(response => {
          // this.$router.replace('/admin/games')
          this.$router.replace({name: 'GameLogUpload', query: {id: response.data.createGame.id}})

          setTimeout(() => {
            // display success message after route change completes
            this.$store.dispatch('alert/success', 'Game created.', { root: true })
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

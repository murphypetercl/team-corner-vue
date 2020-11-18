<template>
    <div>
        <p></p>
        <h2>Create Event</h2>
        <p></p>
        <b-container fluid>
            <ValidationObserver v-slot="{ invalid }">
                <b-form @submit.prevent="createEvent">
                    <hr/>
                    <div class="form-group">
                        <label for="date">Date</label>
                        <ValidationProvider rules="required" v-slot="{ errors }">
                        <b-form-datepicker type="date" v-model="calEvent.date" name="date" class="form-control" :class="{ 'is-invalid': submitted && errors.has('date') }" />
                        <span>{{ errors[0] }}</span>
                        </ValidationProvider>
                        <div v-if="submitted && errors.has('date')" class="invalid-feedback">{{ errors.first('date') }}</div>
                    </div>
                    <div class="form-group">
                        <label for="time">Time</label>
                        <ValidationProvider rules="required" v-slot="{ errors }">
                        <b-form-timepicker v-model="calEvent.time" name="time" class="form-control" :class="{ 'is-invalid': submitted && errors.has('time') }" />
                        <span>{{ errors[0] }}</span>
                        </ValidationProvider>
                        <div v-if="submitted && errors.has('time')" class="invalid-feedback">{{ errors.first('time') }}</div>
                    </div>
                    <div class="form-group">
                        <label for="eventType">Event Type</label>
                        <ValidationProvider rules="required" v-slot="{ errors }">
                        <b-form-select v-model="calEvent.eventType" :options="eventOptions" class="form-control" :class="{ 'is-invalid': submitted && errors.has('eventType') }"></b-form-select>
                        <span>{{ errors[0] }}</span>
                        </ValidationProvider>
                        <div v-if="submitted && errors.has('eventType')" class="invalid-feedback">{{ errors.first('eventType') }}</div>
                    </div>
                    <div class="form-group">
                        <label for="location">Location</label>
                        <ValidationProvider rules="required" v-slot="{ errors }">
                        <b-form-input type="text" v-model="calEvent.location" name="location" class="form-control" :class="{ 'is-invalid': submitted && errors.has('location') }" />
                        <span>{{ errors[0] }}</span>
                        </ValidationProvider>
                        <div v-if="submitted && errors.has('location')" class="invalid-feedback">{{ errors.first('location') }}</div>
                    </div>
                    <div class="form-group">
                        <label for="notes">Notes</label>
                        <b-form-input type="text" v-model="calEvent.notes" name="notes" class="form-control" :class="{ 'is-invalid': submitted && errors.has('notes') }" />
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary" :disabled="invalid">Continue</button>
                        <img v-show="status.creating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        <router-link to="/admin/schedule" class="btn btn-link">Cancel</router-link>
                    </div>
                </b-form>
            </ValidationObserver>
        </b-container>
    </div>
</template>
<script>
import { CREATE_EVENT_MUTATION, ALL_EVENTS_QUERY, AUTHENTICATED_USER_QUERY } from '@/graphql'
import { handleError } from '@/errorHandler'
import moment from 'moment'

export default {
  name: 'Schedule',
  data () {
    return {
      calEvent: {},
      status: {},
      submitted: false,
      eventOptions: [
        { value: null, text: 'Please select an Event Type' },
        { value: 'Match', text: 'Match' },
        { value: 'Training', text: 'Training' },
        { value: 'Other', text: 'Other' }
      ]
    }
  },
  computed: {
  },
  methods: {
    createEvent () {
      const { calEvent } = this

      const formattedEvent = {
        dateTime: moment(String(calEvent.date).concat(' ').concat(calEvent.time)).format(),
        eventType: calEvent.eventType,
        location: calEvent.location,
        notes: calEvent.notes
      }

      this.$apollo
        .mutate({
          mutation: CREATE_EVENT_MUTATION,
          variables: {
            data: formattedEvent
          },
          update: (store, { data: { createEvent } }) => {
            // read data from cache for this query
            const data = store.readQuery({ query: ALL_EVENTS_QUERY })

            data.allEvents.push(createEvent)

            // write data back to the cache
            store.writeQuery({ query: ALL_EVENTS_QUERY, data })
          },
          error (error) {
            handleError(error, this.$store, this.$router)
          }
        })
        .then(response => {
          this.$router.replace({name: 'Schedule'})
          setTimeout(() => {
            // display success message after route change completes
            this.$store.dispatch('alert/success', 'Event created.', { root: true })
          })
        })
        .catch((error) => {
          // Error
          handleError(error, this.$store, this.$router)
        })
    }
  },
  apollo: {
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

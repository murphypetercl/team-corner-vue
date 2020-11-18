<template>
    <div>
      <p></p>
      <h2>Schedule</h2>
      <p></p>

      <b-table :items="allEventsSorted" :fields="schedulefields" :tbody-tr-class="rowClass">
        <template v-slot:cell(edit)="row">
          <router-link v-show="authenticatedUser.isAdmin==true" :to="{path: '/admin/event', query: {eventid: row.item.id}}">
              <b-button size="sm">
              Edit
              </b-button>
          </router-link>
        </template>
        <template v-slot:cell(delete)="row">
          <b-button v-show="authenticatedUser.isAdmin==true" variant="danger" size="sm" @click="deleteEvent(row.item)">
            <b-icon icon="trash"></b-icon>
          </b-button>
        </template>
      </b-table>
      <b-button-group>
        <router-link v-show="authenticatedUser.isAdmin" to="/admin/event/create">
          <b-button variant=primary>Create Event</b-button>
        </router-link>
      </b-button-group>
    </div>
</template>

<script>
import { ALL_EVENTS_QUERY, EVENT_DELETE, AUTHENTICATED_USER_QUERY } from '@/graphql'
import { handleError } from '@/errorHandler'
import { sort } from '@/dataHelper'
import moment from 'moment'

export default {
  name: 'Schedule',
  data () {
    return {
      allEvents: [],
      schedulefields: [
        { key: 'dateTime', label: 'Date & Time' },
        { key: 'eventType', label: 'Event' },
        { key: 'location', label: 'Location' },
        { key: 'notes', label: 'Notes' },
        { key: 'edit', label: '' },
        { key: 'delete', label: '' }],
      authenticatedUser: {}
    }
  },
  computed: {
    team: function () {
      return process.env.VUE_APP_TEAM
    },
    allEventsSorted: function () {
      sort(this.allEvents, 'dateTime', 'asc')
      const events = []
      var evt = {}
      var dateTime = ''
      for (evt in this.allEvents) {
        dateTime = moment(String(this.allEvents[evt].dateTime)).format('dddd MMMM Do YYYY h:mm a')
        events.push({
          id: this.allEvents[evt].id,
          dateTime: dateTime,
          eventType: this.allEvents[evt].eventType,
          location: this.allEvents[evt].location,
          notes: this.allEvents[evt].notes
        })
      }
      return events
    }
  },
  methods: {
    rowClass (item, type) {
      if (!item || type !== 'row') return
      if (item.eventType === 'Match') return 'table-success'
    },
    deleteEvent (e) {
      const eventid = e.id
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete this event?')
        .then(value => {
          if (value) {
            this.$apollo
              .mutate({
                mutation: EVENT_DELETE,
                variables: {
                  id: e.id
                },
                update: (store, { data: { deleteEvent } }) => {
                  // read data from cache for this query
                  const data = store.readQuery({ query: ALL_EVENTS_QUERY })

                  const eventToDelete = data.allEvents.find(g => g.id === eventid)

                  const idx = data.allEvents.indexOf(eventToDelete)

                  if (idx >= 0) {
                    data.allEvents.splice(idx, 1)
                    store.writeQuery({ query: ALL_EVENTS_QUERY, data })
                  }
                },
                error (error) {
                  handleError(error, this.$store, this.$router)
                }
              })
          }
        }
        )
    }
  },
  apollo: {
    allEvents: {
      query: ALL_EVENTS_QUERY,
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

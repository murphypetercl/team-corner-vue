<template>
  <div>
    <br>
    <h2>Game Logs</h2>
    <b-dropdown v-show="authenticatedUser.isAdmin==true" size="sm" id="dropdown-1" text="Actions" class="m-md-2">
        <b-dropdown-item :to="{name: 'GameLogCreate', query: {id: this.id}}">Create Log Entry</b-dropdown-item>
        <b-dropdown-item :to="{name: 'GameLogUpload', query: {id: this.id}}">Upload Game Logs</b-dropdown-item>
        <b-dropdown-item :to="{name: 'GamePuckoutsUpload', query: {id: this.id}}">Upload Game Puckouts</b-dropdown-item>
        <b-dropdown-item :to="{name: 'GameShotDetailsUpload', query: {id: this.id}}">Upload Game Shots</b-dropdown-item>
    </b-dropdown>
    <p></p>

    <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
        <b-col lg="6" class="my-1">
        <b-form-group
            label="Sort"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            label-for="sortBySelect"
            class="mb-0"
        >
            <b-input-group size="sm">
            <b-form-select v-model="sortBy" id="sortBySelect" :options="sortOptions" class="w-75">
                <template v-slot:first>
                <option value="">-- none --</option>
                </template>
            </b-form-select>
            <b-form-select v-model="sortDesc" size="sm" :disabled="!sortBy" class="w-25">
                <option :value="false">Asc</option>
                <option :value="true">Desc</option>
            </b-form-select>
            </b-input-group>
        </b-form-group>
        </b-col>

        <b-col lg="6" class="my-1">
        <b-form-group
            label="Filter"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            label-for="filterInput"
            class="mb-0"
        >
            <b-input-group size="sm">
            <b-form-input
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Type to Search"
            ></b-form-input>
            <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
            </b-input-group>
        </b-form-group>
        </b-col>

        <b-col sm="5" md="6" class="my-1">
        <b-form-group
            label="Per page"
            label-cols-sm="6"
            label-cols-md="4"
            label-cols-lg="3"
            label-align-sm="right"
            label-size="sm"
            label-for="perPageSelect"
            class="mb-0"
        >
            <b-form-select
            v-model="perPage"
            id="perPageSelect"
            size="sm"
            :options="pageOptions"
            ></b-form-select>
        </b-form-group>
        </b-col>

        <b-col sm="7" md="6" class="my-1">
        <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
        ></b-pagination>
        </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
        show-empty
        small
        stacked="md"
        striped
        :items="Game.gameLogs"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filterIncludedFields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        @filtered="onFiltered"
    >
        <template v-slot:cell(actions)="row">
        <router-link v-show="authenticatedUser.isAdmin==true" :to="{path: '/admin/game/log', query: {id: id, logid: row.item.id}}">
            <b-button size="sm">
            Edit
            </b-button>
        </router-link>
        </template>
        <template v-slot:row-details="row">
        <b-card>
            <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
            </ul>
        </b-card>
        </template>
    </b-table>

    <b-row>
        <b-col sm="7" md="6" class="my-1">
        <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
        ></b-pagination>
        </b-col>
    </b-row>
    </b-container>
  </div>
</template>

<script>
import { GAME_QUERY, AUTHENTICATED_USER_QUERY } from '@/graphql'
import { handleError } from '@/errorHandler'

export default {
  name: 'Game',
  props: ['id'],
  data () {
    return {
      Game: {
        gameStatSummary: {},
        gameLogs: []
      },
      edit: false,
      createMode: this.create,
      status: {},
      csv: null,
      authenticatedUser: {isAdmin: false},
      fields: [
        { key: 'half', label: 'Half', sortable: true, sortDirection: 'asc' },
        { key: 'formattedTime', label: 'Time', sortable: true },
        { key: 'team', label: 'Team', sortable: true },
        { key: 'stat', label: 'Stat', sortable: true },
        { key: 'playerName', label: 'Player', sortable: true },
        { key: 'actions', label: '', class: 'text-right' }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 20,
      pageOptions: [20, 50, 200],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
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
  computed: {
    // a computed getter
    uploadButtonEnabled: function () {
      // `this` points to the vm instance
      return this.csv == null
    },
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  mounted () {
    // Set the initial number of items
    this.totalRows = this.Game.gameLogs.length
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}

</script>

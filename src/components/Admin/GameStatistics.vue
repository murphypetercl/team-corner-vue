<template>
    <div>
      <br>
      <div v-if="Game.gameStatSummary!=null">
        <h2>Game Statistics</h2>

        <h3>Score</h3>
        <strong v-show="showStats">{{team}} {{ Game.gameStatSummary.goalsForSelf }}-{{ Game.gameStatSummary.pointsForSelf }}  {{ Game.opposition }} {{ Game.gameStatSummary.goalsForOpposition }}-{{ Game.gameStatSummary.pointsForOpposition }}</strong>
        <hr>

        <h3>Shooting</h3>
        <b-table stacked :items="gameStatTables.shooting"></b-table>

        <h3>{{team}} Puckouts</h3>
        <b-table stacked :items="gameStatTables.selfPuckouts"></b-table>

        <h3>{{ Game.opposition }} Puckouts</h3>
        <b-table stacked :items="gameStatTables.oppositionPuckouts"></b-table>

        <h3>Hooks/Blocks, Interceptions, Loose Ball</h3>
        <b-table stacked :items="gameStatTables.workrate"></b-table>

        <h3>Turnovers</h3>
        <b-table stacked :items="gameStatTables.turnovers"></b-table>

        <h3>Discipline</h3>
        <b-table stacked :items="gameStatTables.discipline"></b-table>
      </div>
    </div>
</template>

<script>
import { GAME_QUERY, AUTHENTICATED_USER_QUERY } from '@/graphql'
import { handleError } from '@/errorHandler'

export default {
  name: 'Game',
  props: ['id', 'create', 'tab'],
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
    team: function () {
      return process.env.VUE_APP_TEAM
    },
    showStats: function () {
      return true
    },
    gameStatTables: function () {
      const gameStats = this.Game.gameStatSummary
      const workrate = []
      const selfPuckouts = []
      const oppositionPuckouts = []
      const shooting = []
      const discipline = []
      const turnovers = []

      workrate.push({
        'hooksAndBlocks': gameStats.hookBlock,
        'interceptions': gameStats.interception,
        'looseBalls': gameStats.looseBall
      })

      turnovers.push({
        'won': gameStats.turnoverWon,
        'lost': gameStats.turnoverLost
      })

      selfPuckouts.push({
        'wonInFirstHalf': gameStats.homePuckoutWonH1,
        'lostInFirstHalf': gameStats.homePuckoutLostH1,
        'FirstHalfSuccessRate': Math.round((gameStats.homePuckoutWonH1 / (gameStats.homePuckoutWonH1 + gameStats.homePuckoutLostH1)) * 100).toString().concat(' %'),
        'wonInSecondHalf': gameStats.homePuckoutWonH2,
        'lostInSecondHalf': gameStats.homePuckoutLostH2,
        'SecondHalfSuccessRate': Math.round((gameStats.homePuckoutWonH2 / (gameStats.homePuckoutWonH2 + gameStats.homePuckoutLostH2)) * 100).toString().concat(' %')
      })

      oppositionPuckouts.push({
        'wonInFirstHalf': gameStats.oppositionPuckoutWonH1,
        'lostInFirstHalf': gameStats.oppositionPuckoutLostH1,
        'FirstHalfSuccessRate': Math.round((gameStats.oppositionPuckoutWonH1 / (gameStats.oppositionPuckoutWonH1 + gameStats.oppositionPuckoutLostH1)) * 100).toString().concat(' %'),
        'wonInSecondHalf': gameStats.oppositionPuckoutWonH2,
        'lostInSecondHalf': gameStats.oppositionPuckoutLostH2,
        'SecondHalfSuccessRate': Math.round((gameStats.oppositionPuckoutWonH2 / (gameStats.oppositionPuckoutWonH2 + gameStats.oppositionPuckoutLostH2)) * 100).toString().concat(' %')
      })

      shooting.push({
        'scoresFromPlayInFirstHalf': gameStats.scoresFromPlayH1,
        'shotsFromPlayInFirstHalf': gameStats.shotsFromPlayH1,
        'FirstHalfSuccessRate': Math.round((gameStats.scoresFromPlayH1 / gameStats.shotsFromPlayH1) * 100).toString().concat(' %'),
        'scoresFromPlayInSecondHalf': gameStats.scoresFromPlayH2,
        'shotsFromPlayInSecondHalf': gameStats.shotsFromPlayH2,
        'SecondHalfSuccessRate': Math.round((gameStats.scoresFromPlayH2 / gameStats.shotsFromPlayH2) * 100).toString().concat(' %'),
        'scoresFromFrees': gameStats.scoresFromFrees,
        'shotsFromFrees': gameStats.shotsFromFrees,
        'FreesSuccessRate': Math.round((gameStats.scoresFromFrees / gameStats.shotsFromFrees) * 100).toString().concat(' %'),
        'scoresFrom65s': gameStats.scoresFrom65s,
        'shotsFrom65s': gameStats.shotsFrom65s,
        '65sSuccessRate': Math.round((gameStats.scoresFromFrees / gameStats.shotsFromFrees) * 100).toString().concat(' %')
      })

      discipline.push({
        'freesWon': gameStats.freesWon,
        'freesConceded': gameStats.freesConceded,
        'yellowCards': gameStats.yellowCards,
        'redCards': gameStats.redCards
      })

      return {workrate: workrate, turnovers: turnovers, selfPuckouts: selfPuckouts, oppositionPuckouts: oppositionPuckouts, shooting: shooting, discipline: discipline}
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
    getHalf (val) {
      if (val === '1') { return 'First' } else { return 'Second' }
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}

</script>

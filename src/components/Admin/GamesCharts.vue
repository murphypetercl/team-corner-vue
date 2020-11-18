<template>
  <b-container v-if="loaded" fluid>
    <br>
    <div v-for="chart in statsToChart" :key="chart.name">
      <b-row>
        <b-col>
          <hr/>
          <h3>{{ chart.name }}</h3>
          <line-chart
            :styles="myStyles"
            :chartdata="chart.chartData"
            :options="chart.options"/>
        </b-col>
      </b-row>
    </div>

  </b-container>
</template>

<script>
import { ALL_GAMES_QUERY } from '@/graphql'
import { handleError } from '@/errorHandler'
import { getPuckoutPercentage, getShotPercentage } from '@/chartCalcs'
import { sortGames } from '@/dataHelper'
import LineChart from '@/components/Admin/Chart.vue'

export default {
  name: 'GamesCharts',
  components: { LineChart },
  data () {
    return {
      allGames: [],
      numGames: 8,
      gameOptions: [5, 10, 20],
      statsToChart: [
        {
          name: 'Success rate on our Puckouts',
          dataArrays: ['puckoutSuccessRateH1', 'puckoutSuccessRateH2'],
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  suggestedMax: 100
                }
              }]
            },
            responsive: true,
            maintainAspectRatio: false
          },
          chartData: {
            labels: null,
            datasets: [
              {
                label: 'Puckouts - First Half',
                data: [],
                borderColor: '#249EBF', // green
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#249EBF', // green
                backgroundColor: 'transparent'
              },
              {
                label: 'Puckouts - Second Half',
                data: [],
                borderColor: '#ff4d4d', // red
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#ff4d4d', // red
                backgroundColor: 'transparent'
              }
            ]
          }
        },
        {
          name: 'Success rate on Opposition Puckouts',
          dataArrays: ['oppPuckoutSuccessRateH1', 'oppPuckoutSuccessRateH2'],
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  suggestedMax: 100
                }
              }]
            },
            responsive: true,
            maintainAspectRatio: false
          },
          chartData: {
            labels: null,
            datasets: [
              {
                label: 'Opposition Puckouts - First Half',
                data: [],
                borderColor: '#249EBF', // green
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#249EBF', // green
                backgroundColor: 'transparent'
              },
              {
                label: 'Opposition Puckouts - Second Half',
                data: [],
                borderColor: '#ff4d4d', // red
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#ff4d4d', // red
                backgroundColor: 'transparent'
              }
            ]
          }
        },
        {
          name: 'Scores from Play Success Rate',
          dataArrays: ['scoreSuccessRateH1', 'scoreSuccessRateH2', 'scoreSuccessRateOverall'],
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  suggestedMax: 100
                }
              }]
            },
            responsive: true,
            maintainAspectRatio: false
          },
          chartData: {
            labels: null,
            datasets: [
              {
                label: 'First Half',
                data: [],
                borderColor: '#249EBF', // green
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#249EBF', // green
                backgroundColor: 'transparent'
              },
              {
                label: 'Second Half',
                data: [],
                borderColor: '#ff4d4d', // red
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#ff4d4d', // red
                backgroundColor: 'transparent'
              },
              {
                label: 'Overall',
                data: [],
                borderColor: '#0066ff', // blue
                pointBackgroundColor: 'white',
                borderWidth: 2,
                pointBorderColor: '#0066ff', // blue
                backgroundColor: 'transparent'
              }
            ]
          }
        },
        {
          name: 'Hooks & Blocks',
          dataArrays: ['hookBlocks'],
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  suggestedMax: 15
                }
              }]
            },
            responsive: true,
            maintainAspectRatio: false
          },
          chartData: {
            labels: null,
            datasets: [
              {
                label: 'Hooks & Blocks',
                data: [],
                borderColor: '#249EBF', // green
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#249EBF', // green
                backgroundColor: 'transparent'
              }
            ]
          }
        },
        {
          name: 'Interceptions & Loose Balls',
          dataArrays: ['interceptions', 'looseBalls'],
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  suggestedMax: 15
                }
              }]
            },
            responsive: true,
            maintainAspectRatio: false
          },
          chartData: {
            labels: null,
            datasets: [
              {
                label: 'Interceptions',
                data: [],
                borderColor: '#ff4d4d', // red
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#ff4d4d', // red
                backgroundColor: 'transparent'
              },
              {
                label: 'Loose Balls Won',
                data: [],
                borderColor: '#cc00cc', // purple
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#cc00cc', // purple
                backgroundColor: 'transparent'
              }
            ]
          }
        },
        {
          name: 'Turnovers',
          dataArrays: ['turnoversWon', 'turnoversLost'],
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  suggestedMax: 15
                }
              }]
            },
            responsive: true,
            maintainAspectRatio: false
          },
          chartData: {
            labels: null,
            datasets: [
              {
                label: 'Turnovers Won',
                data: [],
                borderColor: '#249EBF', // green
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#249EBF', // green
                backgroundColor: 'transparent'
              },
              {
                label: 'Turnovers Lost',
                data: [],
                borderColor: '#ff4d4d', // red
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#ff4d4d', // red
                backgroundColor: 'transparent'
              }
            ]
          }
        },
        {
          name: 'Discipline',
          dataArrays: ['freesConceded', 'yellowCards', 'redCards'],
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  suggestedMax: 15
                }
              }]
            },
            responsive: true,
            maintainAspectRatio: false
          },
          chartData: {
            labels: null,
            datasets: [
              {
                label: 'Frees Conceded',
                data: [],
                borderColor: '#249EBF', // green
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#249EBF', // green
                backgroundColor: 'transparent'
              },
              {
                label: 'Yellow Cards',
                data: [],
                borderColor: '#ffcc00', // yellow
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#ffcc00', // yellow
                backgroundColor: 'transparent'
              },
              {
                label: 'Red Cards',
                data: [],
                borderColor: '#ff4d4d', // red
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#ff4d4d', // red
                backgroundColor: 'transparent'
              }
            ]
          }
        }
      ],
      loaded: false,
      // width: 800,
      height: 300
    }
  },
  apollo: {
    allGames: {
      query: ALL_GAMES_QUERY,
      error (error) {
        handleError(error, this.$store, this.$router)
      }
    }
  },
  computed: {
    myStyles () {
      return {
        // width: `${this.width}px`,
        height: `${this.height}px`,
        position: 'relative'
      }
    },
    computedChartData () {
      sortGames(this.allGames, 'date', 'asc')

      const gamesToDisplay = this.allGames.slice(Math.max(this.allGames.length - this.numGames, 1))

      var game = {}
      const chartDataValues =
        {
          puckoutSuccessRateH1: [],
          puckoutSuccessRateH2: [],
          oppPuckoutSuccessRateH1: [],
          oppPuckoutSuccessRateH2: [],
          hookBlocks: [],
          turnovers: [],
          turnoversWon: [],
          turnoversLost: [],
          interceptions: [],
          looseBalls: [],
          freesConceded: [],
          yellowCards: [],
          redCards: [],
          scoreSuccessRateH1: [],
          scoreSuccessRateH2: [],
          scoreSuccessRateOverall: []
        }

      for (game in gamesToDisplay) {
        chartDataValues.puckoutSuccessRateH1.push(getPuckoutPercentage(gamesToDisplay[game].gameStatSummary.homePuckoutWonH1, gamesToDisplay[game].gameStatSummary.homePuckoutLostH1))
        chartDataValues.puckoutSuccessRateH2.push(getPuckoutPercentage(gamesToDisplay[game].gameStatSummary.homePuckoutWonH2, gamesToDisplay[game].gameStatSummary.homePuckoutLostH2))
        chartDataValues.oppPuckoutSuccessRateH1.push(getPuckoutPercentage(gamesToDisplay[game].gameStatSummary.oppositionPuckoutWonH1, gamesToDisplay[game].gameStatSummary.oppositionPuckoutLostH1))
        chartDataValues.oppPuckoutSuccessRateH2.push(getPuckoutPercentage(gamesToDisplay[game].gameStatSummary.oppositionPuckoutWonH2, gamesToDisplay[game].gameStatSummary.oppositionPuckoutLostH2))
        chartDataValues.hookBlocks.push(gamesToDisplay[game].gameStatSummary.hookBlock)
        chartDataValues.turnovers.push(gamesToDisplay[game].gameStatSummary.turnover)
        chartDataValues.turnoversWon.push(gamesToDisplay[game].gameStatSummary.turnoverWon)
        chartDataValues.turnoversLost.push(gamesToDisplay[game].gameStatSummary.turnoverLost)
        chartDataValues.interceptions.push(gamesToDisplay[game].gameStatSummary.interception)
        chartDataValues.looseBalls.push(gamesToDisplay[game].gameStatSummary.looseBall)
        chartDataValues.freesConceded.push(gamesToDisplay[game].gameStatSummary.freesConceded)
        chartDataValues.yellowCards.push(gamesToDisplay[game].gameStatSummary.yellowCards)
        chartDataValues.redCards.push(gamesToDisplay[game].gameStatSummary.redCards)
        chartDataValues.scoreSuccessRateH1.push(getShotPercentage(gamesToDisplay[game].gameStatSummary.scoresFromPlayH1, gamesToDisplay[game].gameStatSummary.shotsFromPlayH1))
        chartDataValues.scoreSuccessRateH2.push(getShotPercentage(gamesToDisplay[game].gameStatSummary.scoresFromPlayH2, gamesToDisplay[game].gameStatSummary.shotsFromPlayH2))
        chartDataValues.scoreSuccessRateOverall.push(
          getShotPercentage(
            gamesToDisplay[game].gameStatSummary.scoresFromPlayH1 + gamesToDisplay[game].gameStatSummary.scoresFromPlayH2,
            gamesToDisplay[game].gameStatSummary.shotsFromPlayH1 + gamesToDisplay[game].gameStatSummary.shotsFromPlayH2
          )
        )
      }
      return chartDataValues
    }
  },
  mounted () {
    const labels = []
    var game = {}
    var stat = {}
    var dataset = {}

    sortGames(this.allGames, 'date', 'asc')
    const gamesToDisplay = this.allGames.slice(Math.max(this.allGames.length - this.numGames, 1))

    for (game in gamesToDisplay) {
      labels.push(gamesToDisplay[game].opposition)
    }
    for (stat in this.statsToChart) {
      for (dataset in this.statsToChart[stat].chartData.datasets) {
        this.statsToChart[stat].chartData.datasets[dataset].data = this.computedChartData[this.statsToChart[stat].dataArrays[dataset]]
      }
      this.statsToChart[stat].chartData.labels = labels
    }

    this.loaded = true
  }
}

</script>

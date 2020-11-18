<template>
    <div>
      <div v-for="puckoutView in puckoutViews" :key="puckoutView.name">
        <h2>{{ puckoutView.name }}</h2>
        <v-stage :config="configKonva">
            <v-layer>
                <v-circle v-b-tooltip.hover title="Tooltip directive content" :config="getPuckoutType('white',  10, 10).config"/>
                <v-text :config="getPuckoutTypeText('Clean Catch', 25, 5).config"/>
                <v-circle v-b-tooltip.hover title="Tooltip directive content" :config="getPuckoutType('darkgreen', 10, 30).config"/>
                <v-text :config="getPuckoutTypeText('Breaking Ball', 25, 25).config"/>
                <v-circle v-b-tooltip.hover title="Tooltip directive content" :config="getPuckoutType('red', 130, 10).config"/>
                <v-text :config="getPuckoutTypeText('Opposition Clean Catch', 145, 5).config"/>
                <v-circle v-b-tooltip.hover title="Tooltip directive content" :config="getPuckoutType('darkorange', 130, 30).config"/>
                <v-text :config="getPuckoutTypeText('Opposition Breaking Ball',  145, 25).config"/>
                <v-circle v-b-tooltip.hover title="Tooltip directive content" :config="getPuckoutType('blue', 300, 10).config"/>
                <v-text :config="getPuckoutTypeText('Direct out of play', 315, 5).config"/>
                <v-rect :config="configPitch"/>
                <v-rect :config="configBigSqL"/>
                <v-rect :config="configSmallSqL"/>
                <v-line :config="config13L"/>
                <v-line :config="config20L"/>
                <v-line :config="config45L"/>
                <v-line :config="config65L"/>
                <v-line :config="config65R"/>
                <v-line :config="config45R"/>
                <v-line :config="config20R"/>
                <v-line :config="config13R"/>
                <v-rect :config="configBigSqR"/>
                <v-rect :config="configSmallSqR"/>
                <div v-for="puckout in puckoutView.puckoutConfig" :key="puckout.key">
                  <v-circle v-b-tooltip.hover title="Tooltip directive content" :config="puckout.config"/>
                </div>
            </v-layer>
        </v-stage>
        <hr>
      </div>
    </div>
</template>

<script>
import { GAME_QUERY, AUTHENTICATED_USER_QUERY } from '@/graphql'
import { handleError } from '@/errorHandler'
import { getPuckoutConfigs } from '@/gamePuckouts'
import { getConfigSmallSqL, getConfigBigSqL, getConfig13L, getConfig20L, getConfig45L, getConfig65L, getConfig65R, getConfig45R, getConfig20R, getConfig13R, getConfigSmallSqR, getConfigBigSqR } from '@/pitchLayout'

const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

export default {
  name: 'GamePuckouts',
  props: ['id'],
  data () {
    return {
      Game: {},
      authenticatedUser: {},
      scale: 1,
      configKonva: {
        width: Math.min(windowWidth, 1100),
        height: Math.min(windowHeight, 600)
      },
      officialPitchWidth: 90,
      officialPitchLength: 140,
      configPitch: {
        x: 0,
        y: 0,
        width: Math.min(windowWidth, 1000),
        height: Math.min(windowHeight, 500),
        fill: 'green',
        stroke: 'white',
        strokeWidth: 2
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
  created: function () {
    window.addEventListener('resize', this.changeRect)
    this.changeRect()
  },
  methods: {
    changeRect: function () {
      const width = window.innerWidth

      if (width < 1100) {
        this.scale = width / 1100
      }

      this.configKonva.width = 1100 * this.scale
      this.configKonva.height = 600 * this.scale
      this.configPitch.width = 1000 * this.scale
      this.configPitch.height = 500 * this.scale
    },
    getPuckouts () {
      const jsonAggregate = require('json-aggregate')
      var gameLogsJson = JSON.stringify(this.Game.gameLogs)
      const collection = jsonAggregate.create(gameLogsJson)
      const puckouts = jsonAggregate.create(JSON.stringify(collection.match(item => item.stat.indexOf('Puckout') >= 0).exec()))
      return puckouts
    },
    getPuckoutType: function (fillColour, x, y) {
      var shotType = {}
      shotType.config = {
        x: x,
        y: this.configPitch.height + y,
        radius: 8 * this.scale,
        fill: fillColour,
        stroke: 'black',
        strokeWidth: 2 * this.scale
      }
      return shotType
    },
    getPuckoutTypeText: function (text, x, y) {
      var shotType = {}
      shotType.config = {
        x: x,
        y: this.configPitch.height + y,
        text: text,
        stroke: 'black',
        strokeWidth: 1 * this.scale
      }
      return shotType
    }
  },
  computed: {
    puckoutViews () {
      return [
        {
          id: 'selfPuckoutH1',
          name: 'Our Puckouts - First Half',
          puckoutConfig: this.puckoutsSelfFirstHalf
        },
        {
          id: 'selfPuckoutH2',
          name: 'Our Puckouts - Second Half',
          puckoutConfig: this.puckoutsSelfSecondHalf
        },
        {
          id: 'oppPuckoutH1',
          name: 'Opposition Puckouts - First Half',
          puckoutConfig: this.puckoutsOppositionFirstHalf
        },
        {
          id: 'oppPuckoutH2',
          name: 'Opposition Puckouts - Second Half',
          puckoutConfig: this.puckoutsOppositionSecondHalf
        }
      ]
    },
    puckoutsSelfFirstHalf: function () {
      const jsonAggregate = require('json-aggregate')
      const puckouts = this.getPuckouts()
      const teamSelfName = process.env.VUE_APP_TEAM

      const puckoutsSelfFirstHalf = jsonAggregate.create(JSON.stringify(puckouts.match(item => item.stat.indexOf(teamSelfName.concat(' Puckout')) >= 0).match({half: '1'}).exec())).data

      return getPuckoutConfigs(puckoutsSelfFirstHalf, this.configPitch, this.scale)
    },
    puckoutsSelfSecondHalf: function () {
      const jsonAggregate = require('json-aggregate')
      const puckouts = this.getPuckouts()
      const teamSelfName = process.env.VUE_APP_TEAM

      const puckoutsSelfSecondHalf = jsonAggregate.create(JSON.stringify(puckouts.match(item => item.stat.indexOf(teamSelfName.concat(' Puckout')) >= 0).match({half: '2'}).exec())).data

      return getPuckoutConfigs(puckoutsSelfSecondHalf, this.configPitch, this.scale)
    },
    puckoutsOppositionFirstHalf: function () {
      const jsonAggregate = require('json-aggregate')
      const puckouts = this.getPuckouts()
      const teamSelfName = process.env.VUE_APP_TEAM

      const puckoutsOppositionFirstHalf = jsonAggregate.create(JSON.stringify(puckouts.match(item => item.stat.indexOf(teamSelfName.concat(' Puckout')) < 0).match({half: '1'}).exec())).data

      return getPuckoutConfigs(puckoutsOppositionFirstHalf, this.configPitch, this.scale)
    },
    puckoutsOppositionSecondHalf: function () {
      const jsonAggregate = require('json-aggregate')
      const puckouts = this.getPuckouts()
      const teamSelfName = process.env.VUE_APP_TEAM

      const puckoutsOppositionSecondHalf = jsonAggregate.create(JSON.stringify(puckouts.match(item => item.stat.indexOf(teamSelfName.concat(' Puckout')) < 0).match({half: '2'}).exec())).data

      return getPuckoutConfigs(puckoutsOppositionSecondHalf, this.configPitch, this.scale)
    },
    configSmallSqL: function () {
      return getConfigSmallSqL(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    },
    configBigSqL: function () {
      return getConfigBigSqL(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    },
    config13L: function () {
      return getConfig13L(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    },
    config20L: function () {
      return getConfig20L(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    },
    config45L: function () {
      return getConfig45L(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    },
    config65L: function () {
      return getConfig65L(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    },
    config65R: function () {
      return getConfig65R(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    },
    config45R: function () {
      return getConfig45R(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    },
    config20R: function () {
      return getConfig20R(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    },
    config13R: function () {
      return getConfig13R(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    },
    configSmallSqR: function () {
      return getConfigSmallSqR(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    },
    configBigSqR: function () {
      return getConfigBigSqR(this.configPitch, this.officialPitchWidth, this.officialPitchLength)
    }
  }
}

</script>

<template>
    <div>
      <div v-for="shotView in shotViews" :key="shotView.name">
        <h2>{{ shotView.name }}</h2>
        <v-stage :config="configKonva">
            <v-layer>
                <v-circle v-b-tooltip.hover title="Tooltip directive content" :config="getShotType('white', 10, 10).config"/>
                <v-text :config="getShotTypeText('Point', 25, 5).config"/>
                <v-circle v-b-tooltip.hover title="Tooltip directive content" :config="getShotType('darkgreen', 10, 30).config"/>
                <v-text :config="getShotTypeText('Goal', 25, 25).config"/>
                <v-circle v-b-tooltip.hover title="Tooltip directive content" :config="getShotType('red', 100, 10).config"/>
                <v-text :config="getShotTypeText('Wide', 115, 5).config"/>
                <v-circle v-b-tooltip.hover title="Tooltip directive content" :config="getShotType('darkorange', 100, 30).config"/>
                <v-text :config="getShotTypeText('Short', 115, 25).config"/>
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
                <div v-for="shot in shotView.shotConfig" :key="shot.key">
                  <v-circle v-b-tooltip.hover title="Tooltip directive content" :config="shot.config"/>
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
import { getShotConfigs } from '@/gameShots'
import { getConfigSmallSqL, getConfigBigSqL, getConfig13L, getConfig20L, getConfig45L, getConfig65L, getConfig65R, getConfig45R, getConfig20R, getConfig13R, getConfigSmallSqR, getConfigBigSqR } from '@/pitchLayout'

const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

export default {
  name: 'GameShots',
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
    getShots () {
      const jsonAggregate = require('json-aggregate')
      var gameLogsJson = JSON.stringify(this.Game.gameLogs)
      const collection = jsonAggregate.create(gameLogsJson)
      const shots = jsonAggregate.create(JSON.stringify(collection.match(item => item.stat.indexOf('From') >= 0).exec()))
      return shots
    },
    getShotType: function (fillColour, x, y) {
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
    getShotTypeText: function (text, x, y) {
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
    shotViews () {
      return [
        {
          id: 'selfShotsH1',
          name: 'Our Shots - First Half',
          shotConfig: this.shotsSelfFirstHalf
        },
        {
          id: 'selfShotsH2',
          name: 'Our Shots - Second Half',
          shotConfig: this.shotsSelfSecondHalf
        },
        {
          id: 'oppShotsH1',
          name: 'Opposition Shots - First Half',
          shotConfig: this.shotsOppositionFirstHalf
        },
        {
          id: 'oppShotsH2',
          name: 'Opposition Shots - Second Half',
          shotConfig: this.shotsOppositionSecondHalf
        }
      ]
    },
    shotsSelfFirstHalf: function () {
      const jsonAggregate = require('json-aggregate')
      const shots = this.getShots()
      const teamSelfName = process.env.VUE_APP_TEAM

      const shotsSelfFirstHalf = jsonAggregate.create(JSON.stringify(shots.match(item => item.team.indexOf(teamSelfName) >= 0).match({half: '1'}).exec())).data

      return getShotConfigs(shotsSelfFirstHalf, this.configPitch, this.scale)
    },
    shotsSelfSecondHalf: function () {
      const jsonAggregate = require('json-aggregate')
      const shots = this.getShots()
      const teamSelfName = process.env.VUE_APP_TEAM

      const shotsSelfSecondHalf = jsonAggregate.create(JSON.stringify(shots.match(item => item.team.indexOf(teamSelfName) >= 0).match({half: '2'}).exec())).data

      return getShotConfigs(shotsSelfSecondHalf, this.configPitch, this.scale)
    },
    shotsOppositionFirstHalf: function () {
      const jsonAggregate = require('json-aggregate')
      const shots = this.getShots()
      const teamSelfName = process.env.VUE_APP_TEAM

      const shotsOppositionFirstHalf = jsonAggregate.create(JSON.stringify(shots.match(item => item.team.indexOf(teamSelfName) < 0).match({half: '1'}).exec())).data

      return getShotConfigs(shotsOppositionFirstHalf, this.configPitch, this.scale)
    },
    shotsOppositionSecondHalf: function () {
      const jsonAggregate = require('json-aggregate')
      const shots = this.getShots()
      const teamSelfName = process.env.VUE_APP_TEAM

      const shotsOppositionSecondHalf = jsonAggregate.create(JSON.stringify(shots.match(item => item.team.indexOf(teamSelfName) < 0).match({half: '2'}).exec())).data

      return getShotConfigs(shotsOppositionSecondHalf, this.configPitch, this.scale)
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

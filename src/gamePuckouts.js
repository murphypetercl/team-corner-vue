function getPuckoutConfigs (puckouts, configPitch, scale) {
  const teamSelfName = process.env.VUE_APP_TEAM
  const puckoutsConfig = []
  var puckout
  var fillColour = 'white'
  for (puckout in puckouts) {
    if (puckouts[puckout].team === teamSelfName) {
      if (puckouts[puckout].stat.indexOf('BreakingBall') >= 0) {
        fillColour = 'darkgreen'
      } else if (puckouts[puckout].stat.indexOf('CleanCatch') >= 0) {
        fillColour = 'white'
      }
    }
    if (puckouts[puckout].team !== teamSelfName) {
      if (puckouts[puckout].stat.indexOf('BreakingBall') >= 0) {
        fillColour = 'darkorange'
      } else if (puckouts[puckout].stat.indexOf('CleanCatch') >= 0) {
        fillColour = 'red'
      }
    }
    if (puckouts[puckout].stat.indexOf('DirectOutOfPlay') >= 0) {
      fillColour = 'blue'
    }
    puckoutsConfig.push(
      {
        key: puckout,
        details: puckouts[puckout],
        config: {
          x: (configPitch.x + Number(puckouts[puckout].x)) * scale,
          y: (configPitch.y + Number(puckouts[puckout].y)) * scale,
          radius: 8 * scale,
          fill: fillColour,
          stroke: 'black',
          strokeWidth: 2 * scale
        }
      }
    )
  }

  return puckoutsConfig
}

export { getPuckoutConfigs }

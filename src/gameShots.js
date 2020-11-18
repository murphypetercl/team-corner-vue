function getShotConfigs (shots, configPitch, scale) {
  const shotConfigs = []
  var shot
  var fillColour = 'white'
  for (shot in shots) {
    if (shots[shot].stat.indexOf('Point') >= 0) {
      fillColour = 'white'
    } else if (shots[shot].stat.indexOf('Goal') >= 0) {
      fillColour = 'darkgreen'
    } else if (shots[shot].stat.indexOf('Wide') >= 0) {
      fillColour = 'red'
    } else if (shots[shot].stat.indexOf('Short') >= 0) {
      fillColour = 'darkorange'
    }

    shotConfigs.push(
      {
        key: shot,
        details: shots[shot],
        config: {
          x: (configPitch.x + Number(shots[shot].x)) * scale,
          y: (configPitch.y + Number(shots[shot].y)) * scale,
          radius: 8 * scale,
          fill: fillColour,
          stroke: 'black',
          strokeWidth: 2 * scale
        }
      }
    )
  }

  return shotConfigs
}

export { getShotConfigs }

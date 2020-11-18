function getConfigSmallSqL (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: configPitch.x,
    y: (configPitch.y + ((((officialPitchWidth / 2) - 7) / officialPitchWidth) * configPitch.height)),
    width: (5 / officialPitchLength * configPitch.width),
    height: (14 / officialPitchWidth * configPitch.height),
    fill: 'green',
    stroke: 'white',
    strokeWidth: 2
  }
}
function getConfigBigSqL (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: configPitch.x,
    y: (configPitch.y + ((((officialPitchWidth / 2) - 10) / officialPitchWidth) * configPitch.height)),
    width: (13 / officialPitchLength * configPitch.width),
    height: (20 / officialPitchWidth * configPitch.height),
    fill: 'green',
    stroke: 'white',
    strokeWidth: 2
  }
}
function getConfig13L (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: (configPitch.x + (13 / officialPitchLength * configPitch.width)),
    y: configPitch.y,
    points: [0, 0, 0, configPitch.height],
    stroke: 'white',
    strokeWidth: 2
  }
}
function getConfig20L (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: (configPitch.x + (20 / officialPitchLength * configPitch.width)),
    y: configPitch.y,
    points: [0, 0, 0, configPitch.height],
    stroke: 'white',
    strokeWidth: 2
  }
}
function getConfig45L (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: (configPitch.x + (45 / officialPitchLength * configPitch.width)),
    y: configPitch.y,
    points: [0, 0, 0, configPitch.height],
    stroke: 'white',
    strokeWidth: 2
  }
}
function getConfig65L (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: (configPitch.x + (65 / officialPitchLength * configPitch.width)),
    y: configPitch.y,
    points: [0, 0, 0, configPitch.height],
    stroke: 'white',
    strokeWidth: 2
  }
}
function getConfig65R (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: (configPitch.x + (configPitch.width - (65 / officialPitchLength * configPitch.width))),
    y: configPitch.y,
    points: [0, 0, 0, configPitch.height],
    stroke: 'white',
    strokeWidth: 2
  }
}
function getConfig45R (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: (configPitch.x + (configPitch.width - (45 / officialPitchLength * configPitch.width))),
    y: configPitch.y,
    points: [0, 0, 0, configPitch.height],
    stroke: 'white',
    strokeWidth: 2
  }
}
function getConfig20R (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: (configPitch.x + (configPitch.width - (20 / officialPitchLength * configPitch.width))),
    y: configPitch.y,
    points: [0, 0, 0, configPitch.height],
    stroke: 'white',
    strokeWidth: 2
  }
}
function getConfig13R (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: (configPitch.x + (configPitch.width - (13 / officialPitchLength * configPitch.width))),
    y: configPitch.y,
    points: [0, 0, 0, configPitch.height],
    stroke: 'white',
    strokeWidth: 2
  }
}
function getConfigSmallSqR (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: (configPitch.x + (configPitch.width - (5 / officialPitchLength * configPitch.width))),
    y: (configPitch.y + ((((officialPitchWidth / 2) - 7) / officialPitchWidth) * configPitch.height)),
    width: (5 / officialPitchLength * configPitch.width),
    height: (14 / officialPitchWidth * configPitch.height),
    fill: 'green',
    stroke: 'white',
    strokeWidth: 2
  }
}
function getConfigBigSqR (configPitch, officialPitchWidth, officialPitchLength) {
  return {
    x: (configPitch.x + (configPitch.width - (13 / officialPitchLength * configPitch.width))),
    y: (configPitch.y + ((((officialPitchWidth / 2) - 10) / officialPitchWidth) * configPitch.height)),
    width: (13 / officialPitchLength * configPitch.width),
    height: (20 / officialPitchWidth * configPitch.height),
    fill: 'green',
    stroke: 'white',
    strokeWidth: 2
  }
}
export { getConfigSmallSqL, getConfigBigSqL, getConfig13L, getConfig20L, getConfig45L, getConfig65L, getConfig65R, getConfig45R, getConfig20R, getConfig13R, getConfigSmallSqR, getConfigBigSqR }

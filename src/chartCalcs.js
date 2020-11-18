function getPuckoutPercentage (param1, param2) {
  return Math.round((param1 / (param1 + param2)) * 100)
}

function getShotPercentage (param1, param2) {
  return Math.round((param1 / param2) * 100)
}

export { getPuckoutPercentage, getShotPercentage }

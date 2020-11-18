function gameStatSummary (gameid, gameLogs) {
  const jsonAggregate = require('json-aggregate')
  var gameLogsJson = JSON.stringify(gameLogs)
  const collection = jsonAggregate.create(gameLogsJson)

  const teamSelfName = process.env.VUE_APP_TEAM
  const teamSelf = jsonAggregate.create(JSON.stringify(collection.match({team: teamSelfName}).exec()))
  const teamOpposition = jsonAggregate.create(JSON.stringify(collection.match(item => item.team !== teamSelfName).exec()))

  const goalsForSelf = teamSelf.match(item => item.stat.indexOf('Goal') >= 0).exec().length
  const pointsForSelf = teamSelf.match(item => item.stat.indexOf('Point') >= 0).exec().length

  const goalsForOpposition = teamOpposition.match(item => item.stat.indexOf('Goal') >= 0).exec().length
  const pointsForOpposition = teamOpposition.match(item => item.stat.indexOf('Point') >= 0).exec().length

  // Workrate
  const hookBlock = teamSelf.match(item => item.stat.indexOf('Hook Block') >= 0).exec().length
  const turnover = teamSelf.match(item => item.stat.indexOf('Turnover') >= 0).exec().length
  const turnoverWon = teamSelf.match(item => item.stat.indexOf('Turnover Won') >= 0).exec().length
  const turnoverLost = teamSelf.match(item => item.stat.indexOf('Turnover Lost') >= 0).exec().length
  const interception = teamSelf.match(item => item.stat.indexOf('Interception') >= 0).exec().length
  const looseBall = teamSelf.match(item => item.stat.indexOf('Loose Ball') >= 0).exec().length

  // Puckouts

  const puckouts = jsonAggregate.create(JSON.stringify(collection.match(item => item.stat.indexOf('Puckout') >= 0).exec()))
  const puckoutsSelfFirstHalf = jsonAggregate.create(JSON.stringify(puckouts.match(item => item.stat.indexOf(teamSelfName.concat(' Puckout')) >= 0).match({half: '1'}).exec()))
  const puckoutsSelfSecondHalf = jsonAggregate.create(JSON.stringify(puckouts.match(item => item.stat.indexOf(teamSelfName.concat(' Puckout')) >= 0).match({half: '2'}).exec()))
  const puckoutsOppositionFirstHalf = jsonAggregate.create(JSON.stringify(puckouts.match(item => item.stat.indexOf(teamSelfName.concat(' Puckout')) < 0).match({half: '1'}).exec()))
  const puckoutsOppositionSecondHalf = jsonAggregate.create(JSON.stringify(puckouts.match(item => item.stat.indexOf(teamSelfName.concat(' Puckout')) < 0).match({half: '2'}).exec()))

  const homePuckoutWonH1 = puckoutsSelfFirstHalf.match({team: teamSelfName}).exec().length
  const homePuckoutLostH1 = puckoutsSelfFirstHalf.match(item => item.team !== teamSelfName).exec().length
  const homePuckoutWonH2 = puckoutsSelfSecondHalf.match({team: teamSelfName}).exec().length
  const homePuckoutLostH2 = puckoutsSelfSecondHalf.match(item => item.team !== teamSelfName).exec().length
  const oppositionPuckoutWonH1 = puckoutsOppositionFirstHalf.match({team: teamSelfName}).exec().length
  const oppositionPuckoutLostH1 = puckoutsOppositionFirstHalf.match(item => item.team !== teamSelfName).exec().length
  const oppositionPuckoutWonH2 = puckoutsOppositionSecondHalf.match({team: teamSelfName}).exec().length
  const oppositionPuckoutLostH2 = puckoutsOppositionSecondHalf.match(item => item.team !== teamSelfName).exec().length

  // Accuracy

  const pointFromPlay = jsonAggregate.create(JSON.stringify(teamSelf.match({stat: 'PointFromPlay'}).exec()))
  const goalFromPlay = jsonAggregate.create(JSON.stringify(teamSelf.match({stat: 'GoalFromPlay'}).exec()))
  const wideFromPlay = jsonAggregate.create(JSON.stringify(teamSelf.match({stat: 'WideFromPlay'}).exec()))
  const shortFromPlay = jsonAggregate.create(JSON.stringify(teamSelf.match({stat: 'ShortFromPlay'}).exec()))
  const pointFromFree = teamSelf.match({stat: 'PointFromFree'}).exec().length
  const goalFromFree = teamSelf.match({stat: 'GoalFromFree'}).exec().length
  const wideFromFree = teamSelf.match({stat: 'WideFromFree'}).exec().length
  const shortFromFree = teamSelf.match({stat: 'ShortFromFree'}).exec().length

  const pointFromPlayH1 = pointFromPlay.match({half: '1'}).exec().length
  const goalFromPlayH1 = goalFromPlay.match({half: '1'}).exec().length
  const wideFromPlayH1 = wideFromPlay.match({half: '1'}).exec().length
  const shortFromPlayH1 = shortFromPlay.match({half: '1'}).exec().length
  /*  const pointFromFreeH1 = pointFromFree.match({half: '1'}).exec().length
const goalFromFreeH1 = goalFromFree.match({half: '1'}).exec().length
const wideFromFreeH1 = wideFromFree.match({half: '1'}).exec().length
const shortFromFreeH1 = shortFromFree.match({half: '1'}).exec().length */

  const pointFromPlayH2 = pointFromPlay.match({half: '2'}).exec().length
  const goalFromPlayH2 = goalFromPlay.match({half: '2'}).exec().length
  const wideFromPlayH2 = wideFromPlay.match({half: '2'}).exec().length
  const shortFromPlayH2 = shortFromPlay.match({half: '2'}).exec().length
  /*  const pointFromFreeH2 = pointFromFree.match({half: '2'}).exec().length
const goalFromFreeH2 = goalFromFree.match({half: '2'}).exec().length
const wideFromFreeH2 = wideFromFree.match({half: '2'}).exec().length
const shortFromFreeH2 = shortFromFree.match({half: '2'}).exec().length */

  // From Play
  var scoresFromPlayH1 = pointFromPlayH1 + goalFromPlayH1
  var shotsFromPlayH1 = scoresFromPlayH1 + wideFromPlayH1 + shortFromPlayH1
  var scoresFromPlayH2 = pointFromPlayH2 + goalFromPlayH2
  var shotsFromPlayH2 = scoresFromPlayH2 + wideFromPlayH2 + shortFromPlayH2

  // From placed balls
  var scoresFromFrees = pointFromFree + goalFromFree
  var shotsFromFrees = scoresFromFrees + wideFromFree + shortFromFree

  // const scoresFrom65s = teamSelf.match(item => item.stat.indexOf('') >= 0).exec().length
  // const shotsFrom65s = teamSelf.match(item => item.stat.indexOf('') >= 0).exec().length
  const freesWon = teamSelf.match({stat: 'Free Won'}).exec().length
  const freesConceded = teamSelf.match({stat: 'Free Conceded'}).exec().length
  // const yellowCards = teamSelf.match(item => item.stat.indexOf('') >= 0).exec().length
  // const redCards = teamSelf.match(item => item.stat.indexOf('') >= 0).exec().length

  const gameStatSummary = {
    pointsForSelf: pointsForSelf,
    goalsForSelf: goalsForSelf,
    goalsForOpposition: goalsForOpposition,
    pointsForOpposition: pointsForOpposition,
    hookBlock: hookBlock,
    turnover: turnover,
    turnoverWon: turnoverWon,
    turnoverLost: turnoverLost,
    interception: interception,
    looseBall: looseBall,
    homePuckoutWonH1: homePuckoutWonH1,
    homePuckoutLostH1: homePuckoutLostH1,
    homePuckoutWonH2: homePuckoutWonH2,
    homePuckoutLostH2: homePuckoutLostH2,
    oppositionPuckoutWonH1: oppositionPuckoutWonH1,
    oppositionPuckoutLostH1: oppositionPuckoutLostH1,
    oppositionPuckoutWonH2: oppositionPuckoutWonH2,
    oppositionPuckoutLostH2: oppositionPuckoutLostH2,
    scoresFromPlayH1: scoresFromPlayH1,
    shotsFromPlayH1: shotsFromPlayH1,
    scoresFromPlayH2: scoresFromPlayH2,
    shotsFromPlayH2: shotsFromPlayH2,
    scoresFromFrees: scoresFromFrees,
    shotsFromFrees: shotsFromFrees,
    // scoresFrom65s: scoresFrom65s,
    // shotsFrom65s: shotsFrom65s,
    freesWon: freesWon,
    freesConceded: freesConceded,
    gameId: gameid}

  return gameStatSummary
}

export { gameStatSummary }

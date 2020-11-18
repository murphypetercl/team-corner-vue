function compareValues (key, order = 'asc') {
  return function innerSort (a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key]
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    )
  }
}

function sort (obj, key, sortOrder) {
  return obj.sort(compareValues(key, sortOrder))
}

function sortGames (obj, key, sortOrder) {
  return obj.sort(compareValues(key, sortOrder))
}

function sortTeamSheet (obj, key, sortOrder) {
  return obj.sort(compareValues(key, sortOrder))
}

export { compareValues, sort, sortGames, sortTeamSheet }

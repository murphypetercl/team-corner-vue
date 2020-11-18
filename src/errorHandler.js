function handleError (error, store, router) {
  if (error.graphQLErrors[0].name === 'AccessDeniedError') {
    router.replace('/login')
  }
  store.dispatch('alert/error', error, { root: true })
}

export { handleError }

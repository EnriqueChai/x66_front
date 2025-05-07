export default {
  namespaced: true,
  state () {
    const savedVenue = localStorage.getItem('venue')
    return {
      venues: savedVenue ? JSON.parse(savedVenue) : []
    }
  },

  mutations: {
    setVenue (state, data) {
      state.venues = data.venues || []
      localStorage.setItem('venue', JSON.stringify(state.venues))
    }
  }
}
export default {
  namespaced: true,
  state () {
    const savedVenue = localStorage.getItem('venue')
    return {
      venues: savedVenue ? JSON.parse(savedVenue) : [],
      searchResults: []
    }
  },

  mutations: {
    setVenue (state, data) {
      state.venues = data.venues || []
      localStorage.setItem('venue', JSON.stringify(state.venues))
    },
    setSearchResults (state, results) {
      state.searchResults = results
    }
  },

  actions: {
    async searchVenues ({ commit }, venueName) {
      try {
        const response = await getVenue(venueName)
        commit('setSearchResults', response.venues || [])
        return response.venues
      } catch (error) {
        console.error('搜索会议/期刊失败:', error)
        return []
      }
    }
  }
}
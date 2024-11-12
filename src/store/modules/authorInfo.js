export default {
  namespaced: true,
  state () {
    return {
      authorInfo: {
        author: {},
        papers: [],
        simAuthor: []
      }
    }
  },

  mutations: {
    setAuthorInfo (state, obj) {
      state.authorInfo = obj
    }
  }
}
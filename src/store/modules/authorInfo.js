export default {
  namespaced: true,
  state () {
    return {
      authorInfo: {}
    }
  },

  mutations: {
    setAuthorInfo (state, obj) {
      state.authorInfo = obj
    }
  }
}
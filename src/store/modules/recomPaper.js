export default {
  namespaced: true,
  state () {
    const savedPaper = localStorage.getItem('Recompaper')
    return {
      paper: savedPaper ? JSON.parse(savedPaper) : {}
    }
  },

  mutations: {
    setPaper (state, obj) {
      state.paper = obj
      localStorage.setItem('Recompaper', JSON.stringify(obj))
    }
  }
}
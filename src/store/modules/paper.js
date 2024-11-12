export default {
  namespaced: true,
  state () {
    const savedPaper = localStorage.getItem('paper')
    return {
      paper: savedPaper ? JSON.parse(savedPaper) : {}
    }
  },

  mutations: {
    setPaper (state, obj) {
      state.paper = obj
      localStorage.setItem('paper', JSON.stringify(obj))
    }
  }
}
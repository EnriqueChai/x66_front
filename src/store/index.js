import Vue from 'vue'
import Vuex from 'vuex'
import authorInfo from './modules/authorInfo'
import author from './modules/author'
import getters from './getters'
import paper from './modules/paper'
import recomPaper from './modules/recomPaper'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters,
  mutations: {
  },
  actions: {
  },
  modules: {
    authorInfo,
    author,
    paper,
    recomPaper
  }
})

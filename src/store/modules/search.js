const state = {
  searchTerms: {
    original: '', // 原始搜索词（中文）
    translated: '' // 翻译后的搜索词（英文）
  }
}

const mutations = {
  setSearchTerms(state, payload) {
    state.searchTerms = payload;
  },
  resetSearchTerms(state) {
    state.searchTerms = {
      original: '',
      translated: ''
    };
  }
}

const getters = {
  getOriginalTerm: (state) => state.searchTerms.original,
  getTranslatedTerm: (state) => state.searchTerms.translated,
  hasTranslation: (state) => Boolean(state.searchTerms.original && state.searchTerms.translated && state.searchTerms.original !== state.searchTerms.translated)
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
} 
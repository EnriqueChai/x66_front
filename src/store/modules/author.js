import LZString from 'lz-string'

export default {
  namespaced: true,
  state() {
    const savedAuthor = localStorage.getItem('author');
    return {
      author: savedAuthor ? JSON.parse(LZString.decompress(savedAuthor)) : {}
    };
  },

  mutations: {
    setAuthor(state, obj) {
      state.author = obj;
      const compressedData = LZString.compress(JSON.stringify(obj));
      localStorage.setItem('author', compressedData);
    }
  }
};
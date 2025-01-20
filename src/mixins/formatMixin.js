export default {
  data() {
    return {
      functionWords: [
        'a', 'an', 'the',
        'and', 'but', 'or', 'for', 'nor', 'so', 'yet',
        'at', 'by', 'in', 'of', 'on', 'to', 'up', 'with', 'from', 'into', 'during', 'including', 'until', 'against', 'among', 'throughout', 'despite', 'towards', 'upon', 'concerning'
      ],
      specialAcronyms: {
        'ieee': 'IEEE',
        'acm': 'ACM'
      }
    };
  },
  methods: {
    /**
     * 格式化期刊名称
     * @param {String} venue - 原始期刊名称
     * @returns {String} 格式化后的期刊名称
     */
    formatVenue(venue) {
      if (!venue) return '未知期刊';
      if (typeof venue !== 'string') return '未知期刊';

      const words = venue.split(' ');

      const formattedWords = words.map(word => {
        const lowerWord = word.toLowerCase();

        if (this.specialAcronyms[lowerWord]) {
          return this.specialAcronyms[lowerWord];
        }

        if (this.functionWords.includes(lowerWord)) {
          return lowerWord;
        }

        return this.capitalizeWord(word);
      });

      return formattedWords.join(' ');
    },

    /**
     * 将单词首字母大写
     * @param {String} word - 原始单词
     * @returns {String} 首字母大写后的单词
     */
    capitalizeWord(word) {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  }
};
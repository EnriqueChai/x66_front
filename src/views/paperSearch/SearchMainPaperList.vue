<template>
  <div class="searchPaperListContainer">
    <div class="searchPaperLsitTop">
      <svg-icon icon-class="pdf" />
      <h3 class="clickable-title" @click="handleRowClick"> {{ formatTitle(paper.title) }}</h3>
      <el-tag v-if="paper.rec" class="recommend-tag" type="success" effect="light" size="small">
        你可能感兴趣
      </el-tag>
    </div>

    <div class="searchPaperLsitMid">
      <div class="authors">{{ formatAuthorNames(paper.authors) }}</div>
      <div class="abstract">{{ formatAbstract(paper.abstractText) }}</div>
    </div>

    <div class="searchPaperLsitBottom">
      <div class="bottomLeft">
        <span class="quote">引用 {{ paper.ncitation }}</span>
        <span class="venue-year">{{ formatVenue(paper.venue) }} {{ paper.year }}</span>
        <span class="field" v-if="paper.field"> 研究领域：{{ paper.field }} </span>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay show" @click.self="closeModal">
        <div class="modal-content show" @click.stop>
          <button class="close-button" @click="closeModal">×</button>
          <h2>{{ formatTitle(paper.title) }}</h2>
          <p><strong>作者：</strong>
            <span v-for="(author, index) in authorsList" :key="index">
              <span class="author-name">{{ author }}</span>
              <span v-if="index < authorsList.length - 1">, </span>
            </span>
            <span v-if="authorsList.length > maxLength"> et al.</span>
          </p>
          <p><strong>年份：</strong>{{ paper.year }}</p>
          <p><strong>引用量：</strong>{{ paper.ncitation }}</p>
          <p><strong>期刊：</strong>{{ formatVenue(paper.venue) }}</p>
          <p><strong>领域：</strong>{{ paper.field }}</p>
          <p><strong>摘要：</strong>{{ paper.abstractText || '暂无摘要信息。' }}</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'SearchPaperListContainer',
  props: {
    paper: {
      type: Object,
      required: true
    }
  },
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
      },
      showModal: false,
      maxLength: 6
    }
  },
  computed: {
    authorsList() {
      return this.splitAuthors(this.paper.authors);
    }
  },
  methods: {
    /**
     * 格式化作者名称
     * @param {String} authors - 原始作者字符串
     * @returns {String} 格式化后的作者字符串
     */
    formatAuthorNames(authors) {
      if (typeof authors === 'string') {
        return authors
          .split(',')
          .map(author => this.capitalizeName(author.trim()))
          .join(', ')
      }
      return ''
    },

    /**
     * 将作者名称首字母大写
     * @param {String} name - 原始作者名称
     * @returns {String} 格式化后的作者名称
     */
    capitalizeName(name) {
      return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ')
    },

    /**
     * 格式化期刊名称
     * @param {String} venue - 原始期刊名称
     * @returns {String} 格式化后的期刊名称
     */
    formatVenue(venue) {
      if (!venue || typeof venue !== 'string') return ''

      const words = venue.split(' ')

      const len = words.length
      const formattedWords = words.map((word, index) => {
        const lowerWord = word.toLowerCase()

        if (this.specialAcronyms[lowerWord]) {
          return this.specialAcronyms[lowerWord]
        }

        if (index === 0 || index === len - 1) {
          return this.capitalizeWord(word)
        }

        if (this.functionWords.includes(lowerWord)) {
          return lowerWord
        }

        return this.capitalizeWord(word)
      })

      return formattedWords.join(' ')
    },

    /**
     * 将单词首字母大写
     * @param {String} word - 原始单词
     * @returns {String} 首字母大写后的单词
     */
    capitalizeWord(word) {
      if (word.length === 0) return ''
      return word.charAt(0).toUpperCase() + word.slice(1)
    },

    /**
     * 格式化标题
     * @param {String} title - 原始标题
     * @returns {String} 格式化后的标题
     */
    formatTitle(title) {
      if (typeof title !== 'string') return ''

      const words = title.toLowerCase().split(' ')

      const len = words.length
      const formattedWords = words.map((word, index) => {
        const lowerWord = word.toLowerCase()

        if (this.specialAcronyms[lowerWord]) {
          return this.specialAcronyms[lowerWord]
        }

        if (index === 0 || index === len - 1) {
          return this.capitalizeWord(word)
        }

        if (this.functionWords.includes(lowerWord)) {
          return lowerWord
        }

        return this.capitalizeWord(word)
      })

      return formattedWords.join(' ')
    },

    /**
     * 分割作者列表
     * @param {String} authors - 原始作者字符串
     * @returns {Array} 作者名称数组
     */
    splitAuthors(authors) {
      if (typeof authors === 'string') {
        return authors.split(',').map(author => this.capitalizeName(author.trim()))
      }
      return []
    },

    /**
     * 格式化摘要
     * @param {String} abstract - 原始摘要
     * @returns {String} 格式化后的摘要
     */
    formatAbstract(abstract) {
      if (!abstract || typeof abstract !== 'string') return '暂无摘要信息。'
      return abstract
    },

    /**
     * 处理行点击事件，显示模态框
     */
    handleRowClick() {
      this.showModal = true
    },

    /**
     * 关闭模态框
     */
    closeModal() {
      this.showModal = false
    },

    /**
     * 处理键盘事件，按 Esc 键关闭模态框
     */
    handleKeyDown(event) {
      if (event.key === 'Escape' && this.showModal) {
        this.closeModal()
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }
}
</script>

<style lang="scss">
.searchPaperListContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 20px 20px;
  /* 增加上下内边距以向下移动内容 */
  border-bottom: 1px solid rgb(134, 134, 134);
  cursor: default;

  .searchPaperLsitTop {
    display: flex;
    align-items: center;
    font-size: 20px;

    h3 {
      color: black;
      font-size: 24px;
      /* 增大标题字号 */
      white-space: nowrap;
      /* 禁止换行 */
      overflow: hidden;
      /* 隐藏溢出内容 */
      text-overflow: ellipsis;
      /* 显示省略号 */
      margin-left: 10px;
    }

    .recommend-tag {
      margin-left: 20px;
      /* 与标题保持一点间距 */
      font-size: 14px;
      /* 标签文字大小 */
      /* 也可在这里设置其它属性，比如宽高、背景等 */
    }

    .clickable-title {
      cursor: pointer;
      margin: 0;
      padding-left: 10px;
      /* 仅标题显示指针 */
    }

    .clickable-title:hover {
      text-decoration: underline;
    }
  }

  .searchPaperLsitMid {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    color: rgb(134, 134, 134);
    font-size: 14px;
    margin-top: 10px;
    /* 增加上边距以向下移动 */

    .authors {
      margin-bottom: 5px;
      color: #1a73e8;
      /* 设置作者名称颜色为蓝色 */
    }

    .abstract {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      /* 限制为两行 */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.5;
      color: #555;
      /* 设置摘要颜色为深灰色 */
    }
  }

  .searchPaperLsitBottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
    margin-top: 10px;
    /* 增加上边距以向下移动 */

    .bottomLeft {
      display: flex;
      align-items: center;
      color: rgb(134, 134, 134);

      .quote {
        margin-right: 10px;
        color: #ac6df4;
      }

      .venue-year {
        font-size: 14px;
        color: #188038;
      }

      .field {
        font-size: 15px;
        color: #e98372;
        margin-left: 10px;
      }
    }

    .bottomright {
      a {
        color: #1a0dab;
        text-decoration: none;
        font-size: 14px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: default;

  &.show {
    opacity: 1;
  }
}

.modal-content {
  background-color: #fff;
  padding: 20px 30px;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.8);
  transition: transform 0.3s ease;
  cursor: default;

  &.show {
    transform: scale(1);
  }

  h2 {
    margin-top: 0;
    margin-bottom: 15px;
    color: black;
    font-size: 24px;
    word-break: keep-all;
  }

  p {
    margin: 10px 0;
    line-height: 1.5;
  }

  a {
    color: #1a0dab;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  /* 关闭按钮显示为指针 */
  color: #999;

  &:hover {
    color: #666;
  }
}

.author-name {
  color: #1a73e8;
  /* 设置作者名称颜色为蓝色，与列表中的颜色一致 */
}
</style>
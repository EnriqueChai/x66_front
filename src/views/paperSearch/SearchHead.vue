<template>
  <div class="searchHeadContainer">
    <!-- 标题 -->
    <div class="main-title">
      <div class="title-line">GFMBench</div>
      <div class="subtitle-line">科技文献分析系统</div>
    </div>

    <!-- 搜索框整体 -->
    <div class="recomSearch">
      <div class="inputFrame">
        <el-input v-model="input" placeholder="输入关键词搜索文献、学者或期刊..." prefix-icon="el-icon-search"
          @keyup.enter="handleSearch" />
        <el-tag v-if="input" type="info" effect="dark" class="clear-tag" @click="clearSearch">
          清空
        </el-tag>
        <el-button type="primary" icon="el-icon-search" class="search-button" @click="handleSearch"
          v-loading.fullscreen.lock="fullscreenLoading" :disabled="!input.trim()">
          搜索
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllAuthor } from '@/api/getAllAuthor'
import { getPaper } from '@/api/getPaper'
import { isChinese, translateToEnglish } from '@/utils/translate'
import { getVenue } from '@/api/getVenue'


export default {
  name: 'SearchHeadWithTitle',
  props: {
    searchType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      input: '',
      fullscreenLoading: false,
      originalInput: ''
    }
  },
  methods: {
    async handleSearch() {
      if (!this.input.trim()) return;
      this.fullscreenLoading = true;

      try {
        this.originalInput = this.input;

        let searchTerm = this.input;
        if (isChinese(searchTerm)) {
          const translatedTerm = translateToEnglish(searchTerm);
          console.log(`翻译结果: ${searchTerm} -> ${translatedTerm}`);
          searchTerm = translatedTerm;
        }

        const res = await getAllAuthor(searchTerm);
        const resPaper = await getPaper(searchTerm);
        const resVenue = await getVenue(searchTerm);

        this.$store.commit('author/setAuthor', res);
        this.$store.commit('paper/setPaper', resPaper);
        this.$store.commit('venue/setVenue', resVenue);

        if (this.originalInput !== searchTerm) {
          this.$store.commit('search/setSearchTerms', {
            original: this.originalInput,
            translated: searchTerm
          });
        }
      } catch (err) {
        console.error(err);
        this.$message.error('搜索失败，请稍后重试');
      } finally {
        this.fullscreenLoading = false;
      }
    },
    clearSearch() {
      this.input = '';
      this.originalInput = '';
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Noto+Sans+SC:wght@400;500;700&display=swap');

.searchHeadContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

/* 标题样式 */
.main-title {
  text-align: center;
  margin-bottom: 20px;
  animation: fadeIn 1s ease-out;

  .title-line {
    font-family: 'Poppins', sans-serif;
    font-size: 48px;
    font-weight: 700;
    background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 8px 16px rgba(0, 0, 150, 0.15);
    animation: titlePulse 2s infinite alternate ease-in-out;
  }

  .subtitle-line {
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 24px;
    font-weight: 500;
    opacity: 0.85;
    margin-top: 6px;
    background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeInSub 1.5s ease-out;
  }
}

/* 搜索框样式 */
.recomSearch {
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  border: 2px solid rgba(92, 178, 235, 0.8);
  box-shadow: 0 8px 20px rgba(0, 110, 255, 0.15);
  transition: all 0.3s ease;
  animation: slideUp 0.8s ease-out backwards;

  &:hover,
  &:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 110, 255, 0.2);
    border-color: rgba(92, 178, 235, 1);
  }

  .inputFrame {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 20px;

    .el-input {
      flex: 1;

      .el-input__inner {
        border: none;
        background: transparent;
        height: 52px;
        font-size: 16px;
        padding-left: 8px;

        &::placeholder {
          color: #909399;
          font-size: 16px;
        }
      }
    }

    .clear-tag {
      margin: 0 10px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: scale(1.05);
      }
    }

    .search-button {
      height: 46px;
      padding: 0 20px;
      border-radius: 23px;
      font-size: 16px;
      background: linear-gradient(90deg, #4d98ff, #2579ff);
      border: none;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(90deg, #2579ff, #1e6dff);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(1px);
      }
    }
  }
}

/* 动画定义 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInSub {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 0.85;
    transform: translateY(0);
  }
}

@keyframes titlePulse {
  from {
    opacity: 0.9;
    transform: scale(1);
  }

  to {
    opacity: 1;
    transform: scale(1.02);
  }
}
</style>

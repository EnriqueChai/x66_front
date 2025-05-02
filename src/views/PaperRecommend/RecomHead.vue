<template>
  <div class="recomHeadContainer">
    <div class="header-content">
      <h1 class="main-title">
        <div class="title-line">GFMBench</div>
        <div class="subtitle-line">科技文献分析系统</div>
      </h1>

      <div class="search-section">
        <div class="recomSearch">
          <div class="inputFrame">
            <el-input v-model="input" placeholder="输入关键词搜索文献、学者或期刊..." 
              @keyup.enter="handleSearch" clearable />
            <el-tag v-if="input" type="info" effect="dark" class="clear-tag" @click="clearSearch">清空</el-tag>
            <el-button type="primary" icon="el-icon-search" class="search-button" @click="handleSearch"
              v-loading.fullscreen.lock="fullscreenLoading" :disabled="!input.trim()">
              搜索
            </el-button>
          </div>
        </div>

        <div class="search-tip" v-if="!recentlySearched">
          <div class="simple-hot-search">
            <span class="hot-search-label">大家都在搜:</span>
            <div class="hot-search-items">
              <span v-for="(tag, index) in hotTags.slice(0, 6)" :key="index" @click="quickSearch(tag)"
                class="hot-search-item">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllAuthor } from '@/api/getAllAuthor'
import { getPaper } from '@/api/getPaper'
import { isChinese, translateToEnglish } from '@/utils/translate'

export default {
  data() {
    return {
      input: '',
      fullscreenLoading: false,
      hotTags: ['人工智能', '机器学习', '大语言模型', '图神经网络', '知识图谱', '强化学习'],
      recentlySearched: false,
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

        if (res) {
          this.$store.commit('author/setAuthor', res);
        }

        if (resPaper) {
          this.$store.commit('paper/setPaper', resPaper);
        }
        
        if (this.originalInput !== searchTerm) {
          this.$store.commit('search/setSearchTerms', {
            original: this.originalInput,
            translated: searchTerm
          });
        }

        this.recentlySearched = true;
        this.$router.push({ name: 'searchPage' });
      } catch (error) {
        console.error('搜索失败:', error);
        this.$message.error('搜索失败，请稍后重试');
      } finally {
        this.fullscreenLoading = false;
      }
    },
    clearSearch() {
      this.input = '';
      this.originalInput = '';
    },
    quickSearch(tag) {
      this.input = tag;
      this.handleSearch();
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Noto+Sans+SC:wght@400;500;700&display=swap');

.recomHeadContainer {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .header-content {
    max-width: 900px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .main-title {
    margin-bottom: 30px;
    text-align: center;
    line-height: 1.1;
    animation: fadeIn 1.2s ease-out;

    .title-line {
      font-family: 'Poppins', sans-serif;
      font-size: 60px;
      font-weight: 700;
      background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 10px 20px rgba(0, 0, 150, 0.15);
      animation: titlePulse 2s infinite alternate ease-in-out;
    }

    .subtitle-line {
      font-family: 'Noto Sans SC', sans-serif;
      font-size: 32px;
      opacity: 0.85;
      font-weight: 500;
      margin-top: 8px;
      background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: fadeInSub 1.5s ease-out;
    }
  }

  .search-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
  }

  .recomSearch {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    animation: slideUp 0.8s ease-out 0.3s backwards;
  }

  .search-tip {
    display: flex;
    margin-top: 14px;
    animation: fadeIn 1s ease-out 0.8s backwards;
    width: 100%;
    max-width: 800px;

    .simple-hot-search {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 0 10px;

      .hot-search-label {
        font-size: 14px;
        color: #606266;
        margin-right: 10px;
        white-space: nowrap;
        font-weight: 500;
      }

      .hot-search-items {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        .hot-search-item {
          font-size: 13px;
          color: #409EFF;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;

          &:hover {
            color: #66b1ff;
            text-decoration: underline;
          }

          &:not(:last-child):after {
            content: '';
            position: absolute;
            right: -6px;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 12px;
            background-color: #DCDFE6;
          }
        }
      }
    }
  }
}

/* 动画定义 */
@keyframes titlePulse {
  0% {
    opacity: 0.9;
    transform: scale(1);
  }

  100% {
    opacity: 1;
    transform: scale(1.02);
  }
}

@keyframes fadeInSub {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 0.85;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.recomSearch {
  display: flex;
  height: 56px;
  width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  border: 2px solid rgba(92, 178, 235, 0.8);
  box-shadow: 0 8px 20px rgba(0, 110, 255, 0.15);
  transition: all 0.3s ease;

  &:hover,
  &:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 110, 255, 0.2);
    border-color: rgba(92, 178, 235, 1);
  }

  .inputFrame {
    display: flex;
    flex: 1;
    justify-content: space-between;
    height: 52px;
    line-height: 52px;
    align-items: center;
    padding: 0 6px 0 20px;

    .el-input {
      flex: 1;

      /* 隐藏清除按钮 */
      .el-input__suffix {
        display: none;
      }

      .el-input__inner {
        border: none;
        font-size: 16px;
        background: transparent;
        height: 52px;
        padding-left: 8px;

        &::placeholder {
          color: #909399;
          font-size: 16px;
        }
      }
    }

    .search-button {
      height: 46px;
      border-radius: 23px;
      padding: 0 20px;
      font-size: 16px;
      background: linear-gradient(90deg, #4d98ff, #2579ff);
      border: none;
      margin-left: 10px;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(90deg, #2579ff, #1e6dff);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(1px);
      }
    }

    .clear-tag {
      margin-right: 10px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
</style>
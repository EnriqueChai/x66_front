<template>
  <div class="recomHeadContainer">
    <h1 class="main-title">GFMBench 科技文献分析系统</h1>
    <div class="recomSearch">
      <div class="inputFrame">
        <el-input v-model="input" placeholder="请输入内容" />
        <el-tag v-if="input" @click="clearSearch">清空</el-tag>
        <el-button icon="el-icon-search" circle @click="handleSearch"
          v-loading.fullscreen.lock="fullscreenLoading"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllAuthor } from '@/api/getAllAuthor'
import { getPaper } from '@/api/getPaper'

export default {
  data() {
    return {
      input: '',
      fullscreenLoading: false
    }
  },
  methods: {
    async handleSearch() {
      this.fullscreenLoading = true
      const res = await getAllAuthor(this.input)
      const resPaper = await getPaper(this.input)
      this.fullscreenLoading = false
      this.$store.commit('author/setAuthor', res)
      this.$store.commit('paper/setPaper', resPaper)
      this.$router.push({ name: 'searchPage' })
    },
    clearSearch() {
      this.input = '';
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');

.recomHeadContainer {
  // text-align: center;
  /* 居中对齐 */
  padding: 40px 20px;
  /* 增加内边距 */

  .main-title {
    font-family: 'Poppins', sans-serif;
    /* 使用现代字体 */
    font-size: 48px;
    /* 增大字体大小 */
    font-weight: 700;
    background: linear-gradient(90deg, #5CB2EB, #2F80ED);
    /* 渐变色 */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    /* 文字阴影 */
    margin-bottom: 30px;
    /* 标题与搜索框之间的间距 */
    animation: fadeIn 2s ease-in-out;
    /* 淡入动画 */
  }

  .recomSearch {
    display: flex;
    justify-content: center;
    /* 居中搜索框 */
    /* 其他现有样式保持不变 */
  }
}

/* 淡入动画定义 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.recomSearch {
  display: flex;
  height: 50px;
  width: 975px;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-radius: 15px;
  border: 2px solid rgb(92, 178, 235);

  .el-select {
    height: 50px;
    width: 130px;
    line-height: 50px;
    padding-left: 10px;

    .el-input__inner {
      border: none;
      border-right: 1px solid #C0C4CC;
      text-align: center;
      font-size: 15px;
    }

    .el-input__inner::placeholder {
      color: black;
    }
  }

  .inputFrame {
    display: flex;
    flex: 1;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    align-items: center;

    .el-input {
      padding-left: 10px;
    }

    .el-input__inner {
      border: none;
      font-size: 15px;
      width: 800px;
    }

    .el-button {
      margin-right: 20px;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      padding: 0;
    }

    .el-tag {
      margin-right: 20px;
      cursor: pointer;
    }
  }
}
</style>
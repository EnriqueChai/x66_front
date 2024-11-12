<template>
  <div class="recomHeadContainer">
    <h1>科技文献分析系统</h1>
    <div class="recomSearch">
      <div class="inputFrame">
        <el-input v-model="input" placeholder="请输入内容" />
        <el-tag v-if="input" @click="clearSearch">清空</el-tag>
        <el-button icon="el-icon-search" circle @click="handleSearch" v-loading.fullscreen.lock="fullscreenLoading"></el-button>
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
      const resPaper=await getPaper(this.input)
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
.recomHeadContainer {
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

  h1 {
    margin-block-start: 0px;
  }
}
</style>
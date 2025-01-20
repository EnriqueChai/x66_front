<template>
  <div class="searchHead">
    <!-- 搜索框 -->
    <div class="top-left">
      <div class="inputFrame">
        <el-input v-model="input" placeholder="请输入内容" />
        <el-tag v-if="input" @click="clearSearch" v-loading.fullscreen.lock="fullscreenLoading">清空</el-tag>
      </div>
    </div>

    <!-- 搜索按钮 -->
    <div class="top-right">
      <el-button @click="handleSearch">搜索</el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getPaper } from '@/api/getPaper'
import { getAllAuthor } from '@/api/getAllAuthor'

export default {
  props: {
    searchType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      input: '',
      fullscreenLoading: false
    }
  },
  methods: {
    ...mapMutations('author', ['setSearchQueryAuthor']),
    ...mapMutations('paper', ['setSearchQueryPaper']),

    async handleSearch() {
      this.fullscreenLoading = true
      const res = await getAllAuthor(this.input)
      const resPaper = await getPaper(this.input)
      this.fullscreenLoading = false
      this.$store.commit('author/setAuthor', res)
      this.$store.commit('paper/setPaper', resPaper)
    },
    clearSearch() {
      this.input = ''
    }
  }
}
</script>

<style lang="scss">
.searchHead {
  display: flex;
  width: 1300px;
  margin: 0 auto 30px;
  justify-content: space-between;

  .top-left {
    display: flex;
    height: 50px;
    width: 1100px;
    box-sizing: border-box;
    background: rgb(255, 255, 255);
    border-radius: 15px;
    border: 2px solid rgb(92, 178, 235);

    .inputFrame {
      display: flex;
      flex: 1;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      align-items: center;

      .el-input__inner {
        border: none;
        font-size: 15px;
        width: 900px;
        margin-left: 10px;
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

  .top-right {
    .el-button {
      height: 50px;
      width: 170px;
      border-radius: 15px;
      // box-shadow: 0 0 10px 0 #5586d7;
      font-size: 18px;
      color: white;
      background: #5586d7;
    }
  }
}
</style>

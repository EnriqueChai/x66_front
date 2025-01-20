<template>
  <div class="recomMainContainer" v-loading="loading">
    <div class="tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="推荐" name="first" />
      </el-tabs>
    </div>

    <div class="recomMainList">
      <RecomMainList v-for="paper in paginatedPapers" :key="paper.id" :paper="paper"></RecomMainList>
      <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="currentPage"
        :page-size="pageSize" :total="paper.length" layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 10, 20, 50]" />
    </div>
  </div>
</template>

<script>

import RecomMainList from './RecomMainList.vue'
import { getRecomPaper } from '@/api/getRecomPaper'


export default {
  components: {
    RecomMainList
  },
  data() {
    return {
      paper: [],
      activeName: 'first',
      currentPage: 1,
      pageSize: 10,
      loading: true
    }
  },

  computed: {
    paginatedPapers() {
      // 分页
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      return this.paper.slice(start, end)
    }
  },

  created() {
    this.fetchRecomPapers()
  },

  methods: {
    async fetchRecomPapers() {
      try {
        const res = await getRecomPaper()
        this.paper = res
        this.loading = false
      } catch (error) {
        console.error('获取推荐论文数据失败:', error)
      }
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
    },
    handlePageChange(page) {
      this.currentPage = page
    }
  }
}
</script>

<style lang="scss">
.recomMainContainer {
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  background-image: linear-gradient(#dff3f9, #ffffff, #ffffff, #ffffff, #ffffff);
  border-radius: 15px;
  margin: 0 15px 30px 0;
  padding: 0 20px;
  flex: 3;

  .tab {
    width: 100%;
    height: 50px;
    align-content: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 2px solid #E4E7ED;

    .el-tabs {
      padding-left: 15px;

      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        color: rgb(61, 108, 201);
      }
    }

  }

  .el-pagination {
    text-align: center;
    margin-top: 40px;
    margin-bottom: 30px;
  }
}
</style>
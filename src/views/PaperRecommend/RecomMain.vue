<template>
  <div class="recomMainContainer">
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
import { mapState } from 'vuex'



export default {
  components: {
    RecomMainList
  },
  data() {
    return {
      activeName: 'first',
      currentPage: 1,
      pageSize: 5
    }
  },

  computed: {
    ...mapState('recomPaper', ['paper']),

    paginatedPapers() {
      // 分页
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      return this.paper.slice(start, end)
    }
  },

  methods: {
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
    },
    handlePageChange(page) {
      this.currentPage = page
    }
  },
  mounted() {
    console.log('Papers in RecomMain:', this.paper);
  }
}
</script>

<style lang="scss">
.recomMainContainer {
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  background-image: linear-gradient(#dff3f9, #ffffff, #ffffff, #ffffff, #ffffff);
  border-radius: 15px;
  box-shadow: 0 0 10px 0 #a8a8a8;
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
    margin-bottom: 10px;
  }
}
</style>
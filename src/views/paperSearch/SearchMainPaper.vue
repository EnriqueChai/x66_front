<template>
  <div class="searchMainPaperContainer">
    <div class="searchContent">
      <SearchMainPaperList v-for="paper in paginatedPapers" :key="paper.id" :paper="paper"></SearchMainPaperList>
      <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="currentPage"
        :page-size="pageSize" :total="paper.length" layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 10, 20, 50]" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchMainPaperList from './SearchMainPaperList.vue'

export default {
  components: {
    SearchMainPaperList
  },
  data() {
    return {
      activeName: 'first',
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    ...mapState('paper', ['paper']),

    paginatedPapers() {
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
  }
}
</script>

<style lang="scss">
.searchMainPaperContainer {
  border-radius: 15px;
  margin: 0px;
  justify-content: space-between;
  box-shadow: 0 0 5px 0 #a8a8a8;
  background-image: linear-gradient(#dff3f9, #ffffff, #ffffff, #ffffff);
  flex: 4;

  .searchMainTab {
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
        font-size: 16px;
      }
    }

  }

  .el-pagination {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>

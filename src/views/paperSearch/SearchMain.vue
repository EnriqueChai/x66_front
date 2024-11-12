<template>
  <div class="searchMainContainer">
    <!-- <div class="switchBtn">
      <el-button round>作者</el-button>
      <el-button round>论文</el-button>
    </div> -->

    <div class="searchMainTab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="综合" name="first" />
        <el-tab-pane label="h指数" name="second" />
        <el-tab-pane label="引用数" name="third" />
        <el-tab-pane label="论文数" name="fourth" />
      </el-tabs>
    </div>

    <div class="searchContent">
      <SearchMainList v-for="authorItem in paginatedAuthors" :key="authorItem.id" :author="authorItem" />
      <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="currentPage"
        :page-size="pageSize" :total="author.length" layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 10, 20, 50]" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchMainList from './SearchMainList.vue'

export default {
  components: {
    SearchMainList
  },
  data() {
    return {
      activeName: 'first',
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    ...mapState('author', ['author', 'searchQuery']),

    sortedAuthors() {
      if (!Array.isArray(this.author)) {
        return []
      }
      let sortedAuthors = [...this.author]

      switch (this.activeName) {
        case 'second':
          sortedAuthors.sort((a, b) => b.hindex - a.hindex)
          break
        case 'third':
          sortedAuthors.sort((a, b) => b.ncitation - a.ncitation)
          break
        case 'fourth':
          sortedAuthors.sort((a, b) => b.npubs - a.npubs)
          break
        default:
          sortedAuthors = this.author
          break
      }
      return sortedAuthors
    },
    paginatedAuthors() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      return this.sortedAuthors.slice(start, end)
    }
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    handleClick() {
      this.currentPage = 1
    }
  },
  mounted() {
    console.log(this.paginatedAuthors)
  }
}
</script>

<style lang="scss">
.searchMainContainer {
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

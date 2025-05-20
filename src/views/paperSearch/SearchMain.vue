<template>
  <div class="searchMainContainer">
    <!-- 选项卡区域 -->
    <div class="searchMainTab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="综合" name="first" />
        <el-tab-pane label="引用数" name="third" />
      </el-tabs>
    </div>

    <!-- 列表内容区域 -->
    <div class="searchContent">
      <SearchMainList v-for="(authorItem, index) in paginatedAuthors" :key="`${authorItem.id} - ${index}`"
        :author="authorItem" class="paper-item" />
      <div class="pagination-wrapper" v-if="author.length > 0">
        <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="currentPage"
          :page-size="pageSize" :total="author.length" layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[5, 10, 20, 50]" />
      </div>
      <div v-if="author.length === 0" class="no-data">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchMainList from './SearchMainList.vue'

export default {
  components: { SearchMainList },
  data() {
    return {
      activeName: 'first',
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapState('author', ['author', 'searchQuery']),
    sortedAuthors() {
      console.log(this.author)
      if (!Array.isArray(this.author)) return []
      const sorted = [...this.author]
      if (this.activeName === 'third') {
        sorted.sort((a, b) => (b.ncitation || 0) - (a.ncitation || 0))
      }
      return sorted
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
  }
}
</script>

<style lang="scss">
.searchMainContainer {
  box-sizing: border-box;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 20px;
  position: relative;
  overflow: hidden;

  .searchMainTab {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.05);

    .el-tabs {
      padding-left: 0;

      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #7f8c8d;
        transition: all 0.3s;
        padding: 0 20px;

        &.is-active {
          font-weight: bold;
          color: #3498db;
          transform: translateY(-2px);
        }

        &:hover {
          color: #3498db;
        }
      }

      .el-tabs__active-bar {
        height: 3px;
        background: linear-gradient(90deg, #00c6fb, #005bea);
      }
    }
  }

  .searchContent {
    min-height: 200px;
    position: relative;

    .paper-item {
      transition: all 0.4s;
      border-radius: 8px;
      margin: 0 5px 10px;
      border: 1px solid rgba(0, 0, 0, 0.02);
      background: #fff;

      &:hover {
        transform: translateX(8px);
        box-shadow: 0 8px 25px rgba(52, 152, 219, 0.15);
        border-color: rgba(52, 152, 219, 0.1);
      }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: center;
    }

    .el-pagination {
      display: inline-flex !important;
      justify-content: center;
      margin: 20px 0 10px;
      padding: 10px 20px;
      border-radius: 30px;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

      .btn-prev,
      .btn-next {
        background: #fff;
        border-radius: 50%;
        margin: 0 5px;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }
      }

      .el-pager li {
        background: #fff;
        border-radius: 4px;
        margin: 0 3px;
        transition: all 0.3s;

        &.active {
          background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
          box-shadow: 0 3px 10px rgba(0, 152, 234, 0.3);
          color: #fff;
        }

        &:hover:not(.active) {
          transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }

    .no-data {
      text-align: center;
      padding: 40px 0;
      color: #909399;
      font-size: 14px;
    }
  }
}

/* 列表进出场动画 */
.searchContent-enter-active,
.searchContent-leave-active {
  transition: all 0.5s;
}

.searchContent-enter,
.searchContent-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.searchContent-move {
  transition: transform 0.5s;
}
</style>
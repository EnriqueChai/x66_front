<template>
  <div class="personalMainArea">
    <div class="tab">
      <el-tabs v-model="activeName">
        <el-tab-pane label="论文" name="first" />
        <!-- <el-tab-pane label="专利" name="second" />
        <el-tab-pane label="基金项目" name="third" /> -->
      </el-tabs>
    </div>

    <!-- 论文界面 -->
    <div class="mainContent">
      <div class="selectBtn">
        <el-radio-group v-model="tabPosition" style="height: 60px; line-height: 60px;">
          <el-radio-button label="按年份排序" />
          <el-radio-button label="按引用量排序" />
        </el-radio-group>
      </div>

      <div class="form">
        <el-table :data="tableData" style="width: 100%">

          <el-table-column label="标题">
            <template slot-scope="scope">
              <div style="color: black; font-size: 18px;">{{ scope.row.title }}</div>
              <div style="color: gray;">{{ extractAuthorNames(scope.row.authors) }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="venue" label="期刊" width="210" />
          <el-table-column prop="year" label="年份" width="60" />
          <el-table-column prop="ncitation" label="引用" width="60" />
        </el-table>
      </div>

      <div class="pagination">
        <el-pagination layout="prev, pager, next" :total="paperListLength" :page-size="pageSize"
          :current-page="currentPage" @current-change="handlePageChange" />
      </div>
    </div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      activeName: 'first',
      tableData: [],
      paperListLength: 0,
      pageSize: 10,
      currentPage: 1,
      tabPosition: '按年份排序'
    }
  },
  watch: {
    '$store.state.authorInfo.authorInfo.papers'(newVal) {
      if (newVal) {
        this.getPaperList()
      }
    },
    tabPosition() {
      this.currentPage = 1;
      this.updateTableData();
    }
  },

  methods: {
    async getPaperList() {
      const res = await this.$store.state.authorInfo.authorInfo.papers;
      this.paperListLength = res.length;
      this.updateTableData();
    },
    updateTableData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      const res = this.$store.state.authorInfo.authorInfo.papers;
      const sortedData = this.sortData([...res]);
      this.tableData = sortedData.slice(start, end);
    },
    handlePageChange(val) {
      this.currentPage = val;
      this.updateTableData();
    },
    sortData(data) {
      if (!data || data.length === 0) {
        return data;
      }

      return data.sort((a, b) => {
        if (this.tabPosition === '按年份排序') {
          return (b.year || 0) - (a.year || 0);
        } else if (this.tabPosition === '按引用量排序') {
          return (b.ncitation || 0) - (a.ncitation || 0);
        }
        return 0;
      });
    },
    extractAuthorNames(authors) {
      if (typeof authors === 'string') {
        try {
          authors = authors.replace(/'/g, '"');
          authors = JSON.parse(authors);
        } catch (error) {
          console.error('Failed to parse authors:', error);
          return '';
        }
      }
      if (Array.isArray(authors)) {
        return authors.map(author => author.name).join(', ');
      } else {
        console.error('Authors is not an array:', authors);
        return '';
      }
    }
  },
  mounted() {
    this.getPaperList()
  }
}
</script>

<style lang="scss">
.personalMainArea {
  flex: 3;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-radius: 15px;
  box-shadow: 0 0 10px 0 #a8a8a8;
  margin: 0 15px 30px 0;
  padding: 0 20px;

  .tab {
    height: 50px;
    border-bottom: 2px solid #E4E7ED;

    .el-tabs {
      padding-left: 15px;
      text-align: center;

      .el-tabs__item {
        height: 50px !important;
        line-height: 50px;
        font-size: 16px;
      }
    }
  }

  .pagination {
    text-align: center;
    margin-top: 30px;
  }

  .selectBtn {
    align-items: center;
    height: 60px;
    line-height: 60px;
    vertical-align: middle;
  }

  .el-table th {
    background: #f3f5fc;
  }

  .el-table {
    table-layout: fixed;
    /* 固定表格布局 */
  }

  .el-table .el-table__row {
    height: 110px;
    /* 固定行高 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
  }

  .el-table .el-table__row div {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* 限制为最多2行 */
    overflow: hidden;
    word-wrap: break-word;
    /* 自动换行 */
  }
}
</style>

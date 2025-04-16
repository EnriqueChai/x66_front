<template>
  <div class="venueMainArea">
    <div class="chartContainer">
      <div ref="chartContainer" style="width: 100%; height: 400px; border: 1px solid #ebebeb"></div>
    </div>

    <div class="tab">
      <el-tabs v-model="activeName">
        <el-tab-pane label="论文" name="first" />
      </el-tabs>
    </div>

    <div class="mainContent">
      <div class="selectBtn">
        <el-radio-group v-model="tabPosition" style="height: 60px; line-height: 60px;">
          <el-radio-button label="按年份排序" />
          <el-radio-button label="按引用量排序" />
        </el-radio-group>
      </div>

      <!-- 表格区域 -->
      <div class="form">
        <el-table :data="tableData" style="width: 100%" v-loading="loading" @row-click="handleRowClick"
          highlight-current-row>
          <el-table-column label="标题">
            <template #default="{ row }">
              <div class="clickable-title" @click="handleRowClick(row)">
                {{ row.title }}
              </div>
              <div style="color: #1a73e8;">
                {{ row.author }}
              </div>
              <div style="color: #f19e38;">
                发表时间： {{ row.time }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="venue_name" label="期刊" width="210" />
          <el-table-column prop="time" label="年份" width="60" />
          <el-table-column prop="citation" label="引用" width="60" />
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination layout="prev, pager, next" :total="paperListLength" :page-size="pageSize"
          :current-page.sync="currentPage" @current-change="handlePageChange" />
      </div>

    </div>

    <!-- 论文详情模态框 -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay show" @click.self="closeModal">
        <div class="modal-content show">
          <button class="close-button" @click="closeModal">×</button>
          <h2>{{ selectedPaper.title }}</h2>
          <p>
            <strong>作者：</strong>
            {{ selectedPaper.author }}
          </p>
          <p><strong>年份：</strong>{{ selectedPaper.time }}</p>
          <p><strong>引用量：</strong>{{ selectedPaper.citation }}</p>
          <p><strong>期刊：</strong>{{ selectedPaper.venue_name }}</p>
          <p><strong>摘要：</strong>{{ selectedPaper.abstract }}</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'VenueMainArea',
  props: {
    papers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeName: 'first',
      tableData: [],
      paperListLength: 0,
      pageSize: 10,
      currentPage: 1,
      tabPosition: '按年份排序',
      loading: false,
      showModal: false,
      selectedPaper: {},

      // 图表实例
      myChart: null
    }
  },
  computed: {
    /**
     * 按年份统计论文数量：
     * 返回形如 [{ year: 2020, count: 10 }, { year: 2021, count: 15 }, ...]
     */
    paperYearStats() {
      const statsMap = {}
      this.papers.forEach(paper => {
        const y = paper.time || '未知'
        statsMap[y] = statsMap[y] ? statsMap[y] + 1 : 1
      })

      // 将 statsMap 转成数组，并按年份升序排序
      const statsArray = Object.entries(statsMap).map(([year, count]) => {
        return { year: Number(year) || year, count }
      })

      // 只对数字年份排序
      statsArray.sort((a, b) => {
        return (isNaN(a.year) ? 999999 : a.year) - (isNaN(b.year) ? 999999 : b.year)
      })

      return statsArray
    }
  },
  watch: {
    papers: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.paperListLength = newVal.length
          this.updateTableData()
          this.$nextTick(() => {
            this.initChart()
          })
        }
      },
      immediate: true
    },
    tabPosition() {
      this.updateTableData()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    updateTableData() {
      if (!this.papers || this.papers.length === 0) {
        this.tableData = []
        return
      }
      // 先按选项排序，再分页
      const sortedData = this.sortData([...this.papers])
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      this.tableData = sortedData.slice(start, end)
    },

    handlePageChange(val) {
      this.currentPage = val
      this.updateTableData()
    },

    sortData(data) {
      if (this.tabPosition === '按年份排序') {
        return data.sort((a, b) => b.time - a.time)
      } else if (this.tabPosition === '按引用量排序') {
        return data.sort((a, b) => b.citation - a.citation)
      }
      return data
    },

    handleRowClick(row) {
      this.selectedPaper = row
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.selectedPaper = {}
    },

    initChart() {
      if (!this.$refs.chartContainer) return

      if (this.myChart) {
        this.myChart.dispose()
      }

      this.myChart = echarts.init(this.$refs.chartContainer)
      this.updateChartData()
    },

    updateChartData() {
      if (!this.myChart) return

      const yearLabels = this.paperYearStats.map(item => item.year)
      const yearCounts = this.paperYearStats.map(item => item.count)

      const option = {
        title: {
          text: '论文发表趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: yearLabels,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '论文数量'
        },
        series: [
          {
            name: '论文数',
            type: 'bar',
            data: yearCounts,
            itemStyle: {
              color: '#1a73e8'
            }
          }
        ]
      }

      this.myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss">
.venueMainArea {
  flex: 3;
  margin-right: 15px;
  height: auto;
  min-height: 850px;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-radius: 15px;

  .chartContainer {
    padding: 15px;
  }

  .tab {
    .el-tabs {
      padding: 15px;
    }
  }

  .mainContent {
    margin: 0 25px;
    min-height: 400px;

    .selectBtn {
      display: flex;
      justify-content: flex-end;
      margin-top: -25px;
    }

    .form {
      margin-top: -20px;
      padding-bottom: 15px;
    }

    .pagination {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }
  }

  .clickable-title {
    cursor: pointer;
    color: #0000EE;
    font-weight: bold;
    margin-bottom: 5px;

    &:hover {
      text-decoration: underline;
    }
  }

  // 模态框样式
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.show {
      opacity: 1;
    }
  }

  .modal-content {
    background-color: #fff;
    padding: 20px 30px;
    border-radius: 8px;
    width: 600px;
    max-width: 90%;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    max-height: 80vh;
    overflow-y: auto;
    transform: scale(0.8);
    transition: transform 0.3s ease;

    &.show {
      transform: scale(1);
    }
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;

    &:hover {
      color: #666;
    }
  }
}
</style> 
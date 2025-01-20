<template>
  <div class="personalMainArea">
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
                {{ row.authors }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="venue" label="期刊" width="210" />
          <el-table-column prop="year" label="年份" width="60" />
          <el-table-column prop="ncitation" label="引用" width="60" />
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
            <span v-for="(author, index) in selectedPaper.authorsList" :key="index">
              <span class="author-name">{{ author }}</span>
              <span v-if="index < selectedPaper.authorsList.length - 1">, </span>
            </span>
            <span v-if="selectedPaper.authorsList.length > maxLength"> et al.</span>
          </p>
          <p><strong>年份：</strong>{{ selectedPaper.year }}</p>
          <p><strong>引用量：</strong>{{ selectedPaper.ncitation }}</p>
          <p><strong>期刊：</strong>{{ selectedPaper.venue }}</p>
          <p><strong>摘要：</strong>{{ selectedPaper.abstractText }}</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { getAuthorPaper } from '@/api/authorInfo'
import * as echarts from 'echarts'

export default {
  name: 'PaperTableWithChart',
  props: {
    authorId: {
      type: String,
      required: true
    },
    modelId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      activeName: 'first',
      allData: [],
      tableData: [],
      paperListLength: 0,
      pageSize: 10,
      currentPage: 1,
      tabPosition: '按年份排序',
      loading: false,
      showModal: false,
      selectedPaper: {},
      maxLength: 6,

      // 一些辅助数据、配置
      functionWords: [
        'a', 'an', 'the',
        'and', 'but', 'or', 'for', 'nor', 'so', 'yet',
        'at', 'by', 'in', 'of', 'on', 'to', 'up', 'with', 'from', 'into',
        'during', 'including', 'until', 'against', 'among', 'throughout',
        'despite', 'towards', 'upon', 'concerning'
      ],
      specialAcronyms: {
        'ieee': 'IEEE',
        'acm': 'ACM'
      },

      // 图表实例
      myChart: null
    }
  },
  computed: {
    /**
     * 按年份统计学者论文数量：
     * 返回形如 [{ year: 2020, count: 10 }, { year: 2021, count: 15 }, ...]
     */
    paperYearStats() {
      const statsMap = {}
      this.allData.forEach(paper => {
        const y = paper.year || '未知'
        statsMap[y] = statsMap[y] ? statsMap[y] + 1 : 1
      })

      // 将 statsMap 转成数组，并按年份升序或逻辑排序
      const statsArray = Object.entries(statsMap).map(([year, count]) => {
        return { year: Number(year) || year, count }
      })

      // 只对数字年份排序，若包含 '未知' 等，可以自行处理逻辑
      statsArray.sort((a, b) => {
        // 如果 year 不是数字，可以考虑放在末尾
        return (isNaN(a.year) ? 999999 : a.year) - (isNaN(b.year) ? 999999 : b.year)
      })

      return statsArray
    }
  },
  methods: {
    // ================ 论文数据处理 ================
    async getPaperList() {
      try {
        this.loading = true
        const res = await getAuthorPaper(this.authorId, this.modelId)
        // const res = await getAuthorPaper(this.authorId)
        // 假设 res 为包含论文信息的数组
        this.allData = res.map(paper => ({
          ...paper,
          title: this.capitalizeTitle(paper.title),
          venue: this.formatVenue(paper.venue),
          authors: this.formatAuthorNames(paper.authors),
          authorsList: this.splitAuthors(paper.authors),
          abstract: paper.abstractText || '暂无摘要信息',
          pdfUrl: paper.pdfUrl || '#'
        }))
        this.paperListLength = this.allData.length
        this.updateTableData()
      } catch (error) {
        console.error('获取论文信息失败:', error)
      } finally {
        this.loading = false

        // 数据加载完成后，延迟一下再初始化图表（确保 DOM 已更新）
        this.$nextTick(() => {
          this.initChart()
        })
      }
    },

    updateTableData() {
      if (!this.allData || this.allData.length === 0) {
        this.tableData = []
        return
      }
      // 先按选项排序，再分页
      const sortedData = this.sortData([...this.allData])
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      this.tableData = sortedData.slice(start, end)
    },

    handlePageChange(val) {
      this.currentPage = val
      this.updateTableData()
    },

    sortData(data) {
      if (!data || data.length === 0) return data
      return data.sort((a, b) => {
        if (this.tabPosition === '按年份排序') {
          return (b.year || 0) - (a.year || 0)
        } else if (this.tabPosition === '按引用量排序') {
          return (b.ncitation || 0) - (a.ncitation || 0)
        }
        return 0
      })
    },

    handleRowClick(row) {
      this.selectedPaper = row
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
    },

    handleKeyDown(event) {
      if (event.key === 'Escape' && this.showModal) {
        this.closeModal()
      }
    },

    // ================ 标题、期刊、作者格式化 ================
    formatVenue(venue) {
      if (!venue || typeof venue !== 'string') return ''
      const words = venue.split(' ')
      const formattedWords = words.map(word => {
        const lowerWord = word.toLowerCase()
        if (this.specialAcronyms[lowerWord]) {
          return this.specialAcronyms[lowerWord]
        }
        if (this.functionWords.includes(lowerWord)) {
          return lowerWord
        }
        return this.capitalizeWord(word)
      })
      return formattedWords.join(' ')
    },

    capitalizeTitle(title) {
      if (typeof title !== 'string') return ''
      const words = title.toLowerCase().split(' ')
      const len = words.length
      const formattedWords = words.map((word, index) => {
        const lowerWord = word.toLowerCase()
        if (this.specialAcronyms[lowerWord]) {
          return this.specialAcronyms[lowerWord]
        }
        if (index === 0 || index === len - 1) {
          return this.capitalizeWord(word)
        }
        if (this.functionWords.includes(lowerWord)) {
          return lowerWord
        }
        return this.capitalizeWord(word)
      })
      return formattedWords.join(' ')
    },

    capitalizeWord(word) {
      if (word.length === 0) return ''
      return word.charAt(0).toUpperCase() + word.slice(1)
    },

    formatAuthorNames(authors) {
      if (typeof authors === 'string') {
        return authors
          .split(',')
          .map(author => this.capitalizeName(author.trim()))
          .join(', ')
      }
      return ''
    },

    capitalizeName(name) {
      return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ')
    },

    splitAuthors(authors) {
      if (typeof authors === 'string') {
        return authors.split(',').map(author => this.capitalizeName(author.trim()))
      }
      return []
    },

    // ================ ECharts 图表相关 ================
    initChart() {
      // 先销毁旧实例，避免多次初始化报错
      if (this.myChart) {
        this.myChart.dispose()
      }

      const chartDom = this.$refs.chartContainer
      if (!chartDom) return

      this.myChart = echarts.init(chartDom)
      // 从计算属性中获取统计数据
      const years = this.paperYearStats.map(item => item.year)
      const counts = this.paperYearStats.map(item => item.count)

      // 配置项示例：柱状图 + 折线图
      const option = {
        // title: {
        //   text: '各年份论文发表数',
        //   left: 'center'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: 60,
          left: 50,
          right: 50,
          bottom: 60
        },
        xAxis: {
          type: 'category',
          data: years,
          axisLabel: {
            rotate: 0 // 如需倾斜年份标签，可修改该值
          }
        },
        yAxis: {
          type: 'value',
          name: '论文数(篇)',
          minInterval: 1
        },
        legend: {
          top: 25,
          data: ['论文数量', '趋势']
        },
        series: [
          {
            name: '论文数量',
            type: 'bar',
            data: counts,
            barWidth: '40%',
            itemStyle: {
              color: {
                // 自下而上的渐变色
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#d4ebfc' },  // 顶端色
                  { offset: 1, color: '#0099ff' }   // 底端色
                ]
              }
            },
            label: {
              show: true,
              position: 'top',
              color: '#333'
            }
          },
          {
            name: '趋势',
            type: 'line',
            data: counts,
            smooth: true,
            lineStyle: {
              color: '#ff9900'
            },
            itemStyle: {
              color: '#ff9900'
            },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }

      // 设置配置并渲染
      this.myChart.setOption(option)

      // 图表自适应
      window.addEventListener('resize', this.handleChartResize, false)
    },

    handleChartResize() {
      if (this.myChart) {
        this.myChart.resize()
      }
    }
  },
  watch: {
    // 当排序切换时，也可以考虑刷新图表：
    tabPosition() {
      this.currentPage = 1
      this.updateTableData()
    },
    modelId(newId) {
      if (newId) {
        this.getPaperList()
      }
    }
  },
  mounted() {
    this.getPaperList()
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('resize', this.handleChartResize)
    if (this.myChart) {
      this.myChart.dispose()
    }
  }
}
</script>

<style lang="scss" scoped>
.personalMainArea {
  flex: 3;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-radius: 15px;
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

  .selectBtn {
    display: flex;
    align-items: center;
    height: 60px;
    line-height: 60px;
    vertical-align: middle;
  }

  .form {
    margin-top: 20px;
  }

  .el-table th {
    background: #f3f5fc;
  }

  .el-table {
    table-layout: fixed;
  }

  .el-table .el-table__row {
    height: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    cursor: pointer;
  }

  .el-table .el-table__row:hover {
    background-color: #f5f7fa;
  }

  .el-table .el-table__row div {
    display: block;
    overflow: hidden;
    word-wrap: break-word;
    word-break: keep-all;
  }

  .pagination {
    text-align: center;
    margin-top: 30px;
  }

  /* 模态框样式 */
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

  .modal-content h2 {
    margin-top: 0;
    margin-bottom: 15px;
    color: black;
    font-size: 24px;
    word-break: keep-all;
  }

  .modal-content p {
    margin: 10px 0;
    line-height: 1.5;
  }

  .modal-content a {
    color: #1a0dab;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .clickable-title {
    cursor: pointer;
    color: black;
    font-size: 18px;
    white-space: normal;
    overflow: visible;
    word-wrap: break-word;
    word-break: keep-all;
    display: block;
    margin-bottom: 5px;
  }

  .author-name {
    color: #1a73e8;
  }
}
</style>
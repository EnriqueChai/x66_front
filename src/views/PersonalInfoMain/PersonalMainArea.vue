<template>
  <div class="venue-main-area">
    <div class="chart-section">
      <div class="section-header">
        <h3><i class="el-icon-data-line"></i> 论文发表趋势</h3>
      </div>
      <div ref="chartContainer" class="chart-container"></div>
    </div>

    <div class="papers-section">
      <div class="tab-header">
        <h3><i class="el-icon-document"></i> 论文列表</h3>
        <div class="filter-sort">
          <el-radio-group v-model="tabPosition" size="medium">
            <el-radio-button label="按年份排序">
              <i class="el-icon-date"></i> 年份
            </el-radio-button>
            <el-radio-button label="按引用量排序">
              <i class="el-icon-reading"></i> 引用量
            </el-radio-button>
          </el-radio-group>

          <el-button type="text" class="sort-direction-btn" @click="toggleSortDirection">
            <i :class="sortDirection === 'desc' ? 'el-icon-sort-down' : 'el-icon-sort-up'"></i>
          </el-button>
        </div>
      </div>

      <!-- 论文列表 -->
      <div class="papers-list">
        <div class="paper-items-container">
          <transition-group name="fade-transform" mode="out-in">
            <div v-for="(row, index) in tableData" :key="row.id || row.title || index" class="paper-list-item"
              @click="handleRowClick(row)">
              <div class="paper-icon">
                <svg-icon icon-class="pdf" class="pdf-icon" />
              </div>

              <div class="paper-content">
                <h3 class="paper-title">{{ row.title }}</h3>

                <div class="paper-meta">
                  <div class="paper-authors">
                    <i class="el-icon-user"></i> {{ row.authors }}
                  </div>
                  <div class="paper-stats">
                    <span class="paper-year">
                      <i class="el-icon-date"></i> {{ row.year }}
                    </span>
                    <span class="paper-citations">
                      <i class="el-icon-reading"></i> 引用: {{ row.ncitation }}
                    </span>
                  </div>
                  <div class="paper-bottom-row">
                    <div class="paper-tags">
                      <el-tag size="mini" effect="plain" class="paper-venue">{{ row.venue_name }}</el-tag>
                      <el-tag v-if="row.field" size="mini" effect="plain" class="paper-field"
                        :type="getFieldTagType(row.field)">
                        {{ formatFieldName(row.field) }}
                      </el-tag>
                    </div>
                    <el-button size="mini" type="primary" plain round icon="el-icon-view" class="view-btn"
                      @click.stop="handleRowClick(row)">查看详情</el-button>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="paperListLength" :page-size="pageSize"
          :current-page.sync="currentPage" @current-change="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { getAuthorPaper } from '@/api/authorInfo'
import * as echarts from 'echarts'

export default {
  name: 'PersonalMainArea',
  props: {
    authorId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      allData: [],
      tableData: [],
      paperListLength: 0,
      pageSize: 10,
      currentPage: 1,
      tabPosition: '按年份排序',
      sortDirection: 'desc',
      loading: false,

      // 图表实例
      myChart: null
    }
  },
  computed: {
    paperYearStats() {
      const statsMap = {}
      this.allData.forEach(paper => {
        const y = paper.year || '未知'
        statsMap[y] = statsMap[y] ? statsMap[y] + 1 : 1
      })

      const statsArray = Object.entries(statsMap).map(([year, count]) => {
        return { year: Number(year) || year, count }
      })

      statsArray.sort((a, b) => {
        return (isNaN(a.year) ? 999999 : a.year) - (isNaN(b.year) ? 999999 : b.year)
      })

      return statsArray
    }
  },
  watch: {
    authorId: {
      handler(newId) {
        if (newId) {
          this.getPaperList()
        }
      },
      immediate: true
    },
    tabPosition() {
      this.updateTableData()
    },
    sortDirection() {
      this.updateTableData()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeUnmount() {
    if (this.myChart) {
      this.myChart.dispose()
    }
    window.removeEventListener('resize', this.handleChartResize)
  },
  methods: {
    async getPaperList() {
      try {
        this.loading = true
        const res = await getAuthorPaper(this.authorId)
        console.log(res)
        this.allData = res.map(paper => ({
          ...paper,
          title: this.capitalizeTitle(paper.title),
          venue_name: this.formatVenue(paper.venue),
          authors: this.formatAuthorNames(paper.authors),
          authorsList: this.splitAuthors(paper.authors),
          field: paper.field || ''
        }))
        this.paperListLength = this.allData.length
        this.updateTableData()
      } catch (error) {
        console.error('获取论文信息失败:', error)
      } finally {
        this.loading = false
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
      let sortedData = []
      if (this.tabPosition === '按年份排序') {
        sortedData = data.sort((a, b) => {
          const timeA = Number(a.year) || 0;
          const timeB = Number(b.year) || 0;
          return this.sortDirection === 'desc' ? timeB - timeA : timeA - timeB;
        });
      } else if (this.tabPosition === '按引用量排序') {
        sortedData = data.sort((a, b) => {
          const citationA = Number(a.ncitation) || 0;
          const citationB = Number(b.ncitation) || 0;
          return this.sortDirection === 'desc' ? citationB - citationA : citationA - citationB;
        });
      }
      return sortedData;
    },

    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    },

    handleRowClick(row) {
      // 准备论文数据，格式与全局模态框要求一致
      const paper = {
        title: row.title || '未知标题',
        authors: row.authorsList || [],
        time: row.year || '',
        year: row.year || '',
        summary: row.abstractText || '暂无摘要',
        abstract: row.abstractText || '暂无摘要',
        citations: row.ncitation || 0,
        pdfUrl: row.url || '',
        themes: row.keywords || [],
        venue_name: row.venue_name || '',
        field: row.field || ''
      }

      // 使用全局事件总线触发打开模态框事件
      this.$bus.$emit('showPaperModal', { show: true, paper: paper })
    },

    // 格式化方法
    capitalizeTitle(title) {
      if (!title) return ''
      return title
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    },

    formatVenue(venue) {
      if (!venue) return ''
      // 处理特殊期刊名称
      const specialVenues = {
        'ieee': 'IEEE',
        'acm': 'ACM',
        'aaai': 'AAAI',
        'ijcai': 'IJCAI',
        'neurips': 'NeurIPS',
        'icml': 'ICML',
        'cvpr': 'CVPR',
        'iccv': 'ICCV',
        'eccv': 'ECCV',
        'acl': 'ACL',
        'emnlp': 'EMNLP',
        'naacl': 'NAACL',
        'coling': 'COLING',
        'sigir': 'SIGIR',
        'www': 'WWW',
        'kdd': 'KDD',
        'icde': 'ICDE',
        'vldb': 'VLDB',
        'sigmod': 'SIGMOD',
        'pods': 'PODS',
        'icse': 'ICSE',
        'fse': 'FSE',
        'ase': 'ASE',
        'issta': 'ISSTA',
        'icst': 'ICST',
        'icpc': 'ICPC',
        'msr': 'MSR',
        'saner': 'SANER',
        'icsme': 'ICSME',
        'icpc': 'ICPC',
        'icse': 'ICSE',
        'fse': 'FSE',
        'ase': 'ASE',
        'issta': 'ISSTA',
        'icst': 'ICST',
        'icpc': 'ICPC',
        'msr': 'MSR',
        'saner': 'SANER',
        'icsme': 'ICSME'
      }

      // 转换为小写以进行匹配
      const lowerVenue = venue.toLowerCase()

      // 检查是否是特殊期刊名称
      if (specialVenues[lowerVenue]) {
        return specialVenues[lowerVenue]
      }

      // 处理普通期刊名称
      return venue
        .split(' ')
        .map(word => {
          // 处理带连字符的单词
          if (word.includes('-')) {
            return word.split('-')
              .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
              .join('-')
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join(' ')
    },

    formatAuthorNames(authors) {
      if (!authors) return ''
      return authors
        .split(',')
        .map(author => {
          // 处理作者姓名
          const trimmed = author.trim()
          // 处理带连字符的姓名
          if (trimmed.includes('-')) {
            return trimmed.split('-')
              .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
              .join('-')
          }
          // 处理普通姓名
          return trimmed
            .split(' ')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ')
        })
        .join(', ')
    },

    splitAuthors(authors) {
      if (!authors) return []
      return authors.split(',').map(author => {
        const trimmed = author.trim()
        // 处理带连字符的姓名
        if (trimmed.includes('-')) {
          return trimmed.split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join('-')
        }
        // 处理普通姓名
        return trimmed
          .split(' ')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ')
      })
    },

    // 图表相关方法
    initChart() {
      if (!this.$refs.chartContainer) return

      if (this.myChart) {
        this.myChart.dispose()
      }

      this.myChart = echarts.init(this.$refs.chartContainer)
      this.updateChartData()

      window.addEventListener('resize', this.handleChartResize)
    },

    handleChartResize() {
      if (this.myChart) {
        this.myChart.resize()
      }
    },

    updateChartData() {
      if (!this.myChart) return

      const yearLabels = this.paperYearStats.map(item => item.year)
      const yearCounts = this.paperYearStats.map(item => item.count)

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#eee',
          borderWidth: 1,
          textStyle: {
            color: '#333'
          },
          formatter: '{b}年: {c}篇论文'
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
            rotate: 45,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '论文数量',
          nameTextStyle: {
            color: '#666'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#eee',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '论文数',
            type: 'bar',
            data: yearCounts,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#00c6fb' },
                { offset: 0.5, color: '#005bea' },
                { offset: 1, color: '#005bea' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#00b4e7' },
                  { offset: 0.7, color: '#0052d6' },
                  { offset: 1, color: '#0047be' }
                ])
              }
            },
            barWidth: '60%',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.1)'
            }
          }
        ],
        animationEasing: 'elasticOut'
      }

      this.myChart.setOption(option)
    },

    // 添加新的格式化方法
    formatFieldName(field) {
      if (!field) return ''
      // 直接返回原始字段，首字母大写
      return field.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    },

    // 获取领域标签类型
    getFieldTagType(field) {
      return 'success'  // 统一使用绿色标签
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Noto+Sans+SC:wght@400;500;700&display=swap');

.venue-main-area {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  overflow: hidden;

  .section-header,
  .tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #ebeef5;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;

      i {
        margin-right: 8px;
        color: #00b4e7;
      }
    }

    .filter-sort {
      display: flex;
      align-items: center;

      .el-radio-group {
        .el-radio-button__inner {
          background: linear-gradient(135deg, #f5f7fa 0%, #d3dde5 100%);
          border: none;
          transition: all 0.3s;

          i {
            margin-right: 4px;
          }

          &:hover {
            background: linear-gradient(135deg, #e9f3ff 0%, #c3d0da 100%);
          }
        }

        .is-active .el-radio-button__inner {
          background: linear-gradient(90deg, #00c6fb, #005bea);
          color: white;
          box-shadow: 0 3px 10px rgba(0, 152, 234, 0.3);
        }
      }

      .sort-direction-btn {
        margin-left: 8px;
        font-size: 18px;
        padding: 8px;
        color: #7f8c8d;
        border-radius: 50%;
        transition: all 0.25s;

        &:hover {
          color: #3498db;
          background: rgba(52, 152, 219, 0.1);
        }

        i {
          transition: all 0.3s;
        }
      }
    }
  }

  .chart-section {
    margin-bottom: 24px;
    background: white;

    .chart-container {
      height: 380px;
      padding: 20px;
    }
  }

  .papers-section {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;

    .papers-list {
      margin-top: 20px;
      position: relative;
      min-height: 400px;

      .paper-items-container {
        position: relative;

        .paper-list-item {
          display: flex;
          align-items: flex-start;
          padding: 16px;
          border-radius: 10px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #ffffff 0%, #f9faff 100%);
          border: 1px solid rgba(0, 0, 0, 0.05);
          cursor: pointer;

          &:hover {
            transform: translateX(8px);
            background: white;
            box-shadow: 0 8px 25px rgba(52, 152, 219, 0.15);
            border-color: rgba(52, 152, 219, 0.1);
          }

          .paper-icon {
            margin-top: 6px;
            margin-right: 15px;
            flex-shrink: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 152, 234, 0.2);

            .pdf-icon {
              font-size: 20px;
              color: white;
            }
          }

          .paper-content {
            flex: 1;
            min-width: 0;

            .paper-title {
              margin: 0 0 8px 0;
              font-size: 18px;
              font-weight: 600;
              line-height: 1.4;
              color: #2c3e50;
              transition: color 0.2s;

              &:hover {
                color: #3498db;
              }
            }

            .paper-meta {
              display: flex;
              flex-direction: column;
              gap: 8px;

              .paper-authors {
                font-size: 14px;
                color: #3498db;
                margin-right: 5px;

                i {
                  margin-right: 4px;
                }
              }

              .paper-stats {
                display: flex;
                gap: 16px;

                .paper-year,
                .paper-citations {
                  font-size: 13px;
                  color: #7f8c8d;
                  display: flex;
                  align-items: center;

                  i {
                    margin-right: 4px;

                    &.el-icon-date {
                      color: #3498db;
                    }

                    &.el-icon-reading {
                      color: #f39c12;
                    }
                  }
                }
              }

              .paper-bottom-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin-top: 8px;

                .paper-tags {
                  display: flex;
                  gap: 8px;
                  align-items: center;

                  .paper-venue {
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    border: none;
                    color: #2c3e50;
                  }

                  .paper-field {
                    border: none;
                    font-weight: 500;
                  }
                }

                .view-btn {
                  background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
                  border: none;
                  color: white;
                  transition: all 0.3s;

                  &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 12px rgba(0, 123, 255, 0.3);
                  }
                }
              }
            }
          }
        }
      }
    }

    .pagination {
      padding: 20px 0;
      display: flex;
      justify-content: center;

      .el-pagination {
        padding: 10px 20px;
        border-radius: 30px;
        background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

        .btn-prev,
        .btn-next {
          background-color: white;
          border-radius: 50%;
          margin: 0 5px;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
          }
        }

        .el-pager li {
          background-color: white;
          border-radius: 4px;
          margin: 0 3px;
          transition: all 0.3s;

          &.active {
            background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
            box-shadow: 0 3px 10px rgba(0, 152, 234, 0.3);
          }

          &:hover:not(.active) {
            transform: translateY(-2px);
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }

  // 添加新的过渡动画样式
  .fade-transform-enter-active,
  .fade-transform-leave-active {
    transition: all 0.3s;
  }

  .fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  // 移除旧的过渡动画样式
  .paper-list-enter-active,
  .paper-list-leave-active,
  .paper-list-enter-from,
  .paper-list-leave-to {
    display: none;
  }
}

@media (max-width: 768px) {
  .venue-main-area {
    .papers-section {
      padding: 15px;

      .paper-list-item {
        padding: 12px;

        .paper-content {
          .paper-title {
            font-size: 16px;
          }

          .paper-meta {
            flex-direction: column;
            align-items: flex-start;

            .paper-venue {
              margin-left: 0;
              margin-top: 8px;
            }

            .view-btn {
              margin-left: 0;
              margin-top: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
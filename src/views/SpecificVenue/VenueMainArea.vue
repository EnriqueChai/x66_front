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
          
          <el-button 
            type="text" 
            class="sort-direction-btn"
            @click="toggleSortDirection"
          >
            <i :class="sortDirection === 'desc' ? 'el-icon-sort-down' : 'el-icon-sort-up'"></i>
          </el-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="papers-list">
        <transition-group name="paper-list" tag="div" class="paper-items-container">
          <div 
            v-for="(row, index) in tableData" 
            :key="row.auto_id || index"
            class="paper-list-item"
            @click="handleRowClick(row)"
          >
            <div class="paper-icon">
              <svg-icon icon-class="pdf" class="pdf-icon" />
            </div>
            
            <div class="paper-content">
              <h3 class="paper-title">{{ row.title }}</h3>
              
              <div class="paper-meta">
                <div class="paper-authors">
                  <i class="el-icon-user"></i> {{ row.author }}
                </div>
                <div class="paper-stats">
                  <span class="paper-year">
                    <i class="el-icon-date"></i> {{ row.time }}
                  </span>
                  <span class="paper-citations">
                    <i class="el-icon-reading"></i> 引用: {{ row.citation }}
                  </span>
                </div>
                <div class="paper-venue">
                  <el-tag size="mini" effect="plain">{{ row.venue_name }}</el-tag>
                </div>
                <el-button 
                  size="mini" 
                  type="primary" 
                  plain 
                  round 
                  icon="el-icon-view"
                  class="view-btn"
                  @click.stop="handleRowClick(row)"
                >查看详情</el-button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination 
          background
          layout="prev, pager, next" 
          :total="paperListLength" 
          :page-size="pageSize"
          :current-page.sync="currentPage" 
          @current-change="handlePageChange" />
      </div>
    </div>

    <!-- 论文详情模态框 -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="paper-detail-modal" :class="{ show: showModal }">
        <div class="modal-header">
          <h2>{{ selectedPaper.title }}</h2>
          <button class="close-button" @click="closeModal">
            <i class="el-icon-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="paper-meta">
            <div class="meta-row">
              <div class="meta-label"><i class="el-icon-user"></i> 作者</div>
              <div class="meta-value">{{ selectedPaper.author }}</div>
            </div>
            <div class="meta-row">
              <div class="meta-label"><i class="el-icon-date"></i> 年份</div>
              <div class="meta-value">{{ selectedPaper.time }}</div>
            </div>
            <div class="meta-row">
              <div class="meta-label"><i class="el-icon-reading"></i> 引用量</div>
              <div class="meta-value citation">{{ selectedPaper.citation }}</div>
            </div>
            <div class="meta-row">
              <div class="meta-label"><i class="el-icon-collection"></i> 期刊</div>
              <div class="meta-value">{{ selectedPaper.venue_name }}</div>
            </div>
          </div>
          
          <div class="paper-abstract">
            <h3><i class="el-icon-document-copy"></i> 摘要</h3>
            <p>{{ selectedPaper.abstract }}</p>
          </div>
        </div>
      </div>
    </div>
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
      sortDirection: 'desc', // 'desc' 为降序，'asc' 为升序

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
    },
    sortDirection() {
      this.updateTableData()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      
      // 添加ESC键关闭模态框
      window.addEventListener('keydown', this.handleKeyDown)
    })
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    if (this.myChart) {
      this.myChart.dispose()
    }
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
      let sortedData = []
      if (this.tabPosition === '按年份排序') {
        sortedData = data.sort((a, b) => {
          const timeA = Number(a.time) || 0;
          const timeB = Number(b.time) || 0;
          return this.sortDirection === 'desc' ? timeB - timeA : timeA - timeB;
        });
      } else if (this.tabPosition === '按引用量排序') {
        sortedData = data.sort((a, b) => {
          const citationA = Number(a.citation) || 0;
          const citationB = Number(b.citation) || 0;
          return this.sortDirection === 'desc' ? citationB - citationA : citationA - citationB;
        });
      }
      return sortedData;
    },
    
    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    },

    handleRowClick(row) {
      this.selectedPaper = row
      this.showModal = true
      // 禁止背景滚动
      document.body.style.overflow = 'hidden'
    },

    closeModal() {
      this.showModal = false
      // 恢复背景滚动
      document.body.style.overflow = ''
    },
    
    handleKeyDown(e) {
      if (e.key === 'Escape' && this.showModal) {
        this.closeModal()
      }
    },

    initChart() {
      if (!this.$refs.chartContainer) return

      if (this.myChart) {
        this.myChart.dispose()
      }

      this.myChart = echarts.init(this.$refs.chartContainer)
      this.updateChartData()
      
      // 响应窗口大小变化
      window.addEventListener('resize', this.resizeChart)
    },
    
    resizeChart() {
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
    }
  }
}
</script>

<style lang="scss">
.venue-main-area {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  overflow: hidden;
  
  .section-header, .tab-header {
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
    background: white;
    
    .papers-list {
      padding: 10px 20px;
      
      .paper-items-container {
        margin-top: 10px;
      }
      
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
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
            
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
              
              .paper-year, .paper-citations {
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
            
            .paper-venue {
              margin-left: auto;
              
              .el-tag {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                border: none;
                color: #2c3e50;
              }
            }
            
            .view-btn {
              background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
              border: none;
              color: white;
              margin-left: 10px;
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
    
    .pagination {
      padding: 20px 0;
      display: flex;
      justify-content: center;
      
      .el-pagination {
        padding: 10px 20px;
        border-radius: 30px;
        background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        
        .btn-prev, .btn-next {
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
  
  // 模态框样式
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(4px);
  }
  
  .paper-detail-modal {
    background: white;
    width: 700px;
    max-width: 90vw;
    max-height: 80vh;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    transform: scale(0.9);
    opacity: 0;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
    
    &.show {
      transform: scale(1);
      opacity: 1;
    }
    
    .modal-header {
      padding: 20px 24px;
      background: linear-gradient(90deg, #11aacb 0%, #25a5fc 100%);
      position: relative;
      
      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: white;
        padding-right: 40px;
      }
      
      .close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }
      }
    }
    
    .modal-body {
      padding: 24px;
      overflow-y: auto;
      max-height: calc(80vh - 80px);
      
      .paper-meta {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
        padding-bottom: 24px;
        border-bottom: 1px solid #f0f2f5;
        
        .meta-row {
          display: flex;
          flex-direction: column;
          
          .meta-label {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            
            i {
              margin-right: 8px;
              font-size: 18px;
              
              &.el-icon-user {
                color: #9b59b6;
              }
              
              &.el-icon-date {
                color: #3498db;
              }
              
              &.el-icon-reading {
                color: #f39c12;
              }
              
              &.el-icon-collection {
                color: #27ae60;
              }
            }
          }
          
          .meta-value {
            font-size: 16px;
            color: #303133;
            
            &.citation {
              color: #f56c6c;
              font-weight: 500;
            }
          }
        }
      }
      
      .paper-abstract {
        h3 {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          
          i {
            margin-right: 8px;
            color: #3498db;
          }
        }
        
        p {
          font-size: 15px;
          line-height: 1.7;
          color: #606266;
          margin: 0;
          text-align: justify;
        }
      }
    }
  }
  
  // 列表项进入/离开动画
  .paper-list-enter-active, .paper-list-leave-active {
    transition: all 0.4s;
  }
  .paper-list-enter-from, .paper-list-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style> 
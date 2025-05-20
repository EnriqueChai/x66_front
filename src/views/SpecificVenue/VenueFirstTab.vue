<template>
  <div class="venue-tabs" v-loading="loading">
    <div class="tabs-container">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane name="first">
          <template #label>
            <span class="tab-label">
              <i class="el-icon-info"></i>
              会议简介
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="second">
          <template #label>
            <span class="tab-label">
              <i class="el-icon-data-analysis"></i>
              关键指标
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="third">
          <template #label>
            <span class="tab-label">
              <i class="el-icon-time"></i>
              历史趋势
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="tab-content">
      <transition name="fade" mode="out-in" @after-enter="onTabPanelEnter">
        <div v-if="activeName === 'first'" key="first" class="content-panel bio">
          <div class="info-card">
            <div class="info-icon"><i class="el-icon-document"></i></div>
            <div class="info-content">
              <div class="info-label">会议全称</div>
              <div class="info-value">{{ venueInfo.full_name }}</div>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon"><i class="el-icon-collection-tag"></i></div>
            <div class="info-content">
              <div class="info-label">会议简称</div>
              <div class="info-value">{{ venueInfo.short_name }}</div>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon"><i class="el-icon-link"></i></div>
            <div class="info-content">
              <div class="info-label">会议官网</div>
              <div class="info-value">
                <a :href="venueInfo.url" target="_blank" rel="noopener noreferrer">{{ venueInfo.url }}</a>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="activeName === 'second'" key="second" class="content-panel metrics">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon"><i class="el-icon-trophy"></i></div>
              <div class="metric-content">
                <div class="metric-label">CCF等级</div>
                <div class="metric-value" :class="'ccf-' + venueInfo.ccf_level.toLowerCase()">
                  {{ venueInfo.ccf_level }}
                </div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon"><i class="el-icon-data-line"></i></div>
              <div class="metric-content">
                <div class="metric-label">H5指数</div>
                <div class="metric-value">{{ venueInfo.h5_index }}</div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon"><i class="el-icon-data-analysis"></i></div>
              <div class="metric-content">
                <div class="metric-label">H5中位数</div>
                <div class="metric-value">{{ venueInfo.h5_median }}</div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon"><i class="el-icon-document"></i></div>
              <div class="metric-content">
                <div class="metric-label">近5年引用中位数</div>
                <div class="metric-value">{{ venueInfo.median_citation_of_papers_in_recent_5_years }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="activeName === 'third'" key="third" class="content-panel trends">
          <div class="trend-section">
            <h3>近年来投稿量趋势</h3>
            <div class="trend-chart" ref="contributionChart"></div>
          </div>
          <div class="trend-section">
            <h3>近年来接收率趋势</h3>
            <div class="trend-chart" ref="acceptanceChart"></div>
          </div>
          <div class="trend-section">
            <h3>近年来发文量趋势</h3>
            <div class="trend-chart" ref="publicationChart"></div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    venueInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeName: 'first',
      loading: false,
      charts: {
        contribution: null,
        acceptance: null,
        publication: null
      }
    }
  },
  watch: {
    venueInfo: {
      handler(newVal) {
        if (this.activeName === 'third') {
          this.$nextTick(() => {
            this.initCharts();
            this.updateCharts();
          });
        }
      },
      deep: true,
      immediate: true
    },
    activeName(val) {
      if (val === 'third') {
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.initCharts();
            this.updateCharts();
          });
        });
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.dispose()
    })
  },
  methods: {
    handleTabClick(tab) {
      console.log('tab-click事件触发', tab.name);
    },
    initCharts() {
      console.log('contributionChart ref:', this.$refs.contributionChart);
      console.log('acceptanceChart ref:', this.$refs.acceptanceChart);
      console.log('publicationChart ref:', this.$refs.publicationChart);
      if (this.charts.contribution) {
        this.charts.contribution.dispose();
        this.charts.contribution = null;
      }
      if (this.charts.acceptance) {
        this.charts.acceptance.dispose();
        this.charts.acceptance = null;
      }
      if (this.charts.publication) {
        this.charts.publication.dispose();
        this.charts.publication = null;
      }
      if (this.$refs.contributionChart) {
        this.charts.contribution = echarts.init(this.$refs.contributionChart);
      }
      if (this.$refs.acceptanceChart) {
        this.charts.acceptance = echarts.init(this.$refs.acceptanceChart);
      }
      if (this.$refs.publicationChart) {
        this.charts.publication = echarts.init(this.$refs.publicationChart);
      }
    },
    updateCharts() {
      if (!this.venueInfo) return;
      if (this.charts.contribution) {
        const contributionOption = {
          tooltip: { trigger: 'axis' },
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis: {
            type: 'category',
            data: this.venueInfo.trending_of_contributions_in_recent_5_years.map(item => item.year)
          },
          yAxis: { type: 'value', name: '投稿量' },
          series: [{
            data: this.venueInfo.trending_of_contributions_in_recent_5_years.map(item => item.score),
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.3 }
          }]
        };
        this.charts.contribution.setOption(contributionOption);
      }
      if (this.charts.acceptance) {
        const acceptanceOption = {
          tooltip: { trigger: 'axis', formatter: '{b}年: {c}%' },
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis: {
            type: 'category',
            data: this.venueInfo.the_trend_of_admission_rate_in_recent_five_years.map(item => item.year)
          },
          yAxis: {
            type: 'value',
            name: '接收率',
            axisLabel: { formatter: '{value}%' }
          },
          series: [{
            data: this.venueInfo.the_trend_of_admission_rate_in_recent_five_years.map(item => (item.score * 100).toFixed(1)),
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.3 }
          }]
        };
        this.charts.acceptance.setOption(acceptanceOption);
      }
      if (this.charts.publication) {
        const publicationOption = {
          tooltip: { trigger: 'axis' },
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis: {
            type: 'category',
            data: this.venueInfo.the_trend_of_publication_volume_in_recent_five_years.map(item => item.year)
          },
          yAxis: { type: 'value', name: '发文量' },
          series: [{
            data: this.venueInfo.the_trend_of_publication_volume_in_recent_five_years.map(item => item.score),
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.3 }
          }]
        };
        this.charts.publication.setOption(publicationOption);
      }
    },
    handleResize() {
      Object.values(this.charts).forEach(chart => {
        if (chart) chart.resize();
      });
    },
    onTabPanelEnter() {
      if (this.activeName === 'third') {
        this.initCharts();
        this.updateCharts();
      }
    }
  }
}
</script>

<style lang="scss">
.venue-tabs {
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  overflow: hidden;
  
  .tabs-container {
    .el-tabs {
      .el-tabs__header {
        margin: 0;
        padding: 0 20px;
        background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
        border-bottom: 1px solid #e4e7ed;
      }
      
      .el-tabs__nav-wrap::after {
        height: 1px;
        background: #e0e6ed;
      }
      
      .el-tabs__item {
        height: 54px;
        line-height: 54px;
        font-size: 16px;
        color: #7f8c8d;
        transition: all 0.3s;
        padding: 0 20px;
        
        i {
          margin-right: 6px;
          font-size: 18px;
          vertical-align: middle;
          
          &.el-icon-info {
            color: #3498db;
          }
          
          &.el-icon-data-analysis {
            color: #9b59b6;
          }
          
          &.el-icon-time {
            color: #f39c12;
          }
        }
        
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
        background: linear-gradient(90deg, #00c6fb, #005bea);
        height: 3px;
      }
    }
    
    .tab-label {
      display: flex;
      align-items: center;
      font-size: 16px;
    }
  }
  
  .tab-content {
    padding: 24px 30px;
    min-height: 100px;
    background: white;
    
    .content-panel {
      line-height: 1.6;
      color: #606266;
      
      &.bio {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      
      .info-card {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 10px;
        padding: 16px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        transition: all 0.3s;
        
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .info-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          
          i {
            font-size: 24px;
              background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
          }
        }
        
        .info-content {
          flex: 1;
          
          .info-label {
            font-size: 13px;
            color: #909399;
            margin-bottom: 6px;
          }
          
          .info-value {
            font-size: 16px;
            font-weight: 500;
            color: #303133;
              
              a {
                color: #3498db;
                text-decoration: none;
                
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }
      
      &.metrics {
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          
          .metric-card {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            transition: all 0.3s;
            
            &:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .metric-icon {
              width: 48px;
              height: 48px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 16px;
              
              i {
                font-size: 24px;
                background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
            
            .metric-content {
              flex: 1;
              
              .metric-label {
                font-size: 13px;
                color: #909399;
                margin-bottom: 6px;
              }
              
              .metric-value {
                font-size: 24px;
                font-weight: 600;
                color: #303133;
                
                &.ccf-a {
                  color: #e74c3c;
                }
                
                &.ccf-b {
                  color: #27ae60;
                }
                
                &.ccf-c {
                  color: #3498db;
                }
              }
            }
          }
        }
      }
      
      &.trends {
        .trend-section {
          margin-bottom: 30px;
          
          h3 {
            font-size: 18px;
            color: #2c3e50;
            margin-bottom: 15px;
            font-weight: 600;
          }
          
          .trend-chart {
            height: 300px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          }
        }
      }
    }
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style> 
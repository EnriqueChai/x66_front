<template>
  <div class="conferListContainer" @click="handleClick">
    <div class="conferListLeft">
      <div class="conferListLeftTop">
        <span class="conferShort">{{ conference.short_name }}</span>
        <span class="divider">-</span>
        <span class="conferFull">{{ conference.full_name }}</span>
      </div>

      <div class="conferListLeftMid">
        <el-tag :type="getCcfLevelType(conference.ccf_level)" class="tag" v-if="conference.ccf_level">
          CCF {{ conference.ccf_level }}
        </el-tag>
        <el-tag type="success" class="tag" v-if="conference.h5_index">
          H5 Index: {{ conference.h5_index }}
        </el-tag>
        <el-tag type="info" class="tag" v-if="conference.h5_median">
          H5 Median: {{ conference.h5_median }}
        </el-tag>
        <el-tag type="warning" class="tag" v-if="conference.median_citation_of_papers_in_recent_5_years">
          Median Citations: {{ conference.median_citation_of_papers_in_recent_5_years }}
        </el-tag>
      </div>

      <div class="conferListLeftBottom" v-if="hasTrendingData">
        <div class="trending-title">近5年贡献趋势</div>
        <div class="trending-chart" ref="trendingChart"></div>
      </div>
    </div>

    <div class="conferListRight">
      <div class="rightContent">
        <div class="rightTitle">创办时间</div>
        <div class="rightTime" v-if="conference.year_founded">{{ conference.year_founded }} 年前</div>
        
        <div class="rightTitle" v-if="hasAdmissionRate">录取率</div>
        <div class="rightTime" v-if="hasAdmissionRate">
          {{ formatAdmissionRate }}%
        </div>

        <div class="rightTitle" v-if="hasPublicationVolume">发表量</div>
        <div class="rightTime" v-if="hasPublicationVolume">
          {{ formatPublicationVolume }} 篇
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    conference: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    hasTrendingData() {
      return this.conference.trending_of_contributions_in_recent_5_years?.length > 0
    },
    hasAdmissionRate() {
      return this.conference.the_trend_of_admission_rate_in_recent_five_years?.length > 0
    },
    hasPublicationVolume() {
      return this.conference.the_trend_of_publication_volume_in_recent_five_years?.length > 0
    },
    formatAdmissionRate() {
      if (!this.hasAdmissionRate) return ''
      const latestRate = this.conference.the_trend_of_admission_rate_in_recent_five_years
        .sort((a, b) => b.year - a.year)[0]
      return (latestRate.score * 100).toFixed(1)
    },
    formatPublicationVolume() {
      if (!this.hasPublicationVolume) return ''
      const latestVolume = this.conference.the_trend_of_publication_volume_in_recent_five_years
        .sort((a, b) => b.year - a.year)[0]
      return latestVolume.score
    }
  },
  methods: {
    getCcfLevelType(level) {
      if (level === 'A') return 'danger'
      if (level === 'B') return 'warning'
      if (level === 'C') return 'success'
      return 'info'
    },
    handleClick() {
      this.$emit('click', this.conference)
    },
    initTrendingChart() {
      if (!this.hasTrendingData) return
      
      const chartDom = this.$refs.trendingChart
      this.chart = echarts.init(chartDom)
      
      const data = this.conference.trending_of_contributions_in_recent_5_years
        .sort((a, b) => a.year - b.year)
      
      const option = {
        grid: {
          top: 5,
          right: 5,
          bottom: 5,
          left: 5
        },
        xAxis: {
          type: 'category',
          show: false,
          data: data.map(item => item.year)
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [{
          data: data.map(item => item.score),
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: '#409EFF',
            width: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(64,158,255,0.3)'
            }, {
              offset: 1,
              color: 'rgba(64,158,255,0.1)'
            }])
          }
        }]
      }
      
      this.chart.setOption(option)
    }
  },
  mounted() {
    if (this.hasTrendingData) {
      this.$nextTick(() => {
        this.initTrendingChart()
      })
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
</script>

<style lang="scss" scoped>
.conferListContainer {
  cursor: pointer;
  display: flex;
  width: 100%;
  min-height: 180px;
  padding: 20px;
  border-bottom: 1px solid rgb(229, 231, 236);
  font-family: Arial, sans-serif;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
    transform: translateX(5px);
  }

  .conferListLeft {
    flex: 5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .conferListLeftTop {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      .divider {
        margin: 0 10px;
        font-weight: normal;
        color: #909399;
      }

      .conferFull {
        font-weight: normal;
        font-size: 18px;
        color: #606266;
      }
    }

    .conferListLeftMid {
      margin: 12px 0;

      .tag {
        margin-right: 10px;
        padding: 0 8px;
        height: 24px;
        line-height: 22px;
        font-size: 12px;
        border-radius: 4px;
      }
    }

    .conferListLeftBottom {
      margin-top: 12px;
      
      .trending-title {
        font-size: 13px;
        color: #606266;
        margin-bottom: 8px;
        font-weight: 500;
      }
      
      .trending-chart {
        height: 40px;
        width: 100%;
      }
    }
  }

  .conferListRight {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding-left: 20px;
    border-left: 1px solid #ebeef5;

    .rightContent {
      text-align: right;

    .rightTitle {
        font-size: 14px;
      font-weight: bold;
        color: #606266;
        margin-bottom: 4px;
    }

    .rightTime {
        font-size: 13px;
        color: #909399;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
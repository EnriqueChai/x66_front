<template>
  <div class="venue-header" v-loading="loading">
    <div class="header-content">
      <div class="venue-logo">
        <div class="logo-circle">
          <span>{{ venueInitials }}</span>
        </div>
      </div>
      <div class="venue-info">
        <h1 class="venue-title">
          <div class="title-line">{{ venueInfo.full_name }}</div>
          <div class="subtitle-line">
            <span class="venue-type">
              <i class="el-icon-collection-tag"></i>
              {{ venueInfo.short_name }}
            </span>
            <span class="venue-divider"></span>
            <span class="venue-id">
              <i class="el-icon-document"></i>
              ID: {{ venueInfo.id }}
            </span>
            <span class="venue-divider"></span>
            <span class="venue-year">
              <i class="el-icon-date"></i>
              创办于 {{ venueInfo.year_founded }} 年前
            </span>
          </div>
        </h1>
        <div class="venue-metrics">
          <div class="metric-item">
            <span class="metric-label">CCF等级</span>
            <span class="metric-value" :class="'ccf-' + venueInfo.ccf_level.toLowerCase()">
              {{ venueInfo.ccf_level }}
            </span>
          </div>
          <div class="metric-item">
            <span class="metric-label">H5指数</span>
            <span class="metric-value">{{ venueInfo.h5_index }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">H5中位数</span>
            <span class="metric-value">{{ venueInfo.h5_median }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">近5年引用中位数</span>
            <span class="metric-value">{{ venueInfo.median_citation_of_papers_in_recent_5_years }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    venueInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    venueInitials() {
      if (!this.venueInfo.short_name) return '?'
      return this.venueInfo.short_name.slice(0, 2).toUpperCase()
    }
  },
  methods: {
    handleTabClick(tab) {
      if (tab.name === 'third') {
        this.$nextTick(() => {
          console.log('切到历史趋势tab');
          this.initCharts();
          this.updateCharts();
        });
      }
    },
    initCharts() {
      console.log('contributionChart ref:', this.$refs.contributionChart);
      console.log('acceptanceChart ref:', this.$refs.acceptanceChart);
      console.log('publicationChart ref:', this.$refs.publicationChart);

      // 先销毁再初始化，防止多次初始化
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
      console.log('venueInfo:', this.venueInfo);

      if (!this.venueInfo) return;
      // 投稿量趋势图
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
      // 接收率趋势图
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
      // 发文量趋势图
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
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Noto+Sans+SC:wght@400;500;700&display=swap');

.venue-header {
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
  
  .header-content {
    padding: 32px 40px;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, rgba(37, 117, 252, 0.05) 0%, rgba(0, 91, 234, 0.15) 100%);
  }

  .venue-logo {
    margin-right: 25px;

    .logo-circle {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: linear-gradient(135deg, #11aacb 0%, #25a5fc 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(37, 117, 252, 0.3);
      animation: pulse 2s infinite alternate ease-in-out;
      
      span {
        color: white;
        font-size: 36px;
        font-weight: bold;
        font-family: 'Poppins', sans-serif;
        text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .venue-info {
    flex: 1;

    .venue-title {
      margin: 0;
      line-height: 1.1;
      
      .title-line {
        font-family: 'Poppins', sans-serif;
        font-size: 36px;
        font-weight: 700;
        background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: titlePulse 2s infinite alternate ease-in-out;
        margin-bottom: 10px;
      }
      
      .subtitle-line {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #5a6a7a;
        animation: fadeIn 1.5s ease-out;
        font-family: 'Noto Sans SC', sans-serif;
        
        .venue-type, .venue-id, .venue-year {
          display: flex;
          align-items: center;
          
          i {
            margin-right: 6px;
            color: #3498db;
          }
        }
        
        .venue-divider {
          width: 4px;
          height: 4px;
          background-color: #5a6a7a;
          border-radius: 50%;
          margin: 0 12px;
        }
      }
    }
    
    .venue-metrics {
      display: flex;
      margin-top: 16px;
      gap: 20px;
      
      .metric-item {
        display: flex;
        flex-direction: column;
        
        .metric-label {
          font-size: 13px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        
        .metric-value {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          
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

@keyframes titlePulse {
  0% {
    opacity: 0.9;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.02);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 10px 25px rgba(37, 117, 252, 0.2);
  }
  100% {
    transform: scale(1.05);
    box-shadow: 0 15px 35px rgba(37, 117, 252, 0.4);
  }
}
</style> 
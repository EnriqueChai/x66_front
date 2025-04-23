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
          <div class="title-line">{{ venueName }}</div>
          <div class="subtitle-line">
            <span class="venue-type">
              <i class="el-icon-collection-tag"></i>
              {{ venueInfo.type || "未知类型" }}
            </span>
            <span class="venue-divider"></span>
            <span class="venue-id">
              <i class="el-icon-document"></i>
              ID: {{ venueInfo.auto_id || "未知ID" }}
            </span>
          </div>
        </h1>
        <!-- 可添加额外的会议信息 -->
        <div class="venue-metrics" v-if="venueInfo.metrics">
          <div class="metric-item" v-if="venueInfo.metrics.ccf_rank">
            <span class="metric-label">CCF等级</span>
            <span class="metric-value" :class="'ccf-' + venueInfo.metrics.ccf_rank.toLowerCase()">
              {{ venueInfo.metrics.ccf_rank }}
            </span>
          </div>
          <div class="metric-item" v-if="venueInfo.metrics.h_index">
            <span class="metric-label">H指数</span>
            <span class="metric-value">{{ venueInfo.metrics.h_index }}</span>
          </div>
          <div class="metric-item" v-if="venueInfo.metrics.accept_rate">
            <span class="metric-label">接收率</span>
            <span class="metric-value">{{ venueInfo.metrics.accept_rate }}%</span>
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
    venueName() {
      return this.venueInfo.name || '未知会议'
    },
    venueInitials() {
      if (!this.venueName) return '?'
      // 获取会议名称的首字母
      return this.venueName.split(/\s+/).map(word => word[0]).join('').toUpperCase().slice(0, 2)
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
        
        .venue-type, .venue-id {
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
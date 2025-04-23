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
              关键信息
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="third">
          <template #label>
            <span class="tab-label">
              <i class="el-icon-time"></i>
              历史沿革
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="tab-content">
      <transition name="fade" mode="out-in">
        <div v-if="activeName === 'first'" key="first" class="content-panel bio">
          <p>{{ venueBio || "这是一个国际顶级的计算机视觉会议，每年都会发表大量高质量的研究论文。会议聚集了来自世界各地的研究人员，共同探讨和分享计算机视觉领域的最新研究成果和技术进展。" }}</p>
        </div>
        <div v-else-if="activeName === 'second'" key="second" class="content-panel info">
          <div class="info-card">
            <div class="info-icon"><i class="el-icon-document"></i></div>
            <div class="info-content">
              <div class="info-label">会议ID</div>
              <div class="info-value">{{ venueInfo.auto_id || '未知' }}</div>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon"><i class="el-icon-collection-tag"></i></div>
            <div class="info-content">
              <div class="info-label">会议类型</div>
              <div class="info-value">{{ venueInfo.type || '未知' }}</div>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon"><i class="el-icon-date"></i></div>
            <div class="info-content">
              <div class="info-label">最新会议日期</div>
              <div class="info-value">{{ latestYear || '未知' }}</div>
            </div>
          </div>
        </div>
        <div v-else-if="activeName === 'third'" key="third" class="content-panel history">
          <p>{{ venueHistory || "该会议有着悠久的历史，是计算机视觉领域最具影响力的学术会议之一。自创办以来，它见证了计算机视觉技术从萌芽到蓬勃发展的全过程，为该领域的研究人员提供了一个展示创新成果和交流思想的重要平台。" }}</p>
        </div>
      </transition>
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
      activeName: 'first',
      venueBio: '',
      venueHistory: '',
      loading: false
    }
  },
  computed: {
    latestYear() {
      // 这里应该从数据中获取最新的会议年份
      return new Date().getFullYear()
    }
  },
  methods: {
    handleTabClick(tab) {
      // 可以在这里添加标签页切换的逻辑
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
      
      p {
        margin: 0;
        font-size: 15px;
        text-align: justify;
      }
    }
    
    .info {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      
      .info-card {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 280px;
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
            
            &.el-icon-document {
              background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            
            &.el-icon-collection-tag {
              background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            
            &.el-icon-date {
              background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
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
<template>
  <div class="venue-reviewers">
    <div class="card-header">
      <h3><i class="el-icon-user-solid"></i> 推荐审稿人</h3>
      <el-button type="text" class="more-btn">全部 <i class="el-icon-arrow-right"></i></el-button>
    </div>
    <div class="reviewers-content" v-loading="loading">
      <el-collapse accordion>
        <el-collapse-item v-for="(reviewers, category) in reviewers" :key="category">
          <template #title>
            <div class="category-title">
              <i class="el-icon-collection-tag"></i>
              <span>{{ category }}</span>
              <span class="reviewer-count">{{ reviewers.length }}</span>
            </div>
          </template>
          <div class="reviewers-list">
            <div v-for="(reviewer, index) in reviewers" 
                 :key="reviewer.auto_id" 
                 class="reviewer-card" 
                 @click="goToAuthorPage(reviewer.auto_id)"
                 :style="{ animationDelay: index * 0.05 + 's' }">
              <div class="reviewer-avatar">
                <span>{{ reviewer.name ? reviewer.name.charAt(0).toUpperCase() : '?' }}</span>
              </div>
              <div class="reviewer-info">
                <div class="reviewer-name">{{ reviewer.name }}</div>
                <div class="reviewer-citation">
                  <i class="el-icon-reading"></i> {{ reviewer.citation }} 引用
                </div>
              </div>
              <div class="reviewer-action">
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div v-if="isEmpty" class="empty-state">
        <i class="el-icon-warning-outline"></i>
        <span>暂无推荐审稿人</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reviewers: {
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
    isEmpty() {
      return Object.keys(this.reviewers).length === 0
    }
  },
  methods: {
    goToAuthorPage(authorId) {
      this.$router.push({
        path: '/personalInfo',
        query: { authorId: authorId }
      })
    }
  }
}
</script>

<style lang="scss">
.venue-reviewers {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f2f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, #11aacb 0%, #25a5fc 100%);
    
    h3 {
      margin: 0;
      font-size: 18px;
      color: white;
      display: flex;
      align-items: center;
      
      i {
        margin-right: 8px;
        color: #ffd700;
      }
    }
    
    .more-btn {
      font-size: 14px;
      padding: 0;
      color: white;
      
      i {
        margin-left: 4px;
      }
      
      &:hover {
        color: #ffd700;
      }
    }
  }
  
  .reviewers-content {
    flex: 1;
    padding: 10px 16px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #dcdfe6 #f2f6fc;
    background: linear-gradient(135deg, #ffffff 0%, #f9f9ff 100%);
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: #dcdfe6;
      border-radius: 3px;
      
      &:hover {
        background-color: #c0c4cc;
      }
    }
    
    &::-webkit-scrollbar-track {
      background-color: #f2f6fc;
    }
    
    .el-collapse {
      border: none;
      
      .el-collapse-item {
        margin-bottom: 5px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        
        .el-collapse-item__header {
          padding: 0 12px;
          height: 48px;
          font-size: 15px;
          background: white;
          border: none;
          border-radius: 8px;
          transition: all 0.3s;
          
          &.is-active {
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            background: #ecf5ff;
          }
          
          &:hover {
            background: #ecf5ff;
          }
        }
        
        .el-collapse-item__content {
          padding: 0;
          background: #f9fafc;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
    }
    
    .category-title {
      width: 100%;
      display: flex;
      align-items: center;
      
      i {
        color: #409EFF;
        margin-right: 8px;
      }
      
      .reviewer-count {
        margin-left: auto;
        background: linear-gradient(90deg, #00c6fb, #005bea);
        color: white;
        border-radius: 10px;
        padding: 2px 8px;
        font-size: 12px;
        font-weight: 500;
      }
    }
    
    .reviewers-list {
      padding: 4px 12px 12px;
      
      .reviewer-card {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        margin-bottom: 8px;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        animation: fadeInUp 0.4s ease both;
        border: 1px solid rgba(0, 0, 0, 0.02);
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        &:last-child {
          margin-bottom: 0;
        }
        
        &:hover {
          background: white;
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          
          .reviewer-action i {
            transform: translateX(4px);
            opacity: 1;
          }
        }
        
        .reviewer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 12px;
          background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          font-weight: bold;
          box-shadow: 0 3px 8px rgba(0, 152, 234, 0.2);
        }
        
        .reviewer-info {
          flex: 1;
          min-width: 0;
          
          .reviewer-name {
            font-weight: 500;
            color: #2c3e50;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .reviewer-citation {
            font-size: 13px;
            color: #f56c6c;
            display: flex;
            align-items: center;
            
            i {
              margin-right: 4px;
            }
          }
        }
        
        .reviewer-action {
          color: #a0a0a0;
          width: 24px;
          
          i {
            transition: all 0.3s;
            opacity: 0.4;
          }
        }
      }
    }
    
    .empty-state {
      height: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #909399;
      
      i {
        font-size: 40px;
        margin-bottom: 10px;
      }
    }
  }
}
</style> 
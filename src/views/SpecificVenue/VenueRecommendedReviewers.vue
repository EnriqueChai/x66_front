<template>
  <div class="venue-reviewers">
    <div class="card-header">
      <h3><i class="el-icon-user-solid"></i> 推荐审稿人</h3>
    </div>
    <div class="reviewers-content" v-loading="loading">
      <div class="reviewers-list">
        <div v-for="(reviewer, index) in allReviewers" :key="reviewer.auto_id" class="reviewer-card"
          @click="goToAuthorPage(reviewer.auto_id)" :style="{ animationDelay: index * 0.05 + 's' }">
          <div class="reviewer-avatar">
            <span>{{ reviewer.name ? formatAuthorName(reviewer.name).charAt(0).toUpperCase() : '?' }}</span>
          </div>
          <div class="reviewer-info">
            <div class="reviewer-name">{{ formatAuthorName(reviewer.name) }}</div>
            <div class="reviewer-fields">
              <el-tag size="mini" effect="plain" type="info" class="field-tag">{{ formatFieldName(reviewer.field)
                }}</el-tag>
            </div>
          </div>
          <div class="reviewer-citations">
            <span class="citation-count">{{ reviewer.citation }}</span>
            <span class="citation-label">引用</span>
          </div>
        </div>
      </div>
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
    },
    allReviewers() {
      return Object.values(this.reviewers).flat()
    }
  },
  methods: {
    goToAuthorPage(authorId) {
      this.$router.push({
        path: '/personalPage',
        query: { authorId: authorId }
      })
    },
    // 格式化作者姓名
    formatAuthorName(name) {
      if (!name) return ''
      return name
        .split(' ')
        .map(part => {
          // 处理带连字符的姓名
          if (part.includes('-')) {
            return part.split('-')
              .map(subPart => subPart.charAt(0).toUpperCase() + subPart.slice(1).toLowerCase())
              .join('-')
          }
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        })
        .join(' ')
    },
    // 格式化领域名称
    formatFieldName(field) {
      if (!field) return ''
      return field.toUpperCase()
    }
  }
}
</script>

<style lang="scss">
.venue-reviewers {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f2f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, #11aacb 0%, #25a5fc 100%);
    border-radius: 12px 12px 0 0;

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
  }

  .reviewers-content {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
    max-height: 400px;
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

    .reviewers-list {
      .reviewer-card {
        display: flex;
        align-items: center;
        padding: 12px;
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
        }

        .reviewer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 12px;
          background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: bold;
          box-shadow: 0 3px 8px rgba(0, 152, 234, 0.2);
        }

        .reviewer-info {
          flex: 1;
          min-width: 0;

          .reviewer-name {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 6px;
            font-size: 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .reviewer-fields {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;

            .field-tag {
              font-size: 11px;
              height: 18px;
              line-height: 16px;
              padding: 0 5px;
              border-radius: 4px;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              color: #2c3e50;
              border: none;
            }
          }
        }

        .reviewer-citations {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 5px;
          min-width: 50px;

          .citation-count {
            font-size: 16px;
            font-weight: bold;
            color: #e74c3c;
          }

          .citation-label {
            font-size: 12px;
            color: #95a5a6;
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
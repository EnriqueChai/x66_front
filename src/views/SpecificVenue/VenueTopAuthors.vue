<template>
  <div class="venue-top-authors">
    <div class="card-header">
      <h3><i class="el-icon-s-custom"></i> 优秀作者</h3>
    </div>
    <div class="authors-list" v-loading="loading">
      <div v-for="(author, index) in authors" :key="author.auto_id" class="author-card"
        @click="goToAuthorPage(author.auto_id)" :style="{ animationDelay: index * 0.1 + 's' }">
        <div class="author-avatar">
          <span>{{ author.name ? formatAuthorName(author.name).charAt(0).toUpperCase() : '?' }}</span>
          <div class="author-rank" v-if="index < 3">{{ index + 1 }}</div>
        </div>
        <div class="author-info">
          <div class="author-name">{{ formatAuthorName(author.name) }}</div>
          <div class="author-fields">
            <el-tag size="mini" effect="plain" type="info" class="field-tag">{{ formatFieldName(author.field)
            }}</el-tag>
          </div>
        </div>
        <div class="author-citations">
          <span class="citation-count">{{ author.citation }}</span>
          <span class="citation-label">引用</span>
        </div>
      </div>
      <div v-if="authors.length === 0" class="empty-state">
        <i class="el-icon-warning-outline"></i>
        <span>暂无作者数据</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    authors: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false
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
.venue-top-authors {
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
    background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
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

  .authors-list {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
    max-height: 400px; // 设置最大高度，显示约5个作者
    scrollbar-width: thin;
    scrollbar-color: #dcdfe6 #f2f6fc;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);

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

    .author-card {
      display: flex;
      align-items: center;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 10px;
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: all 0.3s;
      animation: fadeInRight 0.6s ease both;
      min-height: 60px;

      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }

        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        border-color: rgba(0, 0, 0, 0.1);
      }

      .author-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 12px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
        color: white;
        font-size: 18px;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

        &:nth-child(3n+1) {
          background-image: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
        }

        &:nth-child(3n+2) {
          background-image: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
        }

        .author-rank {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5515f 0%, #9f041b 100%);
          color: white;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
      }

      .author-info {
        flex: 1;
        min-width: 0;

        .author-name {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 4px;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .author-fields {
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

            &:nth-child(3n+1) {
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }

            &:nth-child(3n+2) {
              background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
            }

            &:nth-child(3n+3) {
              background: linear-gradient(135deg, #f5f7fa 0%, #b8c6db 100%);
            }
          }
        }
      }

      .author-citations {
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

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
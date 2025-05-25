<template>
  <div class="side-card authors-card">
    <div class="card-header">
      <h3><i class="el-icon-user-solid"></i> 推荐学者</h3>
    </div>
    <div class="author-list">
      <div v-for="(author, index) in localAuthors.slice(0, 6)" :key="index" class="author-item">
        <div class="author-avatar">
          <span>{{ author.name.charAt(0) }}</span>
        </div>
        <div class="author-info">
          <div class="author-name">{{ author.name }}</div>
          <div class="author-affiliation">{{ author.affiliation }}</div>
          <div class="author-fields">
            <el-tag size="mini" v-for="(field, i) in author.fields" :key="i" class="field-tag">
              {{ field }}
            </el-tag>
          </div>
        </div>
        <div class="author-actions">
          <div class="author-citations">
            <span class="citation-count">{{ author.total_citations }}</span>
            <span class="citation-label">引用</span>
          </div>
          <div class="author-detail-btn">
            <el-button type="text" size="mini" @click="goToAuthorDetail(author)">
              <i class="el-icon-info"></i> 详情
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecomAuthors',
  props: {
    authors: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localAuthors: []
    }
  },
  created() {
    // 直接使用临时数据，不等待API
    this.localAuthors = this.generateSampleData();
  },
  methods: {
    goToAuthorDetail(author) {
      this.$router.push({
        name: 'personalPage',
        query: {
          authorId: author.id
        }
      });
    },
    generateSampleData() {
      return [
        {
          id: 2918,
          name: "Li Fei-Fei",
          total_citations: 13377,
          fields: ["Computer Vision", "Deep Learning", "Image Recognition"],
          affiliation: "Stanford University"
        },
        {
          id: 997,
          name: "Andrew Zisserman",
          total_citations: 128240,
          fields: ["Deep Learning", "Representation Learning", "Transfer Learning"],
          affiliation: "University of Oxford"
        },
        {
          id: 2625,
          name: "Philip S Yu",
          total_citations: 87979,
          fields: ["Deep Learning", "Data Mining", "Representation Learning"],
          affiliation: "University of Illinois at Chicago"
        },
        {
          id: 2329,
          name: "Geoffrey E Hinton",
          total_citations: 13043,
          fields: ["Representation Learning", "Backpropagation Learning", "Deep Learning"],
          affiliation: "University of Toronto"
        },
        {
          id: 32899,
          name: "Jian Sun",
          total_citations: 12419,
          fields: ["Object Detection", "Feature Matching", "Object Recognition"],
          affiliation: "Megvii Technology"
        },
        {
          id: 13474,
          name: "Chuan Shi",
          total_citations: 10979,
          fields: ["Graph Neural Networks", "Signal Processing On Graphs"],
          affiliation: "Beijing University of Posts and Telecommunications"
        }
      ];
    }
  }
}
</script>

<style lang="scss" scoped>
.side-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);

  &.authors-card {
    animation-delay: 0.1s;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  }

  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f2f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);

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
}

// 作者卡片样式
.author-list {
  padding: 12px;
  height: 420px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c3cfe2 #f5f7fa;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7fa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #c3cfe2 0%, #a18cd1 100%);
    border-radius: 3px;
    
    &:hover {
      background: linear-gradient(135deg, #a18cd1 0%, #8e44ad 100%);
    }
  }

  .author-item {
    display: flex;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 8px;
    transition: all 0.3s;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      border-color: rgba(0, 0, 0, 0.1);
    }

    .author-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      margin-right: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

      &:nth-child(2n) {
        background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
      }

      &:nth-child(3n) {
        background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
      }
    }

    .author-info {
      flex: 1;
      min-width: 0;

      .author-name {
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .author-affiliation {
        font-size: 13px;
        color: #7f8c8d;
        margin-bottom: 6px;
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
          padding: 0 4px;
          height: 18px;
          line-height: 18px;
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

    .author-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 60px;

      .author-citations {
        font-size: 16px;
        font-weight: bold;
        color: #e74c3c;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .citation-label {
        font-size: 12px;
        color: #95a5a6;
      }

      .author-detail-btn {
        margin-top: 8px;

        .el-button {
          padding: 7px 10px;
          font-size: 12px;
          color: #3498db;
          transition: all 0.3s;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 4px;
          border: none;

          &:hover {
            color: #2980b9;
            background: linear-gradient(135deg, #e2e8f0 0%, #b8c6db 100%);
            transform: translateY(-1px);
          }

          i {
            margin-right: 4px;
            font-size: 14px;
          }
        }
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
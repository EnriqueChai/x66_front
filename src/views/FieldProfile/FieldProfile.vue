<template>
  <div class="fieldProfileContainer" v-loading="loading">
    <!-- 1. 领域基本信息 -->
    <div class="field-header">
      <div class="field-icon">
        <span class="icon-text">{{ getFirstChar(fieldInfo.name) }}</span>
      </div>
      <div class="field-info">
        <h1 class="field-name">{{ fieldInfo.name }}</h1>
        <div class="field-meta">
          <el-tag type="info" effect="dark" class="field-type">学术领域</el-tag>
          <span class="field-id">ID: {{ fieldInfo.id }}</span>
        </div>
      </div>
    </div>

    <!-- 2. 统计信息 -->
    <div class="field-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="el-icon-document"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ relatedPapers.length }}</div>
          <div class="stat-label">相关论文</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="el-icon-user"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ relatedAuthors.length }}</div>
          <div class="stat-label">相关学者</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="el-icon-star-on"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalCitations }}</div>
          <div class="stat-label">总引用量</div>
        </div>
      </div>
    </div>

    <!-- 3. 相关论文列表 -->
    <div class="section">
      <div class="section-header">
        <h2>相关论文</h2>
        <el-button type="text" @click="sortPapersByCitation">
          <i :class="paperSortDirection === 'desc' ? 'el-icon-sort-down' : 'el-icon-sort-up'"></i>
          按引用量排序
        </el-button>
      </div>
      <div class="paper-list">
        <div v-for="paper in paginatedPapers" :key="paper.auto_id" class="paper-item">
          <div class="paper-content">
            <h3 class="paper-title">{{ formatTitle(paper.title) }}</h3>
            <div class="paper-meta">
              <span class="meta-item">
                <i class="el-icon-date"></i> {{ paper.year || '未知年份' }}
              </span>
              <span class="meta-item">
                <i class="el-icon-reading"></i> 引用: {{ paper.citation || 0 }}
              </span>
              <span class="meta-item">
                <i class="el-icon-notebook-2"></i> {{ paper.venue || '未知期刊' }}
              </span>
            </div>
            <p class="paper-abstract">{{ paper.abstract }}</p>
          </div>
        </div>
      </div>
      <div class="pagination-container">
        <el-pagination @size-change="handlePaperSizeChange" @current-change="handlePaperCurrentChange"
          :current-page="paperCurrentPage" :page-sizes="[5, 10, 20]" :page-size="paperPageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="relatedPapers.length">
        </el-pagination>
      </div>
    </div>

    <!-- 4. 相关学者列表 -->
    <div class="section">
      <div class="section-header">
        <h2>相关学者</h2>
        <el-button type="text" @click="sortAuthorsByCitation">
          <i :class="authorSortDirection === 'desc' ? 'el-icon-sort-down' : 'el-icon-sort-up'"></i>
          按引用量排序
        </el-button>
      </div>
      <div class="author-list">
        <div v-for="author in paginatedAuthors" :key="author.auto_id" class="author-item">
          <div class="author-avatar">
            <i class="el-icon-user-solid"></i>
          </div>
          <div class="author-info">
            <h3 class="author-name">{{ formatName(author.name) }}</h3>
            <div class="author-meta">
              <span class="citation-count">
                <i class="el-icon-reading"></i> 引用: {{ author.citation }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-container">
        <el-pagination @size-change="handleAuthorSizeChange" @current-change="handleAuthorCurrentChange"
          :current-page="authorCurrentPage" :page-sizes="[6, 12, 24]" :page-size="authorPageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="relatedAuthors.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldProfile',
  data() {
    return {
      loading: false,
      fieldInfo: {},
      relatedPapers: [],
      relatedAuthors: [],
      paperSortDirection: 'desc',
      authorSortDirection: 'desc',
      paperCurrentPage: 1,
      paperPageSize: 5,
      authorCurrentPage: 1,
      authorPageSize: 6
    }
  },
  computed: {
    totalCitations() {
      return this.relatedPapers.reduce((sum, paper) => sum + (paper.citation || 0), 0);
    },
    sortedPapers() {
      const papers = [...this.relatedPapers];
      papers.sort((a, b) => {
        const aCitation = a.citation || 0;
        const bCitation = b.citation || 0;
        return this.paperSortDirection === 'desc' ? bCitation - aCitation : aCitation - bCitation;
      });
      return papers;
    },
    sortedAuthors() {
      const authors = [...this.relatedAuthors];
      authors.sort((a, b) => {
        const aCitation = a.citation || 0;
        const bCitation = b.citation || 0;
        return this.authorSortDirection === 'desc' ? bCitation - aCitation : aCitation - bCitation;
      });
      return authors;
    },
    paginatedPapers() {
      const start = (this.paperCurrentPage - 1) * this.paperPageSize;
      const end = start + this.paperPageSize;
      return this.sortedPapers.slice(start, end);
    },
    paginatedAuthors() {
      const start = (this.authorCurrentPage - 1) * this.authorPageSize;
      const end = start + this.authorPageSize;
      return this.sortedAuthors.slice(start, end);
    }
  },
  methods: {
    getFirstChar(name) {
      if (!name) return '未';
      return name.charAt(0);
    },
    formatTitle(title) {
      if (!title) return '未知标题';
      return title.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    formatName(name) {
      if (!name) return '未知作者';
      return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    sortPapersByCitation() {
      this.paperSortDirection = this.paperSortDirection === 'desc' ? 'asc' : 'desc';
    },
    sortAuthorsByCitation() {
      this.authorSortDirection = this.authorSortDirection === 'desc' ? 'asc' : 'desc';
    },
    handlePaperSizeChange(val) {
      this.paperPageSize = val;
      this.paperCurrentPage = 1;
    },
    handlePaperCurrentChange(val) {
      this.paperCurrentPage = val;
    },
    handleAuthorSizeChange(val) {
      this.authorPageSize = val;
      this.authorCurrentPage = 1;
    },
    handleAuthorCurrentChange(val) {
      this.authorCurrentPage = val;
    }
  },
  async created() {
    this.loading = true;
    try {
      // 模拟数据
      this.fieldInfo = {
        id: "100",
        name: "计算机科学",
        type: "field"
      };

      this.relatedPapers = [
        {
          auto_id: 1,
          id: 1001,
          title: "深度学习在计算机视觉中的应用研究",
          citation: 1200,
          year: 2020,
          venue: "IEEE Transactions on Pattern Analysis and Machine Intelligence",
          abstract: "本文综述了深度学习在计算机视觉领域的最新进展，包括卷积神经网络、注意力机制等关键技术，并探讨了未来发展方向。"
        },
        {
          auto_id: 2,
          id: 1002,
          title: "区块链技术及其在金融领域的应用",
          citation: 850,
          year: 2019,
          venue: "Journal of Cryptography",
          abstract: "本文详细分析了区块链技术的核心原理，并探讨了其在金融领域的应用场景和挑战。"
        },
        {
          auto_id: 3,
          id: 1003,
          title: "量子计算：原理与实现",
          citation: 650,
          year: 2021,
          venue: "Nature Computing",
          abstract: "本文介绍了量子计算的基本原理，包括量子比特、量子门等概念，并讨论了当前量子计算机的实现技术。"
        },
        {
          auto_id: 4,
          id: 1004,
          title: "人工智能在医疗诊断中的应用研究",
          citation: 550,
          year: 2022,
          venue: "Nature Medicine",
          abstract: "本文探讨了人工智能技术在医疗诊断领域的应用，包括医学影像分析、疾病预测等方面。"
        },
        {
          auto_id: 5,
          id: 1005,
          title: "云计算安全与隐私保护技术研究",
          citation: 480,
          year: 2021,
          venue: "IEEE Transactions on Cloud Computing",
          abstract: "本文研究了云计算环境下的安全与隐私保护技术，提出了新的安全架构和隐私保护方案。"
        },
        {
          auto_id: 6,
          id: 1006,
          title: "大数据分析在金融风控中的应用",
          citation: 420,
          year: 2020,
          venue: "Journal of Financial Technology",
          abstract: "本文探讨了大数据分析技术在金融风控领域的应用，包括信用评估、欺诈检测等方面。"
        },
        {
          auto_id: 7,
          id: 1007,
          title: "物联网安全与隐私保护研究",
          citation: 380,
          year: 2021,
          venue: "IEEE Internet of Things Journal",
          abstract: "本文研究了物联网环境下的安全与隐私保护问题，提出了新的安全机制和隐私保护方案。"
        },
        {
          auto_id: 8,
          id: 1008,
          title: "边缘计算在智能交通系统中的应用",
          citation: 320,
          year: 2022,
          venue: "IEEE Transactions on Intelligent Transportation Systems",
          abstract: "本文探讨了边缘计算技术在智能交通系统中的应用，包括实时数据处理、交通流量预测等方面。"
        },
        {
          auto_id: 9,
          id: 1009,
          title: "自然语言处理在智能客服中的应用",
          citation: 280,
          year: 2021,
          venue: "ACM Transactions on Information Systems",
          abstract: "本文研究了自然语言处理技术在智能客服系统中的应用，包括意图识别、情感分析等方面。"
        },
        {
          auto_id: 10,
          id: 1010,
          title: "计算机视觉在自动驾驶中的应用研究",
          citation: 250,
          year: 2022,
          venue: "IEEE Transactions on Intelligent Vehicles",
          abstract: "本文探讨了计算机视觉技术在自动驾驶系统中的应用，包括目标检测、场景理解等方面。"
        }
      ];

      this.relatedAuthors = [
        {
          auto_id: 1,
          id: 2001,
          name: "张明",
          citation: 2500
        },
        {
          auto_id: 2,
          id: 2002,
          name: "李华",
          citation: 1800
        },
        {
          auto_id: 3,
          id: 2003,
          name: "王强",
          citation: 1500
        },
        {
          auto_id: 4,
          id: 2004,
          name: "刘芳",
          citation: 1200
        },
        {
          auto_id: 5,
          id: 2005,
          name: "陈伟",
          citation: 900
        },
        {
          auto_id: 6,
          id: 2006,
          name: "杨光",
          citation: 800
        },
        {
          auto_id: 7,
          id: 2007,
          name: "赵静",
          citation: 750
        },
        {
          auto_id: 8,
          id: 2008,
          name: "周杰",
          citation: 700
        },
        {
          auto_id: 9,
          id: 2009,
          name: "吴婷",
          citation: 650
        },
        {
          auto_id: 10,
          id: 2010,
          name: "郑宇",
          citation: 600
        },
        {
          auto_id: 11,
          id: 2011,
          name: "孙浩",
          citation: 550
        },
        {
          auto_id: 12,
          id: 2012,
          name: "林峰",
          citation: 500
        }
      ];
    } catch (error) {
      console.error('获取领域信息失败:', error);
      this.$message.error('获取领域信息失败，请稍后重试');
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
.fieldProfileContainer {
  padding: 20px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media screen and (max-width: 1200px) {
    padding: 15px;
  }

  @media screen and (max-width: 768px) {
    padding: 10px;
  }

  .field-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.05);

    @media screen and (max-width: 768px) {
      flex-direction: column;
      text-align: center;

      .field-icon {
        margin-right: 0;
        margin-bottom: 15px;
      }
    }

    .field-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);

      @media screen and (max-width: 768px) {
        width: 60px;
        height: 60px;

        .icon-text {
          font-size: 30px;
        }
      }

      .icon-text {
        font-size: 40px;
        color: #fff;
        font-weight: bold;

        @media screen and (max-width: 768px) {
          font-size: 30px;
        }
      }
    }

    .field-info {
      .field-name {
        font-size: 32px;
        font-weight: bold;
        color: #2c3e50;
        margin: 0 0 10px 0;

        @media screen and (max-width: 768px) {
          font-size: 24px;
        }
      }

      .field-meta {
        display: flex;
        align-items: center;
        gap: 15px;
        flex-wrap: wrap;

        .field-type {
          font-size: 14px;
          padding: 4px 12px;
        }

        .field-id {
          color: #7f8c8d;
          font-size: 14px;
        }
      }
    }
  }

  .field-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;

    .stat-card {
      flex: 1;
      min-width: 200px;
      max-width: 300px;
      padding: 20px;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
      border-radius: 15px;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;

      @media screen and (max-width: 768px) {
        min-width: 100%;
      }

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }

      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);

        i {
          font-size: 24px;
          color: #3498db;
        }
      }

      .stat-content {
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 14px;
          color: #7f8c8d;
        }
      }
    }
  }

  .section {
    margin-bottom: 30px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      h2 {
        font-size: 24px;
        color: #2c3e50;
        margin: 0;
      }
    }
  }

  .paper-list {
    .paper-item {
      background: #fff;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 15px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;

      &:hover {
        transform: translateX(5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      .paper-title {
        font-size: 18px;
        color: #2c3e50;
        margin: 0 0 10px 0;
        line-height: 1.4;
      }

      .paper-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 10px;

        .meta-item {
          display: flex;
          align-items: center;
          color: #7f8c8d;
          font-size: 14px;

          i {
            margin-right: 5px;
            color: #3498db;
          }
        }
      }

      .paper-abstract {
        color: #7f8c8d;
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
      }
    }
  }

  .author-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;

    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .author-item {
      background: #fff;
      border-radius: 10px;
      padding: 15px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      .author-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;

        i {
          font-size: 24px;
          color: #3498db;
        }
      }

      .author-info {
        flex: 1;

        .author-name {
          font-size: 16px;
          color: #2c3e50;
          margin: 0 0 5px 0;
        }

        .author-meta {
          .citation-count {
            display: flex;
            align-items: center;
            color: #7f8c8d;
            font-size: 14px;

            i {
              margin-right: 5px;
              color: #f39c12;
            }
          }
        }
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
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

    <!-- 1.1 领域简介 -->
    <div class="field-intro" v-if="fieldIntro">
      <div class="intro-header">
        <i class="el-icon-info"></i>
        <h2>领域简介</h2>
      </div>
      <div class="intro-content">
        {{ fieldIntro }}
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
        <h2>高引论文</h2>
        <el-button type="text" @click="sortPapersByCitation">
          <i :class="paperSortDirection === 'desc' ? 'el-icon-sort-down' : 'el-icon-sort-up'"></i>
          按引用量排序
        </el-button>
      </div>
      <div class="paper-list">
        <div v-for="paper in paginatedPapers" :key="paper.auto_id" class="paper-item" @click="showPaperDetail(paper)">
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
                <i class="el-icon-notebook-2"></i> {{ formatVenue(paper.venue) }}
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
        <h2>重要学者</h2>
        <el-button type="text" @click="sortAuthorsByCitation">
          <i :class="authorSortDirection === 'desc' ? 'el-icon-sort-down' : 'el-icon-sort-up'"></i>
          按引用量排序
        </el-button>
      </div>
      <div class="author-list">
        <div v-for="author in paginatedAuthors" :key="author.auto_id" class="author-item" @click="navToAuthor(author)">
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
import { getFieldInfo } from '@/api/getField'

export default {
  name: 'FieldProfile',
  data() {
    return {
      loading: false,
      fieldInfo: {},
      fieldIntro: '',
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
      return this.fieldInfo.citation || 0;
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
      return name.charAt(0).toUpperCase();
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
    formatVenue(venue) {
      if (!venue) return '未知期刊';
      
      // 处理特殊缩写
      const acronyms = {
        'ieee': 'IEEE',
        'acm': 'ACM',
        'sigmod': 'SIGMOD',
        'sigir': 'SIGIR',
        'kdd': 'KDD',
        'icde': 'ICDE',
        'vldb': 'VLDB',
        'cvpr': 'CVPR',
        'iccv': 'ICCV',
        'nips': 'NIPS',
        'iclr': 'ICLR',
      };
      
      // 将期刊名称分词
      return venue.split(/\s+/)
        .map(word => {
          // 检查是否为特殊缩写
          const lowerWord = word.toLowerCase();
          if (acronyms[lowerWord]) {
            return acronyms[lowerWord];
          }
          
          // 否则首字母大写
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    },
    // 显示论文详情弹窗
    showPaperDetail(paper) {
      // 准备论文数据
      const paperData = {
        ...paper,
        title: paper.title,
        summary: paper.abstract,
        citations: paper.citation,
        year: paper.year,
        field: this.fieldInfo.name
      };
      
      // 通过事件总线触发弹窗显示
      this.$bus.$emit('showPaperModal', { paper: paperData, show: true });
    },
    // 导航到作者页面
    navToAuthor(author) {
      this.$router.push({ 
        name: 'personalPage', 
        query: { authorId: author.auto_id } 
      });
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
    },
    async fetchFieldData() {
      this.loading = true;
      try {
        // 从路由参数中获取编码后的字段名称，并解码
        const encodedFieldName = this.$route.params.field_name;
        const fieldName = decodeURIComponent(encodedFieldName);
        
        console.log('Fetching field data for:', fieldName);
        
        // 获取API响应
        const response = await getFieldInfo(fieldName);
        console.log('API Response received');
        
        // 尝试两种可能的数据结构访问方式
        let results;
        
        // 情况1: 响应是直接从axios返回的
        if (response && response.data && response.data.results) {
          console.log('方式1: response.data.results 存在');
          results = response.data.results;
        } 
        // 情况2: 响应已经被request_temp的拦截器处理
        else if (response && response.results) {
          console.log('方式2: response.results 存在');
          results = response.results;
        }
        // 找不到有效的results
        else {
          console.error('无法找到有效的results数据结构');
          console.log('Response:', response);
          throw new Error('API返回数据格式不正确');
        }
        
        // 打印找到的数据结构
        console.log('找到的API结构包含:', Object.keys(results));
        
        // 检查字段并设置组件数据
        if (!results.field_info) {
          console.error('API返回数据中缺少field_info');
          throw new Error('API返回数据缺少field_info');
        }
        
        // 设置数据
        this.fieldInfo = results.field_info;
        this.fieldIntro = results.field_intro || '';
        this.relatedPapers = Array.isArray(results.related_papers) ? results.related_papers : [];
        this.relatedAuthors = Array.isArray(results.related_authors) ? results.related_authors : [];
        
        console.log('数据解析完成:');
        console.log('- 领域: ' + this.fieldInfo.name);
        console.log('- 简介: ' + (this.fieldIntro ? '已加载' : '未提供'));
        console.log('- 相关论文: ' + this.relatedPapers.length + '篇');
        console.log('- 相关学者: ' + this.relatedAuthors.length + '人');
      } catch (error) {
        console.error('获取领域信息失败:', error);
        this.$message.error(error.message || '获取领域信息失败，请稍后重试');
        this.fieldInfo = {};
        this.relatedPapers = [];
        this.relatedAuthors = [];
      } finally {
        this.loading = false;
      }
    }
  },
  async created() {
    await this.fetchFieldData();
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

  .field-intro {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

    .intro-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      i {
        font-size: 24px;
        color: #3498db;
        margin-right: 10px;
      }

      h2 {
        font-size: 20px;
        color: #2c3e50;
        margin: 0;
      }
    }

    .intro-content {
      color: #34495e;
      font-size: 15px;
      line-height: 1.8;
      text-align: justify;
      white-space: pre-line;
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
      cursor: pointer;

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
      cursor: pointer;

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
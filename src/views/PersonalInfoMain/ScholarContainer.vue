<template>
  <div class="scholar-container">
    <!-- 标签（Tab）部分 -->
    <div class="tabs">
      <button :class="{ active: currentTab === 'all' }" @click="changeTab('all')">
        所有论文
      </button>
      <button :class="{ active: currentTab === 'recent' }" @click="changeTab('recent')">
        近五年
      </button>
      <button :class="{ active: currentTab === 'high-citation' }" @click="changeTab('high-citation')">
        高引用
      </button>
      <!-- 可根据需要添加更多标签 -->
    </div>

    <!-- 排序按钮部分 -->
    <div class="sorting">
      <label>排序方式：</label>
      <select v-model="sortOrder" @change="sortPapers">
        <option value="date-desc">发表年份（降序）</option>
        <option value="date-asc">发表年份（升序）</option>
        <option value="citation-desc">引用量（降序）</option>
        <option value="citation-asc">引用量（升序）</option>
      </select>
    </div>

    <!-- 表头部分 -->
    <div class="table-header">
      <div class="header-item title">标题</div>
      <div class="header-item authors">作者</div>
      <div class="header-item journal">期刊</div>
      <div class="header-item year">年份</div>
      <div class="header-item citations">引用量</div>
    </div>

    <!-- 论文列表部分 -->
    <PaperList :papers="paginatedPapers" />

    <!-- 分页控制部分 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
    </div>
  </div>
</template>

<script>
import PaperList from './PaperList.vue';

export default {
  name: 'ScholarContainer',
  components: {
    PaperList,
  },
  data() {
    return {
      papers: [], // 原始论文数据
      currentTab: 'all', // 当前选中的标签
      sortOrder: 'date-desc', // 当前排序方式
      currentPage: 1, // 当前页码
      papersPerPage: 10, // 每页显示的论文数量
    };
  },
  computed: {
    filteredPapers() {
      let filtered = this.papers;

      // 根据当前标签筛选论文
      if (this.currentTab === 'recent') {
        const fiveYearsAgo = new Date().getFullYear() - 5;
        filtered = filtered.filter(
          (paper) => parseInt(paper.year) >= fiveYearsAgo
        );
      } else if (this.currentTab === 'high-citation') {
        filtered = filtered.filter((paper) => paper.citations >= 100);
      }

      return filtered;
    },
    sortedPapers() {
      const sorted = [...this.filteredPapers];
      switch (this.sortOrder) {
        case 'date-desc':
          sorted.sort((a, b) => b.year - a.year);
          break;
        case 'date-asc':
          sorted.sort((a, b) => a.year - b.year);
          break;
        case 'citation-desc':
          sorted.sort((a, b) => b.citations - a.citations);
          break;
        case 'citation-asc':
          sorted.sort((a, b) => a.citations - b.citations);
          break;
        default:
          break;
      }
      return sorted;
    },
    totalPages() {
      return Math.ceil(this.sortedPapers.length / this.papersPerPage);
    },
    paginatedPapers() {
      const start = (this.currentPage - 1) * this.papersPerPage;
      const end = start + this.papersPerPage;
      return this.sortedPapers.slice(start, end);
    },
  },
  methods: {
    changeTab(tab) {
      this.currentTab = tab;
      this.currentPage = 1; // 重置到第一页
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    fetchPapers() {
      // 模拟数据获取，可以替换为实际的 API 调用
      this.papers = [
        {
          title: '深度学习在图像识别中的应用',
          authors: ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九'],
          journal: '计算机视觉杂志',
          year: 2023,
          citations: 150,
          abstract:
            '本文探讨了深度学习在图像识别中的各种应用，分析了不同模型的优缺点，并提出了改进方案。',
          pdfLink: 'http://example.com/paper1.pdf',
        },
        {
          title: '自然语言处理的最新进展',
          authors: ['李雷', '韩梅梅'],
          journal: '自然语言处理期刊',
          year: 2022,
          citations: 80,
          abstract:
            '本文总结了自然语言处理领域的最新研究进展，涵盖了语义理解、机器翻译和对话系统等方面。',
          pdfLink: 'http://example.com/paper2.pdf',
        },
        // 更多论文数据...
      ];
    },
  },
  mounted() {
    this.fetchPapers();
  },
};
</script>

<style lang="scss">
.scholar-container {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .tabs {
    display: flex;
    margin-bottom: 20px;

    button {
      padding: 10px 20px;
      margin-right: 10px;
      border: none;
      background-color: #f0f0f0;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s;

      &.active {
        background-color: #007bff;
        color: #fff;
      }

      &:hover {
        background-color: #dcdcdc;
      }
    }
  }

  .sorting {
    margin-bottom: 20px;

    label {
      margin-right: 10px;
      font-weight: bold;
    }

    select {
      padding: 5px 10px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  }

  .table-header {
    display: flex;
    background-color: #f8f8f8;
    padding: 10px 0;
    border-bottom: 2px solid #e0e0e0;

    .header-item {
      flex: 1;
      font-weight: bold;
      text-align: left;
      padding-left: 20px;
    }

    .header-item.title {
      flex: 2;
    }

    .header-item.authors {
      flex: 2;
      /* 修改为与数据行一致 */
    }

    .header-item.journal,
    .header-item.year,
    .header-item.citations {
      flex: 1;
      text-align: center;
      /* 统一对齐方式 */
      padding-right: 20px;
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

    button {
      padding: 5px 10px;
      margin: 0 10px;
      border: none;
      background-color: #007bff;
      color: #fff;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background-color: #0056b3;
      }
    }

    span {
      font-weight: bold;
    }
  }
}

/* 响应式设计（可选） */
@media (max-width: 768px) {
  .scholar-container {
    width: 100%;
    padding: 10px;

    .table-header {
      flex-direction: column;

      .header-item {
        padding-left: 10px;
        text-align: left;
      }
    }

    .pagination {
      flex-direction: column;

      button {
        margin: 5px 0;
      }
    }
  }
}
</style>
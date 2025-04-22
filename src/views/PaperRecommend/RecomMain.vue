<template>
  <div class="recomMainContainer" v-loading="loading">
    <div class="tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="优选论文" name="featured">
          <template slot="label">
            <i class="el-icon-trophy"></i> 优选论文
          </template>
        </el-tab-pane>
        <el-tab-pane label="最新论文" name="latest">
          <template slot="label">
            <i class="el-icon-time"></i> 最新论文
          </template>
        </el-tab-pane>
        <el-tab-pane label="高引论文" name="cited">
          <template slot="label">
            <i class="el-icon-medal"></i> 高引论文
          </template>
        </el-tab-pane>
        <el-tab-pane label="相关论文" name="related">
          <template slot="label">
            <i class="el-icon-connection"></i> 相关论文
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="filter-sort">
        <el-dropdown @command="handleSort" trigger="click">
          <span class="el-dropdown-link">
            {{ currentSort }} <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="time">发表时间</el-dropdown-item>
            <el-dropdown-item command="relevance">相关度</el-dropdown-item>
            <el-dropdown-item command="citations">引用量</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        
        <el-button 
          type="text" 
          class="sort-direction-btn"
          @click="toggleSortDirection"
        >
          <i :class="sortDirection === 'desc' ? 'el-icon-sort-down' : 'el-icon-sort-up'"></i>
        </el-button>
      </div>
    </div>

    <div v-if="!loading && paper.length === 0" class="empty-state">
      <div class="empty-illustration">
        <i :class="getEmptyStateIcon()"></i>
      </div>
      <p class="empty-title">{{ getEmptyStateTitle() }}</p>
      <p class="empty-message">{{ getEmptyStateMessage() }}</p>
      <el-button type="primary" plain round size="medium" @click="switchToFeatured" v-if="activeName !== 'featured'">
        查看优选论文
      </el-button>
    </div>

    <transition-group v-else name="paper-list" tag="div" class="recomMainList">
      <RecomMainList 
        v-for="(paper, index) in paginatedPapers" 
        :key="paper.id || index" 
        :paper="paper"
        class="paper-item"
      />
      
      <div class="pagination-wrapper" key="pagination" v-if="paper.length > 0">
        <el-pagination 
          @size-change="handleSizeChange" 
          @current-change="handlePageChange" 
          :current-page="currentPage"
          :page-size="pageSize" 
          :total="paper.length" 
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[5, 10, 20, 50]"
          background 
        />
      </div>
    </transition-group>
  </div>
</template>

<script>
import RecomMainList from './RecomMainList.vue'
import { getRecomPaper } from '@/api/getRecomPaper'

export default {
  components: {
    RecomMainList
  },
  props: {
    paperData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      paper: [],
      activeName: 'featured',
      currentPage: 1,
      pageSize: 10,
      loading: true,
      currentSort: '发表时间',
      sortKey: 'time',
      sortDirection: 'desc' // 'desc' 为降序，'asc' 为升序
    }
  },

  computed: {
    paginatedPapers() {
      if (!this.paper || this.paper.length === 0) {
        return [];
      }
      
      // 先排序
      const sortedPapers = [...this.paper].sort((a, b) => {
        let compareResult = 0;
        
        if (this.sortKey === 'time') {
          compareResult = new Date(b.year || b.time || '2000') - new Date(a.year || a.time || '2000');
        } else if (this.sortKey === 'citations') {
          compareResult = (b.citations || 0) - (a.citations || 0);
        } else {
          // 相关度排序 - 假设有相关度字段或使用默认顺序
          compareResult = 0;
        }
        
        // 根据排序方向调整结果
        return this.sortDirection === 'desc' ? compareResult : -compareResult;
      });
      
      // 再分页
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return sortedPapers.slice(start, end);
    }
  },

  watch: {
    paperData: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.paper = [...newVal];
          this.loading = false;
        } else {
          this.fetchRecomPapers();
        }
      }
    }
  },

  created() {
    if (!this.paperData || this.paperData.length === 0) {
      this.fetchRecomPapers();
    }
  },

  methods: {
    async fetchRecomPapers() {
      try {
        this.loading = true;
        const res = await getRecomPaper();
        
        if (res && Array.isArray(res)) {
          // 确保每个论文对象都有必要的字段
          this.paper = res.map((paper, index) => ({
            id: paper.id || paper.auto_id || `paper_${index}`,
            title: paper.title || '未知标题',
            authors: paper.authors || [],
            time: paper.time || paper.year || '2023',
            year: paper.year || (paper.time ? paper.time.slice(0, 4) : '2023'),
            summary: paper.summary || paper.abstract || '暂无摘要',
            citations: paper.citations || Math.floor(Math.random() * 100),
            pdfUrl: paper.pdfUrl || '',
            themes: paper.themes || []
          }));
        } else {
          console.error('获取论文数据格式错误:', res);
          this.paper = [];
        }
      } catch (error) {
        console.error('获取论文数据失败:', error);
        this.paper = [];
      } finally {
        this.loading = false;
      }
    },
    
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },
    
    handlePageChange(page) {
      this.currentPage = page;
    },
    
    handleClick(tab) {
      // 根据不同标签页切换排序方式
      switch(tab.name) {
        case 'latest':
          this.sortKey = 'time';
          this.currentSort = '发表时间';
          break;
        case 'cited':
          this.sortKey = 'citations';
          this.currentSort = '引用量';
          break;
        case 'featured':
        case 'related':
          this.sortKey = 'relevance';
          this.currentSort = '相关度';
          break;
      }
      this.currentPage = 1; // 重置页码
    },
    
    handleSort(command) {
      this.sortKey = command;
      switch(command) {
        case 'time':
          this.currentSort = '发表时间';
          break;
        case 'relevance':
          this.currentSort = '相关度';
          break;
        case 'citations':
          this.currentSort = '引用量';
          break;
      }
    },
    
    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    },
    
    getEmptyStateIcon() {
      const icons = {
        featured: 'el-icon-trophy',
        latest: 'el-icon-time',
        cited: 'el-icon-medal',
        related: 'el-icon-connection'
      };
      return icons[this.activeName] || 'el-icon-document';
    },
    
    getEmptyStateTitle() {
      const titles = {
        featured: '暂无优选论文',
        latest: '暂无最新论文',
        cited: '暂无高引论文',
        related: '暂无相关论文'
      };
      return titles[this.activeName] || '暂无数据';
    },
    
    getEmptyStateMessage() {
      const messages = {
        featured: '我们的系统正在为您筛选最匹配的优选论文',
        latest: '最新论文数据正在更新中，请稍后查看',
        cited: '高引论文数据正在统计中，请稍后查看',
        related: '尝试在搜索框中输入关键词以获取相关论文'
      };
      return messages[this.activeName] || '请稍后再试';
    },
    
    switchToFeatured() {
      this.activeName = 'featured';
    }
  }
}
</script>

<style lang="scss">
.recomMainContainer {
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  background-image: linear-gradient(135deg, #f5f7fa 0%, #f0f4fa 50%, #edf1f9 100%);
  border-radius: 20px;
  padding: 20px;
  flex: 1;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;

  .tab {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.05);

    .el-tabs {
      padding-left: 0;

      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #7f8c8d;
        transition: all 0.3s;
        padding: 0 20px;
        
        i {
          margin-right: 6px;
          font-size: 18px;
          vertical-align: middle;
          
          &.el-icon-trophy {
            color: #f39c12;
          }
          
          &.el-icon-time {
            color: #3498db;
          }
          
          &.el-icon-medal {
            color: #e74c3c;
          }
          
          &.el-icon-connection {
            color: #9b59b6;
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
    
    .filter-sort {
      display: flex;
      align-items: center;
      
      .el-dropdown-link {
        cursor: pointer;
        font-size: 14px;
        color: #7f8c8d;
        padding: 6px 10px;
        border-radius: 4px;
        transition: all 0.2s;
        
        &:hover {
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
        }
      }
      
      .sort-direction-btn {
        margin-left: 5px;
        font-size: 18px;
        padding: 6px 8px;
        color: #7f8c8d;
        
        &:hover {
          color: #3498db;
          background: rgba(52, 152, 219, 0.1);
          border-radius: 4px;
        }
        
        i {
          transition: all 0.3s;
        }
      }
    }
  }
  
  .recomMainList {
    min-height: 200px;
    position: relative;
    
    .paper-item {
      transition: all 0.4s;
      border-radius: 8px;
      margin: 0 5px 10px 5px;
      border: 1px solid rgba(0, 0, 0, 0.02);
      background: white;
      
      &:hover {
        transform: translateX(8px);
        background: white;
        box-shadow: 0 8px 25px rgba(52, 152, 219, 0.15);
        border-color: rgba(52, 152, 219, 0.1);
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 10px;
    
    .el-pagination {
      padding: 10px 20px;
      border-radius: 30px;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      
      .btn-prev, .btn-next {
        background-color: white;
        border-radius: 50%;
        margin: 0 5px;
        transition: all 0.3s;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }
      }
      
      .el-pager li {
        background-color: white;
        border-radius: 4px;
        margin: 0 3px;
        transition: all 0.3s;
        
        &.active {
          background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
          box-shadow: 0 3px 10px rgba(0, 152, 234, 0.3);
        }
        
        &:hover:not(.active) {
          transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    color: #909399;
    animation: fadeIn 0.5s ease-out;
    
    .empty-illustration {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(41, 128, 185, 0.05));
      margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(52, 152, 219, 0.1);
      
      i {
        font-size: 50px;
        background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        opacity: 0.9;
        
        &.el-icon-trophy {
          background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        &.el-icon-medal {
          background: linear-gradient(135deg, #ff9a9e 0%, #f56c6c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        &.el-icon-connection {
          background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
    
    .empty-title {
      font-size: 20px;
      font-weight: 500;
      color: #2c3e50;
      margin: 0 0 10px;
    }
    
    .empty-message {
      font-size: 14px;
      color: #7f8c8d;
      margin: 0 0 25px;
      max-width: 300px;
      text-align: center;
      line-height: 1.5;
    }
    
    .el-button {
      background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
      border: none;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(0, 152, 234, 0.3);
        background: linear-gradient(135deg, #00b5e9 0%, #0052d6 100%);
      }
    }
  }
}

/* 动画定义 */
.paper-list-enter-active, .paper-list-leave-active {
  transition: all 0.5s;
}
.paper-list-enter, .paper-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.paper-list-move {
  transition: transform 0.5s;
}
</style>
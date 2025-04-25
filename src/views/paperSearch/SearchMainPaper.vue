<template>
  <div class="searchMainPaperContainer" v-loading="loading">
    <!-- 1. Tab 切换 -->
    <div class="tab">
      <el-tabs v-model="activeSort" @tab-click="handleTabClick">
        <el-tab-pane name="recommend">
          <template #label>
            <i class="el-icon-s-home"></i> 综合
          </template>
        </el-tab-pane>
        <el-tab-pane name="citation">
          <template #label>
            <i class="el-icon-s-promotion"></i> 引用量
          </template>
        </el-tab-pane>
        <el-tab-pane name="year">
          <template #label>
            <i class="el-icon-date"></i> 年份
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-button type="text" class="sort-direction-btn" @click="toggleSortDirection">
        <i :class="sortDirection === 'desc' ? 'el-icon-sort-down' : 'el-icon-sort-up'"></i>
      </el-button>
    </div>

    <!-- 2. 统计信息模块 -->
    <div class="stats">
      <div class="stat-item">
        <strong>相关论文数：</strong>{{ totalPaperCount }}
      </div>
      <div class="stat-item">
        <strong>年份：</strong>
        <el-tag v-for="(count, year) in yearDistribution" :key="year" class="stat-tag"
          :type="isYearSelected(year) ? 'primary' : 'warning'" @click="handleYearFilter(year)">
          {{ year }}: {{ count }}
        </el-tag>
      </div>
      <div class="stat-item">
        <strong>期刊：</strong>
        <el-tag v-for="(count, venue) in venueDistribution" :key="venue" class="stat-tag"
          :type="isVenueSelected(venue) ? 'primary' : 'success'" @click="handleVenueFilter(venue)">
          {{ formatVenue(venue) }}: {{ count }}
        </el-tag>
      </div>
      <div class="stat-item" v-if="filterYear || filterVenue">
        <el-button type="primary" plain @click="resetFilter">
          重置筛选
        </el-button>
      </div>
    </div>

    <!-- 3. 主体内容：列表 + 翻页 -->
    <div class="content-list">
      <SearchMainPaperList v-for="(paper, index) in paginatedPapers" :key="`${paper.id}-${index}`" :paper="paper"
        class="paper-item" />
    </div>
    <div class="pagination-wrap" v-if="sortedPapers.length">
      <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="currentPage"
        :page-size="pageSize" :total="sortedPapers.length" layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 10, 20, 50]" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SearchMainPaperList from './SearchMainPaperList.vue';
import formatMixin from '@/mixins/formatMixin.js';

export default {
  name: 'SearchMainPaper',
  components: { SearchMainPaperList },
  mixins: [formatMixin],

  data() {
    return {
      loading: false,
      activeSort: 'recommend',
      sortDirection: 'desc',
      currentPage: 1,
      pageSize: 10,
      filterYear: null,
      filterVenue: null
    };
  },

  computed: {
    ...mapState('paper', { papers: 'paper' }),

    filteredPapers() {
      let result = Array.isArray(this.papers) ? [...this.papers] : [];
      if (this.filterYear) {
        result = this.filterYear === '未知'
          ? result.filter(p => !p.year)
          : result.filter(p => p.year === this.filterYear);
      }
      if (this.filterVenue) {
        result = this.filterVenue === '未知期刊'
          ? result.filter(p => !p.venue)
          : result.filter(p => p.venue === this.filterVenue);
      }
      return result;
    },

    sortedPapers() {
      const sorted = [...this.filteredPapers];
      if (this.activeSort === 'year') {
        sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
      } else if (this.activeSort === 'citation') {
        sorted.sort((a, b) => (b.ncitation || 0) - (a.ncitation || 0));
      }
      return this.sortDirection === 'asc' ? sorted.reverse() : sorted;
    },

    paginatedPapers() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.sortedPapers.slice(start, start + this.pageSize);
    },

    totalPaperCount() {
      return Array.isArray(this.papers) ? this.papers.length : 0;
    },

    yearDistribution() {
      const dist = {};
      (this.papers || []).forEach(p => {
        const y = p.year || '未知';
        dist[y] = (dist[y] || 0) + 1;
      });
      return dist;
    },

    venueDistribution() {
      const dist = {};
      (this.papers || []).forEach(p => {
        const v = p.venue || '未知期刊';
        dist[v] = (dist[v] || 0) + 1;
      });
      return dist;
    }
  },

  methods: {
    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
      this.currentPage = 1;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    handleTabClick(tab) {
      this.activeSort = tab.name;
      this.currentPage = 1;
    },
    isYearSelected(year) {
      return this.filterYear === (year === '未知' ? '未知' : Number(year));
    },
    handleYearFilter(year) {
      this.filterYear = this.filterYear === year ? null : year;
      this.currentPage = 1;
    },
    isVenueSelected(venue) {
      return this.filterVenue === venue;
    },
    handleVenueFilter(venue) {
      this.filterVenue = this.filterVenue === venue ? null : venue;
      this.currentPage = 1;
    },
    resetFilter() {
      this.filterYear = null;
      this.filterVenue = null;
      this.currentPage = 1;
    }
  }
};
</script>

<style lang="scss">
.searchMainPaperContainer {
  padding: 20px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);

  .tab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.05);

    .el-tabs {
      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #7f8c8d;
        transition: color 0.3s;

        &.is-active {
          font-weight: bold;
          color: #3498db;
        }
      }

      .el-tabs__active-bar {
        background: linear-gradient(90deg, #00c6fb, #005bea);
        height: 3px;
      }
    }

    .sort-direction-btn {
      font-size: 18px;
      color: #7f8c8d;

      &:hover {
        color: #3498db;
      }
    }
  }

  .stats {
    padding: 15px;
    border-bottom: 1px solid #ddd;

    .stat-item {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 10px;

      strong {
        margin-right: 8px;
        color: #2c3e50;
      }

      .stat-tag {
        margin-right: 6px;
        margin-bottom: 6px;
        cursor: pointer;
        flex: 0 0 auto;
      }
    }
  }

  .content-list {
    display: flex;
    flex-direction: column;

    .paper-item {
      width: 100%;
      margin-bottom: 10px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.02);
      background: #fff;
      transition: all 0.4s;

      &:hover {
        transform: translateX(8px);
        background: #fff;
        box-shadow: 0 8px 25px rgba(52, 152, 219, 0.15);
        border-color: rgba(52, 152, 219, 0.1);
      }
    }
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
  }

  .el-pagination {
    display: inline-flex !important;
    justify-content: center;
    margin: 20px 0 10px;
    padding: 10px 20px;
    border-radius: 30px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

    .btn-prev,
    .btn-next {
      background: #fff;
      border-radius: 50%;
      margin: 0 5px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .el-pager li {
      background: #fff;
      border-radius: 4px;
      margin: 0 3px;
      transition: all 0.3s;

      &.active {
        background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
        box-shadow: 0 3px 10px rgba(0, 152, 234, 0.3);
        color: #fff;
      }

      &:hover:not(.active) {
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>

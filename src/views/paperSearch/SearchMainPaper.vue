<template>
  <div class="searchMainPaperContainer">
    <!-- 1. Tab 切换 -->
    <div class="searchMainTab">
      <el-tabs v-model="activeSort" @tab-click="handleTabClick">
        <el-tab-pane label="综合" name="recommend" />
        <el-tab-pane label="引用量" name="citation" />
        <el-tab-pane label="年份" name="year" />
      </el-tabs>
    </div>

    <!-- 2. 统计信息模块（点击标签筛选） -->
    <div class="paperStatsContainer">
      <!-- 总论文数（基于 paper 原始数据统计） -->
      <div class="statItem" style="margin-bottom: 20px;">
        <strong>相关论文数：</strong>{{ totalPaperCount }}
      </div>

      <!-- 各年份论文数 -->
      <div class="statItem">
        <strong>年份： </strong>
        <el-tag v-for="(count, year) in yearDistribution" :key="year" class="statTag"
          :type="isYearSelected(year) ? 'primary' : 'warning'" @click="handleYearFilter(year)">
          {{ year }} 年: {{ count }}
        </el-tag>
      </div>

      <!-- 各期刊论文数 -->
      <div class="statItem">
        <strong>期刊： </strong>
        <el-tag v-for="(count, venue) in venueDistribution" :key="venue" class="statTag"
          :type="isVenueSelected(venue) ? 'primary' : 'success'" @click="handleVenueFilter(venue)">
          {{ formatVenue(venue) }}: {{ count }}
        </el-tag>
      </div>

      <!-- 重置筛选
      <div class="statItem">
        <el-button type="primary" plain @click="resetFilter">重置筛选</el-button>
      </div> -->
    </div>

    <!-- 3. 主体内容：论文列表 + 分页 -->
    <div class="searchContent">
      <SearchMainPaperList v-for="paper in paginatedPapers" :key="paper.id" :paper="paper" />
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
  components: {
    SearchMainPaperList
  },
  mixins: [formatMixin],

  data() {
    return {
      activeSort: 'recommend',
      currentPage: 1,
      pageSize: 10,

      filterYear: '',
      filterVenue: null // 初始值设为 null，表示无筛选
    };
  },
  computed: {
    ...mapState('paper', ['paper']),

    /**
     * 1. 先对 paper 做筛选：
     *   - 若 filterYear 不为空，则只保留对应年份的论文
     *   - 若 filterVenue 不为空，则只保留对应期刊的论文
     */
    filteredPapers() {
      if (!Array.isArray(this.paper)) return [];
      let result = [...this.paper];

      console.log(result)
      // 按年份筛选
      if (this.filterYear) {
        if (this.filterYear === '未知') {
          result = result.filter(p => !p.year);
        } else {
          result = result.filter(p => p.year === this.filterYear);
        }
      }

      // 按期刊筛选
      if (this.filterVenue) {
        if (this.filterVenue === '未知期刊') { // 表示“未知期刊”
          result = result.filter(p => !p.venue);
        } else {
          result = result.filter(p => p.venue === this.filterVenue);
        }
      }

      return result;
    },

    /**
     * 2. 在筛选结果的基础上再做排序
     */
    sortedPapers() {
      let sorted = [...this.filteredPapers];

      // 根据 activeSort 不同，进行排序
      if (this.activeSort === 'recommend') {
        return sorted
      } else if (this.activeSort === 'year') {
        // 按年份降序
        sorted.sort((a, b) => {
          if (!a.year && !b.year) return 0;
          if (!a.year) return 1;
          if (!b.year) return -1;
          return b.year - a.year;
        });
      } else if (this.activeSort === 'citation') {
        // 按引用量降序
        sorted.sort((a, b) => b.ncitation - a.ncitation);
      }

      return sorted;
    },

    /**
     * 3. 分页
     */
    paginatedPapers() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.sortedPapers.slice(start, end);
    },

    // ============ 以下为统计相关(基于原始数据 paper) ============
    // (a) 总论文数
    totalPaperCount() {
      return Array.isArray(this.paper) ? this.paper.length : 0;
    },

    // (b) 按年份统计论文数
    yearDistribution() {
      const distribution = {};
      if (Array.isArray(this.paper)) {
        this.paper.forEach(p => {
          const y = p.year || '未知';
          distribution[y] = (distribution[y] || 0) + 1;
        });
      }
      return distribution;
    },

    // (c) 按期刊统计论文数
    venueDistribution() {
      const distribution = {};
      if (Array.isArray(this.paper)) {
        this.paper.forEach(p => {
          const v = p.venue || '未知期刊';
          distribution[v] = (distribution[v] || 0) + 1;
        });
      }
      return distribution;
    }
  },
  methods: {
    // 切换每页数量
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },
    // 切换页码
    handlePageChange(page) {
      this.currentPage = page;
    },
    // 切换 Tab
    handleTabClick(tab) {
      this.currentPage = 1;
      this.activeSort = tab.name;
    },

    /**
     * 判断年份标签是否被选中
     */
    isYearSelected(year) {
      if (year === '未知') {
        return this.filterYear === '未知';
      }
      return this.filterYear === Number(year);
    },

    /**
     * 判断期刊标签是否被选中
     */
    isVenueSelected(venue) {
      return this.filterVenue === venue;
    },

    /**
     * 当用户点击年份标签时
     * 如果点击的年份和当前筛选的年份相同，则表示取消筛选
     */
    handleYearFilter(year) {
      if (year === '未知') {
        if (this.filterYear === '未知') {
          this.filterYear = null; // 取消筛选
        } else {
          this.filterYear = '未知'; // 应用新的年份筛选
        }
      } else {
        const numericYear = Number(year);
        if (this.filterYear === numericYear) {
          this.filterYear = null; // 取消筛选
        } else {
          this.filterYear = numericYear; // 应用新的年份筛选
        }
      }
      this.currentPage = 1;
    },

    /**
     * 当用户点击期刊标签时
     * 如果点击的期刊和当前筛选的期刊相同，则表示取消筛选
     */
    handleVenueFilter(venue) {
      if (venue === '未知期刊') { // 表示“未知期刊”
        if (this.filterVenue === '未知期刊') {
          this.filterVenue = null; // 取消筛选
        } else {
          this.filterVenue = '未知期刊'; // 应用新的期刊筛选
        }
      } else {
        if (this.filterVenue === venue) {
          this.filterVenue = null; // 取消筛选
        } else {
          this.filterVenue = venue; // 应用新的期刊筛选
        }
      }
      this.currentPage = 1;
    },

    /**
     * 重置所有筛选
     */
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
  border-radius: 15px;
  margin: 0;
  justify-content: space-between;
  //box-shadow: 0 0 5px 0 #a8a8a8;
  background-image: linear-gradient(#dff3f9, #ffffff, #ffffff, #ffffff);
  flex: 4;

  /* Tab 区域 */
  .searchMainTab {
    width: 100%;
    height: 50px;
    align-content: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 2px solid #E4E7ED;

    .el-tabs {
      padding-left: 15px;

      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
      }
    }
  }

  .el-tag.el-tag--success {
    color: #348b4b #e49723
  }

  .el-tag.el-tag--warning {
    color: #e49723
  }

  /* 统计信息容器样式 */
  .paperStatsContainer {
    padding: 15px;
    border-bottom: 1px solid #ddd;

    h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
    }

    .statItem {
      margin-bottom: 10px;
    }

    .statTag {
      margin-right: 6px;
      margin-bottom: 6px;
      cursor: pointer;
      /* 鼠标移到标签上时显示手型，以表明可点击 */
      display: inline-block;
    }
  }

  /* 列表 + 分页 */
  .searchContent {
    margin-top: 10px;

    .el-pagination {
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
<template>
  <div class="searchMainConfContainer">
    <!-- 内容区域 -->
    <div class="confContent">
      <SearchMainConferenceList v-for="item in pagedConferences" :key="item.short_name" :conference="item" class="conf-item"
        @click="handleConferenceClick" />
      <div class="pagination-wrapper" v-if="conferenceList.length > 0">
        <el-pagination @size-change="handleConferenceSizeChange" @current-change="handleConferencePageChange"
          :current-page="currentPageConference" :page-size="pageSizeConference" :total="conferenceList.length"
          layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 20, 50]" />
      </div>
      <div v-if="conferenceList.length === 0" class="no-data">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import SearchMainConferenceList from './SearchMainConferenceList.vue'
import { mapState } from 'vuex'

export default {
  components: {
    SearchMainConferenceList
  },
  data() {
    return {
      currentPageConference: 1,
      pageSizeConference: 10
    }
  },
  computed: {
    ...mapState({
      venues: state => state.venue.venues
    }),
    conferenceList() {
      return this.venues.filter(venue => {
        // 检查必要字段是否存在且有效
        const hasValidName = venue.short_name && venue.short_name.trim() !== '';
        const hasValidFullName = venue.full_name && venue.full_name.trim() !== '';
        
        // 检查是否有任何有效的指标数据
        const hasValidMetrics = [
          venue.ccf_level,
          venue.h5_index,
          venue.h5_median,
          venue.median_citation_of_papers_in_recent_5_years,
          venue.year_founded
        ].some(value => value !== null && value !== undefined && value !== '');

        // 检查是否有任何有效的趋势数据
        const hasValidTrends = [
          venue.trending_of_contributions_in_recent_5_years,
          venue.the_trend_of_admission_rate_in_recent_five_years,
          venue.the_trend_of_publication_volume_in_recent_five_years
        ].some(array => Array.isArray(array) && array.length > 0);

        // 检查是否有任何有效的区域数据
        const hasValidRegion = venue.region && 
          typeof venue.region === 'object' && 
          Object.keys(venue.region).length > 0;

        // 必须同时满足名称有效且至少有一个其他有效数据
        return hasValidName && hasValidFullName && (hasValidMetrics || hasValidTrends || hasValidRegion);
      });
    },
    pagedConferences() {
      const start = (this.currentPageConference - 1) * this.pageSizeConference
      return this.conferenceList.slice(start, start + this.pageSizeConference)
    }
  },
  methods: {
    handleConferencePageChange(val) {
      this.currentPageConference = val
    },
    handleConferenceSizeChange(val) {
      this.pageSizeConference = val
      this.currentPageConference = 1
    },
    handleConferenceClick(conference) {
      this.$router.push({
        name: 'specificVenue',
        params: { id: conference.id }
      })
    }
  }
}
</script>

<style lang="scss">
.searchMainConfContainer {
  box-sizing: border-box;
  background: #fff;
  background-image: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 20px;
  position: relative;
  overflow: hidden;

  .confContent {
    min-height: 200px;
    position: relative;

    .conf-item {
      transition: all 0.4s;
      border-radius: 12px;
      margin: 0 5px 15px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      background: #fff;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

      &:hover {
        transform: translateX(8px);
        box-shadow: 0 8px 25px rgba(52, 152, 219, 0.15);
        border-color: rgba(52, 152, 219, 0.1);
      }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }

    .no-data {
      text-align: center;
      padding: 40px 0;
      color: #909399;
      font-size: 14px;
    }

    .el-pagination {
      display: inline-flex !important;
      justify-content: center;
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
}

/* 列表进出场动画 */
.conf-list-enter-active,
.conf-list-leave-active {
  transition: all 0.5s;
}

.conf-list-enter,
.conf-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.conf-list-move {
  transition: transform 0.5s;
}
</style>
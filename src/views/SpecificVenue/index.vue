<template>
  <div class="backPage" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 头部区域 -->
    <VenueHeader :venueInfo="venueInfo" />

    <!-- 第一个tabs -->
    <VenueFirstTab :venueInfo="venueInfo" />

    <!-- 主显示区 -->
    <div class="main">
      <!-- 主要数据展示区 -->
      <VenueMainArea :papers="papers" />

      <div class="sideArea">
        <VenueTopAuthors :authors="authors" />
        <VenueRecommendedReviewers :reviewers="recommendedReviewers" />
      </div>
    </div>
  </div>
</template>

<script>
import VenueHeader from './VenueHeader.vue'
import VenueFirstTab from './VenueFirstTab.vue'
import VenueMainArea from './VenueMainArea.vue'
import VenueTopAuthors from './VenueTopAuthors.vue'
import VenueRecommendedReviewers from './VenueRecommendedReviewers.vue'
import { getSpecificVenueData } from '@/api/getSpecificVenueData'

export default {
  components: {
    VenueHeader,
    VenueFirstTab,
    VenueMainArea,
    VenueTopAuthors,
    VenueRecommendedReviewers
  },
  data() {
    return {
      fullscreenLoading: false,
      venueName: this.$route.query.venueName,
      venueInfo: {},
      papers: [],
      authors: [],
      recommendedReviewers: {}
    }
  },
  created() {
    this.fetchVenueData()
  },
  methods: {
    async fetchVenueData() {
      try {
        this.fullscreenLoading = true
        const res = await getSpecificVenueData(this.venueName)
        console.log('获取到的会议数据:', res)
        
        if (res && res.results) {
          this.venueInfo = res.results.venue || {}
          this.papers = res.results.papers || []
          this.authors = res.results.authors || []
          this.recommendedReviewers = res.results.recommended_reviewers || {}
        }
      } catch (error) {
        console.error('获取会议数据失败:', error)
      } finally {
        this.fullscreenLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
.backPage {
  background: url(../../assets/bg_dingbu2.png) no-repeat top;
  padding-top: 29px;

  a {
    color: #333;
    text-decoration: none;
  }

  .main {
    display: flex;
    width: 1300px;
    margin: 0 auto 30px;
    box-sizing: border-box;

    .sideArea {
      flex: 1;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
  }

  li {
    list-style: none;
  }
}
</style>

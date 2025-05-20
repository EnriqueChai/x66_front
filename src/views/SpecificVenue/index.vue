<template>
  <div class="venue-page" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="animated-background"></div>
    <div class="content-wrapper" v-if="!fullscreenLoading">
      <!-- 头部区域 -->
      <div class="venue-header-container">
        <VenueHeader :venueInfo="venueInfo" />
      </div>

      <!-- 第一个tabs -->
      <div class="venue-tabs-container">
        <VenueFirstTab :venueInfo="venueInfo" />
      </div>

      <!-- 主显示区 -->
      <div class="venue-main-container">
        <!-- 主要数据展示区 -->
        <div class="main-content">
          <VenueMainArea :papers="papers" />
        </div>

        <div class="side-content">
          <div class="side-card authors-card">
            <VenueTopAuthors :authors="authors" />
          </div>
          <div class="side-card reviewers-card">
            <VenueRecommendedReviewers :reviewers="recommendedReviewers" />
          </div>
        </div>
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
  name: 'SpecificVenue',
  components: {
    VenueHeader,
    VenueFirstTab,
    VenueMainArea,
    VenueTopAuthors,
    VenueRecommendedReviewers
  },
  data() {
    return {
      fullscreenLoading: true,
      venueId: this.$route.params.id,
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
        const res = await getSpecificVenueData(this.venueId)
        console.log('获取到的会议数据:', res)

        if (res && res.results) {
          this.venueInfo = res.results.venue || {}
          this.papers = res.results.papers || []
          this.authors = res.results.authors || []
          this.recommendedReviewers = res.results.recommended_reviewers || {}
        }
      } catch (error) {
        console.error('获取会议数据失败:', error)
        this.$message.error('获取会议数据失败，请稍后重试')
      } finally {
        // 添加一个小延迟，确保DOM更新完成
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 100)
      }
    }
  },
  watch: {
    '$route.params.id': {
      handler: 'fetchVenueData',
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.venue-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;

  .animated-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
    z-index: -1;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 400px;
      background: url(../../assets/bg_dingbu.png) no-repeat center top;
      background-size: cover;
      z-index: -1;
      opacity: 0.8;
      animation: slowFloat 15s infinite alternate ease-in-out;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%);
      z-index: 0;
      animation: pulse 15s infinite alternate;
    }
  }

  .content-wrapper {
    position: relative;
    z-index: 1;
    padding: 30px;
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
    overflow-y: auto;
  }

  .venue-header-container {
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    animation: slideDown 0.8s ease-out;
  }

  .venue-tabs-container {
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    animation: slideUp 0.8s ease-out;
  }

  .venue-main-container {
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    display: flex;
    gap: 24px;
    flex: 1;
    animation: fadeIn 1s ease-in;

    .main-content {
      flex: 3;
      min-width: 0;
      transform: translateY(0);
      transition: all 0.5s ease;

      &:hover {
        transform: translateY(-5px);
      }
    }

    .side-content {
      flex: 1;
      min-width: 320px;
      max-width: 380px;
      display: flex;
      flex-direction: column;
      gap: 24px;

      .side-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.7);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.5s ease;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.07);
        }

        &.authors-card {
          animation-delay: 0.1s;
        }

        &.reviewers-card {
          animation-delay: 0.3s;
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }

  100% {
    opacity: 0.3;
    transform: scale(1);
  }
}

@keyframes slowFloat {
  0% {
    transform: translateY(0) scale(1);
  }

  100% {
    transform: translateY(-20px) scale(1.03);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

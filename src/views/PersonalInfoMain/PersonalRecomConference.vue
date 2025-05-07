<template>
  <div class="forthSide">
    <h3>推荐会议</h3>
    <div class="conferenceList" v-loading="loading">
      <div v-for="(conf, index) in conferences" :key="index" class="conferenceItem">
        {{ conf }}
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommendVenue } from '@/api/authorInfo'

export default {
  data() {
    return {
      loading: false,
      // conferences: ['NeurIPS', 'ICML', 'CVPR', 'ACL', 'KDD', 'AAAI', 'EMNLP', 'NeurIPS',
      //   'ICML', 'CVPR', 'ACL', 'KDD', 'AAAI', 'EMNLP']
      conferences: []
    }
  },
  created() {
    this.fetchConferences();
  },
  methods: {
    async fetchConferences() {
      this.loading = true;
      try {
        const res = await getRecommendVenue();
        this.conferences = res.data || [];
        console.log(res)
      } catch (error) {
        console.error('获取推荐会议失败', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.forthSide {
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  height: 450px;

  h3 {
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 15px 0;
    color: #2c3e50;
    background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .conferenceList {
    max-height: 380px;
    overflow-y: auto;
    padding-right: 5px;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .conferenceItem {
      background-color: #f5f7fa;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 10px;
      font-size: 15px;
      color: #333;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background-color: #e0ebff;
        color: #1a73e8;
      }
    }
  }
}
</style>
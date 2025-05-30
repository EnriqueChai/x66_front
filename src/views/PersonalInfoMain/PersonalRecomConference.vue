<template>
  <div class="forthSide">
    <h3>关键技术来源</h3>
    <div class="conferenceList" v-loading="loading">
      <div v-for="(conf, index) in sortedConferences" :key="conf.id || index" class="conferenceItem"
        @click="handleConferenceClick(conf)">
        <div :style="getImportanceColorStyle(conf.h_index)" class="importance-bar"></div>
        <div class="conference-content">
          <div class="conference-name">{{ formatVenue(conf.name) }}</div>
          <div v-if="conf.h_index !== undefined && conf.h_index !== null" class="conference-importance">
            H指数: <span class="h-index-value">{{ conf.h_index }}</span>
          </div>
        </div>
      </div>
      <div v-if="!loading && conferences.length === 0" class="no-data">
        暂无技术来源
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommendVenue } from '@/api/authorInfo'
import { getSpecificVenueData } from '@/api/getSpecificVenueData'

export default {
  data() {
    return {
      loading: false,
      conferences: []
    }
  },
  props: {
    authorId: {
      type: String,
      required: true
    }
  },
  computed: {
    sortedConferences() {
      if (!Array.isArray(this.conferences)) return [];
      return [...this.conferences].sort((a, b) => {
        const hIndexA = a.h_index || 0;
        const hIndexB = b.h_index || 0;
        return hIndexB - hIndexA;
      });
    }
  },
  created() {
    this.fetchConferences();
  },
  methods: {
    formatVenue(venue) {
      if (!venue) return '未知会议';

      let formatted = venue.toLowerCase();

      let words = formatted.split(' ');

      words = words.map((word, index) => {
        if (['acm', 'ieee', 'sig', 'ccf', 'nips', 'icml', 'iclr', 'cvpr', 'iccv', 'eccv', 'acl', 'emnlp', 'naacl', 'coling', 'www', 'kdd', 'icde', 'sigmod', 'vldb', 'pods', 'sosp', 'osdi', 'nsdi', 'sigcomm', 'infocom', 'mobicom', 'mobisys', 'sensys', 'rtss', 'rtas', 'emsoft', 'lctes', 'asplos', 'micro', 'hpca', 'isca', 'dac', 'date', 'iccad', 'isscc', 'vlsi', 'dac', 'date', 'iccad', 'isscc', 'vlsi'].includes(word)) {
          return word.toUpperCase();
        }

        if (word.includes('-')) {
          return word.split('-').map(part => {
            if (['acm', 'ieee', 'sig', 'ccf'].includes(part)) {
              return part.toUpperCase();
            }
            return part.charAt(0).toUpperCase() + part.slice(1);
          }).join('-');
        }

        if (index === 0) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }

        const articles = ['a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'and', 'or', 'but'];
        if (articles.includes(word)) {
          return word;
        }

        return word.charAt(0).toUpperCase() + word.slice(1);
      });

      return words.join(' ');
    },
    async fetchConferences() {
      this.loading = true;
      try {
        const res = await getRecommendVenue(this.authorId);
        this.conferences = res.recommended_venues || [];
        console.log('推荐会议数据:', res);
      } catch (error) {
        console.error('获取推荐会议失败', error);
        this.$message.error('获取推荐会议失败，请稍后重试');
        this.conferences = [];
      } finally {
        this.loading = false;
      }
    },
    handleConferenceClick(conference) {
      if (!conference.id) {
        this.$message.warning('该会议暂无详细信息');
        return;
      }
      this.$router.push({
        name: 'specificVenue',
        params: { id: conference.id },
        query: {
          name: conference.name,
          type: 'conference'
        }
      });
    },
    getImportanceColorStyle(hIndex) {
      const index = hIndex || 0;
      let background = '';

      if (index >= 100) {
        background = 'linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)';
      } else if (index >= 20) {
        background = 'linear-gradient(180deg, #ffb000 0%, #ff8c00 100%)';
      } else {
        background = 'linear-gradient(180deg, #3498db 0%, #2980b9 100%)';
      }

      return { background };
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
      padding: 12px 15px;
      padding-left: 0;
      margin-bottom: 10px;
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: stretch;

      &:hover {
        background-color: #e0ebff;
        transform: translateX(5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .importance-bar {
        width: 8px;
        min-height: 30px;
        border-radius: 8px 0 0 8px;
        flex-shrink: 0;
      }

      .conference-content {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 15px;
        margin-left: 10px;
      }

      .conference-name {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        flex-grow: 1;
        margin-right: 10px;
      }

      .conference-importance {
        font-size: 13px;
        color: #666;
        flex-shrink: 0;
      }

      .h-index-value {
        font-weight: bold;
        color: #3498db;
        font-size: 14px;
      }
    }
    .no-data {
      text-align: center;
      padding: 40px 0;
      color: #909399;
      font-size: 14px;
    }
  }
}
</style>
<template>
  <div class="searchMainConfContainer">
    <!-- 选项卡区域 -->
    <div class="searchMainConfTab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="期刊" name="first" />
        <el-tab-pane label="会议" name="second" />
      </el-tabs>
    </div>

    <!-- 内容区域 -->
    <div class="confContent">
      <!-- 期刊列表 -->
      <div v-if="activeName === 'first'">
        <SearchMainJournalList v-for="item in pagedJournals" :key="item.id" :journal="item" class="conf-item" />
        <div class="pagination-wrapper" v-if="journalList.length > 0">
          <el-pagination @size-change="handleJournalSizeChange" @current-change="handleJournalPageChange"
            :current-page="currentPageJournal" :page-size="pageSizeJournal" :total="journalList.length"
            layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 20, 50]" />
        </div>
      </div>

      <!-- 会议列表 -->
      <div v-else>
        <SearchMainConferenceList v-for="item in pagedConferences" :key="item.id" :conference="item"
          class="conf-item" />
        <div class="pagination-wrapper" v-if="conferenceList.length > 0">
          <el-pagination @size-change="handleConferenceSizeChange" @current-change="handleConferencePageChange"
            :current-page="currentPageConference" :page-size="pageSizeConference" :total="conferenceList.length"
            layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 20, 50]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchMainConferenceList from './SearchMainConferenceList.vue'
import SearchMainJournalList from './SearchMainJournalList.vue'

export default {
  components: {
    SearchMainConferenceList,
    SearchMainJournalList
  },
  data() {
    return {
      activeName: 'first',
      currentPageJournal: 1,
      currentPageConference: 1,
      pageSizeJournal: 10,
      pageSizeConference: 10,

      // 期刊模拟数据
      journalList: [
        { id: 1, name: 'ACM Computing Surveys', tags: ['SCI 1区'] },
        { id: 2, name: 'IEEE Transactions on Neural Networks', tags: ['SCI 2区', 'CCF A'] },
        { id: 3, name: 'Journal of Artificial Intelligence Research', tags: ['SCI 3区', 'CCF B'] },
        { id: 4, name: 'Pattern Recognition', tags: ['SCI 2区', 'CCF B'] },
        { id: 5, name: 'Machine Learning Journal', tags: ['SCI 2区', 'CCF C'] },
        { id: 6, name: 'Information Sciences', tags: ['SCI 1区'] },
        { id: 7, name: 'Data Mining and Knowledge Discovery', tags: ['SCI 1区', 'CCF A'] },
        { id: 8, name: 'Neural Processing Letters', tags: ['SCI 4区'] },
        { id: 9, name: 'Expert Systems with Applications', tags: ['SCI 3区'] },
        { id: 10, name: 'Knowledge-Based Systems', tags: ['SCI 2区'] }
      ],

      // 会议模拟数据（匹配子组件结构）
      conferenceList: [
        {
          id: 1,
          short: 'CVPR',
          full: 'Conference on Computer Vision and Pattern Recognition',
          h5Index: 255,
          tk5Index: 320,
          ccfLevel: 'A',
          area: 'Computer Vision',
          date: '2025-06-15'
        },
        {
          id: 2,
          short: 'ICCV',
          full: 'International Conference on Computer Vision',
          h5Index: 230,
          tk5Index: 290,
          ccfLevel: 'A',
          area: 'Computer Vision',
          date: '2025-10-20'
        },
        {
          id: 3,
          short: 'NeurIPS',
          full: 'Conference on Neural Information Processing Systems',
          h5Index: 310,
          tk5Index: 350,
          ccfLevel: 'A',
          area: 'Machine Learning',
          date: '2025-12-01'
        },
        {
          id: 4,
          short: 'ICML',
          full: 'International Conference on Machine Learning',
          h5Index: 280,
          tk5Index: 340,
          ccfLevel: 'A',
          area: 'Machine Learning',
          date: '2025-07-10'
        },
        {
          id: 5,
          short: 'ACL',
          full: 'Annual Meeting of the Association for Computational Linguistics',
          h5Index: 210,
          tk5Index: 270,
          ccfLevel: 'A',
          area: 'Natural Language Processing',
          date: '2025-08-05'
        },
        {
          id: 6,
          short: 'EMNLP',
          full: 'Conference on Empirical Methods in Natural Language Processing',
          h5Index: 190,
          tk5Index: 250,
          ccfLevel: 'B',
          area: 'Natural Language Processing',
          date: '2025-11-12'
        },
        {
          id: 7,
          short: 'KDD',
          full: 'ACM SIGKDD Conference on Knowledge Discovery and Data Mining',
          h5Index: 275,
          tk5Index: 330,
          ccfLevel: 'A',
          area: 'Data Mining',
          date: '2025-08-15'
        },
        {
          id: 8,
          short: 'AAAI',
          full: 'Association for the Advancement of Artificial Intelligence',
          h5Index: 265,
          tk5Index: 310,
          ccfLevel: 'A',
          area: 'Artificial Intelligence',
          date: '2025-02-20'
        },
        {
          id: 9,
          short: 'IJCAI',
          full: 'International Joint Conference on Artificial Intelligence',
          h5Index: 250,
          tk5Index: 300,
          ccfLevel: 'A',
          area: 'Artificial Intelligence',
          date: '2025-08-01'
        },
        {
          id: 10,
          short: 'WWW',
          full: 'The Web Conference',
          h5Index: 230,
          tk5Index: 280,
          ccfLevel: 'A',
          area: 'Web Technologies',
          date: '2025-04-25'
        }
      ]
    }
  },
  computed: {
    pagedJournals() {
      const start = (this.currentPageJournal - 1) * this.pageSizeJournal
      return this.journalList.slice(start, start + this.pageSizeJournal)
    },
    pagedConferences() {
      const start = (this.currentPageConference - 1) * this.pageSizeConference
      return this.conferenceList.slice(start, start + this.pageSizeConference)
    }
  },
  methods: {
    handleClick() {
      this.currentPageJournal = 1
      this.currentPageConference = 1
    },
    handleJournalPageChange(val) {
      this.currentPageJournal = val
    },
    handleJournalSizeChange(val) {
      this.pageSizeJournal = val
      this.currentPageJournal = 1
    },
    handleConferencePageChange(val) {
      this.currentPageConference = val
    },
    handleConferenceSizeChange(val) {
      this.pageSizeConference = val
      this.currentPageConference = 1
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

  .searchMainConfTab {
    display: flex;
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
        height: 3px;
        background: linear-gradient(90deg, #00c6fb, #005bea);
      }
    }
  }

  .confContent {
    min-height: 200px;
    position: relative;

    .conf-item {
      transition: all 0.4s;
      border-radius: 8px;
      margin: 0 5px 10px;
      border: 1px solid rgba(0, 0, 0, 0.02);
      background: #fff;

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

/* 可选：列表进出场动画 */
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
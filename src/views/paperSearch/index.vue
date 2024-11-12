<template>
  <div class="backPage">
    <SearchHead :searchType="currentView"  />

    <div class="content">
      <div class="switchBtn">
        <el-button round @click="toggleView('author')">作者</el-button>
        <el-button round @click="toggleView('paper')">论文</el-button>
      </div>
      
      <SearchMain v-if="currentView === 'author'" />
      <SearchMainPaper v-if="currentView === 'paper'" />
    </div>

  </div>
</template>

<script>
import SearchHead from './SearchHead.vue'
import MultiLevelFilter from '@/components/MultiLevelFilter/index.vue'
import SearchMain from './SearchMain.vue'
import SearchMainPaper from './SearchMainPaper.vue'

export default {
  components: {
    SearchHead,
    MultiLevelFilter,
    SearchMain,
    SearchMainPaper
  },
  data() {
    return {
      currentView: 'author'
    };
  },
  methods: {
    toggleView(view) {
      this.currentView = view;
    }
  }
}
</script>

<style lang="scss">
.backPage {
  height: 100vh;
  background: url(../../assets/bg_dingbu2.png) no-repeat top;
  padding-top: 29px;

  .content {
    display: flex;
    flex-direction: column;
    width: 1300px;
    margin: 0 auto 30px;

    .switchBtn {
      margin: 0 0 30px 0;
    }

    .SearchMain {
      // flex: 4;
      box-sizing: border-box;
    }
  }
}
</style>

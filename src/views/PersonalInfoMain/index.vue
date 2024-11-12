<template>
  <div class="backPage" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 头部区域 -->
    <PersonalNewHead />

    <!-- 第一个tabs -->
    <PersonalFirstTab />

    <!-- 主显示区 -->
    <div class="main">
      <!-- 主要数据展示区 -->
      <PersonalMainArea />

      <div class="sideArea">
        <PersonalWordCloud />
        <PersonalSimilarAuthor />
        <PersonalCorAuthor />
      </div>
    </div>
  </div>
</template>

<script>
import PersonalNewHead from './PersonalNewHead.vue'
import PersonalFirstTab from './PersonalFirstTab.vue'
import PersonalMainArea from './PersonalMainArea.vue'
import PersonalWordCloud from './PersonalWordCloud.vue'
import PersonalAuthorStatistic from './PersonalAuthorStatistic.vue'
import PersonalSimilarAuthor from './PersonalSimilarAuthor.vue'
import PersonalCorAuthor from './PersonalCorAuthor.vue'
import { getAuthorInfo } from '@/api/authorInfo'

export default {
  components: {
    PersonalNewHead,
    PersonalFirstTab,
    PersonalMainArea,
    PersonalWordCloud,
    PersonalAuthorStatistic,
    PersonalSimilarAuthor,
    PersonalCorAuthor
  },
  data() {
    return {
      fullscreenLoading: false
    }
  },
  async created() {
    this.fullscreenLoading = true
    const res = await getAuthorInfo(this.$route.query.authorId)
    this.fullscreenLoading = false    
    this.$store.commit('authorInfo/setAuthorInfo', res)
  }
}
</script>

<style lang="scss">
.backPage {
  height: 1850px;
  background: url(../../assets/bg_dingbu2.png) no-repeat top;
  padding-top: 29px;

  a {
    color: #333;
    text-decoration: none;
  }

  .main {
    display: flex;
    width: 1300px;
    height: 1400px;
    margin: 0 auto 30px;
    box-sizing: border-box;

    .sideArea {
      flex: 1;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      height: 1400px;
    }
  }

  li {
    list-style: none;
  }
}
</style>

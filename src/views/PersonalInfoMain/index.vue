<template>
  <div class="backPage" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 头部区域 -->
    <PersonalNewHead :authorId="authorId" />

    <!-- 第一个tabs -->
    <PersonalFirstTab :authorId="authorId" />

    <!-- 主显示区 -->
    <div class="main">
      <!-- 主要数据展示区 -->
      <PersonalMainArea :authorId="authorId" />

      <div class="sideArea">
        <PersonalWordCloud :authorId="authorId" />
        <!-- <PersonalAuthorStatistic :authorId="authorId" /> -->
        <PersonalSimilarAuthor :authorId="authorId" />
        <PersonalRecomConference />
      </div>
    </div>
  </div>
</template>

<script>
import PersonalNewHead from './PersonalNewHead.vue'
import PersonalFirstTab from './PersonalFirstTab.vue'
import PersonalMainArea from './PersonalMainArea.vue'
import PersonalWordCloud from './PersonalWordCloud.vue'
import PersonalSimilarAuthor from './PersonalSimilarAuthor.vue'
import PersonalCorAuthor from './PersonalCorAuthor.vue'
import PersonalAuthorStatistic from './PersonalAuthorStatistic.vue'
import PersonalRecomConference from './PersonalRecomConference.vue'

export default {
  components: {
    PersonalNewHead,
    PersonalFirstTab,
    PersonalMainArea,
    PersonalWordCloud,
    PersonalAuthorStatistic,
    PersonalSimilarAuthor,
    PersonalCorAuthor,
    PersonalRecomConference
  },
  data() {
    return {
      fullscreenLoading: false,
      authorId: this.$route.query.authorId
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

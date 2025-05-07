<template>
  <div class="backPage" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="content-wrapper">
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
  min-height: 100vh;
  width: 100%;

  a {
    color: #333;
    text-decoration: none;
  }

  .content-wrapper {
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;

    >* {
      width: 100%;
    }
  }

  .main {
    display: flex;
    width: 100%;
    gap: 20px;

    .venue-main-area {
      flex: 1;
      min-width: 0;
    }

    .sideArea {
      width: 350px;
      min-width: 350px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      gap: 20px;
    }
  }

  li {
    list-style: none;
  }
}

@media (max-width: 1400px) {
  .backPage {
    .content-wrapper {
      max-width: 100%;
    }
  }
}

@media (max-width: 1024px) {
  .backPage {
    .main {
      flex-direction: column;

      .sideArea {
        width: 100%;
        min-width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;

        >* {
          flex: 1;
          min-width: 300px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .backPage {
    padding-top: 15px;

    .content-wrapper {
      padding: 0 15px;
    }

    .main {
      .sideArea {
        flex-direction: column;

        >* {
          min-width: 100%;
        }
      }
    }
  }
}
</style>

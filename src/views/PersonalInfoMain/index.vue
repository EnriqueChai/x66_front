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
          <div class="sideArea-header">
            <h2>学术路径规划</h2>
          </div>
          <PersonalWordCloud :authorId="authorId" :authorField="authorField" />
          <!-- <PersonalAuthorStatistic :authorId="authorId" /> -->
          <PersonalSimilarAuthor :authorId="authorId" />
          <PersonalRecomConference :authorId="authorId" />
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
import { mapState } from 'vuex'

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
  },
  computed: {
    ...mapState('author', ['author']),
    authorField() {
      const author = this.author.find(a => a.id === this.authorId)
      console.log('当前作者ID:', this.authorId)
      console.log('所有作者:', this.author)
      console.log('找到的作者:', author)
      return author ? author.field : ''
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

      .sideArea-header {
        text-align: center;
        margin-bottom: 10px;

        h2 {
          font-family: 'Noto Sans SC', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
          padding: 10px 0;
          background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
            border-radius: 3px;
          }
        }
      }
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

        .sideArea-header {
          width: 100%;
          margin-bottom: 20px;
        }

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

        .sideArea-header {
          margin-bottom: 15px;

          h2 {
            font-size: 20px;
          }
        }

        >* {
          min-width: 100%;
        }
      }
    }
  }
}
</style>

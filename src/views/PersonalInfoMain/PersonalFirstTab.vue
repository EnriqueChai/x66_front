<template>
  <div class="firstTab" v-loading="loading">
    <div class="firstTab-top">
      <el-tabs v-model="activeName">
        <el-tab-pane label="个人简介" name="first" />
        <el-tab-pane label="教育背景" name="second" />
        <el-tab-pane label="兴趣领域" name="third" />
        <!-- <el-tab-pane label="奖项" name="fourth" />  -->
      </el-tabs>

      <!-- <p class="firstTab-right" type="primary" :underline="false">
        <span style="color: #9ca2ac">浏览量 335</span>
        <a style="border: none;"><svg-icon icon-class="map" /> 职业迁徙</a>
      </p> -->
    </div>

    <div class="content">
      <div v-if="activeName === 'first'" class="content-first">{{ authorBio }}</div>
      <div v-if="activeName === 'second'" class="content-first">{{ strippedAuthorAdu }}</div>
      <div v-if="activeName === 'third'" class="content-first">{{ authorInterests }}</div>
      <!-- <div v-if="activeName === 'fourth'">fourth</div> -->
    </div>
  </div>
</template>

<script>
import { getAuthorInfo } from '@/api/authorInfo'

export default {
  props: {
    authorId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeName: 'first',
      authorBio: '',
      authorAdu: '',
      authorInterests: '',
      loading: false
    }
  },
  computed: {
    strippedAuthorAdu() {
      return this.stripHtmlTags(this.authorAdu);
    }
  },
  watch: {
    authorId(newId) {
      if (newId) {
        this.fetchAuthorDetails()
      }
    }
  },
  created() {
    if (this.authorId) {
      this.fetchAuthorDetails()
    }
  },
  methods: {
    stripHtmlTags(html) {
      if (!html) return '';
      return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
    },
    async fetchAuthorDetails() {
      this.loading = true
      try {
        const res = await getAuthorInfo(this.authorId)
        this.authorBio = res.biography || '暂无简介'
        this.authorAdu = res.education || '暂无教育背景'
        this.authorInterests = res.interests || '暂无兴趣领域'
        this.loading = false
      } catch (error) {
        console.error('获取作者详细信息失败:', error)
      }
    }
  }
}
</script>

<style lang="scss">
.firstTab {
  box-sizing: border-box;
  margin: 0 auto 30px;
  padding: 0 20px 0 20px;
  width: 1300px;
  height: 175px;
  display: flex;
  flex-direction: column;
  background: rgb(255, 255, 255);
  border-radius: 15px;
  // box-shadow: 0 0 10px 0 #a8a8a8;

  .firstTab-top {
    width: 100%;
    height: 50px;
    align-content: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    // align-items: center;
    border-bottom: 2px solid #E4E7ED;

    .firstTab-right {
      width: 300px;
      height: 50px;
      align-items: center;
      display: flex;
      flex-direction: row;
      font-size: 16px;
      margin: 0;

      span,
      a {
        font-size: 16px;
        margin-left: 20px;
      }
    }
  }

  .content {
    width: 1260px;

    .content-first {
      margin-top: 10px;
      width: 1260px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      white-space: pre-wrap;
      -webkit-line-clamp: 5;
      /* 限制显示6行 */
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .el-tabs {
    width: 1300px;
    padding-left: 15px;
    text-align: center;

    .el-tabs__item {
      height: 50px !important;
      line-height: 50px;
      font-size: 16px;
    }
  }
}
</style>

<template>
  <div class="backPage" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 头部区域 -->
    <PersonalNewHead :authorId="authorId" />
    <el-select v-model="modelId" placeholder="请选择模型">
      <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>

    <!-- 主显示区 -->
    <div class="main">
      <!-- 主要数据展示区 -->
      <PersonalMainArea :authorId="authorId" :modelId="modelId" />

      <div class="sideArea">
        <!-- <PersonalAuthorStatistic :authorId="authorId" /> -->
        <PersonalSimilarAuthor :authorId="authorId" :modelId="modelId" />
      </div>
    </div>
  </div>
</template>

<script>
import PersonalNewHead from './PersonalNewHead.vue'
import PersonalMainArea from './PersonalMainArea.vue'
import PersonalSimilarAuthor from './PersonalSimilarAuthor.vue'

export default {
  components: {
    PersonalNewHead,
    PersonalMainArea,
    PersonalSimilarAuthor,
  },
  data() {
    return {
      fullscreenLoading: false,
      authorId: this.$route.query.authorId,
      modelId: '',
      modelOptions: [
        { label: 'Default', value: '0' },
        { label: 'GPTGNN', value: '1' },
        { label: 'LMCH', value: '2' },
        { label: 'WalkLM', value: '3' },
      ],
    }
  },
  mounted() {
    console.log("Received authorId:", this.authorId)
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

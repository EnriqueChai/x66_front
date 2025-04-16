<template>
  <div class="firstTab" v-loading="loading">
    <div class="firstTab-top">
      <el-tabs v-model="activeName">
        <el-tab-pane label="会议简介" name="first" />
        <el-tab-pane label="关键信息" name="second" />
        <el-tab-pane label="历史沿革" name="third" />
      </el-tabs>
    </div>

    <div class="content">
      <div v-if="activeName === 'first'" class="content-first">
        {{ venueBio || "这是一个国际顶级的计算机视觉会议，每年都会发表大量高质量的研究论文。" }}
      </div>
      <div v-if="activeName === 'second'" class="content-first">
        <p>会议ID: {{ venueInfo.auto_id || '未知' }}</p>
        <p>会议类型: {{ venueInfo.type || '未知' }}</p>
        <p>最新会议日期: {{ latestYear || '未知' }}</p>
      </div>
      <div v-if="activeName === 'third'" class="content-first">
        {{ venueHistory || "该会议有着悠久的历史，是计算机视觉领域最具影响力的学术会议之一。" }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    venueInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeName: 'first',
      venueBio: '',
      venueHistory: '',
      loading: false
    }
  },
  computed: {
    latestYear() {
      // 这里应该从数据中获取最新的会议年份
      return new Date().getFullYear()
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

  .firstTab-top {
    width: 100%;
    height: 50px;
    align-content: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 2px solid #E4E7ED;
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
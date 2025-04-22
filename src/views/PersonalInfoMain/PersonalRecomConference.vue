<template>
  <div class="forthSide">
    <h3>推荐会议</h3>
    <div class="conferenceList" v-loading="loading">
      <div v-for="(conf, index) in conferences" :key="index" class="conferenceItem">
        {{ conf }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      conferences: ['NeurIPS', 'ICML', 'CVPR', 'ACL', 'KDD', 'AAAI', 'EMNLP', 'NeurIPS',
        'ICML', 'CVPR', 'ACL', 'KDD', 'AAAI', 'EMNLP']
    }
  }
}
</script>

<style lang="scss" scoped>
.forthSide {
  height: 450px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 15px;
  margin: 0 0 30px 15px;
  width: 305px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 18px 15px 15px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: #333;
  }

  .conferenceList {
    max-height: 370px;
    overflow-y: auto;
    padding-right: 5px;
    padding-top: 13px;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */

    &::-webkit-scrollbar {
      display: none;
      /* Chrome, Safari */
    }


    .conferenceItem {
      background-color: #f5f7fa;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 10px;
      font-size: 15px;
      color: #333;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background-color: #e0ebff;
        color: #1a73e8;
      }
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }
  }
}
</style>
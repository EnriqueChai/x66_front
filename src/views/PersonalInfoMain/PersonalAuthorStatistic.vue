<template>
  <div class="secondSide">
    <!-- <div slot="header" class="clearfix">
        <span>作者统计</span>
      </div> -->
    <h3>作者统计</h3>
    <hr>
    <el-card shadow="never" style="border: none; border-radius: 15px;">
      <div v-for="item in stats" :key="item.label" class="stat-item">
        <div class="stat-label">
          {{ item.label }}
          <span class="stat-value">{{ item.value }}</span>
        </div>
        <el-progress :percentage="item.percentage" :stroke-width="10" color="#409EFF" />
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      paperListLength: 0,
      citation: 0,
      hindex: 0,
      paperListLengthPercent: 0,
      citationPercent: 0,
      hindexPercent: 0,
      sumPercent: 0
    }
  },
  computed: {
    stats() {
      return [
        { label: '#Papers', value: this.paperListLength, percentage: this.paperListLengthPercent },
        { label: '#Citation', value: this.citation, percentage: this.citationPercent },
        { label: 'H-Index', value: this.hindex, percentage: this.hindexPercent },
      ]
    }
  },
  watch: {
    '$store.state.authorInfo.authorInfo'(newVal) {
      if(newVal) {
        this.getData()
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await this.$store.state.authorInfo.authorInfo
      this.paperListLength = res.papers.length
      this.citation = parseInt(res.author.ncitation)
      this.hindex = parseInt(res.author.hindex)
      this.sumPercent = this.paperListLength + this.citation + this.hindex
      this.paperListLengthPercent = (this.paperListLength / this.sumPercent) * 100
      this.citationPercent = (this.citation / this.sumPercent) * 100
      this.hindexPercent = (this.hindex / this.sumPercent) * 100
    }
  }
}
</script>

<style lang="scss">
.secondSide {
  flex: 3;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-radius: 15px;
  box-shadow: 0 0 10px 0 #a8a8a8;
  margin: 0 0 30px 15px;

  h3 {
    margin-left: 13px;
  }

  .stat-item {
    margin-bottom: 40px;

    .el-progress-bar__outer {
      width: 270px;
    }
  }

  .stat-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .stat-value {
    color: gray;
  }

  .el-progress__text {
    display: none;
  }
}
</style>

<template>
  <div class="thirdSide">
    <h3>相似作者</h3>
    <hr>
    <div class="authorGrid">
      <PersonalSimilarAuthorList v-for="author in simAuthor" :key="author.id" :simAuthor="author" />
    </div>
  </div>
</template>

<script>
import PersonalSimilarAuthorList from './PersonalSimilarAuthorList.vue'

export default {
  components: {
    PersonalSimilarAuthorList
  },
  data() {
    return {
      simAuthor: []
    }
  },
  watch: {
    '$store.state.authorInfo.authorInfo'(newVal) {
      if (newVal) {
        this.getData()
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await this.$store.state.authorInfo.authorInfo.similarAuthors
      this.simAuthor = res
    }
  }
}
</script>

<style lang="scss">
.thirdSide {
  flex: 4;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-radius: 15px;
  box-shadow: 0 0 10px 0 #a8a8a8;
  margin: 0 0 30px 15px;
  width: 305px;

  h3 {
    margin-left: 13px;
  }

  .authorGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    justify-items: center;
    margin-top: 35px;

    max-height: 330px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>

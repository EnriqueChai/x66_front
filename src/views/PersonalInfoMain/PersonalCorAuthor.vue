<template>
  <div class="secondSide">
    <h3>推荐作者</h3>
    <hr>
    <div class="authorGrid">
      <PersonalCorAuthorList v-for="author in corAuthor" :key="author.id" :corAuthor="author" />
    </div>
  </div>
</template>

<script>
import PersonalCorAuthorList from './PersonalCorAuthorList.vue'

export default {
  components: {
    PersonalCorAuthorList
  },
  data() {
    return {
      corAuthor: []
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
      const res = await this.$store.state.authorInfo.authorInfo.recommendAuthors
      this.corAuthor = res
    }
  }
}
</script>

<style lang="scss">
.secondSide {
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

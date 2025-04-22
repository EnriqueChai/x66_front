<template>
  <div class="thirdSide">
    <h3>相似作者</h3>
    <!-- <hr> -->
    <div class="authorGrid" v-loading="loading">
      <PersonalSimilarAuthorList v-for="author in simAuthor" :key="author.id" :simAuthor="author" />
    </div>
  </div>
</template>

<script>
import PersonalSimilarAuthorList from './PersonalSimilarAuthorList.vue'
import { getSimAuthor } from '@/api/authorInfo'

export default {
  components: {
    PersonalSimilarAuthorList
  },
  props: {
    authorId: {
      type: String,
      required: true
    },
    modelId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      simAuthor: [],
      loading: true
    }
  },
  watch: {
    authorId(newId) {
      if (newId) {
        this.fetchSimilarAuthors()
      }
    },
    modelId(newId) {
      if (newId) {
        this.fetchSimilarAuthors()
      }
    }
  },
  created() {
    if (this.authorId) {
      this.fetchSimilarAuthors()
    }
  },
  methods: {
    async fetchSimilarAuthors() {
      try {
        const res = await getSimAuthor(this.authorId, this.modelId)
        // const res = await getSimAuthor(this.authorId)
        if (Array.isArray(res)) {
          this.simAuthor = res
        } else {
          console.warn('getSimilarAuthors API response is not an array:', res)
          this.simAuthor = []
        }
        this.loading = false
      } catch (error) {
        console.error('获取相似作者数据失败:', error)
        this.simAuthor = []
      }
    }
  }
}
</script>

<style lang="scss">
.thirdSide {
  // flex: 4;
  height: 450px;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin: 0 0 30px 15px;
  width: 305px;

  h3 {
    margin-left: 13px;
    margin-top: 0px;
    padding-top: 18px;
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

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
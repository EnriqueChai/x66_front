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
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  height: 450px;

  h3 {
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 15px 0;
    color: #2c3e50;
    background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .authorGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    justify-items: center;
    margin-top: 20px;
    max-height: 380px;
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
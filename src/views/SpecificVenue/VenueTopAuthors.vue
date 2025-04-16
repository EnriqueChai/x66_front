<template>
  <div class="venueTopAuthors">
    <h3>优秀作者</h3>
    <div class="authorsGrid" v-loading="loading">
      <div v-for="author in authors" :key="author.auto_id" class="authorItem" @click="goToAuthorPage(author.auto_id)">
        <div class="authorAvatar">
          <img src="../../assets/touxiang.jpg" alt="作者头像">
        </div>
        <div class="authorInfo">
          <div class="authorName">{{ author.name }}</div>
          <div class="authorCitation">引用: {{ author.citation }}</div>
          <div class="authorField">{{ author.field }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    authors: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    // 获取前8位作者进行展示
    topAuthors() {
      return this.authors.slice(0, 8)
    }
  },
  methods: {
    goToAuthorPage(authorId) {
      this.$router.push({
        path: '/personalInfo',
        query: { authorId: authorId }
      })
    }
  }
}
</script>

<style lang="scss">
.venueTopAuthors {
  height: 450px;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-radius: 15px;
  margin: 0 0 30px 15px;
  width: 305px;
  overflow: hidden;

  h3 {
    margin-left: 13px;
    margin-top: 0px;
    padding-top: 18px;
  }

  .authorsGrid {
    max-height: 380px;
    overflow-y: auto;
    padding: 10px;

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .authorItem {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f0f8ff;
      }

      .authorAvatar {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      .authorInfo {
        flex: 1;

        .authorName {
          font-weight: bold;
          margin-bottom: 3px;
        }

        .authorCitation {
          font-size: 0.9em;
          color: #0066cc;
          margin-bottom: 2px;
        }

        .authorField {
          font-size: 0.8em;
          color: #666;
        }
      }
    }
  }
}
</style> 
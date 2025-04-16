<template>
  <div class="venueRecommendedReviewers">
    <h3>推荐审稿人</h3>
    <div class="reviewerCategoriesContainer" v-loading="loading">
      <el-collapse accordion>
        <el-collapse-item v-for="(reviewers, category) in reviewers" :key="category" :title="category">
          <div class="reviewersList">
            <div v-for="reviewer in reviewers" :key="reviewer.auto_id" class="reviewerItem" @click="goToAuthorPage(reviewer.auto_id)">
              <div class="reviewerName">{{ reviewer.name }}</div>
              <div class="reviewerCitation">引用: {{ reviewer.citation }}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reviewers: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false
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
.venueRecommendedReviewers {
  height: 450px;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-radius: 15px;
  margin: 0 0 30px 15px;
  width: 305px;

  h3 {
    margin-left: 13px;
    margin-top: 0px;
    padding-top: 18px;
  }

  .reviewerCategoriesContainer {
    max-height: 380px;
    overflow-y: auto;
    padding: 0 10px;
    
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .el-collapse {
      border: none;

      .el-collapse-item__header {
        border-bottom: 1px solid #ebeef5;
        font-weight: bold;
        color: #333;
      }

      .el-collapse-item__content {
        padding: 10px 0;
      }
    }

    .reviewersList {
      .reviewerItem {
        display: flex;
        flex-direction: column;
        padding: 8px 10px;
        border-radius: 6px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f0f8ff;
        }

        .reviewerName {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .reviewerCitation {
          font-size: 0.85em;
          color: #0066cc;
        }
      }
    }
  }
}
</style> 
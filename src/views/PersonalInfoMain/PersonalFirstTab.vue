<template>
  <div class="venue-tabs" v-loading="loading">
    <div class="tabs-container">
      <el-tabs v-model="activeName">
        <el-tab-pane name="first">
          <template #label>
            <span class="tab-label">
              <i class="el-icon-info"></i>
              个人简介
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="second">
          <template #label>
            <span class="tab-label">
              <i class="el-icon-school"></i>
              教育背景
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="third">
          <template #label>
            <span class="tab-label">
              <i class="el-icon-star-off"></i>
              兴趣领域
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="tab-content">
      <transition name="fade" mode="out-in">
        <div v-if="activeName === 'first'" key="first" class="content-panel bio">
          <p>{{ authorBio || "暂无简介" }}</p>
        </div>
        <div v-else-if="activeName === 'second'" key="second" class="content-panel bio">
          <p>{{ strippedAuthorAdu || "暂无教育背景" }}</p>
        </div>
        <div v-else-if="activeName === 'third'" key="third" class="content-panel bio">
          <p>{{ authorInterests || "暂无兴趣领域" }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { getAuthorInfo } from '@/api/authorInfo'

export default {
  props: {
    authorId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeName: 'first',
      authorBio: '',
      authorAdu: '',
      authorInterests: '',
      loading: false
    }
  },
  computed: {
    strippedAuthorAdu() {
      return this.stripHtmlTags(this.authorAdu);
    }
  },
  watch: {
    authorId(newId) {
      if (newId) {
        this.fetchAuthorDetails()
      }
    }
  },
  created() {
    if (this.authorId) {
      this.fetchAuthorDetails()
    }
  },
  methods: {
    stripHtmlTags(html) {
      if (!html) return '';
      return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
    },
    async fetchAuthorDetails() {
      this.loading = true
      try {
        const res = await getAuthorInfo(this.authorId)
        this.authorBio = res.biography || '暂无简介'
        this.authorAdu = res.education || '暂无教育背景'
        this.authorInterests = res.interests || '暂无兴趣领域'
        this.loading = false
      } catch (error) {
        console.error('获取作者详细信息失败:', error)
      }
    }
  }
}
</script>

<style lang="scss">
.venue-tabs {
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 30px;
  width: 100%;

  @media (max-width: 1400px) {
    width: calc(100% - 370px);
  }

  @media (max-width: 1024px) {
    width: 100%;
  }

  .tabs-container {
    .el-tabs {
      .el-tabs__header {
        margin: 0;
        padding: 0 20px;
        background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
        border-bottom: 1px solid #e4e7ed;
      }

      .el-tabs__nav-wrap::after {
        height: 1px;
        background: #e0e6ed;
      }

      .el-tabs__item {
        height: 54px;
        line-height: 54px;
        font-size: 16px;
        color: #7f8c8d;
        transition: all 0.3s;
        padding: 0 20px;

        i {
          margin-right: 6px;
          font-size: 18px;
          vertical-align: middle;

          &.el-icon-info {
            color: #3498db;
          }

          &.el-icon-school {
            color: #9b59b6;
          }

          &.el-icon-star-off {
            color: #f39c12;
          }
        }

        &.is-active {
          font-weight: bold;
          color: #3498db;
          transform: translateY(-2px);
        }

        &:hover {
          color: #3498db;
        }
      }

      .el-tabs__active-bar {
        background: linear-gradient(90deg, #00c6fb, #005bea);
        height: 3px;
      }
    }

    .tab-label {
      display: flex;
      align-items: center;
      font-size: 16px;
    }
  }

  .tab-content {
    padding: 24px 30px;
    background: white;

    .content-panel {
      line-height: 1.6;
      color: #606266;

      p {
        margin: 0;
        font-size: 15px;
        text-align: justify;
        white-space: pre-wrap;
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style>

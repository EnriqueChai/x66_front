<template>
  <div>
    <div class="personalHeader" v-loading="loading">
      <div class="top">
        <div class="top-left">
          <div class="author-image-container" @click="showImageModal">
            <img v-if="author.picture" :src="author.picture" class="author-image" :alt="formattedAuthorName">
            <img v-else src="@/assets/touxiang.jpg" class="author-image" :alt="formattedAuthorName">
          </div>
          <div class="info">
            <span style="font-size: 25px;">{{ formattedAuthorName }}</span>
            <span v-html="formattedAuthorOrg"></span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <ul>
          <li>
            <el-popover v-if="author.homepage" trigger="hover" placement="top" :content="author.homepage"
              style="display: inline-block;">
              <a :href="author.homepage" target="_blank" slot="reference"><svg-icon icon-class="zhuye" /></a>
            </el-popover>
            <el-popover v-else trigger="hover" placement="top" content="暂无资料" style="display: inline-block;">
              <a href="#" slot="reference"><svg-icon icon-class="zhuye" /></a>
            </el-popover>
          </li>
          <li>
            <el-popover v-if="author.email" trigger="hover" placement="top" :content="author.email"
              style="display: inline-block;">
              <a :href="'mailto:' + author.email" slot="reference"><svg-icon icon-class="youxiang" /></a>
            </el-popover>
            <el-popover v-else trigger="hover" placement="top" content="暂无资料" style="display: inline-block;">
              <a href="#" slot="reference"><svg-icon icon-class="youxiang" /></a>
            </el-popover>
          </li>
        </ul>
      </div>
    </div>

    <Teleport to="body">
      <transition name="fade">
        <div v-if="imageModalVisible" class="author-image-modal">
          <div class="author-image-modal__mask" @click="closeImageModal"></div>
          <div class="author-image-modal__wrapper">
            <div class="author-image-modal__container">
              <div class="author-image-modal__header">
                <button class="author-image-modal__close" @click="closeImageModal">×</button>
              </div>
              <div class="author-image-modal__body">
                <img :src="currentImage" :alt="formattedAuthorName" class="author-image-modal__image">
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
import { getAuthorInfo } from '@/api/authorInfo'
import eventBus from '@/utils/eventBus'

export default {
  props: {
    authorId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      author: {},
      loading: false,
      imageModalVisible: false,
      currentImage: ''
    }
  },
  computed: {
    formattedAuthorName() {
      if (!this.author.authorName) {
        return '未知作者'
      }
      return this.author.authorName
        .split(' ')
        .filter(word => word)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
    formattedAuthorOrg() {
      return this.author.authorOrg || ''
    }
  },
  watch: {
    authorId(newId) {
      if (newId) {
        this.fetchAuthorInfo()
      }
    }
  },
  created() {
    if (this.authorId) {
      this.fetchAuthorInfo()
    }
  },
  methods: {
    async fetchAuthorInfo() {
      try {
        this.loading = true
        const res = await getAuthorInfo(this.authorId)
        console.log('Author info:', res)
        this.author = res
        eventBus.emit('author-info-updated', res)
        this.loading = false
      } catch (error) {
        console.error('获取作者信息失败:', error)
        this.loading = false
      }
    },
    showImageModal() {
      this.currentImage = this.author.picture || require('@/assets/touxiang.jpg')
      this.imageModalVisible = true
    },
    closeImageModal() {
      this.imageModalVisible = false
      this.currentImage = ''
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Noto+Sans+SC:wght@400;500;700&display=swap');

.personalHeader {
  box-sizing: border-box;
  margin: 0 auto 30px;
  padding: 20px;
  width: 100%;
  background: linear-gradient(135deg, rgba(37, 117, 252, 0.05) 0%, rgba(0, 91, 234, 0.15) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  animation: fadeIn 1s ease-out;

  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .top-left {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;

      .author-image-container {
        cursor: pointer;
        position: relative;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }
      }

      .author-image {
        height: 90px;
        width: 90px;
        cursor: pointer;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 10px 25px rgba(37, 117, 252, 0.3);
        transition: all 0.3s ease;
        border: 3px solid rgba(255, 255, 255, 0.8);

        &:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(37, 117, 252, 0.4);
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        min-width: 200px;

        span {
          &:first-child {
            font-family: 'Poppins', sans-serif;
            font-size: 36px;
            font-weight: 700;
            background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: titlePulse 2s infinite alternate ease-in-out;
            margin-bottom: 10px;
            word-break: break-word;
          }

          &:last-child {
            font-family: 'Noto Sans SC', sans-serif;
            font-size: 16px;
            color: #5a6a7a;
            animation: fadeIn 1.5s ease-out;
            word-break: break-word;
          }
        }
      }
    }
  }

  .bottom {
    ul {
      display: flex;
      padding-left: 60px;
      margin: 0;
      gap: 20px;
      flex-wrap: wrap;

      li {
        font-size: 35px;
        transition: all 0.3s ease;

        a {
          color: #5a6a7a;
          transition: all 0.3s ease;

          &:hover {
            color: #5271ff;
            transform: translateY(-2px);
          }
        }
      }
    }
  }

  .el-dialog {
    border-radius: 16px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);

    .el-dialog__header {
      padding: 20px;
      border-bottom: 1px solid rgba(37, 117, 252, 0.1);
    }

    .el-dialog__body {
      padding: 20px;
    }

    .el-dialog__footer {
      padding: 20px;
      text-align: center;
      border-top: 1px solid rgba(37, 117, 252, 0.1);
    }
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .modal-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(37, 117, 252, 0.2);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 15px 35px rgba(37, 117, 252, 0.4);
    }
  }

  .el-button {
    background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(37, 117, 252, 0.3);
    }
  }

  @media (max-width: 768px) {
    margin: 0 15px 20px;
    padding: 15px;

    .top {
      .top-left {
        .author-image {
          height: 70px;
          width: 70px;
        }

        .info {
          span {
            &:first-child {
              font-size: 28px;
            }
          }
        }
      }
    }

    .bottom {
      ul {
        padding-left: 0;
        justify-content: center;
      }
    }

    .modal-image {
      max-height: 60vh;
    }
  }
}

@keyframes titlePulse {
  0% {
    opacity: 0.9;
    transform: scale(1);
  }

  100% {
    opacity: 1;
    transform: scale(1.02);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.author-image-container {
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

// 模态框样式
.author-image-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  z-index: 2000000;

  &__mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
  }

  &__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__container {
    position: relative;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    padding: 20px;
    max-width: 90vw;
    max-height: 90vh;
    margin: 20px;
    display: flex;
    flex-direction: column;
  }

  &__header {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
  }

  &__close {
    background: none;
    border: none;
    font-size: 32px;
    width: 44px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #fff;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;
    background: rgba(0, 0, 0, 0.3);

    &:hover {
      background: rgba(0, 0, 0, 0.6);
      transform: rotate(90deg);
    }
  }

  &__body {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 20px;
  }

  &__image {
    max-width: 100%;
    max-height: calc(90vh - 80px);
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
}

// 动画效果
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from .author-image-modal__container,
.fade-leave-to .author-image-modal__container {
  transform: scale(0.9);
}

// 移除之前的模态框相关样式
.global-image-modal,
.global-image-modal-content,
.global-close-button,
.global-image-container,
.global-modal-image {
  display: none;
}
</style>
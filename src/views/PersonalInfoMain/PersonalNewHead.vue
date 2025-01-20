<template>
  <div class="personalHeader" v-loading="loading">
    <div class="headContent">
      <div class="top">
        <div class="top-left">
          <img v-if="author.picture" :src="author.picture" class="author-image" @click="showImageModal(author.picture)">
          <img v-else src="../../assets/touxiang.jpg" class="author-image"
            @click="showImageModal('../../assets/touxiang.jpg')">
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

    <el-dialog :visible.sync="imageModalVisible" width="500px" center>
      <div class="image-container">
        <img :src="currentImage" alt="作者大图" class="modal-image">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imageModalVisible = false">关闭</el-button>
      </span>
    </el-dialog>
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
        console.log(res)
        this.author = res
        this.loading = false
      } catch (error) {
        console.error('获取作者信息失败:', error)
        this.loading = false
      }
    },
    showImageModal(imageSrc) {
      this.currentImage = imageSrc
      this.imageModalVisible = true
    }
  }
}
</script>

<style lang="scss">
.personalHeader {
  box-sizing: border-box;
  margin: 0 auto 30px;
  padding: 20px;
  width: 1300px;
  height: 175px;
  background: rgb(255, 255, 255);
  background-image: linear-gradient(#dff3f9, #ffffff, #ffffff);
  border-radius: 15px;
  // box-shadow: 0 0 10px 0 #a8a8a8;

  .top {
    display: flex;
    justify-content: space-between;

    .top-left {
      display: flex;

      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 70px;
        width: 1100px;
        padding-top: 10px;
        padding-bottom: 5px;
        margin-left: 15px;
      }
    }

    .top-right {
      height: 100px;
      overflow-x: hidden;
      overflow-y: auto;
    }

  }

  ul {
    display: flex;
    padding-left: 60px;
    margin-top: 25px;

    li {
      font-size: 35px;
      padding-left: 20px;
    }
  }


  .author-image {
    height: 70px;
    width: 70px;
    cursor: pointer;
    border-radius: 50%;
    object-fit: cover;
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-dialog__footer {
    text-align: center;
  }

  @media (max-width: 768px) {
    width: 90%;

    .modal-image {
      max-height: 60vh;
    }
  }

  .el-dialog {
    transition: all 0.3s ease;
  }

  .modal-image {
    transition: transform 0.3s ease;
  }

  .modal-image:hover {
    transform: scale(1.05);
  }
}
</style>
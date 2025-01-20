<template>
  <div class="recomListContainer">
    <div class="recomLsitTop">
      <svg-icon icon-class="pdf" />
      <h3 @click="openModal" class="clickable-title"> {{ paper.title }} </h3>
    </div>

    <div class="recomLsitMid">
      <div>
        <span v-for="(author, index) in displayedAuthors" :key="index">
          <span class="author-name">{{ author }}</span>
          <span v-if="index < displayedAuthors.length - 1">, </span>
        </span>
        <span v-if="hasEtAl"> et al.</span>
      </div>
    </div>

    <div class="recomListBottom">
      发表年份：{{ paper.time.slice(0, 4) }}
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay show" @click.self="closeModal">
        <div class="modal-content show">
          <button class="close-button" @click="closeModal">×</button>
          <h2>{{ paper.title }}</h2>
          <p><strong>作者：</strong>
            <span v-for="(author, index) in paper.authors" :key="index">
              <span class="author-name">{{ author }}</span>
              <span v-if="index < paper.authors.length - 1">, </span>
            </span>
            <span v-if="paper.authors.length > maxLength"> et al.</span>
          </p>
          <p><strong>摘要：</strong>{{ paper.summary }}</p>
          <p><strong>发表年份：</strong>{{ paper.time.slice(0, 4) }}</p>
          <p>
            <strong>PDF链接：</strong>
            <a :href="paper.pdfUrl" target="_blank">下载 PDF</a>
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'PaperItem',
  props: {
    paper: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      maxLength: 6 // 保持一致，最大显示作者数量
    };
  },
  computed: {
    displayedAuthors() {
      const authors = this.paper.authors;

      // 提取前 maxLength 个作者的名字
      return authors.slice(0, this.maxLength).map(author => {
        return typeof author === 'object' ? author.name : author;
      });
    },
    hasEtAl() {
      const authors = this.paper.authors;
      return authors.length > this.maxLength;
    }
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    handleKeyDown(event) {
      if (event.key === 'Escape' && this.showModal) {
        this.closeModal();
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
};
</script>

<style lang="scss">
.recomListContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 1300px;
  height: 120px;
  padding: 20px;
  border-bottom: 1px solid rgb(134, 134, 134);
  position: relative;

  .recomLsitTop {
    display: flex;
    height: 40px;
    align-items: center;
    font-size: 18px;

    h3 {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-left: 10px;
      cursor: pointer;
      color: #000000;
    }
  }

  .recomLsitMid {
    height: 50px;
    display: flex;
    align-items: center;
    color: rgb(134, 134, 134);
  }

  .author-name {
    color: #1a73e8;
  }

  h3 {
    margin-block-start: 0px;
    margin-block-end: 0px;
    margin-left: 10px;
  }

  ul {
    display: flex;
    // padding-left: 60px;

    li {
      font-size: 15px;
      padding-left: 20px;
      list-style: none;
    }
  }

  /* 模态框样式 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    /* 半透明背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    /* 确保模态框在最上层 */
    opacity: 0;
    transition: opacity 0.3s ease;

    &.show {
      opacity: 1;
    }
  }

  .modal-content {
    background-color: #fff;
    padding: 20px 30px;
    border-radius: 8px;
    width: 600px;
    max-width: 90%;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    max-height: 80vh;
    overflow-y: auto;
    /* 内容过长时可滚动 */
    transform: scale(0.8);
    transition: transform 0.3s ease;

    &.show {
      transform: scale(1);
    }
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;

    &:hover {
      color: #666;
    }
  }

  .modal-content h2 {
    margin-top: 0;
    margin-bottom: 15px;
  }

  .modal-content p {
    margin: 10px 0;
    line-height: 1.5;
  }

  .modal-content a {
    color: #1a0dab;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  /* 可选：添加标题的点击效果 */
  .clickable-title {
    cursor: pointer;
    color: #0000EE;
  }

  .clickable-title:hover {
    text-decoration: underline;
  }
}
</style>
<template>
  <div class="paper-list">
    <div v-for="(paper, index) in papers" :key="index" class="paper-item">
      <div class="paper-title">
        <h4 @click="openModal(paper)" class="clickable-title">
          {{ paper.title }}
        </h4>
      </div>
      <div class="paper-authors">
        <span v-for="(author, idx) in displayedAuthors(paper)" :key="idx">
          <span class="author-name">{{ author }}</span>
          <span v-if="idx < displayedAuthors(paper).length - 1">, </span>
        </span>
        <span v-if="paper.authors.length > maxLength"> et al.</span>
      </div>
      <div class="paper-journal">{{ paper.journal }}</div>
      <div class="paper-year">{{ paper.year }}</div>
      <div class="paper-citations">{{ paper.citations }}</div>
    </div>

    <!-- 模态框 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">×</button>
        <h2>{{ selectedPaper.title }}</h2>
        <p><strong>作者：</strong>
          <span v-for="(author, index) in selectedPaper.authors" :key="index">
            <span class="author-name">{{ author }}</span>
            <span v-if="index < selectedPaper.authors.length - 1">, </span>
          </span>
          <span v-if="selectedPaper.authors.length > maxLength"> et al.</span>
        </p>
        <p><strong>期刊：</strong>{{ selectedPaper.journal }}</p>
        <p><strong>发表年份：</strong>{{ selectedPaper.year }}</p>
        <p><strong>引用量：</strong>{{ selectedPaper.citations }}</p>
        <p><strong>摘要：</strong>{{ selectedPaper.abstract }}</p>
        <p>
          <strong>PDF链接：</strong>
          <a :href="selectedPaper.pdfLink" target="_blank">下载 PDF</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaperList',
  props: {
    papers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      selectedPaper: null,
      maxLength: 6, // 最大显示作者数量
    };
  },
  methods: {
    displayedAuthors(paper) {
      return paper.authors.slice(0, this.maxLength);
    },
    openModal(paper) {
      this.selectedPaper = paper;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedPaper = null;
    },
  },
};
</script>

<style lang="scss">
.paper-list {
  .paper-item {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;

    .paper-title {
      flex: 2;

      /* 与表头一致 */
      h4 {
        margin: 0;
        cursor: pointer;
        color: #0000EE;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .paper-authors {
      flex: 2;
      /* 与表头一致 */
      color: blue;
      text-align: left;
      /* 统一对齐方式 */
    }

    .paper-journal,
    .paper-year,
    .paper-citations {
      flex: 1;
      /* 与表头一致 */
      text-align: center;
      /* 统一对齐方式 */
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

  .author-name {
    color: blue;
  }

  .clickable-title {
    cursor: pointer;
    color: #0000EE;
  }

  .clickable-title:hover {
    text-decoration: underline;
  }
}

/* 响应式设计（可选） */
@media (max-width: 768px) {
  .paper-list {
    .paper-item {
      flex-direction: column;

      .paper-title,
      .paper-authors,
      .paper-journal,
      .paper-year,
      .paper-citations {
        flex: none;
        text-align: left;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
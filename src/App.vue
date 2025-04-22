<template>
  <div id="app">
    <router-view/>
    
    <!-- 全局论文详情模态框 -->
    <div v-if="showPaperModal" class="global-modal-overlay" @click.self="closePaperModal">
      <transition name="global-modal-fade">
        <div v-if="showPaperModalContent" class="global-modal-content">
          <button class="global-close-button" @click="closePaperModal">×</button>
          <div class="global-modal-header">
            <h2>{{ currentPaper.title || '未知标题' }}</h2>
          </div>
          <div class="global-modal-body">
            <div class="global-modal-section">
              <h3><i class="el-icon-user"></i> 作者</h3>
              <p class="global-author-list">
                <span v-if="(currentPaper.authors || []).length > 0">
                  <span v-for="(author, index) in (currentPaper.authors || [])" :key="index">
                    <span class="global-author-name">{{ formatAuthor(author) }}</span>
                    <span v-if="index < (currentPaper.authors || []).length - 1">, </span>
                  </span>
                </span>
                <span v-else>未知作者</span>
              </p>
            </div>
            
            <div class="global-modal-section">
              <h3><i class="el-icon-document-copy"></i> 摘要</h3>
              <p class="global-paper-abstract">{{ currentPaper.summary || currentPaper.abstract || '暂无摘要' }}</p>
            </div>
            
            <div class="global-modal-section theme-section" v-if="currentPaper.themes && currentPaper.themes.length">
              <h3><i class="el-icon-collection-tag"></i> 主题标签</h3>
              <div class="global-themes-container">
                <el-tag 
                  v-for="(theme, i) in currentPaper.themes" 
                  :key="i" 
                  effect="dark" 
                  class="global-theme-tag"
                >
                  {{ theme }}
                </el-tag>
              </div>
            </div>
            
            <div class="global-modal-section global-modal-info">
              <div class="global-info-item">
                <i class="el-icon-date"></i>
                <div>
                  <h4>发表年份</h4>
                  <p>{{ formatYear(currentPaper.time) }}</p>
                </div>
              </div>
              
              <div class="global-info-item" v-if="currentPaper.citations">
                <i class="el-icon-reading"></i>
                <div>
                  <h4>引用次数</h4>
                  <p>{{ currentPaper.citations }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="global-modal-footer">
            <el-button type="primary" icon="el-icon-download" round @click="downloadPdf">
              下载 PDF
            </el-button>
            <el-button type="success" icon="el-icon-star-off" round>
              收藏
            </el-button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showPaperModal: false,
      showPaperModalContent: false,
      currentPaper: {
        title: '',
        authors: [],
        time: '',
        summary: '',
        citations: 0,
        pdfUrl: '',
        themes: []
      }
    }
  },
  methods: {
    formatAuthor(author) {
      if (!author) return '未知作者';
      return typeof author === 'object' ? (author.name || '未知作者') : author;
    },
    formatYear(timeStr) {
      if (!timeStr) return '未知年份';
      // 尝试从时间字符串中提取年份
      const year = timeStr.toString().slice(0, 4);
      return /^\d{4}$/.test(year) ? year : '未知年份';
    },
    openPaperModal(paper) {
      this.currentPaper = paper;
      this.showPaperModal = true;
      document.body.style.overflow = 'hidden';
      
      // 使用requestAnimationFrame确保DOM更新后再添加动画类
      requestAnimationFrame(() => {
        const overlay = document.querySelector('.global-modal-overlay');
        if (overlay) {
          overlay.classList.add('show');
        }
        setTimeout(() => {
          this.showPaperModalContent = true;
        }, 50);
      });
    },
    closePaperModal() {
      this.showPaperModalContent = false;
      const overlay = document.querySelector('.global-modal-overlay');
      if (overlay) {
        overlay.classList.remove('show');
      }
      setTimeout(() => {
        this.showPaperModal = false;
        document.body.style.overflow = '';
      }, 300);
    },
    downloadPdf() {
      if (this.currentPaper.pdfUrl) {
        window.open(this.currentPaper.pdfUrl, '_blank');
      } else {
        this.$message({
          message: '暂无可下载的PDF文件',
          type: 'warning'
        });
      }
    },
    handleKeyDown(event) {
      if (event.key === 'Escape' && this.showPaperModal) {
        this.closePaperModal();
      }
    }
  },
  mounted() {
    // 监听全局事件
    this.$bus.$on('showPaperModal', (data) => {
      if (data.show && data.paper) {
        this.openPaperModal(data.paper);
      } else {
        this.closePaperModal();
      }
    });
    
    // 添加键盘事件
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeDestroy() {
    // 移除事件监听
    this.$bus.$off('showPaperModal');
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
</script>

<style>
#app {
  font-family: 'Noto Sans SC', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* 全局模态框样式 */
.global-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* 降低z-index，确保在提示消息之下 */
  backdrop-filter: blur(3px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.global-modal-overlay.show {
  opacity: 1;
}

/* 模态框动画 */
.global-modal-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.global-modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.global-modal-fade-enter-from,
.global-modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

.global-modal-content {
  background-color: #fff;
  border-radius: 12px;
  width: 700px;
  max-width: 90%;
  position: relative;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.global-modal-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.global-modal-header {
  padding: 20px 30px;
  border-bottom: 1px solid #f0f2f5;
}

.global-modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.global-modal-body {
  padding: 20px 30px;
  overflow-y: auto;
  flex: 1;
}

.global-modal-section {
  margin-bottom: 24px;
}

.global-modal-section h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #606266;
  display: flex;
  align-items: center;
}

.global-modal-section h3 i {
  margin-right: 6px;
  color: #409EFF;
}

.global-modal-section p {
  margin: 0;
  line-height: 1.6;
}

.global-modal-section.theme-section .global-themes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.global-modal-section.theme-section .global-theme-tag {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-width: 80px;
  height: 32px;
  line-height: 20px;
}

.global-modal-section.global-modal-info {
  display: flex;
  gap: 30px;
}

.global-modal-info .global-info-item {
  display: flex;
  align-items: flex-start;
}

.global-modal-info .global-info-item i {
  font-size: 18px;
  color: #409EFF;
  margin-right: 10px;
  margin-top: 3px;
}

.global-modal-info .global-info-item h4 {
  margin: 0 0 4px 0;
  color: #606266;
  font-size: 14px;
  font-weight: normal;
}

.global-modal-info .global-info-item p {
  margin: 0;
  font-weight: 500;
  color: #303133;
}

.global-author-list {
  line-height: 1.8;
}

.global-author-name {
  color: #1a73e8;
  cursor: pointer;
}

.global-author-name:hover {
  text-decoration: underline;
}

.global-paper-abstract {
  text-align: justify;
  color: #606266;
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #409EFF;
}

.global-modal-footer {
  padding: 15px 30px;
  border-top: 1px solid #f0f2f5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.global-close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #909399;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 2;
}

.global-close-button:hover {
  background-color: #f2f4f8;
  color: #606266;
}
</style>
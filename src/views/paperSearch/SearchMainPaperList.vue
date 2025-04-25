<template>
  <div class="recomListContainer">
    <div class="list-content">
      <!-- 顶部：图标 + 标题 -->
      <div class="recomListTop">
        <div class="paper-icon">
          <svg-icon icon-class="pdf" class="pdf-icon" />
        </div>
        <h3 @click="openModal" class="clickable-title">
          {{ capitalizeTitle(paper.title) || '— 未知标题 —' }}
        </h3>
      </div>
      <!-- 中部：作者 + 信息 + 操作 -->
      <div class="recomListMid">
        <div class="authors">
          <span v-for="(a, i) in displayedAuthors" :key="i" class="author-name">
            {{ a }}<span v-if="i < displayedAuthors.length - 1">, </span>
          </span>
          <span v-if="!displayedAuthors.length" class="author-name">未知作者</span>
          <span v-if="hasEtAl"> et al.</span>
        </div>
        <div class="paper-meta">
          <span class="meta-item">
            <i class="el-icon-date"></i> {{ paper.year || '—' }}
          </span>
          <span class="meta-item">
            <i class="el-icon-reading"></i> 引用: {{ paper.ncitation || 0 }}
          </span>
          <div class="theme-tags">
            <el-tag v-for="(t, idx) in themesList" :key="idx" size="mini" effect="plain" type="info" class="theme-tag">
              {{ t }}
            </el-tag>
            <el-tag v-if="!themesList.length" size="mini" effect="plain" type="info" class="theme-tag">
              未知领域
            </el-tag>
          </div>
          <el-button size="mini" type="primary" plain round icon="el-icon-view" class="view-btn"
            @click.stop="openModal">查看详情</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchPaperListItem',
  props: {
    paper: { type: Object, required: true }
  },
  data() {
    return {
      maxLength: 6,
      functionWords: [
        'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'so', 'yet',
        'at', 'by', 'in', 'of', 'on', 'to', 'up', 'with', 'from', 'into',
        'during', 'including', 'until', 'against', 'among', 'throughout',
        'despite', 'towards', 'upon', 'concerning'
      ],
      specialAcronyms: {
        ieee: 'IEEE',
        acm: 'ACM'
      }
    };
  },
  computed: {
    authorsArray() {
      const a = this.paper.authors;
      let arr = [];
      if (typeof a === 'string') {
        arr = a.split(/[,;，；]/).map(s => s.trim()).filter(Boolean);
      } else if (Array.isArray(a)) {
        arr = a;
      }
      return arr.map(name => {
        return name.split(/\s+/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
      });
    },
    displayedAuthors() {
      return this.authorsArray.slice(0, this.maxLength);
    },
    hasEtAl() {
      return this.authorsArray.length > this.maxLength;
    },
    themesList() {
      const f = this.paper.field;
      if (Array.isArray(f)) {
        return f.filter(Boolean);
      } else if (typeof f === 'string' && f.trim()) {
        return [f.trim()];
      }
      return [];
    }
  },
  methods: {
    capitalizeTitle(title) {
      if (!title || typeof title !== 'string') return '';
      const words = title.toLowerCase().split(/\s+/);
      const len = words.length;
      return words.map((word, idx) => {
        const lw = word.toLowerCase();
        if (this.specialAcronyms[lw]) {
          return this.specialAcronyms[lw];
        }
        if (idx !== 0 && idx !== len - 1 && this.functionWords.includes(lw)) {
          return lw;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    },
    openModal() {
      const modalPaper = { ...this.paper, authors: this.authorsArray };
      this.$bus.$emit('showPaperModal', { paper: modalPaper, show: true });
    }
  }
};
</script>

<style scoped lang="scss">
.recomListContainer {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  transition: box-shadow 0.3s;
}

.recomListContainer:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recomListTop {
  display: flex;
  align-items: flex-start;
}

.recomListTop .paper-icon {
  margin: 4px 12px 0 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9a9e 0%, #f56c6c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(245, 108, 108, 0.2);
}

.recomListTop .pdf-icon {
  font-size: 16px;
  color: #fff;
}

.clickable-title {
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: #2c3e50;
  cursor: pointer;
}

.clickable-title:hover {
  color: #3498db;
}

.recomListMid {
  display: flex;
  flex-direction: column;
  padding-left: 32px;
  gap: 8px;
}

.authors {
  font-size: 14px;
  color: #7f8c8d;
}

.author-name {
  color: #3498db;
  transition: color 0.2s;
}

.author-name:hover {
  color: #2980b9;
  text-decoration: underline;
}

.paper-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #95a5a6;
}

.meta-item i {
  margin-right: 4px;
}

.meta-item .el-icon-date {
  color: #3498db;
}

.meta-item .el-icon-reading {
  color: #f39c12;
}

.theme-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.theme-tag {
  font-size: 12px;
  padding: 0 6px;
  height: 22px;
  line-height: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #2c3e50;
  border: none;
}

.view-btn {
  margin-left: auto;
  transition: all 0.3s;
  background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
  border: none;
  color: #fff;
}

.view-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 123, 255, 0.3);
  background: linear-gradient(135deg, #00b5e9 0%, #0052d6 100%);
}
</style>

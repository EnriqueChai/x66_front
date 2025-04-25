<template>
  <div class="searchPaperListContainer" @click="openModal">
    <!-- 顶部：图标 + 标题 + 推荐标签 -->
    <div class="searchPaperLsitTop">
      <svg-icon icon-class="pdf" />
      <h3 class="clickable-title">{{ formatTitle(paper.title) || '未知标题' }}</h3>
      <el-tag v-if="paper.rec" class="recommend-tag" type="success" effect="light" size="small">
        你可能感兴趣
      </el-tag>
    </div>

    <!-- 中部：作者列表 + 摘要 -->
    <div class="searchPaperLsitMid">
      <div class="authors">
        <span v-for="(author, idx) in displayedAuthors" :key="idx" class="author-name">
          {{ author }}<span v-if="idx < displayedAuthors.length - 1">, </span>
        </span>
        <span v-if="hasEtAl">, et al.</span>
      </div>
      <div class="abstract">{{ formatAbstract(paper.abstractText) }}</div>
    </div>

    <!-- 底部：引用量 + 期刊+年份 + 研究领域 -->
    <div class="searchPaperLsitBottom">
      <div class="bottomLeft">
        <span class="quote">引用 {{ paper.ncitation || 0 }}</span>
        <span class="venue-year">{{ formatVenue(paper.venue) }} {{ paper.year || '未知' }}</span>
        <span v-if="paper.field" class="field">研究领域：{{ formatField(paper.field) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchPaperListItem',
  props: {
    paper: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data() {
    return {
      // 小词表：在标题和期刊中不强制首字母大写
      functionWords: [
        'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'so', 'yet',
        'at', 'by', 'in', 'of', 'on', 'to', 'up', 'with', 'from', 'into',
        'during', 'including', 'until', 'against', 'among', 'throughout',
        'despite', 'towards', 'upon', 'concerning'
      ],
      // 常见缩写词保持大写
      specialAcronyms: {
        ieee: 'IEEE',
        acm: 'ACM'
      },
      maxLength: 6
    };
  },
  computed: {
    // 拆分作者并格式化
    authorsArray() {
      return this.splitAuthors(this.paper.authors);
    },
    // 前 maxLength 个作者
    displayedAuthors() {
      return this.authorsArray.slice(0, this.maxLength);
    },
    // 是否超过 maxLength
    hasEtAl() {
      return this.authorsArray.length > this.maxLength;
    }
  },
  methods: {
    // 统一触发全局模态显示，由 App.vue 监听
    openModal() {
      this.$bus.$emit('showPaperModal', {
        // 把 authorsArray 直接替换掉 paper.authors
        paper: {
          ...this.paper,
          authors: this.authorsArray
        },
        show: true
      });
    },

    // 分割作者字符串 → 数组
    splitAuthors(authors) {
      if (Array.isArray(authors)) {
        return authors.map(a => this.capitalizeName(a));
      }
      if (typeof authors === 'string') {
        return authors
          .split(/[;,，；]/)
          .map(a => this.capitalizeName(a.trim()))
          .filter(a => a);
      }
      return [];
    },

    // 首字母大写，其他小写
    capitalizeName(name) {
      return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    },

    // 格式化标题（同理可用于期刊、领域）
    formatTitle(title) {
      return this.normalizeCase(title, this.functionWords);
    },

    formatVenue(venue) {
      return this.normalizeCase(venue, this.functionWords);
    },

    formatField(field) {
      if (Array.isArray(field)) {
        return field.map(f => this.normalizeCase(f, this.functionWords)).join(', ');
      }
      return this.normalizeCase(field, this.functionWords);
    },

    // 将纯大写或纯小写文本转换为标题式大小写，保留缩写
    normalizeCase(text = '', smallWords = []) {
      const t = String(text).trim();
      if (!t) return '';
      const isUpper = t === t.toUpperCase();
      const isLower = t === t.toLowerCase();
      let words = t.split(/\s+/);
      if (isUpper || isLower) {
        words = words.map((w, i) => {
          const lw = w.toLowerCase();
          if (this.specialAcronyms[lw]) {
            return this.specialAcronyms[lw];
          }
          if (smallWords.includes(lw) && i > 0 && i < words.length - 1) {
            return lw;
          }
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        });
        return words.join(' ');
      }
      return t;
    },

    // 摘要直接返回或提示
    formatAbstract(abstract) {
      const a = String(abstract || '').trim();
      return a ? a : '暂无摘要信息。';
    }
  }
};
</script>

<style lang="scss">
.searchPaperListContainer {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #fafafa;
  }

  .searchPaperLsitTop {
    display: flex;
    align-items: center;

    svg-icon {
      font-size: 20px;
      color: #f56c6c;
    }

    .clickable-title {
      margin: 0 12px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .recommend-tag {
      margin-left: auto;
    }
  }

  .searchPaperLsitMid {
    margin-top: 8px;

    .authors {
      font-size: 14px;
      color: #555;

      .author-name {
        color: #007acc;
      }
    }

    .abstract {
      margin-top: 6px;
      font-size: 14px;
      color: #666;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .searchPaperLsitBottom {
    margin-top: 10px;

    .bottomLeft {
      display: flex;
      align-items: center;
      font-size: 13px;
      color: #777;

      .quote {
        color: #ac6df4;
        margin-right: 12px;
      }

      .venue-year {
        margin-right: 12px;
      }

      .field {
        color: #e98372;
      }
    }
  }
}
</style>
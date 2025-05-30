<template>
  <div class="firstSide" v-loading="loading">
    <h3>专家技术特长</h3>
    <div ref="wordCloudChart" class="wordCloud"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { getAuthorInfo } from '@/api/authorInfo'
import { getFieldInfo } from '@/api/getField'
import eventBus from '@/utils/eventBus'

export default {
  name: 'PersonalWordCloud',
  props: {
    authorId: {
      type: String,
      required: true
    },
    authorField: {  // 添加新的prop
      type: String,
      default: ''
    }
  },
  data() {
    return {
      words: [],
      loading: true,
      authorInfo: null, // 存储作者信息
      colors: [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
        '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
        '#bcbd22', '#17becf'
      ],
      chart: null
    }
  },
  watch: {
    authorId(newId) {
      if (newId) {
        this.fetchAuthorTags()
      }
    },
    authorField: {
      immediate: true,
      handler(newVal) {
        console.log('PersonalWordCloud - authorField changed:', newVal)
      }
    }
  },
  created() {
    if (this.authorId) {
      this.fetchAuthorTags()
    }
    console.log('PersonalWordCloud - authorField prop:', this.authorField)
    
    // 监听作者信息更新事件
    eventBus.on('author-info-updated', this.handleAuthorInfoUpdate)
    // 监听作者领域更新事件
    eventBus.on('author-field-updated', this.handleAuthorFieldUpdate)
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resizeChart)
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.resizeChart)
    
    // 移除事件监听
    eventBus.off('author-info-updated', this.handleAuthorInfoUpdate)
    eventBus.off('author-field-updated', this.handleAuthorFieldUpdate)
  },
  methods: {
    // 处理作者信息更新
    handleAuthorInfoUpdate(authorInfo) {
      this.authorInfo = authorInfo
    },
    // 处理作者领域更新
    handleAuthorFieldUpdate(fieldName) {
      this.authorField = fieldName
    },
    async fetchAuthorTags() {
      this.loading = true
      try {
        const res = await getAuthorInfo(this.authorId)
        this.authorInfo = res
        
        const tag = res.tags
        let parsedData;
        if (typeof tag === 'string') {
          const formattedString = tag.replace(/'/g, '"');
          try {
            parsedData = JSON.parse(formattedString);
          } catch (error) {
            this.loading = false
            return;
          }
        } else {
          parsedData = tag;
        }

        if (Array.isArray(parsedData)) {
          const splitWords = this.splitNames(parsedData)
          this.words = this.aggregateWords(splitWords)
          this.updateChart()
        } else {
          this.words = []
          this.updateChart()
        }
      } catch (error) {
        this.words = []
        this.updateChart()
      } finally {
        this.loading = false
      }
    },
    splitNames(parsedData) {
      const splitWords = []
      parsedData.forEach(item => {
        const name = item.t
        const value = item.w
        const words = name.split(/\s+/)
        words.forEach(word => {
          const trimmedWord = word.trim()
          if (trimmedWord) {
            splitWords.push({
              name: trimmedWord,
              value: value
            })
          }
        })
      })
      return splitWords
    },
    aggregateWords(splitWords) {
      const wordMap = new Map()
      splitWords.forEach(item => {
        const name = item.name
        const value = item.value
        if (wordMap.has(name)) {
          wordMap.set(name, wordMap.get(name) + value)
        } else {
          wordMap.set(name, value)
        }
      })
      const aggregated = []
      wordMap.forEach((value, name) => {
        aggregated.push({ name, value })
      })
      aggregated.sort((a, b) => b.value - a.value)
      return aggregated.slice(0, 12)
    },
    colorFunction(word, weight, fontSize, random, rotate, origin) {
      return this.colors[Math.floor(Math.random() * this.colors.length)]
    },
    initChart() {
      const chartDom = this.$refs.wordCloudChart
      this.chart = echarts.init(chartDom)
      this.updateChart()
    },
    updateChart() {
      if (!this.chart) return
      const option = {
        tooltip: {
          show: true
        },
        series: [{
          type: 'wordCloud',
          width: '100%',
          height: '100%',
          shape: 'rectangular',
          gridSize: 5,
          sizeRange: [15, 55],
          rotationRange: [0, 0],
          rotationStep: 0,
          spiral: 'archimedean',
          textPadding: 1,
          drawOutOfBound: true,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: this.colorFunction,
            cursor: 'pointer'
          },
          emphasis: {
            textStyle: {
              textShadowBlur: 10,
              textShadowColor: 'rgba(0, 0, 0, 0.15)'
            }
          },
          data: this.words
        }]
      }
      this.chart.setOption(option)
      
      this.chart.off('click')
      this.chart.on('click', (params) => {
        console.log('词云项被点击:', params);
        this.navigateToAuthorField();
      })
    },
    // 导航到作者的主要研究领域
    navigateToAuthorField() {
      if (this.authorField) {
        const encodedFieldName = encodeURIComponent(this.authorField);
        const route = this.$router.resolve({
          name: 'fieldProfile',
          params: { field_name: encodedFieldName }
        });
        window.open(route.href, '_blank');
      } else {
        this.$message.warning('该专家没有指定研究领域');
      }
    },
    
    resizeChart() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style lang="scss">
.firstSide {
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  height: 450px;
  animation: fadeIn 1s ease-out;

  h3 {
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 15px 0;
    color: #2c3e50;
    background: linear-gradient(90deg, #5271ff, #3195ff, #00b8ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .wordCloud {
    height: 380px;
    width: 100%;
    transition: all 0.3s ease;
    cursor: pointer;
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

@media (max-width: 768px) {
  .firstSide {
    padding: 15px;
    min-height: 300px;

    .wordCloud {
      height: 250px;
    }
  }
}
</style>
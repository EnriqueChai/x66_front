<template>
  <div class="firstSide" v-loading="loading">
    <h3>研究兴趣</h3>
    <!-- <hr> -->
    <div ref="wordCloudChart" class="wordCloud"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { getAuthorInfo } from '@/api/authorInfo'

export default {
  name: 'PersonalWordCloud',
  props: {
    authorId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      words: [],
      loading: true,
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
    }
  },
  created() {
    if (this.authorId) {
      this.fetchAuthorTags()
    }
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
  },
  methods: {
    async fetchAuthorTags() {
      this.loading = true
      try {
        const res = await getAuthorInfo(this.authorId)
        const tag = res.tags
        let parsedData;
        if (typeof tag === 'string') {
          const formattedString = tag.replace(/'/g, '"');
          try {
            parsedData = JSON.parse(formattedString);
          } catch (error) {
            console.error('Failed to parse authorTag:', error);
            this.loading = false
            return;
          }
        } else {
          parsedData = tag;
        }

        if (Array.isArray(parsedData)) {
          const splitWords = this.splitNames(parsedData)
          this.words = this.aggregateWords(splitWords)
          console.log("解析后的词云数据:", this.words)
          this.updateChart()
        } else {
          console.warn('authorTag is not an array:', parsedData);
          this.words = []
          this.updateChart()
        }
      } catch (error) {
        console.error('获取作者标签数据失败:', error)
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
          shape: 'rectangular', // 使用矩形形状，更紧凑
          gridSize: 5,           // 减小网格大小，使词云更加密集
          sizeRange: [15, 55],   // 调整字体大小范围
          rotationRange: [0, 0], // 禁用旋转，使词语排列更整齐
          rotationStep: 0,
          spiral: 'archimedean', // 设置螺旋形状为 archimedean
          textPadding: 1,        // 减少词语间距
          drawOutOfBound: true, // 不绘制出界词语
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: this.colorFunction
          },
          data: this.words
        }]
      }
      this.chart.setOption(option)
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
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 15px;
  margin: 0 0 30px 15px;

  h3 {
    margin-left: 13px;
  }

  .wordCloud {
    height: 350px;
    width: 100%;
  }
}
</style>
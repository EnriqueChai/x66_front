<template>
  <div class="thirdSide">
    <h3>潜在合作网络</h3>
    <div class="network-container" v-loading="loading">
      <svg ref="svg" class="network-svg" :width="width" :height="height" v-show="!loading && simAuthor.length > 0">
        <g ref="links" class="links"></g>
        <g ref="nodes" class="nodes"></g>
      </svg>
      <div v-show="!loading && simAuthor.length === 0" class="empty-state">
        <i class="el-icon-warning-outline"></i>
        <span>暂无相似作者数据</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { getSimAuthor } from '@/api/authorInfo'
import eventBus from '@/utils/eventBus'

export default {
  props: {
    authorId: {
      type: String,
      required: true
    },
    modelId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      simAuthor: [],
      loading: true,
      simulation: null,
      currentAuthor: null,
      width: 400,
      height: 300
    }
  },
  watch: {
    authorId(newId) {
      if (newId) {
        this.fetchSimilarAuthors()
      }
    },
    modelId(newId) {
      if (newId) {
        this.fetchSimilarAuthors()
      }
    }
  },
  created() {
    if (this.authorId) {
      this.fetchSimilarAuthors()
    }
    // 监听作者信息更新事件
    eventBus.on('author-info-updated', this.handleAuthorInfoUpdate)
  },
  mounted() {
    this.$nextTick(() => {
      this.updateContainerSize()
      this.initSimulation()
      this.updateGraph() // 强制初始渲染
      // 监听窗口大小变化
      window.addEventListener('resize', this.handleResize)
      // 添加缩放功能
      this.initZoom()
    })
  },
  beforeDestroy() {
    if (this.simulation) {
      this.simulation.stop()
    }
    // 移除事件监听
    eventBus.off('author-info-updated', this.handleAuthorInfoUpdate)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    updateContainerSize() {
      // 获取容器真实宽高
      const container = this.$refs.svg ? this.$refs.svg.parentElement : null
      if (container) {
        this.width = container.clientWidth || 400
        this.height = container.clientHeight || 300
      }
      console.log('[updateContainerSize] width:', this.width, 'height:', this.height)
    },
    handleResize() {
      this.updateContainerSize()
      if (this.simulation) {
        this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2))
        this.simulation.alpha(0.3).restart()
      }
      this.$nextTick(() => {
        this.updateGraph()
      })
    },
    handleAuthorInfoUpdate(authorInfo) {
      console.log('Received author info:', authorInfo)
      this.currentAuthor = authorInfo
      if (this.simAuthor.length > 0) {
        this.$nextTick(() => {
          console.log('Updating graph after author info update')
          this.updateGraph()
        })
      }
    },
    async fetchSimilarAuthors() {
      try {
        const res = await getSimAuthor(this.authorId, this.modelId)
        console.log('Similar authors:', res)
        if (res && res.status === 'ok' && Array.isArray(res.similar_authors)) {
          this.simAuthor = res.similar_authors
          if (this.currentAuthor) {
            this.$nextTick(() => {
              console.log('Updating graph after fetching similar authors')
              this.updateGraph()
            })
          }
        } else {
          console.warn('getSimilarAuthors API response format invalid:', res)
          this.simAuthor = []
        }
        this.loading = false
      } catch (error) {
        console.error('获取相似作者数据失败:', error)
        this.simAuthor = []
        this.loading = false
      }
    },
    initSimulation() {
      this.simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id).distance(120))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .force('collision', d3.forceCollide().radius(50))
        .alphaDecay(0.3)
        .velocityDecay(0.4);

      // 添加布局稳定后的处理
      this.simulation.on('end', () => {
        console.log('Simulation ended');
        this.simulation.stop();
      });

      this.simulation.on('tick', () => {
        if (!this._nodesRef) return;
        const linkSelection = d3.select(this.$refs.links).selectAll('line');
        const nodeSelection = d3.select(this.$refs.nodes).selectAll('g');
        this._nodesRef.forEach(d => {
          if (d.x !== undefined && d.y !== undefined) {
            const padding = 20;
            if (d.x < padding) d.x = padding;
            else if (d.x > this.width - padding) d.x = this.width - padding;
            if (d.y < padding) d.y = padding;
            else if (d.y > this.height - padding) d.y = this.height - padding;
          }
        })
        linkSelection
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)
        nodeSelection
          .attr('transform', d => `translate(${d.x},${d.y})`)
      })
    },
    initZoom() {
      const svg = d3.select(this.$refs.svg)
      const zoom = d3.zoom()
        .scaleExtent([0.5, 3]) // 限制缩放范围
        .on('zoom', (event) => {
          d3.select(this.$refs.nodes).attr('transform', event.transform)
          d3.select(this.$refs.links).attr('transform', event.transform)
        })

      svg.call(zoom)

      // 双击重置缩放
      svg.on('dblclick', () => {
        svg.transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity)
      })
    },
    updateGraph() {
      this.updateContainerSize()
      if (!this.$refs.svg || !this.currentAuthor) {
        console.log('[updateGraph] svg or currentAuthor missing', this.$refs.svg, this.currentAuthor)
        return
      }
      const validAuthors = this.simAuthor.filter(a => a.id && a.name);
      // 深拷贝，避免 Observer
      const nodes = [
        {
          id: this.authorId,
          name: this.currentAuthor.authorName,
          isCenter: true,
          picture: this.currentAuthor.picture,
          weight: 1
        },
        ...validAuthors.map(author => ({
          id: author.id.toString(),
          name: author.name,
          isCenter: false,
          picture: author.picture,
          weight: author.weight
        }))
      ];
      const links = validAuthors.map(author => ({
        source: this.authorId,
        target: author.id.toString(),
        weight: author.weight
      }));
      // 保存引用供 tick 用
      this._nodesRef = nodes;
      this._linksRef = links;
      // 清空旧内容
      d3.select(this.$refs.links).selectAll('*').remove()
      d3.select(this.$refs.nodes).selectAll('*').remove()
      if (this.simulation) {
        this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2))
        // 根据权重调整连接线的距离
        this.simulation.force('link', d3.forceLink().id(d => d.id)
          .distance(d => 120 * (1 - d.weight * 0.3))) // 权重越高，距离越近
        this.simulation.nodes([...nodes])
        this.simulation.force('link').links([...links])
        if (!this._prevNodeCount || this._prevNodeCount !== nodes.length) {
          this.simulation.alpha(1).restart()
          this._prevNodeCount = nodes.length
          setTimeout(() => {
            if (this.simulation) {
              this.simulation.alpha(0);
              this.simulation.stop();
            }
          }, 500);
        }
      }
      // 绘制连接线
      d3.select(this.$refs.links)
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', '#00b8ff')
        .attr('stroke-width', d => 1 + d.weight * 4) // 增加权重对线条粗细的影响
        .attr('stroke-opacity', d => 0.2 + d.weight * 0.6) // 增加权重对透明度的影响
        .attr('stroke-linecap', 'round') // 添加圆角线帽，使线条看起来更平滑
      // 绘制节点
      const nodeEnter = d3.select(this.$refs.nodes)
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(d3.drag()
          .on('start', this.dragstarted)
          .on('drag', this.dragged)
          .on('end', this.dragended)
        )
        .on('click', (event, d) => {
          if (!d.isCenter) {
            const route = this.$router.resolve({
              path: '/personalPage',
              query: { authorId: d.id }
            });
            window.open(route.href, '_blank');
          }
        })

      // 添加头像图片
      nodeEnter.append('circle')
        .attr('r', d => d.isCenter ? 20 : 16)
        .attr('fill', '#fff')
        .attr('stroke', d => d.isCenter ? '#5271ff' : '#3195ff')
        .attr('stroke-width', 2)

      // 添加头像图片
      nodeEnter.append('image')
        .attr('x', d => d.isCenter ? -15 : -12)
        .attr('y', d => d.isCenter ? -15 : -12)
        .attr('width', d => d.isCenter ? 30 : 24)
        .attr('height', d => d.isCenter ? 30 : 24)
        .attr('xlink:href', d => d.picture || require('@/assets/touxiang.jpg'))
        .attr('clip-path', 'circle(50%)')
        .on('error', function () {
          // 图片加载失败时使用默认头像
          d3.select(this)
            .attr('xlink:href', require('@/assets/touxiang.jpg'))
        })

      // 添加作者名称
      nodeEnter.append('text')
        .attr('dy', d => d.isCenter ? 30 : 25)
        .attr('text-anchor', 'middle')
        .attr('fill', '#2c3e50')
        .attr('font-size', d => d.isCenter ? '12px' : '10px')
        .text(d => this.formatAuthorName(d.name))
    },
    formatAuthorName(name) {
      if (!name) return '';
      const nameParts = name.trim().split(' ');
      if (nameParts.length === 1) {
        return `${nameParts[0].charAt(0).toUpperCase()}.`;
      } else {
        const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
        const lastName = nameParts[nameParts.length - 1];
        const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
        return `${firstNameInitial}. ${capitalizedLastName}`;
      }
    },
    dragstarted(event, d) {
      if (!event.active) this.simulation.alphaTarget(0.1).restart();
      d.fx = d.x;
      d.fy = d.y;
    },
    dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    },
    dragended(event, d) {
      if (!event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      this.simulation.alpha(0);
    }
  }
}
</script>

<style lang="scss">
.thirdSide {
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  height: 450px;

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

  .network-container {
    width: 100%;
    height: 380px;
    position: relative;
    overflow: hidden;

    .network-svg {
      width: 100%;
      height: 100%;
      border: 1px solid #eee;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }

    .node {
      cursor: pointer;
      transition: all 0.3s ease-out;

      &:hover {
        circle {
          r: 22px; // 中心节点
          stroke: #3d5eff;
          stroke-width: 3px;
        }

        image {
          width: 32px;
          height: 32px;
          x: -16px;
          y: -16px;
        }

        text {
          font-size: 14px;
          fill: #1a1a1a;
        }
      }

      circle {
        transition: all 0.3s ease-out;
      }

      image {
        transition: all 0.3s ease-out;
      }

      text {
        transition: all 0.3s ease-out;
      }
    }

    .empty-state {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #909399;

      i {
        font-size: 40px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
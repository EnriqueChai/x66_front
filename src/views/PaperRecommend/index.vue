<template>
  <div class="recomBackPage">
    <div class="animated-background" />
    <div class="content-wrapper">
    <div class="recomHead">
      <RecomHead />
    </div>

      <div class="dashboard-container">
        <!-- 左侧内容区 -->
        <div class="main-content">
          <transition name="fade">
            <RecomMain v-if="recodeMainRef" :paperData="paperData" />
          </transition>
        </div>
        
        <!-- 右侧推荐区 -->
        <div class="side-content" v-if="recodeMainRef">
          <RecomAuthors />
          <RecomVenues />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecomHead from './RecomHead.vue'
import RecomMain from './RecomMain.vue'
import RecomAuthors from './RecomAuthors.vue'
import RecomVenues from './RecomVenues.vue'
import { getRecomPaper } from '@/api/getRecomPaper'

export default {
  components: {
    RecomHead,
    RecomMain,
    RecomAuthors,
    RecomVenues
  },
  data() {
    return {
      recodeMainRef: false,
      paperData: [],
      topAuthors: [],
      venues: []
    }
  },
  created() {
    // 获取数据
    this.fetchData();
    
    setTimeout(() => {
      this.recodeMainRef = true
    }, 300)
  },
  methods: {
    async fetchData() {
      try {
        // 只获取论文数据，其他使用临时数据
        const paperRes = await this.fetchPaperData();
        
        // 处理数据
        if (paperRes && Array.isArray(paperRes)) {
          this.paperData = paperRes.map(this.formatPaperData);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        // 加载失败时使用示例数据
        this.loadSampleData();
      }
    },
    
    async fetchPaperData() {
      try {
        return await getRecomPaper();
      } catch (error) {
        console.error('获取推荐论文数据失败:', error);
        return [];
      }
    },
    
    formatPaperData(paper) {
      return {
        id: paper.id || paper.auto_id,
        title: paper.title || 'Unknown Title',
        authors: paper.authors || [],
        year: paper.time,
        citations: paper.citations || Math.floor(Math.random() * 1000), // 随机生成引用次数，需要后端补充
        abstract: paper.abstract || paper.summary || '',
        themes: paper.themes || paper.keywords || [],
        pdfUrl: paper.pdfUrl || ''
      };
    },
    
    loadSampleData() {
      // 加载示例数据
      try {
        // 这里模拟从json文件加载数据
        const sampleData = {
          papers: [
            {
              auto_id: 260605,
              id: 2161969291,
              title: "Histograms of Oriented Gradients for Human Detection",
              type: "paper",
              year: 2005,
              citations: 3730,
              abstract: "We study the question of feature sets for robust visual object recognition; adopting linear SVM‑based human detection as a test case...",
              themes: ["Feature Engineering","Human Detection"],
              author_regions: ["France","UK"],
              author_affiliations: ["INRIA","University of Oxford"]
            },
            {
              auto_id: 265141,
              id: 2108598243,
              title: "ImageNet: A Large‑Scale Hierarchical Image Database",
              type: "paper",
              year: 2009,
              citations: 3259,
              abstract: "We introduce ImageNet, a large‑scale ontology of images built upon the WordNet structure, aiming to populate 80,000 synsets with over 14 million images...",
              themes: ["Dataset","Large‑Scale Learning"],
              author_regions: ["China","USA"],
              author_affiliations: ["Princeton University","Stanford University"]
            },
            {
              auto_id: 263433,
              id: 2194775991,
              title: "Deep Residual Learning for Image Recognition",
              type: "paper",
              year: 2016,
              citations: 2630,
              abstract: "We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously...",
              themes: ["Deep Learning","Image Recognition"],
              author_regions: ["China"],
              author_affiliations: ["Microsoft Research Asia"]
            }
          ]
        };

        this.paperData = sampleData.papers;
      } catch (error) {
        console.error('加载示例数据失败:', error);
      }
    }
  }
}
</script>

<style lang="scss">
.recomBackPage {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  
  .animated-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
    z-index: -1;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 400px;
      background: url(../../assets/bg_dingbu.png) no-repeat center top;
      background-size: cover;
      z-index: -1;
      opacity: 0.8;
      animation: slowFloat 15s infinite alternate ease-in-out;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%);
      z-index: 0;
      animation: pulse 15s infinite alternate;
    }
  }
  
  .content-wrapper {
    position: relative;
    z-index: 1;
    padding-top: 29px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
    min-height: 100vh;
    
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 200px;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(224, 236, 255, 0.5) 100%);
      z-index: -1;
    }
  }

  .recomHead {
    width: 1300px;
    max-width: 95%;
    margin: 0 auto 30px;
    min-height: 250px;
    animation: slideDown 0.8s ease-out;
  }

  .dashboard-container {
    display: flex;
    width: 1300px;
    max-width: 95%;
    margin: 0 auto 30px;
    gap: 20px;
    box-sizing: border-box;
    animation: fadeIn 1s ease-in;
    
    .main-content {
      flex: 3;
      min-width: 0;
      transform: translateY(0);
      transition: all 0.5s ease;
      
      &:hover {
        transform: translateY(-5px);
      }
      
      .recomMainContainer {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.7);
      }
    }
    
    .side-content {
      flex: 1;
      min-width: 320px;
      max-width: 380px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      
      .side-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.7);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.5s ease;
        
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.07);
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
}

@keyframes slowFloat {
  0% {
    transform: translateY(0) scale(1);
  }
  100% {
    transform: translateY(-20px) scale(1.03);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
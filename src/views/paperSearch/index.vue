<template>
  <div class="searchBackPage">
    <div class="animated-background" />
    <div class="content-wrapper">
      <SearchHead :searchType="currentView" />
      <div class="translate-tip" v-if="hasTranslation">
        <el-alert
          type="info"
          :closable="false"
          show-icon>
          <div class="translate-tip-content">
            <span>已将中文搜索词 "<strong>{{ originalTerm }}</strong>" 翻译为 "<strong>{{ translatedTerm }}</strong>" 进行搜索</span>
          </div>
        </el-alert>
      </div>
      <div class="content">
        <!-- 分段切换按钮 -->
        <div class="switchBtn">
          <el-button round @click="toggleView('author')" :class="{ active: currentView === 'author' }">作者</el-button>
          <el-button round @click="toggleView('paper')" :class="{ active: currentView === 'paper' }">论文</el-button>
          <el-button round @click="toggleView('conference')"
            :class="{ active: currentView === 'conference' }">会议</el-button>
        </div>
        <transition name="fade" mode="out-in">
          <SearchMain v-if="currentView === 'author'" key="author" />
          <SearchMainPaper v-if="currentView === 'paper'" key="paper" />
          <SearchMainConference v-if="currentView === 'conference'" key="conference" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchHead from './SearchHead.vue'
import SearchMain from './SearchMain.vue'
import SearchMainPaper from './SearchMainPaper.vue'
import SearchMainConference from './SearchMainConference.vue'

export default {
  components: {
    SearchHead,
    SearchMain,
    SearchMainPaper,
    SearchMainConference
  },
  data() {
    return {
      currentView: 'author'
    };
  },
  computed: {
    ...mapGetters('search', [
      'getOriginalTerm',
      'getTranslatedTerm',
      'hasTranslation'
    ]),
    originalTerm() {
      return this.getOriginalTerm;
    },
    translatedTerm() {
      return this.getTranslatedTerm;
    }
  },
  methods: {
    toggleView(view) {
      this.currentView = view;
    }
  }
}
</script>

<style lang="scss">
.searchBackPage {
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
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.5) 100%);
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

    .content {
      display: flex;
      flex-direction: column;
      width: 1300px;
      max-width: 95%;
      margin: 0 auto 30px;
    }
  }

  .translate-tip {
    max-width: 900px;
    margin: 0 auto 15px;
    padding: 0 20px;
    
    .translate-tip-content {
      font-size: 14px;
      
      strong {
        font-weight: 600;
        color: #409EFF;
      }
    }
    
    .el-alert {
      padding: 10px 16px;
      border-radius: 8px;
    }
  }
}

/* -------- 分段切换器 -------- */
.switchBtn {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  border-radius: 40px;
  padding: 4px;
  margin: 0 auto 30px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);

  .el-button {
    background: transparent;
    border: none;
    color: #555;
    font-weight: 600;
    padding: 8px 24px;
    margin: 0;
    position: relative;
    transition: color 0.3s;

    &.active {
      color: #fff;
    }

    &.active::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 36px;
      background: linear-gradient(135deg, #2bd7ee 0%, #478fe7 100%);
      z-index: -1;
      transition: all 0.3s;
    }

    &:hover:not(.active) {
      color: #ff7e5f;
    }
  }
}

/* -------- 过渡动画 -------- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* -------- 背景动画 keyframes -------- */
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
</style>
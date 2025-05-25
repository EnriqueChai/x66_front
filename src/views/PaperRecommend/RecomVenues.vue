<template>
  <div class="side-card venues-card">
    <div class="card-header">
      <h3><i class="el-icon-collection"></i> 期刊/会议推荐</h3>
    </div>
    
    <div class="venue-list">
      <div v-for="(venue, vIndex) in localVenues" :key="venue.id" class="venue-item">
        <div class="venue-title">
          <div class="venue-badge">{{ venue.short_name }}</div>
          <h4>{{ venue.full_name }}</h4>
        </div>
        
        <div class="venue-details">
          <div class="venue-stat">
            <span class="stat-label">CCF</span>
            <span class="stat-value" :class="{
              'ccf-a': venue.metrics.ccf_rank === 'A',
              'ccf-b': venue.metrics.ccf_rank === 'B',
              'ccf-c': venue.metrics.ccf_rank === 'C'
            }">{{ venue.metrics.ccf_rank }}</span>
          </div>
          <div class="venue-stat">
            <span class="stat-label">Accept</span>
            <span class="stat-value">{{ venue.metrics.accept_rate }}%</span>
          </div>
          <div class="venue-stat">
            <span class="stat-label">H5</span>
            <span class="stat-value">{{ venue.metrics.h5_index }}</span>
          </div>
          <div class="venue-detail-btn">
            <el-button type="text" size="mini" @click="goToVenueDetail(venue)">
              <i class="el-icon-info"></i> 详情
            </el-button>
          </div>
        </div>
      
        <!-- 论文选项卡 -->
        <div class="venue-papers">
          <el-tabs v-model="venue.activeTab" size="mini">
            <el-tab-pane label="热门论文" name="hot">
              <div class="papers-list">
                <div v-for="(paper, pIndex) in venue.hot_papers.slice(0,3)" :key="pIndex" class="paper-item">
                  <div class="paper-dot" :class="'dot-' + (pIndex+1)"></div>
                  <div class="paper-info">
                    <div class="paper-title" :title="paper.title">{{ paper.title }}</div>
                    <div class="paper-meta">
                      <span class="paper-year">{{ paper.year }}</span>
                      <span class="paper-citations">
                        <i class="el-icon-reading"></i> {{ paper.citations }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="最新论文" name="recent">
              <div class="papers-list">
                <div v-for="(paper, pIndex) in venue.recent_papers.slice(0,3)" :key="pIndex" class="paper-item">
                  <div class="paper-dot" :class="'dot-recent'"></div>
                  <div class="paper-info">
                    <div class="paper-title" :title="paper.title">{{ paper.title }}</div>
                    <div class="paper-meta">
                      <span class="paper-year">{{ paper.year }}</span>
                      <span class="paper-date">{{ paper.date }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        
        <div class="venue-divider" v-if="vIndex < localVenues.length - 1"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecomVenues',
  data() {
    return {
      localVenues: []
    }
  },
  created() {
    // 直接使用临时数据
    this.localVenues = this.generateSampleData();
  },
  methods: {
    goToVenueDetail(venue) {
      this.$router.push({
        name: 'specificVenue',
        params: { id: venue.id }
      })
    },
    generateSampleData() {
      const venues = [
        {
          id: 3124,
          full_name: "IEEE Conference on Computer Vision and Pattern Recognition",
          short_name: "CVPR",
          metrics: {
            ccf_rank: "A",
            h5_index: 346,
            accept_rate: 22.1
          },
          activeTab: 'hot',
          hot_papers: [
            { 
              id: 101, 
              title: "Deep Residual Learning for Image Recognition", 
              year: 2016, 
              citations: 38912 
            },
            { 
              id: 102, 
              title: "ImageNet: A Large-Scale Hierarchical Image Database", 
              year: 2009, 
              citations: 32590 
            },
            { 
              id: 103, 
              title: "Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks", 
              year: 2015, 
              citations: 25430 
            }
          ],
          recent_papers: this.generateRecentPapers("CVPR")
        },
        {
          id: 606,
          full_name: "Neural Information Processing Systems",
          short_name: "NeurIPS",
          metrics: {
            ccf_rank: "A",
            h5_index: 280,
            accept_rate: 20.8
          },
          activeTab: 'hot',
          hot_papers: [
            { 
              id: 201, 
              title: "Attention Is All You Need", 
              year: 2017, 
              citations: 30845 
            },
            { 
              id: 202, 
              title: "Generative Adversarial Networks", 
              year: 2014, 
              citations: 28741 
            },
            { 
              id: 203, 
              title: "Auto-Encoding Variational Bayes", 
              year: 2013, 
              citations: 22180 
            }
          ],
          recent_papers: this.generateRecentPapers("NeurIPS")
        },
        {
          id: 2915,
          full_name: "International Conference on Learning Representations",
          short_name: "ICLR",
          metrics: {
            ccf_rank: "A",
            h5_index: 225,
            accept_rate: 26.5
          },
          activeTab: 'hot',
          hot_papers: [
            { 
              id: 301, 
              title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", 
              year: 2018, 
              citations: 26430 
            },
            { 
              id: 302, 
              title: "Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift", 
              year: 2015, 
              citations: 24380 
            },
            { 
              id: 303, 
              title: "Deep Residual Learning for Image Recognition", 
              year: 2016, 
              citations: 23450 
            }
          ],
          recent_papers: this.generateRecentPapers("ICLR")
        },
        {
          "id": 1301,
          "full_name": "International World Wide Web Conference",
          "short_name": "WWW",
          "metrics": {
            "ccf_rank": "A",
            "h5_index": 106,
            "accept_rate": 14.5
          },
          "activeTab": "hot",
          "hot_papers": [
            {
              "id": 201,
              "title": "Intelligent Model Update Strategy for Sequential Recommendation",
              "year": 2024,
              "citations": 24836
            },
            {
              "id": 202,
              "title": "Advancing Web 3.0: Making Smart Contracts Smarter on Blockchain",
              "year": 2024,
              "citations": 23940
            },
            {
              "id": 203,
              "title": "FashionReGen: LLM-Empowered Fashion Report Generation",
              "year": 2024,
              "citations": 12421
            }
          ],
          "recent_papers": [
            {
              "id": 301,
              "title": "Can we Soft Prompt LLMs for Graph Learning Tasks?",
              "year": 2024,
              "citations": 345
            },
            {
              "id": 302,
              "title": "Unlink to Unlearn: Simplifying Edge Unlearning in GNNs",
              "year": 2024,
              "citations": 364
            },
            {
              "id": 303,
              "title": "How Good are LLMs in Generating Personalized Advertisements?",
              "year": 2024,
              "citations": 578
            }
          ]
        },
        {
          "id": 3126,
          "full_name": "ACM SIGKDD Conference on Knowledge Discovery and Data Mining",
          "short_name": "KDD",
          "metrics": {
            "ccf_rank": "A",
            "h5_index": 124,
            "accept_rate": 19.0
          },
          "activeTab": "hot",
          "hot_papers": [
            {
              "id": 401,
              "title": "Paths2Pair: Meta-path Based Link Prediction in Billion-Scale Commercial Heterogeneous Graphs",
              "year": 2024,
              "citations": 24674
            },
            {
              "id": 402,
              "title": "Winning Amazon KDD Cup'24: Multi-Task Online Shopping Challenge for LLMs",
              "year": 2024,
              "citations": 29572
            },
            {
              "id": 403,
              "title": "DeepWalk: Online Learning of Social Representations",
              "year": 2014,
              "citations": 20573
            }
          ],
          "recent_papers": [
            {
              "id": 501,
              "title": "Causal AI at KDD 2024: Why Companies That Won't Jump on the Causal Train Now Will Have a Harder Time Later",
              "year": 2024,
              "citations": 324
            },
            {
              "id": 502,
              "title": "Most Influential KDD Papers (2024-09 Version)",
              "year": 2024,
              "citations": 154
            },
            {
              "id": 503,
              "title": "KDD 2024 Research Track Papers",
              "year": 2024,
              "citations": 147
            }
          ]
        }
      ];
      
      return venues;
    },
    
    generateRecentPapers(venue) {
      // 为每个会议生成最近发表的论文
      const recentPapersByVenue = {
        "CVPR": [
          { 
            id: 1001, 
            title: "A Comprehensive Survey of Image Augmentation Techniques for Deep Learning", 
            year: 2023, 
            date: "Dec 2023" 
          },
          { 
            id: 1002, 
            title: "NeRF-Based 3D Scene Reconstruction from Multiple Views", 
            year: 2023, 
            date: "Nov 2023" 
          },
          { 
            id: 1003, 
            title: "Self-Supervised Learning with Vision Transformers", 
            year: 2023, 
            date: "Oct 2023" 
          }
        ],
        "NeurIPS": [
          { 
            id: 2001, 
            title: "Efficient Transformers: A Survey of Optimization Techniques", 
            year: 2023, 
            date: "Dec 2023" 
          },
          { 
            id: 2002, 
            title: "Large Language Models for Scientific Discovery", 
            year: 2023, 
            date: "Nov 2023" 
          },
          { 
            id: 2003, 
            title: "Beyond Backpropagation: Advances in Training Neural Networks", 
            year: 2023, 
            date: "Oct 2023" 
          }
        ],
        "ICLR": [
          { 
            id: 3001, 
            title: "Understanding In-Context Learning in Large Language Models", 
            year: 2023, 
            date: "Dec 2023" 
          },
          { 
            id: 3002, 
            title: "Scaling Laws for Modern Neural Network Architectures", 
            year: 2023, 
            date: "Nov 2023" 
          },
          { 
            id: 3003, 
            title: "Diffusion Models for Generative Image Synthesis", 
            year: 2023,
            date: "Sep 2023" 
          }
        ]
      };
      
      if (venue && recentPapersByVenue[venue]) {
        return recentPapersByVenue[venue];
      }
      
      return [
        { id: 9001, title: "Recent Research Advances", year: 2023, date: "Dec 2023" },
        { id: 9002, title: "Current Trends in Machine Learning", year: 2023, date: "Nov 2023" },
        { id: 9003, title: "Future Directions in AI Research", year: 2023, date: "Oct 2023" }
      ];
    }
  }
}
</script>

<style lang="scss" scoped>
.side-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  
  &.venues-card {
    animation-delay: 0.3s;
    background: linear-gradient(135deg, #ffffff 0%, #f9f9ff 100%);
  }
  
  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f2f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, #11aacb 0%, #25a5fc 100%);
    
    h3 {
      margin: 0;
      font-size: 18px;
      color: white;
      display: flex;
      align-items: center;
      
      i {
        margin-right: 8px;
        color: #ffd700;
      }
    }
    
    .more-btn {
      font-size: 14px;
      padding: 0;
      color: white;
      
      i {
        margin-left: 4px;
      }
      
      &:hover {
        color: #ffd700;
      }
    }
  }
}

// 会议列表样式
.venue-list {
  padding: 12px 12px;
  height: 540px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c3cfe2 #f5f7fa;

  // 自定义Webkit浏览器的滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7fa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #c3cfe2 0%, #a18cd1 100%);
    border-radius: 3px;
    
    &:hover {
      background: linear-gradient(135deg, #a18cd1 0%, #8e44ad 100%);
    }
  }
  
  .venue-item {
    position: relative;
    margin-bottom: 4px;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.05);
    width: 100%;
    box-sizing: border-box;
    
    &:hover {
      transform: translateY(-2px);
      background: rgba(64, 158, 255, 0.03);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      border-color: rgba(0, 0, 0, 0.1);
    }
    
    .venue-title {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      .venue-badge {
        background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: bold;
        margin-right: 10px;
        box-shadow: 0 2px 6px rgba(0, 123, 255, 0.2);
      }
      
      h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: #2c3e50;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    
    .venue-details {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      .venue-stat {
        display: flex;
        align-items: center;
        margin-right: 12px;
        
        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-right: 4px;
        }
        
        .stat-value {
          font-size: 14px;
          font-weight: bold;
          color: #2c3e50;
          
          &.ccf-a {
            color: #e74c3c;
          }
          
          &.ccf-b {
            color: #27ae60;
          }
          
          &.ccf-c {
            color: #3498db;
          }
        }
      }
      
      .venue-detail-btn {
        margin-left: auto;
        
        .el-button {
          padding: 6px 8px;
          font-size: 12px;
          color: #3498db;
          transition: all 0.3s;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 4px;
          border: none;
          
          &:hover {
            color: #2980b9;
            background: linear-gradient(135deg, #e2e8f0 0%, #b8c6db 100%);
            transform: translateY(-1px);
          }
          
          i {
            margin-right: 4px;
            font-size: 14px;
          }
        }
      }
    }
    
    .venue-papers {
      margin-bottom: 8px;
      
      ::v-deep .el-tabs__header {
        margin-bottom: 8px;
      }
      
      ::v-deep .el-tabs__item {
        height: 28px;
        line-height: 28px;
        font-size: 13px;
        padding: 0 8px;
        color: #7f8c8d;
        
        &.is-active {
          color: #3498db;
          font-weight: 600;
        }
        
        &:hover {
          color: #3498db;
        }
      }
      
      ::v-deep .el-tabs__active-bar {
        background: linear-gradient(90deg, #00c6fb, #005bea);
        height: 2px;
      }
      
      ::v-deep .el-tabs__nav-wrap::after {
        height: 1px;
        background: #e0e6ed;
      }
      
      .papers-list {
        .paper-item {
          display: flex;
          padding: 6px 0;
          margin-bottom: 2px;
          border-radius: 4px;
          transition: all 0.25s;
          
          &:hover {
            background: rgba(52, 152, 219, 0.05);
            transform: translateX(3px);
          }
          
          .paper-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 6px;
            margin-top: 5px;
            flex-shrink: 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            
            &.dot-1 {
              background: linear-gradient(135deg, #ff9a9e 0%, #f56c6c 100%);
            }
            
            &.dot-2 {
              background: linear-gradient(135deg, #f6d365 0%, #e6a23c 100%);
            }
            
            &.dot-3 {
              background: linear-gradient(135deg, #84fab0 0%, #67c23a 100%);
            }
            
            &.dot-recent {
              background: linear-gradient(135deg, #a1c4fd 0%, #409EFF 100%);
            }
          }
          
          .paper-info {
            flex: 1;
            min-width: 0;
            
            .paper-title {
              font-size: 13px;
              color: #2c3e50;
              margin-bottom: 2px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              transition: all 0.2s;
              
              &:hover {
                color: #3498db;
              }
            }
            
            .paper-meta {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: #95a5a6;
              
              .paper-year, .paper-date {
                color: #95a5a6;
              }
              
              .paper-citations {
                color: #f39c12;
                font-weight: 500;
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
                
                i {
                  margin-right: 3px;
                }
              }
            }
          }
        }
      }
    }
    
    .venue-divider {
      height: 1px;
      background: linear-gradient(90deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.02) 100%);
      margin: 2px 0 4px;
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 
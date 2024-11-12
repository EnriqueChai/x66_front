<template>
  <div class="searchListContainer">
    <div class="searchListLeft">
      <img src="../../assets/touxiang.jpg" style="height: 60px; width: 60px">
    </div>
    <div class="searchListRight">
      <div class="listRightTop">
        <div class="topLeft">
          <!-- <h2>{{ author.authorName }}</h2> -->
          <router-link :to="{ name: 'personalPage', query: { authorId: author.id } }">
            <h2>{{ author.name }}</h2>
          </router-link>
          <div>
            <el-tag type="warning">H-index: {{ Math.floor(author.hindex) }}</el-tag>
            <el-tag>论文数: {{ Math.floor(author.npubs) }}</el-tag>
            <el-tag>引用数: {{ Math.floor(author.ncitation) }}</el-tag>
          </div>
        </div>
        <div class="topRight">
          <!-- <el-button @click="follow">+ 关注</el-button> -->
        </div>
      </div>
      <div class="listRightMid">
        <div class="midTop">
          <!-- <svg-icon icon-class="gwb" />
          {{ author.position }} -->
          <svg-icon icon-class="jigou" />
          <!-- {{ author.authorOrg }} -->
          <span :title="author.authorOrg">{{ author.org }}</span>
        </div>
        <div class="midBottom">
          <!-- 研究领域: {{ author.biography }} -->
        </div>
      </div>
      <div class="listRightBottom">
        <div class="botLeft">
          <!-- <svg-icon icon-class="eye" />
          2959 -->
        </div>
        <div class="botRight">
          <!-- <ul>
            <li><a href="#"><svg-icon icon-class="zxdt" /> 最新动态</a></li>
            <li><a href="#"><svg-icon icon-class="dbcg" /> 代表成果</a></li>
            <li><a href="#"><svg-icon icon-class="xtyx" /> 星探一下</a></li>
            <li><a href="#"><svg-icon icon-class="xszz" /> 相似作者</a></li>
          </ul> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    author: {
      type: Object,
      required: true
    }
  },
  methods: {
    follow() {
      alert('已关注')
    }
  }
}
</script>

<style lang="scss">
.searchListContainer {
  display: flex;
  width: 100%;
  height: 200px;
  padding: 20px;
  border-bottom: 1px solid rgb(229, 231, 236);

  .searchListRight {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 0 0 10px;

    .listRightTop {
      display: flex;
      justify-content: space-between;
      height: 60px;

      .topLeft {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }

    .listRightMid {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 45px;
      align-content: center;
      margin-top: 20px;
      font-size: 18px;
    }

    .midTop {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-wrap: break-word;
    }

    .listRightBottom {
      display: flex;
      height: 30px;
      justify-content: space-between;

      .botLeft {
        color: rgb(134, 134, 134);
        align-content: center;
      }

      .botRight {
        align-content: center;
      }
    }
  }

  .listRightMid {
    color: rgb(134, 134, 134);
  }

  h2 {
    margin-block-start: 0px;
    margin-block-end: 0px;
  }

  .el-tag {
    margin: 0 5px;
    font-size: 14px;
    height: 24px;
    line-height: 24px;
  }

  ul {
    display: flex;
    // padding-left: 60px;
    margin-block-start: 0px;
    margin-block-end: 0px;

    li {
      font-size: 15px;
      padding-left: 20px;
      list-style: none;
    }
  }
}
</style>
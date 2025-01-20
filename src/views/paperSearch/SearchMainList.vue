<template>
  <div class="searchListContainer">
    <div class="searchListLeft">
      <img v-if="author.avatar" :src="author.avatar" style="height: 60px; width: 60px; border-radius: 50%;" />
      <img v-else src="../../assets/touxiang.jpg" style="height: 60px; width: 60px; border-radius: 50%;" />
    </div>
    <div class="searchListRight">
      <div class="listRightTop">
        <div class="topLeft">
          <router-link :to="{ name: 'personalPage', query: { authorId: author.id } }">
            <h2>{{ formattedName }}</h2>
          </router-link>

          <div class="tag-class">
            <!-- <el-tag type="warning">H-index: {{ Math.floor(author.hindex) }}</el-tag> -->
            <!-- <el-tag>论文数: {{ Math.floor(author.npubs) }}</el-tag> -->
            <el-tag>引用数: {{ Math.floor(author.ncitation) }}</el-tag>
            <el-tag v-if="author.field" type="warning"
              style="font-size: 16px; height: 28px; margin-right: 40px;">研究领域：{{
                author.field
              }}</el-tag>
            <el-tag v-if="author.rec" class="recommend-tag" type="success" effect="light" size="small">
              你可能感兴趣
            </el-tag>
          </div>
        </div>
        <div class="topRight">
          <el-button plain round @click="Model">模型对比</el-button>

        </div>
      </div>
      <div class="listRightMid">
        <div class="midTop">
          <svg-icon icon-class="jigou" />
          <span :title="formattedOrg"> {{ formattedOrg }}</span>
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
      required: true,
    },
  },
  computed: {
    // 格式化后的作者姓名
    formattedName() {
      return this.toTitleCase(this.author.name);
    },
    // 格式化后的机构名称
    formattedOrg() {
      return this.toProperCase(this.author.org);
    },
  },
  methods: {
    Model() {
      this.$router.push({ name: 'Model', query: { authorId: this.author.id } });
    },
    // 将字符串转换为标题格式（每个单词首字母大写）
    toTitleCase(str) {
      if (!str) return "";
      return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    // 将机构名称转换为合适的格式（介词、冠词等小写）
    toProperCase(str) {
      if (!str) return "";
      const lowercaseWords = [
        "of",
        "the",
        "and",
        "in",
        "on",
        "for",
        "at",
        "by",
        "from",
        "with",
        "about",
        "as",
        "into",
        "like",
        "through",
        "after",
        "over",
        "between",
        "out",
        "against",
        "during",
        "without",
        "before",
        "under",
        "around",
        "among",
      ];
      return str
        .toLowerCase()
        .split(" ")
        .map((word, index) => {
          if (index !== 0 && lowercaseWords.includes(word)) {
            return word;
          }
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
  },
};
</script>

<style lang="scss">
.searchListContainer {
  display: flex;
  width: 100%;
  height: 150px;
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

        .tag-class {
          margin-top: 10px;
        }
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

  h2:hover {
    text-decoration: underline;
  }

  .el-tag {
    margin: 0 5px;
    font-size: 14px;
    height: 24px;
    line-height: 24px;
  }

  ul {
    display: flex;
    /* padding-left: 60px; */
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
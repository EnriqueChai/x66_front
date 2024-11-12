<template>
  <div class="recomListContainer">
    <div class="recomLsitTop">
      <svg-icon icon-class="pdf" />
      <h3> {{ paper.title }} </h3>
    </div>

    <div class="recomLsitMid">
      <div> {{ extractAuthorNames(paper.authors) }} </div>
      <div><svg-icon icon-class="earth" /> {{ paper.venue }} {{ paper.year }}</div>
    </div>

    <div class="recomLsitBottom">
      <div class="bottomLeft">
        <span class="quote"> 引用 {{ paper.ncitation }}</span>
        <!-- <span> 浏览 36</span> -->
      </div>
      <!-- <div class="bottomright">
        <ul>
          <li><a href="#"><svg-icon icon-class="download" /> 下载全文</a></li>
          <li><a href="#"><svg-icon icon-class="yy" /> 引用</a></li>
          <li><a href="#"><svg-icon icon-class="chat" /> ChatPaper</a></li>
          <li><a href="#"><svg-icon icon-class="mark" /> 评分</a></li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    paper: {
      type: Object,
      required: true
    }
  },
  methods: {
    extractAuthorNames(authors) {
      if (typeof authors === 'string') {
        try {
          authors = authors.replace(/'/g, '"');
          authors = JSON.parse(authors);
        } catch (error) {
          console.error('Failed to parse authors:', error);
          return '';
        }
      }
      if (Array.isArray(authors)) {
        return authors.map(author => author.name).join(', ');
      } else {
        console.error('Authors is not an array:', authors);
        return '';
      }
    }
  }
}
</script>

<style lang="scss">
.recomListContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 1300px;
  height: 200px;
  padding: 20px;
  border-bottom: 1px solid rgb(134, 134, 134);

  .recomLsitTop {
    display: flex;
    height: 40px;
    align-items: center;
    font-size: 18px;
    h3 {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-left: 10px;
    }
  }

  .recomLsitMid {
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: rgb(134, 134, 134);
  }

  .recomLsitBottom {
    display: flex;
    justify-content: space-between;

    .bottomLeft {
      display: flex;
      align-items: center;
      color: rgb(134, 134, 134);
      .quote {
        border-right: 2px solid rgb(134, 134, 134);
        margin-right: 10px;
        padding-right: 10px;
      }
    }

  }

  h3 {
    margin-block-start: 0px;
    margin-block-end: 0px;
    margin-left: 10px;
  }

  ul {
    display: flex;
    // padding-left: 60px;

    li {
      font-size: 15px;
      padding-left: 20px;
      list-style: none;

    }
  }
}
</style>
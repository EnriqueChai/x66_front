<template>
  <div class="personalHeader">
    <div class="headContent">
      <!-- 上结构 -->
      <div class="top">
        <div class="top-left">
          <img v-if="authorPic" :src="authorPic" style="height: 70px; width: 70px">
          <img v-else src="../../assets/touxiang.jpg" style="height: 70px; width: 70px">
          <div class="info">
            <span style="font-size: 25px;">{{ authorName }}</span>
            <span style="width: 900px; margin-top: 5px; width: 1190px;" v-html="formattedAuthorOrg"></span>
          </div>
        </div>

      </div>
      <!-- 下结构 -->
      <div class="bottom">
        <ul>
          <li>
            <el-popover v-if="authorHomepage" trigger="hover" placement="top" :content="authorHomepage" style="display: inline-block;">
              <a href="#" slot="reference"><svg-icon icon-class="zhuye" /></a>
            </el-popover>
            <el-popover v-else trigger="hover" placement="top" content="暂无资料" style="display: inline-block;">
              <a href="#" slot="reference"><svg-icon icon-class="zhuye" /></a>
            </el-popover>
          </li>
          <li>
            <el-popover v-if="authorEmail" trigger="hover" placement="top" :content="authorEmail" style="display: inline-block;">
              <a href="#" slot="reference"><svg-icon icon-class="youxiang" /></a>
            </el-popover>
            <el-popover v-else trigger="hover" placement="top" content="暂无资料" style="display: inline-block;">
              <a href="#" slot="reference"><svg-icon icon-class="youxiang" /></a>
            </el-popover>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'authorName',
      'authorPic',
      'authorOrg',
      'authorHomepage',
      'authorEmail'
    ]),
    formattedAuthorOrg() {
      return this.authorOrg ? this.authorOrg.split(';').join('<br>') : '';
    }
  }
}
</script>

<style lang="scss">
.personalHeader {
  box-sizing: border-box;
  margin: 0 auto 30px;
  padding: 20px;
  width: 1300px;
  height: 175px;
  background: rgb(255, 255, 255);
  background-image: linear-gradient(#dff3f9, #ffffff, #ffffff);
  border-radius: 15px;
  box-shadow: 0 0 10px 0 #a8a8a8;

  .top {
    display: flex;
    justify-content: space-between;

    .top-left {
      display: flex;

      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 70px;
        padding-top: 10px;
        padding-bottom: 5px;
        margin-left: 15px;
      }
    }

  }

  ul {
    display: flex;
    padding-left: 60px;
    margin-top: 25px;

    li {
      font-size: 35px;
      padding-left: 20px;
    }
  }
}
</style>

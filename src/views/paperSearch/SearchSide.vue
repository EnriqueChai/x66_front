<template>
  <div class="searchSide">
    <div class="sidetab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个人简介" name="first" />
        <el-tab-pane label="教育背景" name="second" />
      </el-tabs>
    </div>
    <div class="tabList">
      <ul>
        <li>Professor</li>
        <li>Associate Professor</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.searchSide {
  border-radius: 15px;
  margin: 0px 15px 0px 0px;
  justify-content: space-between;
  box-shadow: 0 0 5px 0 #a8a8a8;
  background-image: linear-gradient(#dff3f9, #ffffff, #ffffff, #ffffff);
  flex: 1;

  .sidetab {
    width: 100%;
    height: 50px;
    align-content: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 2px solid #E4E7ED;

    .el-tabs {
      padding-left: 15px;

      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
      }
    }

  }
  li {
    list-style: none;
  }
}
</style>
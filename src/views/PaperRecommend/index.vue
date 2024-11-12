<template>
  <div class="recomBackPage">
    <div class="recomHead">
      <RecomHead />
    </div>

    <div class="recomContainer">
      <RecomMain v-if="recodeMainRef"/>
    </div>

  </div>
</template>

<script>
import RecomHead from './RecomHead.vue'
import RecomMain from './RecomMain.vue'

export default {
  data(){
    return{
      recodeMainRef:false
    }
  },
  components: {
    RecomHead,
    RecomMain,
  },
  created() {
    this.recodeMainRef=true
  }
}
</script>

<style lang="scss">
.recomBackPage {
  height: 100vh;
  background: url(../../assets/bg_dingbu.png) no-repeat top;
  padding-top: 29px;

  .recomHead {
    width: 1300px;
    margin: 0 auto 30px;
    height: 130px;
  }

  .recomContainer {
    display: flex;
    width: 1300px;
    height: 1200px;
    margin: 0 auto 30px;
    box-sizing: border-box;
  }
}
</style>
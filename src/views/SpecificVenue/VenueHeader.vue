<template>
  <div class="venueHeader" v-loading="loading">
    <div class="headContent">
      <div class="top">
        <div class="top-left">
          <!-- <img src="../../assets/venue_icon.png" class="venue-image"> -->
          <div class="info">
            <span style="font-size: 25px;">{{ venueName }}</span>
            <span>会议类型: {{ venueInfo.type || "未知" }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    venueInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    venueName() {
      return this.venueInfo.name || '未知会议'
    }
  }
}
</script>

<style lang="scss">
.venueHeader {
  box-sizing: border-box;
  margin: 0 auto 30px;
  padding: 20px;
  width: 1300px;
  height: 175px;
  background: rgb(255, 255, 255);
  background-image: linear-gradient(#dff3f9, #ffffff, #ffffff);
  border-radius: 15px;

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
        width: 1100px;
        padding-top: 10px;
        padding-bottom: 5px;
        margin-left: 15px;
      }
    }
  }

  .venue-image {
    height: 70px;
    width: 70px;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style> 
<template>
  <div class="conferListContainer">
    <div class="conferListLeft">
      <div class="conferListLeftTop">
        <span class="conferShort">{{ conference.short }}</span>
        <span class="divider">-</span>
        <span class="conferFull">{{ conference.full }}</span>
      </div>

      <div class="conferListLeftMid">
        <el-tag type="success" class="tag">H5 Index : {{ conference.h5Index }}</el-tag>
        <el-tag type="info" class="tag">TK5 Index : {{ conference.tk5Index || '-' }}</el-tag>
        <el-tag type="warning" class="tag">CCF Level : {{ conference.ccfLevel }}</el-tag>
      </div>

      <div class="conferListLeftBottom">
        <span class="label">覆盖领域：</span>
        <el-tag style="height: 22px; line-height: 20px;">{{ conference.area }}</el-tag>
      </div>
    </div>

    <div class="conferListRight">
      <div class="rightTitle">会议时间</div>
      <div class="rightTime">{{ conference.date }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    conference: {
      type: Object,
      required: true
    }
  },
  methods: {
    ccfColor(level) {
      if (level === 'A') return 'danger'
      if (level === 'B') return 'warning'
      if (level === 'C') return 'success'
      return 'info'
    }
  }
}
</script>

<style lang="scss" scoped>
.conferListContainer {
  display: flex;
  width: 100%;
  height: 150px;
  padding: 20px;
  border-bottom: 1px solid rgb(229, 231, 236);
  font-family: Arial, sans-serif;
  font-size: 14px;

  .conferListLeft {
    flex: 5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .conferListLeftTop {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;

      .divider {
        margin: 0 10px;
        font-weight: normal;
      }

      .conferFull {
        font-weight: normal;
        font-size: 18px;
      }
    }

    .conferListLeftMid {
      margin-top: 8px;

      .tag {
        margin-right: 10px;
        padding: 0 8px;
        height: 22px;
        line-height: 20px;
        font-size: 12px;
      }
    }

    .conferListLeftBottom {
      margin-top: 10px;
      display: flex;
      align-items: center;

      .label {
        margin-right: 8px;
        font-weight: bold;
      }
    }
  }

  .conferListRight {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;

    .rightTitle {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .rightTime {
      font-size: 14px;
      color: #555;
    }
  }
}
</style>
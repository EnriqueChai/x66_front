<template>
  <div class="journalItemContainer">
    <div class="journalLeft">
      <div class="journalTitle">{{ journal.name }}</div>
    </div>
    <div class="journalRight">
      <div class="tag" v-for="(tag, index) in journal.tags" :key="index">
        {{ tag }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    journal: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.journalItemContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7ec;
  padding: 20px;
  height: 100px;

  .journalLeft {
    flex: 5;
    display: flex;
    align-items: center;

    .journalTitle {
      font-size: 20px;
      font-weight: bold;
    }
  }

  .journalRight {
    flex: 3;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;

    .tag {
      padding: 4px 10px;
      background-color: #f0f0f0;
      border-radius: 5px;
      font-size: 14px;
      color: #333;
      border: 1px solid #ccc;
    }
  }
}
</style>
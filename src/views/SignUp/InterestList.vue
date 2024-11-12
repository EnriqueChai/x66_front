<template>
  <div class="interestListContainer">
    {{ interest }}
  </div>
</template>

<script>
export default {
  props: {
    interest: {
      type: String,
      required: true
    }
  },
}
</script>

<style lang="scss">
.interestListContainer {
  height: 70px;
  width: 200px;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 #a8a8a8;
}
</style>
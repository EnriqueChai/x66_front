<template>
  <div class="corAuthListContainer">
    <a :href="authorPageLink" target="_blank" rel="noopener noreferrer" class="authLink">
      <div class="headImg">
        <img v-if="corAuthor.picture" :src="corAuthor.picture" style="height: 70px; width: 70px" />
        <img v-else src="../../assets/touxiang.jpg" style="height: 70px; width: 70px" />
      </div>
      <div class="name">
        {{ corAuthor.authorName }}
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    corAuthor: {
      type: Object,
      required: true
    }
  },
  computed: {
    authorPageLink() {
      const route = this.$router.resolve({
        name: 'personalPage',
        query: { authorId: this.corAuthor.authorId }
      });
      return route.href;
    }
  }
}
</script>

<style lang="scss">
.corAuthListContainer {
  box-sizing: border-box;

  .authLink {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .name {
    margin-top: 8px;
    width: 90px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
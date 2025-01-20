<template>
  <div class="simAuthListContainer">
    <a :href="authorPageLink" target="_blank" rel="noopener noreferrer" class="authLink">
      <div class="headImg">
        <img v-if="simAuthor.picture" :src="simAuthor.picture" style="height: 70px; width: 70px; border-radius: 50%;" />
        <img v-else src="../../assets/touxiang.jpg" style="height: 70px; width: 70px; border-radius: 50%;" />
      </div>
      <div class="name">
        {{ abbreviatedName }}
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    simAuthor: {
      type: Object,
      required: true
    }
  },
  computed: {
    authorPageLink() {
      const route = this.$router.resolve({
        name: 'personalPage',
        query: { authorId: this.simAuthor.authorId }
      });
      return route.href;
    },
    abbreviatedName() {
      if (!this.simAuthor.authorName) return '';

      const nameParts = this.simAuthor.authorName.trim().split(' ');

      if (nameParts.length === 1) {
        return `${nameParts[0].charAt(0).toUpperCase()}.`;
      } else {
        const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
        const lastName = nameParts[nameParts.length - 1];
        const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
        return `${firstNameInitial}. ${capitalizedLastName}`;
      }
    }
  }
}
</script>

<style lang="scss">
.simAuthListContainer {
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
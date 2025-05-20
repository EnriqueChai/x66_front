<template>
  <div class="personalInfoMain">
    <div class="personalInfoMainLeft">
      <PersonalWordCloud :authorId="authorId" :authorField="authorField" />
      <PersonalPaperList :authorId="authorId" />
    </div>
    <div class="personalInfoMainRight">
      <PersonalInfoRight :authorId="authorId" />
    </div>
  </div>
</template>

<script>
import PersonalWordCloud from './PersonalWordCloud.vue'
import PersonalPaperList from './PersonalPaperList.vue'
import PersonalInfoRight from './PersonalInfoRight.vue'
import { mapState } from 'vuex'

export default {
  name: 'PersonalInfoMain',
  components: {
    PersonalWordCloud,
    PersonalPaperList,
    PersonalInfoRight
  },
  props: {
    authorId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      authors: state => state.author.authors
    }),
    authorField() {
      const author = this.authors.find(a => a.id === this.authorId)
      console.log('PersonalInfoMain - 当前作者ID:', this.authorId)
      console.log('PersonalInfoMain - 所有作者:', this.authors)
      console.log('PersonalInfoMain - 找到的作者:', author)
      return author ? author.field : ''
    }
  }
}
</script>

<style lang="scss">
.personalInfoMain {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  gap: 20px;

  .personalInfoMainLeft {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .personalInfoMainRight {
    width: 300px;
  }
}
</style> 
<template>
  <div class="firstSide">
    <h3>词云展示</h3>
    <hr>
    <div class="wordCloud">
      <word-cloud :data="words" :wordPadding="5" :fontSize="fontSize" />
    </div>
  </div>
</template>

<script>
import WordCloud from 'vue-wordcloud'
import { mapGetters } from 'vuex'

export default {
  components: {
    WordCloud
  },
  data() {
    return {
      words: [],
      fontSize: [18, 40]
    };
  },
  computed: {
    ...mapGetters([
      'authorTag'
    ])
  },
  watch: {
    authorTag(newVal) {
      let parsedData;
      if (typeof newVal === 'string') {
        const formattedString = newVal.replace(/'/g, '"');
        try {
          parsedData = JSON.parse(formattedString);
        } catch (error) {
          console.error('Failed to parse authorTag:', error);
          return;
        }
      } else {
        parsedData = newVal;
      }

      if (Array.isArray(parsedData)) {
        this.words = parsedData.map(item => ({
          name: item.t,
          value: item.w
        }));
      } else {
        console.warn('authorTag is not an array:', parsedData);
      }
    }
  }
}
</script>

<style lang="scss">
.firstSide {
  flex: 2;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-radius: 15px;
  box-shadow: 0 0 10px 0 #a8a8a8;
  margin: 0 0 30px 15px;

  h3 {
    margin-left: 13px;
  }

  .wordCloud {
    height: 350px;
  }
}
</style>

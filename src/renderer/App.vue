<template>
<div id="root">
  <textarea v-model="text" />
  <p v-html="compiledMarkdown" />
</div>
</template>

<script>
import marked from 'marked';

export default {
  name: 'rapid-mdpad',
  data() {
    return {
      text: '# Hello!',
    };
  },
  computed: {
    compiledMarkdown() {
      return marked(this.text, { sanitize: true });
    },
  },
};
</script>

<style lang="scss" scoped>
#root {
  display: grid;
  grid-template-rows: 100vh;
  grid-template-columns: 1fr 1fr;

  p {
    padding: 10px;
  }
}
</style>

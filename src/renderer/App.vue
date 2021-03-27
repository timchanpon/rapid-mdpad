<template>
<div id="root">
  <textarea
    :value="text"
    @input="updateText"
  />
  <div v-html="compiledMarkdown" />
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
      return marked(this.text);
    },
  },
  methods: {
    updateText(e) {
      this.text = e.target.value;
      this.handleEnter(e);
    },
    handleEnter(e) {
      if (e.inputType !== 'insertLineBreak') return;

      const splitText = e.target.value.split('\n');
      const lenLine = splitText.length;
      const prevLine = splitText[lenLine - 2];
      const isOrderedList = prevLine.match(/^\d*\.\s.*/);
      const isUnorderedList = prevLine.match(/^[\*|-]\s.*/);

      let prefix = '';

      if (isOrderedList) {
        const num = prevLine.match(/^\d*/);
        prefix = `${parseInt(num) + 1}.\v`;
      } else if (isUnorderedList) {
        prefix = prevLine.slice(0, 2);
      }

      this.text += prefix;
    },
  },
};
</script>

<style lang="scss" scoped>
#root {
  width: 100%;
  height: 100vh;
  display: flex;

  textarea {
    width: 50%;
    height: 100%;
    padding: 10px;
    font-size: 1.5rem;
  }

  div {
    width: 50%;
    height: 100%;
    padding: 10px;
    font-size: 1.5rem;
    overflow-y: scroll;
  }
}
</style>

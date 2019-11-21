<template>
    <div>
        {{formula}}
    </div>
</template>
<script>
import MathJax from 'MathJax';
export default {
  name: 'MathJax',
  data() {
    return { test: '' };
  },
  props: { formula: String },
  //   components: { MathJax },
  created() {
    MathJax.Hub.Config({
      extensions: ['tex2jax.js'],
      jax: ['input/TeX', 'output/HTML-CSS'],
      tex2jax: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true
      },
      'HTML-CSS': { fonts: ['TeX'] }
    });
  },
  mounted() {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub], this.$el);
  }
};
</script>
<style lang="scss" scoped>
</style>
<template>
      <a :href='"http://www.xdocin.com/xdoc?_func=to&amp;_format=html&amp;_cache=1&amp;_xdoc="+url'  target="_blank" rel="nofollow">{{name}}</a>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ['url', 'name']
};
</script>
<style scoped>
a {
  color: #606266;
}
</style>

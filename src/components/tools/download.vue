<template>
  <a
    :href="url"
    download
    ref='download'
  ></a>
</template>
<script>
export default {
  data() {
    return {
      url: ""
    };
  },
  methods: {
    download(url = "") {
      this.url = url;
      this.$nextTick(() => {
        this.$refs.download.click();
      });
    }
  }
};
</script>
<style scoped>
</style>



<template>
    <span v-html="highlight" class="content-text"></span>
</template>
<script>
export default {
  props: ['text', 'keyWords'],
  computed: {
    highlight() {
      let value = this.text;
      if (!value) {
        return '';
      }
      if (this.keyWords && this.keyWords.length > 0) {
        let replaceReg = new RegExp(this.keyWords, 'g');
        // 高亮替换v-html值
        let replaceString =
          '<span class="highlight-text">' + this.keyWords + '</span>';
        // 开始替换
        value = value.replace(replaceReg, replaceString);
      }
      return value;
    }
  }
};
</script>
<style>
.content-text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>



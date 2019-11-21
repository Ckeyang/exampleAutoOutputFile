<template>
  <Editor
    v-model="value"
    :init="config"
    api-key="w67c7vrghjehan2wb7zsvb6d7ywtr0zc2np9zo3iwm7otmck"
    @onChange="change"
  ></Editor>
</template>
<script>
import Editor from "@tinymce/tinymce-vue";
import config from "./config";
export default {
  components: { Editor },
  data() {
    return {
      value: "",
      config: config
    };
  },
  props: {
    defaultValue: { type: String, default: "" },
    isDisabledToolbar: { type: Boolean }
  },
  created() {
    if (this.isDisabledToolbar) {
      this.config.toolbar = false;
      this.config.plugins = [];
      this.config.height = "100%";
    }
  },
  watch: {
    defaultValue(val) {
      this.value = this.defaultValue;
    }
  },
  methods: {
    change() {
      this.$emit("change", this.value, this.matchTitle(this.value));
    },
    /**
     * 匹配标题
     */
    matchTitle(str) {
      let reg = /<[h1,h2][^>]+>([\S\s\t]*?)<\/[h1,h2]+>/g;
      return str.match(reg) || [];
    },
    addHtml(dom) {
      window.tinymce.editors[0].execCommand("mceInsertContent", false, dom);
    },
    goWhere(data) {
      switch (data.type) {
        case "TEXT":
          this.scrollToById("span", data.id);
          break;
        case "IMAGE":
          this.scrollToById("img", data.id);
          break;
        case "TABLE":
          this.scrollToById("table", data.id);
        case "ROOT":
          this.$message("根目录不支持跳转");
          break;
        default:
          this.scrollTo(data.type.toLowerCase(), data.name);
          break;
      }
    },
    scrollToById(type, id) {
      let flag = false;
      let i = 0;
      let iframe = window.frames[0];
      let idocument = iframe.document;
      while (true) {
        if (
          idocument.getElementsByTagName(type)[i].getAttribute("fieldId") === id
        ) {
          flag = true;
          break;
        }
        if (i > idocument.getElementsByTagName(type)[i].length) {
          break;
        }
        i++;
      }
      if (flag) {
        idocument.getElementsByTagName(type)[i].scrollIntoView(true);
      }
    },
    scrollTo(type, name) {
      let flag = false;
      let i = 0;
      let iframe = window.frames[0];
      let idocument = iframe.document;
      while (true) {
        if (
          idocument.getElementsByTagName(type)[i].innerText.trim() ===
          name.trim()
        ) {
          flag = true;
          break;
        }
        if (i > idocument.getElementsByTagName(type)[i].length) {
          break;
        }
        i++;
      }
      if (flag) {
        idocument.getElementsByTagName(type)[i].scrollIntoView(true);
        // idocument.body.scrollTop = idocument.getElementsByTagName(type)[i].offsetTop;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.mce-notification-inner {
  display: none !important;
}
</style>

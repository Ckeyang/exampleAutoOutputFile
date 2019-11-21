<template>
  <div style="background-color:#ffffff">
    <div v-show="isDisabledToolbar" style="background-color:#f1f1f1;border:1px solid #ccc" id="toolbar"></div>
    <div :style="{ height: height, border: '1px solid #ccc' }" :id="editorId"></div>
  </div>
</template>
<script>
// import E from "wangeditor";
const E = window.wangEditor;
export default {
  name: "wangEditor",
  props: {
    editorId: { type: String, default: "editor" },
    height: { type: String, default: "85.70vh !important" },
    value: { type: String, default: "" },
    isDisabledToolbar: { type: Boolean, default: true }
  },
  data() {
    return {
      editor: null
    };
  },
  created() {
    //   this.init();
    setTimeout(this.init, 500);
  },
  methods: {
    /**
     * 匹配标题
     */
    matchTitle(str) {
      let rmBodyAndHtml = /<(body|html|\/html|\/body|head|\/head).*?>/g;
      let reg = /<[h1,h2][^>]+>([\S\s\t]*?)<\/[h1,h2]+>/g;
      return str.replace(rmBodyAndHtml, "").match(reg) || [];
    },
    createEditor(tool, id) {
      let editor = new E("#" + tool, "#" + id);
      return editor;
    },
    init() {
      this.editor = this.createEditor("toolbar", this.editorId);
      this.editor.customConfig.onchange = this.onChange;
      this.editor.customConfig.onblur = this.onChange;
      this.editor.customConfig.uploadImgServer = "/files/ckeditor";
      this.editor.customConfig.uploadFileName = "upload";
      this.editor.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
          var url = result.url;
          insertImg(url);
        }
      };
      this.editor.customConfig.zIndex = 1;
      this.editor.create();
      this.setDefaultValue();
    },
    setDefaultValue(content) {
      this.editor.txt.html(content || this.value || "");
    },
    // 清空编辑器内容
    clearEditorValue(){
      this.editor.txt.clear()
    },
    onChange(val) {
      this.$emit("input", val);
      this.$emit("getTitle", this.matchTitle(this.value));
    },
    addHtml(dom) {
      this.editor.cmd.do("insertHTML", dom);
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
          break;
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
      while (true) {
        if (document.getElementsByTagName(type)[i].getAttribute("fieldId") === id) {
          flag = true;
          break;
        }
        if (i > document.getElementsByTagName(type)[i].length) {
          break;
        }
        i++;
      }
      if (flag) {
        document.getElementsByTagName(type)[i].scrollIntoView(true);
      }
    },
    scrollTo(type, name) {
      let flag = false;
      let i = 0;
      while (true) {
        if (document.getElementsByTagName(type)[i].innerText.trim() === name.trim()) {
          flag = true;
          break;
        }
        if (i > document.getElementsByTagName(type)[i].length) {
          break;
        }
        i++;
      }
      if (flag) {
        document.getElementsByTagName(type)[i].scrollIntoView(true);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.textarea {
  height: 84.33vh !important;
}
.w-e-text {
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5em;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
  }
}
</style>

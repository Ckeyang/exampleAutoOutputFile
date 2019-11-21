<template>
  <div class="tinymce-container editor-container" :class="{fullscreen:fullscreen}">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
  </div>
</template>
<script>
// import plugins from "./plugins";
// import toolbar from "./toolbar";
import tinymce from "@tinymce/tinymce-vue";
export default {
  name: "tinymce",
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    menubar: {
      default: "file edit insert view format table"
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || "vue-tinymce-" + +new Date(),
      fullscreen: false,
      toolbars: []
    };
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val)
        );
      }
    }
  },
  mounted() {
    this.initTinymce();
    // this.imageSuccessCBK([1, 2]);
  },
  activated() {
    this.initTinymce();
  },
  deactivated() {
    this.destroyTinymce();
  },
  methods: {
    getCheckText() {},
    test() {
      window.tinymce
        .get(this.tinymceId)
        .execCommand("mceSelectNode", false, "span");
    },
    initTinymce() {
      const _this = this;
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: "panel-body ",
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : this.toolbars,
        menubar: this.menubar,
        plugins: [],
        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        code_dialog_height: 950,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: "_blank",
        link_title: false,
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            this.hasChange = true;
            this.$emit("input", editor.getContent());
          });
        },
        setup(editor) {
          editor.on("FullscreenStateChanged", e => {
            _this.fullscreen = e.state;
          });
          editor.addButton("myimage", {
            icon: "image",
            tooltip: "选择共享件",
            onclick: function() {
              editor.insertContent(
                '&nbsp;<span style="color:red"  data-mce-index="1212121">Here\'s some content</span>!&nbsp;'
              );
            }
          });
        }
      });
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    }
    // imageSuccessCBK(arr) {
    //   const _this = this;
    //   arr.forEach((v) => {
    //     window.tinymce.get(_this.tinymceId).insertContent(`<h1>加入内容</h1>`);
    //   });
    // }
  },
  destroyed() {
    this.destroyTinymce();
  }
};
</script>

<style scoped>
.tinymce-container {
  position: relative;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>

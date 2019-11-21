<template>
  <div style="height:100vh;">
    <div :id="editorId"></div>
    <add-shared-parts
      ref="sharedPartsField"
      :defaultFeildTypeList="[]"
      :isShowAddRules="isShowAddRules"
      @refreshShare="reload"
    />
  </div>
</template>
<script>
import config from "./config.js";
import AddSharedParts from "@/views/sharedParts/components/AddSharedParts.vue";
import environment from "@/environmental/index.js";
import { setTimeout } from "timers";
export default {
  name: "wordEditor",
  components: { AddSharedParts },
  data() {
    return {
      editor: null,
      viewConfig: {
        filetype: "docx",
        key: "Khirz6zTPdfd7",
        outputtype: "png",
        thumbnail: {
          aspect: 0,
          first: true,
          height: 150,
          width: 100
        },
        title: "Example Document Title.docx",
        url: "https://example.com/url-to-example-document.docx"
      },
      timer: 0,
      isShowAddRules: true //是否显示规则设置按钮
    };
  },
  props: {
    editorId: { type: String, default: "test" },
    initDefault: { type: Boolean, default: true },
    evaluationCategory: { type: String, default: "" },
    isViewPng: { type: Boolean, default: false },
    docUrl: { type: String, default: "" },
    docKey: { type: String, default: "" },
    saveUrl: { type: String, default: "" },
    mode: { type: String, default: "edit" },
    docTitle: { type: String, default: "" }
  },
  mounted() {
    let that = this;
    window.addEventListener("message", function(e) {
      let data = {};
      typeof e.data === "string" ? (data = JSON.parse(e.data)) : (data = e.data);
      switch (data.action) {
        case "ADD":
          that.openAddDialog();
          break;
        case "UPDATE":
          that.onEditSharedPart(data.id);
          break;
      }
    });
  },
  created() {
    if (this.initDefault) {
      this.setConfig();
      setTimeout(this.init, 500);
      let that = this;
      setTimeout(function() {
        that.isShow = true;
      }, 10000);
    }
  },
  methods: {
    reload() {
      this.timer++;
      if (this.timer === 1) {
        this.$notify({
          title: "提示",
          message: "如果数据没有更新，请手动点一下查询按钮",
          duration: 0
        });
      }
    },
    //新增共享件
    openAddDialog() {
      let list = this.evaluationCategory.split("-");
      this.$refs.sharedPartsField.openDialog("ADD", list[0] + "-" + list[1], false);
      this.isShowAddRules = true;
    },
    onEditSharedPart(id) {
      this.$refs.sharedPartsField.getSharedPartsFieldById(id);
      this.$http.sharedPartsService.getSharedPartsFieldById(id).then(res => {
        this.isShowAddRules = res.data && !res.data.markingIcon.includes("PROJECT");
      });
    },
    start() {
      this.setConfig();
      setTimeout(this.init, 500);
    },
    init() {
      this.editor = new DocsAPI.DocEditor(this.editorId, this.viewConfig);
      window.docEditor = this.editor;
    },
    setConfig() {
      if (this.isViewPng) {
        this.viewConfig.url = this.docUrl + "?v=" + new Date().getTime();
        this.viewConfig.title = this.docTitle;
        this.viewConfig.key = this.docKey;
      } else {
        this.viewConfig = config;
        let list = this.evaluationCategory.split("-");
        let hostname = window.location.protocol + "//" + window.location.hostname + "/backend/api/";
        let user = {
          name: sessionStorage.userName,
          id: sessionStorage.token + "$" + hostname + "$" + list[0] + "-" + list[1]
        };
        this.viewConfig.editorConfig.callbackUrl = this.saveUrl;
        this.viewConfig.editorConfig.user = user;
        this.viewConfig.editorConfig.mode = this.mode;
        // config.editorConfig.customization.customer = customer;
        this.viewConfig.document.url = this.docUrl + "?v=" + new Date().getTime();
        this.viewConfig.document.key = this.docKey;
        this.viewConfig.document.title = this.docTitle;
        this.viewConfig.token = sessionStorage.token;
      }
    }
  }
};
</script>

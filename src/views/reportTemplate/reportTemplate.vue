<template>
  <div class="reportTemplate">
    <word-editor ref="wordEditor" :docKey="curItem.documentId" :evaluationCategory="curItem.evaluationCategory" :mode="action" :docTitle="curItem.name" :initDefault="false" :docUrl="curItem.documentAddress" :saveUrl="curItem.documentCallbackAddress"></word-editor>
  </div>
</template>
<script>
// import WangEditor from "@/components/wangEditor/wangEditor.vue";
// import tinymacEditor from "@/components/tinymacEditor/tinymacEditor.vue";
import ListTree from "@/views/sharedParts/components/listTree.vue";
import AddSharedParts from "@/views/sharedParts/components/AddSharedParts.vue";
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import wordEditor from "@/components/wordEditor/wordEditor.vue";
import SplitPane from "vue-splitpane";
// import ckEditor from '@/components/ckEditor/ckEditor.vue';
export default {
  name: "reportTemplate",
  components: {
    // WangEditor,
    wordEditor,
    ListTree,
    AddSharedParts,
    highlightWords,
    SplitPane,
    pagniation,
    preview
  },
  data() {
    return {
      isShowTemplateList: false,
      treeFrom: { keyWords: "", shareComponentType: "" },
      publishBox: false,
      fullscreenLoading: false,
      templateForm: { keyWords: "", pageSize: 30, current: 0 },
      catalog: [],
      versionType: "U",
      fieldItem: {
        childList: [],
        name: "",
        id: "",
        parentId: "",
        type: "TEXT"
      },
      fieldBox: false,
      filterTree: "",
      updateFile: {
        parentId: "",
        reportAddress: ""
      },
      totalPage: 0,
      totalNum: 0,
      dataList: [],
      curItem: {},
      curId: this.$route.params.templateId,
      action: this.$route.params.action,
      version: this.$route.params.version,
      treeData: [],
      rules: {
        name: { required: true, message: "必填" },
        childList: { validator: this.checkChildList, message: "必填" }
      }
    };
  },
  watch: {
    filterTree(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getTempalteDetail();
  },
  methods: {
    editShared(id) {
      this.$refs.sharedPartsField.getSharedPartsFieldById(id);
    },
    showTemplateList() {
      this.isShowTemplateList = true;
      this.getTemplateList();
    },
    getTemplateList() {
      this.$http.reportService
        .getReportTemplateListPublish(this.templateForm)
        .then(res => {
          this.dataList = res.data.content;
          this.totalPage = res.data.totalPages;
          this.totalNum = res.data.totalElements;
        });
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getTemplateList();
    },
    useTemplate(content) {
      this.curItem.content = content;
      let content2 = this.$refs.editor.matchTitle(this.curItem.content || "");
      this.catalog = this.macthTitleToObject(content2);
    },
    /**
     * 添加共享件
     */
    addSharedPart() {
      this.$refs.sharedPartsField.openDialog(
        "ADD",
        this.treeFrom.category,
        false
      );
    },
    setTitle(catalog) {
      this.catalog = this.macthTitleToObject(catalog);
    },
    macthTitleToObject(catalog) {
      let result = [];
      catalog.map(item => {
        let regH1 = /<h1/g; //标题1
        let regH2 = /<h2/g; //标题2
        let regs1 = /<[h1,h2][^>]+>/gim; //抹除标签
        let regs2 = /<\/[h1,h2]+>/gim; //抹除标签
        let space = /&nbsp;/gi;
        let regs = /<.*?>+/g; //抹除全部标签
        let obj = {
          html: item.replace(regs, "").replace(space, ""),
          name: item.replace(regs, "").replace(space, "")
        };
        if (regH1.test(item)) {
          obj.type = "h1";
          result.push(obj);
        } else if (regH2.test(item)) {
          obj.type = "h2";
          result.push(obj);
        }
      });
      return result;
    },
    checkChildList(rule, value, callback) {
      if (this.fieldItem.type === "TABLE" && value.length === 0) {
        callback(new Error("必填"));
      }
      callback();
    },
    addChild() {
      this.fieldItem.childList.push({});
    },
    removeChild(index) {
      this.fieldItem.childList.splice(index, 1);
    },
    /**
     * 检查表单
     */
    doCheckNameDesc(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.publishBox = false;
          this.fieldBox = false;
          form === "fieldForm" ? this.doField() : this.doPublish();
        } else {
          return false;
        }
      });
    },
    showPublishBox() {
      this.publishBox = true;
      this.curItem.log = "";
    },
    doPublish() {
      this.curItem.version =
        this.versionType === "T"
          ? this.curItem.version - 1 + 0.1
          : this.curItem.version;
      this.$http.reportService
        .auditTemplate(this.curId, this.curItem)
        .then(() => {
          this.$message.success("提交成功 3秒后 关闭窗口");
          setTimeout(this.closeWindow, 3000);
        });
    },
    doSave() {
      this.$http.reportService
        .saveReportTempalte(this.curId, this.curItem)
        .then(() => {
          this.$message.success("保存成功");
        });
    },
    getTreeList() {
      this.$http.reportService
        .getTreeList(this.curItem.directoryId)
        .then(res => {
          this.treeData = [res.data];
        });
    },
    getTempalteDetail() {
      this.$http.reportService
        .getReporTemplateById(this.curId)
        .then(res => {
          this.curItem = res.data
          setTimeout(this.$refs.wordEditor.start,500);
        })
        // .then(this.getCategray)
        // .then(this.getReportTempalteVersion);
    },
    getCategray() {
      this.$http.sharedPartsService
        .getSharedPartsList(this.treeFrom)
        .then(res => {
          this.treeData = res.data;
        });
    },
    getReportTempalteVersion() {
      this.$http.reportService
        .getReportTempalteVersion(this.curItem.identifier)
        .then(res => {
          this.curItem.version = res.data + 1;
        });
    },
    doUpdate($event) {
      let file = $event.target.files[0];
      if (file.name.indexOf(".docx") === -1) {
        this.$message.error("报告只支持 docx 格式的word文档");
        return;
      }
      $event.target.value = "";
      let formData = new FormData();
      formData.append("upload", file);
      this.fullscreenLoading = true;
      this.$http.fileService
        .uploadFile(formData)
        .then(res => {
          this.updateFile.reportAddress = res.data;
        })
        .then(this.doUploadFile);
    },
    doUploadFile() {
      this.$http.reportService
        .importReportDoc(this.updateFile)
        .then(res => {
          // this.treeData = [res.data];
          this.curItem.content = res.message;
          let content = this.$refs.editor.matchTitle(res.message);
          this.catalog = this.macthTitleToObject(content);
          this.fullscreenLoading = false;
          this.$refs.editor.setDefaultValue(res.message);
        })
        .catch(() => {
          this.fullscreenLoading = false;
        });
    },
    addToHtml(data) {
      let dom = "";
      switch (data.shareComponentType) {
        case "TEXT":
          dom = this.createSpanDom(data);
          break;
        case "IMAGE":
          dom = this.createImgDom(data);
          break;
        case "TABLE":
          dom = this.createTableDom(data);
          break;
        case "ROOT":
          this.$message.error("根目录不支持检索");
          this.filterTree = "";
          this.$refs.tree.filter(val);
          break;
        default:
          // this.$message.error('目前支持添加 内容框，图片，表格');
          this.goWhere(data);
          break;
      }
      if (dom != "") {
        this.setEditorDom(dom);
      }
    },
    goWhere(data) {
      data.type = data.type || data.shareComponentType;
      this.$refs.editor.goWhere(data);
    },
    createTableDom(data) {
      let dom = "<span>" + data.name + "</span>";
      dom =
        dom +
        "<table border='0' width='100%' cellpadding='0' cellspacing='0' fieldid='" +
        data.id +
        "'><thead><tr>";
      if (data.tableHeadNode.length !== 0) {
        data.tableHeadNode.map(item => {
          dom = dom + "<th>";
          dom = dom + this.createSpanDom(item, "tableHeadId");
          dom = dom + "</th>";
        });
      }
      dom = dom + "</tr></thead></table>";
      return dom;
    },
    createImgDom(data) {
      let dom =
        "<div style='text-align:center'><img src='http://file.zhkytj.cn/1538014733699.png' alt='" +
        data.name +
        "' fieldid='" +
        data.id +
        "'/><br/><span>" +
        data.name;
      ("</span></div>");
      return dom;
    },
    createSpanDom(data, params = "id") {
      let dom =
        "<strong><span style='color:red;text-decoration:underline' fieldid='" +
        data[params] +
        "'>" +
        data.name +
        "</span></strong><span>&nbsp;</span>";
      return dom;
    },
    handleCommand(method, target) {
      this[method](target.$attrs.id || target.$attrs.data);
    },
    createSpanField(id) {
      this.fieldItem.parentId = id;
      this.fieldItem.type = "TEXT";
      this.fieldItem.childList = [];
      this.fieldItem.name = "";
      this.fieldItem.id = "";
      this.fieldItem.description = "";
      this.fieldBox = true;
    },
    createImgField(id) {
      this.fieldItem.parentId = id;
      this.fieldItem.type = "IMAGE";
      this.fieldItem.childList = [];
      this.fieldItem.name = "";
      this.fieldItem.id = "";
      this.fieldItem.description = "";
      this.fieldBox = true;
    },
    createTableField(id) {
      this.fieldItem.parentId = id;
      this.fieldItem.type = "TABLE";
      this.fieldItem.childList = [];
      this.fieldItem.name = "";
      this.fieldItem.id = "";
      this.fieldItem.description = "";
      this.fieldBox = true;
    },
    createParagra(data) {
      this.fieldItem.parentId = data.id;
      this.fieldItem.name = "";
      this.fieldItem.id = "";
      this.fieldItem.type = data.type === "ROOT" ? "H1" : "H2";
      this.fieldItem.description = "";
      this.fieldBox = true;
    },
    editField(data) {
      this.fieldItem = JSON.parse(JSON.stringify(data));
      // this.copyItem = JSON.stringify(data);
      this.fieldBox = true;
    },
    deleteParagra(id) {
      this.$confirm("是否删除此标题?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.reportService.deleteParagra(id).then(() => {
          this.$message.success("删除成功");
        });
      });
    },
    deleteField(id) {
      this.$confirm("是否删除此字段?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.reportService.deleteField(id).then(() => {
          this.$message.success("删除成功");
        });
      });
    },
    doField() {
      switch (this.fieldItem.type) {
        case "H1":
          this.$http.reportService.createParagra(this.fieldItem);
          break;
        case "H2":
          this.$http.reportService.createParagra(this.fieldItem);
          break;
        default:
          this.fieldItem.id === ""
            ? this.$http.reportService.createField(this.fieldItem)
            : this.$http.reportService.updateField(
                this.fieldItem.id,
                this.fieldItem
              );
          break;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      if (!data.name) return true;
      return data.name.indexOf(value) !== -1;
    },
    closeWindow() {
      window.close();
    },
    /**
     * 设置editor的dom
     */
    setEditorDom(dom) {
      this.$refs.editor.addHtml(dom);
    }
  }
};
</script>
<style lang="scss" scoped>
.titleBox {
  cursor: pointer;
  height: 89.11vh;
  overflow: auto;
  background-color: #ffffff;
  padding: 0.5em;
  box-sizing: border-box;
  width: 100%;
  border-radius: 6px;

  .titleH1 {
    font-size: 16px;
    padding: 0.5em;
    font-weight: bold;
    box-sizing: border-box;
  }
  .titleH2 {
    font-size: 14px;
    padding: 0.5em 2em;
    box-sizing: border-box;
  }
}
.fieldListBox {
  box-sizing: border-box;
  background-color: #f7faff;
  border: 1px solid #cfd7e5;
  padding: 1em;
  width: 100%;
  border-radius: 6px;
  .fieldItem {
    padding: 0.5em;
  }
}
.pr {
  position: relative;
}
.displayInput {
  opacity: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  position: absolute;
  left: 0;
  top: 0;
}
.custom-tree-node {
  font-size: 12px;
  position: relative;
  display: flex;
  width: 100%;
  .el-icon-more {
    opacity: 0;
  }
  .tree-name {
    width: 80%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .tree-tool {
    position: absolute;
    right: 3em;
  }
}
.custom-tree-node:hover {
  .el-icon-more {
    opacity: 1;
    transition: 1s all;
  }
}
.reportTemplate {
  height: 100vh;
  overflow: auto;
  // overflow: hidden;
  box-sizing: border-box;
  background-color: #edf1f7;
  // height: 100vh;
  header {
    background-color: #343a45;
    box-sizing: border-box;
    color: #ffffff;
    height: 8vh;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 1em;
    margin-bottom: 0.5em;
  }
  .reportContent {
    height: 92vh;
  }
  .menu {
    background-color: #ffffff;
    color: #343a45;
    margin: 0 0.5em;
    box-sizing: border-box;
    padding: 1em;
    height: 89.11vh;
    overflow: auto;
  }
  .palette {
    color: #343a45;
    padding: 0 0.5em;
    box-sizing: border-box;
  }
}
</style>

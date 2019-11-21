<template>
  <div class="reportTemplate">
    <header>
      <!-- <el-button type="primary" size="mini" @click="showPublishBox()">发布审核</el-button> -->
      <el-button type="primary" v-if="action==='edit'" size="mini" @click="outputWord()">导出word</el-button>
      <el-button type="primary" v-if="action==='edit'" size="mini" @click="doSave()">保存</el-button>
      <el-button type="info" size="mini" @click="closeWindow()">退出</el-button>
    </header>
    <el-row type="flex" justify="space-around">
      <el-col :span="4">
        <div class="titleBox">
          <h3>目录树</h3>
          <div
            :class="{'titleH1':item.type==='h1','titleH2':item.type==='h2'}"
            v-for="(item,index) in catalog"
            :key="index"
            @click="goWhere(item)"
          >{{item.html}}</div>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="palette">
          <wang-editor ref="editor" @getTitle="setTitle" v-model="curItem.reportHtml"></wang-editor>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import WangEditor from "@/components/wangEditor/wangEditor.vue";
export default {
  name: "reportOutput",
  components: { WangEditor },
  data() {
    return {
      catalog: [],
      curId: this.$route.params.projectId,
      action: this.$route.params.action,
      content: "",
      treeData: [],
      filterTree: "",
      curItem: {
        reportHtml: ""
      }
    };
  },
  watch: {
    filterTree(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getReportContent();
    this.getReportConclusion();
    this.getReportFieldList();
  },
  methods: {
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
    goWhere(data) {
      this.$refs.editor.goWhere(data);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getReportConclusion() {
      this.$http.reportService.getReportConclusion(this.curId).then(res => {
        this.content = res.data;
      });
    },
    getReportFieldList() {
      this.$http.reportService.getReportFieldList(this.curId).then(res => {
        this.treeData = [res.data];
      });
    },
    getReportContent() {
      this.$http.reportService.getReportContent(this.curId).then(res => {
        this.curItem.reportHtml = res.data;
        let content2 = this.$refs.editor.matchTitle(
          this.curItem.reportHtml || ""
        );
        this.catalog = this.macthTitleToObject(content2);
        this.$refs.editor.setDefaultValue(res.data);
      });
    },
    // showPublishBox() {
    //     this.$http.reportService.saveReport(this.curItem).then(() => {
    //     this.$message.success('保存成功');
    //   });
    // },
    doSave() {
      this.$http.reportService.saveReport(this.curId, this.curItem).then(() => {
        this.$message.success("保存成功");
      });
    },
    outputWord() {
      this.$http.reportService
        .saveReport(this.curId, this.curItem)
        .then(() => {
          this.$message.success("保存成功");
        })
        .then(() => {
          // window.open("http://192.168.30.96:8088/backend/api/files/generate")
          window.open(
            this.$http.reportService.exportReportByProjectId(this.curId)
          );
          // this.$http.reportService.exportReportByProjectId(this.curId).then(res=>{
          //   let file=fi
          // });
        });
    },
    closeWindow() {
      window.close();
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
.font-red {
  color: red;
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
  display: block;
  width: 100%;
  .el-icon-more {
    opacity: 0;
  }
  .tree-tool {
    position: absolute;
    right: 1em;
  }
}
.custom-tree-node:hover {
  .el-icon-more {
    opacity: 1;
    transition: 1s all;
  }
}
.reportTemplate {
  overflow: auto;
  box-sizing: border-box;
  background-color: #edf1f7;
  height: 100vh;
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

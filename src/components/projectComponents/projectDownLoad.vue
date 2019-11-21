<template>
  <el-dialog
    title="请选择报告版本"
    :visible.sync="visible"
    width="50%"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <div class="contentBox">
      <div class="box">
        <span>当前版本</span><br/><br/>
        <el-table :data="[report.activeVersion]" :row-class-name="tableRowClassName" border size='mini'>
          <el-table-column label="报告版本" prop="version" width="120"></el-table-column>
          <el-table-column label="发布时间" prop="publishDate"></el-table-column>
          <el-table-column label="修订记录" prop="log"></el-table-column>
          <el-table-column label="选择" width="50" center>
            <template slot-scope="scope">
               <el-radio v-model="curVersion" :label="scope.row.version"><span></span></el-radio>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="box">
        <span class="other" :class="showOther ? 'active' : ''" @click="showOther = !showOther"
          >其他版本&nbsp;&nbsp;<i class="el-icon el-icon-arrow-up"></i
        ></span><br/><br/>
        <el-table v-show="showOther" :data="report.historyVersions" :row-class-name="tableRowClassName" border size='mini'>
          <el-table-column label="报告版本" prop="version" width="120"></el-table-column>
          <el-table-column label="发布时间" prop="publishDate"></el-table-column>
          <el-table-column label="修订记录" prop="log"></el-table-column>
          <el-table-column label="选择" width="50" center>
            <template slot-scope="scope">
               <el-radio v-model="curVersion" :label="scope.row.version"><span></span></el-radio>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer">
      <el-button size="medium" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="medium" @click="choise()" :disabled="!curVersion">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "protjectDownLoad",
  props: {
    categoryType: String,
    reportType: { type: String, default: "FINAL_REPORT" },
    evaluationCategory: String,
    visible: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getReportVersion();
      }
    }
  },
  data() {
    return {
      curVersion: "",
      showOther: false,
      report: {
        activeVersion: {},
        historyVersions: []
      }
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.version===this.curVersion) {
        return "successClass";
      } 
      return "";
    },
    getReportVersion() {
      this.$http.reportService
        .getReportVersions({
          categoryType: this.categoryType,
          reportType: this.reportType,
          evaluationCategory: this.evaluationCategory
        })
        .then(res => {
          this.report = res.data;
          this.curVersion = this.report.activeVersion.version;
          // if (this.report.historyVersions.length === 0) {
          //   // this.generateReportVersion();
          //   this.choise();
          // }
        });
    },
    choise() {
      this.$emit("update:visible", false);
      this.$emit("success", this.curVersion);
    },
    cancel() {
      this.$emit("update:visible", false);
      this.$emit("cancel");
    }
  }
};
</script>
<style lang="scss" scope>
.contentBox {
  padding: 1em;
  .box {
    margin-top: 1em;
  }
  .box:first-child {
    margin-top: 0;
  }
  .other {
    color: #1890ff;
    font-weight: 300;
    cursor: pointer;
  }
  .el-icon {
    transition: all 0.5s;
  }
  .active {
    .el-icon {
      transform: rotate(180deg);
    }
  }
}
</style>

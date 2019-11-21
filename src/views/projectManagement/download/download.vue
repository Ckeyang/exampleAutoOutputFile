<template>
  <div class="materialInput">
    <el-row class="toolTitle" type="flex" justify="space-around" align="middle">
      <el-col :span="11">
        <h3 style="color:#ffffff">{{ data.companyName }}</h3>
      </el-col>
      <el-col :span="11" style="text-align:right">
        <el-button size="mini" @click="closeWindow()">取消</el-button>
      </el-col>
    </el-row>
    <div style="padding:1em;">
      <div class="regulation-tb box-style_common">
        <div class="tools-bar_common">
          <h5 class="tb-title">下载记录列表</h5>
        </div>
        <el-table :data="dataList">
          <el-table-column prop="reportTypeName" label="报告类型"> </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <i class="iconfont icon-i-shengchengzhong" v-if="scope.row.reportStatus === 'PROCESSING'"></i>
              {{ scope.row.reportStatus === "PROCESSING" ? "正在生成中" : scope.row.status }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i class="iconfont icon-shengchengbaogao" v-if="!scope.row.reportAddress" @click="doLoad(scope.row.reportType)"
                  >生成</i
                >
                <i
                  class="iconfont icon-shengchengbaogao"
                  v-if="scope.row.reportAddress && scope.row.reportStatus != 'PROCESSING'"
                  @click="doLoad(scope.row.reportType)"
                  >重新生成</i
                >
                <i
                  class="iconfont icon-xiazai"
                  v-if="scope.row.reportAddress && scope.row.reportStatus != 'PROCESSING'"
                  @click="download(scope.row.reportAddress)"
                  >下载</i
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <project-down-load
      :visible.sync="visible"
      :categoryType="curItem.categoryType"
      :reportType="curItem.reportType"
      :evaluationCategory="curItem.evaluationCategory"
      @success="doLoad"
    ></project-down-load>
    <download ref="downloadComponent" />
  </div>
</template>
<script>
import projectDownLoad from "@/components/projectComponents/projectDownLoad.vue";
import download from "@/components/tools/download.vue";
export default {
  name: "downloadPage",
  components: { projectDownLoad, download },
  data() {
    return {
      visible: false,
      totalPage: 0,
      totalNum: 0,
      timer: null,
      curItem: {},
      data: { companyName: "123" },
      dataList: []
    };
  },
  created() {
    this.getProjectDetail();
  },
  methods: {
    doLoad(reportType) {
      let item = this.dataList.find(item => item.reportType === reportType);
      let status = item.status;
      item.status = "正在生成中...";
      item.reportStatus = "PROCESSING";
      this.$http.projectService
        .generateReport(this.$route.params.projectId, {
          type: reportType
        })
        .then(() => {
          this.clearTimer();
          this.timer = setInterval(this.getDataList, 3000);
        })
        .catch(() => {
          this.getDataList();
          item.status = status;
        });
    },
    clearTimer() {
      window.clearInterval(this.timer);
      this.timer = null;
    },
    closeWindow() {
      window.close();
    },
    reload(reportType) {
      this.curItem.reportType = reportType;
      this.visible = true;
    },
    download(url) {
      this.$refs.downloadComponent.download(url);
    },
    getProjectDetail() {
      this.$http.projectService
        .getProjectById(this.$route.params.projectId)
        .then(res => {
          let { categoryType, evaluationCategory, companyName } = res.data;
          this.data = { companyName };
          this.curItem = { categoryType, evaluationCategory, companyName };
        })
        .then(this.getDataList);
    },
    getDataList() {
      this.$http.projectService.getDownloadList(this.$route.params.projectId).then(res => {
        this.dataList = res.data;
        let index = this.dataList.findIndex(item => {
          if (item.reportStatus === "PROCESSING") {
            return item;
          }
        });
        if (index === -1) {
          this.clearTimer();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.toolTitle {
  background-color: #107ac2;
  color: #ffffff;
  padding: 0.5em 1em;
}
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
</style>

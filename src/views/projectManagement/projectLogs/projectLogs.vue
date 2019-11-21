<template>
  <div class="project-template">
    <el-row class="toolTitle" type="flex" justify="space-around" align="middle">
      <el-col :span="11">
        <h3 style="color:#ffffff">{{ project.projectName }}</h3>
      </el-col>
      <el-col :span="11" style="text-align:right">
        <el-button size="mini" @click="closeWindow()">取消</el-button>
      </el-col>
    </el-row>
    <div style="padding:1em;">
      <div class="regulation-tb box-style_common">
        <div class="tools-bar_common">
          <h5 class="tb-title">项目日志列表</h5>
        </div>
        <el-table :data="dataList">
          <el-table-column prop="operatePerson" label="操作人" width="120"> </el-table-column>
          <el-table-column prop="operateTimeStr" label="操作时间" width="150"> </el-table-column>
          <el-table-column prop="operateContent" label="操作内容"> </el-table-column>
          <el-table-column prop="reason" label="原因">
            <template slot-scope="scope">
              <span>{{ scope.row.reason }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
      </div>
    </div>
  </div>
</template>
<script>
import pagniation from "@/components/tools/Pagniation.vue";
export default {
  name: "projectLogs",
  components: { pagniation },
  data() {
    return {
      totalPage: 0,
      totalNum: 0,
      project: { name: "123" },
      dataList: [],
      form: { pageSize: 30, current: 0 },
      projectId: this.$route.params.projectId
    };
  },
  created() {
    this.getProjectDetail();
  },
  methods: {
    closeWindow() {
      window.close();
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    getProjectDetail() {
      this.$http.projectService
        .getProjectById(this.projectId)
        .then(res => {
          this.project = res.data;
        })
        .then(this.getDataList);
    },
    getDataList() {
      this.$http.projectService.getProjectLogsById(this.projectId, this.form).then(res => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.project-template {
  position: relative;
  height: 100%;
  overflow: auto;
}
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

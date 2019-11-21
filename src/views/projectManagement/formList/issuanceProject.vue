// 待签发
<template>
  <div style="height:100%" class="cus-project-box">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="关键字">
            <el-input
              v-model="form.customQuery.keyWords"
              size="small"
              placeholder="请输入关键字"
              clearable
              @keyup.enter.native="getProjectList"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col class='search-btn-box'>
          <el-button type="primary" size="small" icon="el-icon-search" @click="getProjectList" >搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm" >重置</el-button>
        </el-col>
          <filter-component v-model="filterData" 
          tableName='Project_List_Issuance' 
          @advancedSerach='advancedSerach' 
          :stateList='projectStatelist'
          filedState='projectState'
          :getOptionsFn='getOptionsFn' :columnKeys='columnKeys' />
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">项目列表 - 待签发</h5>
        <div class="temp-box-btn">
          <dynamic-display-column :dataList='form.columns' :tableName='tableName' @refreshData="getData(true)" />
        </div>
      </div>
      <div class="table-box" v-loading='loading'>
        <vxe-table
          :data="dataList"
          v-if="showColumns.length"
          style="width:100%"
          :key='tableKey'
          :max-height='winHeight - 326'
          show-header-overflow
          highlight-hover-row
          header-row-class-name="cus-header-class"
        >
          <vxe-table-column type="index" width="70" title="序号"></vxe-table-column>
          <!-- <vxe-table-column label="业务类别" prop="evaluationCategoryName" width="160"></vxe-table-column>
          <vxe-table-column prop="projectName" label="项目名称"  show-overflow-tooltip min-width='200' >
          </vxe-table-column>
          <vxe-table-column prop="companyName" label="企业名称" min-width='150' show-overflow-tooltip >
          </vxe-table-column>
          <vxe-table-column prop="contractNumber" label="合同编号" width='180' show-overflow-tooltip></vxe-table-column>
          <vxe-table-column prop="entrustNumber" label="委托受理编号" width='180' show-overflow-tooltip></vxe-table-column> -->
          <vxe-table-column 
          v-for="item in showColumns" :key="item.id"
          :title="item.filedName" 
          :field="item.filedKey" 
          show-overflow
          min-width="160">
            <template slot-scope="scope">
              <span class="cus-tags-style" v-if='item.filedKey === "projectState"'>{{projectState(scope.row[item.filedKey])}}</span>
              <span v-else-if='item.filedKey === "memberNames"'>{{scope.row[item.filedKey].join(',')}}</span>
              <span v-else-if='item.filedKey === "entrustDate"'>{{Number(scope.row[item.filedKey]) | formatDate}}</span>
              <span v-else-if='item.filedKey === "publishedTime"'>{{Number(scope.row[item.filedKey]) | formatDate}}</span>
              <span v-else>{{scope.row[item.filedKey]}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i
                  class="iconfont icon-i-qianfa"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_issuance_{identifier}_issued_PUT')"
                  @click="signProject(scope.row.id)"
                >签发</i>
                <i
                  class="iconfont icon-xiazai"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_issuance_downLoadRecord_GET')"
                  @click="downLoadRecordSheet(scope.row.id)"
                >下载列表</i>
                <i
                  class="iconfont icon-chakan"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_issuance_templatePreview_GET')"
                  @click="goToFormPage(scope.row.projectName, scope.row.entrustNumber,scope.row.companyName, scope.row.id, 'view')"
                >查看数据</i>
                <i
                  class="iconfont icon-i-xiangmurizhi"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_issuance_getProjectLog_{projectId}_GET')"
                  @click="goToProjectLogsPage(scope.row.id)"
                >项目日志</i>
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
        <pagniation :totalPage="totalPage" :totalNum="totalNum" :currentPage='form.current' @changePage="handleChangePage" ></pagniation>
      </div>
    </div>
    <!-- 退回任务，取回修改，审核表单不通过 -->
    <send-back-task 
      :projectTask='taskReasonDialog' 
      v-model="taskReasonDialog.dialogVisible" 
      @submit='handleSubmit'/>
  </div>
</template>
<script>
import projectMixins from "./projectMixins.js";
import sendBackTask from "./components/sendBackTask.vue";
export default {
  components:{ sendBackTask },
  name:'issuance',
  mixins:[projectMixins],
  data() {
    return {
      taskReasonDialog:{   //审核表单//任务退回/取回修改/退回修改组件弹框信息
        title:'',
        placeholder:"",
        type:'',
        projectId:null,
        dialogVisible:false
      },
    };
  },
  methods: {
    //初始化项目列表
    getProjectList(filterData){
      this.loading = true;
      const {current, pageSize, customQuery } = this.form
      const params = {
        current,
        pageSize,
        customQuery
      }
      params.columns = this.splitColumnData(filterData)
      this.$http.projectService.getIssuanceProjectList(params).then((res)=>{
        this.dataList = res.data.content || [];
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      }).finally(()=>{
        this.loading = false;
      })
    },
    //签发项目
    signProject(id){
      this.curCheckedTrId = id;
      this.taskReasonDialog = {
        title:'是否签发此报告？',
        placeholder:"请输入原因",
        type:'SIGN_PROJECT',
        projectId:id,
        dialogVisible:true
      }
    },
    handleSubmit(type, params){
      const serviceParam = {
        "changeContents":params.checkList,
        "remark": params.remark,
        "result": params.radioState
      }
      // 执行签发
      this.$http.projectService.issuedProject(this.curCheckedTrId, serviceParam).then(()=>{
        this.$message({
            message: '签发成功！',
            type: 'success'
          });
        this.resetTaskReasonDialog()
        this.getProjectList() //刷新页面
      })
    },
    // 重置弹框状态
    resetTaskReasonDialog(){
      this.taskReasonDialog={
        title:'',
        placeholder:"",
        type:'',
        dialogVisible:false
      }
    }
  }
};
</script>

<style scoped>
</style>
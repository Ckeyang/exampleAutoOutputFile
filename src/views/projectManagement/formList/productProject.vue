// 已生成
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
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col class='search-btn-box'>
          <el-button type="primary" size="small" icon="el-icon-search" @click="searchData" >搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm" >重置</el-button>
        </el-col>
          <filter-component v-model="filterData" 
          tableName='Project_List_ViewReport' 
          @advancedSerach='advancedSerach' 
          :getOptionsFn='getOptionsFn' :columnKeys='columnKeys' />
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">项目列表 - 已生成</h5>
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
              <span v-else>{{scope.row[item.filedKey]}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <div class="operation-icon">
                 <i
                  class="iconfont icon-shenhe"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_reports_{identifier}_audited_PUT')"
                  @click="commitAudit(scope.row.id, scope.row.remark)"
                >审核</i>
                <i
                  class="iconfont"
                  :class='scope.row.projectState === "GENERATING_REPORT" ? "icon-i-shengchengzhong" : "icon-i-zhongxinshengcheng"'
                  @click="generateReportVersion(scope.row)"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_reports{identifier}_report_POST')"
                >{{scope.row.projectState === "GENERATING_REPORT" ? '生成中....' : '重新生成'}}</i>
                <!-- <i
                  class="iconfont icon-i-zhongxinshengcheng"
                  @click="generateReport(scope.row)"
                >重新生成</i> -->
                <i
                  class="iconfont icon-xiazai"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_reports_downLoadRecord_GET')"
                  @click="downLoadRecordSheet(scope.row.id)"
                >下载列表</i>
                <i
                  class="iconfont icon-chakan"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_reports_templatePreview_GET')"
                  @click="goToFormPage(scope.row.projectName, scope.row.entrustNumber,scope.row.companyName, scope.row.id, 'view')"
                >查看数据</i>
                <i
                  class="iconfont icon-i-xiangmurizhi"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_reports_getProjectLog_{projectId}_GET')"
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
      <!-- 选择报告模版版本 -->
    <projectDownLoad 
      :visible.sync='choiceReportTempVisionDialog.reportVersionBox' 
      :categoryType='choiceReportTempVisionDialog.categoryType' 
      :evaluationCategory='choiceReportTempVisionDialog.evaluationCategory'
      @success='generateReportVersion'/>
  </div>
</template>

<script>
import projectMixins from "./projectMixins.js";
import sendBackTask from "./components/sendBackTask.vue";
import projectDownLoad from "@/components/projectComponents/projectDownLoad.vue";
import bus from '@/views/common/bus.js'
export default {
  components:{ sendBackTask, projectDownLoad },
  name: 'viewReport',
  data() {
    return {
      curCheckedTrId:null,
      taskReasonDialog:{   //审核表单//任务退回/取回修改/退回修改组件弹框信息
        title:'',
        placeholder:"",
        type:'',
        projectId:null,
        dialogVisible:false
      },
      timer:null,
      count:0,
      choiceReportTempVisionDialog:{ // 选择报告模板版本的弹框
        reportVersionBox:false,
        categoryType:'',
        evaluationCategory:''
      },
    };
  },
  mixins: [projectMixins], // 混入公共逻辑
  destroyed(){
    this.clearIntervalFn()
  },
  mounted(){
    bus.$on('webSocket', this.webSocketCb) // 添加websocket 事件监听
  },
  beforeDestroy(){
    bus.$off('webSocket', this.webSocketCb) // 移除websocket 事件监听
  },
  methods: {
    webSocketCb(data){
      this.getProjectList()
    },
    // // 轮询刷新数据
    // loopGetData(){
    //   this.timer = setInterval(()=>{
    //     if(this.count>=200){
    //       this.clearIntervalFn()
    //       return 
    //     }
    //     const {current, pageSize, customQuery } = this.form
    //     const params = {
    //       current,
    //       pageSize,
    //       customQuery
    //     }
    //     params.columns = this.splitColumnData()
    //     this.$http.projectService.getFormListViewReport(params).then((res)=>{
    //       this.dataList = res.data.content || [];
    //       this.totalPage = res.data.totalPages;
    //       this.totalNum = res.data.totalElements;
    //     })
    //     this.count++
    //   },3000)
    // },
    getProjectList(filterData){
      this.loading = true;
      const {current, pageSize, customQuery } = this.form
      const params = {
        current,
        pageSize,
        customQuery
      }
      params.columns = this.splitColumnData(filterData)
      this.$http.projectService.getFormListViewReport(params).then((res)=>{
        this.dataList = res.data.content || [];
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
        // this.clearIntervalFn()
        // this.loopGetData() // 开启轮询
      }).finally(()=>{
        this.loading = false;
      })
    },
    clearIntervalFn(){
      clearInterval(this.timer)
      this.count = 0;
      this.timer = null
    },
    //审核表单
    commitAudit(id, remark) {
      this.curCheckedTrId = id;
      this.taskReasonDialog = {
        title:'是否审核通过此报告？',
        placeholder:"请输入原因",
        type:'AUDIT_PROJECT',
        projectId:id,
        dialogVisible:true
      }
    },
    handleSubmit(type, params){
      // 审核
      const serviceParam = {
        "changeContents":params.checkList,
        "remark": params.remark,
        "result": params.radioState
      }
      this.$http.projectService.auditProject(this.curCheckedTrId, serviceParam).then(()=>{
        this.$message({
            message: '审核已提交！',
            type: 'success'
          });
        this.resetTaskReasonDialog()
        this.getProjectList() //刷新页面
      })
    },
    // 选择报告模板版本
    generateReport({id, categoryType, evaluationCategory, reportTemplateId, projectState }) {
      if (projectState !== "GENERATING_REPORT") {
        this.curCheckedTrId = id;
        this.choiceReportTempVisionDialog = {  //打开选择版本提示框
            categoryType,
            evaluationCategory,
            reportVersionBox:true
          }
      } 
    },
    // 重新生成报告
    generateReportVersion(item) {
      const params = {
        type:'FINAL_REPORT'
      }
      this.$http.projectService
        .regenerateReport(item.id, params)
        .then(() => {
          // this.clearIntervalFn()
          // this.loopGetData() // 开启轮询
        })
         
    },
    // 重置弹框状态
    resetTaskReasonDialog(){
      this.taskReasonDialog={
        projectId:'',
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
// 待生成
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
          tableName='Project_List_NoReport' 
          @advancedSerach='advancedSerach' 
          :stateList='projectStatelist'
          filedState='projectState'
          :getOptionsFn='getOptionsFn' :columnKeys='columnKeys' />
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">项目列表 - 待生成</h5>
        <div class="temp-box-btn">
          <dynamic-display-column :dataList='form.columns' :tableName='tableName' @refreshData="getData(true)" />
        </div>
      </div>
      <div class="table-box" v-loading='loading' >
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
              <span class="cus-tags-style" v-if='item.filedKey === "projectState"'>{{projectState(scope.row.projectState)}}</span>
              <span v-else-if='item.filedKey === "memberNames"'>{{scope.row.memberNames.join(',')}}</span>
              <span v-else-if='item.filedKey === "entrustDate"'>{{Number(scope.row.entrustDate) | formatDate}}</span>
              <span v-else-if='item.filedKey === "publishedTime"'>{{Number(scope.row[item.filedKey]) | formatDate}}</span>
              <span v-else>{{scope.row[item.filedKey]}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i
                  class="iconfont"
                  :class='scope.row.projectState === "GENERATING_REPORT" ? "icon-i-shengchengzhong" : "icon-shengchengbaogao"'
                  @click="generateReportVersion(scope.row)"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_noReport{identifier}_report_POST')"
                >{{scope.row.projectState === "GENERATING_REPORT" ? '生成中....' : '生成报告'}}</i>
                <i
                  class="iconfont icon-tuihuixiugai"
                  v-if="scope.row.projectState !== 'GENERATING_REPORT' && checkAuth('RBAC_PERMISSION_api_app_project_noReport_{identifier}_rejected_PUT')"
                  @click="backToEdit(scope.row.id)"
                >退回</i>
                <i
                  class="iconfont icon-xiazai"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_noReport_downLoadRecord_GET')"
                  @click="downLoadRecordSheet(scope.row.id)"
                >下载列表</i>
                <i
                  class="iconfont icon-chakan"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_noReport_templatePreview_GET')"
                  @click="goToFormPage(scope.row.projectName, scope.row.entrustNumber,scope.row.companyName, scope.row.id, 'view')"
                >查看数据</i>
                <i
                  class="iconfont icon-i-xiangmurizhi"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_noReport_getProjectLog_{projectId}_GET')"
                  @click="goToProjectLogsPage(scope.row.id)"
                >项目日志</i>
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
        <pagniation :totalPage="totalPage" :totalNum="totalNum" :currentPage='form.current' @changePage="handleChangePage" ></pagniation>
      </div>
    </div>
    <!-- <el-dialog title="报告模板有新版本" :visible.sync="reportVersionBox" width="30%" v-el-drag-dialog>
      <div style="padding:1em 0;">
        <el-tag
          style="cursor:pointer;margin-left:1em"
          @click.native="choiceReportVersion(item)"
          v-for="(item,index) in reportVersions"
          :key="index"
          :type="checkReportVersion(item)"
        >发布版V{{item}}.0</el-tag>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="reportVersionBox=false">取 消</el-button>
        <el-button type="primary" size="medium" @click="generateReportVersion" :disabled="!curReportTemplateId">确 定</el-button>
      </div>
    </el-dialog> -->
    <!-- 选择报告模版版本 -->
    <projectDownLoad 
      :visible.sync='choiceReportTempVisionDialog.reportVersionBox' 
      :categoryType='choiceReportTempVisionDialog.categoryType' 
      :evaluationCategory='choiceReportTempVisionDialog.evaluationCategory'
      @success='generateReportVersion'/>
    <!-- 退回任务，取回修改，审核表单不通过 -->
    <send-back-task 
      :projectTask='taskReasonDialog' 
      v-model="taskReasonDialog.dialogVisible" 
      @submit='handleSubmit'/>
  </div>
</template>

<script>
import sendBackTask from "./components/sendBackTask.vue";
import projectMixins from "./projectMixins.js";
import projectDownLoad from "@/components/projectComponents/projectDownLoad.vue";
import bus from '@/views/common/bus.js'
export default {
  components:{ 
    sendBackTask, 
    projectDownLoad // 选择报告模板版本
  },
  name: 'noReport',
  data() {
    return {
      curCheckedTrId:null, // 当前操作的行id
      curReportTemplateId: "",
      choiceReportTempVisionDialog:{ // 选择报告模板版本的弹框
        reportVersionBox:false,
        categoryType:'',
        evaluationCategory:''
      },
      count:0, // 轮询次数
      timer:null,
      taskReasonDialog:{   //审核表单//任务退回/取回修改/退回修改组件弹框信息
        title:'',
        placeholder:"",
        type:'',
        projectId:'',
        dialogVisible:false
      },
    };
  },
  mixins: [projectMixins], // 混入公共逻辑
  destroyed(){
    clearInterval(this.timer)
  },
  created(){
    this.form.projectState = this.$route.query.projectState
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
    //        this.clearIntervalFn()
    //       return 
    //     }
    //     const {current, pageSize, customQuery } = this.form
    //     const params = {
    //       current,
    //       pageSize,
    //       customQuery
    //     }
    //     params.columns = this.splitColumnData()
    //     this.$http.projectService.getFormListNoReport(params).then((res)=>{
    //       this.dataList = res.data.content || [];
    //       this.totalPage = res.data.totalPages;
    //       this.totalNum = res.data.totalElements;
    //     }).catch(()=>{
    //       this.clearIntervalFn()
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
      this.$http.projectService.getFormListNoReport(params).then((res)=>{
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
    //退回到修改状态
    backToEdit(id){
      this.curCheckedTrId = id
      this.taskReasonDialog={
        title:'退回修改',
        placeholder:"请输入退回修改原因",
        type:'BACK_EDIT',
        projectId:id,
        dialogVisible:true
      }
    },
    handleSubmit(type, params){
      //  退回修改
      this.$http.projectService.sendBackToEdit_noReport(this.taskReasonDialog.projectId, { remark:params.remark, changeContents: params.checkList}).then(()=>{
        this.$message({
          type: "success",
          message: "项目已退回!"
        });
        this.getProjectList()
        this.resetTaskReasonDialog()
      })
    },
    //选择报告模板版本
    generateReport({id, categoryType, evaluationCategory, projectState }) {
      if (projectState !== "GENERATING_REPORT") {
        this.curCheckedTrId = id;
        this.choiceReportTempVisionDialog = {  //打开选择版本提示框
            categoryType,
            evaluationCategory,
            reportVersionBox:true
          }
      } 
    },
    // 生成报告
    generateReportVersion(item) {
      const params = {
        type:'FINAL_REPORT'
      }
      this.$http.projectService
        .generateReport(item.id, params)
        .then(() => {
          this.clearIntervalFn()
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
.icon-i-shengchengzhong{
  color: #1884CC;
}
.icon-i-shengchengzhong::before{
  animation: rotate 2s linear infinite;
  display: inline-block;
}
@keyframes rotate {
  from { transform: rotate(0deg)}
  to { transform: rotate(360deg)}
} 
</style>
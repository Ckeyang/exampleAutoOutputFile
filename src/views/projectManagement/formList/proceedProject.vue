<template>
   <div style="height:100%" class="cus-project-box">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="项目状态">
            <el-select v-model="form.customQuery.projectState" size="small" @change="searchData" clearable style='width:100%'>
              <el-option label="全部" value></el-option>
              <el-option label="待执行" value='WAITING_EXECUTION'></el-option>
              <el-option label="待提交现场数据" value='WAITING_SUBMIT_SCENE_DATA'></el-option>
              <el-option label="待修改现场数据" value='WAITING_EDIT_SCENE_DATA'></el-option>
              <el-option label="待现场复核" value='WAITING_SCENE_REVIEW'></el-option>
              <el-option label="待提交检测结果" value='WAITING_SUBMIT_TEST_RESULT'></el-option>
              <el-option label="待修改检测结果" value='WAITING_EDIT_TEST_RESULT'></el-option>
              <el-option label="待实验室复核" value='WAITING_LABORATORY_REVIEW'></el-option>
              <el-option label="待修改项目信息" value='WAITING_EDIT_PROJECT_INFO'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键字">
            <el-input
              v-model="form.customQuery.keyWords"
              size="small"
              placeholder='请输入关键字'
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
          tableName='Project_List_Proceed' 
          @advancedSerach='advancedSerach' 
          :stateList='projectStatelist'
          filedState='projectState'
          :getOptionsFn='getOptionsFn' :columnKeys='columnKeys' />
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">项目列表 - 执行中的项目</h5>
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
              <span class="cus-tags-style" v-if='item.filedKey === "projectState"'>
                <span class="cus-tags-style" v-if="!scope.row.projectDataSubmissionStatus || scope.row.projectDataSubmissionStatus === 'NONE'">
                  <popover-tips :btn-text="projectState(scope.row.projectState)" v-if="isShowTips(scope.row) && scope.row.returnedRemark">
                    <ul class='popover-tips-box'>
                      <li>
                        <div class="tips-item-title"><span>退回原因</span>：</div>
                        <p class="tips-item-content">{{scope.row.returnedRemark}}</p>
                      </li>
                      <li>
                        <div class="tips-item-title"><span>操作人</span>：</div>
                        <span class="tips-item-content">{{scope.row.modifierName}}</span>
                      </li>
                      <li>
                        <div class="tips-item-title"><span>操作时间</span>：</div>
                        <span class="tips-item-content">{{Number(scope.row.lastUpdate) | formatDate('yyyy-MM-dd hh:mm')}}</span>
                      </li>
                    </ul>
                  </popover-tips>
                  <span v-else>{{projectState(scope.row.projectState)}}</span> 
                </span>
                <span v-else-if="scope.row.projectDataSubmissionStatus === 'PROCESSING'">
                  <i class="iconfont icon-i-shengchengzhong" >正在提交{{scope.row.projectState.indexOf('SCENE') > -1 ? '现场数据':'检测记录'}}...</i>
                </span>
                <span v-else-if="scope.row.projectDataSubmissionStatus === 'FAILED'">
                  <i class="iconfont icon-i-shibai">提交失败</i><i class="iconfont checkErrorMesgBtn" @click="checkErrorMesg(scope.row)">查看原因</i>
                </span>
              </span>
              <span v-else-if='item.filedKey === "memberNames"'>{{scope.row[item.filedKey].join(',')}}</span>
              <span v-else-if='item.filedKey === "entrustDate"'>{{Number(scope.row[item.filedKey]) | formatDate}}</span>
              <span v-else-if='item.filedKey === "publishedTime"'>{{Number(scope.row[item.filedKey]) | formatDate}}</span>
              <span v-else>{{scope.row[item.filedKey]}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" fixed="right" width="300">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i
                  class="iconfont icon-i-fenpairenwu"
                  @click="assignmentTask(scope.row.id, scope.row.memberIds)"
                  v-if="checkBtnAuth('task_assign', scope.row.projectState)"
                >分派任务</i>
                <i
                  class="iconfont icon-i-tuihuirenwu"
                  @click="sendBackTask(scope.row.id)"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_proceed_{identifier}_task_reject_PUT') && scope.row.projectState ==='WAITING_EXECUTION'"
                >退回项目</i>
                <i
                  class="iconfont icon-i-kaishizhihang"
                  @click="startEntry(scope.row)"
                  v-if="scope.row.projectState ==='WAITING_EXECUTION' && checkAuth('RBAC_PERMISSION_api_app_project_proceed_{identifier}_executed_PUT')"
                >开始执行</i>
                <i
                  class="iconfont icon-i-lurushuju1"
                  @click="goToFormPage(scope.row.projectName, scope.row.entrustNumber,scope.row.companyName, scope.row.id, 'edit')"
                  v-if="['WAITING_EDIT_SCENE_DATA','WAITING_SUBMIT_SCENE_DATA'].includes(scope.row.projectState) && checkAuth('RBAC_PERMISSION_api_app_project_proceed_entryData_GET')"
                >录入数据</i>
                <i
                  class="iconfont icon-i-tijiaoxianchangshuju"
                  v-if="scope.row.projectDataSubmissionStatus !== 'PROCESSING'&&['WAITING_EDIT_SCENE_DATA','WAITING_SUBMIT_SCENE_DATA'].includes(scope.row.projectState) && checkAuth('RBAC_PERMISSION_api_app_project_proceed_{identifier}_site_data_POST')"
                  @click="submitSceneRecord(scope.row)"
                >提交现场记录</i>
                <i
                  class="iconfont icon-i-tijiaoxianchangshuju"
                  @click="submitTextRecord(scope.row)"
                  v-if="scope.row.projectDataSubmissionStatus !== 'PROCESSING'&&['WAITING_SUBMIT_TEST_RESULT','WAITING_EDIT_TEST_RESULT'].includes(scope.row.projectState) && checkAuth('RBAC_PERMISSION_api_app_project_proceed_{identifier}_detect_data_POST')"
                >提交检测结果</i>
                <i
                  class="iconfont icon-i-fuhexianchangjilu"
                  v-if="scope.row.projectState === 'WAITING_SCENE_REVIEW' && checkAuth('RBAC_PERMISSION_api_app_project_proceed_{identifier}_site_data_reviewed_PUT')"
                  @click="reviewSceneRecord(scope.row.id)"
                >复核现场记录</i>
                 <i
                  class="iconfont icon-i-fuhexianchangjilu"
                  @click="reviewTextRecord(scope.row.id)"
                  v-if="scope.row.projectState === 'WAITING_LABORATORY_REVIEW' && checkAuth('RBAC_PERMISSION_api_app_project_proceed_{identifier}_detect_data_reviewed_PUT')"
                >复核检测记录</i>
                <i
                  class="iconfont icon-i-shiyanshicaiyang"
                  @click="openWindow('/laboratorySampling/'+scope.row.id)"
                  v-if="checkBtnAuth('sample_collection', scope.row.projectState)"
                >样品收录</i>
                <i
                  class="iconfont icon-i-saoma"
                  v-if="['WAITING_SUBMIT_TEST_RESULT','WAITING_EDIT_TEST_RESULT'].includes(scope.row.projectState) && checkAuth('RBAC_PERMISSION_api_app_project_proceed_scanCodeEntryList_GET')"
                  @click="scanCodeEntry(scope.row)"
                >扫码录入</i>
                <i
                  class="iconfont icon-tuihuixiugai"
                  @click="backToEdit(scope.row.id)"
                  v-if="['WAITING_SUBMIT_TEST_RESULT','WAITING_EDIT_TEST_RESULT'].includes(scope.row.projectState) && checkAuth('RBAC_PERMISSION_api_app_project_proceed_{identifier}_rejected_PUT')"
                >退回</i>
                <i
                  class="iconfont icon-xiazai"
                  v-if="checkBtnAuth('downLoad_list', scope.row.projectState)"
                  @click="downLoadRecordSheet(scope.row.id)"
                >下载列表</i>
                <i
                  class="iconfont icon-i-xiugaixiangmuxinxi"
                  @click="editProjectForm(scope.row.id)"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_proceed_{identifier}_PUT')"
                >修改项目信息</i>
                <i
                  class="iconfont icon-chakan"
                  v-if="scope.row.projectState !=='WAITING_EXECUTION' && checkAuth('RBAC_PERMISSION_api_app_project_proceed_templatePreview_GET')"
                  @click="goToFormPage(scope.row.projectName, scope.row.entrustNumber,scope.row.companyName, scope.row.id, 'view')"
                >查看数据</i>
                <i
                  class="iconfont icon-i-xiangmurizhi"
                  @click="goToProjectLogsPage(scope.row.id)"
                >项目日志</i>
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
        <pagniation :totalPage="totalPage" :totalNum="totalNum" :currentPage='form.current' @changePage="handleChangePage" ></pagniation>
      </div>
    </div>
    <!-- 修改项目信息 -->
    <projectForm 
      :visible.sync='dialogVisible' 
      type='EDIT' 
      ref='projectForm'
      :categoriesList='categoriesList' 
      :firstCategoriesList='firstCategoriesList'  
      @submit='saveProject' />
    <!-- 分派任务 -->
    <assign-tasks ref='assignTasks' interfaceType='assignTask_proceed' @refreshData='getProjectList'/>
    <!-- 退回任务，提交数据，追回， 审核表单不通过 -->
    <send-back-task 
      :projectTask='taskReasonDialog' 
      v-model="taskReasonDialog.dialogVisible" 
      @submit='handleSendBckTask'
      @refreshData='getProjectList'/>
      <!-- 处理现场数据 -->
    <submit-data-validate :visible.sync='submitDataValidateForm.visible' 
    @handleEvent='handleEvent' 
    :dataList='sceneRecordErrorData'
    :projectId="submitDataValidateForm.projectId"
    @submitData='submitData'/>
    <!-- 提交数据等待框
    <custom-loading :visible.sync='submitLoadingVisible' :delay='5'>
      <p style="color:#262626">正在提交中...</p>
      <p style="color:#8C8C8C">请稍后关注列表中的提交状态！</p>
    </custom-loading> -->
  </div>
</template>

<script>
import assignTasks from "./components/assignTasks.vue";
import sendBackTask from "./components/sendBackTask.vue";
import customLoading from "@/components/tools/customLoading/index.vue";
import submitDataValidate from "./components/submitDataValidate.vue";
import popoverTips from "@/components/tools/popoverTips.vue";
import projectForm from "./components/projectForm.vue";
import projectMixins from "./projectMixins.js";
import { getLocation, judgeIsChangeCurPage } from "@/utils.js";
import bus from '@/views/common/bus.js'
export default {
  components:{ 
    assignTasks, 
    sendBackTask, 
    customLoading, 
    popoverTips,
    projectForm,
    submitDataValidate, // 数据提交确认 
  },
  name: 'proceed',
  data() {
    return {
      curCheckedTrId:null,
      taskReasonDialog:{
        projectId:'',
        title:'',
        placeholder:"",
        type:'',
        dialogVisible:false
      },
      tableKey:0,
      dialogVisible:false,
      dialogVisible2:false,
      // submitLoadingVisible:false, // 提交等待loading框
      submitDataValidateForm:{
        type:'',  //SCENE 现场 ， TEXT 检测
        visible:false,
        projectId:null
      },
      sceneRecordErrorData:[], // 现场数据有问题的数据列表
      categoriesList: [], //所有的评价类别树
      firstCategoriesList: [], //检测，咨询一级类别列表
    };
  },
  mixins: [projectMixins], // 混入公共逻辑
  watch:{
    // submitLoadingVisible(val){
    //   if(!val){
    //     this.getProjectList()
    //   }
    // }
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
      console.log('我刷新了')
    },
    getProjectList(filterData){
      this.loading = true;
      const {current, pageSize, customQuery } = this.form
      const params = {
        current,
        pageSize,
        customQuery
      }
      params.columns = this.splitColumnData(filterData)
      this.$http.projectService.getProceedProjectList(params).then((res)=>{
        judgeIsChangeCurPage(res.data, this.form, this.getProjectList)
        this.dataList = res.data.content || [];
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      }).finally(()=>{
        this.loading = false;
      })
    },
    checkBtnAuth(type, state){
      switch(type){
        case 'task_assign' :  // 分派任务
          return (state !=='UNPUBLISHED') && this.checkAuth('RBAC_PERMISSION_api_app_project_proceed_{identifier}_task_assign_PUT');
        case 'downLoad_list' :  // 下载列表
          return !['WAITING_EDIT_PROJECT_INFO','SUSPEND','STOPPED','WAITING_EXECUTION'].includes(state) && 
          this.checkAuth('RBAC_PERMISSION_api_app_project_proceed_downLoadRecord_GET');
        case 'sample_collection' :  
          return ['WAITING_SUBMIT_TEST_RESULT','WAITING_EDIT_TEST_RESULT','STOPPED'].includes(state) && 
          this.checkAuth('RBAC_PERMISSION_api_app_project_proceed_laboratorySampling_GET');
        default : return false
      }
    },
    //开始执行
    startEntry({id, projectName, entrustNumber, companyName }){
      this.$http.projectService.startEntryProject(id).then(()=>{
        this.goToFormPage(projectName, entrustNumber, companyName, id, 'edit')
        this.getProjectList()
      })
    },
    //修改项目基本信息  
    async saveProject(form) {
      let params = {
            companyAddress:form.addressValue,
            ... form
          };
        delete params.addressValue
        params.evaluationCategory = form.evaluationCategory[
          form.evaluationCategory.length - 1
        ];
        const { provinceValue, cityValue, countyValue, streetValue } = params.companyAddress
        let addrParamter = provinceValue + cityValue + countyValue + streetValue + ''
        //获取地址经纬度
        const location = await getLocation(addrParamter)
        params.geocoding = location
          //修改
        this.$http.projectService.editProject_proceed(this.curCheckedTrId, params).then(res => {
            this.dialogVisible = false;
            this.getProjectList(); //刷新页面
            this.$message({
              type: "success",
              message: "项目基本信息修改成功!"
            });
          });
    },
    //分派任务
    assignmentTask(id, userIds){
      this.$refs.assignTasks.openDialog(id, userIds)
    },
    // 提交现场记录
    submitSceneRecord(row){
      this.curCheckedTrId = row.id
      row.projectDataSubmissionStatus = 'PROCESSING'
      this.$http.formEnterService.validateFormData(row.id, {submitType: 'SITE_DATA', url: this.$route.fullPath})
    },
    // 提交检测结果
    submitTextRecord(row){
      this.curCheckedTrId = row.id
      row.projectDataSubmissionStatus = 'PROCESSING'
      this.$http.formEnterService.validateFormData(row.id, {submitType: 'DETECTION_DATA', url: this.$route.fullPath})
    },
    //提交失败去处理
    checkErrorMesg({id, projectState, validateFormDataEntities}){
      let type = null
      if(['WAITING_SUBMIT_SCENE_DATA','WAITING_EDIT_SCENE_DATA'].includes(projectState)){
        type = 'SCENE'
      }else{
        type = 'TEXT'
      }
      this.curCheckedTrId = id
      this.sceneRecordErrorData = validateFormDataEntities || []
      this.submitDataValidateForm = {
        visible : true,
        type,
        projectId:id
      }
    },
    // 确认数据时快速进入点击的组件
    handleEvent(obj){
      const query = {
        curId:obj.componentId || null,
        title:obj.componentName || '',
        queryDataIds : JSON.stringify(obj.dataIds) || null 
      }
      const data = this.dataList.find(item => item.id === this.curCheckedTrId)
      if(data){
        const title = encodeURIComponent(data.projectName) //对名字进行十六进制转义
        const number = encodeURIComponent(data.entrustNumber) //对名字进行十六进制转义
        const companyName = encodeURIComponent(data.companyName) //对名字进行十六进制转义
        if(this.submitDataValidateForm.type === 'SCENE'){  
          this.openWindow(`/templatePreview/${title}/${number}/${companyName}/${data.id}/edit/project`, query)
        }else{
          if(obj.formDataValidateType === 'NOT_SAMPLING'){
            this.openWindow(`/laboratorySampling/${data.id}`, {
              menuType:'B'
            }) // 去扫码收样页面
          }else{  // 去扫码录入页面
            this.openWindow(`/scanCodeEntryList/${data.id}/${companyName}/${number}`, query)
          }    
        }   
      } 
    },
    // 提交现场数据，检测数据
    submitData(){
      if(this.submitDataValidateForm.type === 'SCENE'){  // 现场
          this.$http.projectService.submitSiteData(this.submitDataValidateForm.projectId).then((res)=>{
            this.$message({
              type: "success",
              message: "现场数据提交成功!"
            });
            this.getProjectList()
            this.resetSubmitDataForm()
          })
        }else{  // 检测
          this.$http.projectService.submitDetectData(this.submitDataValidateForm.projectId).then((res)=>{
            this.$message({
              type: "success",
              message: "检测记录提交成功!"
            });
            this.getProjectList()
            this.resetSubmitDataForm()
          })
        }
    },
    // 去扫码录入界面
    scanCodeEntry({id, companyName, entrustNumber}){
      this.openWindow(`/scanCodeEntryList/${encodeURIComponent(id)}/${encodeURIComponent(companyName)}/${encodeURIComponent(entrustNumber)}`)
    },
    // 执行确定弹框的逻辑
    handleSendBckTask(type, params){
      switch(type){
        case 'BACK_TASK':{
          this.$http.projectService.sendBackTask(this.curCheckedTrId, {remark: params.remark}).then(()=>{
            this.$message({
               message: '任务已退回！',
              type: 'success'
            });
            this.getProjectList()
            this.resetTaskReasonDialog()
          })
          break;
        }
        // 退回修改
        case 'BACK_EDIT':{
          this.$http.projectService.sendBackToEdit(this.curCheckedTrId, {remark:params.remark, changeContents:params.checkList}).then(()=>{
            this.$message({
               message: '项目已退回修改！',
              type: 'success'
            });
            this.getProjectList()
            this.resetTaskReasonDialog()
          })
          break;
        }
        //复核现场记录
        case 'REVIEW_SCENE_RECORD':{
          this.$http.projectService.reviewedSiteData(this.curCheckedTrId, {remark:params.remark, reviewResult:params.radioState}).then(()=>{
            this.$message({
               message: '现场记录已复核！',
              type: 'success'
            });
            this.getProjectList()
            this.resetTaskReasonDialog()
          })
          break;
        }
        //复核检测记录
        case 'REVIEW_TEXT_RECORD':{
          this.$http.projectService.reviewedDetectData(this.curCheckedTrId, {remark:params.remark, reviewResult:params.radioState}).then(()=>{
            this.$message({
               message: '检测结果已复核！',
              type: 'success'
            });
            this.getProjectList()
            this.resetTaskReasonDialog()
          })
          break;
        }
      }
    },
    // 退回修改
    backToEdit(id){
      this.curCheckedTrId = id
      this.taskReasonDialog={
        projectId:id,
        title:'退回',
        placeholder:"请输入退回修改原因",
        type:'BACK_EDIT',
        dialogVisible:true
      }
    },
    // 退回项目
    sendBackTask(id){
      this.curCheckedTrId = id
      this.taskReasonDialog={
        projectId:id,
        title:'退回项目',
        placeholder:"请输入退回项目原因",
        type:'BACK_TASK',
        dialogVisible:true
      }
    },
    //复核现场记录
    reviewSceneRecord(id){
      this.curCheckedTrId = id
      this.taskReasonDialog={
        title:'复核现场数据',
        placeholder:"请输入不通过原因",
        type:'REVIEW_SCENE_RECORD',
        dialogVisible:true,
        projectId:id,
      }
    },
    //复核检测记录
    reviewTextRecord(id){
      this.curCheckedTrId = id
      this.taskReasonDialog={
        projectId:id,
        title:'复核检测记录',
        placeholder:"请输入不通过原因",
        type:'REVIEW_TEXT_RECORD',
        dialogVisible:true
      }
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
    },
    // 重置弹框状态
    resetSubmitDataForm(){
      this.submitDataValidateForm={
        visible : false,
        type:'',
        projectId:''
      }
    },
    isShowTips(row){
      return ['WAITING_EDIT_SCENE_DATA','WAITING_EDIT_TEST_RESULT','WAITING_EDIT_PROJECT_INFO'].includes(row.projectState)
      // switch(row.projectState){
      //   case 'WAITING_EDIT_SCENE_DATA': return !!row.returnedRemark
      //   case 'WAITING_EDIT_TEST_RESULT': return !!row.returnedRemark
      //   case 'WAITING_EDIT_PROJECT_INFO': return !!row.returnedRemark
      //   default:return false        
      // }
    },
  }
};
</script>

<style scoped>
.icon-i-shengchengzhong{
  color: #FE413B;
  font-size: 12px;
  margin-right: 5px
}
.icon-i-shengchengzhong::before{
  margin-right: 3px;
  animation: rotate 2s linear infinite;
  display: inline-block;
}
@keyframes rotate {
  from { transform: rotate(0deg)}
  to { transform: rotate(360deg)}
} 
.icon-i-shibai{
  font-size: 12px
}
.icon-i-shibai::before{
  margin-right: 3px;
  color: #FE413B;
}
.checkErrorMesgBtn{
  margin-left: 5px;
  font-size: 12px;
  color: #1890FF;
  cursor: pointer;
}
.checkErrorMesgBtn:hover{
  text-decoration: underline
}
</style>
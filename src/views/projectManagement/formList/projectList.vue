// 待生成
<template>
  <div style="height:100%" class="cus-project-box">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="项目状态">
            <el-select v-model="form.customQuery.projectState" size="small" @change="searchData" clearable style='width:100%'>
              <el-option label="全部" value></el-option>
              <el-option :label="value" :value='key' v-for="(value,key) in statelist" :key="key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
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
        <filter-component 
          v-model="filterData" 
          tableName='Project_List' 
          @advancedSerach='advancedSerach' 
          :stateList='projectStatelist'
          filedState='projectState'
          :getOptionsFn='getOptionsFn' :columnKeys='columnKeys' />
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">项目列表 - 全部项目</h5>
        <div class="temp-box-btn">
          <dynamic-display-column :dataList='form.columns' :tableName='tableName' @refreshData="getData(true)" />
        </div>
      </div>
      <div class="table-box"  v-loading='loading' >
        <vxe-table
          :data="dataList"
          v-if="showColumns.length"
          style="width:100%"
          :key='tableKey'
          :max-height='winHeight - 326'
          show-header-overflow
          show-overflow
          highlight-hover-row
          header-row-class-name="cus-header-class"
        >
          <vxe-table-column type="index" label="序号"></vxe-table-column>
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
          <vxe-table-column title="操作" fixed="right" width="360">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i
                  class="iconfont icon-i-zhongzhi1"
                  v-if="!['SUSPEND','STOPPED','COMPLETED','UNPUBLISHED'].includes(scope.row.projectState) && 
                  (checkAuth('RBAC_PERMISSION_api_app_project_{identifier}_suspended_PUT') || checkAuth('RBAC_PERMISSION_api_app_project_{identifier}_terminated_PUT'))"
                  @click="stopProject(scope.row.id)"
                >暂停/终止</i>
                <i
                  class="iconfont icon-chakan"
                  v-if="!['UNPUBLISHED','PUBLISH','WAITING_EXECUTION'].includes(scope.row.projectState) && checkAuth('RBAC_PERMISSION_api_app_project_templatePreview_GET')"
                  @click="goToFormPage(scope.row.projectName, scope.row.entrustNumber,scope.row.companyName, scope.row.id, 'view')"
                >查看数据</i>
                <i
                  class="iconfont icon-xiazai"
                  v-if="['WAITING_ISSUED','COMPLETED'].includes(scope.row.projectState) && checkAuth('RBAC_PERMISSION_api_app_project_downLoadRecord_GET')"
                  @click="downLoadRecordSheet(scope.row.id)"
                >下载列表</i>
                <i
                  class="iconfont icon-i-xiangmurizhi"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_getProjectLog_{projectId}_GET')"
                  @click="goToProjectLogsPage(scope.row.id)"
                >项目日志</i>
                <i
                  class="iconfont icon-i-xiugaixiangmuxinxi"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_myProject_{identifier}_PUT')"
                  @click="editProjectForm(scope.row.id,'EDIT_INFO')"
                >修改项目信息</i>
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
        <pagniation :totalPage="totalPage" :totalNum="totalNum" :currentPage='form.current' @changePage="handleChangePage" ></pagniation>
      </div>
    </div>
    <projectForm 
    :visible.sync='dialogVisible' 
    :submitLoading='submitLoading'
    :type='dialogType'
    ref='projectForm' 
    :categoriesList='categoriesList' 
    :firstCategoriesList='firstCategoriesList'  
    @submit='saveProject' />
      <!-- 暂停、终止项目 -->
    <stop-project-form 
      :stopProjectForm='stopProjectForm' 
      v-model="stopProjectForm.dialogVisible" 
      @submit='handleSubmit'
      @refreshData='getProjectList'/>
  </div>
</template>

<script>
import projectMixins from "./projectMixins.js";
import projectForm from "./components/projectForm.vue";
import stopProjectForm from "./components/stopProjectDialog.vue";
import { getLocation } from "@/utils.js";
export default {
  components:{ projectForm, stopProjectForm },
  name: 'projectList',
  data() {
    return {
      form:{
        customQuery: {
          projectState:''
        }
      },
      submitLoading:false,
      dialogType:'EDIT_INFO',
      stopProjectForm:{
        title:'',
        type:'',
        dialogVisible:false
      },
      checkedId:null,
      dialogVisible:false,
      dialogVisible2:false,
      categoriesList: [], //所有的评价类别树
      firstCategoriesList: [], //检测，咨询一级类别列表
    };
  },
  mixins: [projectMixins], // 混入公共逻辑
  computed:{
    statelist(){
      const list = JSON.parse(JSON.stringify(this.projectStatelist))
      delete list.UNPUBLISHED
      return list
    },
  },
  methods: {
    getProjectList(filterData){
      this.loading = true;
      const {current, pageSize, customQuery } = this.form
      const params = {
        current,
        pageSize,
        customQuery
      }
      params.columns = this.splitColumnData(filterData)
      this.$http.projectService.getAllProjectList(params).then((res)=>{
        this.dataList = res.data.content || [];
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      }).finally(()=>{
        setTimeout(()=>{
          this.loading = false;
        },0)
      })
    },
    // 终止项目
    stopProject(id){
      this.checkedId = id
      this.stopProjectForm = {
        title:'暂停/终止',
        type:'',
        dialogVisible:true
      }
    },
    // 执行暂停/终止
    handleSubmit(params){
      console.log(params)
      if(params.radioState === 'STOP'){ // 暂停
        this.$http.projectService.suspendProject(this.checkedId, {remark:params.remark, suspendCategory:params.type}).then(res => {
            this.$message({
            type: "success",
            message: "项目已暂停!"
          });
          this.getProjectList(); //刷新页面
          this.resetStopProjectForm()
        })
      }else{
        this.$http.projectService.terminateProject(this.checkedId, {remark:params.remark, terminatCategory:params.type}).then(res => {
          this.$message({
            type: "success",
            message: "项目已终止!"
          });
          this.getProjectList(); //刷新页面
          this.resetStopProjectForm()
        })
      }
    },
    //增加项目    
    async saveProject(projectForm) {
      this.submitLoading = true
      let params = {
            companyAddress:projectForm.addressValue,
            ... projectForm
          };
        delete params.addressValue
        params.evaluationCategory = projectForm.evaluationCategory[
          projectForm.evaluationCategory.length - 1
        ];
        const { provinceValue, cityValue, countyValue, streetValue } = params.companyAddress
        let addrParamter = provinceValue + cityValue + countyValue + streetValue + ''
        let location = ''
        if(addrParamter){
          //获取地址经纬度
          location = await getLocation(addrParamter)
        }
        params.geocoding = location
        //修改
        this.$http.projectService
        .editProject_myProject(this.curCheckedTrId, params)
        .then(res => {
          this.dialogVisible = false;
          this.getProjectList(); //刷新页面
            this.$message({
              type: "success",
              message: "项目信息修改成功!"
            });
        }).finally(() => {
          this.submitLoading = false
        });
    },
    resetStopProjectForm(){
      this.checkedId = null,
      this.stopProjectForm = {
        title:'暂停/终止',
        type:'',
        dialogVisible:false
      }
    }
  }
};
</script>

<style scoped>

</style>
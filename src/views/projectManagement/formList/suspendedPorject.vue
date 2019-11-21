<template>
   <div style="height:100%" class="cus-project-box">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="项目状态">
            <el-select v-model="form.customQuery.projectState" size="small" @change="searchData" clearable style='width:100%'>
              <el-option label="全部" value></el-option>
              <el-option label="已暂停" value='SUSPEND'></el-option>
              <el-option label="已终止" value='STOPPED'></el-option>
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
          <filter-component v-model="filterData" 
          tableName='Project_List_Suspended' 
          @advancedSerach='advancedSerach' 
          :stateList='projectStatelist'
          filedState='projectState'
          :getOptionsFn='getOptionsFn' :columnKeys='columnKeys' />
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">项目列表 - 暂停/终止</h5>
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
          <vxe-table-column prop="entrustNumber" label="委托受理编号" width='180' show-overflow-tooltip></vxe-table-column>
          <vxe-table-column label="状态" width="100">
            <template slot-scope="scope">
              <span class="cus-tags-style">{{projectState(scope.row.projectState)}}</span>
            </template>
          </vxe-table-column> -->
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
                  class="iconfont icon-i-qidong"
                  @click="startOverProject(scope.row.id)"
                  v-if="scope.row.projectState === 'SUSPEND' && checkAuth('RBAC_PERMISSION_api_app_project_suspended_{identifier}_started_PUT')"
                >启动</i>
                <i
                  class="iconfont icon-i-zhongzhi1"
                  @click="terminateProject(scope.row.id)"
                  v-if="scope.row.projectState === 'SUSPEND' && checkAuth('RBAC_PERMISSION_api_app_project_suspended_{identifier}_terminated_PUT')"
                >终止</i>
                <i
                  class="iconfont icon-i-zhongqi"
                  @click="restartProject(scope.row.id)"
                  v-if="scope.row.projectState === 'STOPPED' && checkAuth('RBAC_PERMISSION_api_app_project_suspended_{identifier}_reopened_PUT')"
                >重启</i>
                <i
                  class="iconfont icon-i-xiugaixiangmuxinxi"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_suspended_{identifier}_PUT')"
                  @click="editProjectForm(scope.row.id,'EDIT_INFO')"
                >修改项目信息</i>
                <i
                  class="iconfont icon-chakan"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_suspended_templatePreview_GET')"
                  @click="goToFormPage(scope.row.projectName, scope.row.entrustNumber,scope.row.companyName, scope.row.id, 'view')"
                >查看数据</i>
                <i
                  class="iconfont icon-i-xiangmurizhi"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_suspended_getProjectLog_{projectId}_GET')"
                  @click="goToProjectLogsPage(scope.row.id)"
                >项目日志</i>
                <i
                  class="iconfont icon-shanchu"
                  @click="deleteProject(scope.row.id)"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_myProject_{id}_DELETE')"
                >删除</i>
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
        <pagniation :totalPage="totalPage" :totalNum="totalNum" :currentPage='form.current' @changePage="handleChangePage" ></pagniation>
      </div>
    </div>
    <!-- 修改项目属性 -->
    <projectForm 
      :visible.sync='dialogVisible' 
      type='EDIT' 
      ref="projectForm"
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
import popoverTips from "@/components/tools/popoverTips.vue";
import projectMixins from "./projectMixins.js";
import projectForm from "./components/projectForm.vue";
import stopProjectForm from "./components/stopProjectDialog.vue";
import { getLocation } from "@/utils.js";
export default {
  components:{ popoverTips, projectForm, stopProjectForm },
  name: 'suspended',
  data() {
    return {
      form:{
        projectState:'',
        name:''
      },
      stopProjectForm:{
        title:'',
        type:'',
        dialogVisible:false
      },
      dialogVisible:false,
      dialogVisible2:false,
      categoriesList: [], //所有的评价类别树
      firstCategoriesList: [], //检测，咨询一级类别列表
    };
  },
  mixins: [projectMixins], // 混入公共逻辑
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
      this.$http.projectService.getSuspendedProjectList(params).then((res)=>{
        this.dataList = res.data.content || [];
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      }).finally(()=>{
        this.loading = false;
      })
    },
    // 启动
    startOverProject(id){
      this.$confirm('是否启动当前项目？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.projectService.startProject(id).then(()=>{
            this.$message({
              type: "success",
              message: "项目已启动!"
            });
            this.getProjectList()
          })
        }).catch(() => {});
    },
    // 重启
    restartProject(id){
      this.$confirm('是否重启当前项目？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$http.projectService.reopenProject(id).then(()=>{
            this.$message({
              type: "success",
              message: "项目已重启!"
            });
            this.getProjectList()
          })
        }).catch(() => {});
    },
    // 终止项目
    terminateProject(id){
      this.curCheckedTrId = id
      this.stopProjectForm = {
        title:'终止',
        type:'END',
        dialogVisible:true
      }
    },

    // 执行暂停/终止
    handleSubmit(params){
      console.log(params)
      if(params.radioState === 'STOP'){ // 暂停
        this.$http.projectService.suspendProject(this.curCheckedTrId, {remark:params.remark, suspendCategory:params.type}).then(res => {
            this.$message({
            type: "success",
            message: "项目已暂停!"
          });
          this.getProjectList(); //刷新页面
          this.resetStopProjectForm()
        })
      }else{
        this.$http.projectService.terminateProject(this.curCheckedTrId, {remark:params.remark, terminatCategory:params.type}).then(res => {
          this.$message({
            type: "success",
            message: "项目已终止!"
          });
          this.getProjectList(); //刷新页面
          this.resetStopProjectForm()
        })
      }
    },
    //修改项目属性  
    async saveProject(form) {
      let params = {
            companyAddress:form.addressValue,
            ...form
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
        this.$http.projectService.editProject_suspended(this.curCheckedTrId, params).then(res => {
            this.dialogVisible = false;
            this.getProjectList(); //刷新页面
            this.$message({
              type: "success",
              message: "项目属性修改成功!"
            });
          });
    },
    resetStopProjectForm(){
      this.curCheckedTrId = null,
      this.stopProjectForm = {
        title:'终止',
        type:'END',
        dialogVisible:false
      }
    },
    //删除项目
    deleteProject(id) {
      this.$confirm("<p class='comfire-title'>确定删除该项目吗？</p><p class='comfire-text'>删除后的项目将不能恢复</p>", '', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString:true,
        type: "warning"
      })
        .then(() => {
          this.$http.projectService.deleteProject(id).then(() => {
            if(this.dataList.length <= 1){
              this.form.current = this.form.current >= 1 ? this.form.current - 1 : 0
            } 
            this.getProjectList();
            this.$message({
              type: "success",
              message: "项目删除成功!"
            });
          });
        })
    },
    stopType(row){
      if(row.projectState === 'SUSPEND'){
        return row.suspendCategory === 'OUR_REASONS' ? '我方原因':'对方原因'
      }else {
        return row.terminatCategory === 'OUR_REASONS' ? '我方原因':'对方原因'
      }
    },
    tipsRemark(row ){
      if(row.projectState === 'SUSPEND'){
        return row.suspendedRemark || '无'
      }
      return row.terminatedRemark || '无'
    }
  }
};
</script>

<style scoped>
</style>
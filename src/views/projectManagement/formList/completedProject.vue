// 已完成
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
          tableName='Project_List_Completed' 
          @advancedSerach='advancedSerach' 
          :stateList='projectStatelist'
          filedState='projectState'
          :getOptionsFn='getOptionsFn' :columnKeys='columnKeys' />
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">项目列表 - 已完成</h5>
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
          highlight-hover-row
          show-header-overflow
          header-row-class-name="cus-header-class"
        >
          <vxe-table-column type="index" width="70" title="序号"></vxe-table-column>
          <vxe-table-column 
          v-for="item in showColumns" :key="item.id"
          :title="item.filedName" 
          :field="item.filedKey" 
          show-overflow
          min-width="162">
            <template slot-scope="scope">
              <span class="cus-tags-style" v-if='item.filedKey === "projectState"'>{{projectState(scope.row[item.filedKey])}}</span>
              <span v-else-if='item.filedKey === "memberNames"'>{{scope.row[item.filedKey].join(',')}}</span>
              <span v-else-if='item.filedKey === "entrustDate"'>{{Number(scope.row[item.filedKey]) | formatDate}}</span>
              <span v-else-if='item.filedKey === "publishedTime"'>{{Number(scope.row[item.filedKey]) | formatDate}}</span>
              <span v-else>{{scope.row[item.filedKey]}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" fixed="right" width="240">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i
                  class="iconfont icon-i-zhuihui1"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_completed_{identifier}_recovered_PUT')"
                  @click="recoverProject(scope.row.id)"
                >追回</i>
                <i
                  class="iconfont icon-xiazai"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_completed_downLoadRecord_GET')"
                  @click="downLoadRecordSheet(scope.row.id)"
                >下载列表</i>
                <i
                  class="iconfont icon-chakan"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_completed_templatePreview_GET')"
                  @click="goToFormPage(scope.row.projectName, scope.row.entrustNumber,scope.row.companyName, scope.row.id, 'view')"
                >查看数据</i>
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
        <pagniation :totalPage="totalPage" :totalNum="totalNum" :currentPage='form.current' @changePage="handleChangePage" ></pagniation>
      </div>
    </div>
    <!-- 追回 -->
    <send-back-task 
      :projectTask='taskReasonDialog' 
      v-model="taskReasonDialog.dialogVisible" 
      @submit='handleSubmit'/>
  </div>
</template>

<script>
import sendBackTask from "./components/sendBackTask.vue";
import projectMixins from "./projectMixins.js";
export default {
  components:{ sendBackTask },
  name:'completed',
  data() {
    return {
      curCheckedTrId:null, // 当前操作的行id
      taskReasonDialog:{   
        title:'',
        placeholder:"",
        type:'',
        projectId:'',
        dialogVisible:false
      },
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
      this.$http.projectService.getCompletedProjectList(params).then((res)=>{
        this.dataList = res.data.content || [];
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      }).finally(()=>{
        this.loading = false;
      })
    },
    //追回报告
    recoverProject(id){
      this.curCheckedTrId = id
      this.taskReasonDialog={
        title:'追回报告',
        placeholder:"请输入追回报告原因",
        type:'RECOVER_REPORT',
        projectId:id,
        dialogVisible:true
      }
    },
    handleSubmit(type, params){
      console.log(params)
       const serviceParam = {
        "changeContents":params.checkList,
        "remark": params.remark,
      }
      // 执行追回
      this.$http.projectService.recoverProject(this.curCheckedTrId, serviceParam).then((res)=>{
        this.$message({
            message: '追回成功！',
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

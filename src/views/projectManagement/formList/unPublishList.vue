<template>
  <div style="height:100%" class="cus-project-box">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="项目状态">
            <el-select v-model="form.customQuery.projectState" size="small" @change="searchData" clearable style='width:100%'>
              <el-option label="全部" value></el-option>
              <el-option value='UNPUBLISHED' label="待发布"></el-option>
              <el-option value='PUBLISH' label="待分派"></el-option>
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
          tableName='Project_List_UnPublish' 
          @advancedSerach='advancedSerach' 
          :stateList='projectStatelist'
          filedState='projectState'
          :getOptionsFn='getOptionsFn' :columnKeys='columnKeys' />
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">项目列表 - 待发布项目</h5>
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
                <popover-tips :btn-text="projectState(scope.row[item.filedKey])" v-if="scope.row.projectState === 'PUBLISH' && scope.row.taskReturnedRemark">
                    <ul class='popover-tips-box'>
                      <li>
                        <div class="tips-item-title"><span>退回原因</span>：</div>
                        <p class="tips-item-content">{{scope.row.taskReturnedRemark}}</p>
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
                <span v-else>{{projectState(scope.row[item.filedKey])}}</span>
              </span>
              <span v-else-if='item.filedKey === "memberNames"'>{{scope.row[item.filedKey].join(',')}}</span>
              <span v-else-if='item.filedKey === "entrustDate"'>{{Number(scope.row[item.filedKey]) | formatDate}}</span>
              <span v-else-if='item.filedKey === "publishedTime"'>{{Number(scope.row[item.filedKey]) | formatDate}}</span>
              <span v-else>{{scope.row[item.filedKey]}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <div class="operation-icon" v-if="scope.row.submitState ==='PUBLISHING'">
                <i
                  class="iconfont icon-i-shengchengzhong"
                >发布中...</i>
              </div>
              <div class="operation-icon" >
                <i
                  class="iconfont icon-fabu"
                  @click="editProjectForm(scope.row.id, 'PUBLISH')"
                  v-if="scope.row.projectState ==='UNPUBLISHED' && checkAuth('RBAC_PERMISSION_api_app_project_unPublish_publish_{identifier}_PUT')"
                >发布</i>
                <i
                  class="iconfont icon-i-fenpairenwu"
                  @click="assignmentTask(scope.row.id, scope.row.memberIds)"
                  v-if="scope.row.projectState ==='PUBLISH' && checkAuth('RBAC_PERMISSION_api_app_project_unPublish_{identifier}_task_assign_PUT')"
                >分派任务</i>
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
    @submit='releaseProject' />
    <!-- 分派任务 -->
    <assign-tasks ref='assignTasks' interfaceType='assignTask_unpublish' @refreshData='getProjectList'/>
  </div>
</template>
<script>
import projectMixins from "./projectMixins.js";
import assignTasks from "./components/assignTasks.vue";
import projectForm from "./components/projectForm.vue";
import popoverTips from "@/components/tools/popoverTips.vue";
import { getLocation } from "@/utils.js";
export default {
  components:{ projectForm, assignTasks, popoverTips },
  name: 'unPublish',
  data() {
    return {
      dialogType:'ADD',
      dialogVisible:false,
      submitLoading:false,
      count:0,
      timer:null
    };
  },
  destroyed(){
    clearInterval(this.timer)
  },
  mixins: [projectMixins], // 混入公共逻辑
  methods: {
     // 轮询刷新数据
    loopGetData(){
      this.timer = setInterval(()=>{
        if(this.count>=5){
          this.clearIntervalFn()
          return 
        }
        const {current, pageSize, customQuery } = this.form
        const params = {
          current,
          pageSize,
          customQuery
        }
        params.columns = this.splitColumnData()
        this.$http.projectService.getMyProjectList(params).then((res)=>{
          this.dataList = res.data.content || [];
          this.totalPage = res.data.totalPages;
          this.totalNum = res.data.totalElements;
        })
        this.count++
      },1500)
    },
    getProjectList(filterData){
      const {current, pageSize, customQuery } = this.form
      const params = {
        current,
        pageSize,
        customQuery
      }
      params.columns = this.splitColumnData(filterData)
      this.$http.projectService.getUnPublishProjectList(params).then((res)=>{
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
    //发布项目表单
    async releaseProject(projectForm) {
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
          let location = '';
          if(addrParamter){
            //获取地址经纬度
            location = await getLocation(addrParamter)
          }
          params.geocoding = location
          this.$http.projectService
            .releaseProject(this.curCheckedTrId, params)
            .then((res) => {
              const timer = setTimeout(()=>{
                 this.getProjectList();
                clearTimeout(timer)
              },1500)
              this.$message({
                type: "success",
                message: "发布成功!"
              });
              // 报告数不足
              res.data.message && this.$alertComponent(`${res.data.message}`, "尊敬的用户", {
                confirmButtonText: "确定",
                dangerouslyUseHTMLString:true,
              })
              this.dialogVisible = false;
            })
            .catch(err => {
              if(err.data.status === 5011){
                  this.$message.closeAll();
                  this.$alertComponent(`${err.data.message}`, "发布失败！", {
                  type:'error',
                  confirmButtonText: "确定",
                  dangerouslyUseHTMLString:true,
                })
              }
              this.dialogVisible = false;
            });
    },
    //分派任务
    assignmentTask(id, userIds){
      this.$refs.assignTasks.openDialog(id, userIds)
    },
    getCategorieByType() {
      let result = this.categoriesList.find(item => {
        if (item.id === this.projectForm.categoryType) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
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
.tip-box {
  text-align: center;
  font-size: 14px;
  color: #343a45;
  padding: 20px 0;
}

.red-color {
  color: #f57c6c;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}
</style>

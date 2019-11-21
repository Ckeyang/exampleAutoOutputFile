<template>
  <div style="height:100%" class="cus-project-box">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="项目状态">
            <el-select v-model="form.customQuery.projectState" size="small" @change="searchData" clearable style='width:100%'>
              <el-option label="全部" value></el-option>
              <el-option :label="value" :value='key' v-for="(value,key) in projectStatelist" :key="key"></el-option>
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
          tableName='Project_List_MyProject' 
          @advancedSerach='advancedSerach'
          :stateList='projectStatelist'
          filedState='projectState' 
          :getOptionsFn='getOptionsFn' :columnKeys='columnKeys' />
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">项目列表 - 我的项目</h5>
        <div>
          <dynamic-display-column style="margin-right:8px;" :dataList='form.columns' :tableName='tableName' @refreshData="getData(true)" />
          <el-button
            type="success"
            size="small"
            icon="el-icon-plus"
            class="entry-btn"
            @click="addNewProject"
          >新增项目</el-button>
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
          show-header-overflow
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
          <vxe-table-column title="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <div class="operation-icon" >
                <i
                  class="iconfont icon-i-xiugaixiangmuxinxi"
                  @click="editProjectForm(scope.row.id, 'EDIT')"
                  v-if="['UNPUBLISHED'].includes(scope.row.projectState) && checkAuth('RBAC_PERMISSION_api_app_project_myProject_{identifier}_PUT')"
                >编辑</i> 
                <i
                  class="iconfont icon-shanchu"
                  @click="deleteProject(scope.row.id)"
                  v-if="scope.row.projectState ==='UNPUBLISHED' && checkAuth('RBAC_PERMISSION_api_app_project_myProject_{id}_DELETE')"
                >删除</i>
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
    @submit='saveProject' />
    <!-- 分派任务 -->
    <assign-tasks ref='assignTasks' interfaceType='my_project' @refreshData='getProjectList'/>
  </div>
</template>

<script>
import projectMixins from "./projectMixins.js";
import projectForm from "./components/projectForm.vue";
import assignTasks from "./components/assignTasks.vue";
import popoverTips from "@/components/tools/popoverTips.vue";
import { getLocation } from "@/utils.js";
export default {
  components:{ projectForm , assignTasks, popoverTips },
  name: 'myProject',
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
      this.loading = true;
      const {current, pageSize, customQuery } = this.form
      const params = {
        current,
        pageSize,
        customQuery
      }
      params.columns = this.splitColumnData(filterData)
      this.$http.projectService.getMyProjectList(params).then((res)=>{
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
    //打开新增项目窗口
    addNewProject() {
      this.dialogType = "ADD";
      this.dialogVisible = true;
    },
    //去修改模板
    goEditTemplate() {
      this.dialogVisible2 = false;
      this.$router.push("/projectManagement/projectTemplateList");
    },
    //分派任务
    assignmentTask(id, userIds){
      this.$refs.assignTasks.openDialog(id, userIds)
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
        if (this.dialogType === "ADD") {
            //新增
            this.$http.projectService
              .createProject(params)
              .then(res => {
                this.getProjectList();
                const timer = setTimeout(()=>{ // 后台需要时间
                  this.getProjectList();
                  clearTimeout(timer)
                }, 1500)
                this.$message({
                  type: "success",
                  message: "项目添加成功!",
                  duration: 1000
                });
                // 报告数不足
                res.data.message && this.$alertComponent(`${res.data.message}`, "尊敬的用户", {
                  confirmButtonText: "确定",
                  dangerouslyUseHTMLString:true,
                })
                this.dialogVisible = false;
              })
              .catch(err => {
                // 5010 是找不到报告模板 5011是报告数用完，5012是报告数不足
                if(err.data.status === 5010){
                  this.$message.closeAll();
                  this.$message.error(err.data.message || '该评价类别的模板还未建立或未启用！请先设置模板再创建项目！')
                  this.dialogVisible = false;
                  this.goTemplateList() // 去模板列表
                }else if(err.data.status === 5011){
                  this.$message.closeAll();
                   this.$alertComponent(`${err.data.message}`, "发布失败！", {
                    type:'error',
                    confirmButtonText: "确定",
                    dangerouslyUseHTMLString:true,
                  })
                  this.dialogVisible = false;
                }
              }).finally(() => {
                this.submitLoading = false
              });
        } else {
            //修改
            this.$http.projectService
              .editProject_myProject(this.curCheckedTrId, params)
              .then(res => {
                this.dialogVisible = false;
                this.getProjectList(); //刷新页面
                this.$message({
                  type: "success",
                  message: "项目编辑成功!"
                });
              }).finally(() => {
                 this.submitLoading = false
              });
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
    getCategorieByType() {
      let result = this.categoriesList.find(item => {
        if (item.id === this.projectForm.categoryType) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
    //去项目模板页面
    goProjectTemplateList(id, name, state) { 
      name = encodeURIComponent(name)  //对名字进行十六进制转义
      this.$router.push(
        `/projectManagement/praviteTemplateList/${id}/${name}/${state}` 
      );
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

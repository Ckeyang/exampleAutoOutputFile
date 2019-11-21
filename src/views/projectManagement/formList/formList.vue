<template>
  <div style="height:100%" class="cus-project-box">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="项目状态">
            <el-select v-model="form.projectState" size="small" @change="getProjectList(true)" clearable style='width:100%'>
              <el-option label="全部" value></el-option>
              <el-option label="未发布" value="UNPUBLISHED"></el-option>
              <el-option label="待派发" value="PUBLISH"></el-option>
              <!-- <el-option label="待填报" value="UNEDITED"></el-option>
              <el-option label="待审核" value="UNAUDITED"></el-option>
              <el-option label="正在填报" value="UNCOMMITTED"></el-option>
              <el-option label="任务退回" value="TASK_BACK"></el-option>
              <el-option label="取回修改" value="ACTIVE_RETRIEVE"></el-option>
              <el-option label="退回修改" value="RETURN_MODIFY"></el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="项目名称">
            <el-input
              v-model="form.name"
              size="small"
              placeholder="项目名称/企业名称/合同编号/委托编号"
              clearable
              @keyup.enter.native="getProjectList(true)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col class='search-btn-box'>
          <el-button type="primary" size="small" icon="el-icon-search" @click="getProjectList(true)" >搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm" >重置</el-button>
        </el-col>
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">项目列表 - {{projectTypeName}}</h5>
        <div>
          <el-button
            type="success"
            size="small"
            icon="el-icon-plus"
            class="entry-btn"
            @click="addNewProject"
            v-if='checkAuth("RBAC_PERMISSION_api_app_project_POST")'
          >新增项目</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          :data="dataList"
          v-loading='loading'
          style="width:100%"
          :key='tableKey'
          :max-height='winHeight - 326'
          tooltip-effect='light'
          header-row-class-name="cus-header-class"
        >
          <el-table-column type="index" width="70" label="序号"></el-table-column>
          <el-table-column label="业务类别" prop="evaluationCategoryName" width="160"></el-table-column>
          <el-table-column prop="projectName" label="项目名称"  show-overflow-tooltip min-width='200' >
            <template slot-scope="scope">
              <highlight-words :text="scope.row.projectName" :keyWords="form.name" show-overflow-tooltip></highlight-words>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="企业名称" min-width='150' show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="contractNumber" label="合同编号" min-width='150' show-overflow-tooltip></el-table-column>
          <el-table-column prop="entrustNumber" label="委托受理编号" min-width='150' show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" width="100" >
            <template slot-scope="scope">
              <span class="cus-tags-style">{{projectState(scope.row.projectState)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="项目组成员" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.memberNames && scope.row.memberNames.join('、')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="120"  show-overflow-tooltip></el-table-column>
          <el-table-column prop label="操作" fixed="right" width="345">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i
                  class="iconfont icon-i-qidong"
                >启动</i>
                <i
                  class="iconfont icon-i-zhongzhi1"
                >终止</i>
                <i
                  class="iconfont icon-i-zhongqi"
                >重启</i>
                <i
                  class="iconfont icon-fabu"
                  @click="releaseProject(scope.row.id)"
                  v-if="scope.row.projectState ==='UNPUBLISHED' && checkAuth('RBAC_PERMISSION_api_app_project_publish_{identifier}_PUT')"
                >发布</i>
                <i
                  class="iconfont icon-i-kaishizhihang"
                >开始执行</i>
                <i
                  class="iconfont icon-i-xiangmurizhi"
                  @click="goToProjectLogsPage(scope.row.id)"
                >项目日志</i>
                <!-- <i
                  class="iconfont icon-dayin"
                  @click="goPrintPreview(scope.row.id)"
                  v-if="scope.row.projectState === 'UNAUDITED' || scope.row.projectState === 'PUBLISH'"
                >打印预览</i>-->
                <!-- <i
                  class="iconfont icon-dayin"
                  @click="openSynchronizationDialog(scope.row.id)"
                  v-if="scope.row.projectState !== 'UNAUDITED' && scope.row.projectState !== 'AUDITED'"
                >同步模板</i> -->
                <i
                  class="iconfont icon-i-shiyanshicaiyang"
                  @click="openWindow('/laboratorySampling/'+scope.row.id)"
                  v-if="['UNEDITED','UNCOMMITTED','RETURN_MODIFY','ACTIVE_RETRIEVE'].includes(scope.row.projectState) && checkAuth('RBAC_PERMISSION_api_app_forms_laboratorySampleCollection_GET')"
                >样品收录</i>
                <i
                  class="iconfont icon-i-saoma"
                  v-if="['UNEDITED','UNCOMMITTED','RETURN_MODIFY','ACTIVE_RETRIEVE'].includes(scope.row.projectState) && checkAuth('RBAC_PERMISSION_api_app_forms_scanCodeEntry_GET')"
                  @click="scanCodeEntry(scope.row)"
                >扫码录入</i>
                <i
                  class="iconfont icon-i-fenpairenwu"
                  @click="assignmentTask(scope.row.id, scope.row.memberIds)"
                  v-if="checkBtnAuth('task_assign', scope.row.projectState)"
                >分派任务</i>
                <i
                  class="iconfont icon-i-tuihuirenwu"
                  @click="sendBackTask(scope.row.id)"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_{identifier}_task_reject_PUT') && scope.row.projectState ==='WAITING_EXECUTION'"
                >退回任务</i>
                <i
                  class="iconfont icon-i-lurushuju1"
                  @click="goToFormPage(scope.row.projectName, scope.row.entrustNumber,scope.row.companyName, scope.row.id, 'edit')"
                  v-if="['WAITING_SUBMIT_SCENE_DATA'].includes(scope.row.projectState)"
                >录入数据</i>
                <i
                  class="iconfont icon-i-tijiaoxianchangshuju"
                >提交现场记录</i>
                <i
                  class="iconfont icon-i-tijiaoxianchangshuju"
                >提交检测结果</i>
                <i
                  class="iconfont icon-i-quhuixiugai"
                  @click="retrieveEdit(scope.row.id)"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_{identifier}_cancel_PUT') && (scope.row.projectState ==='UNAUDITED')"
                >取回修改</i>
                 <i
                  class="iconfont icon-tuihuixiugai"
                  @click="backToEdit(scope.row.id)"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_{identifier}_reject_PUT') && 
                  (scope.row.projectState ==='UNAUDITED' || $route.params.status ==='noReport' || $route.params.status ==='viewReport')"
                >退回</i>
                 <i
                  class="iconfont icon-i-fuhexianchangjilu"
                  @click="reviewSceneRecord(scope.row.id)"
                >复核现场记录</i>
                 <i
                  class="iconfont icon-i-fuhexianchangjilu"
                  @click="reviewTextRecord(scope.row.id)"
                >复核检测记录</i>
                <i
                  class="iconfont"
                  :class='scope.row.reportStatus === "STARTING" ? "icon-i-shengchengzhong" : "icon-shengchengbaogao"'
                  @click="generateReport(scope.row.id,scope.row.reportTemplateId,scope.row.reportStatus)"
                  v-if="$route.params.status === 'noReport' && checkAuth('RBAC_PERMISSION_api_app_project_generate_report_{identifier}_{version}_GET')"
                >{{scope.row.reportStatus === "STARTING" ? '生成中....' : '生成报告'}}</i>
                <i
                  class="iconfont"
                  :class='scope.row.reportStatus === "STARTING" ? "icon-i-shengchengzhong" : "icon-shengchengbaogao"'
                  @click="generateReport(scope.row.id,scope.row.reportTemplateId,scope.row.reportStatus)"
                  v-if="$route.params.status === 'viewReport' && checkAuth('RBAC_PERMISSION_api_app_project_generate_report_{identifier}_{version}_GET')"
                >{{scope.row.reportStatus === "STARTING" ? '生成中....' : '重新生成'}}</i>
                <i
                  class="iconfont icon-xiazai"
                  @click="downloadReport(scope.row.reportUrl)"
                  v-if="$route.params.status==='viewReport'"
                >下载报告</i>
                <i
                  class="iconfont icon-shenhe"
                  @click="commitAudit(scope.row.id,scope.row.remark)"
                  v-if="scope.row.projectState === 'UNAUDITED' && checkAuth('RBAC_PERMISSION_api_app_project_update_state_audited_PUT')"
                >审核</i>
                <i
                  class="iconfont icon-i-zhongxinshengcheng"
                >重新生成</i>
                <i
                  class="iconfont icon-i-qianfa"
                  @click="signProject(scope.row.id)"
                >签发</i>
                <i
                  class="iconfont icon-i-zhuihui1"
                  @click="recoverProject(scope.row.id)"
                >追回</i>
                <i
                  class="iconfont icon-chakan"
                  @click="goToFormPage(scope.row.projectName, scope.row.entrustNumber,scope.row.companyName, scope.row.id, 'view')"
                  v-if="['AUDITED','UNAUDITED','UNCOMMITTED','RETURN_MODIFY','ACTIVE_RETRIEVE'].includes(scope.row.projectState)"
                >查看数据</i>
                <!-- <i
                  class="iconfont icon-chakan"
                  @click="openWindow(`/reportOutput/${scope.row.id}/edit`)"
                  v-if="(scope.row.projectState === 'AUDITED' || scope.row.projectState === 'UNAUDITED') && scope.row.reportStatus === 'END'"
                >查看报告</i> -->
                <i
                  class="iconfont icon-xiazai"
                  v-if="checkBtnAuth('RBAC_PERMISSION_api_app_project_downLoadRecord_GET')"
                  @click="downLoadRecordSheet(scope.row.id)"
                >下载列表</i>
                <i
                  class="iconfont icon-i-xiugaixiangmuxinxi"
                  @click="editProjectForm(scope.row.id)"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_{identifier}_PUT') && (scope.row.projectState ==='UNPUBLISHED' || scope.row.projectState ==='PUBLISH')"
                >修改项目信息</i>
                <i
                  class="iconfont icon-xiugai"
                  v-if="$route.params.status ==='projectList'"
                  @click="goProjectTemplateList(scope.row.id,scope.row.projectName,scope.row.projectState)"
                >修改模板</i>
                <i
                  class="iconfont icon-shanchu"
                  @click="deleteProject(scope.row.id)"
                  v-if="checkAuth('RBAC_PERMISSION_api_app_project_{id}_DELETE') && scope.row.projectState ==='UNPUBLISHED'"
                >删除</i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagniation :totalPage="totalPage" :totalNum="totalNum" :currentPage='form.current' @changePage="handleChangePage" ></pagniation>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      v-el-drag-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false">
      <div>
        <el-form
          ref="ruleForm"
          :model="projectForm"
          label-width="110px"
          style="width:100%"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="业务分类" prop="categoryType">
            <el-select
              v-model="projectForm.categoryType"
              size="small"
              style="width:100%"
              placeholder="请选择业务分类"
              :disabled="dialogTitle !== '新增项目'"
            >
              <el-option
                v-for="item of firstCategoriesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类别" prop="evaluationCategory">
            <el-cascader
              :options="getCategorieByType()"
              size="small"
              clearable
              filterable
              placeholder="请选择业务类别"
              :disabled="dialogTitle !== '新增项目'"
              v-model="projectForm.evaluationCategory"
              :props="{label:'name',children:'childList',value:'id'}"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model.trim="projectForm.projectName"
              placeholder="请输入项目名称"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="企业名称" prop="companyName">
            <el-input
              v-model.trim="projectForm.companyName"
              placeholder="请输入企业名称"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="委托受理编号" prop="entrustNumber">
            <el-input
              v-model.trim="projectForm.entrustNumber"
              placeholder="请输入委托受理编号"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="合同编号" prop="contractNumber">
            <el-input
              v-model.trim="projectForm.contractNumber"
              placeholder="请输入合同编号"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="企业地址" prop="contractNumber">
            <Address  :formAttribute='{fillable:true}' :formValue='projectForm' :hideInput='["townValue"]' />
          </el-form-item>
        </el-form>
      </div>
      <!-- <el-dialog width="30%" title="提示" :visible.sync="innerVisible" :close-on-click-modal="false" append-to-body  v-el-drag-dialog>
        <div class="tip-box">
          <p class="red-color">新增项目失败</p>
          <p>{{addProjectMessage || '该评价类别的模板还未建立或未启用！请先设置模板再创建项目！'}}</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="goTemplateList" size="medium" v-show='!addProjectMessage'>去模板页面</el-button>
        </span>
      </el-dialog> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="medium">取 消</el-button>
        <el-button
          type="primary"
          @click="saveProject(true)"
          v-show="dialogTitle === '新增项目'"
          size="medium"
        >保存并发布</el-button>
        <el-button
          type="primary"
          @click="saveProject()"
          size="medium"
        >保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog width="30%" title="提示" :visible.sync="dialogVisible2" :close-on-click-modal="false" append-to-body center v-el-drag-dialog>
      <div class="tip-box">
        <p class="red-color">发布失败</p>
        <p>此评价类别的模板已经升级！请您修改相应的项目表单或模板</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button type="primary" @click="goEditTemplate" size="medium">去修改模板</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog title="报告模板有新版本" :visible.sync="reportVersionBox" width="30%" v-el-drag-dialog>
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
    </el-dialog>
    <!-- 退回任务，取回修改，审核表单不通过 -->
    <send-back-task 
      :projectTask='taskReasonDialog' 
      v-model="taskReasonDialog.dialogVisible" 
      @refreshData='getProjectList'/>
      <!-- 分派任务 -->
    <assign-tasks ref='assignTasks' @refreshData='getProjectList'/>
    <!-- 报告生成提示框 -->
    <report-producing ref='reportProducing' @refreshData='getProjectList'/> 
    <download ref="downloadComponent"/>
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import SearchBox from "@/components/tools/searchBox.vue"; 
import sendBackTask from "./components/sendBackTask.vue";
import assignTasks from "./components/assignTasks.vue";
import reportProducing from "./components/reportProducing.vue";
import download from "@/components/tools/download.vue";
import Address from "@/components/template/Address.vue";
import { validateName, getLocation } from "../../../utils.js";
import { mapGetters } from "vuex";
export default {
  name: "formList",
  components: { highlightWords, SearchBox, pagniation, preview , sendBackTask , assignTasks , reportProducing , download , Address},
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  data() {
    return {
      reportVersionBox: false,
      tableKey:0,
      projectTypeName: "", //项目列表的类型名称
      reportVersions: [],
      curId: "",
      curReportTemplateId: "",
      loading: true,
      reportloading:false, //生成报告等待loading
      dataList: [], //项目列表
      evaluateList: [], //评价类型
      projectForm: {
        projectName: "",
        entrustNumber: "",
        companyName: "",
        contractNumber: "",
        categoryType: "",
        addressValue:{
          provinceValue:'',
          cityValue:'',
          countyValue:'',
          streetValue:'',
        },
        evaluationCategory: []
      },
      rules: {
        categoryType: { required: true, message: "请选择业务分类" },
        projectName: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur"
          },
          { validator: validateName, trigger: "blur" }
        ],
        evaluationCategory: [
          { required: true, message: "请选择业务类别", trigger: "blur" }
        ],
        entrustNumber: [
          { required: true, message: "请输入委托受理编号", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ]
      },
      categoriesList: [], //所有的评价类别树
      firstCategoriesList: [], //检测，咨询一级类别列表
      dialogTemplate: false,
      dialogVisible: false, // 增加项目
      dialogTitle: "新增项目",
      innerVisible: false, // 内层弹框
      dialogVisible2: false, // 表单发布框
      dialogVisible4: true, // 生成报告
      assignTasksDialogVisible:false, //分派任务框
      checkedId: "", //当前点击的项目的id
      totalPage: 0,
      totalNum: 0,
      loopStepTime: 1000, //轮询时间间隔
      loopTimer: null, //计时器对象
      timeNum: 3,
      status: "",
      form: {
        name: "",
        evaluationCategory: [],
        projectState: "",
        pageSize: 30,
        current: 0
      }, //搜索
      addProjectMessage:'', //新建项目错误提示信息
      taskReasonDialog:{   //审核表单//任务退回/取回修改/退回修改组件弹框信息
        title:'',
        placeholder:"",
        type:'',
        projectId:'',
        dialogVisible:false
      },
    };
  },
  mounted() {
    const _this = this;
    window.onfocus = function() {
    	//监听窗口事件
    	if (_this.$route.meta.title === '全部项目') {
    		_this.getProjectList(); //初始化项目列表
    	}
    };
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  created() {
    this.getProjectList(); //初始化项目列表
    this.getCategories();
  },
   
  watch: {
    $route() {
      this.status = this.$route.params.status;
      this.form.current = 0;
      this.getProjectList();
    },
    dialogVisible(val) {
      if (!val) {
        this.projectForm = {
          projectName: "",
          entrustNumber: "",
          companyName: "",
          contractNumber: "",
          addressValue:{
            provinceValue:'',
            cityValue:'',
            countyValue:'',
            streetValue:'',
          },
          evaluationCategory: []
        };
        this.$refs["ruleForm"].resetFields(); //重置验证
      }
    },
    dialogVisible4(val) {
      if (val) {
        this.timeNum = 3;
        let timer = setInterval(() => {
          if (this.timeNum == 1) {
            this.dialogVisible4 = false;
            clearInterval(timer);
          } else {
            this.timeNum--;
          }
        }, 1000);
      }
    }
  },
  methods: {
    /**
     * 获取类别
     */
    getCategories() {
      this.$http.advisoryCategoryService
        .getAdvisoryCategoryTree().then(res => {
        this.firstCategoriesList = res.data.map(item => ({
          id: item.id,
          name: item.name
        }));
        this.categoriesList = res.data.childList;
      });
    },
    //去除类别为空的数组字段
    reloadCategories(data) {
      let result = [];
      data.map(item => {
        let { id, name, childList } = item;
        if (childList && childList.length > 0) {
          result.push({
            id: id,
            name: name,
            childList: this.reloadCategories(childList)
          });
        } else {
          result.push({
            id: id,
            name: name
          });
        }
      });
      return result;
    },
    getCategorieByType() {
      let result = this.categoriesList.find(item => {
        if (item.id === this.projectForm.categoryType) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
    choiceReportVersion(curReportTemplateId) {
      this.curReportTemplateId = curReportTemplateId;
    },
    checkReportVersion(item) {
      return item === this.curReportTemplateId ? "" : "info";
    },
    getProjectList(flag=false) {
      if(flag){
        this.form.current=0;
      }
      this.loading = true;
      // let evaluationCategoryLength = this.form.evaluationCategory.length;
      let params = {
        keyWords: this.form.name,
        // evaluationCategory: evaluationCategoryLength
        //   ? this.form.evaluationCategory[evaluationCategoryLength - 1]
        //   : "",
        pageSize: this.form.pageSize,
        current: this.form.current
      };
      this.tableKey ++
      switch ('projectList') {
        case "projectList":
        {
          //查询全部
          params.projectState = this.form.projectState; //添加搜索状态
          this.projectTypeName = this.projectState(this.form.projectState);
          this.$http.projectService.getFormList(params).then(res => {
            this.dataList = res.data.content;
            this.totalPage = res.data.totalPages;
            this.totalNum = res.data.totalElements;
            this.loading = false;
          });
          break;
        }
        case "noReport":
        {
          this.projectTypeName = "待生成报告";
          this.$http.projectService.getFormListNoReport(params).then(res => {
            this.dataList = res.data.content;
            this.totalPage = res.data.totalPages;
            this.totalNum = res.data.totalElements;
            this.loading = false;
          });
          break;
        }
        case "viewReport":
        {
          this.projectTypeName = "查看报告";
          this.$http.projectService.getFormListViewReport(params).then(res => {
            this.dataList = res.data.content;
            this.totalPage = res.data.totalPages;
            this.totalNum = res.data.totalElements;
            this.loading = false;
          });
        }
      }
    },
    //退回任务
    sendBackTask(id){
      this.taskReasonDialog={
        title:'任务退回',
        placeholder:"请输入任务退回原因",
        type:'BACK_TASK',
        projectId:id,
        dialogVisible:true
      }
    },
    //取回修改
    retrieveEdit(id){
      this.taskReasonDialog={
        title:'取回修改',
        placeholder:"请输入取回修改原因",
        type:'RETRIEVE_EDIT',
        projectId:id,
        dialogVisible:true
      }
    },
    //退回到修改状态
    backToEdit(id){
      this.taskReasonDialog={
        title:'退回修改',
        placeholder:"请输入退回修改原因",
        type:'BACK_EDIT',
        projectId:id,
        dialogVisible:true
      }
    },
    //追回报告
    recoverProject(id){
      this.taskReasonDialog={
        title:'追回报告',
        placeholder:"请输入追回报告原因",
        type:'RECOVER_REPORT',
        projectId:id,
        dialogVisible:true
      }
    },
    //复核现场记录
    reviewSceneRecord(id){
      this.taskReasonDialog={
        title:'复核现场记录',
        placeholder:"请输入不同过原因",
        type:'REVIEW_SCENE_RECORD',
        projectId:id,
        dialogVisible:true
      }
    },
    //复核检测记录
    reviewTextRecord(id){
      this.taskReasonDialog={
        title:'复核检测记录',
        placeholder:"请输入不同过原因",
        type:'REVIEW_TEXT_RECORD',
        projectId:id,
        dialogVisible:true
      }
    },
    //签发
    signProject(id){
      this.taskReasonDialog={
        title:'是否审核通过此报告？',
        placeholder:"请输入不签发原因",
        type:'SIGN_PROJECT',
        projectId:id,
        dialogVisible:true
      }
    },
    //下载报告
    downloadReport(url){
      this.$refs.downloadComponent.download(url);
    },
    //去模板列表
    goTemplateList() {
      this.$router.push("/projectManagement/projectTemplateList");
      this.innerVisible = false;
      this.dialogVisible = false;
    },
    //去修改模板
    goEditTemplate() {
      this.dialogVisible2 = false;
      this.$router.push("/projectManagement/projectTemplateList");
    },
    //修改项目基本信息
    editProjectForm(row) {
      this.checkedId = row.id;
      this.dialogTitle = "修改属性";
      this.projectForm = {
        projectName: row.projectName,
        entrustNumber: row.entrustNumber,
        companyName: row.companyName,
        contractNumber: row.contractNumber,
        categoryType: row.categoryType,
        addressValue:{
          ...row.companyAddress
        },
        evaluationCategory: []
      };
      let temData = row.evaluationCategory.split("-");
      for (let i = 1; i < temData.length; i++) {
        this.projectForm.evaluationCategory.push(
          temData.slice(0, i + 1).join("-")
        );
      }
      this.dialogVisible = true;
    },
    //增加项目       params { isPublish } 是否新增并发布
    saveProject(isPublish = false) {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          let params = {
            isPublish,
            companyAddress:this.projectForm.addressValue,
            ... this.projectForm
          };
          delete params.addressValue
          params.evaluationCategory = this.projectForm.evaluationCategory[
            this.projectForm.evaluationCategory.length - 1
          ];
          const { provinceValue, cityValue, countyValue, streetValue } = params.companyAddress
          let addrParamter = provinceValue + cityValue + countyValue + streetValue + ''
          //获取地址经纬度
          const location = await getLocation(addrParamter)
          params.geocoding = location
          if (this.dialogTitle === "新增项目") {
            //新增
            this.$http.projectService
              .createProject(params)
              .then(res => {
                this.dialogVisible = false;
                this.$nextTick(() => {
                  this.getProjectList();
                  // this.goEditProjectForm(res.data.templateId, res.data.projectId, res.data.evaluationCategory); //去编辑表单页面
                });
                this.$message({
                  type: "success",
                  message: "项目添加成功!",
                  duration: 1000
                });
              })
              .catch(err => {
                this.$message.closeAll();
                this.$message.error(err.data.message || '该评价类别的模板还未建立或未启用！请先设置模板再创建项目！')
                if(!err.data.message){
                  this.goTemplateList()
                }
                // this.addProjectMessage = err.data.message;
                // this.innerVisible = true;
              });
          } else {
            //修改
            this.$http.projectService
              .editProject(this.checkedId, params)
              .then(res => {
                this.dialogVisible = false;
                this.getProjectList(); //刷新页面
                this.$message({
                  type: "success",
                  message: "项目属性修改成功!"
                });
              });
          }
        }
      });
    },
    //分派任务
    assignmentTask(id, userIds){
      this.$refs.assignTasks.openDialog(id, userIds)
    },
    //发布项目表单
    releaseProject(id) {
      this.$confirm("是否确认发布此项目？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.checkedId = id; //保存id
          this.$http.projectService
            .releaseProject(id)
            .then(() => {
              this.getProjectList();
              this.$message({
                type: "success",
                message: "发布成功!"
              });
            })
            .catch(err => {
              this.$message.closeAll();
              this.dialogVisible2 = true;
            });
        })
        .catch(() => {
        });
    },
    //打开同步模板框
    openSynchronizationDialog(id) {
      this.$confirm(
        "是否确定要同步该模板？",
        "",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.projectService.synchronizationProject(id).then(() => {
            this.$message({
              type: "success",
              message: "模板同步成功!"
            });
          });
        })
        .catch(() => {
        });
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
        .catch(() => {
        });
    },
    //去表单录入页面
    goToFormPage(name, entrustNumber,companyName, projectId,type){
      const title = encodeURIComponent(name)  //对名字进行十六进制转义
      const number = encodeURIComponent(entrustNumber)  //对名字进行十六进制转义
      companyName = encodeURIComponent(companyName)  //对名字进行十六进制转义
      this.openWindow(`/templatePreview/${title}/${number}/${companyName}/${projectId}/${type}/project`);
    },
    //打印预览
    goPrintPreview(projectId = 0) {
      let localPath =
        location.href.replace(this.$route.path, "") +
        "/printPreviewForm/" +
        projectId;
      window.open(localPath);
    },
    //审核表单
    commitAudit(id, remark) {
      this.checkedId = id;
      this.$confirmComponent('是否审核通过此表单？','审核通过的表单将可以生成报告!', {
        leftButtonText:'取消',
				confirmButtonText: "通过",
      	cancelButtonText: "不通过",
      })
      .then((state)=>{
        if(state === 'confirm'){
          this.doAuditForm()
        }
      }).catch(()=>{
          this.taskReasonDialog={
          title:'审核表单不通过',
          placeholder:"请输入审核不通过原因",
          type:'AUDIT_FAILED',
          projectId:id,
          dialogVisible:true
        }
      })
    },
    //表单审核通过
    doAuditForm() {
      this.$http.projectService
        .auditProject({
          identifier: this.checkedId,
          projectState: "AUDITED"
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "审核成功!"
          });
          this.getProjectList();
        });
      this.dialogVisible3 = false;
    },
    //去录入页面审核表单
    goAuditForm() {
      let tempId = this.dataList.filter(item => item.id === this.checkedId)[0]
        .templateId;
      this.openWindow(`/templatePreview/${this.checkedId}/${tempId}/audit/project`);
      this.dialogVisible3 = false;
    },
    //生成报告
    generateReport(id, reportTemplateId, reportStatus) {
      this.curReportTemplateId = reportTemplateId;
      this.curId = id;
      if (reportStatus === "STARTING") {
        this.$refs.reportProducing.openDialog() //打开生成报告提示框
      } else {
        this.$http.projectService.getProjectVersions(id).then(res => {
          this.reportVersions = res.data;
          if (this.reportVersions.length === 1) {
            this.curReportTemplateId = this.reportVersions[0];
            this.generateReportVersion();
          } else {
            this.reportVersionBox = true;
          }
        });
      }
    },
    generateReportVersion() {
      this.$http.projectService
        .generateReport(this.curId, this.curReportTemplateId)
        .then(() => {
            this.getProjectList(); //刷新页面
        }).finally(()=>{
          this.curReportTemplateId = '';
          this.$refs.reportProducing.dialogVisible = false;
        });
        this.$refs.reportProducing.openDialog() //打开生成报告提示框
        this.reportVersionBox = false;
        const timer = setTimeout(()=>{
          this.getProjectList();
          clearTimeout(timer)
        },500) 
    },
    //重置搜索
    resetForm() {
      this.form.name = "";
      this.form.pageSize = 30;
      this.form.current = 0;
      this.getProjectList();
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getProjectList();
    },
    //打开新增项目窗口
    addNewProject() {
      this.dialogTitle = "新增项目";
      this.dialogVisible = true;
    },
    //打开修改项目窗口
    editProject(row) {
      this.dialogVisible4 = true;
    },
    //关闭新增窗口
    closeDialog() {
      this.dialogVisible = false;
    },
    //打开新窗口
    openWindow(route, query = {}) {
      window.open(this.$router.resolve({ path: route, query }).href);
    },
    // 去扫码录入界面
    scanCodeEntry({id, companyName, entrustNumber}){
      this.openWindow(`/scanCodeEntryList/${encodeURIComponent(id)}/${encodeURIComponent(companyName)}/${encodeURIComponent(entrustNumber)}`)
    },
    //去项目模板页面
    goProjectTemplateList(id, name, state) { 
      name = encodeURIComponent(name)  //对名字进行十六进制转义
      this.$router.push( {
          path:`/projectManagement/praviteTemplateList/${id}/${name}/${state}`,
          query:{
            id:'12121'
          }
        }
      );
    },
    checkBtnAuth(type, state){
      const routeStatus = this.$route.params.status
      switch(type){
        case 'publish' : 
          return state === 'UNPUBLISHED' && this.checkAuth('RBAC_PERMISSION_api_app_project_publish_{identifier}_PUT');
        case 'task_assign' : 
          return (state !=='UNPUBLISHED' && routeStatus !=='viewReport' &&　routeStatus !=='noReport') 
            && this.checkAuth('RBAC_PERMISSION_api_app_project_{identifier}_task_assign_PUT');
        default : return false
      }
    },
    //项目状态转换
    projectState(state) {
      switch (state) {
        case "UNPUBLISHED":
          return "未发布";
        case "PUBLISH":
          return "待派发";
        case "WAITING_EXECUTION":
          return "待执行";
        case "WAITING_SUBMIT_SCENE_DATA":
          return "待提交现场数据";
        case "WAITING_EDIT_SCENE_DATA":
          return "待修改现场数据";
        case "WAITING_SCENE_REVIEW":
          return "待现场复核";
        case "WAITING_SUBMIT_TEST_RESULT":
          return "待提交检测结果";
        case "WAITING_EDIT_TEST_RESULT":
          return "待修改检测结果";
        case "WAITING_LABORATORY_REVIEW":
          return "待实验室复核";
        case "WAITING_EDIT_PROJECT_INFO":
          return "待修改项目信息";
        case "WAITING_GENERATE_REPORT":
          return "待生成报告";
        case "GENERATED_REPORT":
          return "已生成";
        case "WAITING_ISSUED":
          return "待签发";
        case "COMPLETED":
          return "已完成";
        case "SUSPEND":
          return "已暂停";
        case "STOPED":
          return "已终止";
        default :
          return "全部";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.boxItem {
  position: relative;
  padding: 14px;
  height: 70px;
  > h4 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #343a45;
  }
  > div {
    text-align: center;
  }
  > span {
    color: #9badcc;
    font-size: 12px;
  }
  > .bottom_right {
    position: absolute;
    right: 14px;
    bottom: 14px;
    .noBorder {
      border: 0;
    }
    .noBorder:hover {
      color: #1884CC;
      background: #fff;
    }
  }
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
.time {
  text-align: center;
  margin-top: 10px;
  color: #1884CC;
  font-size: 14px;
}
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
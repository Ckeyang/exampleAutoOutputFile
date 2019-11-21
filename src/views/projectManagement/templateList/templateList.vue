<template>
  <div class="project-template content-warp">
    <div class="templte-right">
      <div class="right-container">
        <search-box :form="form">
          <template slot="input">
            <el-col :span="6">
              <el-form-item label="业务类别">
                <el-cascader
                  :options="categoriesList"
                  change-on-select
                  size="small"
                  placeholder="请选择业务类别"
                  v-model="form.evaluationCategory"
                  clearable
                  :props="defaultProps"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="模板名称">
                <el-input
                  v-model="form.name"
                  size="small"
                  placeholder="请输入模板名称"
                  clearable
                  @keyup.enter.native="searchTemplate"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-search"
                @click="searchTemplate"
              >搜索</el-button>
              <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </el-col>
          </template>
        </search-box>
        <div class="regulation-tb box-style_common">
          <div class="tools-bar_common">
            <h5 class="table-title">项目模板列表</h5>
            <div class="temp-box-btn">
              <TemplateSort
                style="margin-right:15px"
                v-model="sortDialogVisible"
                :categoriesList="categoriesList"
                @saveTemplateSort="saveTemplateSort"
              />
              <!-- <el-button
                size="small"
                icon="iconfont icon-shunxu"
                v-if="checkAuth('RBAC_PERMISSION_api_app_templates_sort_PUT')"
                @click="openSortDialog"
              >设置顺序</el-button> -->
              <el-button
                type="success"
                size="small"
                icon="el-icon-plus"
                @click="addTemplate"
                v-if="checkAuth('RBAC_PERMISSION_api_app_templates_POST')"
              >新增模板</el-button>
            </div>
          </div>
          <tree-table 
            :data="dataList" 
            :expandAll="false" 
            :props="tableDefaultProps"
            style="width: 100%"
            size="medium"
            v-loading='tableLoading'
            :max-height="winHeight - 326"
            tooltip-effect="light">
            <el-table-column label="业务类别" width="180" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.evaluationCategoryName || scope.row.businessCategoryTypeName }}</template>
            </el-table-column>
            <el-table-column prop="name" label="模板名称" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="description" label="模板描述" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" width="140">
              <template slot-scope="scope">
                <el-tag :type="templateStateTagType(scope.row.status)" size="mini">{{ templateState(scope.row.status)}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="版本时间" width="130">
              <template slot-scope="scope">{{scope.row.versionDate | formatDate}}</template>
            </el-table-column>
            <el-table-column label="发布时间" width="130">
              <template slot-scope="scope">{{scope.row.publishedDate | formatDate}}</template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="268">
              <template slot-scope="scope">
                <div class="operation-icon">
                  <i class="iconfont icon-i-tijiaoshenhe" @click="openAuditDialog(scope.row)" 
                  v-if="['DRAFTED','REJECTED'].includes(scope.row.status) || 
                  (scope.row.status === 'ENABLED' && scope.row.draft) && checkAuth('RBAC_PERMISSION_api_app_templates_{identifier}_{id}_submit_PUT')">提交审核</i>
                  <el-dropdown
                    size="medium"
                    trigger="click"
                    @command="(command)=> btnEvent(command, scope.row)"
                  >
                    <span class="el-dropdown-link">
                      <i class="iconfont icon-i-gengduocaozuo el-icon--right" v-if="checkAuthBtn(scope.row.status,'EDIT')">编辑</i>
                      <i class="iconfont icon-i-xiuding el-icon--right" v-if="checkAuthBtn(scope.row.status,'REVISE')">修订</i>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="btn-dropdown-menu">
                      <el-dropdown-item command="PROP" v-if="checkAuth('RBAC_PERMISSION_api_app_templates_{identifier}_{id}_properties_PUT')">属性</el-dropdown-item>
                      <el-dropdown-item command="EDIT" v-if="checkAuth('RBAC_PERMISSION_api_app_templates_{identifier}_{id}_content_PUT')">模板内容</el-dropdown-item>
                      <el-dropdown-item command="RULE">规则配置</el-dropdown-item>
                      <el-dropdown-item command="REFERENCE_DATA">设置参考数据</el-dropdown-item>
                      <el-dropdown-item command="COMMIT_ATTR" v-if="scope.row.sweepCodeComponentId">设置提交属性</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <i class="iconfont icon-yulan" 
                    v-if="checkAuthBtn(scope.row.status,'AUDIT') && checkAuth('RBAC_PERMISSION_api_app_templates_{identifier}_{id}_audit_PUT')" 
                    @click="auditTemplate(scope.row)">审核</i>
                  <i class="iconfont icon-yulan" @click="goTemplateView(scope.row)">预览</i>
                  <i class="iconfont icon-qiyong" 
                    v-if="checkAuthBtn(scope.row.status,'ENABLE') && checkAuth('RBAC_PERMISSION_api_app_templates_{identifier}_{id}_enable_PUT')" 
                    @click="templateEnable(scope.row)">启用</i>
                  <i class="iconfont icon-tingyong" 
                    v-if=" checkAuthBtn(scope.row.status,'DISENABLE') && !scope.row.draft && 
                    checkAuth('RBAC_PERMISSION_api_app_templates_{identifier}_{id}_disable_PUT')" 
                    @click="openDisenableDialog(scope.row)">停用</i>
                  <i class="iconfont icon-jilu" v-if="!['DRAFTED','REJECTED'].includes(scope.row.status)" 
                    @click="templateRecord(scope.row)">记录</i>
                  <i class="iconfont icon-shanchu" 
                    v-if="checkAuthBtn(scope.row.status,'DELETE') && !scope.row.draft && checkAuth('RBAC_PERMISSION_api_app_templates_{identifier}_{id}_DELETE')" 
                    @click="showDeleteDialog(scope.row.id)">删除</i>
                  <i class="iconfont icon-fuzhi" 
                    v-if="checkAuth('RBAC_PERMISSION_api_app_templates_{identifier}_{id}_copy_POST') && scope.row.status !== 'STALED' &&(!scope.row.copyState || scope.row.copyState === 'NONE')"
                    @click="openCopyTemplateDialog(scope.row)">复制</i>
                  <i v-if="scope.row.copyState === 'COPYING'" class="iconfont icon-i-shengchengzhong" >复制中</i>
                </div>
              </template>
            </el-table-column>
          </tree-table>
          <pagniation
            :totalPage="totalPage"
            :totalNum="totalNum"
            :currentPage="form.current"
            @changePage="handleChangePage"
          ></pagniation>
        </div>
        <el-dialog
          v-el-drag-dialog
          :title="dialogTitle"
          :visible.sync="dialogVisible1"
          width="30%"
          :close-on-click-modal="false"
          custom-class="customDialog"
        >
          <el-form
            :model="templateForm"
            label-width="80px"
            :rules="rules"
            ref="ruleForm"
            style="width:100%"
            label-position="top"
          >
            <el-form-item label="业务类别" prop="evaluationCategory">
              <el-cascader
                :options="categoriesList"
                size="small"
                clearable
                filterable
                placeholder="请选择业务类别"
                :disabled="dialogTitle === '修改属性'"
                v-model="templateForm.evaluationCategory"
                :props="{label:'name',children:'childList',value:'id'}"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="模板名称" prop="name">
              <el-input size="small" v-model="templateForm.name" placeholder="请输入模板名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="模板描述">
              <el-input size="small" v-model="templateForm.describe" placeholder="请输入模板描述"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog1" size="medium">取 消</el-button>
            <el-button
              type="primary"
              @click="dialogConfirm('ruleForm')"
              size="medium"
              :loading="editTemplateLoading"
            >保 存</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :title="reviseContentForm.title"
          :visible.sync="reviseContentForm.reviseContentVisible"
          v-el-drag-dialog
          width="30%"
          :close-on-click-modal="false"
        >
          <div>
            <el-form
              :model="reviseContentForm"
              label-width="80px"
              :rules="reviseContentRules"
              ref="reviseContentForm"
              style="width:100%"
              label-position="top"
            >
              <el-form-item label="修订内容" prop="reviseContent">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 5}"
                  placeholder="请输入内容"
                  v-model="reviseContentForm.reviseContent"
                ></el-input>
              </el-form-item>
              <el-form-item label="修订范围" v-if="reviseContentForm.isShowVersion">
                <div>
                  <el-radio v-model="reviseContentForm.reviseVersion" label="UPDATE">更新版本</el-radio>
                  <el-tooltip placement="top-start" effect="light" :offset="30">
                    <div slot="content" class="tips-content">更新版本指：非实质性内容变动，将覆盖原模板，不生<br/>成新版本，版本时间不会变化，无需做版本关联！</div>
                    <i class="tooltips-icon iconfont icon-wenhaomiaoshu"></i>
                  </el-tooltip>
                </div>
                <div>
                  <el-radio v-model="reviseContentForm.reviseVersion" label="UPGRADE">升级版本</el-radio>
                  <el-tooltip placement="top-start" effect="light" :offset="30">
                    <div slot="content" class="tips-content">
                      升级版本指：实质性内容变动，不覆盖原模板，直接<br/>生成新版本，版本时间会变化，需做版本关联！
                    </div>
                    <i class="tooltips-icon iconfont icon-wenhaomiaoshu"></i>
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeRemarkDialog" size="medium">取 消</el-button>
            <el-button type="primary" @click="reviseContentConfirm" size="medium" :loading='reviseContentLoading'>确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <revisedRecords
      :visible.sync="revisedRecordsForm.visible"
      :tableData="revisedRecordsForm.tableData"
      :id="revisedRecordsForm.id"
    />
     
  </div>
</template> 
<script>
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import TemplateSort from "../formList/components/TemplateSort.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import revisedRecords from "./components/revisedRecords.vue";
import TreeTable from "@/components/TreeTable/index.vue";
// import tableRowsBtn from "@/mixins/tableRowsBtn.js";
import { validateName, judgeIsChangeCurPage } from "../../../utils.js";
import { mapGetters } from "vuex";
const state = { // 模板状态
  DRAFTED: "草稿",
  ENABLED: "发布",
  DISABLED: "停用",
  REJECTED: "审核不通过",
  APPROVED: "审核通过",
  AUDITING: "待审核",
  STALED: "已过期"
};
const authState = {  // 按钮状态权限
  'EDIT':['DRAFTED','REJECTED'],
  'SUBMIT_AUDIT':['DRAFTED','ENABLED','REJECTED'], //提交审核
  'AUDIT':['AUDITING'], //审核
  'DELETE':['DRAFTED','REJECTED'], //删除
  'REVISE':['ENABLED'], //修订
  'ENABLE':['APPROVED','DISABLED'], //启用
  'DISENABLE':['ENABLED'], //停用
}
export default {
  name: "projectTemplateList",
  components: {
    pagniation,
    preview,
    TemplateSort,
    SearchBox,
    revisedRecords,
    TreeTable
  },
  // mixins:[tableRowsBtn],
  data() {
    return {
      dataList: [], //表格数据
      currCheckedId: "", //当前选中的模板id
      curDraftId:null, // 当前操做的草稿id
      defaultProps: {
        children: "childList",
        label: "name",
        value: "id"
      },
      tableLoading:false,
      tableDefaultProps:{
        children:'history'
      },
      reviseContentLoading:false,
      reviseContentForm: {
        // 修订内容
        reviseContentVisible: false, // 填写原因弹框  审核和启用，停用使用
        title:'',
        type: "", // 当前操作的类型
        reviseContent: "",
        isShowVersion:false, // 是否显示修订版本选择
        reviseVersion: "UPDATE" // UPGRADE 升级 、UPDATE 更新
      },
      revisedRecordsForm: {
        visible: false, // 查看记录
        id: null
      },
      reviseContentRules: {
        reviseContent: {
          required: true,
          message: "请输入修订内容",
          trigger: "blur"
        }
      },
      editTemplateLoading: false, //修改模板属性loading
      totalPage: 0,
      totalNum: 0,
      dialogVisible1: false, // 增加模板的对话框
      sortDialogVisible: false, //模板排序
      dialogTitle: "添加模板",
      form: { name: "", evaluationCategory: [], pageSize: 30, current: 0 }, //搜索
      templateForm: {
        name: "",
        evaluationCategory: [],
        categoryType: "",
        describe: ""
      }, //添加模板
      categoriesList: [], //所有的评价类别树
      rules: {
        categoryType: { required: true, message: "请选择业务分类" },
        name: [
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
        ]
      },
      count:0, // 轮询次数
      timer:null
    };
  },
  created() {
    const _this = this;
    this.getTemplate();
    this.getEvaluateList();
    window.onfocus = function() {
      //监听窗口事件
      if (
        _this.$route.meta.title === "项目模板列表" &&
        _this.$route.meta.menuId === "projectTemplate"
      ) {
        _this.getTemplate();
      }
    };
  },
  destroyed(){
    clearInterval(this.timer)
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  watch: {
    dialogVisible1(val) {
      if (!val) {
        this.templateForm = {
          name: "",
          evaluationCategory: [],
          categoryType: "",
          describe: ""
        };
        // 清除类别的禁用状态
        this.categoriesList = this.categoriesList.map(item => {
          item.disabled = false
          return item
        })
        this.$refs["ruleForm"].resetFields();
      }
    }
  },
  methods: {
    //表格按钮事件
    btnEvent(type, row) {
      switch (type) {
        case "PROP":
          this.editTemplate(row);
          break;
        case "EDIT":
          this.goTemplate(row);
          break;
        case "RULE":
          this.goRulesPage(row);
          break;
          // case "NORM":
          //   this.goDataSpecification(row.id, row.name);
          break;
        case "COMMIT_ATTR":
          this.goToSubmissionAttrPage(row); // 提交属性
          break;
        case "REFERENCE_DATA":
          this.goToReferenceDataPage(row); // 参考数据
          break;
      }
    },
    clearIntervalFn(){
      clearInterval(this.timer)
      this.count = 0;
      this.timer = null
    },
     // 轮询刷新数据
    loopGetData(){
      this.timer = setInterval(()=>{
        if(this.count>=50){
          this.clearIntervalFn()
          return 
        }
        this.getTemplate(false)
        this.count++
      },2000)
    },
    // reloadCategories(data) {
    //   let result = [];
    //   data.map(item => {
    //     let { id, name, childList } = item;
    //     if (childList.length > 0) {
    //       result.push({
    //         id: id,
    //         name: name,
    //         childList: this.reloadCategories(childList)
    //       });
    //     } else {
    //       result.push({
    //         id: id,
    //         name: name
    //       });
    //     }
    //   });
    //   return result;
    // },
    searchTemplate() {
      this.form.current = 0;
      this.getTemplate();
    },
    getTemplate(isLoading = true) {
      isLoading && (this.tableLoading = true)
      let params = {
        name: this.form.name,
        pageSize: this.form.pageSize,
        current: this.form.current,
        evaluationCategory:
          this.form.evaluationCategory[
            this.form.evaluationCategory.length - 1
          ] || ""
      };
      this.$http.projectTemplateService.getTemplates(params).then(res => {
        judgeIsChangeCurPage(res.data, this.form, this.getTemplate)
        this.dataList = res.data.content || [];
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      }).finally(()=>{
        this.tableLoading = false;
      });
    },
    //根据选择的类型设置默认的模板名称
    changeTempName(val) {
      let maxEvaluate = this.categoriesList.filter(
        item => item.id === val[0]
      )[0];
      this.templateForm.name =
        maxEvaluate.name +
        maxEvaluate.children.filter(item => item.id === val[1])[0].name +
        "模板";
    },
    //获取评价类型
    getEvaluateList() {
      this.$http.projectService.getEvaluateList().then(res => {
        this.categoriesList = res.data.childList || [];
      });
    },
    // 复制模板
    templateCopy(params){
      const { identifier } = this.getTemplateIdentifier(this.currCheckedId) 
      this.$http.projectTemplateService.templateCopy(identifier, this.currCheckedId, params).then(()=>{
        this.dialogVisible1 = false;
        this.dataList = this.dataList.map(item => {
          if(item.id === this.currCheckedId){
            item.copyState = 'COPYING'
          }
          return item
        })
        this.loopGetData() 
      }).finally(()=>{
        this.editTemplateLoading = false;
      })
    },
    // 打开复制模板窗口
    openCopyTemplateDialog({name ,evaluationCategory, description, id}){
      this.currCheckedId = id
      this.templateForm.name = name;
      let temData = evaluationCategory.split("-");
      this.templateForm.categoryType = temData[0];
      for (let i = 2; i <= temData.length; i++) {
        this.templateForm.evaluationCategory.push(
          temData.slice(0, i).join("-")
        );
      }
      this.dialogTitle = "复制模板";
      this.templateForm.describe = description;
      // 复制时禁选除当前类别外的所有类别
      this.categoriesList = this.categoriesList.map(item => {
        if(item.id !== evaluationCategory){
          this.$set(item,'disabled',true)
        }
        return item
      })
      this.openTemplateDialog();
    },
     
    // 打开模板排序窗口
    openSortDialog(){
      this.sortDialogVisible = true
    },
    /**
     * 去模板编辑页面
     */
    async goTemplate({identifier, status, id, evaluationCategory, draft }) { // 有draft id 优先使用
      if(status === 'ENABLED' && !draft){  // 如果有草稿未审核通过，则不新增草稿
        draft = await this.addDraft(identifier, id)
      }
      this.openWindow(`/template/${identifier}/${draft || id}/${evaluationCategory}/PROJECT`);
    },
    /**
     * 去设置提交属性页面
     */
    async goToSubmissionAttrPage({identifier, id, draft, status}) {
      if(status === 'ENABLED' && !draft){  // 如果有草稿未审核通过，则不新增草稿
        draft = await this.addDraft(identifier, id)
      }
      this.$router.push(`/projectManagement/submissionAttr/${identifier}/${draft || id}`);
    },
    // 去设置参考数据页面
    async goToReferenceDataPage({identifier, id, draft, status}) {
      if(status === 'ENABLED' && !draft){  // 如果有草稿未审核通过，则不新增草稿
        draft = await this.addDraft(identifier, id)
      }
      this.$router.push(`/projectManagement/referenceData/${draft || id}`);
    },
    /**
     * 去预览页面
     */
    goTemplateView(row) {
      this.$http.templateService.previewTemplate(row.identifier, row.draft || row.id, {components:[]}).then(res => {
        this.openWindow(
          `/templatePreview/${row.name}/%20/%20/${res.data}/view/template`,
          { tempIdentifier:row.identifier }
        );
      });
    },
    openWindow(route, query = {}) {
      window.open(this.$router.resolve({ path: route, query }).href)
    },
    //打开模板添加窗口
    openTemplateDialog() {
      this.dialogVisible1 = true;
    },
    // 新增修订草稿
    async addDraft(identifier, id){
      try {
        const { data } = await this.$http.projectTemplateService.addTemplateDraft(identifier, id) 
        return data
      } catch (error) {
        throw new Error('新增草稿失败！')
      }
    },
    // 重置修订窗口
    resetReviseContenForm(){
      this.reviseContentForm = {
        reviseContentVisible: false, 
        type: "", 
        title:'',
        reviseContent: "",
        isShowVersion:false,
        reviseVersion: "UPDATE" 
      }
    },
    // 打开提交审核窗口
    openAuditDialog({ id, status, draft }) {
      this.currCheckedId = id;
      this.reviseContentForm.reviseContentVisible = true;
      this.reviseContentForm.type = 'SUBMIT_AUDIT';
      this.reviseContentForm.title = '提交审核';
      this.reviseContentForm.isShowVersion = !!draft;
    },
    // 打开停用窗口
    openDisenableDialog({ id }) {
      this.currCheckedId = id;
      this.reviseContentForm.reviseContentVisible = true;
      this.reviseContentForm.type = 'STOP';
      this.reviseContentForm.title = '停用模板';
    },
    //关闭对话框
    closeDialog1() {
      this.dialogVisible1 = false;
    },
    closeRemarkDialog() {
      this.resetReviseContenForm()
      this.$refs["reviseContentForm"].resetFields();
    },
    /** --------------模板列表操作 -------------------------**/
    //修改模板属性
    async editTemplate({ id, draft, status, identifier}) {
      this.currCheckedId = id; //当前选中的id项
      if(status === 'ENABLED' && !draft){  // 如果有草稿未审核通过，则不新增草稿
        draft = await this.addDraft(identifier, id)
        this.curDraftId = draft
      }
      this.$http.templateService.getTemplateById(draft || id).then(res=>{
        const {name ,evaluationCategory, description, id, identifier} = res.data
        this.templateForm.name = name;
        let temData = evaluationCategory.split("-");
        this.templateForm.categoryType = temData[0];
        for (let i = 2; i <= temData.length; i++) {
          this.templateForm.evaluationCategory.push(
            temData.slice(0, i).join("-")
          );
        }
        this.dialogTitle = "修改属性";
        this.templateForm.describe = description;
        this.openTemplateDialog();
      })
    },
    /**
     * 添加新模板
     */
    addTemplate() {
      this.dialogTitle = "添加模板";
      this.openTemplateDialog();
    },
    //模板启用
    templateEnable({identifier, id, status }) {
      this.currCheckedId = id;
      if(status === "DISABLED"){  // 判断是否需要填写修订内容
        this.reviseContentForm.reviseContentVisible = true;
        this.reviseContentForm.type = "ENABLE"
        this.reviseContentForm.title = '启用模板';
      }else{
        this.templateEnableServer(id);
      }
    },
    //模板启用函数
    templateEnableServer(id) {
      const { identifier } = this.getTemplateIdentifier(id) 
      this.$http.projectTemplateService
        .templateEnable(identifier, id, {remark:this.reviseContentForm.reviseContent})
        .then(res => {
          this.$message({
            message: "模板已启用",
            type: "success"
          });
          const timer = setTimeout(() => {
            this.getTemplate();
            clearTimeout(timer)
          }, 1000);
        })
        .catch(err => {
          if(String(err.data.status).length === 4){
            this.$alertComponent(err.data.message, "", {
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            });
          }
      }).finally(()=>{
        this.resetReviseContenForm() // 重置修订内容
        this.reviseContentLoading = false
      });
    },
    // 通过模板id查看改模板的标识符
    getTemplateIdentifier(id){
      return this.dataList.find(item => item.id === id)
    },
    // 审核模板
    auditTemplate({identifier, id}){
      this.$confirmComponent('是否审核通过此模板？','', {
				confirmButtonText: "通过",
      	cancelButtonText: "不通过",
      })
      .then((state)=>{
        const params = {
            log: this.reviseContentForm.reviseContent,
            operation: "PASSED"
          }
        this.$http.projectTemplateService.auditTemplate(identifier, id, params).then(res=>{
          this.getTemplate()
          this.$message({
            message: "审核成功！",
            type: "success"
          });
        })
      }).catch(()=>{
        const params = {
            log: this.reviseContentForm.reviseContent,
            operation: "REJECTED"
          }
        this.$http.projectTemplateService.auditTemplate(identifier, id, params).then(res=>{
          this.getTemplate()
          this.$message({
            message: "审核成功！",
            type: "success"
          });
        })
      })
    },
    // 修订确认
    reviseContentConfirm() {
      const type = this.reviseContentForm.type;
      this.$refs["reviseContentForm"].validate(valid => {
        if (valid) {
          this.reviseContentLoading = true
          if (type === "SUBMIT_AUDIT") {
            this.submitAudit();
          } else if (type === "ENABLE") {
            this.templateEnableServer(this.currCheckedId);
          } else if (type === "STOP") {
            this.templateDisenable();
          }
        }
      });
    },
    // 提交审核
    submitAudit() {
      const tempId = this.currCheckedId
      const { identifier, draft } = this.getTemplateIdentifier(tempId)
      const { reviseContent, reviseVersion, isShowVersion } = this.reviseContentForm
      const params = {
        log: reviseContent,
        operation: isShowVersion ? reviseVersion : 'PUBLISH'
      }
      this.$http.projectTemplateService.submitAudit(identifier, draft || tempId, params).then(res =>{
        this.getTemplate();
        this.resetReviseContenForm() // 重置修订内容
        this.$message({
          message: "审核已提交！",
          type: "success"
        });
      }).finally(()=>{
        this.reviseContentLoading = false
      })
    },
    // 模板停用
    templateDisenable() {
      const id = this.currCheckedId
      const { identifier, draft } = this.getTemplateIdentifier(id)
      this.$http.projectTemplateService.disenableTemplate(identifier, draft || id, {remark:this.reviseContentForm.reviseContent}).then(res=>{
        this.getTemplate()
        this.resetReviseContenForm() // 重置修订内容
        this.$message({
          message: "模板已停用！",
          type: "success"
        });
      }).finally(()=>{
        this.reviseContentLoading = false
      })
    },
    // 记录
    templateRecord({identifier}) {
      this.revisedRecordsForm.visible = true;
      this.revisedRecordsForm.id = identifier
       
      // this.tableData = []
    },
    // //确定启用模板
    // templateEnableConfirm() {
    //   this.templateEnableServer(this.currCheckedId);
    // },
    //模板对话框确认按钮
    dialogConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editTemplateLoading = true;
          let params = {
            name: this.templateForm.name,
            categoryId: "PROJECT",
            groupId: "",
            scope: "PUBLIC",
            description: this.templateForm.describe,
            evaluationCategory: this.templateForm.evaluationCategory[
              this.templateForm.evaluationCategory.length - 1
            ],
            categoryType: this.templateForm.evaluationCategory[
              this.templateForm.evaluationCategory.length - 1
            ].split("-")[0]
          };
          //添加模板
          if (this.dialogTitle === "添加模板") {
            this.$http.projectService
              .addTemplate(params)
              .then(res => {
                this.getTemplate();
                this.dialogVisible1 = false;
                this.$message({
                  message: "模板添加成功",
                  type: "success"
                });
              })
              .finally(() => {
                this.editTemplateLoading = false;
              });
          } else if(this.dialogTitle === "修改属性") {
            const tempId = this.currCheckedId // 模板id
            const {identifier} = this.getTemplateIdentifier(tempId) // 获取模板聚合id
            //修改模板基本信息
            this.$http.projectService
              .editTemplateProps(identifier, this.curDraftId || tempId, params)
              .then(res => {
                this.getTemplate();
                this.dialogVisible1 = false;
                this.curDraftId = null;
                this.$message({
                  message: "模板属性修改成功",
                  type: "success"
                });
              })
              .finally(() => {
                this.editTemplateLoading = false;
              });
          }else{
            const obj = {
              "businessCategoryType": params.evaluationCategory,
              "description": params.description,
              "name": params.name
            }
            this.templateCopy(obj)
          }
        }
      });
    },
    //重置
    resetForm() {
      this.form.name = "";
      this.form.current = 0;
      this.form.evaluationCategory = [];
      this.getTemplate();
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getTemplate();
    },
    /**
     * 去数据规范设置
     */
    goDataSpecification({id, draft , name}) {
      this.$router.push(`/projectManagement/dataNorm/${draft || id}/${name}`);
    },
    /**
     * 去规则设置
     */
    async goRulesPage({id, draft ,status, identifier, name}) {
      if(status === 'ENABLED' && !draft){  // 如果有草稿未审核通过，则不新增草稿
        draft = await this.addDraft(identifier, id)
      }
      this.$router.push(`/projectManagement/templateRules/${draft || id}/${name}`);
    },
    /**
     * 删除
     */
    showDeleteDialog(id) {
      this.currCheckedId = id;
      this.$confirm("是否确认删除此模板？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.doDeleteTemplate();
      });
    },
    /**
     * 执行删除
     */
    doDeleteTemplate() {
      const id = this.currCheckedId
      const {identifier} = this.getTemplateIdentifier(id) 
      this.$http.projectService.deleteTemplate(identifier, id).then(() => {
        this.$message({ type: "success", message: "模板删除成功" });
        this.getTemplate();
      });
    },
    // 格式化状态
    templateState(status) {
      return state[status] || '';
    },
    templateStateTagType(status){
      const obj ={
        DRAFTED: "info",
        ENABLED: "success",
        DISABLED: "warning",
        REJECTED: "danger",
        AUDITING: "",
        APPROVED:'',
        STALED: "info"
      }
      return obj[status]
    },
    //保存模板排序
    saveTemplateSort(data) {
      this.$http.projectService
        .saveTemplateSort({ listData: data })
        .then(res => {
          this.$message({ type: "success", message: "模板排序保存成功" });
          this.sortDialogVisible = false;
          this.getTemplate();
        });
    },
    // 按钮状态权限判断
    checkAuthBtn(status, type){
      return authState[type].includes(status)
    }
  }
};
</script>
<style scoped>
.project-template >>> .el-dialog .el-dialog__body{
  padding-top:0
}
</style>

<style lang="scss" scoped>
.project-template {
  position: relative;
  height: 100%;
}
.boxItem {
  position: relative;
  padding: 14px;
  height: 152px;
  > h4 {
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
      color: #26beff;
      background: #fff;
    }
  }
}

.templte-left {
  position: absolute;
  left: 0;
  width: 250px;
  background: #fff;
  height: 100%;
}
.templte-right {
  // padding-left: 263px;
  height: 100%;
}
.templte-right .right-container {
  height: 100%;
}
.tip-box {
  padding: 10px 0;
  text-align: center;
  font-size: 14px;
  color: #343a45;
  font-weight: bold;
  border-top: 1px solid #edf1f7;
}

.icon-jinggao {
  color: #f57c6c;
  margin-right: 5px;
  font-weight: normal;
}
  .tips-content{
    color: #595959;
  }
  .el-dropdown-link .el-icon--right{
    position: relative;
    top: 3px;
  }
  .table-column-content{
    padding: 0 10px
  }
  .temp-box-btn{
    display: flex;
    align-items: center;
  }
</style>
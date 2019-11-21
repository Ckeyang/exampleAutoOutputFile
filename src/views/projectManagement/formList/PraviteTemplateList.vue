<template>
  <div class="project-template">
    <div class="templte-right">
      <div class="right-container">
        <search-box :form="form">
          <template slot="input">
            <el-col :span="6">
              <el-form-item label="模板名称">
                <el-input
                  v-model="form.keyWords"
                  size="small"
                  placeholder="请输入模板名称"
                  clearable
                  @keyup.enter.native="searchTemplate"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='6'>
              <el-button type="primary" size="small" icon="el-icon-search" @click="searchTemplate">搜索</el-button>
              <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </el-col>
          </template>
        </search-box>
        <div class="regulation-tb box-style_common" style="height:calc(100% - 88px)">
          <div class="tools-bar_common">
            <h5 class="table-title">项目模板列表 - {{projectObj.projectName}}</h5>
            <div>
              <el-button 
                size="small" 
                icon="iconfont icon-shunxu" 
                @click="sortDialogVisible = true" 
                v-if='checkAuth("RBAC_PERMISSION_api_app_templates_sort_PUT")'
                v-show='dataList.length > 1'>设置顺序</el-button>
              <el-button
                type="primary"
                size="small"
                icon="iconfont icon-fabu"
                @click="releaseProject"
                v-if="projectObj.projectState === 'UNPBLISHED' && checkAuth('RBAC_PERMISSION_api_app_project_publish_{identifier}_PUT')"
              >发布模板</el-button>
              <!-- <el-button
                type="primary"
                size="small"
                :loading='submitAllLoading'
                v-if="projectObj.projectState === 'UNCOMMITTED' || projectObj.projectState === 'RETURN_MODIFY' || projectObj.projectState === 'ACTIVE_RETRIEVE'"
                @click="submitAll"
              >提交全部内容</el-button> -->
            </div>
          </div>
          <el-table :data="dataList" style="width: 100%" v-loading='loading'>
            <el-table-column type="index" width="70" label="序号"></el-table-column>
            <el-table-column prop="evaluationCategoryName" label="类型" width="200"></el-table-column>
            <el-table-column prop="name" label="模板名称" min-width="250"></el-table-column>
            <el-table-column prop="description" label="模板描述"></el-table-column>
            <el-table-column prop label="操作" fixed="right" width="320">
              <template slot-scope="scope">
                <div class="operation-icon">
                  <i
                    class="iconfont icon-xiugai"
                    v-if="checkAuth('RBAC_PERMISSION_api_app_templates_{identifier}_PUT') && projectObj.projectState === 'UNPUBLISHED'"
                    @click="goTemplate(scope.row.id,scope.row.evaluationCategory)"
                  >编辑</i>
                  <i
                    class="iconfont icon-i-shujuguifan"
                    @click="goRulesPage(scope.row.id,scope.row.name)"
                    v-if="checkAuth('RBAC_PERMISSION_api_app_rules_pageDisplayRule_POST') || checkAuth('RBAC_PERMISSION_api_app_rules_dataInputRule_POST')||
                    checkAuth('RBAC_PERMISSION_api_app_rules_dataInputRule_POST') || checkAuth('RBAC_PERMISSION_api_app_rules_dataChangeRule_POST') || checkAuth('RBAC_PERMISSION_api_app_rules_dataConnectionRule_POST')"  
                  >规则配置</i>
                  <i
                    class="iconfont icon-shujuguifan"
                    @click="goDataSpecification(scope.row.id,scope.row.name)"
                    v-if="checkAuth('RBAC_PERMISSION_api_app_templates_{identifier}_{componentId}_specification_PUT')"
                  >数据规范</i>
                  <i
                    class="iconfont icon-shanchu"
                    v-if="checkAuth('RBAC_PERMISSION_api_app_templates_{identifier}_DELETE')"
                    @click="showDialog(scope.row.id)"
                  >删除</i>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <pagniation :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage" ref='pagniation'></pagniation>
        </div>
        <el-dialog
          title="修改属性"
          v-el-drag-dialog
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
            style="width:95%"
            label-position="top"
          >
            <el-form-item label="评价类别" prop="evaluationCategory">
              <el-cascader
                :options="evaluateList"
                v-model="templateForm.evaluationCategory"
                clearable
                disabled
                placeholder="请选择评价类型"
                filterable
                :props="{label:'name',value:'id',children:'children'}"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="templateForm.name" placeholder="请输入名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="模板描述">
              <el-input v-model="templateForm.describe" placeholder="请输入模板描述"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog1">取 消</el-button>
            <el-button type="primary" @click="dialogConfirm('ruleForm')">保 存</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <TemplateSort
      v-model="sortDialogVisible"
      :data="dataList"
      @saveTemplateSort="saveTemplateSort"
    />
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import TemplateSort from "./components/TemplateSort.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters } from "vuex";
export default {
  name: "templateList",
  components: { highlightWords, pagniation, preview, TemplateSort, SearchBox },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  data() {
    return {
      dataList: [], //表格数据
      projectObj:{}, //保存当前模板对应的项目
      loading:true,
      evaluateList: [], //评价类型
      unUseFiled: [], // 未使用的字段
      currCheckedId: "", //当前选中的模板id
      totalPage: 0,
      totalNum: 0,
      submitAllLoading:false, //提交全部内容loading
      dialogVisible1: false, // 模板属性修改的对话框
      sortDialogVisible: false, //模板排序框
      form: { keyWords: "", pageSize: 30, current: 0 }, //搜索
      templateForm: { name: "", evaluationCategory: [], describe: "" }, //添加模板
      rules: {
        name: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur"
          }
        ],
        evaluationCategory: [
          { required: true, message: "请选择评价类型", trigger: "blur" }
        ]
      },
      defaultProps: {
        children: "childList",
        label: "name",
        id: "id"
      }
    };
  },
  component: {
    TemplateSort
  },
  mounted() {
    const _this = this;
    window.onfocus = function() {
      //监听窗口事件
      if(_this.$route.meta.title === '项目模板列表'){
        _this.getProjectState()
      }
    };
  },
  created() {
    this.getTemplate();
    this.getEvaluateList(); //初始化评价类型
    this.getProjectState()
  },
  watch: {
    dialogVisible1(val) {
      if (!val) {
        this.templateForm = { name: "", evaluationCategory: [], describe: "" };
        this.$refs["ruleForm"].resetFields();
      }
    }
  },
  methods: {
     //重置页码组件的页码
    resetPagniation(){
      this.$refs.pagniation.refreshPage() 
    },
    searchTemplate(){
      this.form.current = 0;
      this.resetPagniation()
      this.getTemplate()
    },
    //获取当前项目的状态
    getProjectState(){
      this.$http.projectService.getProjectById(this.$route.params.projectId).then((res)=>{
        this.projectObj = res.data || {}
      })
    },
    getTemplate() {
      this.$http.projectService
        .getPrivateTemplateList(this.$route.params.projectId,this.form)
        .then(res => {
          this.dataList = res.data.content || [];
          this.totalPage = res.data.totalPages;
          this.totalNum = res.data.totalElements;
        }).finally(()=>{
          this.loading = false;
        });
    },
    //获取评价类型
    getEvaluateList() {
      this.$http.projectService.getEvaluateList().then(res => {
        this.evaluateList = res.data;
      });
    },
    //获取选择的类型id
    getCheckedTypeId(id) {},
    /**
     * 去模板编辑页面
     */
    goTemplate(id, evaluationCategoryId) {
      this.openWindow(`/template/${this.$route.params.projectId}/${id}/${evaluationCategoryId}/PROJECT`);
    },
    /**
     * 去预览页面
     */
    goTemplateView(row,name) {
      this.$http.templateService.previewTemplate(row.id, row).then(res => {
        name = encodeURIComponent(name)  //对名字进行十六进制转义
        this.openWindow(`/templatePreview/${name}/${row.id}/view/project`);
      });
    },
    //打开新窗口
    openWindow(route, query = {}) {
      window.open(this.$router.resolve({ path: route, query }).href);
    },
    //打开模板添加窗口
    openTemplateDialog() {
      this.dialogVisible1 = true;
    },
    //关闭对话框
    closeDialog1() {
      this.dialogVisible1 = false;
    },
    /** --------------模板列表操作 -------------------------**/
    //修改模板
    editTemplate(id, evaluateId, name, describe) {
      this.templateForm.name = name;
      let evaluateMaxId = evaluateId.split("-").slice(0, 2);
      this.templateForm.evaluationCategory = [
        evaluateMaxId.join("-"),
        evaluateId
      ];
      this.templateForm.describe = describe;
      this.currCheckedId = id; //当前选中的id项
      this.openTemplateDialog();
    },
    //录入数据
    goFormEntry(name, tempId) {
      name = encodeURIComponent(name)  //对名字进行十六进制转义
      this.openWindow(`/templatePreview/${name}/${tempId}/edit/project`);
    },
    //发布项目表单
    releaseProject() {
      this.$confirm("该操作将发布此项目, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.projectService
            .releaseProject(this.$route.params.projectId)
            .then(() => {
              this.$message({
                type: "success",
                message: "发布成功!"
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发布!"
          });
        });
    },
    //模板对话框确认按钮
    dialogConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            name: this.templateForm.name,
            categoryId: "PROJECT",
            groupId: "",
            scope: "PUBLIC",
            description: this.templateForm.describe,
            evaluationCategory: this.templateForm.evaluationCategory[
              this.templateForm.evaluationCategory.length - 1
            ]
          };
          params.components = this.dataList.filter(
            item => item.id === this.currCheckedId
          )[0].components;
          //修改模板基本信息
          this.$http.projectService
            .editTemplate(this.currCheckedId, params)
            .then(res => {
              this.getTemplate();
              this.dialogVisible1 = false;
              this.$message({
                message: "模板属性修改成功",
                type: "success"
              });
            });
        }
      });
    },
    //重置
    resetForm() {
      this.form.name = "";
      this.form.pageSize = 30;
      this.form.current = 0;
      this.resetPagniation()
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
    goDataSpecification(tempId,name) {
      name = encodeURIComponent(name)  //对名字进行十六进制转义
      this.$router.push(`/projectManagement/dataNorm/${tempId}/${name}`);
    },
    /**
     * 去规则设置
     */
    goRulesPage(tempId = "", name = "") {
      name = encodeURIComponent(name)  //对名字进行十六进制转义
      this.$router.push(`/projectManagement/templateRules/${tempId}/${name}`);
    },
    /**
     * 删除
     */
    showDialog(id) {
      this.curId = id;
      this.$confirm("是否删除此模板?", "", {
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
      this.$http.projectService.deleteTemplate(this.curId).then(() => {
        this.$message({ type: "success", message: "模板删除成功" });
        this.getTemplate();
      });
    },
    //保存模板排序
    saveTemplateSort(data) {
      this.$http.projectService
        .saveTemplateSort({ listData: data })
        .then(res => {
          this.$message({ type: "success", message: "模板排序保存成功" });
          const timer = setTimeout(() => {
            this.sortDialogVisible = false;
            this.getTemplate();
            clearTimeout(timer)
          },1000);
        });
    },
    //提交全部
    submitAll() {
      this.submitAllLoading = true
      this.$http.formEnterService
        .postFormValues({
          identifier: this.$route.params.projectId,
          projectState: "UNAUDITED"
        })
        .then(res => {
          this.$message({
            type: "success",
            message: "表单信息提交成功!"
          });
          this.$router.push('/projectManagement/formList/projectList')
        }).finally(()=>{
          this.submitAllLoading = false
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.customDialog >>> .el-dialog__body {
  padding-bottom: 10px;
}
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

.templte-right {
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
</style>
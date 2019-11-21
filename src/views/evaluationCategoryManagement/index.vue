<template>
    <div class="catgory-content-warp content-warp">
      <search-box :form="form">
        <template slot="input">
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input
                v-model="form.keyword"
                size="small"
                placeholder="请输入关键字"
                clearable
                @keyup.enter.native="searchData"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width:220px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="searchData">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          </el-col>
        </template>
      </search-box>
      <div class="regulation-tb box-style_common" style="padding-bottom:50px;">
        <div class="tools-bar_common">
          <h5 class="table-title">业务类别</h5>
          <!-- <div>
            <el-radio-group v-model="curType" size="small">
              <el-radio-button label="detect">检测业务管理</el-radio-button>
              <el-radio-button label="advisory">咨询业务管理</el-radio-button>
            </el-radio-group>
          </div> -->
        </div>
        <p class="empty-text">暂无数据</p>
        <el-tree :data="dataTree" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="categoryTree">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <div class="context-box">
              <el-popover
                placement="bottom-start"
                width="250"
                trigger="hover"
                :disabled="data.parentId === 'ROOT'"
              >
                <ul class="popover-box">
                  <li>
                    简&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 称: &nbsp;
                    <span>{{data.referred}}</span>
                  </li>
                  <li>
                    代&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 号: &nbsp;
                    <span>{{data.codeName}}</span>
                  </li>
                  <li v-show="!data.enabled">
                    停用理由: &nbsp;
                    <span>{{data.operationRecordsList.length ? data.operationRecordsList[data.operationRecordsList.length-1].describe : ''}}</span>
                  </li>
                  <li v-show="!data.enabled">
                    停用账号: &nbsp;
                    <span>{{data.operationRecordsList.length ? data.operationRecordsList[data.operationRecordsList.length-1].account :''}}</span>
                  </li>
                  <li v-show="!data.enabled">
                    停用时间: &nbsp;
                    <span>{{data.operationRecordsList.length ? data.operationRecordsList[data.operationRecordsList.length-1].date : ''}}</span>
                  </li>
                </ul>
                <span
                  class="context"
                  slot="reference"
                  :class="{'enabledStyle':!data.enabled}"
                >{{ node.label }}</span>
              </el-popover>
              <span class="icon-box operation-icon">
                <!-- <i class="iconfont icon-tianjia" @click.stop="openAddDialog('ADD',data)" v-if='checkAuth("RBAC_PERMISSION_api_app_categoryManage_POST")'>添加</i> -->
                <i
                  class="iconfont icon-xiugai"
                  v-show="data.parentId !== 'ROOT'"
                  @click.stop="editCategory(data)"
                >编辑</i>
                <!-- <i
                  class="iconfont icon-qiyong"
                  v-show="data.parentId !== 'ROOT' && !data.enabled"
                  @click.stop="openUseDialog(data)"
                  v-if='checkAuth("RBAC_PERMISSION_api_app_categoryManage_changeState_{id}_PUT")'
                >启用</i>
                <i
                  class="iconfont icon-tingyong"
                  v-show="data.parentId !== 'ROOT' && data.enabled && !data.flag"
                  @click.stop="openUseDialog(data)"
                  v-if='checkAuth("RBAC_PERMISSION_api_app_categoryManage_changeState_{id}_PUT")'
                >停用</i>
                <i
                  class="iconfont icon-shanchu"
                  v-show="data.parentId !== 'ROOT' && data.flag && !data.childList.length"
                  @click.stop="deleteNode(data.id)"
                  v-if='checkAuth("RBAC_PERMISSION_api_app_categoryManage_{id}_DELETE")'
                >删除</i> -->
              </span>
            </div>
          </span>
        </el-tree>
        <el-dialog
          :title="dialogType === 'ADD'? '新增类别':'编辑类别'"
          :visible.sync="addDialogVisiable"
          width="30%"
          :close-on-click-modal="false"
        >
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm"   label-position="top">
            <el-form-item label="上级类别为" >
              <p class="parentname">{{checkedNodeParentName}}</p>
            </el-form-item>
            <el-form-item label="类别名称" prop="name">
              <el-input v-model="ruleForm.name" size="small" placeholder="请输入类别名称"  v-focus='addDialogVisiable'></el-input>
            </el-form-item>
            <el-form-item label="简称" prop="referred">
              <el-input v-model="ruleForm.referred" size="small" placeholder="请输入简称"></el-input>
            </el-form-item>
            <el-form-item label="代号" prop="codeName">
              <el-input v-model="ruleForm.codeName" size="small" placeholder="请输入代号"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisiable = false" size="medium">取 消</el-button>
            <el-button type="primary" @click="saveData('ruleForm')" size="medium">保 存</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :title="!useDialogState? '启用类别':'停用类别'"
          :visible.sync="useDialogVisiable"
          width="30%"
          :close-on-click-modal="false"
        >
          <el-form :model="stateForm" :rules="stateRules" ref="stateForm" label-width="60">
            <el-form-item label="名称">
              <el-input v-model="stateForm.name" size="medium" disabled></el-input>
            </el-form-item>
            <el-form-item label="理由" prop="describe">
              <el-input v-model="stateForm.describe" size="medium" clearable></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="useDialogVisiable = false" size="medium">取 消</el-button>
            <el-button type="primary" @click="saveState('stateForm')" size="medium">保 存</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
</template>
<script>
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters } from "vuex";
export default {
  components: { SearchBox },
  name:'evaluationCategory',
  data() {
    return {
      form: {
        keyword: ""
      },
      ruleForm: {
        //新增修改
        name: "",
        referred: "",
        codeName: ""
      },
      stateForm: {
        //停用启用
        name: "",
        describe: ""
      },
      rules: {
        name: { required: true, message: "请输入类别名称", trigger: "blur" },
        referred: { required: true, message: "请输入简称", trigger: "blur" },
        codeName: { required: true, message: "请输入代号", trigger: "blur" }
      },
      stateRules: {
        describe: { required: true, message: "请输入理由", trigger: "blur" }
      },
      curId: "", //当前选择的节点的id
      checkedNodeParentName:'',
      checkedNode: {}, //保存当前点击的节点
      dialogType: "", //弹出框的操作类型,编辑还是新增
      useDialogState: "", //启用停用弹出框操作类型
      addDialogVisiable: false,
      useDialogVisiable: false, //启用停用弹出框
      defaultProps: {
        children: "childList",
        label: "name"
      },
      dataTree: [],
      curType: "detect"
    };
  },
  watch: {
    addDialogVisiable(val) {
      if (!val) {
        this.$refs["ruleForm"].resetFields();
        this.ruleForm = {
          name: "",
          referred: "",
          codeName: ""
        };
      }
    },
    useDialogVisiable(val) {
      if (!val) {
        this.$refs["stateForm"].resetFields();
        this.stateForm = {
          name: "",
          describe: ""
        };
      }
    },
    curType() {
      this.getData();
    }
  },
  created() {
    this.getData();
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  methods: {
    getData() {
      this.$http.advisoryCategoryService
        .getAdvisoryCategoryTree({
          categoryType: 'BUSINESSCATEGORY',
          keyword: this.form.keyword
        })
        .then(res => {
          this.dataTree = [res.data];
        });
    },
    resetForm() {
      this.form.keyword = "";
      this.searchData();
    },
    searchData(){
      this.$refs.categoryTree.filter(this.form.keyword);
    },
    // 搜素
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    openAddDialog(type, node) {
      this.dialogType = type;
      this.curId = node.id;
      this.checkParentName(node,type)
      this.addDialogVisiable = true;
    },
    //查询上级类别名称
    checkParentName(node,type){
      this.checkedNodeParentName = type === 'ADD' ? node.name : (node.parentName || '')
    },
    //修改类型
    editCategory(node) {
      this.ruleForm = {
        name: node.name,
        referred: node.referred,
        codeName: node.codeName
      };
      this.openAddDialog("EDIT", node);
    },
    //打开停用会启用框
    openUseDialog(node) {
      this.checkedNode = node; //用于以后查询是否有子节点
      this.curId = node.id;
      this.stateForm.name = node.name;
      this.useDialogState = node.enabled;
      this.useDialogVisiable = true;
    },
    //新增或修改节点
    saveData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            ...this.ruleForm,
            categoryType: 'BUSINESSCATEGORY',
            parentId: this.curId
          };
          if (this.dialogType === "ADD") {
            this.$http.advisoryCategoryService.addCategory(params).then(res => {
              this.addDialogVisiable = false;
              this.getData();
              this.$message({
                message: "类型添加成功",
                type: "success"
              });
            });
          } else {
            this.$http.advisoryCategoryService
              .editCategory(this.curId, params)
              .then(res => {
                this.addDialogVisiable = false;
                this.getData();
                this.$message({
                  message: "类别修改成功",
                  type: "success"
                });
              });
          }
        }
      });
    },
    //修改状态接口
    editState(params) {
      this.$http.advisoryCategoryService
        .editCategoryState(this.curId, params)
        .then(res => {
          this.$message({
            message: `${this.useDialogState ? "类别已停用" : "类别已启用"}`,
            type: "success"
          });
          this.useDialogVisiable = false;
          this.getData();
        });
    },
    //查询有无子节点
    checkIsHaveChildNode() {
      return this.checkedNode.childList.length > 0;
    },
    //查询有无停用的子节点
    checkIsHaveDiasabeldChildNode() {
      return this.recursionNodeTree(this.checkedNode.childList);
    },
    //递归节点树
    recursionNodeTree(data) {
      for (let item of data) {
        if (!item.enabled) {
          return true;
        }
        if (item.childList) {
          if (this.recursionNodeTree(item.childList)) {
            return true;
          }
        }
      }
      return false;
    },
    //删除类别节点
    deleteNode(id){
      this.$confirm('是否确认删除此类别？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.advisoryCategoryService.deleteCategoryNode(id).then(()=>{
            this.$message({
              message: '该类别已删除',
              type: "success"
            });
            this.getData();
          })
        }).catch(() => {       
        });
       
    },
    //停用或启用
    saveState(formName) {
      this.$refs[formName].validate(valid => {
        let params = {
          enableOrDisable: this.useDialogState ? "DISABLE" : "ENABLE",
          ...this.stateForm
        };
        if (valid) {
          let flag = this.useDialogState
            ? this.checkIsHaveChildNode()
            : this.checkIsHaveDiasabeldChildNode();
          if (flag) {
            this.$confirm(
              `${
                this.useDialogState
                  ? "系统检测到该类别有下级类别，是否一并停用 ？"
                  : "系统检测到该类别有下级类别被停用，是否一并启用 ？"
              }`,
              "",
              {
                confirmButtonText: "是",
                cancelButtonText: "否",
                type: "warning"
              }
            )
              .then(() => {
                params.flag = true;
                this.editState(params);
              })
          } else {
            params.flag = false;
            this.editState(params);
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.empty-text{
  text-align: center;
  position: relative;
  top: 20px;
  color: #606266;
}
.catgory-content-warp >>> .el-tree-node__content {
  display: flex;
  height: 30px;
  border-left: 1px solid transparent;
  justify-content: space-between;
}
.catgory-content-warp >>> .el-tree-node__content:hover {
  background: #E8F6FF;
  color: #1884CC;
  border-left: 1px solid #1884CC;
}
.catgory-content-warp >>> .custom-tree-node {
  flex-grow: 1;
  padding-right: 20px;
}
.operation-icon i{
  color: #606266;
}
.custom-tree-node .context {
  font-size: 14px;
}
.enabledStyle {
  color: #96a2b3;
  text-decoration: line-through;
}
.custom-tree-node .iconfont {
  margin-right: 5px;
}
.context-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-box {
  display: flex;
  align-items: center;
}
.popover-box {
  font-size: 13px;
  color: #3c4551;
}
.popover-box li {
  line-height: 24px;
}
.popover-box li span {
  color: #68788c;
}
.parentname{
  background: #F5F9FF;
  border-radius: 4px;
  height: 32px;
  line-height: 32px;
  color: #344152;
  padding-left: 15px;
  position: relative;
  top:4px;
}
</style>

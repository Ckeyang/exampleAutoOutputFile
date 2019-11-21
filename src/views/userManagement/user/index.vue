<template>
  <div class="content-warp">
    <el-row>
      <el-col :span="4">
        <div class="box box-style_common" style="height:87vh;overflow:auto;background:#fff;margin-right:12px;">
          <el-input placeholder="输入关键字进行过滤" size="mini" v-model="filterTree"></el-input>
          <div style="height:10px;"></div>
          <span
            style="width:56px;height:12px;font-size:14px;font-family:MicrosoftYaHei;color:rgba(93,104,122,1);line-height:0px;"
            >部门列表</span
          >
          <div style="height:10px;"></div>
          <div class="custom-tree-node">
            <span
              class="tree-name"
              style="cursor:pointer"
              @click="
                resetF();
                getDataList(data.id);
              "
              >{{ mechanism.name }}</span
            >
            &nbsp;&nbsp;
            <span>
              <el-dropdown trigger="click" @command="handleCommand" style="right:1.523em;">
                <i class="iconfont icon-shezhi" style="margin-right:1px"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="createDepartment" :data="mechanism">新增</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
          <el-tree
            :data="data"
            accordion
            empty-text
            default-expand-all
            ref="tree"
            :props="{ id: 'permissionId', label: 'name', children: 'children' }"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span
                class="tree-name"
                @click="
                  resetF();
                  getDataList(data.id);
                "
                >{{ node.label }}</span
              >
              &nbsp;&nbsp;
              <span>
                <el-dropdown trigger="click" @command="handleCommand">
                  <i class="iconfont icon-shezhi"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="createDepartment" :data="data">新增</el-dropdown-item>
                    <el-dropdown-item command="editDepartment" v-if="data.id != ''" :data="data">编辑</el-dropdown-item>
                    <el-dropdown-item command="deleteDepartment" :id="data.id">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="regulation-tb">
          <search-box :form="form">
            <template slot="input">
              <el-col :span="6">
                <el-form-item label="关键字">
                  <el-input
                    v-model="form.keyWords"
                    @keyup.enter="getDataList"
                    size="medium"
                    placeholder="关键词"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="16">
                <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList()">搜索</el-button>
                <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
                <!-- <el-button
                  type="success"
                  size="small"
                  class="entry-btn"
                  icon="el-icon-plus"
                  v-if="checkAuth('RBAC_PERMISSION-account-create')"
                  @click="addNewAccount"
                >新增</el-button>-->
              </el-col>
            </template>
            <!-- <template slot="button">
              <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList()">搜索</el-button>
              <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
              <el-button
                type="success"
                size="small"
                class="entry-btn"
                icon="el-icon-plus"
                v-if="checkAuth('RBAC_PERMISSION-account-create')"
                @click="addNewAccount"
              >新增</el-button>
            </template>-->
          </search-box>
          <div class="regulation-tb box-style_common">
            <div class="tools-bar_common">
              <h5 class="tb-title">用户列表</h5>
              <div style="float: right;margin-right: 15px;">
                <el-button
                  type="success"
                  size="small"
                  class="entry-btn"
                  icon="el-icon-plus"
                  @click="addNewAccount"
                  >新增用户</el-button
                >
              </div>
            </div>
            <el-table :data="dataList" 
            :max-height="winHeight - 326">
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column prop="realName" label="姓名">
                <template slot-scope="scope">
                  <highlight-words :text="scope.row.realName" :keyWords="form.keyWords"></highlight-words>
                </template>
              </el-table-column>
              <el-table-column prop="style" label="角色名称">
                <template slot-scope="scope">
                  <span v-for="(item, index) in scope.row.roleInfo" :key="index">&nbsp;{{ item.name }}&nbsp;</span>
                </template>
              </el-table-column>
              <el-table-column prop="mobilePhoneNumber" label="手机号">
                <template slot-scope="scope">
                  <highlight-words :text="scope.row.mobilePhoneNumber" :keyWords="form.keyWords"></highlight-words>
                </template>
              </el-table-column>
              <el-table-column prop="email" label="邮箱">
                <template slot-scope="scope">
                  <highlight-words :text="scope.row.email" :keyWords="form.keyWords"></highlight-words>
                </template>
              </el-table-column>
              <el-table-column prop="electronicSignature" label="电子签名">
                <template slot-scope="scope">
                  <img :src="scope.row.electronicSignature" width="120"/>
                </template>
              </el-table-column>
              <el-table-column prop="id" fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <div class="operation-icon">
                    <i
                      class="iconfont icon-xiugai"
                      @click="editAccount(scope.row)"
                      >编辑</i
                    >
                    <i
                      class="iconfont icon-shanchu"
                      @click="showDeleteDialog(scope.row.id)"
                      >删除</i
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="curId ? '编辑用户' : '新增用户'" :visible.sync="showDialog" width="30%">
      <el-form :rules="rules" ref="ruleForm" :model="account" label-position="top">
        <el-form-item  label="姓名" prop="realName">
          <el-input v-model="account.realName" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item  label="手机号码" prop="mobilePhoneNumber">
          <el-input v-model="account.mobilePhoneNumber" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item  label="邮箱" prop="email">
          <el-input v-model="account.email"></el-input>
        </el-form-item>
        <el-form-item v-if="editOther !== 'manager' && curId != ''" label="重置密码" prop="password">
          <el-input type="password" v-model="account.password"></el-input>
        </el-form-item>
         <el-form-item label="部门" prop="departmentIds">
          <treeselect
            v-model="account.departmentIds"
            autocomplete="false"
            :multiple="true"
            placeholder="请选择所属部门"
            noOptionsText="没有数据"
            :options="data"
            :normalizer="getTreeSet"
          />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <treeselect
            v-model="account.roles"
            :multiple="true"
            placeholder="请选择"
            noOptionsText="没有数据"
            :options="roleList"
            :normalizer="getRoleTreeSet"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="curId ? '编辑部门' : '新增部门'" :visible.sync="showDepartmentDialog" width="25%">
      <el-form :rules="rulesDepat" ref="departForm" :model="department" label-position="top">
        <el-form-item v-show="curItem.name" label="上级部门为">
          <el-input disabled v-model="curItem.name"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="department.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDepartmentDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm('departForm')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import Treeselect from "@riophae/vue-treeselect";
import SearchBox from "@/components/tools/searchBox.vue";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from "vuex";
import { constants } from "fs";
export default {
  name: "user",
  components: { highlightWords, SearchBox, pagniation, preview, Treeselect },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  data() {
    return {
      data: [],
      dataList: [],
      filterTree: "",
      curItem: {},
      roleList: [],
      departmentList: [],
      showDialog: false,
      department: { name: "" },
      showDepartmentDialog: false,
      rulesDepat: {
        name: [{ required: true, message: "必填部门名称" }]
      },
      rules: {
        realName: [{ required: true, message: "必填姓名" }],
        mobilePhoneNumber: [{ required: true, validator: this.checkPhone }],
        email: [{ required: true, validator: this.checkEmail }],
        roles: [{ required: true, message: "必选角色" }],
        departmentIds: [{ required: true, message: "必选部门" }]
      },
      deleteItems: [],
      deleteIds: [],
      totalPage: 0,
      totalNum: 0,
      account: {},
      curId: "",
      mechanism: {},
      action: "create",
      editOther: "new", //new , self , manager
      form: {
        keyWords: "",
        pageSize: 30,
        currentPage: 0,
        orderby: "",
        departmentIds: []
      }
    };
  },

  activated() {
    this.getMechanism();
    this.getRoleList();
    this.getDepartmentTree();
    this.getDataList();
  },
  watch: {
    filterTree(val) {
      this.$refs.tree.filter(val);
    },
    showDialog(val) {
      if (val) {
        this.$refs["ruleForm"].resetFields();
      }
    },
    showDepartmentDialog(val) {
      if (val) {
        this.$refs["departForm"].resetFields();
      }
    }
  },
  methods: {
    checkEmail(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入Email"));
      } else {
        let p = new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$"); // 验证邮箱
        let m = p.test(value);
        if (!m) {
          callback(new Error("请输入正确Email"));
        }
      }
      callback();
    },
    checkPhone(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入电话号码"));
      } else {
        let p = new RegExp("^[1][3,4,5,7,8,9][0-9]{9}$"); // 验证手机号
        let m = p.test(value);
        if (!m) {
          callback(new Error("请输入正确电话号码"));
        }
      }
      callback();
    },
    updateRoles(val) {
      this.account.roles = val;
    },
    /**
     * 获取机构
     */
    getMechanism() {
      let id = JSON.parse(sessionStorage.userInfo).customerId;
      this.$http.userService.getMechanism(id).then(res => {
        this.mechanism = res.data;
        this.mechanism.id = "";
      });
    },
    /**
     * 获取角色列表
     */
    getRoleList() {
      this.$http.userService.getRoolList({ pageSize: 1000, current: 0 }).then(res => {
        this.roleList = res.data.content || [];
      });
    },
    /**
     * 获取账户列表
     */
    getDataList(id = "") {
      this.form.departmentId = id;
      this.$http.userService.getUserList(this.form).then(res => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      });
    },
    getTreeSet(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    getRoleTreeSet(node) {
      return {
        id: node.codeId,
        label: node.name,
        children: node.children
      };
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /**
     * 方法控制
     */
    handleCommand(method, target) {
      this[method](target.$attrs.id || target.$attrs.data);
    },
    /**
     * 创建department
     */
    createDepartment(data) {
      this.curId = data.id;
      this.curItem = data;
      this.action = "create";
      this.showDepartmentDialog = true;
      this.department = this.getNewDepartment(this.curId);
    },
    /**
     * 编辑department
     */
    editDepartment(data) {
      let { parentId, enabled, name } = data;
      this.curId = data.id;
      this.action = "update";
      this.department = { parentId, enabled, name };
      this.curItem = { name: data.parentName };
      this.showDepartmentDialog = true;
    },
    /**
     * 获取新department对象
     */
    getNewDepartment(parentId) {
      return {
        parentId: parentId,
        enabled: true,
        name: ""
      };
    },
    /**
     * 删除机构
     */
    deleteDepartment(id) {
      this.curId = id;
      this.$confirm("是否删除此部门?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.doDeleteDepartment();
      });
    },
    /**
     * 执行删除机构
     */
    doDeleteDepartment() {
      this.$http.userService.deleteDepartment(this.curId).then(() => {
        this.$message({ type: "success", message: "删除成功" });
        this.getDepartmentTree();
      });
    },
    /**
     * 编辑
     */
    editAccount(item) {
      // {
      //   realName: "",
      //   mobilePhoneNumber: "",
      //   email: "",
      //   roles: [],
      //   departmentId: null
      // };
      let { realName, id, mobilePhoneNumber, email, departmentIds, roles } = item;
      this.curId = item.id;
      this.account = {
        realName,
        mobilePhoneNumber,
        email,
        departmentIds,
        roles,
        id
      };
      this.editOther = this.checkIsSelf(this.account);
      this.account.roles = item.roleInfo.map(jtem => {
        return jtem.codeId;
      });
      this.showDialog = true;
    },
    /**
     * 判断是否是自己在操作
     * self,manager
     */
    checkIsSelf(item) {
      let flag = "manager";
      let obj = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
      if (obj.id === item.id) {
        flag = "slef";
      }
      //   默认都是管理员，判断是否是自己
      return flag;
    },
    /**
     * 新建
     */
    addNewAccount() {
      this.editOther = "new";
      this.curId = "";
      this.account = this.newAccount();
      this.showDialog = true;
    },
    /**
     * 创建新的对象
     */
    newAccount() {
      return {
        realName: "",
        mobilePhoneNumber: "",
        email: "",
        roles: [],
        departmentIds: []
      };
    },
    /**
     * 校验表单
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.showDialog = false;
          this.showDepartmentDialog = false;
          if (formName === "departForm") {
            this.action === "create" ? this.doCreateDepartment() : this.doUpdateDepartment();
          } else {
            this.curId === "" ? this.doCreatUser() : this.doUpdateUser();
          }
          // alert('submit!');
        } else {
          return false;
        }
      });
    },
    /**
     * 创建机构
     */
    doCreateDepartment() {
      this.$http.userService.createDepartment(this.department).then(() => {
        this.filterTree = this.department.name;
        this.getDepartmentTree();
      });
    },
    /**
     * 修改机构
     */
    doUpdateDepartment() {
      this.$http.userService.updateDepartment(this.curId, this.department).then(() => {
        this.getDepartmentTree();
      });
    },
    /**
     * 创建user
     */
    doCreatUser() {
      this.$http.userService.createUser(this.account).then(() => {
        this.getDataList();
      });
    },
    /**
     * 修改User
     */
    doUpdateUser() {
      this.$http.userService.updateUser(this.curId, this.account).then(() => {
        this.getDataList();
      });
    },
    //重置
    resetForm() {
      this.resetF();
      this.getDataList();
    },
    resetF() {
      this.form.keyWords = "";
      this.form.currentPage = 0;
    },
    /**
     * 获取datalist
     */
    getDepartmentTree() {
      this.$http.userService.getDepartmentTree().then(res => {
        this.data = this.filterChildren(res.data || []);
      });
    },

    /**
     * 过滤空 的children
     */
    filterChildren(array) {
      let result = [];
      array.map(item => {
        let obj = {
          id: item.id,
          name: item.name,
          parentId: item.parentId,
          parentName: item.parentName
        };
        if (item.children != null) {
          obj.children = this.filterChildren(item.children);
        }
        result.push(obj);
      });
      return result;
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.currentPage = page.currentPage - 1;
      this.getDataList();
    },
    /**
     * 删除
     */
    showDeleteDialog(id) {
      this.curId = id;
      this.$confirm("是否删除此账号?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.doDelete();
      });
    },
    /**
     * 执行删除
     */
    doDelete() {
      this.$http.userService.deleteUser(this.curId).then(() => {
        this.$message({ type: "success", message: "删除成功" });
        this.getDataList();
      });
    },
    /**
     * 时间转换函数
     */
    formatDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      if (month < 10) {
        month = "0" + month;
      }
      return year + "-" + month + "-" + date;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dropdown {
  position: absolute;
  right: 1em;
}
// .custom-tree-node {
//   .el-icon-more {
//     opacity: 0;
//   }
// }
// .custom-tree-node:hover {
//   .el-icon-more {
//     opacity: 1;
//     transition: 1s all;
//   }
// }
.tree-name {
  color: rgba(52, 58, 69, 1);
  font-size: 12px;
}
.tree-name:hover {
  color: #26beff;
}
.box {
  box-sizing: border-box;
  padding: 0.5em;
}
.el-tree {
  background: none;
}
</style>

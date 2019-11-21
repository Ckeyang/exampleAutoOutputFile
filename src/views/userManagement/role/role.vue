<template>
  <div class="content-warp">
    <search-box :from="form">
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
        <el-col :span="6">
          <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-col>
      </template>
      <!-- <template slot="button">
        <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </template>-->
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="tb-title">角色列表</h5>
        <div style="float: right;margin-right: 15px;">
          <el-button
            type="success"
            size="small"
            icon="el-icon-plus"
            v-if="checkAuth('RBAC_PERMISSION_api_app_roles_POST')"
            class="entry-btn"
            @click="addNewRool"
            >新增角色</el-button
          >
        </div>
      </div>
      <el-table :data="dataList">
        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <el-table-column prop="style" label="角色名称">
          <template slot-scope="scope">
            <highlight-words :text="scope.row.name" :keyWords="form.keyWords"></highlight-words>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="releaseMechanism" label="拥有人">
            <template slot-scope="scope">
              <highlight-words :text="scope.row.releaseMechanism" :keyWords="form.keyWords"></highlight-words>
            </template>
        </el-table-column>-->
        <el-table-column prop="id" label="操作" fixed="right" width="300">
          <template slot-scope="scope">
            <div class="operation-icon">
              <!-- <i class="iconfont icon-shenhe icon-edit" @click="viewPeople(scope.row)">查看拥有人</i> -->
              <i
                class="iconfont icon-xiugai"
                v-if="checkAuth('RBAC_PERMISSION_api_app_roles_{identifier}_PUT')"
                @click="editRool(scope.row)"
                >编辑</i
              >
              <i
                class="iconfont icon-shanchu"
                v-if="checkAuth('RBAC_PERMISSION_api_app_roles_{identifier}_DELETE')"
                @click="showDeleteDialog(scope.row.id)"
                >删除</i
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
    </div>
    <el-dialog title="拥有人列表" :visible.sync="showDetailPeople" width="20%">
      <el-table :data="list">
        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <el-table-column label="拥有人">
          <template slot-scope="scope">{{ scope.row }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :title="curId ? '编辑角色' : '新增角色'" :visible.sync="showDialog" width="30%">
      <el-form :rules="rules" ref="ruleForm" :model="rool" label-position="top">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="rool.name" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="权限列表" prop="menus">
          <el-tree :data="data" :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <input
                type="checkbox"
                v-if="data.type === 'menu'"
                :checked="isChecked(data.type, data.menuId)"
                @change="checked(data.type, data, $event.target.checked)"
              />
              {{ data.title }}
              <input
                type="checkbox"
                v-if="data.type === 'fn'"
                :checked="isChecked(data.type, data.permissionId)"
                @change="checked(data.type, data, $event.target.checked)"
              />
              {{ data.name }}
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters } from "vuex";
export default {
  name: "rool",
  components: { highlightWords, SearchBox, pagniation, preview },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  data() {
    return {
      list: ["2", "3", "4"],
      showDetailPeople: false,
      rool: {
        name: "",
        description: "",
        menus: [],
        permissions: []
      },
      rules: {
        name: [{ required: true, message: "必填角色名称" }]
        //   menus: [{ type: 'array', required: true, message: '必须选择权限' }]
      },
      data: [],
      dataList: [],
      deleteItems: [],
      deleteIds: [],
      totalPage: 0,
      totalNum: 0,
      curId: "",
      showDialog: false,
      form: { keyword: "", pageSize: 30, current: 0 }
    };
  },
  watch: {
    showDialog(val) {
      if (!val) {
        this.$refs["ruleForm"].resetFields();
        this.getDataList();
      }
    }
  },
  activated() {
    this.getDataList();
    this.getJurisdictionTree();
  },
  methods: {
    checked(type, data, flag) {
      if (type === "menu") {
        let id = data.menuId;
        let index = this.rool.menus.indexOf(id);
        if (flag && index === -1) {
          this.rool.menus.push(id);
        } else if (!flag && index !== -1) {
          this.rool.menus.splice(index, 1);
        }
      } else {
        let id = data.permissionId;
        let index = this.rool.permissions.indexOf(id);
        if (flag && index === -1) {
          this.rool.permissions.push(id);
        } else if (!flag && index !== -1) {
          this.rool.permissions.splice(index, 1);
        }
      }
      if (data.children) {
        data.children.map(item => {
          this.checked(item.type, item, flag);
        });
      }
    },
    isChecked(type, id) {
      if (type === "menu") {
        return this.rool.menus.indexOf(id) != -1 ? true : false;
      } else {
        return this.rool.permissions.indexOf(id) != -1 ? true : false;
      }
    },
    /**
     * 查看拥有人
     */
    viewPeople(item) {
      this.list = item.list;
      this.showDetailPeople = true;
    },
    /**
     * 获取权限树
     */
    getJurisdictionTree() {
      this.$http.jurisdictionService.getJurisdictionTree().then(res => {
        this.data = this.reloadData(res);
      });
    },
    /**
     * 重新设置树
     */
    reloadData(data) {
      let result = [];
      data.map(item => {
        let obj = item.data.menu;
        obj.type = "menu";
        // obj.permission = item.permission;
        if (item.children) {
          obj.children = this.reloadData(item.children);
        }
        if (item.permission.length != 0) {
          obj.children = obj.children || [];
          item.permission.map(e => {
            let ob = e;
            ob.type = "fn";
            obj.children.push(ob);
          });
        }
        result.push(obj);
      });
      return result;
    },
    /**
     * 编辑角色
     */
    editRool(item) {
      this.rool = item;
      this.curId = item.id;
      this.showDialog = true;
    },
    /**
     * 新建角色
     */
    addNewRool() {
      this.curId = "";
      this.rool = this.createNewRool();
      this.showDialog = true;
    },
    /**
     * 创建一个新的rool对象
     */
    createNewRool() {
      return {
        name: "",
        description: "",
        menus: [],
        permissions: []
      };
    },
    /**
     * 权限校验
     */
    jurisdictionCheck(val, model) {
      this.rool.list = model.checkedKeys;
      this.$refs["ruleForm"].validate();
    },
    /**
     * 校验表单
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.curId ? this.doUpdateRool() : this.doCreateRool();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 执行创建
     */
    doCreateRool() {
      this.$http.userService.createRool(this.rool).then(() => {
        this.getDataList();
        this.showDialog = false;
      });
    },
    /**
     * 执行更新
     */
    doUpdateRool() {
      this.$http.userService.updateRool(this.curId, this.rool).then(() => {
        this.getDataList();
        this.showDialog = false;
      });
    },
    //重置
    resetForm() {
      this.form.keyWords = "";
      this.getDataList();
    },
    /**
     * 获取datalist
     */
    getDataList() {
      this.$http.userService.getRoolList(this.form).then(res => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      });
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    /**
     * 删除
     */
    showDeleteDialog(id) {
      this.curId = id;
      this.$confirm("是否删除此角色?", "", {
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
      this.$http.userService.deleteRool(this.curId).then(() => {
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
<style lang="scss" scoped></style>

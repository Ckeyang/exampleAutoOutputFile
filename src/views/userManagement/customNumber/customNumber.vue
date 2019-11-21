<template>
  <div class="content-warp">
    <search-box :from="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="关键字">
            <el-input
              v-model="form.keyWords"
              v-on:keyup.enter.native="getDataList"
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
        <h5 class="tb-title">自定义编号列表</h5>
        <div style="float: right;margin-right: 15px;">
          <el-button
            v-if="checkAuth('RBAC_PERMISSION_api_app_customNumber_POST')"
            type="success"
            size="small"
            class="entry-btn"
            icon="el-icon-plus"
            @click="add"
            >新增自定义编号</el-button
          >
        </div>
      </div>
      <el-table :data="dataList">
        <el-table-column prop="businessCategoryTypeName" label="业务类别" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="typeName" label="编号类型" width="120"></el-table-column>
        <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="describe" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="enableOrDisable" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enableOrDisable==='ENABLE'" type="primary" size="small">启用</el-tag>
            <el-tag v-if="scope.row.enableOrDisable==='DISABLE'" type="warning" size="small">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="190">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i
                title="编辑"
                class="iconfont icon-xiugai"
                v-if="checkAuth('RBAC_PERMISSION_api_app_customNumber_{identifier}_PUT')"
                @click="editItem(scope.row)"
                >编辑</i
              >
              <i
                title="启用"
                v-if="
                  scope.row.enableOrDisable === 'DISABLE' &&
                    checkAuth('RBAC_PERMISSION_api_app_customNumber_changeState_{identifier}_PUT')
                "
                class="iconfont icon-qiyong"
                @click="enabledItem(scope.row)"
                >启用</i
              >
              <i title="停用" v-else class="iconfont icon-tingyong" @click="enabledItem(scope.row)">停用</i>
              <i
                title="删除"
                v-if="
                  scope.row.enableOrDisable === 'DISABLE' &&
                    scope.row.templateIdSet.length === 0 &&
                    checkAuth('RBAC_PERMISSION_api_app_customNumber_{identifier}_DELETE')
                "
                class="iconfont icon-shanchu"
                @click="deleteItem(scope.row.id)"
                >删除</i
              >
              <!-- <i class="iconfont icon-shenhe icon-edit" @click="viewPeople(scope.row)">查看拥有人</i> -->
              <!-- <i class="iconfont icon-shenhe icon-edit" v-if="checkAuth('RBAC_PERMISSION-rool-modify')" @click="editRool(scope.row)">编辑</i>
              <i class="iconfont icon-xiugai icon-edit" v-if="checkAuth('RBAC_PERMISSION-rool-delete')" @click="showDeleteDialog(scope.row.id)">删除</i>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="自定义编号设置" :visible.sync="showEditBox" width="30%" :close-on-click-modal="false">
      <el-form :model="curItem" ref="test" :rules="rules" label-position="top" label-width="70px">
        <el-form-item label="业务类别" prop="businessCategoryType">
          <el-cascader
            :options="advisoryCategory"
            clearable
            :show-all-levels="false"
            v-model="curItem.businessCategoryType"
            :props="{ label: 'name', children: 'childList', value: 'id' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="编号类型" prop="type">
          <el-select v-model="curItem.type" style="width:100%">
            <el-option label="合同编号" value="CONTRACT"></el-option>
            <el-option label="委托受理编号" value="ENTRUST"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="curItem.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input type="textarea" v-model="curItem.describe"></el-input>
        </el-form-item>
        <el-form-item label="样例" prop="customNumberRuleList">
          <div class="gray" style="text-align:right">{{ getCustomNumberTest() }}</div>
          <br />
          <div>
            <div>编号前缀</div>
            <div v-for="(item, index) in curItem.customNumberRuleList" :key="index">
              <customNumberInput
                :model.sync="item"
                :index="index"
                :prefexList="prefexList"
                :hasShareList="false"
                @addCustomNumber="addCustomNumber"
                @deleteCustomNumber="deleteCustomNumber"
              ></customNumberInput>
            </div>
            <div v-if="curItem.customNumberRuleList.length === 0" style="text-align:center">
              <i class="iconfont icon-jia" @click="addCustomNumber"></i>
            </div>
          </div>
          <!-- <el-input v-model="curItem.description"></el-input> -->
        </el-form-item>
        <el-form-item label="初始值" prop="initValue">
          <el-input v-model="curItem.initValue" :step="1" step-strictly></el-input>
        </el-form-item>
        <el-form-item label="步进值" prop="stepValue">
          <el-input-number v-model="curItem.stepValue" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditBox = false">取消</el-button>
        <el-button type="primary" @click="doSave">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import customNumberInput from "./compontens/customNumberInput.vue";
import { mapGetters } from "vuex";
export default {
  name: "customNumber",
  components: {
    highlightWords,
    pagniation,
    SearchBox,
    preview,
    customNumberInput
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  data() {
    return {
      form: { keyWords: "", pageSize: 30, current: 0 },
      dataList: [],
      advisoryCategory: [],
      prefexList: {},
      showEditBox: false,
      totalPage: 0,
      curItem: {
        name: "",
        describe: "",
        businessCategoryType: [],
        type: "",
        customNumberRuleList: [],
        stepValue: "",
        initValue: ""
      },
      rules: {
        type: { required: true, message: "必填" },
        businessCategoryType: { required: true, message: "必填" },
        name: { required: true, message: "必填" },
        stepValue: { required: true, message: "必填" },
        initValue: { required: true, validator: this.checkNumber }
      },
      totalNum: 0
    };
  },
  watch: {
    showEditBox(val) {
      if (!val) {
        this.$refs["test"].resetFields();
      }
    }
  },
  activated() {
    this.getDataList();
    this.getCustomerNumberPrefixList();
    this.getAdvisoryCategory();
    // this.getRule();
  },
  methods: {
    checkNumber(rule, value, callback) {
      if (value === "") {
        callback(new Error("必填"));
      } else if (!/^[0-9]*$/g.test(value)) {
        callback(new Error("请输入正确的初始值"));
      } else {
        callback();
      }
    },
    getAdvisoryCategory() {
      this.$http.advisoryCategoryService.getAdvisoryCategoryTree().then(res => {
        this.advisoryCategory = res.data.childList;
      });
    },
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
    getCustomNumberTest() {
      let result = "";
      this.curItem.customNumberRuleList.map(item => {
        switch (item.type) {
          case "DATEVARIABLE":
            result += item.value + item.connector || "";
            break;
          case "SHARECOMPONENT":
            result += "共享件" + item.connector || "";
            break;
          case "SYSTEMVARIABLES":
            result += "职" + item.connector || "";
            break;
          case "FIXEDTEXT":
            result += item.value + item.connector || "";
            break;
        }
      });
      result += this.curItem.initValue;
      return result;
    },
    getCustomerNumberPrefixList() {
      this.$http.customNumberService.getCustomerNumberPrefixList({}).then(res => {
        this.prefexList = res.data;
      });
    },
    addCustomNumber() {
      this.curItem.customNumberRuleList.push({
        value: "",
        type: "FIXEDTEXT",
        connector: ""
      });
    },
    deleteCustomNumber(index) {
      this.curItem.customNumberRuleList.splice(index, 1);
    },
    editItem(item) {
      let { id, name, describe, businessCategoryType, type, customNumberRuleList, stepValue, initValue } = item;
      this.curItem = {
        businessCategoryType,
        type,
        id,
        name,
        describe,
        customNumberRuleList,
        stepValue,
        initValue
      };
      this.showEditBox = true;
    },
    enabledItem(item) {
      this.$http.customNumberService
        .enableOrDisable(item.id, item.enableOrDisable === "ENABLE" ? "DISABLE" : "ENABLE")
        .then(this.getDataList);
    },
    add() {
      this.curItem = {
        name: "",
        describe: "",
        businessCategoryType: [],
        type: "",
        customNumberRuleList: [{ type: "FIXEDTEXT", value: "", connector: "" }],
        stepValue: "",
        initValue: ""
      };
      this.showEditBox = true;
    },
    doSave() {
      this.$refs["test"].validate(valid => {
        if (valid) {
          this.curItem.id ? this.doUpdate() : this.doCreate();
        } else {
          return false;
        }
      });
    },
    doUpdate() {
      this.$http.customNumberService
        .update(this.curItem.id, this.curItem)
        .then(() => {
          this.$message.success("修改成功");
          this.showEditBox = false;
        })
        .then(this.getDataList);
    },
    doCreate() {
      this.$http.customNumberService
        .create(this.curItem)
        .then(() => {
          this.$message.success("添加成功");
          this.showEditBox = false;
        })
        .then(this.getDataList);
    },
    getDataList() {
      this.$http.customNumberService.getCustomerNumberList(this.form).then(res => {
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
    resetForm() {
      this.form.keyWords = "";
      this.getDataList();
    },
    deleteItem(id) {
      this.$confirm("是否删除此自定义编号?", "", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.customNumberService.delete(id).then(this.getDataList);
      });
    },
    enableItem(item) {
      this.$http.customNumberService
        .enableOrDisable(item.id, item.enable ? false : true)
        .then(() => {
          this.$message.success("执行成功");
        })
        .then(this.getDataList);
    }
  }
};
</script>
<style lang="scss" scoped>
.gray {
  position: absolute;
  left: 0;
  text-align: right;
  width: 100%;
  font-size: 12px;
  border-radius: 6px;
  padding: 0 1em;
  box-sizing: border-box;
  background-color: rgb(240, 243, 245);
  color: #68788c;
}
</style>

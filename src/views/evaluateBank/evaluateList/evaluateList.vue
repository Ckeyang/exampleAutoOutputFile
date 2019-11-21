<template>
  <div class="content-warp">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="业务类别">
            <el-cascader
              :options="categories"
              clearable
              :show-all-levels="false"
              v-model="form.businessClassificationIds"
              :props="{ label: 'name', children: 'childList', value: 'id' }"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-col>
      </template>
      <!-- <template slot="button">
        <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
        <el-button type="info" size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </template>-->
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="tb-title">方法列表</h5>
        <div style="float: right;">
          <el-button type="success" size="small" class="entry-btn" icon="el-icon-plus" @click="createEvaluate()"
            >新增方法类别</el-button
          >
        </div>
      </div>
      <el-table :data="dataList" :max-height="winHeight - 340">
        <template slot="empty">
          <br />
          <br />
          <img src="@/assets/empty.png" />
          <br />
          <span>暂无数据</span>
          <br />
          <br />
          <br />
          <br />
        </template>
        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <el-table-column prop="businessCategoryName" label="业务类别"> </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i
                class="iconfont icon-xiugai icon-edit"
                @click="goRoutePath('/evaluateBank/evaluateDetail', scope.row.id, 'edit')"
                >查看编辑</i
              >
              <i class="iconfont icon-fuzhi" @click="copyEvaluate(scope.row)">复制</i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagniation
        :totalPage="totalPage"
        :currentPage="form.current"
        :totalNum="totalNum"
        @changePage="handleChangePage"
      ></pagniation>
      <el-dialog :title="curId ? '复制方法类别' : '新增方法类别'" :visible.sync="showDialog" width="30%">
        <el-form :rules="rules" ref="ruleForm" :model="evaluate" label-position="top">
          <!-- <el-form-item label="分类选择" prop="businessClassification">
            <el-select v-model="evaluate.businessClassification" style="width:100%" size="medium">
              <el-option v-for="(item, index) in categories" :value="item.id" :key="index" :label="item.name"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="类别选择" prop="businessCategoryIds">
            <el-cascader
              :options="categories"
              size="medium"
              clearable
              v-model="evaluate.businessCategoryIds"
              :props="{ label: 'name', children: 'childList', value: 'id' }"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters } from "vuex";
export default {
  name: "evaluateList",
  components: { highlightWords, SearchBox, pagniation, preview },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  data() {
    return {
      dataList: [],
      categories: [],
      totalPage: 0,
      nameDesc: {
        evaluationMethodContent: "",
        evaluationMethodName: ""
      },
      rules: {
        businessClassification: { required: true, message: "必填" },
        businessCategoryIds: { required: true, message: "必填" }
      },
      totalNum: 0,
      curId: "",
      showDialog: false,
      showNameDescBox: false,
      nameAndDescaction: "",
      evaluate: {
        evaluatioName: "",
        categoryIdList: [],
        categoryType: "",
        evaluationDescribe: "",
        evaluationMethodDataList: []
      },
      form: { keyword: "", pageSize: 30, current: 0 }
    };
  },
  watch: {
    showDialog(val) {
      if (!val) {
        this.$refs.ruleForm.resetFields();
      }
    }
  },
  activated() {
    this.getCategories();
    this.getDataList();
  },
  methods: {
    getCategorieByTypeForm() {
      let result = this.categories.find(item => {
        if (item.id === this.form.businessCategoryId) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
    /**
     * 获取行业分类
     */
    getCategories() {
      this.$http.advisoryCategoryService.getAdvisoryCategoryTree().then(res => {
        this.categories = res.data.childList;
      });
    },
    //搜索
    searchDatas() {
      this.form.pageSize = 30;
      this.form.current = 0;
      this.getDataList();
    },
    //去除类别为空的数组字段
    reloadCategories(data) {
      let result = [];
      data.map(item => {
        let { id, name, childList } = item;
        if (childList.length > 0) {
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
      let result = this.categories.find(item => {
        if (item.id === this.evaluate.businessClassification) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
    doCheckNameDesc(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.showNameDescBox = false;
          if (this.nameAndDescaction === "add") {
            this.evaluate.evaluationMethodDataList.push(this.nameDesc);
          }
        } else {
          return false;
        }
      });
    },
    addNameAndDesc() {
      this.nameAndDescaction = "add";
      this.showNameDescBox = true;
      this.nameDesc = {
        evaluationMethodContent: "",
        evaluationMethodName: ""
      };
    },
    editNameAndDesc(item) {
      this.nameAndDescaction = "edit";
      this.showNameDescBox = true;
      this.nameDesc = item;
    },
    deleteNameAndDesc(item) {
      let index = this.evaluate.evaluationMethodDataList.indexOf(item);
      this.evaluate.evaluationMethodDataList.splice(index, 1);
    },
    //重置
    resetForm() {
      this.form.keyWords = "";
      this.getDataList();
    },
    /**
     * 获取评价类型
     */
    // getCategories() {
    //   this.$http.basisBankService.getCategories().then(res => {
    //     this.categories = res.data;
    //   });
    // },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    /**
     * 获取列表
     */
    getDataList() {
      this.$http.evaluateService.getEvaluateList(this.form).then(res => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      });
    },
    /**
     * 创建
     */
    createEvaluate() {
      this.action = "create";
      this.evaluate = {
        businessCategoryIds: [],
        businessClassification: ""
      };
      this.curId = "";
      this.showDialog = true;
    },
    copyEvaluate(item) {
      this.action = "copy";
      this.evaluate = {
        businessCategoryIds: [],
        businessClassification: ""
      };
      this.curId = item.id;
      this.showDialog = true;
    },
    /**
     * 校验表单
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.action) {
            case "create":
              this.doCreate();
              break;
            case "copy":
              this.doCopy();
              break;
          }
        } else {
          return false;
        }
      });
    },
    goRoutePath(path, id = 0, action = "view", params = { businessCategoryIds: [], businessClassification: "" }) {
      this.$router.push(path + "/" + id + "?action=" + action);
    },
    doCreate() {
      this.$http.evaluateService.createEvaluate(this.evaluate).then(res => {
        this.showDialog = false;
        this.goRoutePath("/evaluateBank/evaluateDetail", res.data, this.action);
        this.getDataList();
      });
    },
    /**
     * 执行创建
     */
    doCopy() {
      this.$http.evaluateService.copyEvaluate(this.curId, this.evaluate).then(res => {
        this.showDialog = false;
        this.goRoutePath("/evaluateBank/evaluateDetail", res.data, this.action);
        this.getDataList();
      });
    },
    /**
     * 执行修改
     */
    doUpdate() {
      this.$http.evaluateService.updateEvaluate(this.curId, this.evaluate).then(() => {
        this.showDialog = false;
        this.getDataList();
      });
    },
    /**
     * 删除
     */
    doDelete(id) {
      this.$confirm("是否删除此评价方法?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.evaluateService.deleteEvaluate(id).then(() => {
          this.$message.success("删除成功");
          this.getDataList();
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.search-box {
  background: #fff;
  border-radius: 5px;
}

.search-row {
  border-bottom: 1px solid #edf1f7;
  padding: 15px;
  line-height: 40px;
  height: 40px;
  box-sizing: content-box;
}

.search-row > .el-col {
  margin-right: 30px;
  text-align: center;
  width: 270px;
}

.search-row .arror-down {
  margin-right: 5px;
}
</style>

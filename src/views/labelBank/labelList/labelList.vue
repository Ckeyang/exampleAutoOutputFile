<template>
  <div>
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="关键字">
            <el-input v-model="form.keyWords" size="medium" placeholder="关键词" clearable></el-input>
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
      </template> -->
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="tb-title">标签列表</h5>
        <div style="float: right;">
          <el-button
            type="success"
            size="small"
            icon="el-icon-plus"
            class="entry-btn"
            @click="addNewLabel"
          >新增标签</el-button>
        </div>
      </div>
      <el-table :data="dataList">
        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <el-table-column prop="labelName" label="名称">
          <template slot-scope="scope">
            <highlight-words :text="scope.row.labelName" :keyWords="form.keyWords"></highlight-words>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="releaseMechanism" label="拥有人">
            <template slot-scope="scope">
              <highlight-words :text="scope.row.releaseMechanism" :keyWords="form.keyWords"></highlight-words>
            </template>
        </el-table-column>-->
      </el-table>
    <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
    </div>
    <el-dialog :title="curId?'编辑标签':'新增标签'" :visible.sync="showDialog" width="30%" center>
      <el-form :rules="rules" ref="ruleForm" :model="label" label-position="top">
        <el-form-item label="标签名称" prop="labelName">
          <el-input v-model="label.labelName" maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog=false">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import preview from "@/components/tools/Preview.vue";
import { mapGetters } from "vuex";
export default {
  name: "labelList",
  components: { highlightWords, SearchBox, pagniation, preview },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  data() {
    return {
      label: {},
      rules: {
        labelName: [{ required: true, message: "必填标签名称" }]
        //   menus: [{ type: 'array', required: true, message: '必须选择权限' }]
      },
      dataList: [],
      totalPage: 0,
      totalNum: 0,
      curId: "",
      showDialog: false,
      form: { keyword: "", pageSize: 30, current: 0 }
    };
  },

  activated() {
    this.getDataList();
  },
  methods: {
    /**
     * 校验表单
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.showDialog = false;
          this.curId ? this.doUpdateLabel() : this.doCreateLabel();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 添加新label
     */
    addNewLabel() {
      this.curId = "";
      this.label = { labelName: "" };
      this.showDialog = true;
    },
    /**
     * 执行创建
     */
    doCreateLabel() {
      this.$http.labelBankService.createLabel(this.label).then(() => {
        this.getDataList();
      });
    },
    /**
     * 执行编辑
     */
    doUpdateLabel() {},
    //重置
    resetForm() {
      this.form.keyWords = "";
      this.getDataList();
    },
    /**
     * 获取datalist
     */
    getDataList() {
      this.$http.labelBankService.getLabelBankList(this.form).then(res => {
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


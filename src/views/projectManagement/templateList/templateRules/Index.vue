<template>
  <div class="content-warp">
    <div v-show="!showAddBox">
      <search-box :from="form">
        <template slot="input">
          <el-col :span="6">
            <el-form-item label="规则类别">
              <el-select size="small" clearable v-model="form.ruleType">
                <el-option v-for="(item, index) in ruleTypes" :key="index" :value="item.key" :label="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规则名称">
              <el-input
                v-model="form.ruleName"
                size="small"
                placeholder="请输入规则名称"
                clearable
                @keyup.enter.native="serachRlues"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="small" icon="el-icon-search" @click="serachRlues">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          </el-col>
        </template>
        <!-- <template slot="button">
        <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </template>-->
      </search-box>
      <div class="regulation-tb box-style_common" style="height:calc(100% - 88px)">
        <div class="tools-bar_common">
          <h5 class="table-title">规则列表</h5>
          <div>
            <el-button
              size="small"
              icon="iconfont icon-shunxu"
              @click="
                getSortList();
                sortBoxVisible = true;
              "
              >设置顺序</el-button
            >
            <el-button type="success" size="small" icon="el-icon-plus" @click="addRule">新增规则</el-button>
          </div>
        </div>
        <el-table :data="dataList" style="width: 100%" :max-height="winHeight - 326" highlight-current-row>
          <el-table-column prop="ruleType" label="规则类型" width="200">
            <template slot-scope="scope">{{
              ruleTypes
                .map(item => {
                  if (item.key === scope.row.ruleType) {
                    return item.value;
                  }
                })
                .join("")
            }}</template>
          </el-table-column>
          <el-table-column prop="name" label="规则名称" width="200"></el-table-column>
          <el-table-column prop="description" label="规则描述"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i class="iconfont icon-xiugai" @click="editRule(scope.row)">修改</i>
                <i class="iconfont icon-fuzhi" @click="copyRule(scope.row.id)">复制</i>
                <i class="iconfont icon-shanchu" @click="deleteRule(scope.row.id)">删除</i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagniation
          :totalPage="totalPage"
          :totalNum="totalNum"
          :currentPage="form.current"
          @changePage="handleChangePage"
        ></pagniation>
      </div>
    </div>
    <div class="addBox" v-show="showAddBox">
      <div class="tools-bar">
        <h5 class="table-title">{{ tempName }}-{{ curId ? "编辑规则" : "新增规则" }}</h5>
        <div>
          <el-button type="primary" size="small" @click="backRulesList">返回列表</el-button>
        </div>
      </div>
      <div class="formBox">
        <el-form label-position="left" label-width="120px">
          <el-form-item label="规则类型">
            <el-select v-model="type" size="small" style="width:100%">
              <el-option v-for="(item, index) in ruleTypes" :key="index" :value="item.key" :label="item.value"></el-option>
            </el-select>
            <!-- <el-radio-group v-model="type">
              <el-radio v-for="(item, index) in ruleTypes" :key="index" :label="item.key">
                <template>{{ item.value }}</template>
              </el-radio>
            </el-radio-group> -->
          </el-form-item>
        </el-form>
        <addRules
          ref="addRules"
          :visible.sync="showAddBox"
          v-show="type === 'PAGE_DISPLAY_RULE'"
          :templateId="form.templateId"
        ></addRules>
        <addDataFormulaRules
          ref="addDataFormulaRules"
          :visible.sync="showAddBox"
          v-show="type === 'DATA_FORMULA_RULE'"
          :templateId="form.templateId"
        ></addDataFormulaRules>
        <addValidationRules
          ref="addValidationRules"
          :visible.sync="showAddBox"
          v-show="type === 'DATA_VALIDATION_RULE'"
          :templateId="form.templateId"
        ></addValidationRules>
        <addDataLinkageFormRules
          ref="addDataLinkageFormRules"
          :visible.sync="showAddBox"
          v-show="type === 'DATA_LINKAGE_FORM_RULE'"
          :templateId="form.templateId"
        ></addDataLinkageFormRules>
        <addDataBatchAdaptationRules
          ref="addDataBatchAdaptationRules"
          :visible.sync="showAddBox"
          v-show="type === 'DATA_BATCH_ADAPTATION_RULE'"
          :templateId="form.templateId"
        ></addDataBatchAdaptationRules>
        <!-- <addDataRules
          ref="addDataRules"
          @changeVisible="showAddBox = false"
          v-show="type==='DATA_INPUT_RULE'"
          :ruleId="curId"
          :templateId="form.templateId"
        ></addDataRules>-->
        <addDataAssociationRules
          ref="addDataAssociationRules"
          :visible.sync="showAddBox"
          v-show="type === 'DATA_CONNECTION_RULE'"
          :templateId="form.templateId"
        ></addDataAssociationRules>
        <addValueChangeRules
          ref="addValueChangeRules"
          :visible.sync="showAddBox"
          v-show="type === 'DATA_CHANGE_RULE'"
          :templateId="form.templateId"
        ></addValueChangeRules>
      </div>
    </div>
    <el-dialog title="设置顺序" :visible.sync="sortBoxVisible" width="34%" :close-on-click-modal="false">
      <sort-box v-model="sortList" :props="ruleProps"></sort-box>
      <p style="font-size:12px;color:#96A2B3;margin-top:10px;">PS：该顺序会直接影响规则执行</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sortBoxVisible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="saveSort" size="medium">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import SortBox from "@/components/tools/sortBox.vue";
import addRules from "../components/addRules.vue";
// import addDataRules from "../components/addDataRules.vue";
import addDataAssociationRules from "../components/addDataAssociationRules.vue";
import addValueChangeRules from "../components/addValueChangeRules.vue";
import addDataBatchAdaptationRules from "../components/addDataBatchAdaptationRules.vue";
import addDataFormulaRules from "../components/addDataFormulaRules.vue";
import addValidationRules from "../components/addValidationRules.vue";
import addDataLinkageFormRules from "../components/addDataLinkageFormRules.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters } from "vuex";
export default {
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  name:'templateRules',
  data() {
    return {
      form: {
        ruleName: "",
        templateId: this.$route.params.tempId,
        pageSize: 30,
        current: 0
      },
      curId: "",
      type: "",
      ruleProps: [
        {
          key: "ruleType",
          label: "规则类型",
          formatter: row => {
            return this.ruleTypes
              .map(item => {
                if (item.key === row.ruleType) {
                  return item.value;
                }
              })
              .join("");
          }
        },
        { key: "name", label: "规则名称" },
        { key: "description", label: "规则描述" }
      ],
      tempName: this.$route.params.tempName,
      sortBoxVisible: false,
      showAddBox: false,
      totalPage: 0,
      totalNum: 0,
      ruleTypes: [
        { key: "PAGE_DISPLAY_RULE", value: "页面显示规则" },
        { key: "DATA_BATCH_ADAPTATION_RULE", value: "数据批量适配规则" },
        // { key: "DATA_INPUT_RULE", value: "数据录入规则" },
        { key: "DATA_CONNECTION_RULE", value: "数据关联规则" },
        { key: "DATA_CHANGE_RULE", value: "控件值改变时规则" },
        { key: "DATA_VALIDATION_RULE", value: "数据验证规则" },
        { key: "DATA_FORMULA_RULE", value: "公式计算规则" },
        { key: "DATA_LINKAGE_FORM_RULE", value: "数据联动规则" }
      ],
      dataList: [],
      sortList: []
    };
  },
  watch: {
    showAddBox() {
      this.getDataList();
    },
    $route() {
      this.form.templateId = this.$route.params.tempId ? this.$route.params.tempId : this.form.templateId;
      this.showAddBox = false;
      this.tempName = this.$route.params.tempName;
      this.$route.params.tempId ? this.getDataList() : null;
    },
    type(val) {
      switch (val) {
        case "PAGE_DISPLAY_RULE":
          this.curId ? null : this.$refs.addRules.createNewRule();
          break;
        case "DATA_CHANGE_RULE":
          this.curId ? null : this.$refs.addValueChangeRules.createNewRule();
          break;
        case "DATA_BATCH_ADAPTATION_RULE":
          this.curId ? null : this.$refs.addDataBatchAdaptationRules.createNewRule();
        case "DATA_CONNECTION_RULE":
          this.curId ? null : this.$refs.addDataAssociationRules.createNewRule();
          break;
        case "DATA_FORMULA_RULE":
          this.curId ? null : this.$refs.addDataFormulaRules.createNewRule();
        case "DATA_LINKAGE_FORM_RULE":
          this.curId ? null : this.$refs.addDataLinkageFormRules.createNewRule();
          break;
        case "DATA_VALIDATION_RULE":
          this.curId ? null : this.$refs.addValidationRules.createNewRule();
          break;
      }
    }
  },
  components: {
    addRules,
    SortBox,
    SearchBox,
    highlightWords,
    pagniation,
    preview,
    addDataBatchAdaptationRules,
    addDataFormulaRules,
    addValidationRules,
    addDataLinkageFormRules,
    addDataAssociationRules,
    addValueChangeRules
  },
  activated() {
    this.getDataList();
  },
  created() {
    this.getDataList();
  },
  methods: {
    //返回规则列表
    backRulesList() {
      this.showAddBox = false;
      this.$refs.addDataRules.resetForm("ruleForm");
    },
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    serachRlues() {
      this.form.current = 0;
      this.getDataList();
    },
    //获取规则列表
    getDataList() {
      this.$http.ruleService.getRuleList(this.form).then(res => {
        this.dataList = res.data.content || [];
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      });
    },
    getSortList() {
      this.$http.ruleService.getRuleSortList(this.form.templateId).then(res => {
        this.sortList = res.data;
      });
    },
    saveSort() {
      if (!this.sortList) {
        this.sortBoxVisible = false;
        return;
      }
      this.$http.ruleService
        .saveRuleSortList(this.form.templateId, { listData: this.sortList.map(item => item.id) })
        .then(() => {
          this.$message.success("保存成功");
          this.sortBoxVisible = false;
        })
        .then(this.getDataList);
    },
    //重置搜索
    resetForm() {
      this.form = {
        ruleName: "",
        pageSize: 30,
        current: 0,
        templateId: this.$route.params.tempId
      };
      this.getDataList();
    },
    //删除规则
    deleteRule(id) {
      this.$confirm("确认删除?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.ruleService.delete(id).then(() => {
          if (this.dataList.length <= 1) {
            this.form.current = this.form.current >= 1 ? this.form.current - 1 : 0;
          }
          this.getDataList();
        });
      });
    },
    copyRule(id) {
      this.$http.ruleService
        .copy(id)
        .then(() => {
          this.$message.success("复制成功");
        })
        .then(this.getDataList);
    },
    //去添加规则页面
    addRule() {
      this.showAddBox = true;
      this.curId = "";
      this.type = "PAGE_DISPLAY_RULE";
      this.$refs.addRules.createNewRule();
    },
    editRule(rule) {
      this.showAddBox = true;
      this.curId = rule.id;
      this.type = rule.ruleType;
      switch (this.type) {
        case "PAGE_DISPLAY_RULE":
          this.$refs.addRules.getRule(this.curId);
          break;
        case "DATA_INPUT_RULE":
          this.$refs.addDataRules.getDataRulesById(this.curId);
          break;
        case "DATA_BATCH_ADAPTATION_RULE":
          this.$refs.addDataBatchAdaptationRules.getRule(this.curId);
          break;
        case "DATA_CHANGE_RULE":
          this.$refs.addValueChangeRules.getRule(this.curId);
          break;
        case "DATA_CONNECTION_RULE":
          this.$refs.addDataAssociationRules.getRule(this.curId);
          break;
        case "DATA_FORMULA_RULE":
          this.$refs.addDataFormulaRules.getRule(this.curId);
          break;
        case "DATA_VALIDATION_RULE":
          this.$refs.addValidationRules.getRule(this.curId);
          break;
        case "DATA_LINKAGE_FORM_RULE":
          this.$refs.addDataLinkageFormRules.getRule(this.curId);
          break;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.addBox {
  background-color: #ffffff;
  overflow: auto;
  min-height: 80vh;
  max-height: 86vh;
  box-sizing: border-box;
  padding: 1em;
  .formBox {
    width: 64%;
    margin: 2em auto 0;
  }
}
.search-row {
  padding: 15px;
  line-height: 40px;
  height: 40px;
  box-sizing: content-box;
}
.search-box {
  margin-bottom: 13px;
}
.search-row > .el-col {
  margin-right: 30px;
  text-align: center;
}

.tools-bar {
  display: flex;
  justify-content: space-between;
}
</style>

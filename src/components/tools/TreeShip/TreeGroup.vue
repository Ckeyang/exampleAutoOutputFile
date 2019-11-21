<template>
  <div :class="pattern === 'NORMAL' ? 'treeGroup rop noWrap' : 'treeGroup noWrap'">
    <el-select
      size="mini"
      v-if="!showFirst"
      v-model="model.relationship"
      style="width:72px;position:absolute;left:-25px;top:0px;z-index:99999"
    >
      <el-option label="并且" value="AND"></el-option>
      <el-option label="或者" value="OR"></el-option>
    </el-select>
    <div class="item" v-for="(item, endex) in model.calculationExpressionList" :key="'A' + endex">
      <tree-item
        :shareList="shareList"
        :model.sync="item"
        :mode="mode"
        :pattern="pattern"
        :catogryType="catogryType"
        :fieldType="fieldType"
        :size="size"
        @editTags="editTags"
      ></tree-item>
    </div>
    <div class="operation-icon-t">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link" style="cursor:pointer">
          <el-button type="primary" :size="size">选择类型</el-button>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="addLeftBT">左括号</el-dropdown-item>
          <el-dropdown-item @click.native="addRightBT">右括号</el-dropdown-item>
          <el-dropdown-item v-if="mode === 'condition' && hasField(fieldType)" @click.native="addField">字段</el-dropdown-item>
          <el-dropdown-item @click.native="addOperater">操作符</el-dropdown-item>
          <el-dropdown-item @click.native="addShared">共享件</el-dropdown-item>
          <el-dropdown-item @click.native="addTags">标签值</el-dropdown-item>
          <el-dropdown-item
            v-if="mode !== 'condition' || (mode === 'condition' && !hasField(fieldType))"
            @click.native="showDialog = true"
            >系统参数</el-dropdown-item
          >
          <el-dropdown-item @click.native="addInput">固定值</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown trigger="click" v-show="pattern != 'FORMULA'">
        <span class="el-dropdown-link">
          <i class="iconfont icon-jibie"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="$emit('addGroup')">创建平级</el-dropdown-item>
          <el-dropdown-item v-if="createChild" @click.native="addChildGroup()">创建下级</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <i title="删除" class="iconfont icon-shanchu" @click="$emit('removeGroup', index)"></i>
    </div>
    <div class="childGroup" v-for="(item, jndex) in model.childList" :key="'B' + jndex">
      <tree-group
        :catogryType="catogryType"
        :model.sync="item"
        :index="jndex"
        :shareList="shareList"
        :mode="mode"
        :fieldType="fieldType"
        :class="{ lastOne: jndex === model.childList.length - 1 }"
        @addGroup="addGroup"
        :createChild="createChild"
        @removeGroup="removeGroup"
      ></tree-group>
    </div>
    <el-dialog :visible.sync="showDialog" width="20%" append-to-body title="系统参数">
      <el-form :model="modelItem" ref="modelItem" label-width="120px">
        <el-form-item label="数据来源" prop="dataSource">
          <el-select v-model="modelItem.dataSource" size="mini" @change="getTitle()">
            <el-option
              v-for="item in dataSourceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段" prop="fileName">
          <el-select v-model="modelItem.fileName" filterable size="mini">
            <el-option
              v-for="jtem in titleList"
              :value="jtem.id"
              :label="jtem.name"
              :key="jtem.id + '-' + modelItem.dataSource"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" size="small" @click="showDialog = false">取消</el-button>
        <el-button type="primary" size="small" @click="addSystem">确定</el-button>
      </span>
    </el-dialog>
    <tagComponent ref="tag" @submit="keepTag" :appendToBody="true" @close="saveTags"></tagComponent>
  </div>
</template>
<script>
import TreeItem from "./TreeItem.vue";
import tagComponent from "@/components/tools/tagComponent.vue";
// import { getTitle } from "./titleList.js";
export default {
  name: "TreeGroup",
  data() {
    return {
      showDialog: false,
      filterText: "",
      filterField: "",
      activeIndex: "1",
      dataList: [],
      tagAction: "",
      tagItem: {},
      titleList: [],
      keys: {
        CHEMISTRY: "化学类",
        BIOLOGY: "生物",
        POWER_FREQUENCY_ELECTRIC_FIELD: "工频电场",
        HAND_VIBRATION: "手传振动",
        MICROWAVE: "微波辐射",
        ULTRAVIOLET_RADIATION: "紫外辐射",
        HF_ELECTROMAGNETIC_FIELD: "高频电磁场",
        UHF_RADIATION: "超高频辐射",
        NOISES: "噪声",
        HIGH_TEMPERATURE: "高温",
        ILLUMINATION: "照度",
        OTHER: "其他",
        DISSOCIATE_SILICA: "游离"
      },
      filedTypeList: [
        { key: "ACCORDINGLIBRARY", value: "依据列表" },
        { key: "EVALUATIONMETHODLIBRARY", value: "方法列表" },
        { key: "MATERIALDATA", value: "物质列表" },
        { key: "EQUIPMENTLIST", value: "设备列表" },
        { key: "SAMPLINGMETHOD", value: "采样方式" },
        { key: "LIMITSPECIFIED", value: "限值规定" },
        { key: "SAMPLING_RECORD_LINKAGE_FORM", value: "采样记录联动数据表" },
        { key: "LABOUR_PROTECTION_FORM", value: "防护用品联动数据表" }
      ],
      dataSourceList:[],
      modelItem: {
        bracket: "NONE", //括号
        componentType: "SYSTEM_VARIABLE", //类型
        operator: "NONE", //操作符
        fixValue: "",
        fileName: "",
        values: [] //值
      },
      type: ""
    };
  },
  props: {
    shareList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    pattern: { type: String },
    catogryType: { type: String, default: "" },
    mode: { type: String, default: "judge" }, //judege,condition
    fieldType: { type: String, default: "SAMPLINGMETHOD" },
    model: { type: Object, default: {} },
    createChild: { type: Boolean },
    size: { type: String, default: "small" },
    index: { type: Number },
    showFirst: { type: Boolean, default: false }
  },
  watch: {
    filterField(val) {
      this.filterTitle(val);
    },
    showDialog() {
      this.filterText = "";
      this.type = "ACCORDINGLIBRARY";
      this.modelItem = {
        bracket: "NONE", //括号
        componentType: "SYSTEM_VARIABLE", //类型
        operator: "NONE", //操作符
        fixValue: "",
        dataSource: "",
        fileName: "",
        fieldType: this.fieldType,
        values: [] //值
      };
    },
    type(val) {
      this.filterText = "";
      this.modelItem = {
        bracket: "NONE", //括号
        componentType: "SYSTEM_VARIABLE", //类型
        operator: "NONE", //操作符
        fixValue: "",
        fieldType: this.fieldType,
        fileName: "",
        values: [] //值
      };
      // this.getDataList();
    },
    model: {
      handler(arr) {
        this.$emit("update:model", arr);
      },
      deep: true,
      immediate: true
    }
  },
  components: { TreeItem, tagComponent },
  created(){
    this.getDataSourceList();
  },
  methods: {
    
    // 获取数据来源列表
    getDataSourceList(){
      this.$http.sharedPartsRulesService.getDataSourceList().then(res =>{
        this.dataSourceList = res.data.filter(item=>{if(item.id!=='PROJECTDATA'){return item}}) || []
      })
    },
    addTags() {
      this.tagAction = "add";
      this.tagItem = { materialLabelIds: [], labelNames: [], industryLabelIds: [], customLabelIds: [], labelValues: [] };
      this.$refs.tag.openDialog();
    },
    editTags(item) {
      this.tagAction = "edit";
      this.tagItem = item;
      let { materialLabelIds, industryLabelIds, customLabelIds } = this.tagItem;
      this.$refs.tag.openDialog(materialLabelIds, industryLabelIds, customLabelIds);
    },
    keepTag(params, cb) {
      switch (params.labelType) {
        case "MATERIALLABEL":
          this.tagItem.materialLabelIds = params.labelIds;
          this.tagItem.labelNames = params.labelNames;
          this.mixTags();
          break;
        case "INDUSTRYLABEL":
          this.tagItem.industryLabelIds = params.labelIds;
          this.tagItem.labelNames = params.labelNames;
          this.mixTags();
          break;
        case "CUSTOMLABEL":
          this.tagItem.customLabelIds = params.labelIds;
          this.tagItem.labelNames = params.labelNames;
          this.mixTags();
          break;
      }
      cb();
    },
    mixTags() {
      this.tagItem.labelValues = this.tagItem.materialLabelIds.concat(
        this.tagItem.industryLabelIds,
        this.tagItem.customLabelIds
      );
    },
    // getTitleList(type) {
    //   this.getTitle(type);
    // },
    hasField(type) {
      let obj = this.filedTypeList.find(item => {
        if (item.key === type) {
          return item;
        }
      });
      return typeof obj === "undefined" ? false : true;
      // this.getTitle(type).length != 0 ? true : false;
    },
    getTitle() {
      if (!this.modelItem.dataSource) {
        return;
      }
      this.modelItem.fileName = "";
      this.$http.sharedPartsRulesService.getSystemFileds({ dataSourceEnum: this.modelItem.dataSource ,bigCategoryId:this.catogryType}).then(res => {
        this.titleList = res.data;
      });
    },
    filterTitle() {
      if (!this.filterField) {
        return this.titleList;
      } else {
        let list = this.titleList.filter(item => {
          if (item.name.indexOf(this.filterField) != -1) {
            return item;
          }
        });
        return list;
      }
    },
    getHeader(h, para) {
      let $index = para.$index;
      let list = this.filterTitle();
      return h("span", [
        h("i", {
          class: "el-icon-check",
          style: { padding: "0 .5em", color: "#26beff" },
          on: {
            click: () => {
              this.getAllParams(list[$index].key);
            }
          }
        }),
        h("span", {}, list[$index].name)
      ]);
    },
    getAllParams(key) {
      this.dataList.map(item => {
        if (item[key]) {
          typeof item[key] === "string"
            ? this.modelItem.values.push(item[key])
            : (this.modelItem.values = this.modelItem.values.concat(item[key]));
        }
      });
      this.addSystem();
    },
    getDataList() {
      switch (this.type) {
        case "ACCORDINGLIBRARY":
          this.getBasisBankList();
          break;
        case "EVALUATIONMETHODLIBRARY":
          this.getEvaluateBankList();
          break;
        case "MATERIALDATA":
          this.getMaterialList();
          break;
        case "EQUIPMENTLIST":
          this.getDeviceList();
          break;
        case "SAMPLINGMETHOD":
          this.getExampleList();
          break;
      }
    },
    getBasisBankList() {
      this.$http.sharedPartsRulesService.getBasisBankList({ keyWords: this.filterText }).then(res => {
        this.dataList = res.data;
      });
    },
    getEvaluateBankList() {
      this.$http.sharedPartsRulesService.getevaluateBankList({ keyWords: this.filterText }).then(res => {
        this.dataList = res.data;
      });
    },
    getMaterialList() {
      this.$http.sharedPartsRulesService.getMaterialtList({ keyWords: this.filterText }).then(res => {
        this.dataList = res.data;
      });
    },
    getDeviceList() {
      this.$http.sharedPartsRulesService.getDeviceList({ keyWords: this.filterText }).then(res => {
        this.dataList = res.data;
      });
    },
    getExampleList() {
      this.$http.sharedPartsRulesService.getExampletList({ keyWords: this.filterText }).then(res => {
        this.dataList = res.data;
      });
    },
    choise(params) {
      typeof params === "string" ? (this.modelItem.values = [params]) : (this.modelItem.values = params);
      this.addSystem();
    },
    setType(params) {
      this.type = params;
    },
    addLeftBT() {
      this.model.calculationExpressionList.push({
        bracket: "LEFT", //括号
        componentType: "BRACKET", //类型
        operator: "NONE", //操作符
        fixValue: "",
        values: [] //值
      });
    },
    addRightBT() {
      this.model.calculationExpressionList.push({
        bracket: "RIGHT", //括号
        componentType: "BRACKET", //类型
        operator: "NONE", //操作符
        fixValue: "",
        values: [] //值
      });
    },
    addField() {
      this.model.calculationExpressionList.push({
        bracket: "NONE", //括号
        componentType: "FIELD", //类型
        operator: "NONE", //操作符
        fixValue: "",
        fieldType: this.fieldType,
        fieldValue: "",
        values: [] //值
      });
    },
    addOperater() {
      this.model.calculationExpressionList.push({
        bracket: "NONE", //括号
        componentType: "OPERATOR", //类型
        operator: "NONE", //操作符
        fixValue: "",
        values: [] //值
      });
    },
    addShared() {
      this.model.calculationExpressionList.push({
        bracket: "NONE", //括号
        componentType: "SHARE_COMPONENT", //类型
        operator: "NONE", //操作符
        fixValue: "",
        values: [] //值
      });
    },
    addSystem() {
      if (this.modelItem.dataSource === "" || this.modelItem.fileName === "") {
        this.$message.error("请填写完整再提交");
        return;
      }
      this.showDialog = false;
      let params = {
        bracket: "NONE", //括号
        componentType: "SYSTEM_VARIABLE", //类型
        operator: "NONE", //操作符
        dataSource: this.modelItem.dataSource,
        fixValue: "",
        fileName: this.modelItem.fileName
      };
      this.model.calculationExpressionList.push(params);
    },
    saveTags() {
      if (this.tagAction === "add") {
        let params = {
          bracket: "NONE",
          componentType: "LABEL",
          operator: "NONE" //操作符
        };
        let obj = Object.assign(params, this.tagItem);
        this.model.calculationExpressionList.push(obj);
      }
    },
    addInput() {
      this.model.calculationExpressionList.push({
        bracket: "NONE", //括号
        componentType: "FIXED_VALUE", //类型
        operator: "NONE", //操作符
        fixValue: "",
        values: [] //值
      });
    },
    addGroup() {
      this.model.childList.push({
        calculationExpressionList: [],
        childList: [],
        relationship: "AND" //关系
      });
    },
    removeGroup(index) {
      this.model.childList.splice(index, 1);
    },
    addChildGroup() {
      this.model.childList.push({
        calculationExpressionList: [],
        childList: [],
        relationship: "AND" //关系
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.tableBox {
  width: 100%;
  max-height: 400px;
  overflow: auto;
  padding: 1em;
  box-sizing: border-box;
  .toolBox {
    text-align: right;
  }
}
.menu {
  border-right: 1px solid #e6ecf5;
  height: 400px;
  .active {
    background-color: #26beff;
    color: #ffffff;
  }
  li {
    display: block;
    margin: 0.2em 0;
    width: 80%;
    padding: 0.6em 1em;
    box-sizing: border-box;
    text-align: left;
    color: #3c4551;
    border-radius: 6px;
    cursor: pointer;
  }
  li:hover {
    background-color: #26beff;
    color: #ffffff;
  }
}
.operation-icon-t {
  display: inline-block;
}
.operation-icon-t i.iconfont {
  cursor: pointer;
  font-size: 12px;
  padding: 0 5px;
  border-radius: 3px;
  transition: all 0.3s;
  display: inline-block;
  font-weight: normal !important;
}
.noWrap {
  white-space: nowrap;
  display: inline-block;
}
.treeGroup {
  width: 100%;
  padding: 2.5em 0;
  position: relative;
  .item {
    display: inline-block;
  }
  // border-left: 1px solid #d5e0ed;
}
.childGroup {
  padding-left: 5em;
}
.rop::before {
  content: "";
  display: inline-block;
  width: 2em;
  border-bottom: 1px solid #d5e0ed;
}
.rop::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  border-left: 1px solid #d5e0ed;
}
.treeGroup::before {
  content: "";
  display: inline-block;
  width: 2em;
  border-bottom: 1px solid #d5e0ed;
}
.treeGroup::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  border-left: 1px solid #d5e0ed;
}
.lastOne:after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  height: 60px;
  bottom: 0;
  border-left: 1px solid #d5e0ed;
}
</style>

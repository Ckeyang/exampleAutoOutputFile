<template>
  <div class="treeItem" v-if="isShow">
    <!--  OPERATOR("运算符"),
            SHARE_COMPONENT("共享件"),
            SYSTEM_VARIABLE("系统变量"),
            FIXED_VALUE("固定值"),
            BRACKET("括号");
    -->
    <!-- 括号 -->
    <span v-if="model.componentType === 'BRACKET'">{{ model.bracket === "LEFT" ? "(" : ")" }}</span>
    <!-- 括号 -->
    <span v-if="model.componentType === 'LABEL'">
     {{ model.labelNames.join(",").substr(0,6)+'...' }} <i class="iconfont icon-bianji" @click="editTags"></i
    ></span>
    <!-- 操作符 -->
    <el-select v-if="model.componentType === 'OPERATOR'" style="width:90px" v-model="model.operator" filterable :size="size">
      <el-option
        v-for="(jtem, jndex) in pattern === 'FORMULA' ? formula : opreatList"
        :value="jtem.key"
        :label="jtem.value"
        :key="jndex"
      ></el-option>
    </el-select>
    <el-select v-if="model.componentType === 'FIELD'" style="width:80px" v-model="model.fieldValue" filterable :size="size">
      <el-option v-for="(jtem, jndex) in titleList" :value="jtem.id" :label="jtem.name" :key="jndex"></el-option>
    </el-select>
    <!-- 固定值 -->
    <el-input v-if="model.componentType === 'FIXED_VALUE'" style="width:100px" v-model="model.fixValue" :size="size"></el-input>
    <!-- 共享件 -->
    <el-select
      ref="select"
      v-if="model.componentType === 'SHARE_COMPONENT'"
      style="width:100px"
      filterable
      v-model="model.shareComponentId"
      :size="size"
    >
      <el-option v-for="(jtem, jndex) in shareList" :key="jndex" :value="jtem.id" :label="jtem.name"></el-option>
    </el-select>
    <!-- 系统参数 -->
    <el-select
      ref="selectTitle"
      v-if="model.componentType === 'SYSTEM_VARIABLE'"
      style="width:100px"
      v-model="model.fileName"
      filterable
      :size="size"
    >
      <el-option v-for="(jtem, jndex) in titleList" :value="jtem.id" :label="jtem.name" :key="jndex"></el-option>
    </el-select>
    <!-- <span
      v-if="model.componentType==='SYSTEM_VARIABLE'"
      class="systemText"
    >{{model.values.join(' ')}}</span> -->
    <!-- 操作选择按钮 -->
    <!-- <el-select style="width:120px" :size="size" @change="chooseAction">
        <el-option></el-option>
    </el-select>-->
  </div>
</template>
<script>
import { getTitle } from "./titleList.js";
import { setTimeout } from "timers";
export default {
  name: "TreeItem",
  data() {
    return {
      titleList: [],
      isShow: true,
      opreatList: [
        { key: "NONE", value: "请选择" },
        {
          key: "PLUS",
          value: "+"
        },
        {
          key: "MINUS",
          value: "-"
        },
        {
          key: "MUL",
          value: "x"
        },
        {
          key: "DIVIDE",
          value: "÷"
        },
        {
          key: "EQUAL",
          value: "="
        },
        {
          key: "GT",
          value: ">"
        },
        {
          key: "LT",
          value: "<"
        },
        {
          key: "GT_EQUAL",
          value: ">="
        },
        {
          key: "LT_EQUAL",
          value: "<="
        },
        {
          key: "NOT_EQUAL",
          value: "≠"
        },
        {
          key: "CONTAINS",
          value: "字符包含"
        },
        {
          key: "VALUE_CONTAINS",
          value: "值包含"
        },
        {
          key: "NOT_CONTAINS",
          value: "字符不包含"
        },
        {
          key: "NOT_VALUE_CONTAINS",
          value: "值不包含"
        },
        {
          key: "IS_EMPTY",
          value: "为空"
        },
        {
          key: "IS_NOT_EMPTY",
          value: "不为空"
        }
      ],
      formula: [
        {
          key: "NONE",
          value: "请选择"
        },
        {
          key: "PLUS",
          value: "+"
        },
        {
          key: "MINUS",
          value: "-"
        },
        {
          key: "MUL",
          value: "x"
        },
        {
          key: "DIVIDE",
          value: "÷"
        }
      ],
      shartList: []
    };
  },
  props: {
    shareList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    fieldType: { type: String },
    pattern: { type: String },
    model: { type: Object, default: {} },
    catogryType: { type: String, default: "" },
    size: { type: String, default: "small" }
  },
  watch: {
    model: {
      handler(val) {
        this.$emit("update:model", val);
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.model.componentType === "SYSTEM_VARIABLE" ? this.getTitleList(true) : null;
    this.model.componentType === "FIELD" ? this.getTitleList(true) : null;
    // ['SYSTEM_VARIABLE','FIELD'].indexOf()!==-1?this.getTitleList(this.model.dataSource):null;
    // model.componentType===?this.getTitleList(type):;
  },
  methods: {
    editTags() {
      this.$emit("editTags", this.model);
    },
    getTitleList(flag = false) {
      if (this.$refs.selectTitle) {
        this.$refs.selectTitle.cachedOptions = [];
      }
      // return getTitle(type);
      let type = "";
      this.model.componentType === "SYSTEM_VARIABLE" ? (type = this.model.dataSource) : (type = this.fieldType);
      this.$http.sharedPartsRulesService.getSystemFileds({ dataSourceEnum: type , bigCategoryId:this.catogryType}).then(res => {
        this.titleList = res.data;
      });
    }
  },
  beforeDestroy() {
    this.isShow = false;
  }
};
</script>
<style lang="scss" scoped>
.treeItem {
  display: inline-block;
  font-size: 14px;
  padding: 0 0.3em;
  .systemText {
    display: inline-block;
    width: 80px;
    padding: 0 0.5em;
    line-height: 0.9;
    overflow: hidden;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .labelNames {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

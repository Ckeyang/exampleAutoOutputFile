<template>
  <div>
    <div class="toolbox">
      <el-popover
        v-show="formulaList.length !== 0"
        v-model="formulaDialog"
        placement="bottom"
        title="操作符"
        width="400"
        trigger="click"
      >
        <div style="text-align:center">
          <div class="componentBox" v-for="(item, index) in formulaList" :key="index">
            <span class="cursor" @click="insertFormula(item)">{{ item.displayValue }}</span>
          </div>
        </div>
        <el-button slot="reference" size="small">插入操作符</el-button>
      </el-popover>
      <!-- <el-popover v-show="shareList.length !== 0" placement="bottom" title="共享件" width="200" trigger="click">
        <div>
          <el-col :span="6" v-for="(item, index) in shareList" :key="index">
            <span class="cursor" @click="insertShareComponent(item)">{{ item.name }}</span>
          </el-col>
        </div>
        <el-button slot="reference" size="small">插入共享件</el-button>
      </el-popover> -->
      <el-button size="small" v-show="showSharePart" @click="insertShareComponent">插入共享件</el-button>
      <el-popover
        v-show="componentList.length !== 0"
        v-model="componentDialog"
        placement="bottom"
        title="控件"
        width="500"
        trigger="click"
      >
        <div style="text-align:left;height:400px;overflow:auto">
          <div class="componentBox" v-for="(item, index) in componentList" :key="index">
            <span class="cursor" :title="item.tag" @click="insertComponent(item)">{{ item.tag }}</span>
          </div>
        </div>
        <el-button slot="reference" size="small">插入控件</el-button>
      </el-popover>
    </div>
    <div class="pallte">
      <wangEditor
        editorId="formulaRule"
        ref="formulaRule"
        v-model="formulaString"
        :height="height"
        :isDisabledToolbar="false"
      ></wangEditor>
    </div>
    <searchSharePart isRadio @change="getCheckShareParts" ref="formulaSharePart" />
  </div>
</template>
<script>
import wangEditor from "../wangEditor/wangEditor.vue";
import searchSharePart from "@/views/reportRules/components/searchSharePart.vue";
export default {
  name: "formulaRule",
  props: {
    showSharePart: { type: Boolean, default: true },
    formulaList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    componentList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    value: { type: String },
    height: { type: String, default: "150px !important" }
  },
  components: { wangEditor, searchSharePart },
  data() {
    return {
      componentDialog: false,
      formulaDialog: false,
      filterTag: "",
      formulaString: ""
    };
  },
  watch: {
    formulaString(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.formulaString = val;
    }
  },
  created() {
    this.formulaString = this.value;
  },
  methods: {
    filterComponent() {
      return this.componentList.filter(item => {
        if (item.tag.indexOf("filterTag") != -1) {
          return item;
        }
      });
    },
    setDefaultValue() {
      this.formulaString = this.value;
      this.$refs.formulaRule.setDefaultValue(this.formulaString);
    },
    insertComponent(data) {
      this.componentDialog = false;
      this.$refs.formulaRule.addHtml("<span style='color:red' fieldid='" + data.fieldId + "'>" + data.tag + "</span>&nbsp;");
      this.$emit("changeComponentId", data.parentId);
    },
    insertShareComponent() {
      this.$refs.formulaSharePart.openDialog([]);
      // this.$refs.formulaRule.addHtml("<span style='color:red' fieldid='" + item.id + "'>" + item.name + "</span>");
    },
    getCheckShareParts(data) {
      const item = data.pop();
      this.$refs.formulaRule.addHtml("<span style='color:red' fieldid='" + item.id + "'>" + item.name + "</span>&nbsp;");
    },
    insertFormula(item) {
      this.formulaDialog = false;
      this.$refs.formulaRule.addHtml("<span>" + item.selectValue + "</span>");
    }
  }
};
</script>
<style lang="scss" scoped>
.toolbox {
  margin-bottom: 1em;
}
.cursor {
  cursor: pointer;
}
.componentBox {
  width: 24%;
  margin-left: 1%;
  margin-top: 1em;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

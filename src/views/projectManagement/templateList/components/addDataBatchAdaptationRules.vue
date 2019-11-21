<template>
  <div>
    <el-form ref="form" :model="rule" :rules="rules" label-position="left" label-width="120px">
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="rule.name"></el-input>
      </el-form-item>
      <el-form-item label="规则描述" prop="description">
        <el-input v-model="rule.description"></el-input>
      </el-form-item>
      <el-form-item label="触发条件" prop="triggerConditions">
        <div class="groupBox">
          <div class="groupTitle">
            条件
            <span class="tool" @click="show = !show">
              {{ show ? "收起" : "展开" }}&nbsp;&nbsp;
              <i :class="{ 'iconfont icon-shang': show, 'iconfont icon-xia': !show }"></i>
            </span>
          </div>
          <transition name="el-zoom-in-top">
            <div class="toolBox" v-show="show">
              符合以下条件
              <span>
                <el-button size="mini" icon="el-icon-delete" @click="cleanGroup">清除所有条件</el-button>
                <el-button size="mini" type="success" icon="el-icon-plus" @click="addGroup">新建分组</el-button>
              </span>
              <group
                :componentList="componentList"
                :componentId="componentId"
                @changeComponentId="changeComponentId"
                v-for="(item, index) in rule.triggerConditions"
                @connectGroup="connectGroup"
                @removeGroup="removeGroup"
                :key="index"
                :index="index"
                :model.sync="item"
              ></group>
              <!-- <div class="descriptBox">
                <span>描述</span>
                <div v-html="getDescript()"></div>
              </div>-->
            </div>
          </transition>
        </div>
      </el-form-item>

      <el-form-item label="适配数据" prop="adaptationColumn">
        <el-select v-model="rule.adaptationColumn" filterable multiple style="width:100%">
          <el-option
            v-for="(item, i) in componentListB"
            :key="item.componentAttr.fieldId + '-' + i"
            :value="item.componentAttr.fieldId"
            :label="item.componentAttr.tag"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适配数据范围" prop="adaptationScope">
        <el-select v-model="rule.adaptationScope" filterable multiple style="width:100%">
          <el-option
            v-for="(item, i) in componentListB"
            :key="item.componentAttr.fieldId + '-' + i"
            :value="item.componentAttr.fieldId"
            :label="item.componentAttr.tag"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="不自动生成数据" prop="notGenerateData">
        <el-select v-model="rule.notGenerateData" filterable multiple style="width:100%">
          <el-option
            v-for="(item, i) in componentListC"
            :key="item.componentAttr.fieldId + '-' + i"
            :value="item.componentAttr.fieldId"
            :label="item.componentAttr.tag"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button @click="displayBox()">取消</el-button>&nbsp;&nbsp;
        <el-button type="primary" @click="save()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import group from "./group.vue";
export default {
  name: "addDataBatchAdaptationRules",
  data() {
    return {
      show: true,
      ruleId: "",
      componentId: "",
      componentList: [],
      componentListB: [],
      componentListC: [],
      rule: {
        adaptationColumn: [],
        adaptationScope: [],
        componentId: "",
        connectionFormId: "",
        description: "",
        name: "",
        notGenerateData: [],
        templateId: "",
        triggerConditions: []
      },
      rules: { name: { required: true, message: "必填" }, triggerConditions: { validator: this.checkGroup } }
    };
  },
  components: { group },
  props: {
    templateId: String,
    visible: { type: Boolean, default: false }
  },
  computed: {
    isCheckedAllFillable() {
      return !this.rule.ruleConfig.ruleFields.some(item => item.fillable === false);
    },
    isCheckedAllVisible() {
      return !this.rule.ruleConfig.ruleFields.some(item => item.visible === false);
    }
  },
  watch: {
    rule: {
      handler(val) {
        this.getComponents();
      },
      deep: true,
      immediate: true
    }
  },
  activated() {
    this.getComponents();
    // this.ruleId ? this.getRule() : this.createNewRule();
  },
  methods: {
    checkGroup(rule, value, callback) {
      if (value) {
        let flag = false;
        let list = [];
        value.map(item => {
          list = list.concat(item.expressions);
        });
        list.map(item => {
          if (!item.rightSide) {
            flag = true;
          }
        });
        if (flag) {
          callback(new Error("值不能为空"));
        } else {
          callback();
        }
      } else {
        callback();
      }
      // return flag;
    },
    setVisible(item) {
      if (item.fillable) {
        item.visible = true;
      }
    },
    setFillAble(item) {
      if (!item.visible) {
        item.fillable = false;
      }
    },
    changeComponentId(id) {
      this.rule.componentId = id;
      this.getComponents();
    },

    getComponents() {
      // this.$http.templateServicethis.templateId
      this.$http.ruleService
        .getComponents(this.templateId, {
          componentId: this.rule.componentId
        })
        .then(res => {
          this.componentList = res.data;
        })
        .then(this.getComponentsB)
        .then(this.getComponentsC);
    },
    getComponentsB() {
      this.$http.ruleService.getComponentsWithChild(this.templateId, this.rule.componentId || "0").then(res => {
        this.componentListB = res.data;
      });
    },
    getComponentsC() {
      this.$http.ruleService.getComponentsIsCustomerNumber(this.templateId, this.rule.componentId || "0").then(res => {
        this.componentListC = res.data;
      });
    },
    getDescript() {
      let result = "";
      let i = 1;
      this.rule.triggerConditions.map(item => {
        result += "组" + i + "(";
        item.expressions.map(item => {
          result +=
            "(" +
            (item.leftSide ? (item.leftSide.length > 10 ? "参数A" : item.leftSide) : "") +
            "" +
            item.operator +
            "" +
            (item.rightSide ? (item.rightSide.length > 10 ? "参数B" : item.rightSide) : "") +
            ")" +
            (item.next.connectionType === "AND" ? "并且" : "或者");
        });
        result += ")" + (item.next.connectionType === "AND" ? "并且" : "或者") + "<br/>";
        i++;
      });
      return result;
    },
    connectGroup() {
      let length = this.rule.triggerConditions.length;
      let i = 0;
      while (true) {
        if (i === length) {
          break;
        }
        this.rule.triggerConditions[i].next.connectionType = this.rule.triggerConditions[i + 1]
          ? this.rule.triggerConditions[i + 1].previous.connectionType
          : "AND";
        this.rule.triggerConditions[i].next.id = this.rule.triggerConditions[i + 1] ? this.rule.triggerConditions[i + 1].id : "";
        this.rule.triggerConditions[i + 1]
          ? (this.rule.triggerConditions[i + 1].previous.id = this.rule.triggerConditions[i].id)
          : null;
        i++;
      }
    },
    cleanGroup() {
      this.rule.triggerConditions = [];
      this.rule.componentId = "";
    },
    addGroup() {
      this.rule.triggerConditions.push({
        expressions: [],
        id: this.getRoundId(),
        next: { connectionType: "AND", id: "" },
        previous: { connectionType: "AND", id: "" }
      });
      this.connectGroup();
    },
    removeGroup(index) {
      this.rule.triggerConditions.splice(index, 1);
      if (this.rule.triggerConditions.length === 0) {
        this.rule.componentId = "";
      }
    },
    getRoundId() {
      let times = new Date().getTime();
      let random = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
      return times + "" + random;
    },
    createNewRule(id = "") {
      this.ruleId = id;
      this.rule = {
        adaptationColumn: [],
        adaptationScope: [],
        componentId: "",
        connectionFormId: "",
        description: "",
        name: "",
        notGenerateData: [],
        templateId: "",
        triggerConditions: []
      };
      this.$refs["form"].resetFields();
    },
    getRule(ruleId) {
      this.ruleId = ruleId;
      this.$http.ruleService
        .getRuleById(ruleId)
        .then(res => {
          this.rule = res.data;
          // this.changeComponentId(this.rule.ruleConfig.ruleFields[0].id);
        })
        .then(this.getComponents);
    },
    displayBox() {
      this.$emit("update:visible", false);
    },
    save() {
      this.connectGroup();
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.ruleId ? this.updateRule() : this.createRule();
        }
      });
    },
    updateRule() {
      this.$http.ruleService.updateDataBatchAdaptationRule(this.ruleId, this.rule).then(this.displayBox);
    },
    createRule() {
      this.rule.templateId = this.templateId;
      this.$http.ruleService.createDataBatchAdaptationRule(this.rule).then(this.displayBox);
    },

    // //自定义表头
    renderheaderFillable(h, { column }) {
      return h("el-checkbox", {
        props: {
          label: "可填",
          value: this.isCheckedAllFillable
        },
        on: {
          change: (checked, e) => {
            this.rule.ruleConfig.ruleFields.map(item => {
              item.fillable = checked;
              checked && (item.visible = true); //可填必定可见
            });
          }
        },
        class: "cus-fillable-checkbox"
      });
    },
    renderheaderVisible(h, { column }) {
      return h("el-checkbox", {
        props: {
          label: "可见",
          value: this.isCheckedAllVisible
        },
        on: {
          change: (checked, e) => {
            this.rule.ruleConfig.ruleFields.map(item => {
              item.visible = checked;
              checked || (item.fillable = false); //不可见必定不可填
            });
          }
        },
        class: "cus-visible-checkbox"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.addBox {
  background-color: #ffffff;
  overflow: auto;
  height: 80vh;
  box-sizing: border-box;
  padding: 1em;
  .groupBox {
    width: 100%;
    box-sizing: border-box;
    border:1px solid #dcdfe6;
    border-radius: 6px;
    .groupTitle {
      font-size: 12px;
      font-weight: bold;
      padding: 1em 1em .5em 1em;
      position: relative;
      border-bottom: 1px solid #e6f0fc;
      .tool {
        cursor: pointer;
        position: absolute;
        right: 2em;
        color: #1890ff;
        i {
          font-size: 4px;
        }
      }
    }
    .toolBox {
      padding: 1em;
      color: #3c4551;
      > span {
        float: right;
      }
    }
    .descriptBox {
      > span {
        color: #3c4551;
      }
      > div {
        padding: 1em;
        border: 1px solid #d5e0ed;
        color: #3c4551;
        border-radius: 6px;
      }
    }
  }
  .shezhi {
    width: 100%;
  }
  .formBox {
    width: 50%;
    margin: 2em auto 0;
  }
  .table-title {
    margin-bottom: 15px;
  }
  .tools-bar {
    display: flex;
    justify-content: space-between;
  }
  .table-title::before {
    content: "";
    display: inline-block;
    width: 2px;
    height: 30px;
    position: absolute;
    left: -1px;
    top: 12px;
    z-index: 999;
    background-color: #fc5a4c;
  }
}
</style>

<template>
  <div>
    <el-form ref="form" :model="rule" :rules="rules" label-position="left" label-width="120px">
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="rule.name"></el-input>
      </el-form-item>
      <el-form-item label="规则描述" prop="description">
        <el-input v-model="rule.description"></el-input>
      </el-form-item>
      <el-form-item label="触发控件" prop="controlId">
        <el-select style="width:100%" filterable v-model="rule.controlId" @change="changeComponentId">
          <el-option
            v-for="(item, index) in componentListA"
            :key="index"
            :value="item.fieldId"
            :label="item.tag"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="值改变时满足以下条件" prop="triggerConditions">
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
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-plus"
                  :disabled="this.rule.componentId === ''"
                  @click="addGroup"
                  >新建分组</el-button
                >
              </span>
              <group
                :componentList="componentList"
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
              </div> -->
            </div>
          </transition>
        </div>
      </el-form-item>
      <el-form-item label="触发事件">
        <el-radio-group v-model="rule.ruleConfigType">
          <el-radio label="Single">设置值</el-radio>
          <el-radio label="Batch">批量设置值</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="录入数据" v-show="rule.ruleConfigType === 'Single'">
        <ul class="rules-item_box">
          <li class="rules-item" v-for="(item, index) in rule.ruleConfig.ruleFields" :key="index">
            <el-select filterable v-model="item.id" size="mini">
              <el-option
                v-for="(item, index) in componentListA"
                :key="index"
                :value="item.fieldId"
                :label="item.tag"
              ></el-option>
            </el-select>
            <span>&nbsp;&nbsp;值&nbsp;&nbsp;</span>
            <el-select
              filterable
              v-if="isSelect(item)"
              size="mini"
              style="width:120px"
              @change="setDataId(item)"
              v-model="item.value"
            >
              <el-option
                v-for="(item, index) in getSelect(item)"
                :key="index"
                :value="item.choiceValue"
                :label="item.choiceValue"
              ></el-option>
            </el-select>
            <el-input v-if="!isSelect(item)" v-model="item.value" size="mini" style="width:120px"></el-input>
            <div style="width:80px;">
              <i class="iconfont icon-jia" @click="addComponentIds(index)"></i>
              <i class="iconfont icon-jian" @click="deleteComponentIds(index)" v-if="index > 0"></i>
            </div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="选择关联规则" v-show="rule.ruleConfigType === 'Batch'">
        <el-select filterable v-model="rule.dataConnectionRuleId" size="mini" @change="getConnectFromId">
          <el-option v-for="(f, index) in ruleList" :label="f.dataConnectionRule.name" :value="f.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批量设置数据" v-show="rule.ruleConfigType === 'Batch'">
        <ul class="rules-item_box">
          <li class="rules-item" v-for="(item, index) in rule.ruleConfig.ruleFields" :key="index">
            <el-select filterable v-model="item.id" size="mini">
              <el-option v-for="(j, index) in componentListB" :key="index" :value="j.fieldId" :label="j.tag"></el-option>
            </el-select>
            <span>&nbsp;&nbsp;值&nbsp;&nbsp;</span>
            <!-- <el-select v-model="item.testt" size="mini">
              <el-option label="选中值" value="testt"></el-option>
              <el-option label="值" value="testt"></el-option>
            </el-select>-->
            <el-select filterable v-if="isSelect(item)" size="mini" style="width:120px" v-model="item.value">
              <el-option
                v-for="(j, index) in getSelect(item)"
                :key="index"
                :value="j.choiceValue"
                :label="j.choiceValue"
              ></el-option>
            </el-select>
            <el-input v-if="!isSelect(item)" v-model="item.value" size="mini" style="width:120px"></el-input>
            <div style="width:80px;">
              <i class="iconfont icon-jia" @click="addComponentIds()"></i>
              <i class="iconfont icon-jian" @click="deleteComponentIds(index)" v-if="index > 0"></i>
            </div>
          </li>
        </ul>
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
  name: "addRules",
  data() {
    return {
      show: true,
      ruleId: "",
      showSetting: false,
      componentId: "",
      componentList: [],
      componentListA: [],
      componentListB: [],
      ruleList: [],
      rule: {
        controlId: "",
        dataConnectionRuleId: "",
        description: "",
        name: "",
        componentId: "",
        ruleConfig: {
          ruleFields: [{}]
        },
        ruleConfigType: "Single",
        templateId: "",
        triggerConditions: []
      },
      rules: {
        name: { required: true, message: "必填" },
        triggerConditions: { validator: this.checkGroup },
        controlId: { required: true, message: "必填" }
      }
    };
  },
  components: { group },
  props: {
    templateId: String,
    visible: { type: Boolean, default: false }
  },
  watch: {
    rule: {
      handler(val) {
        // this.connectExpression();
        // this.$emit('update:model', val);
        // this.$emit('update:model', val);
        this.rule.triggerConditions === [] ? (this.rule.componentId = "") : null;
        this.getComponents();
      },
      deep: true,
      immediate: true
    },
    showSetting(val) {
      val ? this.createRuleFields() : null;
    }
  },
  activated() {
    this.getComponents();
    // this.ruleId ? this.getRule() : this.createNewRule();
  },
  methods: {
    setDataId(item) {
      let obj = this.componentListB
        .find(j => {
          if (j.fieldId === item.id) {
            return j;
          }
        })
        .choiceItemsChoiceBox.find(j => {
          if (j.choiceValue === item.value) {
            return j;
          }
        });
      item.dataId = obj.choiceId;
    },
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
    isSelect(item) {
      let obj = this.componentListB.find(j => {
        if (
          j.fieldId === item.id &&
          (j.componentType === "CHECKBOX" ||
            j.componentType === "RADIOBOX" ||
            j.componentType === "COMBOBOX" ||
            j.componentType === "MULTIPLE_COMBOBOX") &&
          j.choiceDynamicDataConfig.choiceDynamicDataType != "FORM_DATA"
        ) {
          return j;
        }
      });
      return obj ? true : false;
    },
    getSelect(item) {
      let obj = this.componentListB.find(j => {
        if (j.fieldId === item.id) {
          return j;
        }
      });
      return obj ? obj.choiceItemsChoiceBox : [];
    },
    getConnectFromId() {
      let obj = this.ruleList.find(item => {
        if (item.id === this.rule.dataConnectionRuleId) {
          return item;
        }
      });
      this.rule.connectionFormId = obj.dataConnectionRule.connectionFormId;
      this.getComponentsB();
    },
    addComponentIds() {
      this.rule.ruleConfig.ruleFields.push({});
    },
    deleteComponentIds(index) {
      this.rule.ruleConfig.ruleFields.splice(index, 1);
    },
    changeComponentId() {
      let obj = this.componentListA.find(item => {
        if (item.fieldId === this.rule.controlId) {
          return item;
        }
      });
      this.rule.componentId = obj.parentId;
      this.rule.triggerConditions = [];
      this.getComponents();
    },
    createRuleFields() {
      if (this.rule.ruleConfig.ruleFields.length === 0) {
        this.componentList.map(item => {
          this.rule.ruleConfig.ruleFields.push({
            id: item.fieldId,
            name: item.tag,
            fillable: false,
            visible: false
          });
        });
      } else {
        let flag = this.rule.ruleConfig.ruleFields.find(item => {
          if (this.componentList[0].fieldId === item.id) {
            return true;
          }
        });
        if (!flag || this.rule.ruleConfig.ruleFields.length != this.componentList.length) {
          this.rule.ruleConfig.ruleFields = [];
          this.componentList.map(item => {
            this.rule.ruleConfig.ruleFields.push({
              id: item.fieldId,
              name: item.tag,
              fillable: false,
              visible: false
            });
          });
        }
      }
    },
    getRules() {
      this.$http.ruleService.getRuleByType(this.templateId, "DATA_CONNECTION_RULE").then(res => {
        this.ruleList = res.data || [];
      });
    },
    getComponents() {
      // this.$http.templateServicethis.templateId
      this.$http.ruleService
        .getComponents(this.templateId, {
          componentId: this.rule.componentId
        })
        .then(res => {
          this.componentList = res.data || [];
        }).then(this.getComponentsB).then(this.getComponentsA);
    },
    getComponentsB() {
      this.$http.ruleService
        .getComponents(this.templateId, {
          componentId: this.rule.connectionFormId
        })
        .then(res => {
          this.componentListB = res.data || [];
        });
    },
    getComponentsA() {
      this.$http.ruleService
        .getComponents(this.templateId, {
          componentId: ""
        })
        .then(res => {
          this.componentListA = res.data || [];
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
        this.rule.triggerConditions[i].next.id = this.rule.triggerConditions[i + 1]
          ? this.rule.triggerConditions[i + 1].id
          : "";
        this.rule.triggerConditions[i + 1]
          ? (this.rule.triggerConditions[i + 1].previous.id = this.rule.triggerConditions[i].id)
          : null;
        i++;
      }
    },
    cleanGroup() {
      this.rule.triggerConditions = [];
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
    },
    getRoundId() {
      let times = new Date().getTime();
      let random = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
      return times + "" + random;
    },
    createNewRule(id = "") {
      this.ruleId = id;
      this.rule = {
        controlId: "",
        dataConnectionRuleId: "",
        description: "",
        name: "",
        componentId: "",
        ruleConfig: {
          ruleFields: [{}]
        },
        ruleConfigType: "Single",
        templateId: "",
        triggerConditions: []
      };
      this.getComponentsB();
      this.getRules();
      this.$refs["form"].resetFields();
    },
    getRule(ruleId) {
      this.ruleId = ruleId;
      this.$http.ruleService
        .getRuleById(this.ruleId)
        .then(res => {
          this.rule = res.data;
          // this.changeComponentId(this.rule.ruleConfig.ruleFields[0].id);
        })
        .then(this.getComponents)
        .then(this.getComponentsB)
        .then(this.getRules);
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
      this.$http.ruleService.updateDataChangeRule(this.ruleId, this.rule).then(this.displayBox);
    },
    createRule() {
      this.rule.templateId = this.templateId;
      this.$http.ruleService.createDataChangeRule(this.rule).then(this.displayBox);
    }
  }
};
</script>
<style lang="scss" scoped>
.rules-item_box {
  padding: 10px 10px 0;
  border: 1px solid #d5e0ed;
  border-radius: 5px;
}
.rules-item {
  display: flex;
  align-items: center;
  line-height: 0;
  justify-content: space-between;
  margin-bottom: 8px;
}
.rules-item >>> .el-input--small,
.rules-item >>> .el-select--small {
  line-height: 0;
}
.rules-item i {
  margin-left: 15px;
  cursor: pointer;
  color: #96a2b3;
}
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

<template>
  <div>
    <el-form ref="form" :model="rule" :rules="rules" label-position="left" label-width="120px">
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="rule.name"></el-input>
      </el-form-item>
      <el-form-item label="规则描述" prop="description">
        <el-input v-model="rule.description"></el-input>
      </el-form-item>
      <el-form-item prop="triggerConditions" label="满足以下条件">
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
            </div>
          </transition>
        </div>
      </el-form-item>
      <el-form-item label="公式配置" prop="formulaType">
        <el-radio-group v-model="rule.formulaType" @change="rule.basicsFormula.calculationRuleType = 'MAX'">
          <el-radio label="CUSTOMIZE">自定义公式</el-radio>
          <el-radio label="BASIC"
            >基础公式&nbsp;&nbsp;
            <el-select v-show="rule.formulaType === 'BASIC'" v-model="rule.basicsFormula.calculationRuleType" size="mini">
              <el-option label="最大值" value="MAX"></el-option>
              <el-option label="最小值" value="MIN"></el-option>
              <el-option label="平均值" value="AVG"></el-option>
              <el-option label="时间加减" value="TIME_ADDITION_SUBTRACTION"></el-option>
              <el-option label="时间差异" value="TIME_DIFFERENCE"></el-option>
            </el-select>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公式表达式" v-if="rule.formulaType === 'CUSTOMIZE'" prop="formulaExpression">
        <formula-rule
          ref="formula"
          :showSharePart="false"
          v-model="rule.customFormula.formulaExpression"
          :formulaList="formulaList"
          :componentList="componentList"
          @changeComponentId="changeComponentId"
        ></formula-rule>
      </el-form-item>
      <el-form-item label="入参设置" v-if="rule.formulaType === 'BASIC'" prop="basicsFormula">
        <div class="formulaBox">
          <div
            v-if="
              rule.basicsFormula.calculationRuleType === 'MAX' ||
                rule.basicsFormula.calculationRuleType === 'MIN' ||
                rule.basicsFormula.calculationRuleType === 'AVG'
            "
          >
            <h5>计算参数</h5>
            <div v-if="rule.basicsFormula.calcParams.length > 0">
              <div v-for="(item, index) in rule.basicsFormula.calcParams" :key="index">
                <el-select size="small" filterable v-model="item.calcParam" @change="changeComponent(item.calcParam)">
                  <el-option
                    v-for="(item, index) in fitlterComponentList()"
                    :key="index"
                    :label="item.tag"
                    :value="item.fieldId"
                  ></el-option>
                </el-select>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <div class="operation-icon" style="display:inline-block">
                  <i class="iconfont icon-jia" @click="addConditions"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                  <i class="iconfont icon-jian" @click="deleteConditions(index)"></i>
                </div>
              </div>
            </div>
            <div v-else>暂无数据&nbsp;&nbsp;&nbsp;&nbsp;<i class="iconfont icon-jia" @click="addConditions"></i></div>
          </div>
          <div v-if="rule.basicsFormula.calculationRuleType === 'TIME_ADDITION_SUBTRACTION'">
            <h5>开始时间</h5>
            <el-select
              size="small"
              filterable
              v-model="rule.basicsFormula.timeCalcParam.startTime"
              @change="changeComponent(rule.basicsFormula.timeCalcParam.startTime)"
            >
              <el-option
                v-for="(item, index) in fitlterComponentList()"
                :key="index"
                :label="item.tag"
                :value="item.fieldId"
              ></el-option>
            </el-select>
            <h5>增加时间</h5>
            <el-input-number size="small" v-model="rule.basicsFormula.timeCalcParam.increaseTime" :step="1"></el-input-number>
            <el-select size="small" style="width:80px" v-model="rule.basicsFormula.timeCalcParam.timeUnitType">
              <!-- HOUR', 'MINUTE', 'SECOND' -->
              <el-option label="时" value="HOUR"></el-option>
              <el-option label="分" value="MINUTE"></el-option>
              <el-option label="秒" value="SECOND"></el-option>
            </el-select>
          </div>
          <div v-if="rule.basicsFormula.calculationRuleType === 'TIME_DIFFERENCE'">
            <h5>开始时间</h5>
            <el-select
              size="small"
              filterable
              v-model="rule.basicsFormula.timeCalcParam.startTime"
              @change="changeComponent(rule.basicsFormula.timeCalcParam.startTime)"
            >
              <el-option
                v-for="(item, index) in fitlterComponentList()"
                :key="index"
                :label="item.tag"
                :value="item.fieldId"
              ></el-option>
            </el-select>
            <h5>结束时间</h5>
            <el-select size="small" filterable v-model="rule.basicsFormula.timeCalcParam.endTime">
              <el-option
                v-for="(item, index) in fitlterComponentList()"
                :key="index"
                :label="item.tag"
                :value="item.fieldId"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="结果输出修约"
        v-show="
          rule.basicsFormula.calculationRuleType !== 'TIME_DIFFERENCE' &&
            rule.basicsFormula.calculationRuleType !== 'TIME_ADDITION_SUBTRACTION'
        "
        prop="resultRevisionType"
      >
        <el-radio-group v-model="rule.resultRevisionType">
          <el-radio label="HIGHEST_ACCURACY">按入参的最高精度</el-radio>
          <el-radio label="Keep_Decimal_Digits"
            >修约规则&nbsp;&nbsp;
            <el-button
              size="mini"
              :disabled="rule.resultRevisionType === 'HIGHEST_ACCURACY'"
              icon="iconfont icon-tianjia"
              @click="createRevisionRule"
              >新增规则</el-button
            >
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="rule.resultRevisionType === 'Keep_Decimal_Digits'">
        <revisionL :isShowCreat="false" :model.sync="rule.revisionRules" ref="revisionL"></revisionL>
      </el-form-item>
      <el-form-item label="输出结果" prop="resultOutputControl">
        <el-select
          size="small"
          filterable
          v-model="rule.resultOutputControl"
          @change="changeComponent(rule.resultOutputControl)"
        >
          <el-option
            v-for="(item, index) in fitlterComponentList('output')"
            :key="index"
            :label="item.tag"
            :value="item.fieldId"
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
import formulaRule from "@/components/formulaRule/formulaRule.vue";
import revisionL from "@/components/tools/revisionL/revisionL.vue";
export default {
  name: "addDataFormulaRule",
  data() {
    return {
      show: true,
      ruleId: "",
      showSetting: false,
      componentId: "",
      formulaList: [
        {
          selectValue: "+",
          displayValue: "+"
        },
        {
          selectValue: "-",
          displayValue: "-"
        },
        {
          selectValue: "*",
          displayValue: "×"
        },
        {
          selectValue: "/",
          displayValue: "÷"
        }
      ],
      componentList: [],
      rule: {
        basicsFormula: {
          calcParams: [],
          calculationRuleType: "MAX",
          timeCalcParam: {
            endTime: "",
            increaseTime: "",
            startTime: "",
            timeUnitType: "HOUR"
          }
        },
        customFormula: {
          formulaExpression: ""
        },
        componentId: "",
        decimal_Place: 0,
        description: "",
        revisionRules: [
          {
            conditions: [
              {
                comparator: "VALUE",
                connectionType: "AND",
                operator: "LT",
                value: "string"
              }
            ],
            enabled: false,
            ordinaryResultDecimalBit: 0,
            ruleType: "DECIMAL_PLACE",
            scientificResultDecimalBit: 0
          }
        ],
        formulaType: "CUSTOMIZE",
        name: "",
        resultOutputControl: "",
        resultRevisionType: "HIGHEST_ACCURACY",
        templateId: "",
        triggerConditions: []
      },
      rules: { name: { required: true, message: "必填" }, triggerConditions: { validator: this.checkGroup } }
    };
  },
  components: { group, formulaRule, revisionL },
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
    createRevisionRule() {
      this.$refs.revisionL.createRule();
    },
    addConditions() {
      if (this.rule.basicsFormula.calcParams.length === 5) {
        this.$message.info("已经5个了，不能再添加了");
        return;
      }
      this.rule.basicsFormula.calcParams.push({
        calcParam: ""
      });
    },
    fitlterComponentList(params = "other") {
      return this.componentList.filter(item => {
        if (
          (this.rule.basicsFormula.calculationRuleType === "MAX" ||
            this.rule.basicsFormula.calculationRuleType === "MIN" ||
            this.rule.basicsFormula.calculationRuleType === "AVG") &&
          item.componentType === "TEXTBOX" &&
          item.inputModle.inputType === "NUMBERS"
        ) {
          return item;
        } else if (params === "output" && item.componentType === "TEXTBOX") {
          return item;
        } else if (
          (this.rule.basicsFormula.calculationRuleType === "TIME_ADDITION_SUBTRACTION" ||
            this.rule.basicsFormula.calculationRuleType === "TIME_DIFFERENCE") &&
          item.componentType === "DATEPICKER"
        ) {
          return item;
        }
      });
    },
    deleteConditions(index) {
      this.rule.basicsFormula.calcParams.splice(index, 1);
    },
    checkGroup(rule, value, callback) {
      if (value) {
        let flag = false;
        let list = [];
        value.map(item => {
          list = list.concat(item.expressions);
        });
        list.map(item => {
          if (item.operator != "IS_EMPTY" && item.operator != "IS_NOT_EMPTY" && !item.rightSide) {
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
    changeComponent(componentId) {
      console.log(componentId);
      let item = this.componentList.find(item => {
        if (item.fieldId === componentId) {
          return item;
        }
      });
      this.changeComponentId(item.parentId);
    },
    changeComponentId(id) {
      this.rule.componentId = id;
      this.getComponents();
    },
    createRuleFields() {
      if (this.rule.ruleConfig.ruleFields.length === 0) {
        this.componentList.map(item => {
          this.rule.ruleConfig.ruleFields.push({
            id: item.identifier,
            name: item.tag,
            fillable: true,
            visible: true
          });
        });
      } else {
        let flag = this.rule.ruleConfig.ruleFields.find(item => {
          if (this.componentList[0].identifier === item.id) {
            return true;
          }
        });
        if (!flag || this.rule.ruleConfig.ruleFields.length != this.componentList.length) {
          // this.rule.ruleConfig.ruleFields = [];
          let list = [];
          this.componentList.map(item => {
            let obj = this.rule.ruleConfig.ruleFields.find(jtem => {
              if (jtem.id === item.identifier) {
                return jtem;
              }
            });
            if (typeof obj === "undefined") {
              list.push({
                id: item.identifier,
                name: item.tag,
                fillable: true,
                visible: true
              });
            } else {
              list.push(obj);
            }
          });
          this.rule.ruleConfig.ruleFields = [];
          this.rule.ruleConfig.ruleFields = list;
        }
      }
    },
    getComponents() {
      // this.$http.templateServicethis.templateId
      this.$http.ruleService
        .getComponents(this.templateId, {
          componentId: this.rule.componentId
        })
        .then(res => {
          this.componentList = res.data;
        });
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
      if (!this.rule.resultOutputControl) {
        this.rule.componentId = "";
      }
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
      if (this.rule.triggerConditions.length === 0 && !this.rule.resultOutputControl) {
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
        basicsFormula: {
          calcParams: [],
          calculationRuleType: "MAX",
          timeCalcParam: {
            endTime: "",
            increaseTime: "",
            startTime: "",
            timeUnitType: "HOUR"
          }
        },
        componentId: "",
        decimal_Place: 0,
        description: "",
        customFormula: {
          formulaExpression: ""
        },
        formulaType: "CUSTOMIZE",
        name: "",
        revisionRules: [],
        resultOutputControl: "",
        resultRevisionType: "HIGHEST_ACCURACY",
        templateId: "",
        triggerConditions: []
      };
      this.$refs["form"].resetFields();
      setTimeout(this.$refs.formula.setDefaultValue, 300);
    },
    getRule(ruleId) {
      this.ruleId = ruleId;
      this.$http.ruleService
        .getRuleById(ruleId)
        .then(res => {
          this.rule = res.data;
          setTimeout(this.$refs.formula.setDefaultValue, 300);
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
      this.$http.ruleService.updateFormulaRule(this.ruleId, this.rule).then(this.displayBox);
    },
    createRule() {
      this.rule.templateId = this.templateId;
      this.$http.ruleService.createFormulaRule(this.rule).then(this.displayBox);
    }
  }
};
</script>
<style lang="scss" scoped>
.formulaBox {
  padding: 0.5em 1em;
  border: 1px dashed #e0e0e0;
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
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    .groupTitle {
      font-size: 12px;
      font-weight: bold;
      padding: 1em 1em 0.5em 1em;
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

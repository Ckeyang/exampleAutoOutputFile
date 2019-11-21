<template>
  <div>
    <el-form ref="form" :model="rule" :rules="rules" label-position="left" label-width="120px">
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="rule.name"></el-input>
      </el-form-item>
      <el-form-item label="规则描述" prop="description">
        <el-input v-model="rule.description"></el-input>
      </el-form-item>
      <el-form-item label="满足以下条件" prop="triggerConditions">
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
      <el-form-item label="关联表单" prop>
        <el-select style="width:100%" filterable v-model="rule.connectionFormId" @change="cleanGroupB">
          <el-option
            v-for="(item, index) in tableList"
            :label="item.componentAttr.tag"
            :value="item.identifier"
            :key="index"
            @change="getComponentsB"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联表单筛选条件" prop="filterConditions">
        <div class="groupBox">
          <div class="groupTitle">
            条件
            <span class="tool" @click="showB = !showB">
              {{ showB ? "收起" : "展开" }}&nbsp;&nbsp;
              <i :class="{ 'iconfont icon-shang': showB, 'iconfont icon-xia': !showB }"></i>
            </span>
          </div>
          <transition name="el-zoom-in-top">
            <div class="toolBox" v-show="showB">
              符合以下条件
              <span>
                <el-button size="mini" icon="el-icon-delete" @click="cleanGroupB">清除所有条件</el-button>
                <el-button size="mini" type="success" icon="el-icon-plus" @click="addGroupB">新建分组</el-button>
              </span>
              <group
                :componentList="componentListB"
                :componentId="componentId"
                v-for="(item, index) in rule.filterConditions"
                @connectGroup="connectGroupB"
                @removeGroup="removeGroupB"
                :key="index"
                :index="index"
                :model.sync="item"
              ></group>
              <!-- <div class="descriptBox">
                <span>描述</span>
                <div v-html="getDescriptB()"></div>
              </div>-->
            </div>
          </transition>
        </div>
      </el-form-item>
      <!-- <el-form-item>
      </el-form-item>-->
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
  name: "addDataAssociationRules",
  data() {
    return {
      show: true,
      showB: true,
      ruleId: "",
      showSetting: false,
      componentId: "",
      tableList: [],
      componentList: [],
      componentListB: [],
      rule: {
        connectionFormId: "",
        description: "",
        filterConditions: [],
        name: "",
        templateId: "",
        triggerConditions: []
      },
      rules: {
        name: { required: true, message: "必填" },
        triggerConditions: { validator: this.checkGroup },
        filterConditions: { validator: this.checkGroup }
      }
    };
  },
  watch: {
    rule: {
      handler(val) {
        // this.connectExpression();
        // this.$emit('update:model', val);
        // this.$emit('update:model', val);
        this.rule.triggerConditions === [] ? (this.rule.componentId = "") : null;
        this.getComponents();
        this.getComponentsB();
      },
      deep: true,
      immediate: true
    }
  },
  components: { group },
  props: {
    templateId: String,
    visible: { type: Boolean, default: false }
  },
  created() {
    this.getTables();
    this.getComponents();
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
    changeComponentId(id) {
      this.rule.componentId = id;
      this.getComponents();
    },
    createRuleFields() {
      if (this.rule.ruleConfig.ruleFields.length === 0) {
        this.componentList.map(item => {
          this.rule.ruleConfig.ruleFields.push({
            id: item.identifier,
            name: item.componentAttr.tag,
            fillable: false,
            visible: false
          });
        });
      } else {
        let flag = this.rule.ruleConfig.ruleFields.find(item => {
          if (this.componentList[0].identifier === item.id) {
            return true;
          }
        });
        if (!flag || this.rule.ruleConfig.ruleFields.length != this.componentList.length) {
          this.rule.ruleConfig.ruleFields = [];
          this.componentList.map(item => {
            this.rule.ruleConfig.ruleFields.push({
              id: item.identifier,
              name: item.componentAttr.tag,
              fillable: false,
              visible: false
            });
          });
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
    getComponentsB() {
      this.$http.ruleService
        .getComponents(this.templateId, {
          componentId: this.rule.connectionFormId
        })
        .then(res => {
          this.componentListB = res.data;
        });
    },
    getTables() {
      this.$http.ruleService.getTemplateCompent(this.templateId).then(res => {
        this.tableList = res.data;
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
    getDescriptB() {
      let result = "";
      let i = 1;
      this.rule.filterConditions.map(item => {
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
    connectGroupB() {
      let length = this.rule.filterConditions.length;
      let i = 0;
      while (true) {
        if (i === length) {
          break;
        }
        this.rule.filterConditions[i].next.connectionType = this.rule.filterConditions[i + 1]
          ? this.rule.filterConditions[i + 1].previous.connectionType
          : "AND";
        this.rule.filterConditions[i].next.id = this.rule.filterConditions[i + 1] ? this.rule.filterConditions[i + 1].id : "";
        this.rule.filterConditions[i + 1]
          ? (this.rule.filterConditions[i + 1].previous.id = this.rule.filterConditions[i].id)
          : null;
        i++;
      }
    },
    cleanGroup() {
      this.rule.triggerConditions = [];
    },
    cleanGroupB() {
      this.rule.filterConditions = [];
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
    addGroupB() {
      this.rule.filterConditions.push({
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
    removeGroupB(index) {
      this.rule.filterConditions.splice(index, 1);
    },
    getRoundId() {
      let times = new Date().getTime();
      let random = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
      return times + "" + random;
    },
    createNewRule(id = "") {
      this.ruleId = id;
      this.rule = {
        connectionFormId: "",
        description: "",
        filterConditions: [],
        name: "",
        templateId: "",
        triggerConditions: []
      };
      this.$refs["form"].resetFields();
      this.getTables();
    },
    getRule(ruleId) {
      this.ruleId = ruleId;
      this.$http.ruleService
        .getRuleById(ruleId)
        .then(res => {
          this.rule = res.data;
        })
        .then(this.getComponents)
        .then(this.getTables);
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
      this.$http.ruleService.updateConectDataRule(this.ruleId, this.rule).then(this.displayBox);
    },
    createRule() {
      this.rule.templateId = this.templateId;
      this.$http.ruleService.createConectDataRule(this.rule).then(this.displayBox);
    }
  }
};
</script>
<style lang="scss" scope>
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

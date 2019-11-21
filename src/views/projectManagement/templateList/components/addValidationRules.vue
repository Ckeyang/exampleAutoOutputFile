<template>
  <div>
    <el-form ref="form" :model="rule" :rules="rules" label-position="left" label-width="120px">
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="rule.name"></el-input>
      </el-form-item>
      <el-form-item label="规则描述" prop="description">
        <el-input v-model="rule.description"></el-input>
      </el-form-item>
      <el-form-item prop="groups" label="数据校验条件">
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
                v-for="(item, index) in rule.groups"
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
      <el-form-item label="满足校验条件时提示文字" prop="noteTip">
        <el-input type="textarea" :rows="3" v-model="rule.noteTip"></el-input>
      </el-form-item>
      <el-form-item label="验证时机" prop="submitType">
        <el-radio-group v-model="rule.submitType">
          <el-radio label="SITE_DATA">提交现场时验证</el-radio>
          <el-radio label="DETECTION_DATA">提交检测时验证</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="验证方式" prop="allowSubmit">
        <el-radio-group v-model="rule.allowSubmit">
          <el-radio :label="true">提示用户允许提交</el-radio>
          <el-radio :label="false">提示用户并且不允许提交</el-radio>
        </el-radio-group>
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
  name: "addDataFormulaRule",
  data() {
    return {
      show: true,
      ruleId: "",
      showSetting: false,
      componentId: "",
      componentList: [],
      rule: {
        allowSubmit: false,
        componentId: "",
        description: "",
        groups: [],
        name: "",
        noteTip: "",
        submitType: "SITE_DATA",
        templateId: ""
      },
      rules: {
        name: { required: true, message: "必填" },
        noteTip: { required: true, message: "必填" },
        submitType: { required: true, message: "必填" },
        allowSubmit: { required: true, message: "必填" },
        groups: { required: true, validator: this.checkGroup }
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
      if (value.length === 0) {
        callback(new Error("必填"));
      }
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
      let length = this.rule.groups.length;
      let i = 0;
      while (true) {
        if (i === length) {
          break;
        }
        this.rule.groups[i].next.connectionType = this.rule.groups[i + 1]
          ? this.rule.groups[i + 1].previous.connectionType
          : "AND";
        this.rule.groups[i].next.id = this.rule.groups[i + 1] ? this.rule.groups[i + 1].id : "";
        this.rule.groups[i + 1] ? (this.rule.groups[i + 1].previous.id = this.rule.groups[i].id) : null;
        i++;
      }
    },
    cleanGroup() {
      this.rule.groups = [];
      this.rule.componentId = "";
    },
    addGroup() {
      this.rule.groups.push({
        expressions: [],
        id: this.getRoundId(),
        next: { connectionType: "AND", id: "" },
        previous: { connectionType: "AND", id: "" }
      });
      this.connectGroup();
    },
    removeGroup(index) {
      this.rule.groups.splice(index, 1);
      if (this.rule.groups.length === 0) {
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
        allowSubmit: true,
        componentId: "",
        description: "",
        groups: [],
        name: "",
        noteTip: "",
        submitType: "SITE_DATA",
        templateId: ""
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
      this.$http.ruleService.updateDataValidationRule(this.ruleId, this.rule).then(this.displayBox);
    },
    createRule() {
      this.rule.templateId = this.templateId;
      this.$http.ruleService.createDataValidationRule(this.rule).then(this.displayBox);
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

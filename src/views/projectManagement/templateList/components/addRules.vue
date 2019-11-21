<template>
  <div>
    <el-form ref="form" :model="rule" :rules="rules" label-position="left" label-width="120px">
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="rule.name"></el-input>
      </el-form-item>
      <el-form-item label="规则描述" prop="description">
        <el-input v-model="rule.description"></el-input>
      </el-form-item>
      <el-form-item prop="groups">
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
              <!-- <div class="descriptBox">
                <span>描述</span>
                <div v-html="getDescript()"></div>
              </div>-->
            </div>
          </transition>
        </div>
      </el-form-item>
      <el-form-item label="设置相关属性">
        <el-button class="shezhi" icon="iconfont icon-shezhi" @click="showSetting = true">批量设置</el-button>
        <!-- <el-input v-model="rule.name"></el-input> -->
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button @click="displayBox()">取消</el-button>&nbsp;&nbsp;
        <el-button type="primary" @click="save()">确定</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="showSetting" title="相关属性" v-el-drag-dialog>
      <el-table height="450" :data="rule.ruleConfig.ruleFields" size="mini">
        <!-- 多选 -->
        <el-table-column prop="name" label="控件名称"></el-table-column>
        <el-table-column width="100" :render-header="renderheaderFillable">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.fillable" @change="setVisible(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column width="100" :render-header="renderheaderVisible">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.visible" @change="setFillAble(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showSetting = false">确定</el-button>
      </span>
    </el-dialog>
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
import group from "./group.vue";
import SortBox from "@/components/tools/sortBox.vue";
export default {
  name: "addRules",
  data() {
    return {
      show: true,
      ruleId: "",
      showSetting: false,
      sortBoxVisible: false,
      componentId: "",
      componentList: [],
      ruleProps: [{ key: "name", label: "规则名称" }, { key: "description", label: "规则描述" }],
      sortList: [],
      rule: {
        name: "",
        description: "",
        templateId: "",
        componentId: "",
        ruleConfig: { ruleFields: [] },
        groups: []
      },
      rules: { name: { required: true, message: "必填" }, groups: { validator: this.checkGroup } }
    };
  },
  components: { group, SortBox },
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
    saveSort() {
      this.$http.ruleService
        .saveViewRuleSortList(this.sortList)
        .then(() => {
          this.sortBoxVisible = false;
          this.$message.success("保存成功");
        })
        .then(this.displayBox);
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
    changeComponentId(id) {
      this.rule.componentId = id;
      this.getComponents();
    },
    createRuleFields() {
      if (this.rule.ruleConfig.ruleFields.length === 0) {
        this.componentList.map(item => {
          this.rule.ruleConfig.ruleFields.push({
            id: item.fieldId,
            name: item.tag,
            fillable: true,
            visible: true
          });
        });
      } else {
        let flag = this.rule.ruleConfig.ruleFields.find(item => {
          if (this.componentList[0].fieldId === item.id) {
            return true;
          }
        });
        if (!flag || this.rule.ruleConfig.ruleFields.length != this.componentList.length) {
          // this.rule.ruleConfig.ruleFields = [];
          let list = [];
          this.componentList.map(item => {
            let obj = this.rule.ruleConfig.ruleFields.find(jtem => {
              if (jtem.id === item.fieldId) {
                return jtem;
              }
            });
            if (typeof obj === "undefined") {
              list.push({
                id: item.fieldId,
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
    getDescript() {
      let result = "";
      let i = 1;
      this.rule.groups.map(item => {
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
      // for (i; i > 0; i--) {
      //   this.rule.groups[i - 1].next = this.rule.groups[i].previous;
      //   this.rule.groups[i - 1].next.id = this.rule.groups[i].id;
      //   this.rule.groups[i].previous.id = this.rule.groups[i - 1].id;
      // }
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
        name: "",
        description: "",
        templateId: "",
        componentId: "",
        ruleConfig: { ruleFields: [] },
        groups: []
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
      this.createNewRule();
      this.$emit("update:visible", false);
    },
    save() {
      this.connectGroup();
      this.$refs["form"].validate(valid => {
        if (valid) {
          // if (this.checkGroup()) {
          //   this.$message.error("条件值不能为空");
          //   return;
          // }
          this.ruleId ? this.updateRule() : this.createRule();
        }
      });
    },
    updateRule() {
      this.$http.ruleService.update(this.ruleId, this.rule).then(res => {
        if (res.data.length > 1) {
          this.sortList = res.data;
          this.sortBoxVisible = true;
        }else{
          this.displayBox();
        }
      });
    },
    createRule() {
      this.sortList = [];
      this.rule.templateId = this.templateId;
      this.$http.ruleService.create(this.rule).then(res => {
        if (res.data.length > 1) {
          this.sortList = res.data;
          this.sortBoxVisible = true;
        }else{
          this.displayBox();
        }
      });
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

<template>
  <div>
    <el-form ref="form" :model="rule" :rules="rules" label-position="left" label-width="120px">
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="rule.name"></el-input>
      </el-form-item>
      <el-form-item label="规则描述" prop="description">
        <el-input v-model="rule.description"></el-input>
      </el-form-item>
      <el-form-item label="联动表单" prop="linkageFormType">
        <el-select v-model="rule.linkageFormType" @change="resetLink()" size="small" style="width:100%">
          <el-option label="采样记录联动数据表" value="SAMPLING_RECORD_LINKAGE_FORM"></el-option>
          <el-option label="防护用品联动数据表" value="LABOUR_PROTECTION_FORM"></el-option>
        </el-select>
        <!-- SAMPLING_RECORD_LINKAGE_FORM=采样记录联动数据表 ; LABOUR_PROTECTION_FORM = 防护用品联动数据表 -->
      </el-form-item>
      <el-form-item label="满足条件" prop="conditions">
        <div class="mztj">
          <div v-if="rule.conditions.length > 0">
            <div v-for="(item, index) in rule.conditions" :key="index">
              <el-select size="small" filterable v-model="item.leftLinkageForm.id" @change="change">
                <el-option
                  v-for="(item, index) in componentList"
                  :key="index"
                  :label="item.tag"
                  :value="item.fieldId"
                ></el-option>
              </el-select>
              &nbsp;&nbsp;值等于&nbsp;&nbsp;
              <el-select size="small" filterable v-model="item.rightLinkageForm.field">
                <el-option v-for="(item, index) in linkList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <i class="iconfont icon-jia" @click="addConditions"></i>&nbsp;&nbsp;&nbsp;&nbsp;
              <i class="iconfont icon-jian" @click="deleteConditions(index)"></i>
            </div>
          </div>
          <div v-else>暂无数据&nbsp;&nbsp;&nbsp;&nbsp;<i class="iconfont icon-jia" @click="addConditions"></i></div>
        </div>
      </el-form-item>
      <el-form-item label="联动显示" prop="ruleResult">
        <div class="mztj">
          <el-select size="small" filterable v-model="rule.ruleResult.leftLinkageForm.id">
            <el-option v-for="(item, index) in componentList" :key="index" :label="item.tag" :value="item.fieldId"></el-option>
          </el-select>
          联动显示
          <el-select size="small" filterable v-model="rule.ruleResult.rightLinkageForm.field">
            <el-option v-for="(item, index) in linkList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          的值
        </div>
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
      linkList: [],
      rule: {
        componentId: "",
        conditions: [],
        description: "",
        linkageFormType: "SAMPLING_RECORD_LINKAGE_FORM",
        name: "",
        ruleResult: {
          leftLinkageForm: {
            id: ""
          },
          rightLinkageForm: {
            field: ""
          }
        },
        templateId: ""
      },
      rules: { name: { required: true, message: "必填" } }
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
        this.getLinkList();
      },
      deep: true,
      immediate: true
    },
    "rule.conditions": {
      handler(val) {
        if (val.length === 0) {
          this.changeComponentId("");
        }
      }
    }
  },
  activated() {
    this.getComponents();
    this.getLinkList();
  },
  methods: {
    resetLink() {
      this.rule.conditions = [];
      this.rule.ruleResult = {
        leftLinkageForm: {
          id: ""
        },
        rightLinkageForm: {
          field: ""
        }
      };
      this.getLinkList();
    },
    getLinkList() {
      //查询linkList
      this.$http.ruleService.getLinkList({ dataSourceEnum: this.rule.linkageFormType }).then(res => {
        this.linkList = res.data || [];
      });
    },
    addConditions() {
      this.rule.conditions.push({
        leftLinkageForm: {
          id: ""
        },
        rightLinkageForm: {
          field: ""
        }
      });
    },
    deleteConditions(index) {
      this.rule.conditions.splice(index, 1);
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
    change() {
      let id = this.rule.conditions[0].leftLinkageForm.id;
      let obj = this.componentList.find(item => {
        if (item.fieldId === id) {
          return item;
        }
      });
      this.changeComponentId(obj.parentId);
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
        });
    },
    getRoundId() {
      let times = new Date().getTime();
      let random = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
      return times + "" + random;
    },
    createNewRule(id = "") {
      this.ruleId = id;
      this.rule = {
        componentId: "",
        conditions: [],
        description: "",
        linkageFormType: "SAMPLING_RECORD_LINKAGE_FORM",
        name: "",
        ruleResult: {
          leftLinkageForm: {
            id: ""
          },
          rightLinkageForm: {
            field: ""
          }
        },
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
        })
        .then(this.getComponents)
        .then(this.getLinkList);
    },
    displayBox() {
      this.$emit("update:visible", false);
    },
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.ruleId ? this.updateRule() : this.createRule();
        }
      });
    },
    updateRule() {
      this.$http.ruleService.updateDataLinkageChangeRule(this.ruleId, this.rule).then(this.displayBox);
    },
    createRule() {
      this.rule.templateId = this.templateId;
      this.$http.ruleService.createDataLinkageChangeRule(this.rule).then(this.displayBox);
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
  .mztj {
    color: #595959;
    i {
      font-size: 14px;
      color: #1884cc;
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

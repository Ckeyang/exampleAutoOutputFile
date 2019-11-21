<template>
  <div class="dat-rules_box">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-position="left"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="录入数据">
        <ul class="rules-item_box">
          <li
            class="rules-item"
            v-for="(domain,index) in ruleForm.inputDataComponentIds"
            :key="index"
          >
            <el-select
              v-model="domain.value"
              placeholder="请选字段"
              size="small"
              style="width:100%"
              filterable
              @change="refreshData"
            >
              <el-option
                :label="item.componentAttr.tag"
                :value="item.identifier"
                v-for="(item,i) in componentAllList"
                :key="i"
                :disabled="isDisablued(item.identifier)"
              ></el-option>
            </el-select>
            <i class="iconfont icon-jia" @click="addComponentIds('inputDataComponentIds',index)"></i>
            <i
              class="iconfont icon-jian"
              @click="deleteComponentIds('inputDataComponentIds',index)"
              v-if="ruleForm.inputDataComponentIds.length>1"
            ></i>
          </li>
        </ul>
        <span class="errorMesg" v-show="inputErrorMesg">下拉框值不能为空</span>
      </el-form-item>
      <el-form-item label="使用相同结果值">
        <ul class="rules-item_box">
          <li
            class="rules-item"
            v-for="(domain,index) in ruleForm.applyDataComponentIds"
            :key="index"
          >
            <el-select
              v-model="domain.value"
              placeholder="请选字段"
              size="small"
              style="width:100%"
              filterable
              @change="refreshData"
            >
              <el-option
                :label="item.componentAttr.tag"
                :value="item.identifier"
                v-for="(item,i) in componentAllList"
                :key="i"
                :disabled="isDisablued(item.identifier)"
              ></el-option>
            </el-select>
            <i class="iconfont icon-jia" @click="addComponentIds('applyDataComponentIds',index)"></i>
            <i
              class="iconfont icon-jian"
              @click="deleteComponentIds('applyDataComponentIds',index)"
              v-if="ruleForm.applyDataComponentIds.length>1"
            ></i>
          </li>
        </ul>
        <span class="errorMesg" v-show="applyErrorMesg">下拉框值不能为空</span>
      </el-form-item>
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="ruleForm.name" size="small" placeholder="请输入规则名称"></el-input>
      </el-form-item>
      <el-form-item label="规则描述">
        <el-input type="textarea" v-model="ruleForm.description" size="small" placeholder="请输入规则描述"></el-input>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button @click="resetForm('ruleForm')" size="medium">重 置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="medium">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        description: "",
        inputDataComponentIds: [{ value: "" }],
        applyDataComponentIds: [{ value: "" }]
      },
      rules: {
        name: { required: true, message: "请输入规则名称", trigger: "blur" }
      },
      curRulesId: "", //  规则id
      componentId: "", //选择的组件的id
      componentAllList: [], // 模板下所有的控件
      inputErrorMesg: false,
      applyErrorMesg: false
    };
  },
  props: {
    templateId: {
      type: String,
      default: ""
    },
    ruleId: {
      type: String,
      default: ""
    }
  },
  activated() {
    this.getComponents();
  },
  methods: {
    // 根据id获取规则信息
    getDataRulesById(id) {
      this.getComponents();
      this.curRulesId = id;
      this.$http.ruleService.getRuleById(id).then(res => {
        this.ruleForm = {
          name: res.data.name,
          description: res.data.description,
          inputDataComponentIds: res.data.inputDataComponentIds.map(item => ({
            value: item
          })),
          applyDataComponentIds: res.data.applyDataComponentIds.map(item => ({
            value: item
          }))
        };
      });
    },
    getComponents(componentId = '') {
      this.$http.ruleService
        .getComponents(this.templateId, {
          componentId: componentId
        })
        .then(res => {
          this.componentAllList = res.data;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.ruleForm.inputDataComponentIds.some(item => item.value === "")
          ) {
            this.inputErrorMesg = true;
          }
          if (
            this.ruleForm.applyDataComponentIds.some(item => item.value === "")
          ) {
            this.applyErrorMesg = true;
          }
          if (!this.inputErrorMesg && !this.applyErrorMesg) {
            this.inputErrorMesg = false;
            this.applyErrorMesg = false;
            let params = {
              name: this.ruleForm.name,
              description: this.ruleForm.description,
              templateId: this.templateId,
              inputDataComponentIds: this.ruleForm.inputDataComponentIds.map(
                item => item.value
              ),
              applyDataComponentIds: this.ruleForm.applyDataComponentIds.map(
                item => item.value
              )
            };
            if (this.curRulesId) {
              //修改规则
              this.$http.ruleService
                .editDataInputRule(this.curRulesId, params)
                .then(() => {
                  this.$message({
                    message: "规则修改成功",
                    type: "success"
                  });
                  this.resetForm("ruleForm");
                  this.displayBox();
                });
            } else {
              //新增规则
              this.$http.ruleService.addDataInputRule(params).then(() => {
                this.$message({
                  message: "规则添加成功",
                  type: "success"
                });
                this.resetForm("ruleForm");
                this.displayBox();
              });
            }
          }
        }
      });
    },
    //返回规则列表
    displayBox() {
      this.$emit("changeVisible");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.inputErrorMesg = false;
      this.applyErrorMesg = false;
      this.ruleForm = {
        name: "",
        description: "",
        inputDataComponentIds: [{ value: "" }],
        applyDataComponentIds: [{ value: "" }]
      };
      this.componentId = "";
    },
    //添加数据选择框   params {componentIds} 字段名 , {index} 索引
    addComponentIds(componentIds, index) {
      this.ruleForm[componentIds].splice(index + 1, 0, { value: "" });
    },
    //删除表单
    deleteComponentIds(componentIds, index) {
      this.ruleForm[componentIds].length > 1 &&
        this.ruleForm[componentIds].splice(index, 1);
    },
    refreshData(value) {
      this.componentId ||
        (this.componentId = this.componentAllList.find(
          item => item.identifier === value
        ).parentId);
      this.getComponents(this.componentId);
    },
    //判断是否禁用
    isDisablued(id) {
      const flag1 = this.ruleForm.inputDataComponentIds.some(
        item2 => item2.value === id
      );
      const flag2 = this.ruleForm.applyDataComponentIds.some(
        item2 => item2.value === id
      );
      return flag1 || flag2;
    }
  }
};
</script>
<style scoped>
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
.errorMesg {
  position: absolute;
  bottom: -32px;
  font-size: 12px;
  color: #f56c6c;
}
</style>


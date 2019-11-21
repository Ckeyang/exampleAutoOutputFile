<template>
  <div class="com-input-box">
    <el-form label-position="top" label-width="80px" @submit.native.prevent>
      <el-form-item>
        <div v-if="formAttribute.checkType === 'CHECKBOX'" class="check-boxs">
          <el-checkbox-group
            v-model="formValue.stringListValue"
            :disabled="!formAttribute.fillable"
          >
            <el-checkbox
              v-for="(item,index) of formAttribute.choiceItemsChoiceBox"
              :label="item.choiceValue"
              :key="index"
            >
              <span>{{item.choiceValue}}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-else-if="formAttribute.checkType === 'RADIOBOX'">
          <el-radio-group
            v-model="formValue.stringValue"
            @change="handelChange"
            :disabled="!formAttribute.fillable"
          >
            <el-radio
              v-for="(item,index) of formAttribute.choiceItemsChoiceBox"
              :label="item.choiceValue"
              :key="index"
            >{{item.choiceValue}}</el-radio>
          </el-radio-group>
        </div>
        <div v-else-if="formAttribute.checkType === 'COMBOBOX'">
          <el-select
            v-show="!isAddChoiceItem"
            v-model="formValue.stringValue"
            placeholder="请选择"
            size="small"
            filterable
            clearable
            style="width:100%"
            :disabled="!formAttribute.fillable"
            @change="handelChange"
          >
            <el-option
              v-for="(item,index) of formAttribute.choiceItemsChoiceBox"
              :label="item.choiceValue"
              :value="item.choiceValue"
              :key="index"
            ></el-option>
          </el-select>
          <div v-show="isAddChoiceItem" class="add-input-box">
            <el-input
              v-model="tempChoiceItem"
              placeholder="请输入内容"
              size="small"
              clearable
              style="width:500px"
              v-focus="isAddChoiceItem"
              @keyup.enter.native="addChoiceItem"
            ></el-input>
          </div>
        </div>
        <div v-else-if="formAttribute.checkType === 'MULTIPLE_COMBOBOX'">
          <el-select
            v-model="formValue.stringListValue"
            v-show="!isAddChoiceItem"
            placeholder="请选择"
            size="small"
            filterable
            style="width:100%"
            multiple
            :disabled="!formAttribute.fillable"
          >
            <el-option
              v-for="(item,index) of formAttribute.choiceItemsChoiceBox"
              :label="item.choiceValue"
              :value="item.choiceValue"
              :key="index"
            ></el-option>
          </el-select>
          <div v-show="isAddChoiceItem" class="add-input-box">
            <el-input
              v-model="tempChoiceItem"
              placeholder="请输入内容"
              size="small"
              clearable
              style="width:500px"
              v-focus="isAddChoiceItem"
              @keyup.enter.native="addChoiceItem"
            ></el-input>
          </div>
        </div>
        <!-- 添加选项 -->
        <div class="add-choice_item-box">
          <div
            v-show="isAddChoiceItem && (formAttribute.checkType === 'RADIOBOX' || formAttribute.checkType === 'CHECKBOX')"
            class="add-input-box"
          >
            <el-input
              v-model="tempChoiceItem"
              placeholder="请输入内容"
              size="small"
              clearable
              style="width:200px"
              v-focus="isAddChoiceItem"
              @keyup.enter.native="addChoiceItem"
            ></el-input>
          </div>
          <el-button
            type="text"
            v-show="isAllowAddOtherValue && formAttribute.allowOtherValueChoiceBox && isAllowAddChoiceItems && !isAddChoiceItem"
            @click.stop="isAddChoiceItem = true"
            icon="iconfont icon-jia"
          >添加其它值</el-button>
          <el-button
            type="text"
            style="margin-left:0"
            v-show="formAttribute.allowOtherValueChoiceBox && isAllowAddChoiceItems && isAddChoiceItem"
            @click.stop="addChoiceItem"
            icon="iconfont icon-baocun"
          >保存</el-button>
          <el-button
            type="text"
            class="close-btn"
            v-show="formAttribute.allowOtherValueChoiceBox && isAllowAddChoiceItems && isAddChoiceItem"
            @click.stop="closeAddChoiceItem"
            icon="iconfont icon-quxiao"
          >取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tempChoiceItem: "", // 临时的添加选项
      isAddChoiceItem: false // 是否显示添加输入框
    };
  },
  props: {
    formAttribute: Object,
    formValue: Object,
    //curEnvironment 当前所在环境， template 模板 、 form 表单
    curEnvironment: {
      default: "template",
      type: String
    },
    // 是否允许添加其他值
    isAllowAddOtherValue: {
      type: Boolean,
      default: true
    },
    // 是否可以添加选项， 在预览过程中不能添加
    isAllowAddChoiceItems: {
      default: true,
      type: Boolean
    },
    controlId: String // 控件id
  },
  methods: {
    handelChange(val) {
      this.formAttribute.ruleAvailable && this.$emit("handleApplyRule", val); // 去执行规则
    },
    // 动态添加选项
    addChoiceItem() {
      if (!this.tempChoiceItem) {
        errorMesg.push("请输入内容!");
        return; // 为空不能添加
      }
      // 校验
      const flag = this.addChoiceItemValidate(
        this.tempChoiceItem,
        this.formAttribute.inputModle.inputType
      );
      if (!flag) return; // 验证不通过则不提交
      //表单录入时需要调用增加接口
      const objItem = {
        choiceId: null,
        choiceValue: this.tempChoiceItem,
        otherValue: null
      };
      if (this.curEnvironment === "form") {
        this.$http.formEnterService
          .addControlChoiceItem(this.controlId, {
            choiceItemsChoiceBox: [objItem]
          })
          .then(res => {
            this.formAttribute.choiceItemsChoiceBox.push(objItem);
            this.isAddChoiceItem = false;
            this.tempChoiceItem = "";
          });
      } else {
        this.formAttribute.choiceItemsChoiceBox.push(objItem);
        this.isAddChoiceItem = false;
        this.tempChoiceItem = "";
      }
      if (["RADIOBOX", "COMBOBOX"].includes(this.formAttribute.checkType)) {
        this.formValue.stringValue = objItem.choiceValue;
      } else {
        this.formValue.stringListValue.push(objItem.choiceValue);
      }
    },
    closeAddChoiceItem() {
      this.isAddChoiceItem = false;
      this.tempChoiceItem = "";
    },
    // 添加选项时校验
    addChoiceItemValidate(value, type) {
      let errorMesg = [];
      // 空格检验
      if (/^[ ]*$/.test(value)) {
        errorMesg.push("内容不能全为空格！");
      }
      if (
        this.formAttribute.choiceItemsChoiceBox.some(
          item => item.choiceValue === value
        )
      ) {
        errorMesg.push("已存在该选项！");
      }
      if (type === "NUMBERS") {
        // 数字校验
        if (!new RegExp(/^(-?\d+)(\.\d+)?$/).test(value)) {
          errorMesg.push("输入内容格式错误, 请输入数字！");
        }
        if (
          Number(this.formAttribute.minLengthTextBox) > Number(value) ||
          Number(this.formAttribute.maxLengthTextBox) < Number(value)
        ) {
          errorMesg.push(
            `超出限制范围，大小限制为: ${
              this.formAttribute.minLengthTextBox
            } - ${this.formAttribute.maxLengthTextBox}`
          );
        }
      } else {
        if (
          Number(this.formAttribute.minLengthTextBox) > Number(value.length) ||
          Number(this.formAttribute.maxLengthTextBox) < Number(value.length)
        ) {
          errorMesg.push(
            `超出限制范围，大小限制为: ${Number(
              this.formAttribute.minLengthTextBox
            ) || 1} - ${this.formAttribute.maxLengthTextBox} 个字符`
          );
        }
      }
      errorMesg.length && this.showErrorMesg(errorMesg); // 显示错误信息
      return !errorMesg.length;
    },
    //显示错误信息
    showErrorMesg(errorMesg) {
      //显示错误信息
      let str = "";
      for (let item of errorMesg) {
        str += `<li>${item}</li>`;
      }
      this.$message({
        dangerouslyUseHTMLString: true,
        duration: 3000,
        showClose: true,
        type: "error",
        message: `<ul style='line-height:20px;'>${str}</ul>`
      });
    }
  }
};
</script>

<style scoped>
.add-input-box i {
  cursor: pointer;
  margin-left: 5px;
  color: #1884cc;
}
.add-input-box i.combom-btn {
  position: absolute;
  right: -25px;
  top: 0px;
}
.add-choice_item-box .close-btn >>> i.iconfont {
  color: #f64a4a;
}
.add-choice_item-box .close-btn:hover {
  color: #f64a4a;
}
.close-btn {
  color: #595959;
}
.add-input-box i:hover {
  color: #107ac2;
}
.tool-bar {
  position: absolute;
  right: 60px;
  top: 25px;
  width: 160px;
  display: flex;
  justify-content: space-between;
  font-size: 21px;
}
.batchEdits .el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
}
.batchEdits.el-radio-group .el-radio,
.batchEdits .el-checkbox-group .el-checkbox {
  margin: 0 30px 0 0;
  line-height: 38px;
}
.tool-bar i {
  cursor: pointer;
}

.tool-bar i:hover {
  color: #26beff;
}

.index-sort {
  font-size: 20px;
  position: absolute;
  left: 15px;
  top: 25px;
}

.com-input-box {
  max-width: 500px;
}
.choiceItem {
  display: none;
}
.choiceItem:hover {
  color: #107ac2;
}
.el-checkbox :hover .choiceItem {
  display: inline;
}
.check-boxs >>> .el-checkbox-group{
  display: flex;
}
.check-boxs >>> .el-checkbox-group .el-checkbox{
  margin: 0 30px 0 0;
  line-height: 38px;
}
</style>
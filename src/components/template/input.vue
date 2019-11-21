<template>
  <div class="com-input-box">
    <el-form label-position="top" label-width="80px" @submit.native.prevent>
      <el-form-item>
        <el-input
          class="active-red"
          v-if="!formAttribute.showHistoryValue"
          :type="formAttribute.multipleLinesTextBox ? 'textarea' : 'input'"
          :disabled="!formAttribute.fillable"
          :autosize="{ minRows: 2, maxRows: 5}"
          style="width:100%"
          v-model="formValue.stringValue"
          clearable
          @input="handelChange"
          @keyup.ctrl.shift.native="ctrlAltUp"
          @keyup.ctrl.alt.native="altDown"
          :suffix-icon="formAttribute.inputBySweepCode ?'iconfont icon-i-saoma':''"
          :placeholder="'请输入'+ formAttribute.tag"
          size="small"
        ></el-input>
        <el-autocomplete
          class="active-red"
          v-else
          v-model="formValue.stringValue"
          :disabled="!formAttribute.fillable"
          style="width:100%"
          :fetch-suggestions="querySearch"
          clearable
          size="small"
          :suffix-icon="formAttribute.inputBySweepCode ?'iconfont icon-i-saoma':''"
          @input="handelChange"
          @keyup.ctrl.shift.native="ctrlAltUp"
          @keyup.ctrl.alt.native="altDown"
          :placeholder="'请输入'+formAttribute.tag"
        ></el-autocomplete>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
const dicUp = ["¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "⁰", "⁺", "⁻"];
const dicDown = ["₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₀", "₊", "₋"];
export default {
  data() {
    return {
      remenber: [],
      isEmpty: false
    };
  },
  watch: {
    "formValue.stringValue": {
      handler(val) {
        if (!val) {
          this.remenber = [];
          this.isEmpty = false;
        }
      }
    },
  },
  props: ["formAttribute", "projectId", "controlId", "formValue"], //   formValue表单控件的值
  created() {
    this.formValue.stringValue = this.formValue.stringValue || this.formAttribute.defaultStringTextBox || '';
    // setInterval(() => {
    //     this.formValue.stringValue = this.formValue.stringValue+ '1'
    // }, 500);
  },
  methods: {
    querySearch(val, callback) {
      if (this.controlId && this.remenber.length === 0 && !this.isEmpty) {
        this.$http.formEnterService
          .getComponentHistoryList({
            keyWord: this.formValue.stringValue,
            projectId: this.projectId,
            controlId: this.controlId
          })
          .then(res => {
            this.isEmpty = res.data.length === 0;
            this.remenber = res.data.map(item => {
              return { value: item };
            });
            callback(this.remenber);
          })
          .catch(e => {
            callback([]);
          });
      } else {
        let list = this.formValue.stringValue
          ? this.remenber.filter(item => {
              if(item.value.indexOf(this.formValue.stringValue)!=-1){
                return item;
              };
            })
          : this.remenber;
        callback(list);
      }
    },
    handelChange(val) {
      this.formAttribute.ruleAvailable && this.$emit("handleApplyRule", val); // 去执行规则
    },
    ctrlAltUp(arg) {
      switch (arg.key) {
        case "!":
          this.formValue.stringValue += dicUp[0];
          break;
        case "@":
          this.formValue.stringValue += dicUp[1];
          break;
        case "#":
          this.formValue.stringValue += dicUp[2];
          break;
        case "$":
          this.formValue.stringValue += dicUp[3];
          break;
        case "%":
          this.formValue.stringValue += dicUp[4];
          break;
        case "^":
          this.formValue.stringValue += dicUp[5];
          break;
        case "&":
          this.formValue.stringValue += dicUp[6];
          break;
        case "*":
          this.formValue.stringValue += dicUp[7];
          break;
        case "(":
          this.formValue.stringValue += dicUp[8];
          break;
        case ")":
          this.formValue.stringValue += dicUp[9];
          break;
        case "_":
          this.formValue.stringValue += dicUp[10];
          break;
        case "+":
          this.formValue.stringValue += dicUp[11];
          break;
      }
    },
    altDown(arg) {
      switch (arg.key) {
        case "1":
          this.formValue.stringValue += dicDown[0];
          break;
        case "2":
          this.formValue.stringValue += dicDown[1];
          break;
        case "3":
          this.formValue.stringValue += dicDown[2];
          break;
        case "4":
          this.formValue.stringValue += dicDown[3];
          break;
        case "5":
          this.formValue.stringValue += dicDown[4];
          break;
        case "6":
          this.formValue.stringValue += dicDown[5];
          break;
        case "7":
          this.formValue.stringValue += dicDown[6];
          break;
        case "8":
          this.formValue.stringValue += dicDown[7];
          break;
        case "9":
          this.formValue.stringValue += dicDown[8];
          break;
        case "0":
          this.formValue.stringValue += dicDown[9];
          break;
        case "-":
          this.formValue.stringValue += dicDown[10];
          break;
        case "=":
          this.formValue.stringValue += dicDown[11];
          break;
      }
    }
  },
};
</script>
<style scoped>
.com-input-box {
  max-width: 500px;
}
.active-red {
  border-color: red;
}
</style>
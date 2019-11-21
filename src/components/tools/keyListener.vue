<template>
  <el-input
    @keyup.ctrl.shift.native="ctrlAltUp"
    :size="size"
    :clearable="clearable"
    :placeholder="placeholder"
    :type="type"
    :rows="rows"
    :width="width"
    :ref='inputRef'
    v-model="testValue"
    @input="input"
    @focus="focus"
    @keyup.ctrl.alt.native="altDown"
  ></el-input>
</template>
<script>
const dicUp = ["¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "⁰", "⁺", "⁻"];
const dicDown = ["₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₀", "₊", "₋"]; 
export default {
  name: "keyListener",
  data() {
    return {
      testValue: ""
    };
  },
  props: {
    value: { type: String, default: "" },
    rows: { type: Number, default: 3 },
    width: { type: String, default: "" },
    type: { type: String, default: "text" },
    size: { type: String, default: "medium" },
    placeholder: { type: String, default: "" },
    clearable: { type: Boolean, default: false },
    inputRef:{type:String, default:'inputFocus'}
  },
  watch: {
    testValue(val) {
      this.callback(val);
    },
    value(){
      this.testValue=this.value;
    }
  },
  methods: {
    input(val){
      this.$emit('input', val)
    },
    focus(){
      this.$emit('focus')
    },
    ctrlAltUp(arg) {
      switch (arg.key) {
        case "!":
          this.testValue += dicUp[0];
          break;
        case "@":
          this.testValue += dicUp[1];
          break;
        case "#":
          this.testValue += dicUp[2];
          break;
        case "$":
          this.testValue += dicUp[3];
          break;
        case "%":
          this.testValue += dicUp[4];
          break;
        case "^":
          this.testValue += dicUp[5];
          break;
        case "&":
          this.testValue += dicUp[6];
          break;
        case "*":
          this.testValue += dicUp[7];
          break;
        case "(":
          this.testValue += dicUp[8];
          break;
        case ")":
          this.testValue += dicUp[9];
          break;
        case "_":
          this.testValue += dicUp[10];
          break;
        case "+":
          this.testValue += dicUp[11];
          break;
      }
    },
    callback(value) {
      this.$emit("input", value);
    },
    altDown(arg) {
      switch (arg.key) {
        case "1":
          this.testValue += dicDown[0];
          break;
        case "2":
          this.testValue += dicDown[1];
          break;
        case "3":
          this.testValue += dicDown[2];
          break;
        case "4":
          this.testValue += dicDown[3];
          break;
        case "5":
          this.testValue += dicDown[4];
          break;
        case "6":
          this.testValue += dicDown[5];
          break;
        case "7":
          this.testValue += dicDown[6];
          break;
        case "8":
          this.testValue += dicDown[7];
          break;
        case "9":
          this.testValue += dicDown[8];
          break;
        case "0":
          this.testValue += dicDown[9];
          break;
        case "-":
          this.testValue += dicDown[10];
          break;
        case "=":
          this.testValue += dicDown[11];
          break;
      }
    }
  }
};
</script>

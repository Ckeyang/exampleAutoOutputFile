<template>
  <div class="com-input-box">
    <el-form label-position="top" label-width="80px" @submit.native.prevent>
      <el-form-item v-if="formAttribute.checkType === 'DYNAMIC_MULT_CHOICE'">
        <el-checkbox-group v-model="data" @change="setValue">
          <el-checkbox v-for="(item, index) of formAttribute.dynamicChoiceValues" :label="item.choiceValue" :key="index">
            {{ item.choiceValue }}
            &nbsp;|&nbsp;
            <div class="dynamicChoice" v-for="(j, jndex) of item.otherValue" :key="jndex">
              <span>{{ j.value }}</span>
              <input
                :disabled="checkChoose(item.choiceValue)"
                :value="getOtherValue(item.choiceValue, j)"
                class="inputBox"
                @blur="setOtherValue(item.choiceValue, j, $event)"
                :type="j.dynamicChoiceOtherValueType === 'STRING_VALUE' ? 'text' : 'number'"
              />
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="formAttribute.checkType === 'DYNAMIC_SINGLE_CHOICE'">
        <el-radio-group v-model="data" @change="setValue">
          <el-radio v-for="(item, index) of formAttribute.dynamicChoiceValues" :label="item.choiceValue" :key="index">
            {{ item.choiceValue }}
            &nbsp;|&nbsp;
            <div class="dynamicChoice" v-for="(j, jndex) of item.otherValue" :key="jndex">
              <span>{{ j.value }}</span>
              <input
                :disabled="checkChoose(item.choiceValue)"
                :value="getOtherValue(item.choiceValue, j)"
                class="inputBox"
                @blur="setOtherValue(item.choiceValue, j, $event)"
                :type="j.dynamicChoiceOtherValueType === 'STRING_VALUE' ? 'text' : 'number'"
              />
            </div>
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: []
    };
  },
  props: ["formAttribute", "formValue"],
  created() {
    this.defoultData();
  },
  methods: {
    defoultData() {
      if (this.formValue.dynamicChoiceValues) {
        this.formValue.dynamicChoiceValues.map(item => {
          this.data.push(item.choiceValue);
        });
      }
    },
    setValue(val) {
      val = typeof val === "object" ? val : [val];
      this.formValue.dynamicChoiceValues.map(item => {
        let index = val.findIndex(i => {
          return i === item.choiceValue;
        });
        if (index === -1) {
          let j = this.formValue.dynamicChoiceValues.findIndex(i => {
            return i === item;
          });
          this.formValue.dynamicChoiceValues.splice(j, 1);
        }
      });
      val.map(item => {
        let index = this.formValue.dynamicChoiceValues.findIndex(i => {
          return i.choiceValue === item;
        });
        if (index === -1) {
          this.formValue.dynamicChoiceValues.push({
            choiceValue: item,
            otherValue: []
          });
        }
      });
    },
    getOtherValue(name, j) {
      if (this.formValue.dynamicChoiceValues) {
        let index = this.formValue.dynamicChoiceValues.findIndex(item => {
          return item.choiceValue === name;
        });
        if (index === -1) {
          return "";
        } else {
          let jndex = this.formValue.dynamicChoiceValues[index].otherValue.findIndex(item => {
            return item.label === j.value;
          });
          if (jndex === -1) {
            return "";
          } else {
            return this.formValue.dynamicChoiceValues[index].otherValue[jndex].value;
          }
        }
      }
    },
    setOtherValue(name, j, $event) {
      if (this.formValue.dynamicChoiceValues) {
        this.formValue.dynamicChoiceValues.map(item => {
          if (item.choiceValue === name) {
            let index = item.otherValue.findIndex(jtem => {
              return jtem.label === j.value;
            });
            if (index === -1) {
              item.otherValue.push({
                label: j.value,
                value: $event.target.value,
                dynamicChoiceOtherValueType: j.dynamicChoiceOtherValueType
              });
            } else {
              item.otherValue[index].value = $event.target.value;
            }
          }
        });
      }
    },
    checkChoose(name) {
      if (this.formValue.dynamicChoiceValues) {
        let index = this.formValue.dynamicChoiceValues.findIndex(item => {
          return item.choiceValue.trim() === name.trim();
        });
        return index === -1 ? true : false;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.dynamicChoice {
  display: inline-block;
  padding: 0 0.5em;
  .inputBox {
    width: 80px;
    background-color: #fff;
    box-sizing: border-box;
    padding-left: 0.5em;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #606266;
  }
  .inputBox:disabled {
    background-color: #f5f7fa;
    color: #c0c4cc;
  }
}
.batchEdits .el-checkbox-group{
  display: flex;
  flex-wrap: wrap;
}
.batchEdits.el-radio-group .el-radio, .batchEdits .el-checkbox-group .el-checkbox {
  margin: 0 30px 0 0;
}
.el-radio-group .el-radio {
  line-height: 1;
}
.el-radio-group > label {
  display: flex;
  margin-left: 0;
  padding: 0.5em;
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
</style>

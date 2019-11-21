<template>
  <div>
    <el-form ref="form" :model="formAttribute" label-width="70px" label-position="top">
      <el-form-item label="文本标签">
        <el-input
          v-model="formAttribute.tag"
          placeholder="请输入内容"
          size="mini"
          clearable
          v-show="formAttribute.fieldId"
        ></el-input>
        <el-button
          type="primary"
          size="mini"
          style="position: absolute;top:-29px;right:0"
          icon="iconfont icon-jia"
          @click="addFiled"
        >选择字段</el-button>
      </el-form-item>
      <div class="line"></div>
      <div>
        <h3 class="form-title">选项设置</h3>
        <draggable :list="formAttribute.dynamicChoiceValues" :options="dragOptions">
          <transition-group tag="ul" id="formAttribute" class="add-optionss">
            <li v-for="(item,index) of formAttribute.dynamicChoiceValues" :key="index">
              <el-input
                v-model="item.choiceValue"
                placeholder="请输入内容"
                size="mini"
                style="width:162px"
              ></el-input>
              <i class="iconfont icon-jia jia" @click="addOptions" v-if="index===0"></i>
              <i class="iconfont icon-jian" v-else @click="deleteOptions(index)"></i>
              <i class="iconfont icon-shezhi shezhi" @click="setOtherValue(item)"></i>
              <i class="iconfont icon-yidong yidong" @click="deleteOptions(index)"></i>
            </li>
          </transition-group>
        </draggable>
        <h3 class="form-title" v-if="setOther">子选项设置</h3>
        <draggable :list="curChooseItem.otherValue" :options="dragOptions" v-if="setOther">
          <transition-group tag="ul" id="formAttribute" class="add-optionss">
            <li v-for="(item,index) of curChooseItem.otherValue" :key="index">
              <el-input v-model="item.value" placeholder="请输入内容" size="mini" style="width:102px"></el-input>
              <el-select
                v-model="item.dynamicChoiceOtherValueType"
                size="mini"
                style="width:80px;padding:0"
              >
                <el-option label="字符" value="STRING_VALUE"></el-option>
                <el-option label="数值" value="DOUBLE_VALUE"></el-option>
              </el-select>
              <i class="iconfont icon-jia" @click="addOtherValue" v-if="index===0"></i>
              <i class="iconfont icon-jian" v-else @click="deleteOtherValue(index)"></i>
              <i class="iconfont icon-yidong yidong2" @click="deleteOtherValue(index)"></i>
            </li>
          </transition-group>
        </draggable>
        <!-- <el-button type="primary"  plain size='mini' icon='iconfont icon-piliangtianjia' @click='openDialog'>批量增加选项</el-button> -->
      </div>
      <div class="line" v-if="formAttribute.checkType"></div>
      <div v-if="formAttribute.checkType">
        <h3 class="form-title">此题设置</h3>
        <div>
          <div class="form-item-box">
            <label class="el-form-item__label">题型</label>
            <el-radio-group v-model="formAttribute.checkType" size="mini">
              <el-radio-button label="DYNAMIC_SINGLE_CHOICE">单选</el-radio-button>
              <el-radio-button label="DYNAMIC_MULT_CHOICE">多选</el-radio-button>
            </el-radio-group>
          </div>
          <el-form-item label="填写设置" v-if="formAttribute.allowOtherValueChoiceBox">
            <el-select v-model="formAttribute.inputModle.inputType" size="mini" style="width:100%">
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item,index) of validationSettings"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字数限制" v-if="formAttribute.allowOtherValueChoiceBox">
            <el-input
              v-model="formAttribute.inputLimiteSizeChoiceBox"
              placeholder
              size="mini"
              style="width:60px;text-align:center"
              @blur="validateNumber(formAttribute.inputLimiteSizeChoiceBox)"
            ></el-input>
            <span style="color:#606266;margin-left:10px;">字</span>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span style="margin-left:20px;">每行代表一个选项，可以添加多个选项</span>
      <span slot="footer" class="dialog-footer">
        <el-input
          v-model="datalist"
          type="textarea"
          placeholder="请输入选项"
          rows="4"
          style="margin-bottom:30px;"
        ></el-input>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addAllOptions">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  props: ["formAttribute", "currentItem", "templateType"],
  data() {
    return {
      curChooseItem: {},
      setOther: false,
      dialogVisible: false,
      datalist: "",
      dragOptions: {
        animation: 120,
        scroll: true,
        group: {
          pull: false,
          name: "sortlist"
        },
        ghostClass: "ghost-style"
      },
      validationSettings: [
        {
          label: "文本",
          value: "NONE"
        },
        {
          label: "数字",
          value: "NUMBERS"
        }
        // {
        // 	label: '中文',
        // 	value: 'CHINESE'
        // },
        // {
        // 	label: '字母',
        // 	value: 'CHARACTERS'
        // },
        // {
        // 	label: '电话号码',
        // 	value: 'PHONE_NUMBER'
        // },
        // {
        // 	label: '邮箱',
        // 	value: 'EMAIL'
        // }
      ]
    };
  },
  components: {
    draggable
  },
  computed: {
    checkType() {
      return this.formAttribute.checkType;
    }
  },
  watch: {
    dialogVisible() {
      this.datalist = "";
    }
    // checkType(val) {
    //   console.log(this.currentItem);
    //   this.currentItem.componentType = val
    //     ? this.formAttribute.checkType
    //     : this.currentItem.componentType;
    // }
  },
  methods: {
    addOtherValue() {
      this.curChooseItem.otherValue.push({
        value: "",
        dynamicChoiceOtherValueType: "STRING_VALUE"
      });
    },
    deleteOtherValue(index) {
      this.curChooseItem.otherValue.splice(index, 1);
    },
    /**
     * 设置其他值
     */
    setOtherValue(item) {
      this.curChooseItem = item;
      this.setOther = true;
    },
    addFiled() {
      this.$emit("openDialog");
    },
    //单个增加选项
    addOptions() {
      this.formAttribute.dynamicChoiceValues.push({
        choiceValue: "",
        otherValue: [{
          value: "",
          dynamicChoiceOtherValueType: "STRING_VALUE"
        }]
      });
    },
    //删除选项
    deleteOptions(index) {
      this.formAttribute.dynamicChoiceValues.splice(index, 1);
    },
    //验证输入格式
    validateNumber(val) {
      if (!/^[0-9]*$/.test(Number(val))) {
        this.$message({
          message: "请输入数字",
          type: "warning",
          duration: "1000"
        });
        this.formAttribute.inputLimiteSizeChoiceBox = 500;
      }
    },
    //批量增加
    addAllOptions() {
      this.formAttribute.choiceItemsChoiceBox.push(
        ...this.datalist.split("\n").map(item => {
          return { choiceValue: item };
        })
      );
      this.closeDialog();
    },
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.datalist = "";
    },
    //打开对话框
    openDialog() {
      this.dialogVisible = true;
    }
  }
};
</script>
<style lang="scss">
.add-options input {
  width: 200px;
}

.add-optionss {
  margin: 6px 0 10px 0;
}

.add-optionss > li {
  position: relative;
  margin-bottom: 7px;
}

.add-optionss i {
  position: absolute;
  right: -5px;
  top: 6px;
  color: #606266;
  cursor: pointer;
}

.icon-piliangtianjia {
  font-size: 11px;
  margin-right: 4px;
}
.add-optionss .yidong {
  right: 35px;
  font-size: 14px;
}
.add-optionss .shezhi {
  right: 15px;
  font-size: 14px;
}
.add-optionss .yidong2 {
  right: 10px;
  font-size: 14px;
}
</style>
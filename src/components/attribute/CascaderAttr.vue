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
        <h3 class="form-title">选择设置</h3>
        <el-form-item label="选项层级">
          <el-select v-model="formAttribute.optionHierarchy" size="mini" style="width:100%">
            <el-option :label="index" :value="index" v-for="index in 4" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-button
          type="primary"
          plain
          size="mini"
          icon="iconfont icon-piliangtianjia"
          @click="openDialog"
        >批量增加选项</el-button>
      </div>
      <div class="line"></div>
      <div>
        <h3 class="form-title">此题设置</h3>
        <div class="form-item-box">
          <label class="el-form-item__label">允许其它值</label>
          <el-switch v-model="formAttribute.allowOtherValueChoiceBox"></el-switch>
        </div>
        <el-form-item label="布局">
					<fixed-column-width :formAttribute='formAttribute' />
        </el-form-item>
        <!-- <el-form-item label="填写设置" v-show="formAttribute.allowOtherValueChoiceBox">
          <el-select v-model="formAttribute.inputModle.inputType" size="mini" style="width:100%">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item,index) of validationSettings"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="字数限制" v-show="formAttribute.allowOtherValueChoiceBox">
          <el-input
            v-model="formAttribute.inputLimiteSizeChoiceBox"
            placeholder
            size="mini"
            style="width:80px;text-align:center"
            @blur="validateNumber(formAttribute.inputLimiteSizeChoiceBox)"
          ></el-input>
          <span style="color:#606266;margin-left:10px;">字</span>
        </el-form-item> -->
      </div>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <span>
        <span style="color:#26beff">"#"</span>的个数表示层级数，最多支持
        <span style="color:#26beff">{{formAttribute.optionHierarchy}}</span>级。
      </span>
      <el-input
        v-model="datalist"
        type="textarea"
        :placeholder="placeholder"
        rows="8"
        style="margin-top:10px;"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="medium">取 消</el-button>
        <el-button type="primary" @click="addAllOptions" size="medium">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { guid } from '@/utils.js'
import fixedColumnWidth from "./components/fixedColumnWidth.vue";
export default {
  props: ["formAttribute", "templateType"],
  data() {
    return {
      dialogVisible: false,
			datalist: "",
			placeholder:`#示例1
##示例1-1
#示例2
##示例2-1
##示例2-2
			`,
      validationSettings: [
        {
          label: "文本",
          value: "NONE"
        },
        {
          label: "数字",
          value: "NUMBERS"
        }
      ]
    };
  },
  components:{
    fixedColumnWidth // 设置列宽
  },
  created() {
    this.datalist =
      this.formAttribute.checkType === "CASCADER"
        ? ""
        : this.formAttribute.checkType;
  },
  methods: {
    addFiled() {
      this.$emit("openDialog");
    },
    openDialog() {
      this.datalist =
        this.formAttribute.checkType === "CASCADER"
          ? ""
          : this.formAttribute.checkType;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.datalist = "";
    },
    addAllOptions() {
      this.formAttribute.checkType = this.datalist; //保存输入的字符串，用于以后修改
      this.formAttribute.cascaderItemChoicBox = this.transformationStructure(
        this.datalist.split("\n")
      );
      if (this.formAttribute.cascaderItemChoicBox.length) {
        this.closeDialog();
      }
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
    //转化结构
    transformationStructure(data) {
      let flag = data.some(
        item =>
          item.split("#").length >
          parseInt(this.formAttribute.optionHierarchy + 1)
      );
      if (flag) {
        this.$message.error("下拉菜单已超出限定层级!");
        return [];
      }
      let parentId = null;
      for (let i = 2; i <= 5; i++) {
        for (let j = 0; j < data.length; j++) {
          if (typeof data[j] !== "object") {
            if (data[j].split("#").length === i) {
              data[j] = {
                label: data[j],
                id: guid()
              };
              if (
                typeof data[j - 1] === "object" &&
                data[j - 1].label.split("#").length === i - 1
              ) {
                parentId = data[j - 1].id;
              }
              data[j].parentId = parentId;
            }
          }
        }
      }
      return data.filter(item => {
        if (item.label) {
          item.label = item.label.replace(/#/g, "");
          return true;
        }
        return false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
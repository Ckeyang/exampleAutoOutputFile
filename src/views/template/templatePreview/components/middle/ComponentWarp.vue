<template>
  <li class="q_content" v-if="model.componentType !=='CUSTOMBOX' && model.componentType" >
    <div style="padding-left:10px">
      <span class="index-sort">{{sortIndex+1}}.</span>
      <div class="list-name">
        {{model.componentAttr.tag}}
        <span
          class="clearChoice"
          @click="clearChoice"
          v-if="isShowClear&&isShowClearBtn(model)"
        >清空</span>
      </div>
      <div>
        <Cascader
          v-if="model.componentType ==='CASCADER'"
          :controlId="model.id"
          :formAttribute="model.componentAttr"
          :formValue="model.formValue"
          :key="model.id"
        ></Cascader>
        <Date-picker
          v-if="model.componentType ==='DATEPICKER'"
          :id='model.id'
          type='form'
          :formAttribute="model.componentAttr"
          :formValue="model.formValue"
          @handleApplyRule="handleApplyRule"
        />
        <Inputs
          v-if="model.componentType ==='TEXTBOX'"
          @handleApplyRule="handleApplyRule"
          :projectId="model.projectId"
          :controlId="model.id"
          :formAttribute="model.componentAttr"
          :formValue="model.formValue"
        ></Inputs>
        <Check-box
          @handleApplyRule="handleApplyRule"
          curEnvironment="form"
					:isAllowAddOtherValue='isAllowAddOtherValue'
          :controlId="model.id"
          :key="model.id"
          v-if="model.componentType ==='CHECKBOX' || model.componentType ==='RADIOBOX' || model.componentType ==='COMBOBOX' || model.componentType ==='MULTIPLE_COMBOBOX'"
          :formAttribute="model.componentAttr"
          :formValue="model.formValue"
        ></Check-box>
        <Address
          v-if="model.componentType ==='ADDRESSBOX'"
          :formAttribute="model.componentAttr"
          :formValue="model.formValue"
        ></Address>
        <Dynamic-selection-box
          v-if="model.componentType ==='DYNAMIC_CHOICE'"
          curEnvironment="form"
          :formAttribute="model.componentAttr"
          :formValue="model.formValue"
        ></Dynamic-selection-box>
        <Image-input
          v-if="model.componentType ==='IMAGEBOX' || model.componentType ==='VIDEO' "
          :formAttribute="model.componentAttr"
          :formValue="model.formValue"
          :action="baseURL+'/files/file'"
        ></Image-input>
        <File-input
          v-if="model.componentType ==='FILEBOX'"
          :formAttribute="model.componentAttr"
          :formValue="model.formValue"
          :action="baseURL+'/files/file'"
        ></File-input>
        <Signature
          v-if="model.componentType ==='SIGNATURE'"
          :formAttribute="model.componentAttr"
          :formValue="model.formValue"
        ></Signature>
        <Industry-groups 
        v-else-if="model.componentType ==='INDUSTRY'" 
        :formAttribute='model.componentAttr' 
        :formValue='model.formValue'>
        </Industry-groups>
      </div>
    </div>
  </li>
</template>
<script>
import Inputs from "@/components/template/input.vue";
import CheckBox from "@/components/template/CheckBox.vue";
import Address from "@/components/template/Address.vue";
import ImageInput from "@/components/template/ImageInput.vue";
import FileInput from "@/components/template/FileInput.vue";
import DatePicker from "@/components/template/DatePicker.vue";
import Cascader from "@/components/template/Cascader.vue";
import DynamicSelectionBox from "@/components/template/DynamicSelectionBox.vue";
import Signature from "@/components/template/Signature.vue";
import IndustryGroups from '@/components/template/IndustryGroups.vue';
import environment from "@/environmental/index.js";
export default {
  name: "forms",
  props: {
    isShowClear:{type: Boolean,default:false},
    model: {
      type: Object,
      require: true
    },
    sortIndex: {
      require: true
    },
    currentIndex: {
      require: true
    },
    isLoop: {
      require: true
    },
    isCollapse: Boolean
	},
  components: {
    Inputs, //填空
    CheckBox, //单选、多选、下拉
    Address, //地址
    ImageInput, //图片上传
    FileInput, //文件上传
    DatePicker, //时间控件
    Cascader, //多级下拉框
    Signature, // 电子签名
    DynamicSelectionBox, //动态多选框
    IndustryGroups
  },
  computed: {
    IP() {
      return this.$store.state.Jurisdiction.IP;
    },
    formValue() {
      return this.model.formValue;
		},
		// 是否禁用添加其他值按钮
		isAllowAddOtherValue(){
			return this.$route.params.action === 'edit'
		}
  },
  data() {
    return {
      baseURL: environment.env().url
    };
  },
  methods: {
    isShowClearBtn(model){
      if(model.formValue.stringValue){
        if(model.componentType ==='RADIOBOX'){
          return true
        }else if(model.componentType ==='DATEPICKER' && model.componentAttr.dateType === 'TIME'){
          return true
        }
      }
      return false
    },
    handleApplyRule(val) {
      this.$emit("handleApplyRules", this.model.componentAttr.fieldId, val);
    },
    // 清空单选框
    clearChoice() {
      this.model.formValue.stringValue = "";
    }
  }
};
</script>
<style scoped>
.clearChoice {
  position: relative;
  margin-left: 15px;
  top: -1px;
  font-size: 12px;
  color: #1783ff;
  cursor: pointer;
}
.clearChoice:hover {
  color: #1884cc;
}
.index-sort {
  font-size: 14px;
  position: absolute;
  left: -20px;
  top: 1px;
  display: inline-block;
  width: 20px;
  text-align: right;
  color: #423e3e;
}
.redColor .list-name {
  color: #ec3e3e;
}
.index-sort.split-line {
  top: 15px;
}
.tool-bar {
  position: absolute;
  right: 60px;
  top: 25px;
  width: 160px;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  z-index: 2;
}

.tips-box > div:hover {
  color: #26beff;
}
.tips-box > div {
  width: 400px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 12px;
  font-weight: bold;
}
.saveOk-btn {
  position: absolute;
  right: 20px;
  cursor: pointer;
  top: 0;
}
.actor {
  position: absolute;
  right: 70px;
  cursor: pointer;
  top: 0;
  font-size: 12px;
}
.saveOk-btn:hover {
  color: #26beff;
}

.tool-bar i {
  cursor: pointer;
}

.tool-bar i:hover {
  color: #26beff;
}

li.q_content {
  position: relative;
}
li.q_content.isActive {
  border-color: #26beff;
  box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.1);
  margin: 24px 0;
}
.img-items {
  margin-right: 20px;
}
.list-name {
  color: #423e3e;
  font-size: 14px;
}
</style>
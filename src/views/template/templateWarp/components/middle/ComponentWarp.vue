<template>
  <li class="q_content" @click='setAttribute(sortIndex)' :class='{"isActive":sortIndex===currentIndex && sortIndex}'>
    <div class="tool-bar" >
        <i class="iconfont icon-yidong middleDrag" 
					 v-if="sortIndex"
					 title='拖动'></i>
        <i class="iconfont collapseList" :class="model.componentAttr.foldingSwitch? 'icon-shousuo2' : 'icon-shousuo1'" 
					 @click.stop='collapseList' 
					 v-if="model.componentType ==='CUSTOMBOX'"
					 :title="model.componentAttr.foldingSwitch?'收缩组件':'展开组件'"></i>
        <i class="icon-fuzhi iconfont" 
					 @click.stop='formCopy(sortIndex-1)' 
					 v-if="sortIndex && model.componentType !=='CUSTOMBOX'"
					 title='复制'></i>
        <i class="iconfont icon-shanchu" 
					 @click.stop='formDelete(sortIndex-1)' 
					 v-if="sortIndex"
					 title='删除'></i>
    </div>
    <div style="font-size: 16px;height:30px" :style="{fontSize:(17-(titleIndex+'').split('-').length * 1 +'px'  )}">
      <span class="index-sort" :class='{"first-index":sortIndex}' :style="{fontSize:(18-(titleIndex+'').split('-').length * 2 +'px'  )}">
        {{titleIndex || sortIndex}}
      </span>
			<span class="item-tag">{{model.componentAttr.tag}}</span><span class="clearChoice" @click="clearChoice" v-if='model.componentType ==="RADIOBOX" && model.formValue.stringValue'>清空</span>
      <!-- <i class='iconfont icon-yixuanzeziyang' v-if='model.componentAttr.fieldId'></i> -->
    </div>
      <div v-show='model.componentAttr.foldingSwitch || model.componentType !=="CUSTOMBOX"'>
        <date-picker v-if="model.componentType ==='DATEPICKER'" :formAttribute='model.componentAttr' :formValue='model.formValue'/>
        <Inputs v-else-if="model.componentType ==='TEXTBOX'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Inputs>
        <Cascader v-else-if="model.componentType ==='CASCADER'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Cascader>
        <Check-box  v-else-if="model.componentType ==='CHECKBOX' || model.componentType ==='RADIOBOX' || model.componentType ==='COMBOBOX' || model.componentType ==='MULTIPLE_COMBOBOX'"
          :formAttribute='model.componentAttr' :formValue='model.formValue'></Check-box>
        <dynamic-selection-box v-else-if='model.componentType==="DYNAMIC_CHOICE"|| model.componentType==="DYNAMIC_SINGLE_CHOICE"|| model.componentType ==="DYNAMIC_MULT_CHOICE"'  :formAttribute='model.componentAttr' :formValue='model.formValue'></dynamic-selection-box>
        <Address v-else-if="model.componentType ==='ADDRESSBOX'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Address>
        <Image-input v-else-if="model.componentType ==='IMAGEBOX' || model.componentType ==='VIDEO'" :formAttribute='model.componentAttr'
          :formValue='model.formValue' :action='IP+"/files/file"'></Image-input>
        <File-input v-else-if="model.componentType ==='FILEBOX'" :formAttribute='model.componentAttr' :formValue='model.formValue' :action='IP+"/files/file"'></File-input>
        <Signature v-else-if="model.componentType ==='SIGNATURE'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Signature>
        <Industry-groups v-else-if="model.componentType ==='INDUSTRY'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Industry-groups>
        <ul v-if='model.componentType ==="CUSTOMBOX" && isLoop' class="sub-question">
          <forms v-for='(subItem,index) of model.components' :key='index' :model='subItem' :isLoop='isLoop' :itemIndex='index' :titleIndex='titleIndex_Fn(index)'></forms>
        </ul>
      </div>
  </li>
</template>
<script>
import Inputs from '@/components/template/input.vue';
import CheckBox from '@/components/template/CheckBox.vue';
import Address from '@/components/template/Address.vue';
import ImageInput from '@/components/template/ImageInput.vue';
import FileInput from '@/components/template/FileInput.vue';
import DatePicker from '@/components/template/DatePicker.vue';
import Cascader from '@/components/template/Cascader.vue';
import DynamicSelectionBox from '@/components/template/DynamicSelectionBox.vue';
import Signature from '@/components/template/Signature.vue';
import IndustryGroups from '@/components/template/IndustryGroups.vue';
export default {
	name: 'forms',
	props: ['model', 'sortIndex', 'currentIndex', 'isLoop', 'itemIndex', 'titleIndex'],
	components: {
		Inputs, //填空
		CheckBox, //单选、多选、下拉
		Address, //地址
		ImageInput, //图片上传
		FileInput, //文件上传
		DatePicker, //时间控件
		Cascader, //多级下拉框
		Signature, //电子签名
		DynamicSelectionBox, //动态多选框
		IndustryGroups // 行业
	},
	computed: {
		IP() {
			return this.$store.state.Jurisdiction.IP;
		}
	},
	methods: {
		collapseList() {
			this.model.componentAttr.foldingSwitch = !this.model.componentAttr.foldingSwitch;
		},
		titleIndex_Fn(index) {
			if (index + 1) {
				return this.titleIndex + '-' + (index + 1);
			} else {
				return this.sortIndex;
			}
		},
		//复制表单组件
		formCopy(index) {
			//修改高亮index;
			this.$emit('formCopy', index);
		},
		//删除表单组件
		formDelete(index) {
			this.$nextTick(() => {
				this.$confirm('确定删除该表单项？', '', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
						this.$emit('formDelete', index);
				}).catch(() => {
				});
			});
		},
		//显示表单属性
		setAttribute(val) {
			if (val) {
				//显示隐藏属性栏，修改高亮index     true为显示属性栏，val为高亮索引
				this.$emit('changeisRightAttrFormShow', true, val);
			}
		},
		// 清空单选框
    clearChoice(){
      this.model.formValue.stringValue = ''
    }
	}
};
</script>
<style scoped>
.clearChoice{
	position: relative;
  margin-left: 15px;
	top: -1px;
	font-size: 12px;
  color: #1783FF;
  cursor: pointer;
}
.clearChoice:hover{
  color:#1884CC
}
.index-sort {
	font-size: 14px;
	font-weight: bold;
	color: #606266;
	position: absolute;
	top: 1px;
	left: -65px;
}
.first-index {
	top: 25px;
	left: 15px;
}
.sub-question {
	margin-left: 65px;
}
.item-tag{
	height: 18px;
	line-height: 18px;
}
.tool-bar {
	position: absolute;
	right: 44px;
	top: 25px;
	width: 135px;
	display: flex;
	justify-content: space-between;
	font-size: 20px;
	z-index: 2;
}

.tool-bar i {
	cursor: pointer;
	font-size: 16px;
}
.tool-bar .icon-shanchu{
	color: #d84636;
}
.tool-bar .icon-shanchu:hover{
	color: #b73224;
}

.tool-bar i:hover {
	color: #107AC2;
}
li.q_content.isActive {
	border-left-color: #107AC2;
	/* box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.1); */
	margin: 15px 0;
	background: #E6F9FF
}
li.q_content.isActive .q_content{
	background: #E6F9FF
}
.icon-yixuanzeziyang {
	color: #107AC2;
	font-size: 14px;
	margin-left: 6px;
	vertical-align: middle;
	position: relative;
	top: -2px;
}
</style>
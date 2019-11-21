<template>
  <li class="q_content" @click='setAttribute(sortIndex)' :class='{"isActive":sortIndex===currentIndex && sortIndex}'>
    <!-- <span class="index-sort" v-if='sortIndex'>{{ titleIndex || sortIndex}}</span>  -->
    <div class="tool-bar">
      <i class="iconfont icon-yidong middleDrag" 
					 v-if="sortIndex"
					 title='拖动'></i>
        <i class="iconfont collapseList" :class="model.componentAttr.foldingSwitch? 'icon-shousuo1' : 'icon-shousuo2'" 
					 @click.stop='collapseList' 
					 v-if="model.componentType ==='CUSTOMBOX'"
					 :title="model.componentAttr.foldingSwitch?'展开组件':'收缩组件'"></i>
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
      {{model.componentAttr.tag}}
      <i class='iconfont icon-yixuanzeziyang' v-if='model.componentAttr.fieldId'></i>
    </div>
    <!-- <el-collapse-transition> -->
      <div v-show='model.componentAttr.foldingSwitch || model.componentType !=="CUSTOMBOX" '>
        <Date-picker v-if="model.componentType ==='DATEPICKER'" :formAttribute='model.componentAttr' :formValue='model.formValue'
        />
        <Inputs v-if="model.componentType ==='TEXTBOX'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Inputs>
        <Cascader v-if="model.componentType ==='CASCADER'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Cascader>
        <Check-box v-if="model.componentType ==='CHECKBOX' || model.componentType ==='RADIOBOX' || model.componentType ==='COMBOBOX' || model.componentType ==='MULTIPLE_COMBOBOX'"
          :formAttribute='model.componentAttr' :formValue='model.formValue'></Check-box>
        <dynamic-selection-box v-if='model.componentType==="DYNAMIC_CHOICE"||model.componentType==="DYNAMIC_SINGLE_CHOICE"||model.componentType==="DYNAMIC_MULT_CHOICE"'  :formAttribute='model.componentAttr' :formValue='model.formValue'></dynamic-selection-box>
        <Address v-if="model.componentType ==='ADDRESSBOX'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Address>
        <Image-input v-if="model.componentType ==='IMAGEBOX' || model.componentType ==='VIDEO'" :formAttribute='model.componentAttr'
          :formValue='model.formValue' action='/files/file'></Image-input>
        <File-input v-if="model.componentType ==='FILEBOX'" :formAttribute='model.componentAttr' :formValue='model.formValue' action='/files/file'></File-input>
        <ul v-if='model.componentType ==="CUSTOMBOX" && isLoop' class="sub-question">
          <forms v-for='(subItem,index) of model.components' :key='index' :model='subItem' :isLoop='isLoop' :itemIndex='index' :titleIndex='titleIndex_Fn(index)'></forms>
        </ul>
      </div>
    <!-- </el-collapse-transition> -->
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
export default {
  name: 'forms',
  props: [
    'model',
    'sortIndex',
    'currentIndex',
    'isLoop',
    'itemIndex',
    'titleIndex'
  ],
  components: {
    Inputs, //填空
    CheckBox, //单选、多选、下拉
    Address, //地址
    ImageInput, //图片上传
    FileInput, //文件上传
    DatePicker, //时间控件
    Cascader, //多级下拉框
    DynamicSelectionBox //动态多选框
  },
  computed: {
    IP() {
      return this.$store.state.Jurisdiction.IP;
    }
  },
  methods: {
    collapseList() {
      this.model.componentAttr.foldingSwitch = !this.model.componentAttr
        .foldingSwitch;
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
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$emit('formDelete', index);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      });
    },
    //显示表单属性
    setAttribute(val) {
      if (val) {
        //显示隐藏属性栏，修改高亮index     true为显示属性栏，val为高亮索引
        this.$emit('changeisRightAttrFormShow', true, val);
      }
    }
  }
};
</script>
<style scoped>
.index-sort {
  font-size: 14px;
  font-weight: bold;
  color: #606266;
  position: absolute;
  top: 1px;
  left: -65px;
}
.first-index {
  top: 24px;
  left: 15px;
}
.sub-question {
  margin-left: 65px;
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

.tool-bar i {
  cursor: pointer;
}

.tool-bar i:hover {
  color: #1D7FFF;
}

li.q_content.isActive {
  border-color: #1D7FFF;
  box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.1);
  margin: 15px 0;
}
.icon-yixuanzeziyang {
  color: #1D7FFF;
  font-size: 14px;
  margin-left: 6px;
  vertical-align: middle;
  position: relative;
  top: -2px;
}
</style>
<template>
    <div  style='height:100%'>
         <h6 class="box-title red-title">
          <span>组件属性</span>
        </h6>
        <input-attr :formAttribute='currentItem.componentAttr' v-if='currentItem.componentType==="TEXTBOX"'></input-attr>
        <datapicker-attr :formAttribute='currentItem.componentAttr' v-else-if='currentItem.componentType==="DATEPICKER"'></datapicker-attr>
        <Cascader-attr :formAttribute='currentItem.componentAttr' v-else-if='currentItem.componentType==="CASCADER"'></Cascader-attr>
        <check-box :formAttribute='currentItem.componentAttr'  :currentItem='currentItem' v-else-if='currentItem.componentType==="RADIOBOX" || currentItem.componentType==="CHECKBOX" || currentItem.componentType==="COMBOBOX" || currentItem.componentType==="MULTIPLE_COMBOBOX"'></check-box>
        <address-attr :formAttribute='currentItem.componentAttr' v-else-if='currentItem.componentType==="ADDRESSBOX"'></address-attr>
        <dynamic-selection-box-attr :formAttribute='currentItem.componentAttr' :currentItem='currentItem'  v-else-if='currentItem.componentType==="DYNAMIC_CHOICE"||currentItem.componentType==="DYNAMIC_SINGLE_CHOICE"||currentItem.componentType==="DYNAMIC_MULT_CHOICE"'></dynamic-selection-box-attr>
        <Custom-templateAttr :formAttribute='currentItem.componentAttr' v-else-if='currentItem.componentType==="CUSTOMBOX"'></Custom-templateAttr>
        <upload-attr :formAttribute='currentItem.componentAttr' v-else-if='currentItem.componentType==="FILEBOX" || currentItem.componentType==="IMAGEBOX" || currentItem.componentType==="VIDEO"' :currentItem='currentItem'></upload-attr>
        <Template-attr :formAttr='formAttr' v-else-if='formAttr.isShowFormAttr' ></Template-attr>
        <Custom-assembly-attr  :customAssembly='customAssembly' v-else-if='formAttr.isShowAssemblyAttr'></Custom-assembly-attr>
    </div>
</template>
<script>
import inputAttr from '@/components/attribute/InputAttr.vue';
import checkBox from '@/components/attribute/RadioAttr.vue';
import AddressAttr from '@/components/attribute/AddressAttr.vue';
import CustomTemplateAttr from '@/components/attribute/CustomTemplateAttr.vue';
import uploadAttr from '@/components/attribute/uploadAttr.vue';
import TemplateAttr from '@/components/attribute/TemplateAttr.vue';
import CustomAssemblyAttr from '@/components/attribute/CustomAssemblyAttr.vue';
import DatapickerAttr from '@/components/attribute/DatapickerAttr.vue';
import CascaderAttr from '@/components/attribute/CascaderAttr.vue';
import DynamicSelectionBoxAttr from '@/components/attribute/DynamicSelectionBoxAttr.vue';
export default {
  data() {
    return {
      data: []
    };
  },
  props: ['currentItem', 'customAssembly', 'formAttr'],
  components: {
    inputAttr, //填空
    checkBox, //单选、多选、下拉
    AddressAttr, //地址
    CustomTemplateAttr, // 自定义组件
    uploadAttr,
    TemplateAttr, //模板的基本信息
    CustomAssemblyAttr, // 组件的基本信息
    DatapickerAttr, //时间控件
    CascaderAttr, //多级下拉框
    DynamicSelectionBoxAttr //动态多选框
  }
};
</script>
<style scoped>
.box-title {
  font-size: 15px;
  display: flex;
  align-items: center;
}

.box-title::before {
  content: '';
  display: inline-block;
  width: 2px;
  height: 16px;
  position: relative;
  left: -10px;
  background: #1d7fff;
}
.box-title.red-title::before {
  background: #fc5a4c;
}
</style>
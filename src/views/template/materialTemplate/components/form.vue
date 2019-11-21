<template>
  <li class="q_content">
     <div class="customeBoxTitle" v-if='model.componentType ==="CUSTOMBOX"'><h3>{{model.index}}&nbsp;&nbsp;{{model.componentAttr.tag}}</h3></div>
     <div v-else style="margin: 10px 0"><h5>{{model.index}}&nbsp;&nbsp;{{model.componentAttr.tag}}</h5></div>
    <div>
      <Date-picker v-if="model.componentType ==='DATEPICKER'" :formAttribute='model.componentAttr' :formValue='model.formValue' />
      <Inputs v-if="model.componentType ==='TEXTBOX'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Inputs>
      <Cascader v-if="model.componentType ==='CASCADER'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Cascader>
      <Check-box v-if="model.componentType ==='CHECKBOX' || model.componentType ==='RADIOBOX' || model.componentType ==='COMBOBOX' "
        :formAttribute='model.componentAttr' :formValue='model.formValue'></Check-box>
      <Address v-if="model.componentType ==='ADDRESSBOX'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Address>
      <Image-input v-if="model.componentType ==='IMAGEBOX' || model.componentType ==='VIDEO'" :formAttribute='model.componentAttr' :formValue='model.formValue' action='/files/file'></Image-input>
      <File-input v-if="model.componentType ==='FILEBOX'" :formAttribute='model.componentAttr' :formValue='model.formValue' action='/files/file'></File-input>
      <!-- <Segmenting-line v-if="model.componentType ==='SPLIT_LINE'"></Segmenting-line> -->
    </div>
    <ul v-if='model.componentType ==="CUSTOMBOX" ' class="sub-question">
      <forms v-for='(subItem,index) of model.components' :key='index' :model='subItem'></forms>
    </ul>
  </li>
</template>
<script>
import Inputs from '@/components/template/input.vue';
import CheckBox from '@/components/template/CheckBox.vue';
import Address from '@/components/template/Address.vue';
import ImageInput from '@/components/template/ImageInput.vue';
import FileInput from '@/components/template/FileInput.vue';
import DatePicker from '@/components/template/DatePicker.vue';
// import SegmentingLine from '@/components/template/SegmentingLine.vue';
export default {
  name: 'forms',
  props: ['model'],
  components: {
    Inputs, //填空
    CheckBox, //单选、多选、下拉
    Address, //地址
    ImageInput, //图片上传
    FileInput, //文件上传
    DatePicker //时间控件
    // SegmentingLine，
  },
  computed: {
    IP() {
      return this.$store.state.Jurisdiction.IP;
    }
  },
  methods: {}
};
</script>
<style scoped>
.customeBoxTitle {
  margin: 10px 0;
  font-size: 16px;
}
.index-sort {
  font-size: 20px;
  position: absolute;
  left: 15px;
  top: 25px;
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

.tool-bar i {
  cursor: pointer;
}

.tool-bar i:hover {
  color: #26beff;
}
.sub-question .q_content {
   margin-left:2em;
}
li.q_content.isActive {
  border-color: #26beff;
  box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.1);
  margin: 24px 0;
}
</style>
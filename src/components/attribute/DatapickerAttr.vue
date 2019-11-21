<template>
  <div>
    <el-form ref="form" :model="formAttribute" label-width="70px" label-position='top'>
      <el-form-item label="文本标签">
        <el-input v-model="formAttribute.tag" placeholder="请输入内容" size='mini' clearable v-show="formAttribute.fieldId"></el-input>
        <el-button type="primary" size='mini' style="position: absolute;top:-29px;right:0" icon="iconfont icon-jia" @click='addFiled'>选择字段</el-button>
      </el-form-item>
      <div class="line"></div>
      <div>
        <h3 class="form-title">填写设置</h3>
        <el-form-item label="填写设置">
          <el-select v-model="formAttribute.dateType" size='mini' style="width:100%">
            <el-option :label="item.label" :value="item.value" v-for='(item,index) of dateTypeList' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="布局">
					<fixed-column-width :formAttribute='formAttribute' />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import fixedColumnWidth from "./components/fixedColumnWidth.vue";
  export default {
    props: ['formAttribute', 'templateType'],
    data() {
      return {
        dateTypeList: [
          {
            value: 'YEAR',
            label: '年代'
          },
          {
            value: 'YEAR_MONTH',
            label: '年月'
          },
          {
            value: 'YEAR_MONTH_DAY',
            label: '年月日'
          },
          {
            value: 'YEAR_MONTH_DAY_TIME',
            label: '年月日 + 时间'
          },
          {
            value: 'TIME',
            label: '时间'
          }
        ]
      };
    },
    components:{
      fixedColumnWidth // 设置列宽
    },
    methods: {
      addFiled() {
        this.$emit('openDialog');
      }
    }
  };
</script>
<style lang="scss" scoped>
</style>
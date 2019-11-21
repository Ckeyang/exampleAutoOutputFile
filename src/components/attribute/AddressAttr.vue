<template>
  <div>
    <el-form ref="form" :model="formAttribute" label-width="70px" label-position='top'>
      <el-form-item label="文本标签">
        <el-input v-model="formAttribute.tag" placeholder="请输入内容" size='mini' clearable v-show="formAttribute.fieldId"></el-input>
        <el-button type="primary" size='mini' style="position: absolute;top:-29px;right:0" icon="iconfont icon-jia" @click='addFiled'>选择字段</el-button>
      </el-form-item>
      <div class="line"></div>
      <div>
        <h3 class="form-title">此题设置</h3>
        <el-form-item label="填写程度">
          <el-select v-model="formAttribute.addressDetailAddress" placeholder="请选择" size='small'>
            <el-option v-for="item in data" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
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
      data: [
        {
          label: '详细到省/自治区/直辖市',
          value: 'PROVINCE'
        },
        {
          label: '详细到市',
          value: 'CITY'
        },
        {
          label: '详细到区县',
          value: 'COUNTY'
        },
        {
          label: '详细到乡镇',
          value: 'TOWN'
        },
        {
          label: '详细到街道信息',
          value: 'STREET'
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
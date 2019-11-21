<template>
  <div>
    <el-form ref="form" :model="formAttribute" label-width="70px" label-position='top'>
      <el-form-item label="文本标签">
        <el-input v-model="formAttribute.tag" placeholder="请输入内容" size='mini' clearable  v-show="formAttribute.fieldId"></el-input>
        <el-button type="primary" size='mini' style="position: absolute;top:-29px;right:0" icon="iconfont icon-jia" @click='addFiled'>选择字段</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
	props: ['formAttribute', 'templateType' , 'formValue'], //templateType 模板类型，如果为PROJECT 则要选择字段
	methods: {
		addFiled() {
			this.$emit('openDialog');
		},
	}
};
</script>
<style scoped>
</style>

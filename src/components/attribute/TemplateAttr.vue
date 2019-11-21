<template>
    <div>
        <el-form ref="form" :model="formAttr" label-width="70px" label-position='left'>
            <el-form-item label="组件名称">
                <el-input v-model="formAttr.formTitle" placeholder="请输入内容" size='mini' clearable></el-input>
            </el-form-item>
            <el-form-item label="组件描述">
                <el-input v-model="formAttr.description" type='textarea' :autosize="{ minRows: 4, maxRows: 10}" placeholder="请输入内容"
                    size='mini'></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  props: ['formAttr']
};
</script>
<style scoped>
</style>

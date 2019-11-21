<template>
    <div>
        <el-form ref="form" :model="formAttribute" label-width="70px" label-position='top'>
            <el-form-item label="组件描述">
                <el-input v-model="formAttribute.descriptionCustomWidget" type='textarea' :autosize="{ minRows: 4, maxRows: 10}" placeholder="请输入内容"
                    size='mini'></el-input>
            </el-form-item>
            <div class="form-item-box">
                <label class="el-form-item__label">是否可添加多条</label>
                <el-switch v-model="formAttribute.isMultipleCustomWidget">
                </el-switch>
            </div>
        </el-form>
    </div>
</template>
<script>
    export default {
        props: ['formAttribute', 'templateType'],
        methods: {
            addFiled() {
                this.$emit('openDialog');
            },
        }
    };
</script>
<template>
    <el-form label-position="left" label-width="70px" :model="customAssembly" >
        <el-form-item label="组件名称">
          <el-input v-model="customAssembly.component.componentAttr.name" size='small'  ></el-input>
        </el-form-item>
        <!-- <el-form-item label="使用范围">
          <el-radio-group v-model="customAssembly.component.componentAttr.privateCustomWidget" class="radio-box">
            <el-radio :label='true'>仅作者可用</el-radio>
            <el-radio :label="false">公开给所有用户</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="组件描述">
          <el-input v-model="customAssembly.component.componentAttr.descriptionCustomWidget" type='textarea' size='small'></el-input>
        </el-form-item>
        <!-- <el-form-item label="图标设置">
          <Upload :fileRegexp='new RegExp(/^\.png$/)' :limit='1' v-model='fileList' tipMesg='只能上传png格式图片，且不超过500kb，建议图标大小14x14'></Upload>
        </el-form-item> -->
      </el-form>
</template>
<script>
import Upload from '@/components/tools/UpLoad.vue';
export default {
  data() {
    return {
      fileList: []
    };
  },
  props: ['customAssembly'],
  components: {
    Upload
  }
};
</script>
<style scoped>
</style>


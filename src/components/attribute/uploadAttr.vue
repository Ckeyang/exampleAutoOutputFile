<template>
    <div>
        <el-form ref="form" :model="formAttribute" label-width="70px" label-position='top'>
             <el-form-item label="文本标签">
        <el-input v-model="formAttribute.tag" placeholder="请输入内容" size='mini' clearable v-show="formAttribute.fieldId"></el-input>
        <el-button type="primary" size='mini' style="position: absolute;top:-29px;right:0" icon="iconfont icon-jia" @click='addFiled' >选择字段</el-button>
      </el-form-item>
            <div v-show='componentType==="IMAGEBOX" || componentType==="VIDEO"' >
              <div class="line"></div>
                <h3 class="form-title">填写设置</h3>
                <div class="form-item-box">
                    <label class="el-form-item__label">类型</label>
                    <el-radio-group v-model="formAttribute.checkType" size="mini">
                        <el-radio-button label="IMAGE">图片</el-radio-button>
                        <el-radio-button label="VIDEO">视频</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div class="line"></div>
            <div>
                <h3 class="form-title">选项设置</h3>
                <!-- <el-form-item label="单个文件大小(MB)" label-width="180px">
                    <el-input v-model="formAttribute.upLoadFileSizeFileBox" placeholder="" size='mini' @blur="validateNumber(formAttribute.upLoadFileSizeFileBox,'upLoadFileSizeFileBox')"></el-input>
                </el-form-item> -->
                <el-form-item label="文件数量限制" label-width="180px">
                    <el-input v-model="formAttribute.upLoadFileNumFileBox"  size='mini' @blur="validateNumber(formAttribute.upLoadFileNumFileBox,'upLoadFileNumFileBox')"></el-input>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
export default {
  props: ['formAttribute', 'componentType', 'templateType'],
  methods: {
    addFiled() {
      this.$emit('openDialog');
    },
    validateNumber(val, type) {
      if (!/^[0-9]*$/.test(Number(val))) {
        this.$message({
          message: '请输入数字',
          type: 'warning',
          duration: '1000'
        });
        if (type === 'upLoadFileSizeFileBox') {
          this.formAttribute.upLoadFileSizeFileBox = '100';
        } else {
          this.formAttribute.upLoadFileNumFileBox = '20';
        }
      }
    }
  }
};
</script>
<style vlang="scss" scoped>
</style>
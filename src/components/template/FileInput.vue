<template>
    <div class="fileUploads">
         <el-form label-position="top" label-width="80px" @submit.native.prevent>
                <el-form-item >
                    <el-upload
                        name='upload'
                        class="upload-demo"
                        drag
                        ref="upload"
                        multiple
                        :action="action"
                        :file-list="fileList"
                        :limit="Number(formAttribute.upLoadFileNumFileBox) || 1"
                        :on-success="handleAvatarSuccess"
                        :on-exceed='handleExceed'
                        :on-remove="handleRemove"
                         :before-upload="beforeUpload">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><br/>
                          <div class="el-upload__tip up-tip" slot="tip">文件大小不超过{{formAttribute.upLoadFileSizeFileBox||10}}MB</div>  
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
    </div>
</template>
<script>
export default {
  name: 'fileInput',
  data() {
    return {
      fileList: []
    };
  },
  props: ['formAttribute', 'action', 'formValue'],
  created() {
    this.fileList = JSON.parse(JSON.stringify(this.formValue.imageValue.length && this.formValue.imageValue[0].url  ? this.formValue.imageValue : []));
  },
  destroyed(){
    this.fileList = []
  },
  methods: {
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < this.formAttribute.upLoadFileSizeFileBox || 10;
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过' + this.formAttribute.upLoadFileSizeFileBox || 10 + 'MB!');
      }
      return isLt2M;
    },
    handleAvatarSuccess(res, file) {
      let type = '';
      if (file.raw.type.indexOf('image') !== -1) {
        type = 'IMAGE';
      } else if (file.raw.type.indexOf('video') !== -1) {
        type = 'VIDEO';
      } else {
        type = 'FILE';
      }
      this.formValue.imageValue.push(
        { url: res.data, author: sessionStorage.userName, name: file.name, fileType: type }
      )
    },
    handleRemove(index) {
      this.fileList.splice(index, 1);
      this.formValue.imageValue = this.fileList.map(item=>{
        return JSON.parse(JSON.stringify(item))
      })
    },
    handleExceed() {
      this.$message({
        message: `最多上传${this.formAttribute.upLoadFileNumFileBox || 1}个文件`,
        type: 'warning'
      });
    }
  }
};
</script>
<style  scoped>
.fileUploads >>> .el-upload-dragger:hover{
  border-color: #1884CC;
}
.fileUploads{
  max-width:400px; 
  margin-top: 5px;
}
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.fileUploads >>> .up-tip{
  position: relative;
  top: -20px;
  left: 0;
  width: 360px;
  text-align: center;
}
</style>
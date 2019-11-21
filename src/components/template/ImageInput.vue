<template>
  <div>
    <el-form label-position="top" label-width="80px" @submit.native.prevent>
      <el-form-item >
        <ul class="upload-preview_box">
          <li v-for='(item,index) of formValue.imageValue' :key='index' @click='previewImg(item.url,item.fileType)' v-show='item.url'>
            <div style="width: 146px;height: 110px;">
              <img :src="item.url" alt="" v-if='item.fileType==="IMAGEBOX"' style="cursor: pointer;">
              <a :href="item.url" target="_blank" class="paly-btn" v-else></a>
            </div>
            <p class="author" :title='item.author'>{{item.author}}</p>
            <p class="pic-name" :title='item.name'>{{item.name}}</p>
            <i class="dete-icon el-icon-close " @click.stop='handleRemove(index)'></i>
          </li>
          <li>
            <el-upload class="avatar-uploader" 
              ref="img-upload"
              name="upload" 
              :action="action" 
              multiple  
              :limit="Number(formAttribute.upLoadFileNumFileBox) || 1"
              :on-exceed='handleExceed'
              :show-file-list="false" list-type="picture-card" :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus"></i>
              <div style="font-size: 12px;width:88%;margin:auto">{{tips}}</div>
            </el-upload>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img  :src="dialogImageUrl" alt="加载失败">
    </el-dialog> -->
  </div>
</template>
<script>
export default {
  name: 'imageInput',
  data() {
    return {
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '' //预览的url
    };
  },
  computed:{
    tips(){
      if(this.formAttribute.checkType === 'IMAGEBOX'){
        return `最多可上传${this.formAttribute.upLoadFileNumFileBox}张图片,且单张大小不超过${this.formAttribute.upLoadFileSizeFileBox || 10}M`
      }else{
        return `最多可上传${this.formAttribute.upLoadFileNumFileBox}个视频,且单个大小不超过${this.formAttribute.upLoadFileSizeFileBox || 10}M`
      }
    }
  },
  created() {
    this.fileList = JSON.parse(JSON.stringify(this.formValue.imageValue.length && this.formValue.imageValue[0].url  ? this.formValue.imageValue : []));
  },
  destroyed(){
    this.fileList = []
  },
  props: ['formAttribute', 'action', 'formValue'],
  methods: {
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < (Number(this.formAttribute.upLoadFileSizeFileBox) || 10);
      if (this.formAttribute.checkType === 'IMAGEBOX') {
        const isImage = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
        if (!isImage) {
          this.$message.error('只能上传图片');
        }
        if (!isLt10M) {
          this.$message.error('上传图片大小不能超过 ' + (Number(this.formAttribute.upLoadFileSizeFileBox) || 10) + 'MB!');
        }
        return isImage && isLt10M;
      } else {
        const isImage = ['video/AVI', 'video/wma', 'video/rmvb', 'video/flash', 'video/mp4'].includes(file.type);
        if (!isImage) {
          this.$message.error('只能上传视频');
        }
        if (!isLt10M) {
          this.$message.error('上传视频大小不能超过 ' + (Number(this.formAttribute.upLoadFileSizeFileBox) || 10) + 'MB!');
        }
        return isImage && isLt10M;
      }
    },
    handleAvatarSuccess(res, file) {
     this.formValue.imageValue.push({ url: res.data, author: sessionStorage.userName, name: file.name.replace(/\.(png|jpg|gif|mp4|AVI|wma|rmvb|flash)$/, ''), fileType: this.formAttribute.checkType });
    },
    handleRemove(index) {
      this.formValue.imageValue.splice(index, 1);
      // 因为自定义了删除事件，所以el-upload底层的fileList不能同步删除，导致个数限制出现错误，所以需要手动删除
      this.$refs['img-upload'].$children[0].fileList.splice(index, 1)  
    },
    handleExceed() {
      this.$message({
        message: `最多可上传${this.formAttribute.upLoadFileNumFileBox || 1}${this.formAttribute.checkType === 'IMAGEBOX' ? '张图片' : '个视频'}`,
        type: 'warning'
      });
    },
    //预览
    previewImg(url, fileType) {
      if (fileType === 'IMAGEBOX') {
        this.dialogVisible = true;
        this.dialogImageUrl = url;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.upload-preview_box{
  margin-top: 5px;
}
.dete-icon {
  position: absolute;
  right: 7px;
  bottom: 7px;
  font-size: 14px;
  cursor: pointer;
}

.dete-icon:hover {
  color: #26beff;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.paly-btn {
  color: #000;
  display: inline-block;
  width: 100%;
  height: 110px;
  background: url('../../assets/img.png');
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.upload-preview_box > li:not(:last-child) {
  float: left;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 178px;
  margin: 0 8px 8px 0;
  display: block;
  position: relative;
  transition: 0.3s;
}
.upload-preview_box li:not(:last-child):hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.upload-preview_box li img {
  width: 146px;
  height: 110px;
}

.upload-preview_box li .author {
  margin-left: 10px;
  line-height: 20px;
  padding-top: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-preview_box li .pic-name {
  margin-left: 10px;
  margin-top: 2px;
  line-height: 20px;
  font-size: 12px;
  color: #9badcc;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  font-size: 12px;
}

.dete-icon {
  opacity: 0;
  transition: all 0.2s;
}

.el-icon-plus {
  margin-top: 55px;
}

.upload-preview_box li:hover .dete-icon {
  opacity: 1;
}
</style>
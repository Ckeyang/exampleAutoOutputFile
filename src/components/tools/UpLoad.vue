<template>
    <div>
        <el-upload class="upload-demo upload-custom" style="line-height: 25px" ref="upload" name="upload" multiple action="/files/file"
            :file-list="fileList" :before-upload="beforeUpload"  :limit=limit  :on-success="handleAvatarSuccess" :on-error='handleError' :on-remove='heandleRemova' :on-exceed="handleExceed" :auto-upload="false" :on-change="handleShowBtn"
            :show-file-list="true">
            <div style="float: left;">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </div>
            <div slot="tip" class="el-upload__tip">{{tipMesg}}</div>
        </el-upload>
        <el-button style="margin-left: 10px;position: absolute;top: 0;left: 94px;" size="small" type="success" @click="submitUpload" v-show="isShowUploadsBtn">上传到服务器</el-button>
        <div v-if='fileList.length' class="imgPrevew"><img :src="item.url" alt="" v-for='item of fileList' :key='item.url' ></div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      fileList: [],
      isShowUploadsBtn: false
    };
  },
  created() {
    this.fileList = this.value.length && this.value[0].url ? this.value : [];
  },
  props: ['fileRegexp', 'errorMesg', 'limit', 'tipMesg', 'value'],
  watch: {
    value(val) {
      if (val.length) {
        this.fileList = this.value;
      }
    }
  },
  methods: {
    //检查所传文件的格式
    beforeUpload(file) {
      if (this.fileRegexp.test(file.name)) {
        this.$message.warning(errorMesg);
        return false;
      }
    },
    handleExceed() {
      this.$message.warning(`只能选择${this.limit}个文件，请删除后再选择`);
    },
    //移除文件
    heandleRemova(res) {
      this.fileList = this.fileList.filter((item) => item.url !== res.url);
    },
    //上传成功
    handleAvatarSuccess(res) {
      this.fileList.push({ name: res.data, url: res.data });
      this.$emit('input', this.fileList);
    },
    handleError(err) {
      this.$message.warning(err);
    },
    // 显示上传按钮
    handleShowBtn() {
      this.isShowUploadsBtn = true;
    },
    submitUpload() {
      this.$refs.upload.submit();
    }
  }
};
</script>
<style scoped>
.imgPrevew {
  position: absolute;
  top: 0;
  left: 250px;
}
.imgPrevew img {
  width: 20px;
  height: 20px;
}
</style>


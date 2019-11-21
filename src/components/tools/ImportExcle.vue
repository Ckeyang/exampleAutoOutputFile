<template>
  <div>
    <el-dialog title="导入数据" :visible.sync="dialogVisible" width="30%">
      <div class="upload-box">
        <el-upload
          class="upload-demo"
          :limit="limit"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :before-upload="beforeUpload"
          drag
          action="#"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过1M</div>
        </el-upload>
      </div>
      <!-- <input type="file" name="FileUpload" id="FileUpload" /> <button @click="upload">上传</button> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="medium">取 消</el-button>
        <el-button type="primary" @click="importData" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "importexcle",
  data() {
    return {
      dialogVisible: false,
      fileList: []
    };
  },
  props: {
    limit: {
      //每次上传限制
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: "ALL"
    }
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`每次只能上传${this.limit}个文件，请删除文件列表后再试`);
    },
    beforeUpload: function(file) {
      let suffix = file.name.substr(file.name.lastIndexOf("."));
      if (this.type === "EXCEL" && ".xls" != suffix && ".xlsx" != suffix) {
        this.$message.error("选择Excel格式的文件导入！");
        return false;
      }
      var fd = new FormData();
      fd.append("upload", file);
      this.$http.fileService
        .uploadFile(fd)
        .then(res => {
          this.fileList = [{ name: file.name, url: res.data }];
        })
        .catch(err => {
          this.$message.error(`上传失败`);
        });
      return false; // 返回false不会自动上传
    },
    closeDialog() {
      this.fileList = [];
      this.dialogVisible = false;
    },
    //导入数据
    importData() {
      if (!this.fileList.length) {
        this.$message.error("请先上传文件!");
        return;
      }
      this.$emit("importExcleData", this.fileList[0].url);
      this.closeDialog();
    }
  }
};
</script>
<style scoped>
.upload-box {
  text-align: center;
  margin-top: 10px;
}
.upload-box >>> .el-upload-dragger,
.upload-box >>> .el-upload--text {
  width: 300px;
  height: 150px;
}
.upload-box >>> .el-upload__tip,
.upload-box >>> .el-upload-list {
  width: 300px;
  margin: auto;
  text-align: left;
}
</style>

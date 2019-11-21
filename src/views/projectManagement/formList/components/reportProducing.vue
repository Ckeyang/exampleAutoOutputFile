<template>
  <el-dialog
    :visible.sync="dialogVisible"
    v-el-drag-dialog
    width="28%"
    :close-on-click-modal="false"
    :show-close="false"
    custom-class="reportWait"
  >
    <div class="loading-box">
      <i class="icon-i-shengchengzhong iconfont"></i>
      <span class="title">报告生成中......</span>
    </div>
    <p class="tips">
      请耐心等待，待成功后，点击“下载报告”
      查看相关的报告内容。
    </p>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "reportProducing",
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods:{
    openDialog(){
      this.dialogVisible = true
      const timer = setTimeout(()=>{
        clearTimeout(timer)
        this.dialogVisible = false;
      },2000)
    },
  }
};
</script>

<style scoped>
  .reportWait.el-dialog .el-dialog__body{
    border:none;
  }
  .loading-box{
    display: flex;
    align-items: center;
  }
  .reportWait .title{
    font-size: 15px;
    font-weight: bold;
    color: #344152;
  }
  .reportWait .tips{
    padding-left: 34px;
    color: #556A85;
    margin-top: 10px;
  }
  .icon-i-shengchengzhong{
    color:#1d7fff;
    font-size:22px;
    margin-right: 10px;
  }
 
  .icon-i-shengchengzhong::before{
    animation: rotate 2s linear infinite;
      display: inline-block;
    }
    @keyframes rotate {
      from { transform: rotate(0deg)}
      to { transform: rotate(360deg)}
    } 
</style>

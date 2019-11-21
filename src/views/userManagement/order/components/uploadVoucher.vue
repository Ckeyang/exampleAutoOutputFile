<template>
  <el-dialog
    width="30%"
    title="上传转账凭证"
    :visible.sync="uploadVoucherVisible"
    :close-on-click-modal="false"
    @close='closeDialog'
    v-el-drag-dialog
  >
    <div>
      <el-form :model="uploadVoucherForm"  label-position="top">
        <el-form-item label="订单号">
          <p class="order-num">{{orderNo}}</p>
        </el-form-item>
        <el-form-item label="转账凭证" required>
          <el-upload class="upload-custom" name="upload" 
            :disabled='disabled'  
            :action="action" 
            :show-file-list="false"  
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess">
            <el-button size="small" icon="iconfont icon-shangchuan" plain class="upload-btn">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
          <div class="voucher-preview-box" v-show="uploadVoucherForm.voucher">
            <img :src="uploadVoucherForm.voucher" alt="凭证" class="voucher-img" title="点击预览" @click="prievewImg" />
            <i class="iconfont icon-i-shibai close-btn" @click="uploadVoucherForm.voucher= null" v-if="!disabled"></i>
          </div>
        </el-form-item>
        <p v-show='isShoeVoucherMessage' class="voucher-message">请上传转账凭证</p>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if='!disabled'>
      <el-button @click="uploadVoucherVisible = false" size="medium">取 消</el-button>
      <el-button type="primary" @click="submitUploadVoucher" size="medium" :loading='uploadVoucherLoading'>上传凭证</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data(){
    return {
      uploadVoucherVisible:false, // 上传凭证
      uploadVoucherForm:{
        voucher:null,
      },
      uploadVoucherLoading:false, // 提交loading
      isShoeVoucherMessage:false,
    }
  },
  computed:{
    action() {
			return this.$store.state.Jurisdiction.IP + '/files/file';
    },
  },
  props:{
    orderNo:String, // 订单号
    voucher:{
      default:null,
      type:String
    }, // 凭证地址
    orderId:{   // 订单id
      default:null,
      type:String
    },
    disabled:{  // 是否禁用上传组件
      type:Boolean,
      default:false,
    },
    visible:{
      default:false,
      type:Boolean
    }
  },
  watch:{
    visible(val){
      this.uploadVoucherVisible = val
      this.uploadVoucherForm.voucher = this.voucher
    },
  },
  methods:{
    // 提交凭证信息
    submitUploadVoucher(){
      if(!this.uploadVoucherForm.voucher){
        this.isShoeVoucherMessage = true
        return
      }
      this.uploadVoucherLoading = true
      this.$http.orderService.submitVoucher(this.orderId, { voucherAddress: this.uploadVoucherForm.voucher}).then(res => {
        this.$emit('submit')
        this.uploadVoucherVisible = false
        this.uploadVoucherLoading = false
      });
    },
    // 上传验证
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isImage = ['image/jpeg', 'image/png','image/jpg'].includes(file.type);
      if (!isImage) {
        this.$message.error('只能上传图片!');
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过10MB!');
      }
      return isImage && isLt10M;
    },
    handleAvatarSuccess(res, file) {
      this.uploadVoucherForm.voucher = res.data;
      this.isShoeVoucherMessage = false
    },
    // 预览图片
    prievewImg(){
      window.open(this.uploadVoucherForm.voucher)
    },
    closeDialog(){
      this.uploadVoucherForm.voucher = null;
      this.isShoeVoucherMessage = false
      this.$emit('update:visible', false)
    }
  }
};
</script>

<style scoped >
.upload-custom >>> .el-upload--text{
    width: 100%;
  }
  .upload-btn{
    border-color: #1884CC;
    border-style: dashed;
    width: 100%;
  }
  .upload-btn:hover{
    background-color: #E6F9FF !important;
  }
  .order-num{
    margin-top: 5px;
    text-indent: 10px;
    height:32px;
    color: #262626;
    line-height: 32px;
    background:rgba(240,243,245,1);
    border-radius:5px;
  }
  .voucher-preview-box{
    margin-top: 5px;
    /* height:300px; */
    line-height: 300px;
    text-align: center;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    background:rgba(255,255,255,1);
    border:1px solid rgba(232,232,232,1);
    border-radius:5px;
  }
  .voucher-img{
    max-height: 260px;
    vertical-align: middle;
  }
  .voucher-preview-box .close-btn{
    position: absolute;
    right: 15px;
    top: 20px;
    line-height: 0;
    color: #BFBFBF;
  }
  .voucher-preview-box .close-btn:hover{
    color: #454545;
    cursor: pointer;
  }
  .voucher-message{
    color: #f63e3e;
    font-size: 12px;
  }
</style>

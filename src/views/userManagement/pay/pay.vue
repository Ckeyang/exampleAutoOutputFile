<template>
  <div class="pay-content-box">
    <div class="title-box">
      <div class="title-text">
        <i class="iconfont icon-i-chenggongtishi"></i>
        <span class="title">订单提交成功，请尽快付款</span>
      </div>
      <div class="order-box">
        <div>
          <span>订单号：<span>{{orderNumber}}</span></span>
          <span @click="copyOrderNumber" class="copy-btn" title="点击复制订单号">复制</span>
        </div>
        <span style="color:#454545">
          支付金额：
          <span style="color:#FF2E2E">¥{{price}}</span>
        </span>
      </div>
    </div>
    <div class="pay-content">
      <h4 class="title">线下汇款</h4>
      <div style="height: 340px; margin-top:10px;" v-if="!isuploadVoucherSuccess">
        <el-steps direction="vertical">
          <el-step title="步骤一：打款" status="process">
            <div slot="description" class="steps-content">
              <p style="color:#262626">对私账户</p>
              <p>户名：罗雁</p>
              <p>账号：6221 5323 2001 4583 996 <span @click="copyAccount('6221 5323 2001 4583 996')" class="copy-btn" title="点击复制订单号">复制</span></p>
              <p>开户行：成都银行科技支行</p>
              <p style="color:#262626">对公账户</p>
              <p>户名：成都中环康源信息技术有限公司</p>
              <p>账号：1135 1000 0003 8298 4 <span @click="copyAccount('1135 1000 0003 8298 4')" class="copy-btn" title="点击复制订单号">复制</span></p>
              <p>开户行：华夏银行股份有限公司成都玉林支行</p>
              <i class="iconfont icon-fengxian">为了您的合法权益，转账时请备注您的订单编号</i>
            </div>
          </el-step>
          <el-step status="process" title="步骤二：上传凭证">
            <div slot="description" class="steps-content">
              <p style="color:#595959">
                汇款完成之后，请将汇款成功的凭证图片（线下汇款的凭条或线上转账的截图）提交系统，我们收到转账和您提交的凭证后，将会立即为您开通服务，感谢
                您的耐心等待
              </p>
              <el-button type="primary" size="small" class="submit-btn" @click="uploadVoucher">上传凭证</el-button>
            </div>
          </el-step>
        </el-steps>
      </div>
      <div v-else class="success-tips-box">
        <i class="iconfont icon-i-chenggongtishi"></i>
        <p class="success-text">汇款凭证提交成功！</p>
        <div class="tips-content">我们将会2个工作日内为您充值成功，如有疑问您也可以通过邮件或电话联系我们<br>
          邮件：zhangsan@zhky.mobi<br>
          电话：400-55552222<br>
          您可以进入<span class="link" @click="$router.push('/userManagement/order')">订单管理</span>查看相关订单信息</div>
      </div>
    </div>
    <uploadVoucher 
    :visible.sync='uploadVoucherVisible' 
    :orderId='$route.params.orderId' 
    :orderNo='orderNumber' 
    @submit='handleUploadVoucher' />
  </div>
</template>

<script>
import uploadVoucher from '../order/components/uploadVoucher.vue'
import { copyContent } from '@/utils.js'
export default {
  components:{ uploadVoucher },
  data() {
    return {
      uploadVoucherVisible:false,
      isuploadVoucherSuccess:false, // 是否上传凭证成功
    };
  },
  computed:{
    orderNumber(){
      return this.$route.params.orderNumber
    },
    price(){
      return Number(this.$route.params.price).formatMoney()
    }
  },
  methods:{
    uploadVoucher(voucherAddress){
      this.uploadVoucherVisible = true
    },
    // 凭证上传后的回调
    handleUploadVoucher(){
      this.isuploadVoucherSuccess = true
    },
    //复制订单号
    copyOrderNumber(){
      copyContent(this.orderNumber).then(()=>{
        this.$message({
          message: '复制成功',
          duration:1000,
          customClass:'copy-tips-message'
        });
      })
    },
    //复制账户
    copyAccount(val){
      copyContent(val).then(()=>{
        this.$message({
          message: '复制成功',
          duration:1000,
          customClass:'copy-tips-message'
        });
      })
    }
  }
};
</script>

<style scoped lang='scss'>
.pay-content-box {
  margin: 15px auto;
  width: 1080px;
  height: 90%;
  background: #fff;
  border-radius: 5px;
  .title-box {
    padding: 15px;
    font-family: MicrosoftYaHei-Bold;
    color: #595959;
    line-height: 22px;
    position: relative;
    border-bottom: 1px solid rgba(232, 232, 232, 0.65);
    .title-text{
      display: flex;
      align-items: center;
    }
    .title {
      color: #262626;
      font-size: 16px;
      font-weight: bold;
      margin-left: 5px;
    }
    .order-box {
      margin-top: 9px;
      display: flex;
      margin-left: 27px;
      justify-content: space-between;
    }
  }
  .pay-content {
    padding: 0 15px;
    .title {
      color: #666666;
      margin-top: 20px;
    }
  }
  .steps-content {
    color: #595959;
    line-height: 22px;
  }
  .icon-fengxian {
    position: relative;
    top: 10px;
    color: #f63e3e;
    font-size: 12px;
    &::before {
      margin-right: 3px;
    }
  }
  .submit-btn{
     position: relative;
     top: 40px;
     float: right;
  }
  .icon-i-chenggongtishi{
    color: #52C41A;
    font-size: 21px;
  }
  .success-text{
    color: #333333;
    margin-top: 10px;
    font-weight: bold;
  }
  .tips-content{
    color: #666666;
    text-align: center;
    line-height: 24px;
    font-size: 12px;
    margin-top: 20px;
    .link{
      cursor: pointer;
      color: #1C91FF;
      margin:0 1px;
      &:hover{
        text-decoration: underline;
      }
    }
  }
  .success-tips-box{
    margin-top:20px; 
    text-align: center;
    .icon-i-chenggongtishi{
      font-size: 38px;
    }
  }
  .copy-btn{
    color: #2696FF;
    cursor: pointer;
    margin-left: 5px;
  }
}
</style>

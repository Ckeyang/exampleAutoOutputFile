<template>
  <div class="order-content-box">
    <div class="goods-info">商品信息</div>
    <div class="order-content">
      <div class="good-message-box">
        <p class="good-message">商品信息:&nbsp;&nbsp;{{choicePrice && choicePrice.name}}</p>
        <p class="good-message">商品金额:&nbsp;&nbsp;{{totalPrice}}元</p>
        <p class="pay-price">
          支付金额: &nbsp;
          <span style="color:#FF2E2E">{{totalPrice.formatMoney()}}</span> 元
        </p>
      </div>
      <div class="pay-way-box">
        <h4>支付方式</h4>
        <ul class="pay-way">
          <li :class="{'active': choicePayWay === 'weixin', 'disabled' : true}" title="暂未开通">
            <i class="iconfont icon-weixinzhifu"></i>
            <span>微信支付</span>
          </li>
          <li :class="{'active': choicePayWay === 'alipay', 'disabled' : true}" title="暂未开通">
            <i class="iconfont icon-zhifubaozhifu"></i>
            <span>支付宝支付</span>
          </li>
          <li :class="{'active': choicePayWay === 'bank'}" @click="choicePayWay = 'bank'">
            <i class="iconfont icon-zhuanzhanghuikuan"></i>
            <span>转账汇款</span>
          </li>
        </ul>
        <el-button type="primary" size="small" class="submit-btn" :loading='submitOrderLoading' @click="submitOrder">提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      choicePayWay:'bank', // 当前选择的支付方式 
      choicePrice:null,
      submitOrderLoading:false,
    };
  },
  created(){
    this.getAllPricelist()
  },
  computed:{
    totalPrice(){
      if(this.choicePrice){
        return this.choicePrice.sellingPrice
      }
      return 0
    }
  },
  methods: {
    getAllPricelist() {
      this.$http.orderService.getPriceList().then(res => {
        const priceId = this.$route.params.id
        this.choicePrice =  (res.data || []).find(item => item.id === priceId)
      });
    },
    submitOrder() {
      if(this.choicePayWay && this.choicePrice){
        this.submitOrderLoading = true
        this.$http.orderService.submitOrder({paymentType:'OFFLINE',priceOrderType: this.$route.params.id}).then(res => {
          this.submitOrderLoading = false
          this.$router.push(`/pay/payPage/${res.data.orderNo}/${res.data.identifier}/${this.totalPrice}`)
        })
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.order-content-box {
  margin: 15px auto;
  width: 1080px;
  height: 90%;
  background: #fff;
  border-radius: 5px;
  .goods-info {
    height: 60px;
    line-height: 60px;
    text-indent: 20px;
    color: #262626;
    font-size: 16px;
    font-weight: bold;
    position: relative;
    border-bottom: 1px solid rgba(232, 232, 232, 0.65);
    font-family: MicrosoftYaHei-Bold;
  }
  .goods-info::before {
    content: "";
    display: inline-block;
    width: 2px;
    height: 28px;
    position: absolute;
    left: 0;
    top: 16px;
    background: #f1536e;
  }
  .order-content {
    padding: 15px 20px;
  }
  .good-message-box {
    line-height: 28px;
  }
  .good-message {
    color: rgba(102, 102, 102, 1);
    font-size: 14px;
  }
  .pay-price {
    margin-top: 10px;
    color: rgba(38, 38, 38, 1);
    font-size: 16px;
  }
  .pay-way-box {
    margin-top: 20px;
    .pay-way {
      overflow: hidden;
      margin-top: 10px;
      padding-bottom: 10px; 
    }
    .pay-way li {
      float: left;
      display: flex;
      cursor: pointer;
      align-items: center;
      margin-right: 20px;
      width: 182px;
      height: 64px;
      background: rgba(240, 243, 245, 1);
      border: 1px solid rgba(232, 232, 232, 1);
      border-radius: 5px;
      color: #666666;
      transition: all .2s;
      &.active{
        background-color: rgba(255, 255, 255, 1);
        background-image: url('../../../assets/pay.png');
        background-repeat: no-repeat;
        border-color:rgba(24, 132, 204, 1);
        background-position: 139px 21px;
        box-shadow: 0px 4px 8px 0px rgba(24, 132, 204, 0.45);
        color: #333333;
        i::before{
          color:#FC8B38
        }
      }
      i {
        margin-left: 15px;
        font-size: 30px;
        &::before{
          margin-right: 10px;
        }
      }
    }
    .pay-way li.disabled:hover{
      cursor: no-drop;
      // background: rgba(255, 255, 255, 1);
      // border-color:rgba(24, 132, 204, 1);
      // box-shadow: 0px 4px 8px 0px rgba(24, 132, 204, 0.45);
    }
    .submit-btn {
      clear: both;
      margin-top: 40px;
      float: right;
    }
  }
}
</style>
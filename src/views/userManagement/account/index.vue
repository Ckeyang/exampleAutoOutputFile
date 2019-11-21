<template>
  <div>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="tb-title">企业名称:{{ data.customerName }}</h5>
        <div style="float: right;"><el-button size="small" type="warning"  @click="goPay"><span class="iconfont icon-quchongzhi"></span> &nbsp;去充值</el-button></div>
      </div>
      <div class="accountP">
        <div style="text-align:center;width:40%;margin:0 auto;">
          <br />
          <br />
          <div class="circle">{{ data.totalQuantity }}</div>
          <br />
          <br />
          <div style="font-size:20px"><h5>剩余报告数(份)</h5></div>
          <br />
          <br />
          <el-row
            type="flex"
            justify="space-around"
            style="flex-wrap: wrap;"
          >
            <el-col :span="18" v-for="(item, index) in data.accountDetails" :key="index">
              <div style="padding:1em 0;color:#666666;text-align:center">
                共&nbsp;<span class="spanC">{{ item.quantity }}</span> &nbsp;份&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.expiredTime
                }}&nbsp;到期
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "account",
  data() {
    return {
      data: {
        accountDetails: [],
        customerName: "",
        totalQuantity: 0
      }
    };
  },
  activated() {
    this.getAccount();
  },
  methods: {
    getAccount() {
      this.$http.orderService.getAccount().then(res => {
        res.data.accountDetails = res.data.accountDetails || [];
        this.data = res.data;
      });
    },
    goPay() {
      window.open(location.href.split(this.$route.path)[0] +"/pay/pricePage");
    }
  }
};
</script>
<style lang="scss" scoped>
.accountP {
  background-color: #ffffff;
  height: 80vh;
}
.circle {
  display: inline-block;
  border-radius: 100%;
  width: 6rem;
  height: 6rem;
  line-height: 6rem;
  font-size: 30px;
  color: #ffffff;
  background-color: #f56271;
}
.spanC {
  color: #f56271;
}
</style>

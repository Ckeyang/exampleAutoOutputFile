<template>
  <div class="price-box">
    <div class="pay-title-box">
      <span class="pay-title-text">选择购买报告份数</span>
      <div>
        如有疑问，请<el-button type="primary" plain size="small" @click="contactBtn" style="margin-left:10px">联系我们</el-button>
      </div>
    </div>
    <ul class="price-content-box">
      <li v-for="item in peiceList" :key="item.id">
        <div class="cell">{{item.productCount}}份</div>
        <div class="cell total-price">
          <span>￥</span>
          <span class="total-price-num">{{ item.sellingPrice }}</span>
        </div>
        <div class="cell">
          <span class="original-price">￥{{item.originalPrice}}</span>
        </div>
        <div class="cell">
          <span class="selling-price">￥{{(item.sellingPrice / item.productCount).formatMoney()}}/份</span>
        </div>
        <div class="cell">
          <el-button
            type="primary"
            plain
            size="small"
            class="submit-btn"
            @click="$router.push(`/pay/orderPage/${item.id}`)"
          >立即购买</el-button>
        </div>
      </li>
    </ul>
     <el-dialog
      title="联系我们"
      :visible.sync="visible"
      @close='closeDialog'
      :close-on-click-modal="false"
      width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" size="small" v-focus='visible'></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phoneNo">
          <el-input v-model="ruleForm.phoneNo" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="saveContact" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { validatePhone, validateName } from '@/utils'
export default {
  data() {
    return {
      peiceList: [],
      visible:false,
      ruleForm:{
        name:'',
        phoneNo:''
      },
      rules:{
        name:[{ required: true, message: '请输入姓名', trigger: 'blur' },{ validator: validateName, trigger: 'blur' }],
        phoneNo:[{ required: true, message: '请输入手机号', trigger: 'blur' },{ validator: validatePhone, trigger: 'blur' }],
      }
    };
  },
  created() {
    this.getAllPricelist();
  },
  methods: {
    getAllPricelist() {
      this.$http.orderService.getPriceList().then(res => {
        this.peiceList = res.data || [];
      });
    },
    contactBtn(){
      this.visible = true;
    },
    closeDialog(){
      this.ruleForm = {
        name:'',
        phoneNo:''
      }
      this.$refs['ruleForm'].resetFields();
    },
    saveContact(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$http.orderService.potentialCustomer(this.ruleForm).then(res=>{
            this.visible = false;
          })
        }
      });
       
    }
  }
};
</script>

<style scoped lang='scss'>
.price-box {
  .pay-title-box{
    display: flex;
    width: 900px;
    margin: 30px auto 0;
    color: #595959;
    align-items: center;
    justify-content: space-between;
    .pay-title-text{
      font-size:26px;
      font-family:Microsoft YaHei;
      font-weight:300;
      color:rgba(69,69,69,1);
    }
  }
  .price-content-box {
    margin-top: 30px;
    // width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    li {
      width: 300px;
      //  transition: all .3s;
      &:hover {
        box-shadow: 0px 6px 12px 0px rgba(24, 132, 204, 0.45);
        // transform: scale(1.1);
        transform: translateY(-15px);
        // transition: all .3s;
      }
      &:hover .cell:first-child,
      &:hover .cell:last-child {
        // transform: scale(1.1);
        height: 95px;
        line-height: 95px;
        // transition: all .3s;
      }
      &:first-child .cell{
        border-left: 1px solid #e0e0e0;
      }
      .cell {
        height: 80px;
        line-height: 80px;
        text-align: center;
        // border: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        background: #fff;
      }
      .cell:first-child {
        background: #edf6fc;
        color: #333333;
        font-size: 25px;
        border-top: 1px solid #e0e0e0;
      }
      .cell:nth-child(2) {
        height: 120px;
        padding: 0;
        line-height: 120px;
      }
       
      .total-price {
        color: #f78819;
        font-size: 16px;
        .total-price-num {
          font-size: 40px;
          font-family: MicrosoftYaHeiLight;
          font-weight: 300;
          color: rgba(247, 136, 25, 1);
        }
      }
      .original-price {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        text-decoration: line-through;
        color: rgba(153, 153, 153, 1);
      }
      .selling-price {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(89, 89, 89, 1);
      }
    }
  }
}
</style>

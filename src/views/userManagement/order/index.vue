<template>
  <div style="height:100%">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="5">
          <el-form-item label="订单号">
            <el-input
              v-model="form.orderNo"
              size="small"
              placeholder="请输入订单号"
              clearable
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="订单状态">
            <el-select v-model="form.orderState" size="small" @change="searchData" clearable style='width:100%'>
              <el-option label="全部" value></el-option>
              <el-option :label="value" :value='key' v-for="(value,key) in orderStatelist" :key="key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" style=" min-width: 220px;">
          <el-form-item label="下单时间">
            <div class="order-time-box">
              <el-date-picker
                v-model="form.orderTime"
                type="daterange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
        </el-col>
        <el-col class='search-btn-box'>
          <el-button type="primary" size="small" icon="el-icon-search" @click="searchData" >搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm" >重置</el-button>
        </el-col>
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">企业名称：{{customerName}}</h5>
        <div>
          <el-button size="small" icon="iconfont icon-kaifapiao" @click="goToInvoicePage" >开发票</el-button>
          <el-button type="warning" size="small" icon="iconfont icon-goumaizhongxin" @click="goToPayPage" >去充值</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          :data="dataList"
          v-loading='tableLoading'
          style="width:100%"
          :max-height='winHeight - 326'
          tooltip-effect='light'
          header-row-class-name="cus-header-class"
        >
          <el-table-column label="订单号" prop="orderNo" min-width="100"></el-table-column>
          <el-table-column label="金额"  >
            <template slot-scope="scope">
              <span>{{scope.row.amount}}元</span>
            </template>
          </el-table-column>
          <el-table-column label="支付方式">
            <template slot-scope="scope">
              <span>{{paymentType(scope.row.paymentType)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" >
            <template slot-scope="scope">
              <span>{{scope.row.productCount}}份报告</span>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.createdDate | formatDate('yyyy-MM-dd hh:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="失效时间" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.invalidTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template slot-scope="scope">
              <span class="cus-tags-style">{{orderState(scope.row.status )}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发票快递单号" prop="invoiceCourierNumber" width="100"></el-table-column>
          <el-table-column prop label="操作" fixed="right" width="210">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i class="iconfont icon-i-wenjianshangchuan"
                  v-if="scope.row.status === 'NOT_UPLOADED_CREDENTIAL'"
                  @click="uploadVoucher(scope.row)">上传凭证</i>
                <i class="iconfont icon-chakan"
                  v-if="scope.row.status === 'UPLOADED_VOUCHER'"
                  @click="uploadVoucher(scope.row, true)">查看凭证</i>
                <i class="iconfont icon-quxiao" 
                  @click="cancelOrder(scope.row.id)"
                  v-if="scope.row.status === 'NOT_UPLOADED_CREDENTIAL'">取消订单</i>
                <i class="iconfont icon-i-zhongxinshengcheng" 
                  @click="uploadVoucher(scope.row)" 
                  v-if="scope.row.status === 'UPLOADED_VOUCHER'">重新上传凭证</i>
                <i class="iconfont icon-shanchu" @click="deleteOrder(scope.row.id)"
                  v-if="!['NOT_UPLOADED_CREDENTIAL','UPLOADED_VOUCHER'].includes(scope.row.status)">删除订单</i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagniation :totalPage="totalPage" :totalNum="totalNum" :currentPage='form.current' @changePage="handleChangePage" ></pagniation>
      </div>
      <el-dialog
        width="30%"
        title="取消订单"
        :visible.sync="cancelOrderVisible"
        :close-on-click-modal="false"
        @close='closeDialog'
        v-el-drag-dialog
      >
        <div class="remark-box">
          <el-radio-group v-model="cancelOrderRemark">
            <el-radio :label="item.type" v-for="item in remarklist" :key="item.type">{{item.label}}</el-radio>
          </el-radio-group>
          <div style="padding-left:25px;">
            <el-input
              type="textarea"
              style="margin-top:5px;"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入原因"
              v-show="cancelOrderRemark === 'other'"
              @change="otherRemarkChange"
              v-model="otherRemark">
            </el-input>
            <p v-show="isShowotherRemarkTips" class="error-tips">请输入原因</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelOrderVisible = false" size="medium">取 消</el-button>
          <el-button type="primary" @click="submitCancelOrder" size="medium">提 交</el-button>
        </span>
      </el-dialog>
    </div>
    <uploadVoucher 
    :visible.sync='uploadVoucherVisible' 
    :orderNo='uploadVoucherForm.orderNo' 
    :orderId='uploadVoucherForm.orderId' 
    :voucher='uploadVoucherForm.voucher' 
    :disabled='uploadVoucherForm.disabled'
    @submit="handelUploadVoucher"/>
  </div>
</template>

<script>
import SearchBox from '@/components/tools/searchBox.vue'
import pagniation from '@/components/tools/Pagniation.vue'
import uploadVoucher from './components/uploadVoucher.vue'
import {validateName} from '@/utils.js'
import { mapGetters } from 'vuex'
export default {
  components: { SearchBox, pagniation, uploadVoucher },
  name:'order',
  data(){
    return {
      form: {
        orderState: '',
        orderNo:'',
        orderTime:[],
        current: 0,
        pageSize: 30
      },
      curCheckedId:null, // 当前操作数据的id
      dataList:[],
      tableLoading:false,
      uploadVoucherForm:{
        orderId:null,
        orderNo:null,
        voucher:null,
        disabled:false
      },
      uploadVoucherVisible:false, // 上传凭证
      cancelOrderRemark:'2', // 取消订单原因
      otherRemark:'', // 其他原因
      isShowotherRemarkTips:false,
      orderStatelist:Object.freeze({ 
        NOT_UPLOADED_CREDENTIAL:'未上传凭证',
        UPLOADED_VOUCHER:'已上传凭证',
        RECHARGE_FAILED:'充值失败',
        CANCELLED:'已取消',
        MAKE_INVOICE:'开票中',
        MADE_INVOICED:'已开票',
        COMPLETED:'已完成',
        INVALID:'已失效',
      }),
      cancelOrderVisible:false, // 取消订单弹框
      remarklist:Object.freeze([
        {type:'1', label:'我不想买了'},
        {type:'2', label:'信息填写错误，重新下订单'},
        {type:'other', label:'其他原因'},
      ]),
      totalNum:0,
      totalPage:0
    }
  },
  created(){
    this.getOrderList()
  },
  computed:{
    customerName(){
      return JSON.parse(sessionStorage.userInfo).customerName
    },
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  methods:{
    getOrderList(){
      this.tableLoading = true;
      const beginDate = this.form.orderTime[0]
      const endDate = this.form.orderTime[1]
      const { pageSize, current, orderNo, orderState } =this.form
      let params = {
        pageSize,
        current,
        orderNo,
        status:orderState,
        beginDate,
        endDate
      }
      this.$http.orderService.getOrderList(params).then((res) => {
        this.dataList = res.data.content || []
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      }).finally(()=>{
        this.tableLoading = false;
      });
    },
    searchData(){
      this.form.current = 0;
      this.getOrderList()
    },
    // 上传凭证
    /**
     * @param { string } isDisabled 是否禁用上传 为true则只能查看凭证
     */
    uploadVoucher({id, orderNo, voucherAddress }, isDisabled = false){
      this.curCheckedId = id
      this.uploadVoucherForm = {
        orderNo,
        orderId:id,
        disabled:isDisabled,
        voucher:voucherAddress || null
      }
      this.uploadVoucherVisible = true
    },
    handelUploadVoucher(){
      this.getOrderList()
    },
    // 取消订单
    cancelOrder(id){
      this.curCheckedId = id
      this.cancelOrderVisible = true
    },
    // 确定取消订单
    submitCancelOrder(){
      let remark
      if(this.cancelOrderRemark === 'other'){
        if(!this.otherRemark){
          this.isShowotherRemarkTips = true
          return 
        }
        remark = this.otherRemark
      }else{
        remark = this.remarklist.find(item => item.type === this.cancelOrderRemark).label
      }
      this.$http.orderService.cancelOrder(this.curCheckedId, {reason: remark}).then(() =>{
        this.$message({
            type: "success",
            message: "订单已取消!"
        });
        this.getOrderList()
        this.cancelOrderVisible = false
      })
    },
    otherRemarkChange(val){
      this.isShowotherRemarkTips = (!val || /^[ ]*$/.test(val))
    },
    // 删除订单
    deleteOrder(id){
       this.$confirm("<p class='comfire-title'>确定删除该订单吗？</p><p class='comfire-text'>删除后的订单将不能恢复</p>", '', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString:true,
        type: "warning"
      })
        .then(() => {
          this.$http.orderService.deleteOrder(id).then(() => {
            if(this.dataList.length <= 1){
              this.form.current = this.form.current >= 1 ? this.form.current - 1 : 0
            } 
            this.getOrderList();
            this.$message({
              type: "success",
              message: "订单删除成功!"
            });
          });
        })
    },
    // 去开发票
    goToInvoicePage(){
      this.$router.push('/userManagement/invoice')
    },
    // 去购买中心
    goToPayPage(){
      this.openWindow('/pay/pricePage') 
    },
     //打开新窗口
    openWindow(route, query = {}) {
      window.open(this.$router.resolve({ path: route, query }).href)
    },
    handleChangePage(page){
      this.form.pageSize = page.pageSize
      this.form.current = page.currentPage - 1
      this.getOrderList()
    },
    closeDialog(){
      this.cancelOrderRemark = '2';
      this.otherRemark = null;
      this.isShowotherRemarkTips = false
    },
    resetForm(){
      this.form = {
        orderState: '',
        orderNo:'',
        orderTime:[],
        current: 0,
        pageSize: 30
      }
      this.getOrderList()
    },
    orderState(state){
      return this.orderStatelist[state]
    },
    paymentType(type){
      if(type === 'OFFLINE'){
        return '转账汇款'
      }
      return '线上支付'
    }
  }
}
</script>

<style  scoped>
  .order-time-box{
    min-width: 220px;
  }
  .order-time-box >>> .el-date-editor--daterange{
    position: relative;
    top: 3px;
  }
  .order-time-box >>> .el-date-editor--daterange.el-input__inner{
    width: 100%;
    min-width: 220px;
  }
  .error-tips{
    color: #f63e3e;
    font-size: 12px;
    margin-top: 6px;
  }
  .remark-box >>> .el-radio{
    display: block;
    margin-left: 0;
    line-height: 30px;
  }
  .order-time-box >>> .el-date-editor .el-range-separator{
    line-height: 29px;
  }
   
</style>

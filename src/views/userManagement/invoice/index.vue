<template>
  <div class="regulation-tb box-style_common">
    <div class="tools-bar_common">
      <h5 class="table-title">企业名称：{{customerName}}</h5>
      <div></div>
    </div>
    <div class="table-box">
      <el-table
        :data="dataList"
        v-loading="tableLoading"
        style="width:100%"
        :max-height="winHeight - 260"
        tooltip-effect="light"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
        header-row-class-name="cus-header-class"
      >
        <el-table-column type="selection" width="60" center></el-table-column>
        <el-table-column label="订单号" prop="orderNo"></el-table-column>
        <el-table-column label="金额">
          <template slot-scope="scope">
            <span>{{scope.row.amount}}元</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            <span>{{paymentType(scope.row.paymentType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品信息">
          <template slot-scope="scope">
            <span>{{scope.row.productCount}}份报告</span>
          </template>
        </el-table-column>
        <el-table-column label="完成时间">
          <template slot-scope="scope">
            <span>{{scope.row.completedTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer" v-if='dataList.length'>
        <span>
          总额：
          <span style="color:#FF2E2E;font-size:18px;">{{totalMoney}}</span> 元
        </span>
        <el-button
          type="primary"
          @click="mergeInvoice"
          size="small"
          :disabled="!multipleSelection.length"
        >合并开票</el-button>
      </div>
    </div>
    <el-dialog
      width="30%"
      title="发票信息"
      top="10vh"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
      v-el-drag-dialog
    >
      <el-form
        :model="invoiceForm"
        :rules="rules"
        ref="invoiceForm"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="抬头类型" prop="invoiceLookedUp">
          <el-radio-group v-model="invoiceForm.invoiceLookedUp" @change="handleInvoiceLookedUpChange">
            <el-radio label="ENTERPRISEUNIT">企业单位</el-radio>
            <el-radio label="NON_ENTERPRISEUNIT">个人/非企业单位</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公司抬头" prop="companyLookedUp">
          <el-input v-model="invoiceForm.companyLookedUp" size="small"></el-input>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="taxpayerIdentificationNumber" v-if="invoiceForm.invoiceLookedUp === 'ENTERPRISEUNIT'">
          <el-input v-model="invoiceForm.taxpayerIdentificationNumber" size="small"></el-input>
        </el-form-item>
        <el-form-item label="发票金额">
          <p class="total-price">{{totalMoney}} 元</p>
        </el-form-item>
        <el-form-item label="地址/电话">
          <el-input v-model="invoiceForm.addressWithPhone" size="small"></el-input>
        </el-form-item>
        <el-form-item label="开户行及账户">
          <el-input v-model="invoiceForm.bankWithAccountNumber" size="small"></el-input>
        </el-form-item>
        <div>
          <span class="send-way">发送方式</span>
          <span class="color:#8C8C8C;font-size:13px;">（快递）</span>
        </div>
        <el-form-item label="邮寄地址" required>
          <Address
            :formAttribute="{fillable:true}"
            :formValue="invoiceForm"
            :hideInput="['townValue']"
          />
          <p class="address-tips" v-show="isShowAddressValueTips">请填写详细的邮寄地址</p>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPeople">
          <el-input v-model="invoiceForm.contactPeople" size="small"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="invoiceForm.contactPhone" size="small"></el-input>
        </el-form-item>
        <p class="tips-box">
          <i class="iconfont icon-fengxian">注：如有其他疑问，请拨打服务热线：400-2223-2222</i>
        </p>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="submitInvoiceForm" size="medium">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Address from "@/components/template/Address.vue";
import { validateName, validatePhone } from "@/utils.js";
export default {
  components: { Address },
  name: 'invoice',
  data() {
    return {
      dataList: [],
      multipleSelection: [],
      tableLoading: false,
      invoiceForm: {
        // 开票表单
        invoiceLookedUp: "ENTERPRISEUNIT",
        companyLookedUp: "",
        taxpayerIdentificationNumber: "",
        addressWithPhone: "",
        bankWithAccountNumber: "",
        contactPeople: "",
        contactPhone: "",
        addressValue: {
          provinceValue: "",
          cityValue: "",
          countyValue: "",
          streetValue: ""
        }
      },
      rules: {
        invoiceLookedUp: {
          required: true,
          message: "请选择抬头类型",
          trigger: "change"
        },
        companyLookedUp: [
          { required: true, message: "请输入公司抬头", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ],
        taxpayerIdentificationNumber: [
          { required: true, message: "请输入纳税人识别号", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ],
        contactPeople: [
          { required: true, message: "请输入联系人", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: validateName, trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" }
        ]
      },
      isShowAddressValueTips: false, // 是否显示邮寄地址提示
      dialogVisible: false
    };
  },
  created(){
    this.getOrderList()
  },
  computed: {
    totalMoney() {
      // 计算总价
      let num = this.multipleSelection.reduce((prev, next) => {
        return prev + next.amount;
      }, 0);
      if (num !== 0) {
        num = parseFloat(num).toFixed(2)
      }
      return num;
    },
    customerName(){
      return JSON.parse(sessionStorage.userInfo).customerName
    },
  },
  watch:{
    'invoiceForm.addressValue':{
      handler:function(val){
        if(this.dialogVisible){
          this.isShowAddressValueTips = !this.judgeAddressValue()
        }
      },
      deep:true
    }
  },
  methods: {
    // 只加载已完成订单
    getOrderList(){
      this.tableLoading = true;
      this.$http.orderService.getOrderList({status:'COMPLETED', pageSize:1000}).then((res) => {
        this.dataList = res.data.content || []
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      }).finally(()=>{
        this.tableLoading = false;
      });
    },
    // 打开开票窗口
    mergeInvoice() {
      const { invoiceForm } = localStorage
      // 取用历史的发票信息
      if(invoiceForm){
        this.invoiceForm = JSON.parse(invoiceForm)
      }else{
        const {mobilePhoneNumber, realName} = JSON.parse(sessionStorage.userInfo)
        this.invoiceForm.contactPhone = mobilePhoneNumber || ''
        this.invoiceForm.contactPeople = realName || ''
      }
      this.dialogVisible = true;
    },
    handleInvoiceLookedUpChange(val){
      if(val === 'NON_ENTERPRISEUNIT'){
        this.invoiceForm.taxpayerIdentificationNumber = ''
      }
    },
    submitInvoiceForm() {
      if (!this.judgeAddressValue()) {
        this.isShowAddressValueTips = true;
        return;
      }
      this.$refs["invoiceForm"].validate(valid => {
        const params = { ...this.invoiceForm }
        params.invoiceAmount = parseFloat(this.totalMoney);
        params.orderIds = this.multipleSelection.map(item => item.id); 
        if (valid) {
          this.$http.orderService.setInvoices(params).then(() => {
            this.getOrderList()
            this.dialogVisible = false;
            this.$message({
              message: "发票开具成功！",
              type: "success"
            });
            // 本地存储用户发票信息，方便二次填入
            localStorage.invoiceForm = JSON.stringify(this.invoiceForm)
          });
        }
      });
    },
    // 判断邮寄地址是否填写
    judgeAddressValue() {
      const {
        provinceValue,
        cityValue,
        countyValue,
        streetValue
      } = this.invoiceForm.addressValue;
      return provinceValue && cityValue && countyValue && streetValue;
    },
    resetForm() {
      this.invoiceForm = {
        invoiceLookedUp: "ENTERPRISEUNIT",
        companyLookedUp: "",
        taxpayerIdentificationNumber: "",
        addressWithPhone: "",
        bankWithAccountNumber: "",
        contactPeople: "",
        contactPhone: "",
        addressValue: {
          provinceValue: "",
          cityValue: "",
          countyValue: "",
          streetValue: ""
        }
      }
      this.$refs["invoiceForm"].resetFields();
      this.isShowAddressValueTips = false;
    },
    closeDialog() {
      this.resetForm();
    },
    handleSelectionChange(row) {
      this.multipleSelection = row;
    },
    paymentType(type) {
      if (type === "OFFLINE") {
        return "转账汇款";
      }
      return "线上支付";
    },
    // 表格样式
    tableRowClassName({ row }) {
      if (this.multipleSelection.find(item => item.id === row.id)) {
        return 'checked-row';
      } 
      return '';
    },
  }
};
</script>

<style scoped lang='scss'>
.table-footer {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  color: #262626;
  justify-content: space-between;
}
.send-way {
  font-size: 15px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(38, 38, 38, 1);
  line-height: 22px;
}
.tips-box {
  color: #999999;
  font-size: 12px;
  margin-top: 22px;
  i {
    font-size: 12px;
    &::before {
      margin-right: 5px;
    }
  }
}
.total-price {
  height: 32px;
  margin-top: 5px;
  text-indent: 15px;
  line-height: 32px;
  color: #ff2e2e;
  background: rgba(240, 243, 245, 1);
  border-radius: 5px;
}
.address-tips {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  position: absolute;
  bottom: -12px;
  left:0;
}
</style>

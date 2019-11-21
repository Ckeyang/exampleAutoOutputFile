<template>
  <div>
    <el-form ref="form" :model="formAttribute" label-width="70px" label-position='top'>
      <el-form-item label="文本标签">
        <el-input v-model="formAttribute.tag" placeholder="请输入内容" size='mini' clearable  v-show="formAttribute.fieldId"></el-input>
        <el-button type="primary" size='mini' style="position: absolute;top:-29px;right:0" icon="iconfont icon-jia" @click='addFiled'>选择字段</el-button>
      </el-form-item>
      <div class="line"></div>
      <div>
        <h3 class="form-title">此题设置</h3>
        <div class="form-item-box">
          <label class="el-form-item__label">可多行输入</label>
          <el-switch v-model="formAttribute.multipleLinesTextBox">
          </el-switch>
        </div>
      </div>
      <div class="line"></div>
      <div>
        <h3 class="form-title">填写设置</h3>
        <el-form-item label="填写设置">
          <el-select v-model="formAttribute.inputModle.inputType" size='mini' style="width:100%">
            <el-option :label="item.label" :value="item.value" v-for='(item,index) of validationSettings' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="formAttribute.inputModle.inputType === 'NONE' ? '最少字数':'最小值'">
          <el-input v-model="formAttribute.minLengthTextBox" placeholder="请输入内容" size='mini'
					 @blur='validateNumber(formAttribute.minLengthTextBox,"minLengthTextBox")'></el-input>
        </el-form-item>
        <el-form-item :label="formAttribute.inputModle.inputType === 'NONE' ? '最多字数':'最大值'">
          <el-input v-model="formAttribute.maxLengthTextBox" placeholder="请输入内容" size='mini' 
					@blur='validateNumber(formAttribute.maxLengthTextBox,"maxLengthTextBox")'></el-input>
        </el-form-item>
        <el-form-item label="默认值">
          <el-input type='textarea' v-model="formAttribute.defaultStringTextBox" placeholder="请输入内容" size='mini' @input='handelChange'></el-input>
					<div class="form-item-box" style="margin-bottom:0">
						<label class="el-form-item__label">加载历史记录</label>
						<el-switch v-model="formAttribute.showHistoryValue" ></el-switch>
					</div>
        </el-form-item>
				<!-- <el-form-item label="默认值">
          <el-input type='textarea' v-model="formAttribute.defaultStringTextBox" placeholder="请输入内容" size='mini' @input='handelChange'></el-input>
        </el-form-item> -->
        <el-form-item label="扫码">
					<div class="block-checkbox">
						<el-checkbox v-model="formAttribute.inputBySweepCode">可扫码输入</el-checkbox>
          	<el-checkbox v-model="formAttribute.searchBySweepCode">可扫码搜索数据</el-checkbox>
						<el-tooltip  placement="top-start" effect="light" :offset='30'>
							<div slot="content" class="tips-content">一个业务类别下只允许存在一个扫码搜索</div>
							<i class="tooltips-icon iconfont icon-wenhaomiaoshu"></i>
						</el-tooltip>
					</div>
					<div>
						<el-checkbox v-model="formAttribute.autoGenerateCustomNumber" @change="customNumberChange">是否使用自动编号</el-checkbox>
						<div v-if='formAttribute.autoGenerateCustomNumber'>
							<p class="custom-number--right-example" :title="getCustomNumberTest(formAttribute.customNumberInfo)">
								示例：{{getCustomNumberTest(formAttribute.customNumberInfo)}}
							</p>
							<el-button @click="openCustomNumberVisible" size="mini" style="width:100%;margin-top:6px;" icon="iconfont icon-shezhi">设置自定义编号</el-button>
						</div>
					</div>
        </el-form-item>
        <el-form-item label="布局">
					<fixed-column-width :formAttribute='formAttribute' />
        </el-form-item>
      </div>
    </el-form>
		<el-dialog
			title="自定义编号设置"
			:visible.sync="customNumberVisible"
			@close='closeCustomNumberVisible'
			width="32%">
			<el-form ref="customNumberInfo" :model="tempCustomNumberInfo" :rules="customNumberRules" label-width="70px" label-position='top'>
				<el-form-item label="样例" >
        	<div class="custom-number-example" >{{ getCustomNumberTest(tempCustomNumberInfo) }}</div>
				</el-form-item>
				<el-form-item label="编号前缀">
					<div v-for="(item, index) in tempCustomNumberInfo.customNumberRuleList" :key="index">
            <customNumberInput
								:shareList='shareList'
                :model.sync="item"
                :index="index"
                :prefexList="prefexList"
                @addCustomNumber="addCustomNumber"
                @deleteCustomNumber="deleteCustomNumber"
              ></customNumberInput>
          </div>
        </el-form-item>
				<el-form-item label="初始值" size="small" prop="initValue" style="margin-bottom:15px">
					<el-input v-model="tempCustomNumberInfo.initValue"></el-input>
				</el-form-item>
				<el-form-item label="步进值" size="small" prop="stepValue">
					<div class="step-value-box">
						<el-input-number :controls='false' @change="stepValueChange" style="width:100%" :min='1' v-model="tempCustomNumberInfo.stepValue"></el-input-number>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="customNumberVisible = false" size="medium">取 消</el-button>
				<el-button type="primary" @click="saveCustomNumber" size="medium">确 定</el-button>
			</span>
		</el-dialog>
  </div>
</template>
<script>
import fixedColumnWidth from "./components/fixedColumnWidth.vue";
import customNumberInput from "@/views/userManagement/customNumber/compontens/customNumberInput.vue";
const validateIntNumber = (rule, value, callback)=>{
	if (!/^\d+$/.test(value)) {
    callback(new Error('请输入数字类型的初始值'));
	}
	callback()
}
const validateIntNumber2 = (rule, value, callback)=>{
	if(isNaN(value)){
		callback(new Error('请输入步进值'));
	}
	callback()
}
export default {
	props: ['formAttribute', 'templateType' , 'formValue'], //templateType 模板类型，如果为PROJECT 则要选择字段
	data() {
		return {
			isFixedColumnWidth:false,
			customNumberVisible:false,
			prefexList:{},
			shareList:[], // 改组件下选择的共享件
			tempCustomNumberInfo:{
				customNumberRuleList:[],
				initValue:'',
				stepValue:1,
			}, // 临时的自定义属性设置
			customNumberRules:{
				stepValue: [
						{ required: true, message: '请输入步进值', trigger: 'blur' },
						{ validator: validateIntNumber2, trigger: 'blur' }
          ],
				initValue: [
						{ required: true, message: '请输入初始值', trigger: 'blur' },
						{ validator: validateIntNumber, trigger: 'blur' }
          ],
			},
			validationSettings: [
				{
					label: '文本',
					value: 'NONE'
				},
				{
					label: '数字',
					value: 'NUMBERS'
				}
			]
		};
	},
	created(){
		this.getCustomerNumberPrefixList()
	},
	components:{fixedColumnWidth, customNumberInput},
	methods: {
		//默认值改变，实时同步到input 框
		handelChange(val){
			this.formValue.stringValue = val
		},
		addFiled() {
			this.$emit('openDialog');
		},
		validateNumber(val, type, regType) {
			if(!val) return
			const reg = this.formAttribute.inputModle.inputType === 'NUMBERS' ? /^(-)?([1-9]\d*|0)(\.)?([1-9]\d*|0)?$/ : /^([1-9]\d*|0)$/
			if (!reg.test(Number(val))) {
				this.$message({
					message: '请输入有效的数字',
					type: 'error',
					duration: '1000'
				});
				if (type === 'maxLengthTextBox') {
					this.formAttribute.maxLengthTextBox = '';
				} else {
					this.formAttribute.minLengthTextBox = '';
				}
			} else if (this.formAttribute.maxLengthTextBox && Number(this.formAttribute.minLengthTextBox) > Number(this.formAttribute.maxLengthTextBox)) {
				this.$message({
					message: '最小值不能大于最大值',
					type: 'error',
					duration: '1000'
				});
				this.formAttribute.minLengthTextBox = '';
			}else{
					if (type === 'maxLengthTextBox') {
						this.formAttribute.maxLengthTextBox = Number(val);
					} else {
						this.formAttribute.minLengthTextBox = Number(val);
					}
			}
		},
		//打开自定义编号窗口
		openCustomNumberVisible(){
			if(this.formAttribute.customNumberInfo.customNumberRuleList.length){
				this.tempCustomNumberInfo = JSON.parse(JSON.stringify(this.formAttribute.customNumberInfo)) // 备份，用于取消恢复
			}else{
				this.addCustomNumber()
			}
			this.customNumberVisible = true
			this.getCurAssemblyShareList() // 获取当前组件下绑定的共享件字段
		},
		customNumberChange(val){
			if(val){
				this.openCustomNumberVisible()
			}else{
				this.customNumberVisible = false
			}
		},
		saveCustomNumber(){
			this.$refs['customNumberInfo'].validate((valid) => {
        if (valid) {
					this.formAttribute.customNumberInfo = JSON.parse(JSON.stringify(this.tempCustomNumberInfo)) // 备份，用于取消恢复
					this.customNumberVisible = false
        }
      });
		},
		closeCustomNumberVisible(){
			this.tempCustomNumberInfo = {
				customNumberRuleList:[],
				initValue:'',
				stepValue:1,
			}
			this.$refs['customNumberInfo'].resetFields();
		},
		getCustomerNumberPrefixList() {
      this.$http.customNumberService.getCustomerNumberPrefixList({customNumberType:'FORMDATA'}).then(res => {
        this.prefexList = res.data;
      });
    },
		addCustomNumber() {
      this.tempCustomNumberInfo.customNumberRuleList.push({
        value: "",
        type: "FIXEDTEXT",
        connector: ""
      });
    },
    deleteCustomNumber(index) {
      this.tempCustomNumberInfo.customNumberRuleList.splice(index, 1);
		},
		getCurAssemblyShareList(){
			const data = this.$parent.$parent.templateForm || this.$parent.$parent.assmeblyList
			this.shareList = data.filterMap(item => {
				if(item.componentAttr.fieldId){
					return {
						id:item.componentAttr.fieldId,
						name:item.componentAttr.tag
					}
				}
			})
		},
		stepValueChange(val){
			this.$nextTick(()=>{
				this.tempCustomNumberInfo.stepValue = parseInt(val)
			})
		},
		getCustomNumberTest(data) {
      let result = "";
      data.customNumberRuleList.map(item => {
        switch (item.type) {
          case "DATEVARIABLE":
            result += item.value + item.connector || "";
            break;
          case "SHARECOMPONENT":
            result += "共享件" + item.connector || "";
            break;
          case "SYSTEMVARIABLES":
            result += "职" + item.connector || "";
            break;
          case "FIXEDTEXT":
            result += item.value + item.connector || "";
            break;
        }
      });
      result += (data.initValue || '');
      return result;
    },
	}
};
</script>
<style scoped>
	.icon-wenhaomiaoshu{
		margin-left: 5px;
	}
	.tips-content{
		color: #606266;
	}
	.custom-number-example,
	.custom-number--right-example{
		background:rgba(240,243,245,1);
		border-radius:5px;
		text-indent: 10px;
		height: 34px;
		line-height: 34px;
	}
	.custom-number--right-example{
		height: 28px;
		line-height: 28px;
		color:#262626;
		font-size: 12px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.step-value-box >>> .el-input__inner{
		text-align: left;
	}
</style>

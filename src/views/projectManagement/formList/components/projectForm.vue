<template>
   <el-dialog
      :title="dialogTitle"
      v-el-drag-dialog
      :visible.sync="dialogVisible"
      width="30%"
      @close='closeDialog'
      :close-on-click-modal="false">
      <div>
        <el-form
          ref="ruleForm"
          :model="projectForm"
          label-width="110px"
          style="width:100%"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="业务类别" prop="evaluationCategory">
            <el-cascader
              :options="categoriesList"
              size="small"
              clearable
              filterable
              placeholder="请选择业务类别"
              :disabled="['PUBLISH','EDIT','EDIT_INFO'].includes(type)"
              v-model="projectForm.evaluationCategory"
              :props="{label:'name',children:'childList',value:'id'}"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model.trim="projectForm.projectName"
              placeholder="请输入项目名称"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="企业名称" prop="companyName">
            <el-input
              v-model.trim="projectForm.companyName"
              placeholder="请输入企业名称"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="企业联系人" prop="companyContactName">
            <el-input
              v-model.trim="projectForm.companyContactName"
              placeholder="请输入企业联系人"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="企业联系人电话" prop="companyContactPhone">
            <el-input
              v-model.trim="projectForm.companyContactPhone"
              placeholder="请输入企业联系人电话"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="委托受理编号" prop="entrustNumber" v-if="['PUBLISH','EDIT_INFO'].includes(type)">
            <el-input
              v-model.trim="projectForm.entrustNumber"
              :placeholder='autoGenerateEntrustNumber ? "此编号将会在发布之后自动生成":"请输入委托受理编号"'
              size="small"
              clearable
              :disabled="autoGenerateEntrustNumber"
            ></el-input>
          </el-form-item>
          <el-form-item label="委托受理时间" prop="entrustDate" v-if="['PUBLISH','EDIT_INFO'].includes(type)">
            <el-date-picker
            v-model="projectForm.entrustDate"
            size="small"
            style="width:100%;"
            value-format='timestamp'
            type="date"
            placeholder="请输入委托受理时间">
          </el-date-picker>
          </el-form-item>
          <el-form-item label="合同编号" prop="contractNumber" v-if="['PUBLISH','EDIT_INFO'].includes(type)">
            <el-input
              v-model.trim="projectForm.contractNumber"
              :placeholder='autoGenerateContractNumber ? "此编号将会在发布之后自动生成":"请输入合同编号"'
              size="small"
              clearable
              :disabled="autoGenerateContractNumber"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业地址" >
            <Address  :formAttribute='{fillable:true}' :formValue='projectForm' :hideInput='["townValue"]' />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
        <el-button
          type="primary"
          @click="saveProject"
          :loading='submitLoading'
          size="medium"
        >保 存</el-button>
      </span>
    </el-dialog>
</template>

<script>
import Address from "@/components/template/Address.vue";
import { validateName, validatePhone } from "@/utils.js";
export default {
  components:{ Address },
  data(){
    return {
      dialogVisible:false,
      projectForm:{
        projectName: "",
        entrustNumber: "",
        companyName: "",
        contractNumber: "",
        entrustDate:"",
        companyContactName:"", // 联系人
        companyContactPhone:"", // 联系人电话
        addressValue:{
          provinceValue:'',
          cityValue:'',
          countyValue:'',
          streetValue:'',
        },
        evaluationCategory: [],
      },
      autoGenerateContractNumber:false, // 是否自动生成合同编号
      autoGenerateEntrustNumber:false, // 是否自动生成委托受理编号
      rules: {
        categoryType: { required: true, message: "请选择业务分类" },
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur"
          },
          { validator: validateName, trigger: "blur" }
        ],
        evaluationCategory: [
          { required: true, message: "请选择业务类别", trigger: "blur" }
        ],
        entrustNumber: { required: !this.autoGenerateContract, message: "请输入委托受理编号", trigger: "blur" },
        entrustDate: [
          { required: true, message: "请输入委托受理时间", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ],
        companyContactName: { required: true, message: "请输入企业联系人", trigger: "blur" },
        companyContactPhone: [
          { required: true, message: "请输入企业联系人电话", trigger: "blur" },
          { validator: validateName, trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" }
        ],
      },
    }
  },
  watch:{
    visible(val){
      this.dialogVisible = val
    },
    autoGenerateEntrustNumber(val){
      this.rules.entrustNumber.required = !val
    },
  },
  props:{
    type:{
      default:'ADD'  // ADD  添加项目 、 EDIT 编辑 、PUBLISH 发布 、EDIT_INFO 修改项目信息
    },
    visible:{},
    submitLoading:{ // 提交loading
      type:Boolean,
      default:false
    },
    categoriesList: {
      default:() => []
    }, //所有的评价类别树
  },
  computed:{
    dialogTitle(){
      const type = {
        ADD:'新增项目',
        EDIT_INFO:'修改项目信息',
        EDIT:'编辑',
        PUBLISH:'发布'
      }
      return type[this.type]
    }
  },
  methods:{
    // 修改属性时，设置初始值
    setFrom(data,autoGenerateEntrustNumber = false, autoGenerateContractNumber = false){
      this.projectForm = data
      this.autoGenerateContractNumber = autoGenerateContractNumber;
      this.autoGenerateEntrustNumber = autoGenerateEntrustNumber;
    },
    saveProject(){
      this.$refs["ruleForm"].validate(valid => {
        if(valid){
          this.$emit('submit',this.projectForm)
        }
      })
    },
    closeDialog(){
      this.$emit('update:visible',false),
      this.projectForm = {
          projectName: "",
          entrustNumber: "",
          companyName: "",
          contractNumber: "",
          entrustDate:"",
          companyContactName:"", // 联系人
          companyContactPhone:"", // 联系人电话
          addressValue:{
            provinceValue:'',
            cityValue:'',
            countyValue:'',
            streetValue:'',
          },
          evaluationCategory: []
        };
        this.autoGenerateEntrustNumber = false;
        this.autoGenerateContractNumber = false;
        this.$refs["ruleForm"].resetFields(); //重置验证
    }
  }
}
</script>

<style>

</style>

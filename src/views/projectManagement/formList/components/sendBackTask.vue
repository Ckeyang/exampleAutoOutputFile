<template>
  <el-dialog
    :title="projectTask.title"
    :visible.sync="dialogVisible"
    v-el-drag-dialog
    :close-on-click-modal="false"
    @close='closeDialog'
    class="custom-dialog"
    width="28%">
    <el-form ref="remarkForm" :model="form" :rules="rules" label-position="top">
      <el-form-item label="" prop="radioState" v-if="['REVIEW_SCENE_RECORD','REVIEW_TEXT_RECORD','SIGN_PROJECT','AUDIT_PROJECT'].includes(projectTask.type)">
        <el-radio-group v-model="form.radioState" >
          <el-radio label="PASSED">{{radioLabel}}</el-radio>
          <el-radio label="REJECTED">不{{radioLabel}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="需要修改的内容" prop="checkList" v-if="isShowCheckbox">
        <el-checkbox-group v-model="form.checkList" class="checkbox">
          <el-checkbox :label="item.type" v-for="item in projectStateList" :key="item.type">{{item.description}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="原因 (200字以内)" prop="remark" v-if="isShowRemarkBox">
        <el-input type="textarea" v-model="form.remark" :placeholder="projectTask.placeholder" :autosize="{ minRows: 3}"></el-input>
      </el-form-item>
    </el-form> 
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false;" size='medium'>取 消</el-button>
      <el-button type="primary" @click="submitBtn" size='medium'>确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name:'sendBackTask',
  data(){
    return {
      dialogVisible:false,
      form:{
        remark:'',
        radioState:'PASSED',
        checkList:[]
      },
      projectStateList:[], // 可选的状态
      rules:{
        remark:[{ required: true, message: '请输入原因', trigger: 'blur' },
        { min: 1, max: 200, message: '超出200字符', trigger: 'blur' }],
        checkList:{ type: 'array', required: true, message: '请选择需要修改的内容', trigger: 'change' }
      }
    }
  },
  props:['projectTask','value'], // value  弹框开关
  watch:{
    value(val){
      this.dialogVisible = val
      if(val){
        this.getCheckList() // 查询退回的可选列表
      }
    },
  },
  computed:{
    radioLabel(){
      if(this.projectTask.type === 'SIGN_PROJECT'){
         return '签发'
      }else{
        return '通过'
      }
    },
    isShowRemarkBox(){
      if(!['REVIEW_SCENE_RECORD','REVIEW_TEXT_RECORD','SIGN_PROJECT','AUDIT_PROJECT'].includes(this.projectTask.type)){
        return true
      }else if(this.form.radioState === 'REJECTED'){
        return true
      }
      return false
    },
    isShowCheckbox(){
      if(['BACK_EDIT','RECOVER_REPORT'].includes(this.projectTask.type)){
        return true
      }else if(['AUDIT_PROJECT','SIGN_PROJECT'].includes(this.projectTask.type) && this.form.radioState === 'REJECTED'){
        return true
      }
      return false
    }
  },
  methods:{
    // 查询有无扫码搜索后的可选列表
    getCheckList(){
      this.$http.projectService.getBackStateList(this.projectTask.projectId).then(res=>{
        this.projectStateList = res.data || []
      })
    },
    submitBtn(){
      this.$refs['remarkForm'].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.projectTask.type, this.form)
        }
      });
    },
    resetForm() {
      this.$refs['remarkForm'].resetFields();
    },
    closeDialog(){
      this.$emit('input',false)
      this.form = {
        remark:'',
        radioState:'PASSED',
        checkList:[]
      },
      this.resetForm()
    },
  }
}
</script>

<style scoped>
  .custom-dialog >>> .el-form-item__content{
    line-height: 22px;
  }
  .custom-dialog >>> .el-form-item{
    margin-bottom: 16px;
  }
  .custom-dialog >>> .el-form--label-top .el-form-item__label{
    height: 26px;
    line-height: 26px;
  }
  .checkbox >>> label.el-checkbox{
    display: inline-block;
    margin:0 10px 0 0;
  }
</style>

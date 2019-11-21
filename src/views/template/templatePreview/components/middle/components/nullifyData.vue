<template>
  <div>
    <el-form :model="form" label-position="top" :rules='rules' ref='reasonForm'>
      <el-form-item label="" prop="reason">
        <el-input
          type='textarea'
          :autosize='{ minRows: 3}'
          :placeholder='placeholder'
          v-model='form.reason'>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data(){
    return {  
      form:{
        reason:'',
      },
      rules:{
        reason:[{ required: true, message: '请输入原因', trigger: 'blur' },
              { min: 1, max: 200, message: '超出200字符', trigger: 'blur' }]
      }
    }
  },
  computed:{
    placeholder(){
      let type = {
        unvalid:'请输入作废原因（200字以内）',
        valid:'请输入取消作废原因（200字以内）',
      }
      return type[this.type]
    }
  },
  props:{
    type:{  // 该操作的类型， 默认为作废数据
      default:'unvalid'
    },
    interfaceType:{  
      default:'form' // 默认表单录入的作废接口
    },
    trId:String
  },
  methods:{
    submit(){
       this.$refs['reasonForm'].validate((valid) => {
        if (valid) {
          const params = {
            ids:[this.trId],
            valid:this.type === 'valid',
            reason:this.form.reason
          }
          if(this.interfaceType === 'form'){ // 表单里面的作废
            this.$http.formEnterService.nullifyFormData(params).then(res => {
              this.$emit('refreshData')
              this.reset()
            })
          }else{  // 扫码录入里面的作废
            this.$http.formEnterService.nullifyScanCodeData(params).then(res => {
              this.$emit('refreshData')
              this.reset()
            })
          }
        }
      }) 
    },
    reset(){
      this.form.reason = '';
      this.$refs['reasonForm'].resetFields();
    }
  }
};
</script>

<style scoped>
.dialog-footer{
  padding: 15px 20px;
  text-align: right;
}
</style>

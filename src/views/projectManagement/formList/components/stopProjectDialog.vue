<template>
  <el-dialog
    :title="stopProjectForm.title"
    :visible.sync="dialogVisible"
    v-el-drag-dialog
    :close-on-click-modal="false"
    @close='closeDialog'
    class="custom-dialog"
    width="30%">
    <el-form ref="stopForm" :model="form" :rules="rules" label-position="top">
      <el-form-item label="选择暂停或终止" prop="radioState" v-if="!stopProjectForm.type">
        <el-radio-group v-model="form.radioState">
          <el-radio label="STOP">暂停</el-radio>
          <el-radio label="END">终止</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="需要修改的内容" prop='type'>
         <el-select v-model="form.type" placeholder="请选择"   size="small" style="width:100%">
          <el-option label="我方原因" value="OUR_REASONS"></el-option>
          <el-option label="对方原因" value="OTHER_REASONS"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详情 (200字以内)" prop="remark">
        <el-input type="textarea" v-model="form.remark" :placeholder="placeholder" :autosize="{ minRows: 3}"></el-input>
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
  data() {
    return {
      dialogVisible: false,
      form: {
        remark: "",
        radioState: 'STOP',   // STOP 暂停, END 终止
        type: 'OUR_REASONS'
      },
      rules: {
        radioState: [
          { required: true, message: "请选择暂停或终止", trigger: "change" },
        ],
        remark:[{ required: true, message: '请输入原因', trigger: 'blur' },
        { min: 1, max: 200, message: '超出200字符', trigger: 'blur' }],
        type: { required: true, message: "请选择原因类别", trigger: "change" },
      }
    };
  },
  props: ["stopProjectForm", "value"], // value  弹框开关
  watch: {
    value(val) {
      this.dialogVisible = val;
      if(this.stopProjectForm.type){
        this.form.radioState = this.stopProjectForm.type
      }
    }
  },
  computed:{
    placeholder(){
      const tips = {
        STOP:'暂停',
        END:'终止',
      }
      return `请输入${tips[this.form.radioState]}原因`
    }
  },
  methods:{
    submitBtn(){
      this.$refs['stopForm'].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
        }
      })
    },
    resetForm(){
      this.$refs['stopForm'].resetFields();
    },
    closeDialog(){
      this.$emit('input',false)
      this.form = {
        remark: "",
        radioState: 'STOP',   
        type: 'OUR_REASONS'
      },
      this.resetForm()
    },
  }
};
</script>

<style scoped>
  .custom-dialog >>> .el-form--label-top .el-form-item__label{
    height: 22px;
    line-height: 24px;
  }
</style>

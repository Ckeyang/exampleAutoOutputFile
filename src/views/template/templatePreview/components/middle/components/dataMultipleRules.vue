<template>
  <el-dialog
    title="当前数据触发多个规则"
    :visible.sync="dialogVisible"
    @close='closeDialog'
    :close-on-click-modal="false"
    width="30%">
    <div>
      <label for="#" class="rule-name">规则名称</label>
      <el-select v-model="checkedValue" placeholder="请选择" style="width:100%">
        <el-option
          v-for="item in ruleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleRule">先去处理当前的规则</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data(){
    return {
      checkedValue:'',
      dialogVisible:false
    }
  },
  props:{
    'ruleOptions': {
      type:Array,
      default:()=> []
    },
    visible:Boolean
  },
  watch:{
    visible(val){
      this.dialogVisible = val
    },
  },
  methods:{
    handleRule(){
      this.dialogVisible = false;
      this.$emit('getCheckedRules',this.checkedValue)
    },
    closeDialog(){
      this.$emit('update:visible',false)
    }
  }
}
</script>

<style scoped>
  .rule-name{
    color: #1A2029;
  }
</style>

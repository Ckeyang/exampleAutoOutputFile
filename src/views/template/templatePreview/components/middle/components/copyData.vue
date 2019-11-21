<template>
  <el-dialog
    title="复制数据"
    :visible.sync="copyDataVisible"
    width="30%"
    @close='closeDialog'
    :close-on-click-modal="false">
    <p class="tips-text">复制本条数据的同时，是否也一起复制当条数据对应的以下数据？</p>
    <div class="assembly-list-box">
      <el-checkbox
        v-for="item in assemblyList"
        v-model="item.isChoice"
        :key="item.id">
        <span class="tableHeadName">{{item.name}}</span>
        <span>&nbsp;({{item.dataNum}}条)</span>
      </el-checkbox>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" size='medium'>取 消</el-button>
      <el-button type="primary" @click="submitData" size='medium' :loading="loading">确定复制</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name:'copyData',
  data(){
    return {
      copyDataVisible:false,
      dataId:null,
      loading:false,
      assemblyList:[], //组件id列表
      formValue:null, // 该表单数据
    }
  },
  props:[],
  methods:{
    openDialog(dataId, assemblyList, formValue){
      this.assemblyList = assemblyList
      this.dataId= dataId
      this.formValue = formValue
      this.copyDataVisible = true
    },
    closeDialog(){
      this.copyDataVisible = false
      const timer = setTimeout(()=>{
        // 添加延迟为了避免弹框抖动
        this.assemblyList = []
        this.dataId = null
        clearTimeout(timer)
      },200)
    },
    submitData(){
      this.loading = true
      this.$http.formEnterService.saveData(this.formValue).then(res => {
        const params = {
          listData: this.assemblyList.filter(item => item.isChoice).map(item => item.id),
        }
          this.$http.formEnterService.copyData(this.dataId, res.data.id, params).then(res => {
            this.$emit('refreshData')
            this.$message({
              message:'复制成功！',
              type:'success'
            })
            this.closeDialog()
          }).finally(()=>{
            this.loading = false
          });
        });
    }
  } 
}
</script>

<style lang="scss" scoped>
  .tips-text{
    font-size:14px;
    color:#595959;
    line-height:22px;
  }
  .assembly-list-box .el-checkbox{
    display: block;
    margin: 10px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size:14px;
    color:rgba(38,38,38,1);
    line-height:20px;
}
</style>



<template>
  <el-dialog
    title="数据确认"
    :visible.sync="dialogVisible"
    width="580px"
    v-el-drag-dialog 
    :close-on-click-modal="false"
    @close='closeDialog'>
    <ul class="question-box" v-show="isShowDataList.length">
      <li v-for="(item, index) in isShowDataList" :key="index" >
        <el-tooltip  placement="top-start" effect="light" :offset='30' v-show="!item.allowSubmit">
          <div slot="content" class="tips-content">红色为必须修改项</div>
          <i class="iconfont icon-fengxian"></i>
        </el-tooltip>
        <el-popover
          placement="top-start"
          width="460"
          trigger="hover">
          <span class="item-name" v-html="formatvalue(item )"></span>
          <span slot="reference" class="item-name" v-html="formatvalue(item)"></span>
        </el-popover>
        <el-button type="primary" plain size='mini' class="eventBtn" @click="handleQustion(index)">去处理</el-button>
      </li>
    </ul>
    <p class="empty-text" v-show="!isShowDataList.length">暂无需修改数据！</p>
    <span slot="footer" class="dialog-footer" >
      <el-checkbox v-model="isIgnore" @change="handelIgnoreChange" class="ignore-btn" v-if='isShowIsIgnoreBtn'>忽略非必须处理项
        <span class="ignore-tips" v-show="isIgnore">注：下次提交将不再验证已经忽略的数据</span>
      </el-checkbox>
      <el-button @click="closeDialog" size='medium' >{{isShowSubmitBtn ? '取 消' : '关 闭'}}</el-button>
      <el-button type="primary" @click="submitData" size='medium' :loading="submitAllLoading" v-show="isShowSubmitBtn">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name:'submitDataValidate',
  data(){
    return {
      submitAllLoading:false,
      dialogVisible:false,
      isIgnore:false, // 是否忽略非必填项
    }
  },
  props:{
    visible:{
      default:false
    },
    projectId:String,
    //问题列表
    dataList:Array
  },
  computed:{
    isShowSubmitBtn(){
      return !this.dataList.some(item => !item.allowSubmit)
    },
    isShowIsIgnoreBtn(){
      return this.dataList.some(item => item.allowSubmit)
    },
    isShowDataList(){
      if(!this.isIgnore){
        return this.dataList
      }
      return this.dataList.filter(item => !item.allowSubmit)
    }
  },  
  watch:{
    visible(val){
      this.dialogVisible = val
      if(val){
        this.$http.projectService.findValidateFormDataStatus(this.projectId).then(res=>{
          this.isIgnore = !res.data;
        })
      }else{
        this.isIgnore = false;
      }
    },
  },
  methods:{
    handelIgnoreChange(val){
      this.$http.projectService.changValidateFormDataStatus(this.projectId, {validateFormData: !val}).then(()=>{
        val && this.submitData()
      }).catch(()=>{
        this.isIgnore = !this.isIgnore;
      })
    },
    formatvalue({componentName, subComponentName, dataIds, formDataValidateType, allowSubmit , customValidation, customNoteTip }){
      const num = dataIds.length
      if(customValidation){ // 自定义数据验证规则
        return `${customNoteTip}（${num}条）`
      }
      // 默认验证
      const obj = {
        NOT_FILLED :`涉及的<span style='color: #1890FF;'>${ componentName }</span>未填任何数据`,
        SUB_FORM_NOT_FILLED :`<span style='color: #1890FF;'>${ componentName }</span>中涉及的<span style='color: #1890FF;'>${subComponentName}</span>有 ${ num } 条数据未填`,
        NOT_COMPLETED :`<span style='color: #1890FF;'>${componentName}</span>有 ${num} 条数据未填完整`,
        NOT_QUOTED :`<span style='color: #1890FF;'>${componentName}</span>有 ${num} 条数据未被引用`,
        NOT_DATA_BATCH_ADAPTED :`<span style='color: #1890FF;'>${componentName}</span>中有 ${num} 条数据还未批量适配数据`,
        NOT_DATA_CONNECTED :`<span style='color: #1890FF;'>${componentName}</span>中有 ${num} 条数据还未关联数据`,
        NOT_SAMPLING :`<span style='color: #1890FF;'>${componentName}</span>中有 ${num} 条数据还未收样`,
      }
      return obj[formDataValidateType]
    },
    handleQustion(index){
      this.$emit('handleEvent', this.dataList[index])
    },
    submitData(){
      if(this.dataList.some(item => !item.allowSubmit )){ // 必须要处理的选项
        return ;
      }
      this.$confirm("<p class='comfire-title'>是否不处理这些数据，直接提交吗？</p><p class='comfire-text'>此数据项不是必需处理。</p>", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString:true,
        type: 'warning'
      })
      .then((state)=>{
        this.$emit('submitData')
      }).catch(()=>{})
    },
    closeDialog(){
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang='scss' scoped>
  .question-box{
    background:rgba(255,255,255,1);
    border:1px solid rgba(232,232,232,1);
    border-radius:2px;
    li{
      padding-left: 30px;
      font-size: 13px;
      color: #636060;
      clear: both;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item-name{
        display: inline-block;
        width:400px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    i{
      color: transparent;
      position: absolute;
      color: #F5222D;
      left: 10px;
    }
    li:nth-child(2n){
      border-top:1px solid rgba(232,232,232,1);
      border-bottom:1px solid rgba(232,232,232,1); 
    }
    li:last-child{
      border-bottom:none
    }
    .eventBtn{
      float: right;
      margin: 5px 10px
    }
  }
  .tips-content{
     color: #606266;
    } 
    .empty-text{
      text-align: center;
      margin-top: 10px;
    }
</style>
<style>
  .ignore-btn{
    float: left;
    margin-top: 8px;
  }
  .ignore-tips{
    color: #B3B3B3;
    font-size: 12px;
  } 
  .ignore-btn .el-checkbox__input{
    line-height: inherit;
  }
</style>


<template>
  <div class='com-input-box'>
    <el-form
      label-position='top'
      label-width='80px'
      @submit.native.prevent
    >
      <el-form-item>
        <ul class="sign-box">
          <li class="sign-item" v-for="item in (formValue.imageValue || [])" :key="item.url">
            <img :src="item.url" alt="">
            <i class="remove-btn el-icon-close" @click="removeSign(item.url)"></i>
          </li>
          <li class="sign-item add-sign-btn"><i class="iconfont icon-i-dianziqianming">打开APP签名</i></li>
        </ul>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'Signature',
  props: ["formAttribute","formValue"], //   formValue表单控件的值
  methods:{
    removeSign(url){
      this.formValue.imageValue = this.formValue.imageValue.filter(item => item.url !== url)
    }
  }
};
</script>

<style scoped>
  .sign-box{
    margin-top: 5px;
    display: flex;
    justify-content: flex-start;
  }
  .sign-item{
    width:116px;
    height:58px;
    margin-right: 10px;
    text-align: center;
    line-height: 58px;
    border:1px solid rgba(224,224,224,1);
    border-radius:5px;
    position: relative;
  }
  .sign-item.add-sign-btn{
    border:1px dashed #107AC2;
    color: #595959;
  }
  .sign-item.add-sign-btn i::before{
    margin-right: 3px;
    color: #107AC2;
  }
  .sign-item .add-sign-btn:hover{
    background: #E6F9FF;
  }
  .sign-item img{
    width: 99%;
  }
  .sign-item .remove-btn{
    position:absolute;
    right: 3px;
    top:3px;
    width:14px;
    height:14px;
    line-height: 14px;
    color: #fff;
    border-radius: 50%;
    cursor: pointer;
    background: #BFBFBF;
    font-size: 12px;
  }
  .sign-item .remove-btn:hover{
    background: #9e9e9e;
  }
</style>

<template>
  <transition name="el-fade-in-linear">
    <div class="loading-warpper"  v-show='visible' @click.stop>
      <div class="message-box" @click.stop transition="expand">
        <div class="message-body">
          <div class="tips-icon-box"><i class="iconfont icon-i-shengchengzhong"></i></div>
          <slot>
            <p style="color:#262626;" class="loading-text">正在处理中...</p>
            <!-- <p style="color:#666666">该操作为耗时操作，请耐心等待</p> -->
          </slot>
          <!-- <p style="color:#8C8C8C"><span style="color:#FE413B">{{this.time}}</span>s后关闭</p> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data(){
    return {
      time:0,
    }
  },
  props:{
    visible:Boolean,
    delay:{
      default:10,
      type:Number
    }
  },
  watch:{
    visible(val){
      if(val){
        let delay = this.delay
        this.time = delay
        const timer = setInterval(()=>{
          delay--
          if(delay<=0){
            this.$emit('update:visible',false)
            clearInterval(timer)
          }
          this.time = delay
        },1000)
      }
    }
  },
}
</script>

<style scoped lang='scss'>
  .loading-text{
    font-weight: bold;
    font-size: 15px;
  }
  .el-fade-in-linear-enter .message-box{
    transform: translateY(-20px);
  }
  .el-fade-in-linear-leave-active .message-box{
    transform: translateY(-6px);
  }
  .message-box{
    transition: all .3s;
    padding: 5px 20px 10px;
    background: red;
    display: inline-block;
    width: 310px;
    padding-bottom: 10px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    font-size: 18px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    text-align: center;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    position: absolute;
    left:50%;
    margin-left: -210px;
    top:30%;
    z-index: 10001;
  }
  .message-body{
    font-size: 14px;
    line-height: 26px;
    margin-bottom: 10px;
    .tips-icon-box{
      color: #107AC2;
      padding: 30px 0 10px;
      i{
        font-size:28px;
      }
    }
  }
  .loading-warpper{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color:rgba(0,0,0,.5);
    z-index: 1000;
  }
  
  .message-header{
    display: flex;
    padding: 3px 0 ;
    align-items: center;
    justify-content: space-between;
    span{
      font-size: 16px;
      font-weight: bold;
    }
    i{
      cursor: pointer;
    }
    i:hover{
      color: #1d7fff;
    } 
  }
  .expand-transition {
  transition: all .3s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}
.expand-enter, .expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
.icon-i-shengchengzhong{
  color: #1884CC;
}
.icon-i-shengchengzhong::before{
  animation: rotate 2s linear infinite;
  display: inline-block;
}
@keyframes rotate {
  from { transform: rotate(0deg)}
  to { transform: rotate(360deg)}
} 
</style>

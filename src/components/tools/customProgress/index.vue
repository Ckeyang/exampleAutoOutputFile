<template>
  <transition name="el-fade-in-linear">
    <div class="loading-warpper"  v-show='visible' @click.stop>
      <div class="message-box" @click.stop transition="expand">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" ></el-progress>
        <slot>
          <span class='progress-text'>{{progressTitle}} {{handleCount}} / {{totalCount}}</span>
        </slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props:{
    visible:{
      default:false,
      type:Boolean
    },
    progress:{ // 进度 0 - 100
      type:Number,
      default:0,
    },
    handleCount:{ // 已执行数量
      default:0,
    },
    totalCount:{ // 总数
      default: 1
    },
    progressTitle:{
      type:String
    }
  },
  computed:{
    percentage() {
      const progress = this.progress || (Number(this.handleCount) / Number(this.totalCount) * 100)
      if(Number(progress) >= 100){
        const timer1 = setTimeout(()=>{
          this.$emit('update:visible', false);
          clearTimeout(timer1)
        },200)
        const timer2 = setTimeout(()=>{
          this.$emit('update:handleCount', 0);
          this.$emit('update:totalCount', 1);
          clearTimeout(timer2)
        },500)
      }
      return parseInt(progress)
    },
  },
}
</script>

<style scoped lang='scss'>
  .el-fade-in-linear-enter .message-box{
    transform: translateY(-20px);
  }
  // .el-fade-in-linear-leave-active .message-box{
  //   transform: translateY(-6px);
  // }
  .message-box{
    transition: all .3s;
    padding: 5px 20px 10px;
    display: inline-block;
    width: 330px;
    padding-bottom: 10px;
    vertical-align: middle;
    font-size: 18px;
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
  .loading-warpper{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background:rgba(250,250,250,1);
    opacity:0.8;
    z-index: 1000;
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
.progress-text{
  color:#262626;
  font-size: 14px;
  position: relative;
  top:9px;
}
</style>

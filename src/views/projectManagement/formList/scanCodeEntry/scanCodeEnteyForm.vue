<template>
  <div class="form-enter-box" >
    <div class="page-box page-box-left"  v-if='totalNum > 1' >
      <el-button type="text" @click='pageChange(curIndex - 1)' ><i class="iconfont icon-page icon-saomazuoyoujiantou" title="上一条"  :class='{"disable":curIndex <= 0}'></i></el-button>
    </div>
    <div v-if='!isDisable' class="middle-box">
      <div style="text-align:center;margin-bottom: 10px;"  v-show='collapse && visibleComponentData.length'>
        <el-button type="text" @click='handleCollapse(false)' size="small" class="collapse-btn">点击查看数据详情<i class="iconfont icon-xia el-icon--right"></i></el-button>
      </div>
      <forms
        :model="item"
        v-for="(item,i) of visibleComponentData"
        :key="item.id"
        :sortIndex="i"
        :isLoop="false"
        v-show='!collapse'
        @handleApplyRules="checkRules">
      </forms>
      <div style="text-align:center;margin-bottom: 10px;" v-show='!collapse && visibleComponentData.length'>
        <el-button type="text" @click='handleCollapse(true)' size="small" class="collapse-btn">收起<i class="iconfont icon-shang el-icon--right" ></i></el-button>
      </div>
      <forms
        :model="item"
        :isShowClear="false"
        v-for="(item,i) of fillableComponentData"
        :key="item.id"
        :sortIndex="i"
        :isLoop="false"
        @handleApplyRules="checkRules">
      </forms>  
    </div>
    <div v-else class="middle-box" >
      <forms
        :model="item"
        :isShowClear="false"
        v-for="(item,i) of componentData"
        :key="item.id"
        :sortIndex="i"
        :isLoop="false"
        @handleApplyRules="checkRules">
      </forms>  
    </div>
    <div class="page-box page-box-right" v-if='totalNum > 1' >
      <el-button type="text" @click='pageChange(curIndex + 1)'><i class="iconfont icon-page icon-saomazuoyoujiantou next-icon" title="下一条"  :class='{"disable": curIndex >= (totalNum - 1)}'></i></el-button>
    </div>
  </div>
</template>

<script>
import forms from "@/views/template/templatePreview/components/middle/ComponentWarp.vue";
export default {
  name: "scanCodeEnteyForm",
  components:{ forms },
  data() {
    return {
      collapse:true,  // 是否折叠表单数据
    };
  },
  props: {
    // 表单数据
    componentData: {
      type: Array,
      default: () => []
    },
    // 表单数据
    componentRules: {
      type: Array,
      default: () => []
    },
    // 当前显示的表单项索引
    curIndex:{
      default:0
    },
    // 数据总条数
    totalNum:{
      default:1
    },
    // 是否禁用表单
    isDisable:{
      type:Boolean,
      default:false
    },
  },
  computed:{
    // 可填的数据
    fillableComponentData(){
      // 如果禁用表单不使用该值
      if(this.isDisable){
        return []
      }
      return this.componentData.filter(
        item => item.componentAttr.visible && item.componentAttr.fillable
      );
    },
    // 不可填的数据
    visibleComponentData(){
      if(this.isDisable){ // 如果禁用表单不使用该值
        return []
      }
      return this.componentData.filter(
        item => item.componentAttr.visible && !item.componentAttr.fillable
      );
    }
  },
  methods: {
    handleCollapse(val){
      this.collapse = val 
    },
    pageChange(index){
      if(index < 0){
        index = 0
      }
      if(index > this.totalNum - 1){
        index = this.totalNum - 1
      }
     this.$emit('handleChange',index) // 数据页改变
    },
     //校验规则
    checkRules() {
      this.$emit('checkRules')
    }
  }
};
</script>

<style scoped>
  .page-box{
    position: absolute;
    top: 100px;
  }
  .page-box-left{
    left: 5px;
    transform: rotateY(180deg);
  }
  .page-box-right{
    right: 7px;
  }
  .icon-page.iconfont{
    text-align: center;
    font-size: 36px;
    color: #B3B3B3;
    transition: all .2s;
  }
  .icon-page.iconfont.disable{
    cursor: not-allowed;
    color: #E0E0E0;
  }
  .icon-page:not(.disable):hover{
    color: #107AC2;
  }
 .middle-box{
   width: 100%;
 }
  .form-enter-box{
    display: flex;
    min-height: 100px;
    padding: 0 30px 0 50px;
    justify-content: space-between;
  }
  .form-enter-box .form-disable input{
    cursor: not-allowed;
    background:rgba(240,243,245,1);
    border-radius:5px;
    pointer-events: none;
  }
  .collapse-btn{
    border: 1px dashed #1884CC;
    width: 100%;
  }
  .collapse-btn:hover{
    background: rgba(230,249,255,1);
  }
</style>

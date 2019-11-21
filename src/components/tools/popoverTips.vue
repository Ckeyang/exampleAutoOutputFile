<template>
  <el-popover
    placement='left'
    width='250'
    :trigger='trigger'
  >
    <slot></slot>
    <i
      style='color:#40A9FF'
      class='iconfont click-btn'
      slot='reference'
    >{{btnText}}</i>
  </el-popover>
</template>

<script>
export default {
  name: "popover-tips",
  props: {
    labelWidth: {
      default: "64px"
    },
    btnText:{
      default:'查看原因'
    },
    trigger:{
      default:'hover'
    }
  }
};
</script>

<style>
.click-btn{
  font-size: 12px;
  cursor: pointer;
}
.click-btn:focus{
  outline: none
}
.popover-tips-box {
  line-height: 22px;
  color: #595959;
}
.popover-tips-box .tips-item-content {
  padding-left: 80px;
  word-break: break-all;
}
.popover-tips-box li {
  position: relative;
}
.popover-tips-box .tips-item-title {
  color: #262626;
  position: absolute;
}
.popover-tips-box .tips-item-title span {
  display: inline-block;
  width: 64px;
  text-align-last: justify;
}
</style>


<template>
   <div v-show='isShowBackTop' @click='backTop'  >
      <i class="iconfont icon-huidaodingbu backTop"
         title="回到顶部" 
         :style="{bottom:(backTopBottom || 70) + 'px',right:(backgTopRight || 300)+'px'}"></i>
    </div>
</template>
<script>
export default {
  name: 'backTop',
  data() {
    return {
      isShowBackTop: false, //是否显示返回按钮
      scrollbarNode: null //滚动元素节点
    };
  },
  props: ['scrollbarClass', 'backTopBottom', 'backgTopRight'], //滚动元素的class、底部距离(可选)，右边距离(可选)
  mounted() {
    let _this = this;
    this.$nextTick(() => {
      this.scrollbarNode = document.querySelector(this.scrollbarClass);
      this.scrollbarNode.onscroll = function() {
        _this.isShowBackTop = parseInt(this.scrollTop) > 800; //大于800显示返回按钮
      };
    });
  },
  methods: {
    backTop() {
      let middleHeight = this.scrollbarNode.scrollTop;
      let timer = setInterval(() => {
        middleHeight -= Math.ceil(this.scrollbarNode.scrollTop / 10);
        if (middleHeight > 0) {
          this.scrollbarNode.scrollTop = middleHeight + '';
        } else {
          clearInterval(timer);
        }
      }, 10);
    }
  }
};
</script>
<style scoped>
.backTop {
  position: fixed;
  bottom: 70px;
  right: 300px;
  font-size: 34px;
  cursor: pointer;
  transition: color 0.3s;
  color: #627185;
  z-index: 99999;
}
.backTop:hover {
  color: #1884CC;
}
</style>



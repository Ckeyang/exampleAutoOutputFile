<template>
  <div>
    <!-- <p class="tips">拖动下方滑块完成拼图</p> -->
    <div id="captcha"></div>
  </div>
</template>

<script>
let jigsaw =null;
import Jigsaw from "./index.js";
import "./index.css";
export default {
  mounted() {
   jigsaw = new Jigsaw({
      el: document.getElementById("captcha"), 
      onSuccess:()=>{
        this.$emit('onSuccess')
      },
      onError: () => {
        this.$emit("onError");
      },
      onRefresh: () => {
        this.$emit("onRefresh");
      }
    });
    jigsaw.init();
  },
  methods:{
    reset() {
     jigsaw.reset();
   },
  },
  destroyed() {
    jigsaw.destroyedEvent();
  }
};
</script>

<style scoped>
  .tips{
    color: #45494c;
    margin-bottom: 10px;
  }
</style>

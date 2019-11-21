<template>
  <div class="order-box">
    <page-header>
        <template slot="title">
          <span class='header-title'>购买中心</span>
        </template>
    </page-header>
    <router-view ></router-view>
  </div>
</template>

<script>
import pageHeader from "@/components/tools/pageHeader.vue";
export default {
  components:{ pageHeader },
  data(){
    return {
      
    }
  }
}
</script>

<style scoped lang='scss'>
.order-box {
  background: #f0f3f5;
  height: 100%;
  overflow: auto;
}
</style>


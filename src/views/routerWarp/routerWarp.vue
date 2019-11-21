<template>
  <div class="router-warp">
    <transition name='el-fade-in'>
      <keep-alive :include="keepAliveList">
        <router-view :key="$route.path"/>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
export default{
  computed:{
    // 被缓存的路由
    keepAliveList(){
      // return []
      return this.$store.state.Tags.cachesRouters
    }
  },
}
</script>
<style>
.content-warp,
.router-warp {
  height: 100%;
  overflow: hidden;
}

</style>
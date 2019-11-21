<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags :isCollapse='collapse'></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                  <router-view v-if='isRouterAlive'></router-view>
                </transition> 
              <!-- <keep-alive :include="keepAliveList">
                <router-view :key="$route.path" v-if='isRouterAlive'/>
              </keep-alive> -->
            </div>
        </div>
    </div>
</template>
<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import Vue from './bus.js';
export default {
  data() {
    return {
      collapse: false
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  computed:{
    isRouterAlive(){
      return this.$store.state.Jurisdiction.isRouterAlive
    },
    // 被缓存的路由
    keepAliveList(){
      // return []
      return this.$store.state.Tags.cachesRouters
    }
  },
  watch:{
    isRouterAlive(val){
      if(!val){
        this.$nextTick(() => {
          this.$store.commit({
          type:'refershHomeRouter',
            val:true
          })
        })
      }
    }
  },
  created() {
    // 监听折叠事件
    Vue.$on('collapse', (msg) => {
      this.collapse = msg;
    });
  }
};
</script>
<style>
.content {
  padding: 52px 5px 15px 15px;
  height: 100%;
  box-sizing: border-box;
}
</style>


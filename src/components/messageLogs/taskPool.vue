<template>
  <div class="task-pool-box" v-show="list.length">
    <el-dropdown :hide-on-click='false'>
      <span class='el-dropdown-link'>
        <div class="task-box">
          <i class="iconfont icon-i-shengchengzhong"></i>
          <span ><span>{{firstData.type}}</span>&nbsp;{{firstData.message}}</span>
          <i class='iconfont icon-i-yijianzhankai'></i>
        </div>
      </span>
      <el-dropdown-menu slot='dropdown'>
        <el-dropdown-item v-for="item in list" :key="item.id">
          <p class="list"><i class="iconfont icon-i-shengchengzhong" ></i>
            <span style="color:#F28424">{{item.type}}</span>&nbsp;{{item.message}}
          </p>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
   
</template>
<script>
import bus from '@/views/common/bus.js'
export default {
  name: "taskPool", // 任务池
  data() {
    return {
      list: []
    };
  },
  computed:{
    firstData(){
      if(this.list.length){
        return this.list[0];
      }
      return {};
    }
  },
  created(){
    this.getData() // 保证意外断开后的消息丢失
  },
  mounted(){
    bus.$on('ws_getTaskPool', this.webSocketCb) // 添加websocket 事件监听
  },
  beforeDestroy(){
    bus.$off('ws_getTaskPool', this.webSocketCb) // 移除websocket 事件监听
  },
  methods: {
    getData(){
      this.$http
    },
    webSocketCb(data){
      if(data.status === 'FINISHED'){
        this.list = this.list.filter(item => item.id !== data.id)
      }else{
        this.list.unshift(data)
      }
    }
  }
};
</script>
<style scoped>
.task-box{
  width:380px;
  height:32px;
  line-height: 32px;
  padding: 0 20px 0 10px;
  background:rgba(229,248,255,1);
  border-radius:4px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
}
.task-pool-box{
  margin-right: 10px;
}
.icon-i-shengchengzhong::before{
  margin-right: 5px;
  color: #1884cc;
}
.icon-i-yijianzhankai{
  position: absolute;
  right:10px;
  color: #1884CC;
}
.list{
  width:390px;
  height:32px;
  line-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
}
.list .icon-i-shengchengzhong{
  color: #595959;
}
.el-dropdown-menu__item{
  padding: 0 10px;
}
.el-dropdown-menu{
  max-height: 500px;
  overflow: auto;
}
</style>

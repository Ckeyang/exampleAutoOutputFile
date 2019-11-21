<template>
  <div class="message-log">
    <el-popover
      placement="top"
      width="400"
      popper-class='tableHeadChoicePopper'
      v-model="visible"
      @show='getInfoList'
      @after-leave='clearData'>
      <div>
        <div class="header">
          <span class="title">消息</span>
          <i class="iconfont icon-yidu" title="全部标记已读" @click="readAll" v-show="dataList.length"></i>
        </div>
        <div class="message-box">
          <ul 
            >
            <li v-for="item in dataList" :key="item.id">
              <div class="mesg-content-box">
                <p class="mesg-content" :title="item.info">{{item.info}}</p>
                <!-- <span class="link-btn" @click="linkPage(item)">去查看</span> -->
              </div>
              <span>{{Number(item.createdDate) | formatDate('yyyy-MM-dd hh:mm')}}</span>
            </li>
          </ul>
          <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="30" >
          </div> 
          <p v-show="isNoMore" class="tips loading" >{{ !dataList.length ? '暂无消息': isNoMore ? '没有更多消息' : '加载中...'}}</p>
        </div>
           
      </div>
        <el-badge :is-dot='isDot' class="item" slot="reference">
          <i class="iconfont icon-xiaoxi" :style="{color:iconColor}"></i>
        </el-badge>
    </el-popover>
  </div>
</template>
<script>
import { debouce } from '@/utils.js'
import bus from '@/views/common/bus.js'
export default {
  name:'messageRecord',
  data() {
    return {
      dataList:[],
      visible:false,
      isNoMore:false,
      pageSize:20,
      current:0,
      loading:false,
      isDot:false,
    }
  },
  props:{
    iconColor:{
      default:'#fff',
    }
  },
  mounted(){
    bus.$on('webSocket', this.webSocketCb) // 添加websocket 事件监听
  },
  beforeDestroy(){
    bus.$off('webSocket', this.webSocketCb) // 移除websocket 事件监听
  },
  methods: {
    // 实时判断是否有未读消息
    webSocketCb(data){
      this.isDot = (this.isDot || !data.message.read)
    },
    getInfoList(){
      this.$http.websocketService.getWebSocketInfoList({pageSize:this.pageSize, current:this.current}).then(res=>{
        if(this.current){
          this.dataList = this.dataList.concat(res.data.content || [])
        }else{
          this.dataList = res.data.content || [];
        }
        this.loading = false;
        this.judgeIsDot(this.dataList)
        if(this.current >= res.data.totalPages){
          this.isNoMore = true;
        }
      })
    },
    // 判断是否有未读消息
    judgeIsDot(data){
      this.isDot = this.dataList.some(item => !item.read)
    },
    loadMore:debouce(function(){
      if(this.loading || this.isNoMore) return
      this.loading = true;
      if(this.current) {
        this.current++;
      }
      this.getInfoList()
    }, 500),
    readAll(){
      this.$http.websocketService.readInfo('ALL', 'ALL').then(()=>{
        this.dataList = this.dataList.map(item => {
          item.read = true;
          return item;
        })
        this.judgeIsDot(this.dataList)
      })
    },
    linkPage(item){
      this.$router.push(item.url)
      this.$http.websocketService.readInfo(item.id, 'SINGLE').then(()=>{
        item.read = true;
        this.judgeIsDot(this.dataList)
      })
    },
    clearData(){
      this.isNoMore = false;
      this.loading = false;
      this.current = 0;
    }
  },
}
</script>
<style scoped>
.icon-xiaoxi{
  cursor: pointer;
}
.header{
  display: flex;
  height: 20px;
  padding:12px;
  align-items: center;
  border-bottom: 1px solid #E8E8E8;
  justify-content: space-between;
}
.title{
  color: #333333;
  font-size: 15px;
}
.icon-yidu{
  font-size: 12px;
  color: #999999;
  cursor: pointer;
}
.message-box{
  max-height: 300px;
  overflow: auto;
}
.message-box li{
  line-height: 35px;
  padding:0 12px;
  display: flex;
  justify-content: space-between;
}
.message-box li:hover .mesg-content{
  color:#262626;
}
.message-box li:hover .link-btn{
  color:#1C8EFF;
}
.message-box li:hover{
  background: #E6F9FF;
}
.mesg-content-box{
  display: flex;
}
.message-box .mesg-content{
  width:250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.link-btn{
  margin-left: 5px;
  color:#89BFF5;
  cursor: pointer;
}
.link-btn:hover{
  text-decoration: underline;
}
.icon-xiaoxi{
  font-size: inherit;
}
.loading{
  text-align: center;
  margin-top: 10px;
}
</style>
<style >
  .message-log .el-badge{
    margin: 0 10px;
  }
  .message-log >>> .el-popover{
    padding:0;
  }
</style>

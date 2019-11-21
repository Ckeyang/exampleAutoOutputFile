<template>
  <div class="regulation-tb box-style_common dashboard-container">
    <div class="tools-bar_common">
      <h5 class="table-title">待办事项</h5>
    </div>
    <div class="dashboard-box">
      <el-row :gutter="20" v-for="(item,index) in list" :key="index" class="grid-content-box">
        <el-col :span="4" v-for="item2 in item" :key="item2.projectStateInfo">
          <div class="grid-content" @click="goPage(item2)">
            <p class="grid-item-title">{{item2.projectStateInfo}}</p>
            <p class="grid-item-num"><countTo :startVal='0' :endVal='item2.size' :duration='1500' ></countTo></p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import countTo from 'vue-count-to';
export default {
  components:{countTo},
  data() {
    return {
      list: []
    };
  },
  created() {
    this.$http.indexService.getWaitWorks().then(res => {
      this.list.push(
        res.data.slice(0, 6),
        res.data.slice(6, 12),
      );
    });
  },
  methods:{
    goPage({path, projectState}){
      this.$router.push({
        path,
        query:{
          projectState
        }
      })
    }
  }
};
</script>

<style scoped lang='scss'>
.dashboard-container {
  height: 100%;
}
.dashboard-box {
  width: 100%;
  padding: 20px 5px 20px 20px;
  box-sizing: border-box;
  .grid-content-box {
    width: 100%;
    margin-bottom: 20px;
  }
  .grid-content {
    height: 150px;
    background: #fff;
    border: 1px solid rgba(224, 224, 224, 1);
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-top: 4px solid #91d5f2;
    .grid-item-title {
      font-size: 15px;
      color: #454545;
      margin-bottom: 15px;
    }
    .grid-item-num {
      font-size: 30px;
      color: #1884cc;
    }
  }
  .grid-content:hover {
    background: #ebfaff;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>

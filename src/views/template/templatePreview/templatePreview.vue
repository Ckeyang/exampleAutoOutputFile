<template>
  <div class="templateWarp" @click="isRightAttrFormShow=false;">
    <header>
      <div class="top-btn">
        <div class="form-title">
          <span>{{companyName}}</span>
          <span class='entrust-number'>{{entrustNumber}}</span>
        </div>
      </div>
      <div class="right-box">
        <!-- 任务池 -->
        <task-pool  /> 
        <!-- 消息池 -->
        <message-logs class="message-logs" iconColor='#fff' />
      </div>
    </header>
    <Lefts
        @getChild="getChildData"
        @handleCollapse='handleCollapse'
        @getTitle='getTitle'
        ref="formLeftTree"
        :curId="curId"
        :projectName='tempName'
        :isReLoadLeftData="isReLoadLeftData"
    ></Lefts>
    <div class="formEnter-box">
      <div class="middle-box">
        <Middles
          :curId="curId"
          :isBasic='isBasic'
          :curTrId="curTrId"
          :title="title"
          :style="{'padding-left':collapse ? '55px' : '285px'}"
          @checkCustom="checkCustom"
          @backUp='backParentNode'
          @handleisReLoadLeftData="handleisReLoadLeftData"
        ></Middles>
      </div>
    </div>
  </div>
</template>
<script>
import Lefts from "./components/LeftPreview.vue";
import Middles from "./components/middle/MiddlePreview.vue";
import messageLogs from '@/components/messageLogs/index.vue'
import taskPool from '@/components/messageLogs/taskPool.vue'
import { mapGetters } from "vuex";
export default {
  name: "templatePreview",
  components: {
    Lefts, // 左边组件
    Middles, //中间表单
    messageLogs,
    taskPool
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  created() {
    this.tempId = this.$route.params.tempId;
    this.action = this.$route.params.action; // edit 录入 view 查看
    this.entrustNumber = this.$route.params.entrustNumber; 
    this.tempName = this.$route.params.tempName; //表单名称
    this.companyName = this.$route.params.companyName; 
    document.title = this.action === "edit" ? '录入表单' : this.$route.params.type === 'template' ?　'模板预览' : '查看数据' ;
  },
  data() {
    return {
      tempId: "",
      action: "",
      curId: "", //当前点击的节点id
      isBasic:true, // 是否为基础组件
      oldCurInfo:[], //上一级节点信息，用于返回上一级
      curTrId: "", //组件的行id
      title: "", // 右侧的title
      isRightAttrFormShow: false, // 是否显示右侧属性栏
      isReLoadLeftData: false, //是否刷新右侧数据
      companyName: "",
      tempName:'',
      entrustNumber:'',  // 委托编号
      collapse:false, // 是否收缩左侧列表
    };
  },
  methods: {
    // 是否收缩左侧列表
    handleCollapse(isCollapse){
      this.collapse = isCollapse;
    },
    rightChange(val) {
      this.data.rightData = val;
    },
    centerChange(val) {
      this.data.rightData = val;
    },
    //获取中间子组件的数据
    getChildData(id, tag, basic = true) {
      this.curId = id;
      this.curTrId = "";
      this.title = tag;
      this.isBasic = basic;
    },
    //改变组件id,渲染下级组件
    checkCustom(row) {
      this.saveParentNode()
      this.curId = row.id;
      this.curTrId = row.dataId;
      this.title = row.name;
    },
    //记录上一级节点信息
    saveParentNode() {
      this.oldCurInfo.push({
        id:this.curId,
        dataId:this.curTrId,
        title:this.title
      })
    },
    /**
     * @param { String } type 点击返回上级的数据类型 null 组件顶顶部点击返回、 list 列表项点击返回
     */
    backParentNode(type = null){
      if(!type){
        const curObj = this.oldCurInfo.pop()
        if(curObj){
          this.curId = curObj.id;
          this.curTrId = curObj.dataId;
          this.title = curObj.title;
        }
      }else{
        const curIdArr = this.curId.split('-')
        this.curId = curIdArr.slice(0, curIdArr.length - 1).join('-')
      }
    },
    // 获取title
    getTitle(title){
      this.title = title;
    },
    handleisReLoadLeftData() {
      this.isReLoadLeftData = !this.isReLoadLeftData;
    },
    //发布表单
    releaseForm() {
      this.$http.templateService
        .releaseForms(JSON.parse(sessionStorage.tempTemplateParams))
        .then(res => {
          this.$message({
            message: "表单发布成功",
            type: "success"
          });
        });
    },
    //返回项目列表
    backProjectList() {
      window.close();
      this.$router.push("/projectManagement/formList");
    }
  }
};
</script>
<style lang="scss" scoped>
header {
  width: 100%;
  height: 60px;
  display: flex;
  color: #f3f5f6;
  justify-content: space-between;
  align-items: center;
  background: #107AC2;
}
header .right-box{
  display: flex;
  align-items: center;
}
.templateWarp {
  min-height: 100%;
  width: 100%;
  background: #f0f0f0;
}
.formEnter-box {
  padding: 15px;
  height: calc(100vh - 90px)
}
.formEnter-box .middle-box {
  height: 100%;
}
.top-btn {
  display: flex;
  height: 32px;
  margin: 0 16px 0 14px;
  justify-content: space-around;
  .form-title{
    display:flex;
    align-items: center;
    font-size: 20px;
    .entrust-number{
      font-size: 16px;
      margin-left: 8px;
    }
  }
}
.message-logs{
  margin-right: 10px;
}
</style>
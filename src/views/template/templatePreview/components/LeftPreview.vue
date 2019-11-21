<template>
  <div
    class="left"
    :style="{width:collapse ? '40px' : '270px'}"
    v-loading='loading'>
    <div v-show="!collapse" style='height:100%'>
      <div class="left-title-box" v-show="!loading" :title='projectName'>{{ projectName }}</div>   
      <el-scrollbar class='el-scrollbar_height'>
        <div class="left-components">
            <el-tree
              :data="componentsData"
              empty-text='暂无数据'
              node-key="id"
              :default-expanded-keys="expandedKeys"
              @node-expand='nodeExpand'
              @node-collapse='nodeCollapse'
              :expand-on-click-node='false'
              :default-expand-all='true'
              :props="defaultProps"
              @node-click='nodeClick'
            >
              <span
                class="custom-tree-node"
                slot-scope="{ node, data }"
                :id='data.id'
              >
                <span
                  class="el-tree-node__label"
                  :title='node.label'
                >{{node.label}}</span>
              </span>
            </el-tree>
        </div>
      </el-scrollbar>
      <div class="collapse-btn" v-show="!loading" @click="handleCollapse(true)">
        <i class="iconfont icon-i-shouqi">收起</i>
      </div>
    </div>
    <div class="collapse-box" @click="handleCollapse(false)" v-show="collapse">
      <i class="iconfont icon-i-shouqi"></i>
    </div>
  </div>
</template>
<script>
let treeNodes = {} // 缓存每个树节点的dom
export default {
  data() {
    return {
      componentsData: [], //所有组件分类，左侧导航列表
      defaultProps: {
        children: "subForms",
        label: "tag",
        id: "id"
      },
      loading:false,
      collapse:false, // 是否收缩
      expandedKeys: [] //展开的节点数组
    };
  },
  props: ["isReLoadLeftData", "curId", 'projectName'],
  watch: {
    curId(val, old) {
      this.expandedKeys = [val]
      this.$nextTick(() => {
        this.toggleClass(old,false)
        this.toggleClass(val,true)
      });
    }
  },
  //初始化组件
  created() {
    this.getInitData("init");
    const curId = this.$route.query.curId
    if(curId){
      this.expandedKeys = [curId]
    }
  },
  methods: {
    handleCollapse(isCollapse){
      this.collapse = isCollapse
      this.$emit('handleCollapse', isCollapse)
    },
    //获取所有的组件树
    getInitData(init) {
      this.loading = true
      const queryParams = this.$route.query;
      if(this.$route.params.type === 'project'){
        this.$http.formEnterService
        .getComponentKind(this.$route.params.tempId)
        .then(res => {
          if (!res.data.length) {
            return;
          }
          this.componentsData = res.data;
          if(init){ 
            let data = res.data[0];
            if(queryParams.curId){ // 如果有默认参数传递过来
              const basic = queryParams.curId.split('-').length <= 1
              data = {id:queryParams.curId ,tag:queryParams.title, basic: basic}
            } 
            this.chooseItem(data);  // 当没有要初始打开的菜单时，默认打开第一项
          }
        }).finally(()=>{
          this.loading = false
        })
      }else{
        this.$http.formEnterService.getComponentPreviewTree(this.$route.params.tempId).then((res)=>{
          if (!res.data.length) {
            return;
          }
          this.componentsData = res.data;
           this.loading = false
          if(init){ 
            let data = res.data[0];
            if(queryParams.curId){ // 如果有默认参数传递过来
              const basic = queryParams.curId.split('-').length <= 1
              data = {id:queryParams.curId ,tag:queryParams.title, basic: basic}
            }
            this.chooseItem(data);  // 当没有要初始打开的菜单时，默认打开第一项
          }
        }).finally(()=>{
          this.loading = false
        })
      }
    },
    // 判断是基本组件还是自定义组件
    getComponentsType(id){
      this.componentsData
    },
    // 给当前的选中菜单添加样式
    toggleClass(nodeId, flag){
      const node = treeNodes[nodeId] || document.getElementById(nodeId);
      if(node){
        node.parentNode.className = flag ? 'el-tree-node__content custom-actived-node' : 'el-tree-node__content'
        treeNodes[nodeId] = node;
        if(flag){
          // 获取该节点的title
          this.$nextTick(()=>{
            this.$emit('getTitle', node.firstChild.innerText)
          })
        }
      }
    },
    nodeClick(val, node, data) {
      this.chooseItem(val, true);
      document.body.click()
    },
    // 打开选中菜单  
    chooseItem(node) {
      this.$emit("getChild", node.id, node.tag, node.basic);
    },
    //节点展开
    nodeExpand(node) {
      
    },
    //节点关闭
    nodeCollapse(node) {

    },
  }
};
</script>
<style scoped>
 .left {
  width: 270px;
  height: 90.5%;
  position: absolute;
  left: 15px;
  top:75px;
  border-right: 1px solid #d5e0ed;
  border-radius: 5px;
  box-shadow: 0 0 2px 2px rgba(176, 190, 209, 0.2);
  background: #fff;
}
.collapse-btn{
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 12px;
  color: #595959;
  border-top: 1px solid #E8E8E8
}
.collapse-btn .icon-i-shouqi::before{
  margin-right: 5px;
  color:#107AC2;
}
.collapse-box{
  height: 100%;
  width: 40px;
  position: absolute;
  left: 0;
  top:0;
  background: #fff;
  justify-content: center;
  display: flex;
  cursor: pointer;
  align-items: center;
}
.collapse-box .icon-i-shouqi{
  transform: rotate(180deg);
  cursor: pointer;
}
.collapse-box .icon-i-shouqi::before{
  color:#107AC2;
}
.components-box {
  padding: 0px 15px 20px 15px;
}
 
.el-scrollbar_height {
  height: calc(100% - 88px);
  height: -webkit-calc(100% - 88px);
  height: -moz-calc(100% - 88px);
  height: -ms-calc(100% - 88px);
}

.iconfont {
  font-size: 14px;
}

.icon {
  margin-left: -9px;
}

.components-box li {
  position: relative;
  width: 100%;
  height: 36px;
  border-radius: 4px;
  color: #5d687a;
  font-size: 14px;
  line-height: 36px;
  text-indent: 10px;
  margin-bottom: 10px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.data-nums {
  position: relative;
  left: -4px;
  top: 2px;
  font-size: 12px;
  font-weight: normal;
}

.custom-name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 140px;
  float: left;
  align-items: center;
}

.switch-box {
  width: 75px;
  float: right;
  display: flex;
  justify-content: space-around;
}

.components-box li:hover {
  color: #107AC2;
  border: 1px solid #107AC2;
}

.components-box .active-list {
  border: 1px solid #107AC2;
  color: #107AC2;
}

.components-box .active-red {
  border-color: #f96868;
}

.components-box .active-red .list-name {
  color: #f96868;
}

.components-box .active-list .list-name {
  color: #107AC2;
}
.left-components >>> .el-switch {
  margin-right: 6px;
}

.left-components >>> .el-tree-node__content {
  background: #fff;
  color: #3C4652;
  margin-top: 5px;
  height: 36px;
  font-weight: bold;
  font-family: "微软雅黑";
  position: relative;
}
.left-components >>> .el-tree-node__content.custom-actived-node{
  background-color: #E8F6FF !important;
  color : #107AC2 !important;
}
.left-components >>> .custom-actived-node::before{
  content:'';
  display: inline-block;
  width: 2px;
  height: 36px;
  position: absolute;
  left:0;
  background: #107AC2;
}
.left-components >>> .el-tree-node__content.custom-actived-node .el-tree-node__expand-icon:not(.is-leaf){
  color: #107AC2;
}
.left-components >>> .el-tree-node__expand-icon:not(.is-leaf){
  color: #107AC2;
}
.dropdown-box {
  margin-right: 10px;
  height: 38px;
  line-height: 38px;
}

.dropdown-box:hover .el-icon-more {
  color: #107AC2;
}

.left-components >>> .custom-tree-node {
  font-size: 13px;
  /* color: #13161a; */
  z-index: 2;
  display: flex;
  width: 100%;
  height: 38px;
  align-items: center;
  justify-content: space-between;
}
.list-border {
  position: absolute;
  width: 268px;
  height: 38px;
  left: 0;
  border-radius: 5px;
  border: 1px solid transparent;
}
.list-border:hover {
  background: rgba(235, 247, 255, 1);
  border: 1px solid #107AC2;
}

.left-components >>> .custom-tree-node .el-tree-node__label {
  font-size: 13px;
  flex-grow: 1;
  width: 100px;
  margin-right: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.left-components >>> .el-tree-node__children .el-tree-node__content,
.custom-component_box >>> .el-tree-node__content {
  background: #fff;
  font-weight: normal;
}
.left-components >>> .el-tree__drop-indicator {
  display: none;
}

</style>
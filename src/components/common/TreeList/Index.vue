<template>
  <div style="width:100%" class="treeList-box">
    <div class="left-title-box" :title='title'>
      {{ title }}
    </div>
    <el-scrollbar class="el-scrollbar_height">
      <div>
        <el-tree
          ref='left-tree'
          :data="data"
          :node-key="defaultProps.id"
          :default-expand-all="expandAll"
          :empty-text="emptyText"
          highlight-current
          :expand-on-click-node="expandOn"
          :props="defaultProps"
          @node-click="getcheckedId"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span class="el-tree-node__label">{{showName(node.label)}}</span>
          </span>
        </el-tree>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: "treelist",
  data() {
    return {
       
    };
  },
  props: {
    title: {},
    expandOn: {
      type: Boolean,
      default: true
    },
    expandAll: { // 默认展开全部节点
      type: Boolean,
      default: false
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "components",
          label: "componentAttr",
          id: "identifier"
        };
      }
    },
    defaultCheckKey:String, //默认选中的节点
    //设置显示名字的对象label后的字段    // 如  ['a','b'] =>   label.a.b
    nameList: {
      type: Array,
      default: () => {
        return [];
      }
	},
	//是否每层都可选
    isCheckedParent: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: "暂无数据"
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch:{
    defaultCheckKey(val, oldVal){
      oldVal || this.$nextTick(()=>{
        this.$refs['left-tree'].setCurrentKey(val)
      })
    }
  },
  methods: {
    getcheckedId(node) {
      if (this.isCheckedParent) {
        this.$emit("changeNode", node);
      } else if (
        !node[this.defaultProps.components] ||
        !node[this.defaultProps.components].length
      ) {
		    this.$emit("changeNode", node);
      }
    },
    showName(node) {
      this.nameList.forEach(ele => {
        if (ele) {
          node = node[ele];
        }
      });
      return node;
    }
  }
};
</script>
<style scoped>
.treeList-box {
  height: 100%;
  box-sizing: border-box;
}
.container-left .left-title-box{
  font-size: 14px;
}
.el-scrollbar_height {
  height: calc(100% - 45px);
}
.treeList-box >>> .el-tree-node__content {
  background: #fff;
  color: #3C4652;
  height: 36px;
  font-weight: bold;
  font-family: "微软雅黑";
  position: relative;
}
.treeList-box >>> .is-current > .el-tree-node__content {
  background-color: #E8F6FF !important;
  color : #107AC2 !important;
}
.treeList-box >>> .is-current > .el-tree-node__content > .el-tree-node__expand-icon:not(.is-leaf) {
  color : #107AC2 !important;
}
.treeList-box >>> .is-current > .el-tree-node__content::before{
  content:'';
  display: inline-block;
  width: 2px;
  height: 36px;
  position: absolute;
  left:0;
  background: #107AC2;
}
.dropdown-box {
  margin-right: 10px;
  height: 38px;
  line-height: 38px;
}

.treeList-box >>> .custom-tree-node {
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
  border: 1px solid rgba(38, 190, 255, 1);
}

.treeList-box >>> .custom-tree-node .el-tree-node__label {
  font-size: 13px;
  flex-grow: 1;
  width: 100px;
  margin-right: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.treeList-box >>> .el-tree-node__children .el-tree-node__content,
.custom-component_box >>> .el-tree-node__content {
  background: #fff;
  font-weight: normal;
}
.treeList-box >>> .el-tree__drop-indicator {
  display: none;
}
</style>

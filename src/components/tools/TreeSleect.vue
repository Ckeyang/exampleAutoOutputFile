<template>
  <div @click.stop>
    <div class="input-box">
      <el-input
        :placeholder="placeholder"
        v-model="value"
        clearable
        @focus="onFocus"
        size="mini"
        readonly
      ></el-input>
    </div>
    <div v-show="isShowTrees" class="tree-box">
      <el-scrollbar class="el-scrollbar_height">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          empty-text
          node-key="id"
          @node-click="handleNodeClick"
          :highlight-current="true"
          :expand-on-click-node="true"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="el-tree-node__label">{{ data.name || data.componentAttr.tag }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowTrees: false,
      defaultProps: {
        children: "subForms",
        label: "componentAttr",
        id: "id"
      }
    };
  },
  props: {
    placeholder: {
      type: String,
      default: "请选择内容"
    },
    treeData: {
      type: Array,
      default: []
    },
    value: {
      type: String,
      default: ""
    }
  },
  created() {
    let _this = this;
    document.getElementById("right-box").onclick = function() {
      _this.isShowTrees = false;
    };
  },
  methods: {
    //选择数据
    handleNodeClick(node) {
      if (!node.subForms || !node.subForms.length) {
        this.isShowTrees = false;
        this.$emit(
          "checkedConnectedComponentId",
          node.id,
          node.name || node.componentAttr.tag
        );
      }
    },
    onFocus() {
      this.isShowTrees = true;
    }
  }
};
</script>
<style scoped>
.el-scrollbar_height {
  padding: 5px 0;
  /* position: relative;
    z-index: 1; */
  height: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
}
.tree-box {
  position: absolute;
  z-index: 1;
  width: 100%;
  background: #fff;
}
.input-box >>> input {
  cursor: pointer;
}
</style>

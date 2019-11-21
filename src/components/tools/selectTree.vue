<template>
  <div class="box">
    <el-select
      v-if="multiple"
      style="width:100%"
      slot="reference"
      ref="select"
      v-model="key"
      :size="size"
      collapse-tags
      :clearable="true"
      multiple
      :placeholder="tipText"
      @click.native="isShowSelect = !isShowSelect"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select
      v-if="!multiple"
      style="width:100%"
      slot="reference"
      ref="select"
      v-model="keyOne"
      :size="size"
      collapse-tags
      :clearable="true"
      :multiple="multiple"
      :placeholder="tipText"
      @click.native="isShowSelect = !isShowSelect"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-popover placement="bottom-start" @hide="popoverHide" trigger="hover" v-model="isShowSelect">
      <el-tree
        style="max-height:300px;overflow-y:auto"
        v-if="isShowSelect"
        :data="treeData"
        :node-key="nodeKey"
        :show-checkbox="multiple"
        :default-expand-all="defaultExpandAll"
        :default-checked-keys="defaultCheckedKeys"
        highlight-current
        @current-change="handleNodeClick"
        @check="getKeys"
        :props="defaultProps"
      ></el-tree>
    </el-popover>
  </div>
</template>
<script>
import { setTimeout } from 'timers';
export default {
  props: {
    treeData: { type: Array, required: true },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    popoverHide: {
      type: Function,
      default: function() {}
    },
    defaultProps: {
      type: Object,
      default: function() {
        return { children: "children", label: "name" };
      }
    },
    size: { type: String, default: "small" },
    multiple: {
      type: Boolean,
      default: false
    },
    value: [String, Array],
    nodeKey: { type: String, default: "id" },
    tipText: { type: String, default: "请选择" }
  },
  data() {
    return {
      // 是否显示树状选择器
      isShowSelect: false,
      options: [],
      key: [],
      keyOne: "",
      showValueTmp: "",
      defaultExpandedKeys: [],
      defaultCheckedKeys: []
    };
  },
  watch: {
    isShowSelect(val) {
      this.$refs.select.blur();
    },
    key(val) {
      this.setTreeCheckNode(val);
      this.defaultCheckedKeys = val;
      this.defaultExpandedKeys = val;
      this.$emit("input", this.key);
      this.$nextTick();
    },
    keyOne(val) {
      this.setTreeCheckNode([val]);
      this.defaultCheckedKeys = [val];
      this.defaultExpandedKeys = [val];
      this.$emit("input", this.keyOne);
      this.$nextTick();
    }
  },
  created() {
    // 把传进来的参数转成数组处理
    // setTimeout(this.initKey, 1000);
    setTimeout(this.initKey, 1000);
  },
  methods: {
    reset() {
      this.key = [];
      this.defaultExpandedKeys = [];
      this.defaultCheckedKeys = [];
    },
    initKey() {
      this.reset();
      if (this.multiple && Array.isArray(this.value)) {
        this.key = this.value;
       setTimeout(()=>{this.setTreeCheckNode(this.key);},500) 
      } else {
        // this.value ? this.key.push(this.value) : null;
        this.keyOne = this.value;
        setTimeout(()=>{this.setTreeCheckNode([this.keyOne]);},500)
        
      }
    },

    handleNodeClick(data) {
      if (!this.multiple) {
        let tmpMap = {};
        tmpMap.value = data.id;
        tmpMap.label = data.name;
        this.options = [];
        this.options.push(tmpMap);
        // this.key = [data.id];
        this.keyOne = data.id;
        this.isShowSelect = !this.isShowSelect;
      }
    },
    getKeys(data, checked) {
      let tmp = [];
      checked.checkedNodes.forEach(node => {
        let tmpMap = {};
        tmpMap.value = node.id;
        tmpMap.label = node.name;
        tmp.push(tmpMap);
      });
      this.options = tmp;
      this.key = checked.checkedKeys;
    },
    setTreeCheckNode(ids) {
      this.options = [];
      ids.map(id => {
        this.findTreeNode(this.treeData, id);
        // tmp.push(obj);
      });
      // this.options = tmp;
    },
    // 递归查询树形节点
    findTreeNode(tree, id) {
      let i = 0;
      while (true) {
        if (tree.length === i) {
          break;
        }
        if (tree[i].id === id) {
          let obj = {
            value: tree[i].id,
            label: tree[i][this.defaultProps.label]
          };
          this.options.push(obj);
          break;
        }
        if (tree[i][this.defaultProps.children]) {
          this.findTreeNode(tree[i][this.defaultProps.children], id);
        }
        i++;
      }
    }
  }
};
</script>
<style>
.box .el-select-dropdown {
  display: none;
}
</style>

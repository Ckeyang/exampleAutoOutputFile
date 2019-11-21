<template>
  <el-dialog
    title="标签"
    :visible.sync="dialogVisible"
    width="30%"
    @close="close"
    :append-to-body="appendToBody"
    :close-on-click-modal="false"
    v-el-drag-dialog
  >
    <el-input placeholder="输入关键字进行过滤" size="small" clearable style="margin-bottom:10px;" v-model="filterText">
    </el-input>
    <div class="tag-box">
      <ul class="tag-radio-box">
        <li @click="taggle('MATERIALLABEL')" v-show="isShowMaterial" :class="{ active: tagType === 'MATERIALLABEL' }">
          物质标签
        </li>
        <li @click="taggle('INDUSTRYLABEL')" v-show="isShowIndustry" :class="{ active: tagType === 'INDUSTRYLABEL' }">
          行业标签
        </li>
        <li @click="taggle('CUSTOMLABEL')" v-show="isShowCustomer" :class="{ active: tagType === 'CUSTOMLABEL' }">
          自定义标签
        </li>
      </ul>
      <div class="tag-content-box" v-loading="loading">
        <el-tree
          ref="tagTree"
          :data="tagsTree"
          show-checkbox
          check-strictly
          @check="checkNode"
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          :props="defaultProps"
          :filter-node-method="filterNode"
        ></el-tree>
      </div>
    </div>
    <div class="checked-box">
      <span>已选中标签</span>
      <ul class="checked-tags-box">
        <li v-for="item in checkedTags" :key="item.id">
          <el-tag type="info" closable @close="tagClose(item.id)">{{ item.labelName }}</el-tag>
        </li>
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit" :disabled="disabled" size="medium" :class="{ disableBtn: disabled }"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
const tagPorops = {
  MATERIALLABEL: "meterialTags",
  INDUSTRYLABEL: "industryTags",
  CUSTOMLABEL: "customTags"
};
export default {
  data() {
    return {
      tagType: "MATERIALLABEL", // 标签类型
      dialogVisible: false,
      disabled: true, // 默认禁用保存按钮，当修改内容后取消
      loading: false, // 获取数据loading
      saveLoading: false, // 保存loading
      hasSavedTag: {}, // 已保存的tags
      checkedTags: [], // 已选中的tag
      tagsTree: [],
      defaultExpandedKeys: null, // 默认展开的key
      defaultProps: {
        id: "id",
        children: "subLabels",
        label: "labelName"
      },
      filterText: ""
    };
  },
  props: {
    curTagType: {
      //  默认打开的标签类型
      default: "MATERIALLABEL" // INDUSTRYLABEL 、INDUSTRYLABEL、CUSTOMLABEL
    },
    isBatchLabe: {
      // 是否批量打标签
      default: false
    },
    appendToBody: { type: Boolean, default: false },
    isShowMaterial: { type: Boolean, default: true },
    isShowIndustry: { type: Boolean, default: true },
    isShowCustomer: { type: Boolean, default: true }
  },
  watch: {
    filterText(val) {
      this.$refs.tagTree.filter(val);
    }
    // tagType(){
    //   this.filterText = ''
    // }
  },
  methods: {
    openDialog(meterialTags = [], industryTags = [], customTags = []) {
      this.hasSavedTag = JSON.parse(
        JSON.stringify({
          meterialTags,
          industryTags,
          customTags
        })
      );
      this.tagType = this.curTagType;
      this.getTagsTree(this.tagType);
      this.dialogVisible = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.labelName.indexOf(value) !== -1;
    },
    getTagsTree(labelType) {
      this.loading = true;
      this.$http.labelBankService
        .getLabelTree({ labelType })
        .then(res => {
          this.tagsTree = [res.data].map(item => {
            // 禁止选择第一级
            item.disabled = true;
            this.defaultExpandedKeys = [item.id];
            return item;
          });
          this.filterText = "";
          this.$nextTick(() => {
            if (!this.isBatchLabe) {
              this.$refs.tagTree.setCheckedKeys(this.hasSavedTag[tagPorops[this.tagType]] || []); // 设置选中状态
              this.checkedTags = this.$refs.tagTree.getCheckedNodes(); // 获取选中列表
            }
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 保存成功的回调
    success() {
      this.disabled = true;
      this.saveLoading = false;
      this.hasSavedTag[tagPorops[this.tagType]] = this.checkedTags.map(item => item.id); // 暂存保存了的tags
    },
    submit() {
      const checkedIds = this.checkedTags.map(item => item.id);
      const labelNames = this.checkedTags.map(item => item.labelName);
      this.saveLoading = true;
      /**
       * @param { Array } params1 选择的字段id
       * @param { function } params2 保存成功的回调函数
       */
      const params = {
        labelIds: checkedIds,
        labelType: this.tagType,
        labelNames: labelNames
      };
      this.$emit("submit", params, this.success);
    },
    close() {
      this.checkedTags = [];
      this.hasSavedTag = {};
      this.tagsTree = [];
      this.disabled = true;
    },
    taggle(val) {
      if (!this.disabled) {
        this.$message.error("当前操作未保存，请保存后继续！");
        return;
      }
      this.tagType = val;
      this.getTagsTree(val);
    },
    // 获取选择的节点
    checkNode(node, { checkedNodes }) {
      this.checkedTags = checkedNodes;
      this.disabled = false; // 取消保存禁用
    },
    // 标签取消
    tagClose(id) {
      this.checkedTags = this.checkedTags.filter(item => item.id !== id);
      this.$refs.tagTree.setCheckedNodes(this.checkedTags);
      this.disabled = false;
    }
  }
};
</script>

<style scoped lang="scss">
.tag-box {
  height: 290px;
  border: 1px solid #cad4e0;
  border-radius: 5px;
}
.tag-content-box {
  margin-top: 5px;
  height: 242px;
  overflow-y: auto;
}
.tag-radio-box {
  display: flex;
  li {
    flex: 1;
    text-align: center;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: bold;
    border-bottom: 1px solid #d5e0ed;
  }
  li:first-child,
  li:nth-child(2) {
    border-right: 1px solid #d5e0ed;
  }
  li.active {
    background: #bfe3ff;
    color: #1d7fff;
    position: relative;
  }
  .active::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid #bfe3ff;
    position: absolute;
    bottom: -7px;
    left: 50%;
    transform: translateX(-3px);
  }
}
.checked-box {
  margin-top: 10px;
}
.checked-tags-box {
  height: 70px;
  overflow-y: auto;
  padding-bottom: 6px;
  border: 1px dashed rgba(118, 146, 184, 1);
  border-radius: 5px;
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  li {
    margin-left: 6px;
    margin-top: 5px;
  }
}
.disableBtn,
.disableBtn:hover {
  background: #9dabbf !important;
  border-color: #9dabbf !important;
}
</style>

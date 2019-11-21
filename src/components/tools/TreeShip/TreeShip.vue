<template>
  <div class="treeBox">
    <slot name="name"></slot>
    <div style="padding-left:1em;" v-for="(item,index) in value" :key="index">
      <tree-group
        :catogryType="catogryType"
        :model.sync="item"
        :index="index"
        :class="{'lastOne':index===value.length-1&&pattern!='FORMULA'}"
        :createChild="createChild"
        :mode="mode"
        :fieldType="fieldType"
        :pattern="pattern"
        :shareList="shareList"
        :showFirst="index===0"
        @addGroup="addGroup"
        @removeGroup="removeGroup"
        :size='size'
      ></tree-group>
    </div>
    <el-button v-if="value.length===0" type="info" @click="createFirst" :size="size">创建第一个节点</el-button>
  </div>
</template>
<script>
import TreeGroup from "./TreeGroup.vue";
export default {
  name: "treeBox",
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // shareList:{type:Array,default:function(){return []}},
    size: { type: String, default: "mini" },
    catogryType: { type: String, default: "" },
    fieldType: { type: String, default: "SAMPLINGMETHOD" },
    pattern: { type: String, default: "NORMAL" }, //FORMULA
    mode: { type: String, default: "judge" }, //judege,condition
    createChild: { type: Boolean, default: true }
  },
  data(){
    return {
      shareList:[]
    }
  },
  components: { TreeGroup },
  watch: {
    value: {
      handler(arr) {
        arr.length!=0?arr[0].relationship="AND":null;
        this.$emit("input", arr);
        this.$forceUpdate();
      },
      deep: true,
      immediate:true
    }
  },
  created() {
    this.getShartList();
    if (this.value.length === 0) {
      this.value.push({
        calculationExpressionList: [],
        childList: [],
        relationship: "AND" //关系
      });
    }
  },
  methods: {
    createFirst() {
      this.value.push({
        calculationExpressionList: [],
        childList: [],
        relationship: "AND" //关系
      });
    },
     getShartList() {
      if (this.shareList.length === 0) {
        this.$http.sharedPartsService.getSharedPartsList({ evaluationCategory: this.catogryType }).then(res => {
          this.shareList = res.data.map(item=>{return {id:item.id,name:item.name}});
        });
      } else {
        this.shareList = this.shareList;
      }
    },
    addGroup() {
      this.value.push({
        calculationExpressionList: [],
        childList: [],
        relationship: "AND" //关系
      });
    },
    removeGroup(index) {
      this.value.splice(index, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.treeBox {
  padding: 1em;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
}
</style>

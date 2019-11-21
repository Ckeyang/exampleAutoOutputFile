<template>
  <div>
    <el-popover :placement="placement" trigger="click">
      <div v-for="(item,index) in ruleNode" :key="index" class="rule">
        <span style="cursor:pointer" @click="$emit('chooseItem',item)">{{item.name}}</span>
        &nbsp;&nbsp;
        <ruleBox
          v-show="item.shareComponentRuleList.length!=0"
          v-for="(jtem,index) in item.shareComponentRuleList"
          :key="index"
          :name="jtem.type"
        />
      </div>
      <span slot="reference" :title="name"><el-tag size="mini" type="">表格</el-tag></span>
    </el-popover>
  </div>
</template>
<script>
import ruleBox from "./ruleBox";
export default {
  name: "tableBox",
  components: { ruleBox },
  props: { ruleNode: Array, name: String, placement: String }
};
</script>
<style lang="scss" scoped>
.rule {
  display: flex;
  align-items: center;
  padding: 0.5em;
  text-align: left;
}
.el-tag {
  border-radius: 6px;
}
.dib {
  display: inline-block;
}
</style>


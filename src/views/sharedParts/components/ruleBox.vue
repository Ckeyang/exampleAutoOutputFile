<template>
  <div>
    <el-tag size="mini" :type="keyColr[name]">{{ key[name] }}</el-tag>
  </div>
</template>
<script>
export default {
  name: "ruleBox",
  data() {
    return {
      key: {
        CONDITION: "条件规则",
        FORMULA: "公式规则",
        JUDGEMENT: "判断规则"
      },
      keyColr:{
        CONDITION: "danger",
        FORMULA: "primary",
        JUDGEMENT: "warning"
      }
    };
  },
  props: { name: String, placement: String }
};
</script>
<style lang="scss" scoped>
.rule {
  display: flex;
  align-items: center;
  padding: 0.5em;
  text-align: left;
}
.dib {
  display: inline-block;
}
.el-tag {
  border-radius: 6px;
}
.tag {
  cursor: pointer;
  font-size: 12px;
  display: inline-block;
  padding: 0.2em 0.5em;
  background-color: #fff;
  color: #26beff;
  border: 2px solid #26beff;
  border-radius: 6px;
  margin: 0 0.2em;
}

.tag:hover {
  background-color: #26beff;
  color: #fff;
  border: 2px solid #26beff;
}
</style>

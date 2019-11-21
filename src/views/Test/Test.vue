<template>
  <div style="height:100vh;overflow:auto;">
    <el-input type="time" class="timePicker" v-model="test" size="small"></el-input>
    <!-- <tree-ship v-model="testModel">
      <template slot="name">如果</template>
    </tree-ship>-->
    <!-- <word-editor docKey="14ssss57299058222" docUrl="http://file.zhkytj.cn/1546574115411.docx" saveUrl="http://192.168.30.253:8011/IndexServlet?type=track"></word-editor> -->
  </div>
</template>
<script>
import WangEditor from "@/components/wangEditor/wangEditor.vue";
import TreeShip from "@/components/tools/TreeShip/TreeShip.vue";
import wordEditor from "@/components/wordEditor/wordEditor.vue";
export default {
  name: "test",
  data() {
    return {
      testModel: [],
      test: ""
    };
  },
  watch: {
    test(val) {
      console.log(val);
    }
  },
  components: { TreeShip, WangEditor, wordEditor }
};
</script>
<style lang="scss" scoped>
.timePicker {
  position: relative;
  width: 110px;
}
.timePicker::after {
  content: "";
  position: absolute;
  display: inline-block;
  background-color: #ffffff;
  width: 2.2em;
  height: 2em;
  top: 2px;
  right: 1em;
}
</style>

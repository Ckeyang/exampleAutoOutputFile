/**
    工频电场
 */
<template>
  <div class="diathesis-box regulation-tb box-style_common" v-show='isShow'>
    <div class="tools-bar_common">
      <h5 class="table-title">具体限值规定-工频电场</h5>
    </div>
    <ul class="list-box-1 list-box">
      <li>
        <p class="title">频率（Hz）</p>
        <p class="num">{{dataList.frequency}}</p>
      </li>
      <li>
        <p class="title">电场强度（kV／m）</p>
        <p class="num">{{dataList.magneticFieldIntensityBetweenOfZeroPointOneAndThree}}</p>
      </li>
    </ul>
    <!-- <Pagniation/> -->
  </div>
</template>
<script>
// import Pagniation from "@/components/tools/Pagniation.vue";
export default {
  name: "powerFrequencyElectric",
  props: ["dataList"],
  computed:{
    isShow(){
      return !Array.isArray(this.dataList)
    }
  },
  components: {
    // Pagniation
  }
};
</script>

<style scoped>
.list-box {
  margin-bottom: 20px;
}
.list-box-1 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.list-box-1 .num {
  background: #fafcff;
  border: 1px solid rgba(213, 224, 237, 1);
  height: 30px;
  line-height: 30px;
  text-indent: 10px;
  border-radius: 5px;
  font-size: 12px;
  color: #3c4551;
}
.list-box-1 > li {
  width: 32%;
  margin-right: 20px;
}
.list-box-1 p.title {
  font-size: 12px;
  color: #3c4551;
  margin-bottom: 5px;
}
</style>
/**
  手传振动
 */
<template>
  <div class="diathesis-box regulation-tb box-style_common" v-show='isShow'>
    <div class="tools-bar_common">
      <h5 class="table-title">具体限值规定-高频电磁场</h5>
    </div>
    <ul>
      <li class="list-box-1 list-box">
        <div>
          <p class="title">4h等能量频率计权振动加速度限值（m/s²）</p>
          <p class="num">{{dataList.equalEnergyVibrationalAccelerationLimitOfFourHour}}</p>
        </div>
        <div>
          <p class="title">等能量频率计权振动加速度限值（m/s²）</p>
          <p class="num">{{dataList.equalEnergyVibrationalAccelerationLimit}}</p>
        </div>
      </li>
    </ul>
    <!-- <Pagniation/> -->
  </div>
</template>
<script>
// import Pagniation from "@/components/tools/Pagniation.vue";
export default {
  name: "handTransmittedVibration",
  data() {
    return {};
  },
  computed:{
    isShow(){
      return !Array.isArray(this.dataList)
    }
  },
  props: ["dataList"],
  components: {
    // Pagniation
  },
  methods: {}
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
.list-box-1 > div {
  width: 32%;
  margin-right: 20px;
}
.list-box-1 p.title {
  font-size: 12px;
  color: #3c4551;
  margin-bottom: 5px;
}
</style>
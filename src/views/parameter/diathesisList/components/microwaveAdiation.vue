/**
    微波辐射
 */
<template>
  <div class="diathesis-box regulation-tb box-style_common" v-show='dataList.length'>
    <div class="tools-bar_common">
      <h5 class="table-title">具体限值规定-微波辐射</h5>
    </div>
    <div>
      <p style="font-size:12px;margin-bottom:10px;color:#3C4551">微波限值</p>
      <el-table  :data="dataList" style="width:100%" border size="small">
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{transformValue(scope.row.occupationalHealthLimit)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="日剂量 (μW•h/cm2)" prop="dailyDose"></el-table-column>
        <el-table-column label="8h平均功率密度 (μW/cm2)" prop="averagePowerDensityOfWorkday"></el-table-column>
        <el-table-column label="非8h平均功率密度 (μW/cm2)" prop="nonAveragePowerDensityOfWorkday"></el-table-column>
        <el-table-column label="短时间接触功率密度 (mW/cm2)" prop="contactPowerDensityOfShortTime"></el-table-column>
      </el-table>
    </div>
    <!-- <Pagniation/> -->
  </div>
</template>
<script>
// import Pagniation from "@/components/tools/Pagniation.vue";
export default {
  name: "microwaveAdiation",
  props: ["dataList"],
  components: {
    // Pagniation
  },
  // props: ["dataList"],
  methods: {
    transformValue(type) {
      switch (type) {
        case "MICROWAVE_OF_CONTINUOUS":
          return "连续微波";
        case "MICROWAVE_OF_PULSE":
          return "脉冲微波";
        case "MICROWAVE_OF_CONTINUOUS_OR_PULSE":
          return "连续微波或脉冲微波";
      }
    }
  }
};
</script>

<style scoped>
</style>
/**
    超高频辐射
 */
<template>
  <div class="diathesis-box regulation-tb box-style_common" v-show='dataList.length'>
    <div class="tools-bar_common">
      <h5 class="table-title">具体限值规定-超高频辐射</h5>
    </div>
    <div>
      <p style="font-size:12px;margin-bottom:10px;color:#3C4551">超高频辐射限值</p>
      <el-table  :data="dataList" style="width:100%" border size="small">
        <el-table-column label="时间">
          <template slot-scope="scope">
            <span>{{transformValue(scope.row.occupationalHealthLimit)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="连续波功率密度(mW/cm2)" prop="cwPowerDensity"></el-table-column>
        <el-table-column label="连续波电场强度(V/m)" prop="cwElectricFieldIntensity"></el-table-column>
        <el-table-column label="脉冲波功率密度(mW/cm2)" prop="pulsePowerDensity"></el-table-column>
        <el-table-column label="脉冲波电场强度(V/m)" prop="electricFieldIntensityOfPulseWave"></el-table-column>
      </el-table>
    </div>
    <!-- <Pagniation/> -->
  </div>
</template>
<script>
// import Pagniation from "@/components/tools/Pagniation.vue";
export default {
  name: "highFrequencyRadiation",
  data() {
    return {};
  },
  props: ["dataList"],
  components: {
    // Pagniation
  },
  // props: ["dataList"],
  methods: {
    transformValue(type) {
      switch (type) {
        case "HOURS_OF_EIGHT":
          return "8H";
        case "HOURS_OF_FOUR":
          return "4H";
      }
    }
  }
};
</script>

<style scoped>
</style>
 
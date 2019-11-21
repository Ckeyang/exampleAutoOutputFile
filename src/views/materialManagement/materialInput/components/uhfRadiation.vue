<template>
    <div class="uhfRadiationInput">
        <h3 id="UHF_RADIATION">超高频辐射</h3>
        <el-form label-position="top">
            <div class="flexWrap">
                <div style="width:96%;margin:2%;">
                    <el-form-item label="超高频辐射限值">
                        <el-table :data="model">
                            <el-table-column label="时间">
                            <template slot-scope="scope">
                                {{key[scope.row.occupationalHealthLimit]}}
                            </template>
                            </el-table-column>
                            <el-table-column label="连续波功率密度(mW/cm²)">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.cwPowerDensity" size="mini"></el-input>
                            </template>
                            </el-table-column>
                            <el-table-column label="连续波电场强度(V/m)">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.cwElectricFieldIntensity" size="mini"></el-input>
                            </template>
                            </el-table-column>
                            <el-table-column label="脉冲波功率密度(mW/cm²)">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.pulsePowerDensity" size="mini"></el-input>
                            </template>
                            </el-table-column>
                            <el-table-column label="脉冲波电场强度(V/m)">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.electricFieldIntensityOfPulseWave" size="mini"></el-input>
                            </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </div>
            </div>
        </el-form>
    </div>
</template>
<script>
export default {
  name: 'uhfRadiationInput',
  props: { model: Array },
  data() {
    return {
      key: {
        HOURS_OF_FOUR: '4H',
        HOURS_OF_EIGHT: '8H'
      }
    };
  },
  watch: {
    model: {
      handler(val) {
        this.$emit('update:model', val);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
.uhfRadiationInput {
  background-color: #ffffff;
  padding: 1em;
  .flexWrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>

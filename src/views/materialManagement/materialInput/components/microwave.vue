<template>
    <div class="microwaveInput">
        <h3 id="MICROWAVE">微波辐射</h3>
        <el-form label-position="top">
            <el-form-item label="微波限值">
                <el-table :data="model">
                    <el-table-column label="类型">
                        <template slot-scope="scope">
                            {{key[scope.row.occupationalHealthLimit]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="日剂量 (μW•h/cm²)">
                        <template slot-scope="scope">
                             <el-input v-model="scope.row.dailyDose" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="8h平均功率密度 (μW/cm²)">
                        <template slot-scope="scope">
                             <el-input v-model="scope.row.averagePowerDensityOfWorkday" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="非8h平均功率密度 (μW/cm²)">
                        <template slot-scope="scope">
                             <el-input v-model="scope.row.nonAveragePowerDensityOfWorkday" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="短时间接触功率密度 (mW/cm²)">
                        <template slot-scope="scope">
                             <el-input v-model="scope.row.contactPowerDensityOfShortTime" size="mini"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  name: 'microwaveInput',
  props: { model: Array },
  data() {
    return {
      key: {
        MICROWAVE_OF_CONTINUOUS: '连续微波',
        MICROWAVE_OF_PULSE: '脉冲微波',
        MICROWAVE_OF_CONTINUOUS_OR_PULSE: '连续微波或脉冲微波'
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
.microwaveInput {
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


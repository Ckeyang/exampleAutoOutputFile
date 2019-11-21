<template>
  <div class="baseInput">
    <h3 id="NOISE_WORK_PLACE_OF_PULSE">工作场所脉冲噪声限值规定</h3>
    <el-form label-position="top">
      <div class="flexWrap">
        <div style="width:96%;margin:2%;">
          <el-form-item label="工作场所脉冲噪声职业接触限值">
            <el-table :data="model">
              <el-table-column label="工作日接触脉冲次数限值(n,次)">
                <template slot-scope="scope">{{key[scope.row.occupationalHealthLimit]}}</template>
              </el-table-column>
              <el-table-column label="声压级峰值dB(A)" prop="spl">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.spl" size="mini"></el-input>
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
  name: "NOISE_WORK_PLACE_OF_PULSE",
  props: { model: Array },
  watch: {
    model: {
      handler(val) {
        this.$emit("update:model", val);
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      key: {
        LESS_HUNDRED: "N<=100",
        BETWEEN_HUNDRED_THOUSAND: "100<N<=1000",
        GREATER_THOUSAND: "1000<N<=10000"
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.baseInput {
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

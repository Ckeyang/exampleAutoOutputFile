<template>
  <div class="baseInput">
    <h3 id="ARC_WELDING_LIGHT">紫外辐射(电焊弧光)</h3>
    <el-form label-position="top">
      <div class="flexWrap">
        <div style="width:96%;margin:2%;">
          <el-form-item label="电焊弧光限值规定">
            <el-table :data="model">
              <el-table-column label="紫外线光谱分类">
                <template slot-scope="scope">{{key[scope.row.occupationalHealthLimit]}}</template>
              </el-table-column>
              <el-table-column label="8H辐照度(μW/cm²)" prop="irradianceOfWorkday">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.irradianceOfWorkday" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="8H照射量(mJ/cm²)" prop="exposureOfWorkday">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.exposureOfWorkday" size="mini"></el-input>
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
  name: "ARC_WELDING_LIGHT",
  props: { model: Array},
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
        ARC_WELDING_OF_THREESIXFIVE: "电焊弧光(波段=365)",
        ARC_WELDING_OF_TWONINEZERO: "电焊弧光(波段=290)",
        ARC_WELDING_OF_TWOFIVEFOUR: "电焊弧光(波段=254)",
        ARC_WELDING_LIGHT: "电焊弧光"
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

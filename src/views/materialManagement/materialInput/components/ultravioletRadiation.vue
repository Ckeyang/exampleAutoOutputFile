<template>
    <div class="ultravioletRadiationInput">
        <h3 id="ULTRAVIOLET_RADIATION">紫外辐射(紫外线)</h3>
        <el-form label-position="top">
            <el-form-item label="紫外辐射">
                <el-table :data="model">
                    <el-table-column label="紫外光谱分类">
                        <template slot-scope="scope">
                            {{key[scope.row.occupationalHealthLimit]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="8H辐照度(μW/cm²)">
                        <template slot-scope="scope">
                                <el-input v-model="scope.row.irradianceOfWorkday" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="8H照射量(mJ/cm²)">
                        <template slot-scope="scope">
                                <el-input v-model="scope.row.exposureOfWorkday" size="mini"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  name: 'ultravioletRadiationInput',
  props: { model: Array },
  data() {
    return {
      key: {
        UVB: '中波紫外线',
        UVC: '短波紫外线',
        ARC_WELDING_LIGHT: '电焊弧光',
        ARC_WELDING_OF_THREESIXFIVE: '电焊弧光(波段=365)',
        ARC_WELDING_OF_TWONINEZERO: '电焊弧光(波段=290)',
        ARC_WELDING_OF_TWOFIVEFOUR: '电焊弧光(波段=254)'
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
.ultravioletRadiationInput {
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


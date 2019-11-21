<template>
    <div class="highTemperatureInput">
        <h3 id="HIGH_TEMPERATURE">高温</h3>
        <el-form label-position="top">
            <el-form-item label="高温劳动强度WBGT限值（℃）">
                <el-table :data="model">
                    <el-table-column label="接触时间" prop="occupationalHealthLimit ">
                        <template slot-scope="scope">
                            {{key[scope.row.occupationalHealthLimit]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Ⅰ级">
                        <template slot-scope="scope">
                             <el-input v-model="scope.row.firstGrade" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="Ⅱ级">
                        <template slot-scope="scope">
                             <el-input v-model="scope.row.secondGrade" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="Ⅲ级">
                        <template slot-scope="scope">
                             <el-input v-model="scope.row.thirdGrade" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="Ⅳ级">
                        <template slot-scope="scope">
                             <el-input v-model="scope.row.fourthGrade" size="mini"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  name: 'highTemperatureInput',
  props: { model: Array },
  data() {
    return {
      key: {
        PERCENT_OF_HUNDRED: '100%', //100
        PERCENT_OF_SEVENTY_FIVE: '75%', //75
        PERCENT_OF_FIFTY: '50%', //50
        PERCENT_OF_TWENTY_FIVE: '25%' //25
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
.highTemperatureInput {
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


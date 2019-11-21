<template>
    <div class="powerFrequencyElectricFieldInput">
        <h3 id="POWER_FREQUENCY_ELECTRIC_FIELD">工频电场</h3>
        <el-form label-position="top">
                <el-form-item label="工频电场">
                    <el-table :data="[{}]">
                        <el-table-column label="频率（Hz）">
                            <template>
                            {{model.frequency}}
                            </template>
                        </el-table-column>
                        <el-table-column label="电场强度（V／m）">
                            <template>
                                <el-input v-model="model.electricFieldIntensity " size="mini"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  name: 'powerFrequencyElectricFieldInput',
  props: { model: Object },
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
.powerFrequencyElectricFieldInput {
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

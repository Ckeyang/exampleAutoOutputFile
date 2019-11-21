<template>
    <div class="hfElectromagneticFieldInput">
        <h3 id="HF_ELECTROMAGNETIC_FIELD">高频电磁场</h3>
        <el-form label-position="top">
            <div class="flexWrap">
                <div style="width:48%;margin:1%;" v-if="isShow('electricFieldIntensityBetweenOfZeroPointOneAndThree')">
                    <el-form-item label="频率0.1≤f≤3.0电场强度（V/m）">
                        <el-input v-model="model.electricFieldIntensityBetweenOfZeroPointOneAndThree"></el-input>
                    </el-form-item>
                </div>
                <div style="width:48%;margin:1%;">
                    <el-form-item label="频率0.1≤f≤3.0磁场强度（A/m）" v-if="isShow('magneticFieldIntensityBetweenOfZeroPointOneAndThree')">
                        <el-input v-model="model.magneticFieldIntensityBetweenOfZeroPointOneAndThree"></el-input>
                    </el-form-item>
                </div>
                <div style="width:48%;margin:1%;">
                    <el-form-item label="频率3.0＜f≤30电场强度（V/m）" v-if="isShow('electricFieldIntensityBetweenOfThreeAndThirty')">
                        <el-input v-model="model.electricFieldIntensityBetweenOfThreeAndThirty"></el-input>
                    </el-form-item>
                </div>
            </div>
        </el-form>
    </div>
</template>
<script>
export default {
  name: 'hfElectromagneticFieldInput',
  props: { model: Object, action: String  },
  watch: {
    model: {
      handler(val) {
        this.$emit('update:model', val);
      },
      deep: true,
      immediate: true
    }
  },
  methods:{
     isShow(params) {
      if (!this.model[params] && this.action === "view") {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.hfElectromagneticFieldInput {
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

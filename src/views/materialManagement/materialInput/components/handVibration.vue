<template>
  <div class="handVibrationInput">
    <h3 id="HAND_VIBRATION">手传振动</h3>
    <el-form label-position="top">
      <div class="flexWrap">
        <div style="width:48%;margin:1%;" v-if="isShow('equalEnergyVibrationalAccelerationLimitOfFourHour')">
          <el-form-item label="4h等能量频率计权振动加速度限值（m/s²）">
            <el-input v-model="model.equalEnergyVibrationalAccelerationLimitOfFourHour"></el-input>
          </el-form-item>
        </div>
        <!-- <div style="width:48%;margin:1%;">
                    <el-form-item label="等能量频率计权振动加速度限值（m/s²）">
                        <el-input v-model="model.equalEnergyVibrationalAccelerationLimit"></el-input>
                    </el-form-item>
                </div> -->
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "handVibrationInput",
  props: { model: Object, action: String },
  watch: {
    model: {
      handler(val) {
        this.$emit("update:model", val);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
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
.handVibrationInput {
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

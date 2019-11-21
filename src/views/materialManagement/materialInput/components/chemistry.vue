<template>
  <div class="chemistryInput">
    <h3 id="CHEMISTRY">化学类</h3>
    <el-form label-position="top">
      <div class="flexWrap">
        <div style="width:48%;margin:1%;" v-show="isShow('mac')">
          <el-form-item label="MAC(mg/m³)">
            <el-input v-model="model.mac"></el-input>
          </el-form-item>
        </div>
        <div style="width:48%;margin:1%;" v-show="isShow('pctwa')">
          <el-form-item label="PC-TWA(mg/m³)">
            <el-input v-model="model.pctwa"></el-input>
          </el-form-item>
        </div>
        <div style="width:48%;margin:1%;" v-show="isShow('pcstel')">
          <el-form-item label="PC-STEL(mg/m³)">
            <el-input v-model="model.pcstel"></el-input>
          </el-form-item>
        </div>
        <div style="width:48%;margin:1%;" v-show="isShow('el')">
          <el-form-item label="EL">
            <el-input v-model="model.el"></el-input>
          </el-form-item>
        </div>
        <div style="width:48%;margin:1%;" v-show="isShow('pctwaTotalDust')">
          <el-form-item label="PC-TWA总尘(mg/m³)">
            <el-input v-model="model.pctwaTotalDust"></el-input>
          </el-form-item>
        </div>
        <div style="width:48%;margin:1%;" v-show="isShow('pctwaRespirableDust')">
          <el-form-item label="PC-TWA呼尘(mg/m³)">
            <el-input v-model="model.pctwaRespirableDust"></el-input>
          </el-form-item>
        </div>
        <div style="width:48%;margin:1%;" v-show="isShow('idlhConcentration')">
          <el-form-item label="IDLH浓度(mg/m³)">
            <el-input v-model="model.idlhConcentration"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "chemistryInput",
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
.chemistryInput {
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

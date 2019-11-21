<template>
    <div class="biologyInput">
        <h3 id="BIOLOGY">生物</h3>
        <el-form label-position="top">
            <div class="flexWrap">
                <div style="width:48%;margin:1%;" v-if="isShow('mac')">
                    <el-form-item label="MAC(孢子数/m³)">
                        <el-input v-model="model.mac"></el-input>
                    </el-form-item>
                </div>
                <div style="width:48%;margin:1%;" v-if="isShow('pctwa')">
                    <el-form-item label="PC-TWA(ng/m³)">
                        <el-input v-model="model.pctwa"></el-input>
                    </el-form-item>
                </div>
                <div style="width:48%;margin:1%;" v-if="isShow('pcstel')">
                    <el-form-item label="PC-STEL(ng/m³)">
                        <el-input v-model="model.pcstel"></el-input>
                    </el-form-item>
                </div>
                <div style="width:48%;margin:1%;" v-if="isShow('remark')">
                    <el-form-item label="备注">
                        <el-input v-model="model.remark"></el-input>
                    </el-form-item>
                </div>
            </div>
        </el-form>
    </div>
</template>
<script>
export default {
  name: 'biologyInput',
  props: { model: Object , action: String},
  watch: {
    model: {
      handler(val) {
        this.$emit('update:model', val);
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
.biologyInput {
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

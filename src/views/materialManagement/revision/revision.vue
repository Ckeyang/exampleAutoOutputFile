<template>
  <el-dialog :visible.sync="visibal" title="添加修约">
    <div class="revisionTitle">
      <h3>{{data.name}}</h3>
      <div class="num">代号:{{data.codeName||"无"}}&nbsp;&nbsp;&nbsp;&nbsp;别名:{{data.alias||"无"}}</div>
    </div>
    <div class="revisionContent">
      <chemistry
        v-if="data.substanceCategoryType==='CHEMISTRY'"
        :model.sync="data.chemistry"
        :substanceId="materialId"
      />
      <high-temperature
        v-if="data.substanceCategoryType==='HIGH_TEMPERATURE'"
        :model.sync="data.highTemperatureTable"
        :substanceId="materialId"
      />
      <noises
        v-if="data.substanceCategoryType==='NOISES'"
        :model.sync="data.noises"
        :substanceId="materialId"
      ></noises>
      <uhf-radiation
        v-if="data.substanceCategoryType==='UHF_RADIATION'"
        :model.sync="data.ultraHighFrequencyRadiationTable"
        :substanceId="materialId"
      />
      <hf-electromagnetic-field
        v-if="data.substanceCategoryType==='HF_ELECTROMAGNETIC_FIELD'"
        :model.sync="data.highFrequencyElectromagneticField"
        :substanceId="materialId"
      />
      <biology
        v-if="data.substanceCategoryType==='BIOLOGY'"
        :model.sync="data.biology"
        :substanceId="materialId"
      ></biology>
      <hand-vibration
        v-if="data.substanceCategoryType==='HAND_VIBRATION'"
        :model.sync="data.handBorneVibration"
        :substanceId="materialId"
      />
      <microwave
        v-if="data.substanceCategoryType==='MICROWAVE'"
        :model.sync="data.microwaveRadiationTable"
        :substanceId="materialId"
      />
      <power-frequency-electric-field
        v-if="data.substanceCategoryType==='POWER_FREQUENCY_ELECTRIC_FIELD'"
        :model.sync="data.powerFrequencyElectricField"
        :substanceId="materialId"
      />
      <ultraviolet-radiation
        v-if="data.substanceCategoryType==='ULTRAVIOLET_RADIATION'"
        :model.sync="data.ultravioletRadiationTable"
        :substanceId="materialId"
      />
      <arc-welding-light
        v-if="data.substanceCategoryType==='ARC_WELDING_LIGHT'"
        :model.sync="data.arcWeldingLightTable "
        :substanceId="materialId"
      />
      <other
        v-if="data.substanceCategoryType==='OTHER'"
        :revision="revision"
        :substanceId="materialId"
      ></other>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="next('up')">上一物质</el-button>&nbsp;&nbsp;
      <el-button type="primary" size="small" @click="next('down')">下一物质</el-button>
    </span>
  </el-dialog>
</template>
<script>
import Chemistry from "./materialRevision/chemistry.vue";
import HighTemperature from "./materialRevision/highTemperature.vue";
import Noises from "./materialRevision/noises.vue";
import UhfRadiation from "./materialRevision/uhfRadiation.vue";
import HfElectromagneticField from "./materialRevision/hfElectromagneticField.vue";
import Biology from "./materialRevision/biology.vue";
import HandVibration from "./materialRevision/handVibration.vue";
import Microwave from "./materialRevision/microwave.vue";
import PowerFrequencyElectricField from "./materialRevision/powerFrequencyElectricField.vue";
import UltravioletRadiation from "./materialRevision/ultravioletRadiation.vue";
import ArcWeldingLight from "./materialRevision/arcWeldingLight.vue";
import Other from "./materialRevision/other.vue";
export default {
  name: "revision",
  components: {
    Chemistry,
    HighTemperature,
    Noises,
    UhfRadiation,
    HfElectromagneticField,
    Biology,
    HandVibration,
    Microwave,
    PowerFrequencyElectricField,
    UltravioletRadiation,
    ArcWeldingLight,
    Other
  },
  data() {
    return {
      visibal: false,
      materialId: "",
      data: {}
    };
  },
  methods: {
    next(action) {
      this.$emit(action, this.materialId);
    },
    getMaterial() {
      this.$http.staticMaterialService
        .getMaterialById(this.materialId)
        .then(res => {
          this.data = res.data;
        });
    },
    addRevision(id) {
      this.materialId = id;
      this.visibal = true;
      this.getMaterial();
    },
    nextRevision(id) {
      this.materialId = id;
      this.getMaterial();
    }
  }
};
</script>
<style lang="scss" scoped>
.revisionTitle {
  padding: 1em 0;
  .num {
    color: #556a85;
  }
  border-bottom: 1px dashed #556a85;
}
.revisionContent {
  padding: 1em 1em;
  height: 260px;
  overflow: auto;
  border-bottom: 1px solid #e6f0fc;
}
.revisionBtnGroup {
  padding: 1em 0;
  text-align: right;
}
</style>
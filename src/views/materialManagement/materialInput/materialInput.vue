<template>
  <div class="materialInput" @scroll="onScroll">
    <el-row class="toolTitle" type="flex" justify="space-around" align="middle">
      <el-col :span="11">
        <h3 style="color:#ffffff">{{ data.name }}</h3>
      </el-col>
      <el-col :span="11" style="text-align:right">
        <el-button type="primary" size="mini" v-if="action === 'edit'" @click="save()">保存</el-button>
        <el-button size="mini" @click="closeWindow()">取消</el-button>
      </el-col>
    </el-row>
    <el-row class="inputContent" type="flex" justify="space-around">
      <el-col :span="4">
        <div class="menu">
          <h4>菜单</h4>
          <br />
          <el-input placeholder="输入关键字进行过滤" suffix-icon="el-icon-search" v-model="filterName" size="small"> </el-input>
          <div class="menuChild">
            <div class="childBox" v-if="isShowTwo('基本信息')" @click="goWhere('BASS')">
              基本信息
            </div>
            <!-- <div
              class="childBox"
              v-show="data.substanceCategoryType === item.key && isShowTwo(item.value)"
              v-for="(item, index) in categoryTypes"
              :key="index"
              @click="goWhere(item.key)"
            >
              {{ item.value }}
            </div> -->
            <div class="childBox" v-if="isShowTwo('其他信息')" @click="goWhere('OTHER')">
              其他信息
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="pallow">
          <div class="baseBox">
            <el-row type="flex" justify="space-around" align="middle">
              <el-col :span="12">
                <h2>{{ data.name }}</h2>
              </el-col>
              <el-col :span="12" style="text-align:right">
                <span>代号:{{ data.codeName }}</span>
              </el-col>
            </el-row>
            <span>别名:{{ data.alias }}</span>
          </div>
          <BaseInput :model.sync="data" :action="action" />
          <!-- <ChemistryInput v-show="data.substanceCategoryType === 'CHEMISTRY'" :model.sync="data.chemistry" :action="action" />
          <HighTemperatureInput
            v-show="data.substanceCategoryType === 'HIGH_TEMPERATURE'"
            :model.sync="data.highTemperatureTable"
            :action="action"
          />
          <NoisesInput v-show="data.substanceCategoryType === 'NOISES'" :model.sync="data.noises" :action="action" />
          <UhfRadiationInput
            v-show="data.substanceCategoryType === 'UHF_RADIATION'"
            :model.sync="data.ultraHighFrequencyRadiationTable"
            :action="action"
          />
          <HfElectromagneticFieldInput
            v-show="data.substanceCategoryType === 'HF_ELECTROMAGNETIC_FIELD'"
            :model.sync="data.highFrequencyElectromagneticField"
            :action="action"
          />
          <HandVibrationInput
            v-show="data.substanceCategoryType === 'HAND_VIBRATION'"
            :model.sync="data.handBorneVibration"
            :action="action"
          />
          <MicrowaveInput
            v-show="data.substanceCategoryType === 'MICROWAVE'"
            :model.sync="data.microwaveRadiationTable"
            :action="action"
          />
          <PowerFrequencyElectricFieldInput
            v-show="data.substanceCategoryType === 'POWER_FREQUENCY_ELECTRIC_FIELD'"
            :model.sync="data.powerFrequencyElectricField"
            :action="action"
          />
          <UltravioletRadiationInput
            v-show="data.substanceCategoryType === 'ULTRAVIOLET_RADIATION'"
            :model.sync="data.ultravioletRadiationTable"
            :action="action"
          />
          <BiologyInput v-show="data.substanceCategoryType === 'BIOLOGY'" :model.sync="data.biology" :action="action" />
          <ArcWeldingLight
            v-show="data.substanceCategoryType === 'ARC_WELDING_LIGHT'"
            :model.sync="data.arcWeldingLightTable"
            :action="action"
          />
          <NoNoisesWork
            v-show="data.substanceCategoryType === 'NON_NOISE_WORK_PLACE'"
            :model.sync="data.nonNoisesContactOfWorkplaceTable"
            :action="action"
          />
          <WorkPlaceNoises
            v-show="data.substanceCategoryType === 'NOISE_WORK_PLACE_OF_PULSE'"
            :model.sync="data.noisesContactOfWorkplaceTable"
            :action="action"
          /> -->
          <OtherInput :model.sync="data" :action="action" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import BaseInput from "./components/base.vue";
import ChemistryInput from "./components/chemistry.vue";
import HighTemperatureInput from "./components/highTemperature.vue";
import NoisesInput from "./components/noises";
import UhfRadiationInput from "./components/uhfRadiation.vue";
import HfElectromagneticFieldInput from "./components/hfElectromagneticField.vue";
import BiologyInput from "./components/biology.vue";
import HandVibrationInput from "./components/handVibration.vue";
import MicrowaveInput from "./components/microwave.vue";
import PowerFrequencyElectricFieldInput from "./components/powerFrequencyElectricField.vue";
import UltravioletRadiationInput from "./components/ultravioletRadiation.vue";
import ArcWeldingLight from "./components/arcWeldingLight.vue";
import NoNoisesWork from "./components/noNoisesWork.vue";
import WorkPlaceNoises from "./components/workPlaceNoises.vue";
import OtherInput from "./components/other.vue";
export default {
  name: "materialInput",
  components: {
    BaseInput,
    OtherInput,
    NoisesInput,
    ArcWeldingLight,
    NoNoisesWork,
    WorkPlaceNoises,
    UltravioletRadiationInput,
    PowerFrequencyElectricFieldInput,
    MicrowaveInput,
    HandVibrationInput,
    BiologyInput,
    ChemistryInput,
    UhfRadiationInput,
    HfElectromagneticFieldInput,
    HighTemperatureInput
  },
  data() {
    return {
      filterName: "",
      materialId: this.$route.params.materialId,
      action: this.$route.params.action,
      categoryTypes: [
        { key: "CHEMISTRY", value: "化学类" },
        { key: "BIOLOGY", value: "生物" },
        { key: "POWER_FREQUENCY_ELECTRIC_FIELD", value: "工频电场" },
        { key: "HAND_VIBRATION", value: "手传振动" },
        { key: "MICROWAVE", value: "微波辐射" },
        { key: "ULTRAVIOLET_RADIATION", value: "紫外辐射" },
        { key: "HF_ELECTROMAGNETIC_FIELD", value: "高频电磁场" },
        { key: "UHF_RADIATION", value: "超高频辐射" },
        { key: "NOISES", value: "噪声" },
        { key: "ARC_WELDING_LIGHT", value: "电焊弧光" },
        { key: "NON_NOISE_WORK_PLACE", value: "非噪声工作地点噪声" },
        { key: "NOISE_WORK_PLACE_OF_PULSE", value: "工作场所脉冲噪声" },
        { key: "HIGH_TEMPERATURE", value: "高温" }
      ],
      data: {
        alias: "",
        biology: {
          mac: "",
          pcstel: "",
          pctwa: "",
          remark: ""
        },
        casNo: "",
        chemicalStabilityAndReactivity: "",
        chemistry: {
          el: "",
          idlhConcentration: "",
          mac: "",
          pcstel: "",
          pctwa: "",
          pctwaRespirableDust: "",
          pctwaTotalDust: ""
        },
        codeName: "",
        compositions: [
          {
            casNo: "",
            cnName: "",
            enName: "",
            proportion: ""
          }
        ],
        disposal: "",
        ecologicalData: "",
        emergencyHandlingOfLeakage: "",
        emergencyTreatment: "",
        englishAlias: "",
        englishName: "",
        fireFightingMeasures: "",
        formula: "",
        formulaWeight: "",
        handBorneVibration: {
          equalEnergyVibrationalAccelerationLimit: "",
          equalEnergyVibrationalAccelerationLimitOfFourHour: "",
          occupationalHealthLimit: "PERCENT_OF_HUNDRED"
        },
        handlingAndStorage: "",
        haxardsSummarizing: "",
        highFrequencyElectromagneticField: {
          electricFieldIntensityBetweenOfThreeAndThirty: "",
          electricFieldIntensityBetweenOfZeroPointOneAndThree: "",
          magneticFieldIntensityBetweenOfZeroPointOneAndThree: "",
          occupationalHealthLimit: "PERCENT_OF_HUNDRED"
        },
        highTemperatureTable: [
          {
            contactTime: "",
            firstGrade: "",
            fourthGrade: "",
            occupationalHealthLimit: "PERCENT_OF_HUNDRED",
            secondGrade: "",
            thirdGrade: ""
          }
        ],
        id: "",
        microwaveRadiationTable: [
          {
            averagePowerDensityOfWorkday: "",
            contactPowerDensityOfShortTime: "",
            dailyDose: "",
            nonAveragePowerDensityOfWorkday: "",
            occupationalHealthLimit: "PERCENT_OF_HUNDRED"
          }
        ],
        name: "",
        noises: {
          contactTimeLimit: "",
          lexOfEightHours: "",
          lexOfWeek: "",
          noisesContactOfWorkplaceTable: [],
          nonNoisesContactOfWorkplaceTable: [
            {
              limitOfErgonomics: "",
              noiseLevel: "",
              occupationalHealthLimit: "PERCENT_OF_HUNDRED"
            }
          ]
        },
        otherInformation: "",
        physicochemicalProperties: "",
        powerFrequencyElectricField: {
          electricFieldIntensity: "",
          frequency: 0
        },
        regulatoryInformation: "",
        remark: "",
        status: "",
        substanceCategoryType: "CHEMISTRY",
        touchOrIndividualProtection: "",
        toxicologicalData: "",
        transportInformation: "",
        ultraHighFrequencyRadiationTable: [
          {
            cwElectricFieldIntensity: "",
            cwPowerDensity: "",
            electricFieldIntensityOfPulseWave: "",
            occupationalHealthLimit: "PERCENT_OF_HUNDRED",
            pulsePowerDensity: ""
          }
        ],
        ultravioletRadiationTable: [
          {
            exposureOfWorkday: "",
            irradianceOfWorkday: "",
            occupationalHealthLimit: "PERCENT_OF_HUNDRED"
          }
        ]
      }
    };
  },
  created() {
    this.getMaterial();
  },
  methods: {
    onScroll(e) {
      let dom = document.querySelector(".materialInput .menu");
      // console.log(e.target.scrollTop)
      if (e.target.scrollTop > 150) {
        dom.style.top = "1em";
      } else {
        dom.style.top = "6em";
      }
    },
    goWhere(id) {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    },
    isShowTwo(name = "") {
      return name.indexOf(this.filterName) != -1 ? true : false;
    },
    closeWindow() {
      window.close();
    },
    getMaterial() {
      this.$http.staticMaterialService.getMaterialById(this.materialId).then(res => {
        this.data = res.data;
      });
    },
    save() {
      this.$http.staticMaterialService.update(this.materialId, this.data).then(() => {
        this.$message.success("保存成功3秒后自动关闭窗口");
        setTimeout(this.closeWindow, 3000);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.baseBox {
  padding: 1em;
  margin-bottom: 1em;
  span {
    color: #68788c;
    font-size: 14px;
  }
}
.inputContent {
  margin: 1.5em;
}
.materialInput {
  background-color: #f0f0f0;
  height: 100vh;
  overflow: auto;
}
.toolTitle {
  background-color: #107AC2;
  color:#ffffff;
  padding:.5em 1em;
}
.menu {
  position: fixed;
  background-color: #ffffff;
  transition: all 0.2s;
  color: #343a45;
  margin: 0 0.5em;
  box-sizing: border-box;
  padding: 1em;
  height: 89.11vh;
  overflow: auto;
  .menuChild {
    cursor: pointer;
    .childBox {
      box-sizing: border-box;
      margin: 0.5em 0;
      font-size: 14px;
      padding: 0.5em 1em;
      border-radius: 6px;
      background-color: #e6f0fc;
    }
    .active {
      color: #ffffff;
      background-color: #26beff;
    }
    .childBox:hover {
      color: #ffffff;
      background-color: #26beff;
    }
  }
}
.pallow {
  background-color: #ffffff;
  box-sizing: border-box;
}
::-webkit-scrollbar {
  width: 0.5em;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}
</style>

<template>
  <div class="handVibrationInput">
    <!-- <h3 id="HAND_VIBRATION">手传振动</h3>4h等能量频率计权振动加速度（m/s²）
等能量频率计权振动加速度（m/s²）
手传振动频率计权加速度级 Lh,w
手传振动计权加速度级Lh
手传振动频率计权振动加速度 ahw
    手传振动工作日中接振总能量(ahw)eq(T)-->
    <div class="flexWrap">
      <span>4h等能量频率计权振动加速度（m/s²）</span>
      <span>{{model.equalEnergyVibrationalAccelerationLimitOfFourHour}}</span>
      <span>
        <revisionRule
          :value="getItem('equalEnergyVibrationalAccelerationLimitOfFourHour')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>等能量频率计权振动加速度（m/s²）</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('equalEnergyVibrationalAccelerationLimit')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>手传振动频率计权加速度级 Lh,w</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('frequencyWeightingAccelerationLevel')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>手传振动计权加速度级Lh</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('weightingAccelerationLevel')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>手传振动频率计权振动加速度 ahw</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('frequencyWeightingAcceleration')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>手传振动工作日中接振总能量(ahw)eq(T)</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('vibrationalTotalEnergyOfWorkDay')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
  </div>
</template>
<script>
import revisionRule from "@/components/revisionRules/index.vue";
export default {
  name: "handVibrationInput",
  props: {
    model: Object,
    substanceId: String
  },
  data() {
    return {
      revision: []
    };
  },
  components: { revisionRule },
  watch: {
    model: {
      handler(val) {
        this.$emit("update:model", val);
      },
      deep: true,
      immediate: true
    },
    substanceId(){
      this.getRevision();
    }
  },
  created(){
    this.getRevision();
  },
  methods: {
    getRevision() {
      this.$http.staticMaterialService
        .getRevisionRuleAll(this.substanceId)
        .then(res => {
          this.revision = res.data;
        });
    },
    getItem(str) {
      let obj = this.revision.find(item => {
        if (item.substanceFieldName === str) {
          return item;
        }
      });
      let defaultObj = {
        ruleType: "NONE",
        conditions: {
          integerBit: 2,
          decimalBit: 2
        },
        substanceFieldName: str,
        substanceId: this.substanceId,
        scientificResultDecimalBit: 2,
        ordinaryResultDecimalBit: 2
      };
      if (obj) {
        return obj;
      } else {
        return defaultObj;
      }
      // return typeof obj === "undefined" ? defaultObj : obj;
    },
    setItem(obj) {
      // console.log($event);
      this.curItem = obj;
      this.saveRevision();
    },
    saveRevision() {
      // this.curItem.substanceFieldName = params;
      // this.curItem.substanceId = this.substanceId;
      this.curItem.id
        ? this.$http.staticMaterialService
            .updateRevision(this.curItem.id, this.curItem)
            .then(() => {
              this.getRevision();
            })
        : this.$http.staticMaterialService
            .createRevision(this.curItem)
            .then(() => {
              this.getRevision();
            });
    }
  }
};
</script>
<style lang="scss" scoped>
.handVibrationInput {
  background-color: #ffffff;
  .flexWrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    padding: 0.5em 0;
    > span:first-child {
      width: 50%;
    }
    > span {
      display: inline-block;
      width: 25%;
      overflow: hidden;
      word-wrap: nowrap;
    }
    > span:last-child {
      text-align: right;
    }
  }
}
</style>

<template>
  <div class="baseInput">
    <!-- <h3 id="ARC_WELDING_LIGHT">电焊弧光</h3>电焊弧光8H辐照度（μW/cm²） 
    电焊弧光8H照射量（mJ/cm²）-->
    <div class="flexWrap">
      <span>电焊弧光8H辐照度（μW/cm²）</span>
      <span>{{model.irradianceOfWorkday}}</span>
      <span>
        <revisionRule
          :value="getItem('arcWeldingLightIrradianceOfWorkDay')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>电焊弧光8H照射量（mJ/cm²）</span>
      <span>{{model.exposureOfWorkday}}</span>
      <span>
        <revisionRule
          size="mini"
          :value="getItem('arcWeldingLightExposureOfWorkDay')"
          @input="setItem"
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
  name: "ARC_WELDING_LIGHT",
  props: {
    model: Array,
    substanceId: String
  },
  data() {
    return {
       key: {
        ARC_WELDING_OF_THREESIXFIVE: "电焊弧光(波段=365)",
        ARC_WELDING_OF_TWONINEZERO: "电焊弧光(波段=290)",
        ARC_WELDING_OF_TWOFIVEFOUR: "电焊弧光(波段=254)",
        ARC_WELDING_LIGHT: "电焊弧光"
      },
      curItem: {},
      revision:[]
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
.baseInput {
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

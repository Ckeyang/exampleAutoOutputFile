<template>
  <div class="uhfRadiationInput">
    <!-- <h3 id="UHF_RADIATION">超高频辐射</h3> -->
    <h4>职业接触限制如下</h4>
    <el-table :data="model">
      <el-table-column label="类型">
        <template slot-scope="scope">{{key[scope.row.occupationalHealthLimit]}}</template>
      </el-table-column>
      <el-table-column label="8H">
        <el-table-column label="限值">
          <template slot-scope="scope">{{scope.row.irradianceOfWorkday}}</template>
        </el-table-column>
        <el-table-column label="结果修约">
          <template slot-scope="scope">
            <revisionRule
              :value="getItem(revisionKey[scope.row.occupationalHealthLimit][0])"
              @input="setItem"
              size="mini"
              btnTilte="结果值修约"
              hasRuleBtnTilte="结果值修约"
            ></revisionRule>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="4H">
        <el-table-column label="限值">
          <template slot-scope="scope">{{scope.row.exposureOfWorkday}}</template>
        </el-table-column>
        <el-table-column label="结果修约">
          <template slot-scope="scope">
            <revisionRule
              :value="getItem(revisionKey[scope.row.occupationalHealthLimit][1])"
              @input="setItem"
              size="mini"
              btnTilte="结果值修约"
              hasRuleBtnTilte="结果值修约"
            ></revisionRule>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import revisionRule from "@/components/revisionRules/index.vue";
export default {
  name: "uhfRadiationInput",
  props: {
    model: Array,
    substanceId: String
  },
  components: { revisionRule },
  data() {
    return {
      key: {
        HOURS_OF_FOUR: "4H",
        HOURS_OF_EIGHT: "8H"
      },
      revisionKey: {
        HOURS_OF_FOUR: ['cwPowerDensity$4H','cwElectricFieldIntensity$4H','pulsePowerDensity$4H','electricFieldIntensityOfPulseWave$4H'],
        HOURS_OF_EIGHT: ['cwPowerDensity$8H','cwElectricFieldIntensity$8H','pulsePowerDensity$8H','electricFieldIntensityOfPulseWave$8H']
      },
      revision: []
    };
  },
  watch: {
    model: {
      handler(val) {
        this.$emit("update:model", val);
      },
      deep: true,
      immediate: true
    },
    substanceId() {
      this.getRevision();
    }
  },
  created() {
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
.uhfRadiationInput {
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

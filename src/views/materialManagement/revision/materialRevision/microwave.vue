<template>
  <div class="microwaveInput">
    <!-- <h3 id="MICROWAVE">微波辐射</h3> -->
    <h4>职业接触限制如下</h4>
    <el-table :data="model">
      <el-table-column label="类型">
        <template slot-scope="scope">{{key[scope.row.occupationalHealthLimit]}}</template>
      </el-table-column>
      <el-table-column label="日剂量（μW.h/cm²）">
        <el-table-column label="限值">
          <template slot-scope="scope">{{scope.row.dailyDose}}</template>
        </el-table-column>
        <el-table-column label="结果修约" width="140px">
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
      <el-table-column label="8h平均功率密度（（μW/cm²）">
        <el-table-column label="限值">
          <template slot-scope="scope">{{scope.row.averagePowerDensityOfWorkday}}</template>
        </el-table-column>
        <el-table-column label="结果修约" width="140px">
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
      <el-table-column label="非8h平均功率密度（（μW/cm²）">
        <el-table-column label="限值">
          <template slot-scope="scope">{{scope.row.nonAveragePowerDensityOfWorkday}}</template>
        </el-table-column>
        <el-table-column label="结果修约" width="140px">
          <template slot-scope="scope">
            <revisionRule
              :value="getItem(revisionKey[scope.row.occupationalHealthLimit][2])"
              @input="setItem"
              size="mini"
              btnTilte="结果值修约"
              hasRuleBtnTilte="结果值修约"
            ></revisionRule>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="短时间功率密度（（mW/cm²）">
        <el-table-column label="限值">
          <template slot-scope="scope">{{scope.row.contactPowerDensityOfShortTime}}</template>
        </el-table-column>
        <el-table-column label="结果修约" width="140px">
          <template slot-scope="scope">
            <revisionRule
              :value="getItem(revisionKey[scope.row.occupationalHealthLimit][3])"
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
  name: "microwaveInput",
  props: {
    model: Array,
    substanceId: String
  },
  components: { revisionRule },
  data() {
    return {
      key: {
        MICROWAVE_OF_CONTINUOUS: "连续微波",
        MICROWAVE_OF_PULSE: "脉冲微波",
        MICROWAVE_OF_CONTINUOUS_OR_PULSE: "连续微波或脉冲微波"
      },
      revisionKey: {
        MICROWAVE_OF_CONTINUOUS: [
          "microwaveOfContinuousDailyDose",
          "microwaveOfContinuousAveragePowerDensityOfWorkday",
          "microwaveOfContinuousNonAveragePowerDensityOfWorkday",
          "microwaveOfContinuousContactPowerDensityOfShortTime"
        ],
        MICROWAVE_OF_PULSE: [
          "microwaveOfPulseDailyDose",
          "microwaveOfPulseAveragePowerDensityOfWorkday",
          "microwaveOfPulseNonAveragePowerDensityOfWorkday",
          "microwaveOfPulseContactPowerDensityOfShortTime"
        ],
        MICROWAVE_OF_CONTINUOUS_OR_PULSE: [
          "microwaveOfContinuousOrPulseDailyDose",
          "microwaveOfContinuousOrPulseAveragePowerDensityOfWorkday",
          "microwaveOfContinuousOrPulseNonAveragePowerDensityOfWorkday",
          "microwaveOfContinuousOrPulseContactPowerDensityOfShortTime"
        ]
      },
      revision: []
    };
  },
  created() {
    this.getRevision();
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
.microwaveInput {
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


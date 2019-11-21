<template>
  <div class="highTemperatureInput">
    <!-- <h3 id="HIGH_TEMPERATURE">高温</h3> -->
    <div class="flexWrap">
      <span>高温劳动强度WBGT限值（℃）</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('highTemperatureOperationLimitOfWBGT')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <h4>职业接触限制如下</h4>
    <el-table :data="model">
      <el-table-column label="接触时间" prop="occupationalHealthLimit ">
        <template slot-scope="scope">{{key[scope.row.occupationalHealthLimit]}}</template>
      </el-table-column>
      <el-table-column label="Ⅰ级">
        <template slot-scope="scope">{{scope.row.firstGrade}}</template>
      </el-table-column>
      <el-table-column label="Ⅱ级">
        <template slot-scope="scope">{{scope.row.secondGrade}}</template>
      </el-table-column>
      <el-table-column label="Ⅲ级">
        <template slot-scope="scope">{{scope.row.thirdGrade}}</template>
      </el-table-column>
      <el-table-column label="Ⅳ级">
        <template slot-scope="scope">{{scope.row.fourthGrade}}</template>
      </el-table-column>
    </el-table>
    <div class="flexWrap">
      <span>室外高温作业WBGT指数</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('outdoorHighTemperatureOperationOfWBGT')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>室内高温作业WBGT指数</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('indoorHighTemperatureOperationOfWBGT')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>WBGT指数平均值（头腹踝）</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('averageValueOfWBGT')"
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
  name: "highTemperatureInput",
  props: {
    model: Array,
    substanceId: String
  },
  components: { revisionRule },
  data() {
    return {
      key: {
        PERCENT_OF_HUNDRED: "100%", //100
        PERCENT_OF_SEVENTY_FIVE: "75%", //75
        PERCENT_OF_FIFTY: "50%", //50
        PERCENT_OF_TWENTY_FIVE: "25%" //25
      },
      revisionKey: {
        PERCENT_OF_HUNDRED: ['firstGrade$100','secondGrade$100','thirdGrade$100','fourthGrade$100'], //100
        PERCENT_OF_SEVENTY_FIVE: ['firstGrade$75','secondGrade$75','thirdGrade$75','fourthGrade$75'], //75
        PERCENT_OF_FIFTY: ['firstGrade$50','secondGrade$50','thirdGrade$50','fourthGrade$50'], //50
        PERCENT_OF_TWENTY_FIVE: ['firstGrade$25','secondGrade$25','thirdGrade$25','fourthGrade$25'] //25
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
.highTemperatureInput {
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


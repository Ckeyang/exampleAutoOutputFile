<template>
  <div class="noisesInput">
    <!-- <h3 id="NOISES">噪声</h3> 噪声职业接触限值dB(A)
Lex,8hdB(A)
Lex,8wdB(A)
    工作场所脉冲噪声职业接触限值
    噪声声级dB(A)
    工效限值dB(A)-->
    <div class="flexWrap">
      <span>噪声职业接触限值dB(A)</span>
      <span>{{model.contactTimeLimit}}</span>
      <span>
        <revisionRule
          :value="getItem('contactTimeLimit')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>Lex,8hdB(A)</span>
      <span>{{model.lexOfEightHours}}</span>
      <span>
        <revisionRule
          :value="getItem('lexOfEightHours')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>Lex,8wdB(A)</span>
      <span>{{model.lexOfWeek}}</span>
      <span>
        <revisionRule
          :value="getItem('lexOfWeek')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>工作场所脉冲噪声职业接触限值</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('impulseNoisesContactOfWorkplaceLimit')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <h4>职业接触限制如下</h4>
    <el-table :data="model.noisesContactOfWorkplaceTable">
      <el-table-column label="工作日接触脉冲次数限值(n,次)">
        <template slot-scope="scope">{{key[scope.row.occupationalHealthLimit]}}</template>
      </el-table-column>
      <el-table-column label="声压级峰值dB(A)">
        <template slot-scope="scope">{{scope.row.spl}}</template>
      </el-table-column>
    </el-table>
    <br>
    <h4>非噪声工作地点噪声声级设计要求</h4>
    <div class="flexWrap">
      <span>噪声声级dB(A)</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('nonNoiseWorkshopOfficeNoiseLevel')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>工效限值dB(A)</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('nonNoiseWorkshopOfficeLimitOfErgonomics')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <h4>职业接触限制如下</h4>
    <el-table :data="model.nonNoisesContactOfWorkplaceTable">
      <el-table-column label="非噪声工作地点">
        <template slot-scope="scope">{{key[scope.row.occupationalHealthLimit]}}</template>
      </el-table-column>
      <el-table-column label="噪声声级dB(A)">
        <template slot-scope="scope">{{scope.row.noiseLevel}}</template>
      </el-table-column>
      <el-table-column label="工效限值dB(A)">
        <template slot-scope="scope">{{scope.row.limitOfErgonomics}}</template>
      </el-table-column>
    </el-table>
    <br>
    <div class="flexWrap">
      <span>非稳态噪声全天的等效声级LAeq,T</span>
      <span>&nbsp;</span>
      <span>
        <revisionRule
          :value="getItem('unsteadyStateEquivalentNoiseLevelOfDay')"
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
  name: "noisesInput",
  props: {
    model: Object,
    substanceId: String
  },
  components: { revisionRule },
  data() {
    return {
      key: {
        LESS_HUNDRED: "N<=100",
        BETWEEN_HUNDRED_THOUSAND: "100<N<=1000",
        GREATER_THOUSAND: "1000<N<=10000",
        NOISE_WORKSHOP_OFFICE: "噪声车间办公室",
        NON_NOISE_WORKSHOP_OFFICE: "非噪声车间办公室",
        CONFERENCE_ROOM: "会议室"
      },
      revision:[]
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
.noisesInput {
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

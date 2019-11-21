<template>
  <div class="biologyInput">
    <!-- <h3 id="BIOLOGY">生物</h3> -->
    <div class="flexWrap">
      <span>MAC</span>
      <span>{{model.mac}}</span>
      <span>
        <revisionRule
          :value="getItem('biologyMac')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>PC-TWA</span>
      <span>{{model.pctwa}}</span>
      <span>
        <revisionRule
          :value="getItem('biologyPctwa')"
          @input="setItem"
          size="mini"
          btnTilte="结果值修约"
          hasRuleBtnTilte="结果值修约"
        ></revisionRule>
      </span>
    </div>
    <div class="flexWrap">
      <span>PC-STEL</span>
      <span>{{model.pcstel}}</span>
      <span>
        <revisionRule
          :value="getItem('biologyPcstel')"
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
  name: "biologyInput",
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
.biologyInput {
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

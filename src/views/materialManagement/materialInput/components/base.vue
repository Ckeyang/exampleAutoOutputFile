<template>
  <div class="baseInput">
    <h3 id="BASS">基本信息</h3>
    <el-form label-position="top">
      <div class="flexWrap">
        <div style="width:48%;margin:1%;" v-if="isShow('englishName')">
          <el-form-item label="英文名称">
            <el-input v-model="model.englishName"></el-input>
          </el-form-item>
        </div>
        <div style="width:48%;margin:1%;" v-if="isShow('englishAlias')">
          <el-form-item label="英文别名">
            <el-input v-model="model.englishAlias"></el-input>
          </el-form-item>
        </div>
        <div style="width:48%;margin:1%;" v-if="isShow('status')">
          <el-form-item label="状态">
            <el-input v-model="model.status"></el-input>
          </el-form-item>
        </div>
        <div style="width:48%;margin:1%;" v-if="isShow('casNo')">
          <el-form-item label="CAS No.">
            <el-input v-model="model.casNo"></el-input>
          </el-form-item>
        </div>
        <div style="width:48%;margin:1%;" v-if="isShow('formula')">
          <el-form-item label="分子式">
            <el-input v-model="model.formula">
              <template slot="append">
                <span v-html="translateFormula(model.formula)"></span>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div style="width:48%;margin:1%;" v-if="isShow('formulaWeight')">
          <el-form-item label="分子量">
            <el-input v-model="model.formulaWeight"></el-input>
          </el-form-item>
        </div>
        <div style="width:96%;margin:1%;">
          <el-form-item label="成分/组成信息" v-if="isShow('compositions')">
            <el-button @click="addComponents" size="mini">添加</el-button>
            <el-table :data="model.compositions">
              <el-table-column label="中文名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.cnName" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="英文名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.enName" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="CAS No.">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.casNo" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="比例">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.proportion" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column width="50">
                <template slot-scope="scope">
                  <div class="operation-icon">
                    <i class="iconfont icon-shanchu" title="删除" @click="deleteComposition(scope.$index)"></i></div
                ></template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "baseInput",
  props: { model: Object , action: String},
  watch: {
    model: {
      handler(val) {
        this.$emit("update:model", val);
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
    },
    /**
     * 翻译forMula
     */
    translateFormula(formula) {
      if (!formula) {
        return "";
      } else {
        let reg = /[a-zA-Z](\d+)/g;
        let list = formula.match(reg);
        if (!list) {
          return formula;
        }
        let result = formula;
        list.map(e => {
          let first = e.substr(0, 1);
          let num = e.split(first)[1];
          let domNum = "<sub>" + num + "</sub>";
          result = result.replace(e, first + domNum);
        });
        return result;
      }
    },
    /**
     * 添加物质分成成分
     */
    addComponents() {
      this.model.compositions = this.model.compositions || [];
      this.model.compositions.push({
        cnName: "",
        enName: "",
        casNo: "",
        proportion: ""
      });
    },
    deleteComposition(index) {
      this.model.compositions.splice(index, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.baseInput {
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

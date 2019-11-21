<template>
    <div class="materialTemplateBg">
        <Top :name="data.name">
            <el-button size="mini" type="info" @click="closeWindow">返回</el-button>
            <el-button size="mini" type="primary" v-if="action==='edit'" @click="saveMaterial">保存</el-button>
        </Top>
        <Middle>
            <div class="middleTitle">
                <span v-if="data.manufacturer">生产厂家：{{data.manufacturer}}</span>
                <span v-if="data.formula">分子式：<span v-html="translateFormula(data.formula)"></span></span>
                <span v-if="data.casNo"> CAS NO：{{data.casNo}}</span>
            </div>
            <div class="middleBox">
               <Form v-for="(item,index) in data.templateComponents" :model="item" :key="index"/>
            </div>
        </Middle>
    </div>    
</template>
<script>
import Top from './components/top.vue';
import Middle from './components/middle.vue';
import Form from './components/form.vue';
export default {
  name: 'materialTemplate',
  data() {
    return {
      data: {},
      materialId: '',
      action: ''
    };
  },
  created() {
    this.materialId = this.$route.params.materialId;
    this.action = this.$route.params.action;
    this.getDataList();
  },
  components: { Top, Middle, Form },
  methods: {
    saveMaterial() {
      this.$http.templateService.saveMaterial(this.data).then(() => {
        // this.data = res.data;
        this.$message.success('保存成功');
        this.getDataList();
      });
    },
    closeWindow() {
      window.close();
    },
    getDataList() {
      this.$http.templateService.getMaterial(this.materialId).then((res) => {
        this.data = res.data;
        this.data.templateComponents=this.addSortIndex(this.data.templateComponents);
      });
    },
    addSortIndex(list, index = null) {
      if (list) {
        for (let i = 0; i < list.length; i++) {
          list[i].index = index ? index + '-' + (i + 1) : i + 1;
          if (list[i].components) {
            this.addSortIndex(list[i].components, list[i].index);
          }
        }
      }
      return list;
    },
    /**
     * 翻译forMula
     */
    translateFormula(formula) {
      if (!formula) {
        return '';
      } else {
        let reg = /[a-zA-Z](\d+)/g;
        let list = formula.match(reg);
        if (!list) {
          return formula;
        }
        let result = formula;
        list.map((e) => {
          let first = e.substr(0, 1);
          let num = e.split(first)[1];
          let domNum = '<sub>' + num + '</sub>';
          result = result.replace(e, first + domNum);
        });
        return result;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.materialTemplateBg {
  background-color: #edf1f7;
}
.middleTitle {
  color: #606266;
  font-size: 14px;
  padding: 1em 0;
  border-bottom: 1px solid #26beff;
}
.middleBox {
  padding: 0 0 5em 0;
}
</style>

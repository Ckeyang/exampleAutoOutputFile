<template>
  <ul class="industry-box">
    <li v-for="(item, index) in formValue.industryList" :key="item.id" class="industry-item">
      <Industry :data="item" />
      <i class="iconfont icon-jia add-btn" v-if="!index" @click="addItem" title='添加行业'></i>
      <i class="iconfont icon-jian add-btn" v-else @click="desItem(index)" title='删除该行业'></i>
    </li>
  </ul>
</template>

<script>
import Industry from "@/components/tools/Industry.vue";
import { guid } from "@/utils";
export default {
  components: { Industry },
  data() {
    return {
      industryList: []
    };
  },
  created() {
    this.formValue.industryList.length || this.formValue.industryList.push({ ids: [], label: "", id: guid() })
    // this.industryList = this.formValue.industryList
  },
  watch:{
    'formValue.industryList':{
      handler(val){
        val.length || this.formValue.industryList.push({ ids: [], label: "", id: guid() })
      }
    }
  },
  methods: {
    addItem() {
      this.formValue.industryList.push({ ids: [], label: "", id: guid() }); // 生成一个随机id 用于删除某个行业组件时防止组件错乱
    },
    desItem(i) {
      this.formValue.industryList.splice(i, 1);
    },
  },
  props: ["formValue"]
};
</script>

<style scoped>
.industry-box {
  max-width: 500px;
}
.industry-item {
  margin-bottom: 5px;
  position: relative;
}
.add-btn {
  position: absolute;
  right: -25px;
  top: 10px;
  cursor: pointer;
  color:#1884CC;
}
</style>

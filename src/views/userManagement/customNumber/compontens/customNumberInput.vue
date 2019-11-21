<template>
  <div class="customNumberInput">
    <div>
      <el-select v-model="model.type" size="mini" @change="model.value = ''">
        <el-option
          v-for="(item, index) in prefexList.prefixCategory"
          :key="index"
          :label="item.value"
          :value="item.key"
        ></el-option>
      </el-select>
    </div>
    <div>
      <el-select v-if="model.type === 'DATEVARIABLE'" v-model="model.value" size="mini">
        <el-option
          v-for="(item, index) in prefexList.dateFormat"
          :key="index"
          :label="item.value"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-select v-else-if="model.type === 'SYSTEMVARIABLES'" v-model="model.value" size="mini">
        <el-option v-for="(item, index) in prefexList.detection" :key="index" :label="item.value" :value="item.key"></el-option>
      </el-select>
      <el-select v-else-if="model.type === 'SHARECOMPONENT'" v-model="model.value" size="mini">
        <el-option v-for="(item, index) in shareList" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-input v-else-if="model.type === 'FIXEDTEXT'" v-model="model.value" size="mini"></el-input>
      <el-input v-else v-model="model.value" size="mini"></el-input>
    </div>
    <div>
      <el-input v-model="model.connector" placeholder="连接符" size="mini"></el-input>
    </div>
    <div>
      <i class="iconfont icon-jia" @click="$emit('addCustomNumber')"></i>
      <i class="iconfont icon-jian" v-show="index != 0" @click="$emit('deleteCustomNumber', index)"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "customNumberInput",
  props: { model: Object, index: Number, prefexList: Object ,shareList:{type:Array,default:function(){return []}}},
  data() {
    return {
      sharecomponents: []
    };
  },
  created() {
    // this.getShareComponents();
  },
  watch: {
    model: {
      handler(val) {
        this.$emit("update:model", val);
      },
      deep: true,
      immediate: true
    }
    // model(val){
    //   this.$emit('update:model',val)
    // }
  },
  methods: {
    getShareComponents() {
      this.$http.sharedPartsService.getSharedPartsList(this.form).then(res => {
        this.sharecomponents = this.shareList.length===0?res.data:this.shareList;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.customNumberInput {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border: 1px solid rgba(0, 0, 0, 0.1);
  > div {
    padding: 0.1em 0.5em;
    box-sizing: border-box;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    width: 30%;
  }
  > div:last-child {
    border-right: 0;
    width: 10%;
  }
}
</style>

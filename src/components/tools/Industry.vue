<template>
  <div>
    <el-cascader
      placeholder="请选择行业"
      :options="options"
      size='small'
      clearable
      filterable
      @active-item-change="handleItemChange"
      @change="handleChange"
      :props="props"
      v-model="data.ids"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  name:'industry',
  data() {
    return {
      curSelectIds: [],
      options: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      }
    };
  },
  props:{
    data:{
      type:Object,
      default:() => []
    },
    separator:{
      type:String,
      default:'/'
    }
    
  },
  created(){
    this.getData("INDUSTRY", 1);
    this.curSelectIds = this.data.ids
  },
  computed:{
    ids(){
      return this.data.ids
    }
  },
  watch:{
    ids(val){
      this.handleChange(val)
    }
  },
  methods: {
    getData(id, curType = 1) {
      this.$http.statute.getKind(id).then(res => {
        const { selectList, curSelectIds } = this;
        if (curType === 1) {
          this.options = res.data.map(item => ({ ...item, children: [] }));
          if (curSelectIds.length) {
            const id = curSelectIds[0];
            this.getData(id, 2);
          }
        } else if (curType === 2) {
          let data = this.options.find(item => item.id === curSelectIds[0]);
          data.children = res.data.map(item => ({ ...item, children: [] }));
          if (curSelectIds.length > 1) {
            const id = curSelectIds[1];
            this.getData(id, 3);
          }
        } else if (curType === 3) {
          let data = this.options
            .find(item => item.id === curSelectIds[0])
            .children.find(item => item.id === curSelectIds[1]);
          data.children = res.data;
        }
      });
    },
    handleItemChange(val) {
      const id = val[val.length - 1];
      this.curSelectIds = val;
      const curType = val.length + 1;
      this.getData(id, curType);
    },
    findName(data, ids, label = "") {
      const id = ids.shift();
      for (let item of data) {
        if (item.id === id) {
          label = label ? label + "/" + item.name : item.name;
          if (item.children && item.children.length) {
            return this.findName(item.children, ids, label);
          }
          return label;
        }
      }
    },
    handleChange(val){
      this.curSelectIds = val
      this.data.label = this.findName(this.options, [...val], "")
    }
  }
};
</script>

<style scoped>
</style>

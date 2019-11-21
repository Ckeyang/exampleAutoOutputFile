<template>
  <div>
    <div style='text-align:center;margin-top:10px;'>
      <el-button type="primary" @click="openDialog" size="small" style='text-align:center'>表格数据输出的过滤规则配置</el-button>
    </div>
    <el-dialog
      :title="'表格数据输出的过滤规则配置-'+title"
      :visible.sync="dialogVisible"
      width="35%"
      :close-on-click-modal="false" 
      v-el-drag-dialog
      append-to-body>
      <ul style="margin-top:5px;">
        <li class="lable-item-box">
          <span class="item-lable">数据输出的条件设置</span>
          <div class="item-content">
            <el-radio v-model="filterRule.filterRuleType" label="CUSTOM" @change='filterRule.tableHeadFilterRule = []'>自定义条件</el-radio>
            <el-radio v-model="filterRule.filterRuleType" label="TABLEHEADRULE" @change='filterRule.customFilterRule = []'>使用表头的规则</el-radio>
          </div>
        </li>
        <li class="lable-item-box" v-show='filterRule.filterRuleType === "TABLEHEADRULE"'>
          <span class="item-lable">表头规则</span>
          <div class="item-content checkFiledBox">
            <p class='empty-text' v-show="!filedList.length">暂无数据！</p>
            <el-checkbox-group v-model="filterRule.tableHeadFilterRule">
              <el-checkbox :label="item.id" v-for="item of filedList" :key='item.id'>{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </li>
        <li class="lable-item-box" v-show='filterRule.filterRuleType === "CUSTOM"'>
          <span class="item-lable">规则配置</span>
          <div class='item-content checkFiledBox' style='max-height:300px;padding:0'>
            <tree-ship v-model="filterRule.customFilterRule" size='mini' :shareList='tableHeadShareList'>
              <template slot="name">如果</template>
            </tree-ship>
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="medium">取 消</el-button>
        <el-button type="primary" @click="submit" size="medium">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TreeShip from "@/components/tools/TreeShip/TreeShip.vue";
export default {
  components:{ TreeShip },
  data(){
    return {
      dialogVisible:false,
      filedList:[],
      filterRule:{},
    }
  },
  props:{
    "title":{
      type:String,
      default:'提示'
    },
    'thData':{
      type:Array,
      default:() => []
    },
    'shareComponentRuleList':{
      type:Array,
      default:()=> []
    },
    'model':{
      type:Object,
    }
  },
  created(){
    this.filterRule = JSON.parse(JSON.stringify(this.model))
  },
  computed:{
    // 筛选出表头共享件
    tableHeadShareList(){
      return this.thData.filterMap(item=>{
         if(item.customerId && item.tableHeadName !=='请建表头'){
           item.id = item.tableHeadId
           return {
             id : item.tableHeadId,
             name : item.name,
           }
         }
      })
    }
  },
  watch:{
    model(val){
      this.filterRule = JSON.parse(JSON.stringify(val))
    },
  },
  methods:{
    openDialog(){
      this.dialogVisible = true;
      //筛选出有规则的表头字段
      this.filedList = this.filterHaveRulesFileds()
      if(!this.filedList.length){
        this.filterRule.tableHeadFilterRule = []
      }
    },
    closeDialog(){
      this.dialogVisible = false;
      this.filterRule = JSON.parse(JSON.stringify(this.model))
    },
    submit(){
      this.$emit('change',this.filterRule)
      this.dialogVisible = false;
    },
    //筛选有规则的表头字段
    filterHaveRulesFileds(){
      let tempArr = []
      this.shareComponentRuleList.forEach(item => {
        const obj = this.thData.find(item2 => item2.tableHeadId === item.outputFieldId)
        obj && tempArr.push({name:obj.tableHeadName,id:obj.tableHeadId})
      });
      return tempArr
    }
  }
}
</script>

<style scoped lang='scss'>
  .empty-text{
    text-align:center;
    margin-top:17px;
    color:#909399;
  }
  .lable-item-box{
    display: flex;
    line-height: 40px;
    .item-lable{
      width: 150px;
      display: inline-block;
      margin-right: 20px;
    }
    .item-content{
      flex-grow: 1;
    }
    .checkFiledBox{
      line-height: 22px;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      padding: 0 10px;
      max-height: 250px;
      overflow: auto;
      min-height:58px;
    }
  }
   
  
</style>


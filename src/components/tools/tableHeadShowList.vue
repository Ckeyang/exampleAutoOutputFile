<template>
  <el-popover
    placement="bottom"
    :offset='popoverOffset'
    :width="popoverWidth"
    trigger="click"
    popper-class='tableHeadChoicePopper'
    style="margin-right:0"
  >
    <div class="tableHeadChoiceBox">
      <el-checkbox
        v-for="item in trDataList"
        v-model="item.display"
        :key="item.id"
        @change='handleCheckedTrChange'>
        <span class="tableHeadName" :title="item.name">{{item.name}}</span>
      </el-checkbox>
    </div>
    <div style="border-top:1px solid #E6ECF5;margin:5px 0 10px"></div>
    <el-checkbox
      class="checkAll"
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
    >全选</el-checkbox>
    <el-button 
      size="mini"
      class="saveTrBtn"
      type="text"
      v-show="isShowSaveBtn"
      icon="iconfont icon-baocun"
      @click="saveTable"
    >保存</el-button>
    <el-button
      size="small"
      icon="iconfont icon-biaoqian"
      slot="reference"
    >设置显示列</el-button>
  </el-popover>
</template>

<script>
export default {
  name:'tableHeadShowList',
  data() {
    return {
      checkedTrList:[], // 选择的表头列表
      checkAll:false,  //是否全选
      isIndeterminate:true,
    };
  },
  props:{
    'popoverOffset':{
      default:0
    },
    trDataList:{
      default:()=> [] 
    },
    popoverWidth:{
      default:230
    },
    componentParentId:String,
    isShowSaveBtn:{
      default:true,
      type:Boolean
    }
  },
  watch:{
    // componentParentId:{
    //   handler:function(){
    //     const timer = setTimeout(()=>{
    //       const flag = this.trDataList.some(item => !item.display)
    //       this.checkAll = !flag
    //       this.isIndeterminate = flag
    //       clearTimeout(timer)
    //     },500)
    //   },
    //   // immediate:true
    // },
    trDataList:{
      handler:function(){
        this.handleCheckedTrChange()
      },
    }
  },
  // created(){
  //   this.isIndeterminate = this.trDataList.some(item => !item.display)
  //   console.log(this.trDataList.some(item => !item.display))
  // },
  methods: {
    //全选
    handleCheckAllChange(value){
      const newList = this.trDataList.map(item => {
        item.display = value;
        return item
      })
      // this.$emit('checkTrChange',newList);
      this.isIndeterminate = !value;
    },
    //判断是否全选了
    handleCheckedTrChange(value,e) {
      const isCheckALL = !this.trDataList.some(item => !item.display);
      this.checkAll = isCheckALL;
      this.isIndeterminate = !isCheckALL
    },
    saveTable(){
      const params = {
         "dynamicDisplayColumn": {
          "componentId": this.componentParentId,
          "controlPropertyConfigs": this.trDataList.map(item => {
            return {
              "controlId": item.id,
              "display": item.display
            }
          })
        },
        "userId": sessionStorage.userId || ''
      }
      this.$http.formEnterService.saveTableHeadShowList(params).then(res=>{
        this.$emit('refersh')
        this.$message({
          type:'success',
          message:'保存成功!'
        })
        document.body.click() // 关掉弹框
      }) 
    }
  }
};
</script>

<style scoped>
.saveTrBtn{
  position: absolute;
  right: 10px;
  bottom: 5px;
}
.diathesis-box {
  margin-bottom: 13px;
}
.diathesis-box >>> .el-popover{
  padding-right: 0;
}
.tableHeadChoiceBox{
  max-height:350px;
  overflow: auto;
  padding: 5px 0 10px;
}
.tableHeadChoiceBox .el-checkbox{
  display: block;
  margin: 0;
  max-width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 5px 5px 5px 10px;
}
.checkAll{
  margin-left: 10px;
}
.tableHeadChoiceBox .el-checkbox:hover{
  background: #E6F9FF;
}
</style>

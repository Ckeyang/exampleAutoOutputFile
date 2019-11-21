<template>
  <el-popover
    placement="bottom"
    :offset='popoverOffset'
    :width="popoverWidth"
    trigger="click"
    v-model="popoverVisible" 
    @hide="popoverHide"
    popper-class='tableHeadChoicePopper'
    style="margin-right:0"
  >
    <div class="tableHeadChoiceBox">
      <el-checkbox
        v-for="item in dataList"
        v-model="item.displayable"
        :key="item.id"
        @change='handleCheckedTrChange'>
        <span class="tableHeadName" :title="item.filedName">{{item.filedName}}</span>
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
      @click="submit"
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
  name:'dynamicDisplayColumn',
  data() {
    return {
      checkAll:false,  //是否全选
      isIndeterminate:true,
      popoverVisible:false
    };
  },
  props:{
    popoverOffset:{ // 箭头偏移量
      default:0
    },
    dataList:{ // 数据源
      default:()=> [] 
    },
    popoverWidth:{ // width
      default:230
    },
    tableName:{ // 表头枚举
      type:String,
      required:true
    }, 
    isShowSaveBtn:{ // 是否显示保存按钮
      default:true,
      type:Boolean
    }
  },
  watch:{
    dataList:{
      handler:function(){
        this.handleCheckedTrChange()
      },
    }
  },
  methods: {
    //全选
    handleCheckAllChange(value){
      const newList = this.dataList.map(item => {
        item.displayable = value;
        return item
      })
      this.isIndeterminate = !value;
    },
    //判断是否全选了
    handleCheckedTrChange(value,e) {
      const isCheckALL = !this.dataList.some(item => !item.displayable);
      this.checkAll = isCheckALL;
      this.isIndeterminate = !isCheckALL
    },
    submit(){
      const params = {
        staticTableDisplayColumnWithSort:{
          tableName:this.tableName,
          fieldConfigs:this.dataList.map(item => {
            return {
              displayable: item.displayable,
              filedKey: item.filedKey,
              filedName: item.filedName,
              sort: item.sort,
              sortable:item.sortable,
              searchable:item.searchable
            }
          })
        }
      }
      this.$http.userService.setUserDisplaySortTableHead(params).then(res =>{
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
        this.popoverVisible =false
        const timer = setTimeout(()=>{
          this.$emit('refreshData')
        },500)
      })
    },
    popoverHide(){

    },
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

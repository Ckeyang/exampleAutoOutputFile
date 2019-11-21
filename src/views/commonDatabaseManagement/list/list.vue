<template>
  <div style="height:100%">
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">公用数据列表</h5>
      </div>
      <el-table :data="dataList" style="width:100%">
        <el-table-column label="表名" prop="name"></el-table-column>
        <el-table-column label="业务类别" prop="categoryName" width="450">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEdit">{{ scope.row.businessCategoryName }}</span>
            <span v-else
              ><el-select size="mini" v-model="scope.row.businessCategoryId" style="width:350px;">
                <el-option v-for="item in categories" :key="item.id" :value="item.id" :label="item.name"></el-option></el-select
            >&nbsp;&nbsp;&nbsp;&nbsp;<div class="operation-icon" style="display:inline-block"><i class="iconfont icon-i-baocun" @click="save(scope.row)"></i>&nbsp;&nbsp;<i class="iconfont icon-i-quxiao" @click="scope.row.isEdit = false;isEdit=false;"></i></div></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i class="iconfont icon-i-bianji" v-show="!isEdit||scope.row.isEdit" @click="scope.row.isEdit = true;isEdit=true">{{
                !scope.row.businessCategoryId ? "添加业务类别" : "修改业务类别"
              }}</i>
              <i class="iconfont icon-chakan" @click="goRoute(scope.row.id,scope.row.publicDataType)">查看编辑</i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name:'commonData',
  data() {
    return {
      dataList: [],
      categories: [],
      isEdit:false
    };
  },
  watch:{
    isEdit(val){
      if(!val){
        this.getDataList();
      }
    }
  },
  created() {
    this.getDataList();
    this.getCategories();
  },
  methods: {
    save(item){
      this.$http.commonDatabaseService.changePublicData(item.id,{businessCategoryId:item.businessCategoryId}).then(()=>{this.$message.success("保存成功");}).then(this.getDataList)
    },
    getCategories() {
      this.$http.advisoryCategoryService.getAdvisoryCategoryTree().then(res => {
        this.categories = res.data.childList;
      });
    },
    goRoute(id,publicDataType){
      this.$router.push('/configManagement/database/'+id+'/'+publicDataType)
    },
    getDataList() {
      this.isEdit=false;
      this.$http.commonDatabaseService.getCommonDatabaseList().then(res => {
        this.dataList = res.data.map(item => {
          item.isEdit = false;
          return item;
        });
      });
    }
  }
};
</script>
<style scoped>
.search-box {
  background: #fff;
  border-radius: 5px;
}
.search-row {
  border-bottom: 1px solid #edf1f7;
  padding: 15px;
  line-height: 40px;
  height: 40px;
  box-sizing: content-box;
}
.search-row > .el-col {
  margin-right: 30px;
  text-align: center;
  width: 245px;
}
.icon-i-quxiao::before{
  color:#F54A44 !important;
}
.diathesis-box {
  margin-bottom: 13px;
}
.diathesis-box >>> .el-popover {
  padding-right: 0;
}
.tableHeadChoiceBox {
  max-height: 400px;
  overflow: auto;
}
.iconfont {
  cursor: pointer;
}
</style>

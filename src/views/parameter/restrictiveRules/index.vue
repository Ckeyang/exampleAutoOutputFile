<template>
  <div class="content-warp">
    <div class="diathesis-box regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">限值规定</h5>
      </div>
      <el-table  :data="dataList" style="width:100%;margin-bottom:20px" v-loading="loading">
        <el-table-column label="限值规定表名称">
          <template slot-scope="scope">限值规定 - {{scope.row.limitValueCategoryInfo}}</template>
        </el-table-column>
        <el-table-column label="业务类别">
          <template slot-scope="scope">
            <span>{{scope.row.evaluationCategoryName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i class="iconfont icon-chakan" @click="goRestrictiveForm(scope.row)">查看</i>  
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'limitRegulation',
  data() {
    return {
      loading: false,
      dataList: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true
      this.$http.paramterService
        .getRestrictiveRulesList()
        .then(res => {
          this.dataList = res.data || []
        }).finally(()=>{
          this.loading = false;
        });
    },
    goRestrictiveForm({limitValueCategory, evaluationCategory,evaluationCategoryName}){
      this.$router.push(`/parameterManagement/limitRegulationForm/${limitValueCategory}/${evaluationCategory}/${evaluationCategoryName || 'null'}`)
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
  width: 280px;
}
.inline-edit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  font-weight: normal !important;
}
.inline-edit .icon-baocun,
.inline-edit .icon-xiugai,
.inline-edit .icon-quxiao {
  margin: 0 0 0 15px;
  cursor: pointer;
}
.inline-edit .icon-baocun:hover,
.inline-edit .icon-quxiao:hover{
  color: #53a0e4;
  transition: all .3s;
}

</style>
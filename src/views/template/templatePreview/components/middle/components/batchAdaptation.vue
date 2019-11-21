<template>
  <div>
    <el-dialog title="批量适配数据" :visible.sync="dialogVisible" width="700px" v-el-drag-dialog @close='closeDialog' :close-on-click-modal="false">
      <div class="serach-box">
        <el-input v-model="form.keyWord" placeholder="请输入关键字" size="small" @keyup.enter.native="searchData"></el-input>
        <el-button type="primary" size="small" icon="el-serach" @click="searchData">搜 索</el-button>
      </div>
      <div>
        <el-table
          :data="filterTableData"
          ref="multipleTable"
          style="width: 100%;margin-top:15px;"
          v-show="filterTableData.length"
          @select="handleSelectionChange"
          @select-all="handleSelectionChange"
          border
          size="mini"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :label="item.name"  v-for="(item,i) in (formDatas[0]? formDatas[0].dataList : [])" :key="i">
            <template slot-scope="scope">
              <span>{{scope.row[item.name]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <p class="empty-text" v-show="!filterTableData.length">暂无数据!</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="submitForm"  size="medium" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "batchAdaptation",
  data() {
    return {
      form: {
        keyWord: "",
        ruleId: "" //规则的id
      },
      tdData:[], //所有的表格数据
      filterTableData:[], // 搜索后的表格数据
      checkedData:[], //已选择的数据列表
      dialogVisible: false,
      dataId: "", //关联的表单数据id
      formDatas: [], //缓存获取的数据
      loading:false,
    };
  },
  methods: {
    closeDialog() {
      this.toggleSelection()
      this.checkedData = []
      this.tdData = []
      this.filterTableData = []
      this.formDatas = []
      this.dataId = ''
    },
    /**
     * @param {dataId} 数据行id
     * @param {ruleId} 数据关联规则id
     *  */
    //打开弹框
    openDialog(dataId = "", ruleId = "") {
      this.form.ruleId = ruleId;
      this.dataId = dataId;
      this.getData();
      this.dialogVisible = true;
    },
    //关联数据
    submitForm() {
      this.adaptationDatChioce() //将已选择的数据isChioce 改为true
      this.loading = true;
      this.$http.formEnterService
        .relationAdaptationData(this.dataId, this.form.ruleId, {
          listData:this.formDatas
        })
        .then(res => {
          this.dialogVisible = false;
          this.$message({
            type: "success",
            message: "数据适配成功!"
          });
          this.resetData()
          this.$emit("refreshData");
        }).finally(()=>{
          this.loading = false;
        });
    },
    //搜索
    searchData() {
      this.filterTable()
    },
    filterTable(){
      if (this.form.keyWord) {
        this.filterTableData  = this.tdData.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return String(dataNews[key]).toLowerCase().indexOf(this.form.keyWord.toLowerCase()) > -1 && key !== 'id' && key !== 'isChoice'
          })
        })
      }else{
        this.filterTableData = this.tdData
      }
      this.$nextTick(()=>{
        // 勾选中选择的列表
        this.toggleSelection(this.checkedData)
      })
    },
    handleSelectionChange(val){
      this.checkedData = val
    },
    //将选择的数据的isChoice改为true
    adaptationDatChioce(){
      this.formDatas = this.formDatas.map(item =>{
        item.isChoice = this.checkedData.some(item2=> item2.id === item.dataId)
        return item
      })
    },
    //获取数据
    getData() {
      this.$http.formEnterService
        .getAdaptationData(this.dataId, this.form.ruleId)
        .then(res => {
          this.formDatas = res.data || [];
          this.splicingComponentValue();
        });
    },
    //组装数据
    splicingComponentValue() {
      this.tdData = this.formDatas.map(item => {
        let obj = {}
        item.dataList.forEach(ele => {
          obj[ele.name] = ele.value;
        });
        obj.id = item.dataId
        obj.isChoice = item.isChoice
        if(item.isChoice){  // 获取选择的列表
          this.checkedData.push(obj)
        }
        return obj
      })
      this.filterTable()
    },
    resetData(){
      this.checkedData = [];
      this.formDatas = [];
      this.tdData = []
      this.form.keyWord = ''
      this.filterTableData = []
    },
    //初始化选择
    toggleSelection(rows) {
      if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row,true);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
    }
  }
};
</script>
<style scoped>
.serach-box {
  display: flex;
  justify-content: space-between;
}
.serach-box >>> button {
  margin-left: 15px;
}
.empty-text{
  text-align: center;
  margin-top: 20px;
}
</style>

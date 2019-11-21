<template>
  <el-dialog
    title="项目模板的修订记录"
    :visible.sync="dialogVisible"
    v-el-drag-dialog
    width="600px"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-table :data="tableData" size="mini" style="width: 100%;margin-top:15px" border >
      <el-table-column label="操作属性" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.action}}
        </template>
      </el-table-column>
      <el-table-column label="版本时间" align="center">
        <template slot-scope="scope">{{scope.row.versionDate}}</template>
      </el-table-column>
      <el-table-column label="发布时间"  align="center">
        <template slot-scope="scope">{{scope.row.publishDate}}</template>
      </el-table-column>
      <el-table-column label="修订记录" align="center">
        <template slot-scope="scope">
          <el-tooltip placement="top" effect="light">
            <div slot="content" class="tips-content">{{scope.row.log}}</div>
            <i class="iconfont icon-jilu"></i>
          </el-tooltip>
        </template> 
      </el-table-column>
    </el-table>
    <div class="records-pagniation-box">
      <pagniation
        :totalPage="totalPage"
        :totalNum="totalNum"
        :currentPage="form.current"
        @changePage="handleChangePage"
      ></pagniation>
    </div>
  </el-dialog>
</template>

<script>
import pagniation from "@/components/tools/Pagniation.vue";
export default {
  components:{pagniation},
  name: "revisedRecords",
  data() {
    return {
      dialogVisible: false,
      tableData:[],
      form:{
        pageSize: 30,
        current: 0,
      },
      totalPage:0,
      totalNum:0
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      val && this.getLogs();
    }
  },
  props: {
    visible: Boolean,
    id: String, // 模板的聚合id
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
      const timer = setTimeout(()=>{
        this.tableData = []
        clearTimeout(timer)
      },500)
    },
    getLogs() {
      this.$http.projectTemplateService
        .getTemplateLogs(this.id, this.form)
        .then(res => {
          this.tableData = res.data.content || []
          this.totalPage = res.data.totalPages;
          this.totalNum = res.data.totalElements;
        });
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getLogs();
    },
  }
};
</script>

<style scoped>
.tips-content{
  max-width:280px;
  word-wrap:break-word;
  cursor: pointer;
  color:#595959; 
}
.icon-jilu:hover{
  color:#1884CC;
}
.icon-jilu{
  color:#BFBFBF;
  font-size: 13px;
}
.records-pagniation-box .pagniation-box{
  padding: 30px 0 0 0;
}
</style>

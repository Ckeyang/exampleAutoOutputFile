<template>
    <div>
        <div class="search-box">
            <el-form ref="form" :model="form" label-width="70px">
                <el-row class="search-row">
                    <el-col>
                        <el-form-item label="关键字">
                            <el-input v-model="form.keyWords" size="medium" placeholder="项目名称 / 单位名称 / 委托受理编号" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-button type="primary" size="medium"  icon="el-icon-search" round @click="searchList">搜索</el-button>
                        <el-button type="info" size="medium"  icon="el-icon-refresh" round @click="resetForm">重置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
      <div class="regulation-tb">
        <div class="tools-bar_common">
            <h5 class="tb-title">草稿箱</h5>
            <div style="float: right;margin-right: 15px;">
                <el-button type="danger" size="small" round class="entry-btn" @click="showDeleteDialog">删除</el-button>
                <el-button type="success" size="small" round class="entry-btn"  @click="showCommitDialog">提交</el-button>
            </div>
        </div>
        <el-table :data="dataList"  @selection-change="handleSelectionChange">
          <el-table-column
                type="selection"
                width="55">
          </el-table-column>
          <el-table-column type="index" width="100" label="项目编号"></el-table-column>
          <el-table-column prop="name" label="项目名称">
            <template slot-scope="scope">
              <highlight-words :text="scope.row.name" :keyWords="form.keyWords"></highlight-words>
            </template>
          </el-table-column>
          <el-table-column prop="releaseMechanism" label="单位名称">
            <template slot-scope="scope">
              <highlight-words :text="scope.row.releaseMechanism" :keyWords="form.keyWords"></highlight-words>
            </template>
          </el-table-column>
          <el-table-column prop="style" label="创建人" width="150">
            <template slot-scope="scope">
              <highlight-words :text="scope.row.style" :keyWords="form.keyWords"></highlight-words>
            </template>
          </el-table-column>
          <el-table-column prop="releaseTime" label="创建时间" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.releaseTime">{{formatDate(new Date(scope.row.releaseTime))}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage" ref='pagniation'></pagniation>
    </div>
</template>
<script>
import highlightWords from '@/components/tools/HighlightWords.vue';
import pagniation from '@/components/tools/Pagniation.vue';
import preview from '@/components/tools/Preview.vue';
export default {
  name: 'draftList',
  components: { highlightWords, pagniation, preview },
  data() {
    return {
      dataList: [],
      deleteItems: [],
      deleteIds: [],
      totalPage: 0,
      totalNum: 0,
      curId: '',
      form: { keyword: '', pageSize: 30, current: 0 }
    };
  },

  activated() {
    this.getDataList();
  },
  methods: {
    /**
     *复选框
     */
    handleSelectionChange(val) {
      this.deleteItems = val;
      this.deleteIds = this.deleteItems.map((e) => {
        return e.id;
      });
      // console.log(val);
    },
    //重置
    resetForm() {
      this.form.keyWords = '';
      this.form.current = 0
      this.resetPagniation()
      this.getDataList();
    },
    //重置页码组件的页码
    resetPagniation(){
      this.$refs.pagniation.refreshPage() 
    },
    searchList(){
      this.form.current = 0
      this.resetPagniation();
      this.getDataList()
    },
    /**
     * 获取datalist
     */
    getDataList() {
      this.$http.projectService.getDraftList(this.form).then((res) => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      });
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    /**
     * 删除
     */
    showDeleteDialog() {
      this.$confirm('是否删除' + this.deleteIds.length + '条草稿?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelete();
      });
    },
    /**
     * 提交
     */
    showCommitDialog() {
      if(this.deleteIds.length>1){
        this.$message.error("只能提交一条草稿!!");
        return
      }
      this.$confirm('是否提交此条草稿?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doCommit();
      });
    },
    /**
     * 执行删除
     */
    doDelete() {
      this.$http.projectService
        .deleteDrafts({ ids: this.deleteIds })
        .then(() => {
          this.$message({ type: 'success', message: '删除成功' });
          this.getDataList();
        });
    },
    /**
     * 执行提交
     */
    doCommit(){
      this.$http.projectService
        .commitDrafts({ id: this.deleteIds[0] })
        .then(() => {
          this.$message({ type: 'success', message: '提交成功' });
          this.getDataList();
        });
    },
    /**
     * 时间转换函数
     */
    formatDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      if (date < 10) {
        date = '0' + date;
      }
      if (month < 10) {
        month = '0' + month;
      }
      return year + '-' + month + '-' + date;
    }
  }
};
</script>
<style lang="scss" scoped>
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
.search-box .el-col {
  width: 350px;
}
.search-row > .el-col {
  margin-right: 30px;
  text-align: center;
}
.tools-bar {
  margin: 18px 0;
  overflow: hidden;
}

.tools-bar .tb-title {
  color: #343a45;
  font-weight: bold;
  width: 120px;
  display: inline-block;
  border-left: 3px solid #26beff;
  padding-left: 15px;
}
</style>


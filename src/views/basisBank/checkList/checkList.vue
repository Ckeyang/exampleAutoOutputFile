<template>
  <div>
    <div>
      <search-box :form="form">
        <template slot="input">
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input v-model="form.keyWords" size="medium" @keyup.enter.native="getDataList" placeholder="关键词" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          </el-col>
        </template>
      </search-box>
      <div class="regulation-tb box-style_common">
        <div class="tools-bar_common">
          <span class="tb-title">检查列表</span>
          <div style="float: right;margin-right: 15px;">
            <el-button
              type="success"
              size="small"
              class="entry-btn"
              icon="el-icon-plus"
              @click="createNewBasisCheck"
            >新增检查</el-button>
          </div>
        </div>
        <el-table :data="dataList">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="名称">
            <template slot-scope="scope">
              <highlight-words :text="scope.row.name" :keyWords="form.keyWords"></highlight-words>
            </template>
          </el-table-column>
          <el-table-column prop="style" label="来源">
            <template slot-scope="scope">
              法规/标准
              <!-- <span v-for="(item,index) in scope.row.roleInfo" :key="index">&nbsp;{{item.name}}&nbsp;</span> -->
            </template>
          </el-table-column>
          <el-table-column label="法规/标准">
            <template
              slot-scope="scope"
            >{{scope.row.statuteQuantity}}/ {{scope.row.standardQuantity}}</template>
          </el-table-column>
          <el-table-column label="检查条款项">
            <template slot-scope="scope">
              {{scope.row.statuteWordItemQuantity}}/{{scope.row.standardWordItemQuantity}}
              <!-- <highlight-words :text="scope.row.email" :keyWords="form.keyWords"></highlight-words> -->
            </template>
          </el-table-column>
          <el-table-column prop="status" label="有效性" :formatter="translateStatus"></el-table-column>
          <el-table-column prop="abolitionTime" label="生效时间" :formatter="translateDateTime"></el-table-column>
          <el-table-column prop="id"  fixed="right" label="操作" width="250">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i class="iconfont icon-xiugai icon-edit" @click="editCheck(scope.row.id)">编辑</i>
                <i class="iconfont icon-fuzhi icon-edit" @click="copyCheck(scope.row.id)">复制</i>
                <i class="iconfont icon-shanchu icon-edit" @click="deleteCheck(scope.row.id)">删除</i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
      </div>
    </div>
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import SearchBox from "@/components/tools/searchBox.vue";
export default {
  name: "checkList",
  components: { highlightWords, SearchBox, pagniation, preview },
  data() {
    return {
      dataList: [],
      totalPage: 0,
      totalNum: 0,
      basisDetail: { name: "test" },
      form: {
        keyWords: "",
        pageSize: 30,
        current: 0,
        basisId: ""
      }
    };
  },
  activated() {
    this.form.basisId = this.$route.params.id;
    this.getBasisBank();
    this.getDataList();
  },
  methods: {
    translateDateTime(row) {
      let abolitionTime = row.abolitionTime || new Date().getTime();
      let now = new Date(abolitionTime);
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      if (month < 10) {
        month = "0" + month;
      }
      return year + "-" + month + "-" + date;
    },
    translateStatus(row) {
      return row.status === "ACTIVE" ? "现行" : "作废";
    },
    getBasisBank() {
      this.$http.basisBankService
        .getBasisBankById(this.form.basisId)
        .then(res => {
          this.basisDetail = res.data;
        });
    },
    createNewBasisCheck() {
      this.goRoutePath("/basisBank/checkDetail");
    },
    /**
     * 路由跳转
     */
    goRoutePath(path, id = 0) {
      this.$router.push(path + "/" + this.form.basisId + "/" + id);
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.currentPage = page.currentPage - 1;
      this.getDataList();
    },
    //重置
    resetForm() {
      this.form.keyWords = "";
      this.getDataList();
    },
    getDataList() {
      this.$http.basisBankService.getBasisCheckList(this.form).then(res => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      });
    },
    deleteCheck(id) {
      this.$confirm("是否删除此检查?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.basisBankService.deleteBasisCheck(id).then(() => {
          this.$message.success("删除成功");
          this.getDataList();
        });
      });
    },
    copyCheck(id) {
      this.$http.basisBankService.copyBasisCheck(id).then(() => {
        this.getDataList();
      });
    },
    editCheck(id) {
      this.goRoutePath("/basisBank/checkDetail", id);
    }
  }
};
</script>
<style lang="scss" scoped>
.textBox {
  padding: 0.5em;
  line-height: 1.5em;
  display: block;
  overflow: hidden;
  font-size: 12px;
  .title {
    color: #748299;
    padding: 0.2em;
  }
  .detail {
    color: #343a45;
    padding: 0.2em;
  }
}
.box {
  padding: 0.5em;
}
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
}

.search-row .arror-down {
  margin-right: 5px;
}

.entry-btn {
  background: #29cc90;
  border-color: #29cc90;
}

.entry-btn:hover {
  background: rgb(71, 211, 160);
  border-color: rgb(71, 211, 160);
}
</style>

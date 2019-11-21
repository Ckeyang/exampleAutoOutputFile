<template>
  <div>
    <div class="search-box box-style_common">
      <el-form ref="form" :model="form" label-width="70px">
        <el-row class="search-row" style="padding:15px">
          <el-col :span="5">
              <el-form-item label="法规列表">
                <el-select v-model="form.reglationId" placeholder="请选择法规" @change="handleChange" style="width:100%">
                  <el-option v-for="item in reglationData" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
       </el-form>
    </div>
    <!-- 所有通知词条列表 -->
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">通知词条</h5>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="70" label="序号">
        </el-table-column>
        <el-table-column prop="chapterName" label="条目" width="160">
        </el-table-column>
        <el-table-column prop="oldEntryContent" label="词条内容">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.context" placement="bottom-start">
              <span class="content-title">{{scope.row.context}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="entryContent" label="通知内容">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.newContext" placement="bottom-start">
              <span class="content-title">{{scope.row.newContext}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="操作" fixed="right" width="130">
          <template slot-scope="scope">
            <div class="operation-icon" :class="{'active':scope.row.contentTag}">
              <i class="iconfont icon-pishi icon-edit" v-if="scope.row.contentTag" @click="handleAddApproval(scope.row)"  >修改批示 </i>
              <i class="iconfont icon-xiugai icon-edit" v-else @click="handleAddApproval(scope.row)"  >添加批示</i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 页码 -->
    <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage" ref='pagniation'></pagniation>
    <!-- 添加批示对话框 -->
    <div>
      <el-dialog title="添加批示" :visible.sync="dialogVisible" width="30%">
        <el-row>
          <el-col style="text-align: right;width:62px">
            <span>通知名称:</span>
          </el-col>
          <el-col :span="17">
            <span>&nbsp;&nbsp;&nbsp;{{dialogText.name}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-col style="text-align: right;width:62px">
            <span>通知内容:</span>
          </el-col>
          <el-col :span="17" style="margin-left:13px">
            <span class="content-title">{{dialogText.wordsText}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col style="text-align: right;margin-right: 14px;width:62px">
            <span>批改内容:</span>
          </el-col>
          <el-col :span="17">
            <el-input type="textarea" :rows="4" placeholder="请输入批注" v-model="dialogText.contentTag">
            </el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog" size='medium'>取 消</el-button>
          <el-button type="primary" @click="Determine" size='medium'>保 存</el-button>
        </span>
      </el-dialog>
    </div>
    <div style="text-align:center;margin-top:20px">
      <el-button type="primary" @click="handleExamine(1)" size='medium'>不通过</el-button>
      <el-button type="primary" @click="handleExamine(2)" size='medium'>通过</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import pagniation from '@/components/tools/Pagniation.vue';
export default {
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  data() {
    return {
      tableData: [],
      form:{
        reglationId:'' //当前法规的id
      },
      routerData: '',
      reglationData: [],
      dialogText: {
        name: '', //通知名称
        wordsText: '', //通知词条内容
        contentTag: '' //修改内容
      },
      checkedData: {}, //当前选中的项
      currentPage: 1, //当前页码
      pageSize: 30, //每页行数
      totalNum: '', //总条数
      totalPage: '1', //总页数
      dialogVisible: false
    };
  },
  components: {
    pagniation
  },
  activated() {
    if (this.routerData !== this.$route.params.id) {
      this.routerData == this.$route.params.id;
      this.currentPage = 1
      this.$refs.pagniation.refreshPage()
      this.getReglationData();
    }
  },
  methods: {
    //添加批示
    handleAddApproval(row) {
      this.checkedData = row; //保存选中的行
      this.dialogText.contentTag = row.contentTag || '';
      this.dialogText.wordsText = row.newContext;
      this.dialogText.name = this.$route.params.name;
      this.dialogVisible = true;
    },
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
    },
    //确定批注
    Determine() {
      let params = {
        entryId: this.checkedData.id, //词条的id
        contentTag: this.dialogText.contentTag //批改的内容
      };
      //   添加对应词条的批注;
      this.$http.statute
        .noticeWordsPostil(params)
        .then((res) => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          this.getData();
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '添加失败! 请重新尝试。'
          });
        });
      this.closeDialog();
    },
    //根据通知id获取关联的法规
    getReglationData() {
      this.$http.statute.getReglationAddNotices(this.$route.params.id).then((res) => {
        this.reglationData = res.data.statute.map((item) => {
          return { value: item.id, label: item.name };
        });
        this.form.reglationId = this.reglationData[0].value;
        this.name = res.data.notice.name;
        this.pageSize = 30;
        this.currentPage = 1;
        this.getData();
      });
    },
    //重置页码组件的页码
    resetPagniation(){
      this.$refs.pagniation.refreshPage() 
    },
    //获取法规下面的词条
    handleChange() {
      this.currentPage = 1
      this.resetPagniation();
      this.getData();
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.pageSize = page.pageSize;
      this.currentPage = page.currentPage;
      this.getData();
    },
    // 审核提交
    handleExamine(val) {
      let params = {
        noticeId: this.$route.params.id,
        state: val
      };
      this.$http.statute
        .noticeExamineState(params)
        .then((res) => {
          this.$message({
            type: 'success',
            message: '审核完成!'
          });
          //清除对应tags
          this.$store.commit({
            type: 'tag_deleteTags',
            path: this.$route.path
          });
          this.$router.push({
            path: '/statuteBank/regulationlist',
            query: { isRefresh: true }
          });
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            type: 'error',
            message: err.data.message + ' ,请重新提交!'
          });
        });
    },
    //获取通知词条
    getData() {
      this.$http.statute
        .getRealationWords({
          pageSize: parseInt(this.pageSize),
          current: this.currentPage - 1,
          statuteId: this.form.reglationId,
          noticeId: this.$route.params.id
        })
        .then((res) => {
          this.tableData = res.data.content;
          this.totalNum = res.data.totalElements;
          this.totalPage = res.data.totalPages;
        });
    }
  }
};
</script>
<style scoped>
.el-col .words-content {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reglation-title {
  font-size: 14px;
  margin-right: 10px;
  color: #606266;
}

.active {
  color: #26beff;
}

.content-item {
  display: flex;
  justify-content: space-between;
}

.content-item span {
  margin: 0 10px;
}
</style>
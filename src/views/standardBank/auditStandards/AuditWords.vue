<template>
  <div>
    <!-- 该法规所有章节列表 -->
    <div class="regulation-tb box-style_common" >
       <div class="tools-bar_common">
        <h5 class="table-title">词条列表</h5>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="70" label="序号">
        </el-table-column>
        <el-table-column prop="itemType" width="160" label="类型">
        </el-table-column>
        <el-table-column prop="chapterName" label="条目" width="160">
        </el-table-column>
        <el-table-column prop="context" label="内容">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" placement="bottom-start">
              <div slot="content" v-html="scope.row.context"></div>
              <span class="content-title" v-html="scope.row.context"></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="activeDate" label="生效时间" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.activeDate && formatDate(new Date(scope.row.activeDate))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="操作" fixed="right" width="130">
          <template slot-scope="scope">
            <div class="operation-icon" :class="{'active':scope.row.contentTag}">
              <i class="iconfont icon-xiugai icon-edit" v-if="scope.row.contentTag" @click="handleAddApproval(scope.row)">修改批示 </i>
              <i class="iconfont icon-tianjia icon-edit" v-else @click="handleAddApproval(scope.row)">添加批示</i>
            </div>
          </template>
        </el-table-column>
      </el-table>
        <!-- 页码 -->
       <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage" ref='pagniation'></pagniation>
    </div>
   
    
    <!-- 添加批示对话框 -->
    <div>
      <el-dialog title="添加批示" :visible.sync="dialogVisible" width="30%">
        <el-row>
          <el-col style="text-align: right;width:62px">
            <span>法规名称:</span>
          </el-col>
          <el-col :span="17">
            <span>&nbsp;&nbsp;&nbsp;{{dialogText.name}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-col style="text-align: right;width:62px">
            <span>词条内容:</span>
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
import pagniation from '@/components/tools/Pagniation.vue';
import { mapGetters } from 'vuex';
export default {
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  data() {
    return {
      tableData: [],
      routerData: {}, //路由传参数据
      dialogText: {
        name: '', //标准名称
        wordsText: '', //词条内容
        contentTag: '' //批示内容
      },
      checkedData: {}, //当前选中的项
      currentPage: 1, //当前页码
      pageSize: '30', //每页行数
      totalNum: '', //总条数
      totalPage: '1', //总页数
      dialogVisible: false
    };
  },
  components: {
    pagniation
  },
  activated() {
    if (this.routerData.id !== JSON.parse(this.$route.params.obj).id) {
      this.routerData = JSON.parse(this.$route.params.obj);
      this.currentPage = 1;
      this.$refs.pagniation.refreshPage()
      this.getData();
    }
  },
  methods: {
    //添加批示
    handleAddApproval(row) {
      this.checkedData = row; //保存选中的行
      this.dialogText.contentTag = this.checkedData.contentTag || '';
      this.dialogText.wordsText = this.checkedData.context;
      this.dialogText.name = this.routerData.name;
      this.dialogVisible = true;
    },
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
    },
    //确定批注
    Determine() {
      let params = {
        identifier: this.checkedData.id, //词条的id
        contentTag: this.dialogText.contentTag //批改的内容
      };
      // 添加对应词条的批注
      this.$http.standardService
        .addWordsPosilt(params)
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.getData();
          }
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: '添加失败! 请重新尝试。'
          });
        });
      this.closeDialog();
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
        identifier: this.routerData.id,
        state: val
      };
      this.$http.standardService
        .auditState(params)
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
          //回到列表页
          this.$router.push({
            path: '/standardBank/standardList',
            query: {
              isRefresh: true // 刷新列表页
            }
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
    //获取词条数据
    getData() {
      let params = {
        pageSize: parseInt(this.pageSize),
        current: this.currentPage - 1,
        statuteId: this.routerData.id
      };
      this.$http.standardService.getWordList(params).then((res) => {
        this.tableData = res.data.content;
        this.totalNum = res.data.totalElements;
        this.totalPage = res.data.totalPages;
        this.$nextTick(() => {
          this.$mathJax();
        });
      });
    },
    //时间转换函数
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
<style scoped>
.el-col .words-content {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.active {
  color: #26beff;
}
</style>
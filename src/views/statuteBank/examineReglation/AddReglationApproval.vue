<template>
    <div>
        <!-- 该法规所有章节列表 -->
        <div class="regulation-tb box-style_common">
          <div class="tools-bar_common">
            <h5 class="table-title">法规词条</h5>
          </div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column type="index" width="70" label="序号">
                </el-table-column>
                <el-table-column prop="chapterName" label="条目" width="100">
                </el-table-column>
                <el-table-column prop="context" label="内容">
                    <template slot-scope="scope">
                        <span class="content-title">{{scope.row.context}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="操作" fixed="right" width="130">
                    <template slot-scope="scope">
                        <div class="operation-icon"  :class="{'active':scope.row.contentTag}">
                            <i class="iconfont icon-xiugai icon-edit" v-if="scope.row.contentTag" @click="handleAddApproval" :data-row="JSON.stringify(scope.row)">修改批示 </i>
                            <i class="iconfont icon-tianjia icon-edit" v-else @click="handleAddApproval" :data-row="JSON.stringify(scope.row)">添加批示</i>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 页码 -->
        <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage" ref='pagniation' ></pagniation>
        </div>
        <!-- 添加批示对话框 -->
        <div>
            <el-dialog title="添加批示" :visible.sync="dialogVisible" width="30%">
                <el-row>
                    <el-col style="text-align: right;width:62px">
                        <span>法规名称:</span>
                    </el-col>
                    <el-col :span="17">
                        <span>&nbsp;&nbsp;&nbsp;{{dialogText.statuteName}}</span>
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
            <el-button type="primary" @click="handleExamine(2)" size='medium'>通过</el-button>
            <el-button type="primary" @click="handleExamine(1)" size='medium'>不通过</el-button>
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
      routerData: {}, //路由传参数据
      dialogText: {
        statuteName: '', //法规名称
        wordsText: '', //词条内容
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
    if (this.routerData.id !== JSON.parse(this.$route.params.obj).identifier) {
      this.routerData = JSON.parse(this.$route.params.obj);
      this.currentPage = 1
      this.$refs.pagniation.refreshPage()
      this.getData();
    }
  },
  methods: {
    //添加批示
    handleAddApproval(e) {
      this.checkedData = JSON.parse(e.target.getAttribute('data-row')); //保存选中的行
      this.dialogText.contentTag = this.checkedData.contentTag || '';
      this.dialogText.wordsText = this.checkedData.context;
      this.dialogText.statuteName = this.routerData.name;
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
      this.$http.statute.wordsExaminePostil(params).then((res) => {
        if (res.status == 200) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          this.getData();
        } else {
          this.$message({
            type: 'error',
            message: '添加失败! 请重新尝试。'
          });
        }
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
        identifier: this.routerData.identifier,
        state: val
      };
      this.$http.statute
        .reglationExamineState(params)
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
            path: '/statuteBank/regulationlist',
            query: {
              isRefresh: true // 刷新列表页
            }
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            showClose: true,
            type: 'error',
            message: err.data.message + ',请检查后重新提交!'
          });
        });
    },
    getData() {
      this.$http.statute
        .getWords({
          pageSize: parseInt(this.pageSize),
          current: this.currentPage - 1,
          statuteId: this.routerData.identifier
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
.active {
  color: #26beff;
}
</style>

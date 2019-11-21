<template>
  <div>
    <div class="btn-top">
      <div style="margin-bottom:10px">
        <label class="reglation-title">法规列表: </label>
        <el-select v-model="reglationId" placeholder="请选择法规" @change="handleChange" size='small'>
          <el-option v-for="item in reglationData" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-button type="primary" @click="toListPage" size='small'>返回列表</el-button>
      </div>
    </div>
    <!-- 法规列表 -->
    <div class="regulation-tb box-style_common">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="70" label="序号">
        </el-table-column>
        <el-table-column prop="chapterName" label="目录" width="100">
        </el-table-column>
        <el-table-column prop="context" label="内容">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.context || scope.row.newContext" placement="bottom-start">
              <span class="content-title" :class="{'tb-active':scope.row.newContext}">{{scope.row.newContext || scope.row.context}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="activeDate " label="生效日期" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.activeDate">{{formatDate(new Date(scope.row.activeDate))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Remarks" label="备注" width="250">
        </el-table-column>
        <el-table-column prop="id" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i class="iconfont icon-tianjia" v-if="!scope.row.noticeId" @click="addExplain" :data-row="JSON.stringify(scope.row)">{{judgeIsAddNotice(scope.row.noticeIds,routerData.noticeId)? "已添加":"添加说明"}}</i>
              <div v-else>
                <p>
                  <!-- <i v-if="scope.row.contentTag" class="iconfont icon-pigai" @click="checkPostil(scope.row)">查看批注</i> -->
                </p>
                <i class="iconfont icon-xiugai editNitice" @click="editNotices(scope.row)" v-if="scope.row.noticeId==routerData.noticeId"
                  :class='{"is-edit":scope.row.contentTag}'>修改说明</i>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage" ref='pagniation'></pagniation>
      <!-- 添加批示对话框 -->
      <div>
        <el-dialog title="添加说明" :visible.sync="dialogVisible" width="30%" v-el-drag-dialog>
          <el-row>
            <el-col :span="3" style="text-align: right">
              <span>通知名称:</span>
            </el-col>
            <el-col :span="17">
              <span>&nbsp;&nbsp;&nbsp;{{dialogText.noticeName}}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top:10px;">
            <el-col :span="3" style="text-align: right">
              <span>词条内容:</span>
            </el-col>
            <el-col :span="17" style="margin-left:13px">
              <span class="content-title">{{dialogText.wordText}}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="3" style="text-align: right;margin-right: 14px;">
              <span>通知内容:</span>
            </el-col>
            <el-col :span="17">
              <el-input type="textarea" :rows="3" placeholder="请输入通知内容" v-model="dialogText.editText">
              </el-input>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="Determine">保 存</el-button>
          </span>
        </el-dialog>
      </div>
      <div>
        <el-dialog title="修改通知" :visible.sync="editNoticeDialog" width="30%" v-el-drag-dialog>
          <el-row style="margin-top:10px;" v-show="editNoticeDialogText.postilText">
            <el-col :span="3" style="text-align: right">
              <span>批示内容:</span>
            </el-col>
            <el-col :span="17" style="margin-left:13px">
              <span class="content-title">{{editNoticeDialogText.postilText}}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="3" style="text-align: right;margin-right: 14px;">
              <span>编辑内容:</span>
            </el-col>
            <el-col :span="17">
              <el-input type="textarea" :rows="3" placeholder="请输入通知内容" v-model="editNoticeDialogText.editNoticeText">
              </el-input>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editNoticeDialog=false">取 消</el-button>
            <el-button type="primary" @click="determineEditNotice">保 存</el-button>
          </span>
        </el-dialog>
      </div>
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
      form: {
        keyWords: ''
      },
      routerData: {}, //存放路由参数
      tableData: [],
      noticeName: '', //当前通知的名字
      timeout: null,
      dialogText: {
        noticeName: '', //通知名称
        wordText: '', //词条内容
        editText: '' //通知内容
      },
      editNoticeDialogText: {
        //修改通知对话栏内容
        postilText: '',
        editNoticeText: ''
      },
      reglationId: '', //当前法规的id
      reglationData: [],
      currentPage: 1, //当前页码
      pageSize: 30, //每页行数
      totalNum: '', //总条数
      totalPage: '1', //总页数
      dialogVisible: false, //添加通知面板
      editNoticeDialog: false, //修改通知面板
      checkedData: {} //当前选中的项
    };
  },
  activated() {
    if(!this.routerData.id){
      this.routerData = {
        id:this.$route.params.id,
        noticeName:this.$route.params.name,
      }
    }
    this.getReglationData();
  },
  components: {
    pagniation
  },
  methods: {
    //添加说明
    addExplain(e) {
      if (e.target.innerText != '已添加') {
        this.checkedData = JSON.parse(e.target.getAttribute('data-row')); //保存选中的行
        this.dialogText.editText = '';
        this.dialogText.wordText = this.checkedData.context;
        this.dialogText.noticeName = this.routerData.noticeName;
        this.dialogVisible = true;
      } else {
        this.$message({
          message: '您已经添加了通知，请勿重复添加！',
          type: 'warning'
        });
      }
    },
    //获取法规下面的词条
    handleChange() {
      this.currentPage = 1
      this.$refs.pagniation.refreshPage()
      this.getData();
    },
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
    },
    //打开修改通知词条面板
    editNotices(row) {
      this.editNoticeDialogText.editNoticeText = row.newContext;
      this.editNoticeDialogText.postilText = row.contentTag;
      this.checkedData = row;
      this.editNoticeDialog = true;
    },
    //确认修改通知词条
    determineEditNotice() {
      this.$http.statute
        .editNoticesWords(this.checkedData.id, {
          notifyEntryContent: this.editNoticeDialogText.editNoticeText
        })
        .then((res) => {
          this.editNoticeDialog = false;
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.getData();
        });
    },
    //判断是否已添加通知词条
    judgeIsAddNotice(strId, id) {
      if (strId) {
        return strId.split('-').some((item) => {
          return item === id;
        });
      }
    },
    //返回首页
    toListPage() {
      //清除对应tags
      this.$store.commit({
        type: 'tag_deleteTags',
        path: this.$route.path
      });
      this.$router.push({
        path: '/statuteBank/regulationlist',
        query: {
          isRefresh: true // 刷新列表页
        }
      });
    },
    //确定批注
    Determine() {
      let params = {
        noticeId: this.routerData.noticeId, //通知法规的id
        entryId: this.checkedData.id, //词条的id
        statuteId: this.reglationId, //法规的id
        entryContent: this.dialogText.editText, //批改的内容
        effectTime: this.routerData.effectTime
      };
      // 添加对应通知词条;
      this.$http.statute
        .addNoticeWords(params)
        .then((res) => {
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.getData();
        })
        .catch((error) => {
          this.$message({
            message: '操作失败！',
            type: 'error'
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
    //获取词条
    getData() {
      let params = {
        pageSize: parseInt(this.pageSize),
        current: this.currentPage - 1,
        statuteId: this.reglationId
      };
      this.$http.statute.getWords(params).then((res) => {
        this.tableData = res.data.content;
        this.totalNum = res.data.totalElements;
        this.totalPage = res.data.totalPages;
      });
    },
    //根据通知id获取关联的法规
    getReglationData() {
      this.$http.statute.getReglationAddNotices(this.$route.params.id).then((res) => {
        this.reglationData = res.data.statute.map((item) => {
          return { value: item.id, label: item.name };
        });
        this.reglationId = this.reglationData[0].value;
        this.getData();
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
.reglation-title {
  font-size: 14px;
  margin-right: 10px;
  color: #606266;
}

.active {
  color: #26beff;
}

.tb-active {
  color: #26beff;
}

.editNitice.is-edit {
  color: rgb(218, 40, 40);
}

.is-edit:hover {
  color: rgb(218, 40, 40);
}

.editNitice {
  color: #26beff;
}

.btn-top {
  display: flex;
  justify-content: space-between;
}
</style>
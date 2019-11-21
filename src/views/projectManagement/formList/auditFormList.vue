<template>
    
     <div>
        <div class="search-box">
            <el-form ref="form" :model="form" label-width="70px">
                <el-row class="search-row">
                    <el-col style="width:350px">
                        <el-form-item label="关键字">
                            <el-input v-model="form.keyWords" size="medium" placeholder="项目名称 / 单位名称 / 委托受理编号" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-button type="primary" size="medium"  icon="el-icon-search" round @click="getDataList">搜索</el-button>
                        <el-button type="info" size="medium"  icon="el-icon-refresh" round @click="resetForm">重置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
      <div class="regulation-tb">
        <div class="tools-bar_common">
          <h5 class="tb-title">项目列表</h5>
          <div style="float: right;margin-right: 15px;">
            <!-- <el-button type="success" size="small" round class="entry-btn" @click="addNewProject">新增项目</el-button> -->
          </div>
        </div>
        <el-table :data="dataList">
          <el-table-column type="index" width="70" label="项目编号"></el-table-column>
          <el-table-column prop="projectName" label="项目名称" >
            <template slot-scope="scope">
              <highlight-words :text="scope.row.projectName" :keyWords="form.keyWords"></highlight-words>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="单位名称" width='200'>
            <template slot-scope="scope">
              <highlight-words :text="scope.row.companyName" :keyWords="form.keyWords"></highlight-words>
            </template>
          </el-table-column>
          <el-table-column prop="entrustNumber" label="委托受理编号" width='200'>
            <template slot-scope="scope">
              <highlight-words :text="scope.row.entrustNumber" :keyWords="form.keyWords"></highlight-words>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width='100'>
            <template slot-scope="scope">
              <span v-if="scope.row.createdDate">{{formatDate(new Date(scope.row.createdDate))}}</span>
            </template>
          </el-table-column>
            <!-- <el-table-column prop="confilctNum" label="冲突个数">

            <template slot-scope="scope">
              <span style="color:red">{{scope.row.confilctNum || 0}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="remark" label="备注" width='200'>
            <template slot-scope="scope">
              <span>{{scope.row.remark}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="操作" fixed="right" width="220">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i class="iconfont icon-shenhe icon-edit" v-if="scope.row.projectState!=='AUDITED'&& checkAuth('RBAC_PERMISSION-formList-state')" @click="commitAudit(scope.row)">审核</i>
                <i class="iconfont icon-xiugai icon-edit" @click="goTemplateView(scope.row.id,'view')">查看</i>
                <i class="iconfont icon-dayin icon-edit" @click="goPrintPreview(scope.row.id)">打印预览</i>
                <!-- <i class="iconfont icon-shanchu icon-edit" v-if='scope.row.auditState!="SUCCESS"' @click='showDialog(scope.row.id)'>删除</i> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage" ></pagniation>
       <el-dialog title="审核" :visible.sync="dialogVisible" width="15%">
                <div>
                   <h4 style="text-align:center">确定审核通过？</h4>
                </div>
                <span  slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible=false">取 消</el-button>
                    <el-button type="primary" @click="doAuditForm">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>
<script>
import highlightWords from '@/components/tools/HighlightWords.vue';
import pagniation from '@/components/tools/Pagniation.vue';
import preview from '@/components/tools/Preview.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'autitFormList',
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  components: { highlightWords, pagniation, preview },
  data() {
    return {
      dataList: [{ id: 'test', conflictNum: 1 }],
      haveConflict: false,
      dialogVisible: false,
      curId: '',
      curItem: {},
      totalPage: 0,
      totalNum: 0,
      curId: '',
      form: { keyWords: '', pageSize: 30, current: 0 },
      confilctData: [] //记录冲突
    };
  },
  mounted() {
    let that = this;
    window.onfocus = function() {
      that.getDataList();
    };
  },
  activated() {
    this.getDataList();
  },
  methods: {
    //获取冲突个数
    getProjectConflictNum(id) {
      this.$http.formEnterService.getProjectConflictNum(id).then((res) => {
        this.confilctData.push({ data: res.data, id: id });
      });
    },
    //重置
    resetForm() {
      this.form.keyWords = '';
      this.getDataList();
    },
    /**
     * 审核
     */
    commitAudit(item) {
      this.curId = item.id;
      this.curItem = item;
      this.dialogVisible = true;
      // this.haveConflict = this.curItem.remark ? true : false;
    },
    /**
     * 去预览页面
     */
    goTemplateView(projectId = 0, action, id = 0) {
      this.openWindow('templatePreview', projectId, id, action);
    },
    //去表单打印预览页面
    goPrintPreview(projectid) {
      let localPath = location.href.replace(this.$route.path, '') + '/printPreviewForm/' + projectid;
      window.open(localPath);
    },
    /**
     * 打开新窗口
     */
    openWindow(route, projectId = 0, tempId = 0, action) {
      let localPath = location.href.split(this.$route.path)[0] + '/' + route + '/' + projectId + '/' + tempId;
      localPath += route === 'templatePreview' ? '/' + action : '';
      window.open(localPath);
      // this.$confirm('是否已经完成?', '', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.getDataList();
      // });
    },
    /**
     * 获取datalist
     */
    getDataList() {
      this.$http.projectService.getAuditFormList(this.form).then((res) => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
        //临时方案，需要修改
        // if (this.dataList) {
        //   for (let i = 0; i < this.dataList.length; i++) {
        //     this.getProjectConflictNum(this.dataList[i].id);
        //   }
        //   setTimeout(() => {
        //     this.dataList = this.dataList.map((item) => {
        //       for (let item1 of this.confilctData) {
        //         if (item.id === item1.id) {
        //           item.confilctNum = item1.data;
        //           break;
        //         }
        //       }
        //       return item;
        //     });
        //   }, 2000);
        // }
      });
    },
    /**
     * 执行审核通过
     */
    doAuditForm() {
      this.$http.projectService
        .auditForm({
          identifier: this.curId,
          projectState: 'AUDITED'
        })
        .then(() => {
          this.getDataList();
          this.dialogVisible = false;
        });
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
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
.boxItem {
  position: relative;
  padding: 14px;
  height: 70px;
  > h4 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #343a45;
  }
  > div {
    text-align: center;
  }
  > span {
    color: #9badcc;
    font-size: 12px;
  }
  > .bottom_right {
    position: absolute;
    right: 14px;
    bottom: 14px;
    .noBorder {
      border: 0;
    }
    .noBorder:hover {
      color: #26beff;
      background: #fff;
    }
  }
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

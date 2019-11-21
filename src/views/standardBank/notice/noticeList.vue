<template>
    <div>
       <search-box :from="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="关键字">
            <el-input v-model="form.keyWords" size="medium" @keyup.enter.native="getDataList" placeholder="关键词" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList(true)">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-col>
      </template>
      <!-- <template slot="button">
        <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </template> -->
    </search-box>
      <div class="regulation-tb box-style_common">
        <div class="tools-bar_common">
          <h5 class="table-title">公告列表</h5>
          <div style="float: right;">
            <!-- <el-button type="success" size="small"  class="entry-btn" icon='el-icon-plus'  v-if="checkAuth('RBAC_PERMISSION-noticeList-create')" @click="goNotice()">录入公告</el-button> -->
          </div>
        </div>
        <el-table :data="dataList">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="name" label="名称" width="250">
            <template slot-scope="scope">
              <highlight-words :text="scope.row.name" :keyWords="form.keyWords"></highlight-words>
            </template>
          </el-table-column>
          <el-table-column prop="releaseMechanism" label="发布机构">
            <template slot-scope="scope">
              <highlight-words :text="scope.row.releaseMechanism" :keyWords="form.keyWords"></highlight-words>
            </template>
          </el-table-column>
          <el-table-column prop="style" label="文体">
            <template slot-scope="scope">
              <highlight-words :text="scope.row.style" :keyWords="form.keyWords"></highlight-words>
            </template>
          </el-table-column>
          <el-table-column prop="releaseTime" label="发布时间">
            <template slot-scope="scope">
              <span v-if="scope.row.releaseTime">{{formatDate(new Date(scope.row.releaseTime))}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="postNo" label="发布号" >
            <template slot-scope="scope">
              <highlight-words :text="scope.row.postNo" :keyWords="form.keyWords"></highlight-words>
            </template>
          </el-table-column>  -->
          <el-table-column prop="reviewStatus" label="审核" >
            <template slot-scope="scope">
              <span>{{scope.row.auditState== 'AUDITING' ? "待审核": scope.row.auditState== 'FAILED' ?"未通过":"已通过"}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="操作" fixed="right" width="270">
            <template slot-scope="scope">
              <div class="operation-icon">
                <!-- <i class="iconfont icon-xiugai icon-edit" v-if='scope.row.auditState=="FAILED"&&checkAuth("RBAC_PERMISSION-noticeList-create")' @click="goNotice(scope.row.id)">修改</i> -->
                <!-- <i class="iconfont icon-shenhe icon-edit"  v-if='scope.row.auditState=="AUDITING"&&checkAuth("RBAC_PERMISSION-noticeList-audio")' @click="goNotice(scope.row.id,'review')" >审核</i> -->
                <i class="iconfont icon-citiao icon-edit"  v-if='scope.row.auditState=="SUCCESS"' @click="goWordBar(scope.row.id)">词条</i>
                <!-- <i class="iconfont icon-citiaoshenhe icon-edit" @click="goWordbar" :id="scope.row.id" v-if="!scope.row.statuteType">词条</i> -->
                <i class="iconfont icon-yuanjian icon-edit" :id="scope.row.originalAddress">
                  <preview :url="scope.row.originalAddress" name="原件"></preview>
                </i>
                <i class="iconfont icon-shanchu icon-edit" v-if='scope.row.auditState!="SUCCESS"&&checkAuth("RBAC_PERMISSION-noticeList-delete")' @click='showDialog(scope.row.id)'>删除</i>
              </div>
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
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters } from 'vuex';
export default {
  components: { highlightWords,SearchBox,pagniation, preview },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  name:'noticeList',
  data() {
    return {
      dataList: [],
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
    //重置
    resetForm() {
      this.form.keyWords = '';
      this.form.current = 0
      this.$refs.pagniation.refreshPage()
      this.getDataList();
    },
    /**
     * 获取datalist
     */
    getDataList(isRefresh = false) {
      if(isRefresh){
        this.form.current = 0
        this.$refs.pagniation.refreshPage()
      }
      this.$http.noticeService.getNoticeList(this.form).then((res) => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      });
    },
    /**
     * 去词条list
     */
    goWordBar(id) {
      this.$router.push('/standardBank/noticePrompt/' + id);
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    /**
     * 去录入公告界面
     */
    goNotice(id = '0', method = 'noReview') {
      sessionStorage.setItem('noticeMethod', method);
      this.$router.push('/standardBank/noticeEntry/' + id);
    },
    /**
     *
     */
    showDialog(id) {
      this.curId = id;
      this.$confirm('是否删除此公告?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDeleteNotice();
      });
    },
    /**
     * 执行删除
     */
    doDeleteNotice() {
      this.$http.noticeService.deleteNoticeItem(this.curId).then(() => {
        this.$message({ type: 'success', message: '删除成功' });
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
</style>
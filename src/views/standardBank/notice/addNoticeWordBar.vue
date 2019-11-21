<template>
    <div>
       <div class="search-box">
                <div>
                  <el-checkbox-group v-model="search.standardId" @change="getDataList">
                    <el-checkbox-button v-for="item in noticeForm.parentId" :label="item.id" :key="item.id">{{item.name}}</el-checkbox-button>
                  </el-checkbox-group>
               </div>
       </div>
      <div class="regulation-tb">
         <el-table :data="dataList">
             <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="style" label="位置" width="150">
              <template slot-scope="scope">
                <highlight-words :text="scope.row.chapterName" :keyWords="form.keyWords"></highlight-words>
              </template>
            </el-table-column>
            <el-table-column prop="releaseTime" label="内容">
              <template slot-scope="scope">
                  <el-tooltip class="item" effect="light" v-if="scope.row.newContext" placement="bottom-start">
                    <div slot="content" v-html="scope.row.newContext"></div>
                    <span class="content-title" v-html="scope.row.newContext"></span>
                  </el-tooltip>
                  <el-tooltip class="item" v-else effect="light"  placement="bottom-start">
                    <div slot="content" v-html="scope.row.context"></div>
                    <span class="content-title" v-html="scope.row.context"></span>
                  </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="postNo" label="实施日期" width="150">
              <template slot-scope="scope">
                {{formatDate(new Date(scope.row.activeDate))}}
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" fixed="right" width="270">
              <template slot-scope="scope">
                <div class="operation-icon"  :class="{'active':scope.row.contentTag ? true:false}">
                  <i class="iconfont icon-xiugai icon-edit" v-if="method==='noReview'" @click="showNoticeWardBar(scope.row)">{{!scope.row.newContext?"添加词条":"修改词条"}}</i>
                  <i class="iconfont icon-pishi" v-if="method==='review'" :class="scope.row.contentTag ? 'icon-pishi':'icon-pigai_tianjiapizhu'"
                    @click="editAnnotation(scope.row)">{{!scope.row.contentTag?"添加批示":"修改批示"}}</i>
                </div>
              </template>
            </el-table-column>
      </el-table>
      </div>
      <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
      <br/>
      <el-row class="tac" v-if='method==="noReview"'>
            <el-button type="info" @click="goBack()">上一步</el-button>
            <el-button type="primary" @click="goList()">提交</el-button>
      </el-row>
      <el-row class="tac" v-if='method==="review"'>
            <el-button type="info" @click="doPassTheNotice('1')">不通过</el-button>
            <el-button type="success" @click="doPassTheNotice('2')">通过</el-button>
      </el-row>
      
            <el-dialog title="添加词条" :visible.sync="dialogVisible" width="40%">
                    <div class="tb-box">
                    <div v-if='wordBarItem.contentTag' style="margin: 15px 0;">
                      批示:{{wordBarItem.contentTag}}
                    </div>
                    <el-input type="textarea" rows="6" resize="none" v-model="wordBarItem.newContext"></el-input>
                    </div>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible=false">取 消</el-button>
                    <el-button type="primary" @click="createNoticeWordBar">保 存</el-button>
                    </span>
            </el-dialog>
            <el-dialog title="批注" :visible.sync="isShowAnnotation" width="30%">
                    <el-row style="line-height:40px">
                      原词条:{{announcementAudit.wordContent}}
                    </el-row>
                    <div class="tb-box">
                    <div style="margin: 15px 0;"></div>
                    <el-input type="textarea" v-model="announcementAudit.contentTag" rows="6" resize="none"></el-input>
                    </div>
                    <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="announcementsAuditWordItems">保 存</el-button>
                    </span>
            </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import highlightWords from '@/components/tools/HighlightWords.vue';
import pagniation from '@/components/tools/Pagniation.vue';
import preview from '@/components/tools/Preview.vue';
export default {
  name: 'addNoticeWordBar',
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  components: { highlightWords, pagniation, preview },
  data() {
    return {
      curId: '',
      method: '',
      dialogVisible: false,
      isShowAnnotation: false,
      curNoticeIds: '',
      totalPage: 0,
      totalNum: 0,
      form: { keyWords: '' },
      search: {
        announcementId: '',
        parentId: '',
        pageSize: 30,
        current: '0'
      },
      dataList: [],
      announcementAudit: {
        announcementId: '',
        wordContent: '',
        standardId: '',
        entryId: '',
        contentTag: ''
      },
      noticeForm: {},
      wordBarItem: {
        contentTag: '',
        id: '',
        announcementId: '',
        standardId: '',
        newContext: ''
      }
    };
  },
  activated() {
    this.curId = this.$route.params.id;
    this.method = sessionStorage.getItem('noticeMethod');
    this.getNoticeItem();
  },
  methods: {
    /**
     * 通过 不通过
     */
    doPassTheNotice(params) {
      this.$http.noticeService
        .passNotice({
          noticeId: this.curId,
          state: params
        })
        .then((res) => {
          this.goList();
        });
    },
    /**
     *获取 item
     */
    getNoticeItem() {
      this.$http.noticeService.getNoticeById(this.curId).then((res) => {
        this.noticeForm = res.data;
        this.search.announcementId = this.method === 'review' ? this.curId : '';
        this.search.parentId = this.noticeForm.literatureIds ? this.noticeForm.literatureIds[0] : '';
        if (this.search.parentId) {
          this.getDataList();
        }
      });
    },
    /**
     * 编辑
     */
    editAnnotation(item) {
      this.isShowAnnotation = true;
      this.announcementAudit.announcementId = this.curId;
      this.announcementAudit.standardId = this.search.parentId;
      this.announcementAudit.entryId = item.id;
      this.announcementAudit.contentTag = item.contentTag;
      this.announcementAudit.wordContent = item.newContext;
    },
    /**
     * 审核
     */
    announcementsAuditWordItems() {
      this.$http.noticeService.announcementsAuditWordItems(this.announcementAudit).then((res) => {
        this.isShowAnnotation = false;
        this.$message({ type: 'success', message: '批注成功' });
        this.getDataList();
      });
    },
    /**
     * 展示词条
     */
    showNoticeWardBar(item) {
      this.curNoticeIds = item.noticeIds || '';
      this.wordBarItem.id = item.id;
      this.wordBarItem.announcementId = this.curId;
      this.wordBarItem.standardId = this.search.parentId;
      this.wordBarItem.contentTag = item.contentTag;
      this.wordBarItem.newContext = item.newContext;
      this.dialogVisible = true;
    },
    /**
     * 创建词条
     */
    createNoticeWordBar() {
      if (!this.curNoticeIds) {
        this.$http.noticeService.createNoticeWordBar(this.wordBarItem).then((res) => {
          this.$message({ message: '创建成功', type: 'success' });
          this.dialogVisible = false;
          this.getDataList();
        });
      } else {
        this.$http.noticeService.updateNoticeWord(this.wordBarItem.id, this.wordBarItem).then((res) => {
          this.$message({ message: '修改成功', type: 'success' });
          this.dialogVisible = false;
          this.getDataList();
        });
      }
    },

    //分页组件改变页码
    handleChangePage(page) {
      this.search.pageSize = page.pageSize;
      this.search.current = page.currentPage - 1;
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
    },
    /**
     * 获取列表
     */
    getDataList() {
      this.$http.noticeService.getNoticeStandardList(this.search).then((res) => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
        this.$nextTick(() => {
          this.$mathJax();
        });
      });
    },
    goBack() {
      this.$router.push('/standardBank/noticeEntry/' + this.curId);
    },
    goList() {
      this.$router.push('/standardBank/noticeList');
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
.tac {
  text-align: center;
}
</style>
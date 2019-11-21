<template>
    <div>
       <div class="search-box">
    <el-checkbox-group v-model="search.standardId" @change="getDataList">
      <el-checkbox-button v-for="item in noticeForm.parentId" :label="item.id" :key="item.id">{{item.name}}</el-checkbox-button>
    </el-checkbox-group>
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
            <div class="operation-icon">
              <i class="iconfont icon-beizhu icon-edit" @click="showWordBarDesc(scope.row)">备注</i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      </div>
            <el-dialog title="备注" :visible.sync="isShow" width="30%">
                    <el-row style="line-height:40px">
                    </el-row>
                    <div class="tb-box">
                    <div style="margin: 15px 0;"></div>
                    <el-input type="textarea" v-model="item.tag" rows="6" resize="none"></el-input>
                    </div>
                    <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addWordBarDesc">保 存</el-button>
                    </span>
            </el-dialog>
      <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
    </div>
</template>
<script>
import highlightWords from '@/components/tools/HighlightWords.vue';
import pagniation from '@/components/tools/Pagniation.vue';
import preview from '@/components/tools/Preview.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'noticePrompt',
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  components: { highlightWords, pagniation, preview },
  data() {
    return {
      noticeForm: {},
      curId: '',
      isShow: false,
      totalPage: 0,
      totalNum: 0,
      search: {
        announcementId: '',
        parentId: '',
        pageSize: 30,
        current: '0'
      },
      item: {
        identifier: '',
        tag: ''
      },
      form: { keyWords: '' },
      dataList: []
    };
  },
  activated() {
    this.curId = this.$route.params.id;
    this.getNoticeItem();
  },
  methods: {
    /**
     * 展示编辑框
     */
    showWordBarDesc(item) {
      this.item.identifier = item.id;
      this.item.tag = item.tag;
      this.isShow = true;
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.search.pageSize = page.pageSize;
      this.search.current = page.currentPage - 1;
      this.getDataList();
    },
    /**
     * 添加备注
     */
    addWordBarDesc() {
      this.isShow = false;
      this.$http.noticeService.createWordBarDesc(this.item).then(()=>{
          this.$message({ type: 'success', message: '备注成功' });
          this.getDataList();
      });
    },
    /**
     *获取 item
     */
    getNoticeItem() {
      this.$http.noticeService.getNoticeById(this.curId).then((res) => {
        this.noticeForm = res.data;
        this.search.announcementId = this.curId;
        this.search.parentId = this.noticeForm.literatureIds[0];
        this.getDataList();
      });
    },
    /**
     * 获取列表
     */
    getDataList() {
      this.$http.noticeService
        .getNoticeStandardList(this.search)
        .then((res) => {
          this.dataList = res.data.content;
          this.totalPage = res.data.totalPages;
          this.totalNum = res.data.totalElements;
          this.$nextTick(() => {
            this.$mathJax();
          });
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

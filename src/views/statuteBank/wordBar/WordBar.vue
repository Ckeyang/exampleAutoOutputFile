<template>
  <div class="content-warp">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="5">
          <el-form-item label="关键字" >
            <el-input v-model="form.keyWords" placeholder="请输入词条关键字"  @keyup.enter.native="searchBtn"></el-input>
          </el-form-item>
        </el-col>
        <el-col  class="search-btn-box">
          <el-button type="primary" size="small"  icon="el-icon-search"  @click="searchBtn">搜索</el-button>
          <el-button  size="small"  icon="el-icon-refresh"  @click="refreshBtn">重置</el-button>
        </el-col>
      </template>
    </search-box>  
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">法规词条</h5>
      </div>
      <vxe-table :data="tableData" 
      style="width: 100%" 
      :max-height='winHeight - 326'
      show-header-overflow
      show-overflow
      highlight-hover-row>
        <vxe-table-column type="index" width="80" title="序号">
        </vxe-table-column>
        <vxe-table-column field="chapterName" title="目录" width="100">
        </vxe-table-column>
        <vxe-table-column field="context" title="内容">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" v-if="scope.row.context" :content="scope.row.context" placement="bottom-start">
              <span class="content-title">{{scope.row.context}}</span>
            </el-tooltip>
             <el-tooltip class="item" v-else effect="light" :content="scope.row.entryContent" placement="bottom-start">
              <span class="content-title">{{scope.row.entryContent}}</span>
            </el-tooltip>
          </template>
        </vxe-table-column>
      </vxe-table>
       <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage" ref='pagniation'></pagniation>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import pagniation from '@/components/tools/Pagniation';
import preview from '@/components/tools/Preview.vue';
import SearchBox from "@/components/tools/searchBox.vue";
export default {
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  name:'wordbar',
  data() {
    return {
      form: {
        keyWords: ''
      },
      label: { labelName: '' },
      rules: {
        labelName: [{ required: true, message: '请输入标签名称' }]
        //   menus: [{ type: 'array', required: true, message: '必须选择权限' }]
      },
      curId: '',
      tags: [],
      chooseTags: [],
      originalAddress: '', //通知原件地址
      routerData: '',
      tableData: [],
      currentPage: 1, //当前页码
      pageSize: 30, //每页行数
      totalNum: '', //总条数
      totalPage: '1', //总页数
      cardIsShow: false, //控制通知卡片的显示
      dialogVisible: false,
      showDialog: false,
      isShowTagsBox: false,
      currentCatalog: '', //当前备注行的目录,
      currentCheckId: '', //当前修改行的ID
      remarksContent: '' //备注内容
    };
  },
  components: {
    pagniation,
    preview,
    SearchBox
  },
  //初始化数据
  activated() {
    if (this.routerData !== this.$route.params.id) {
      this.routerData = this.$route.params.id;
      this.refreshBtn();
    }
    this.getTags();
  },
  methods: {
    /**
     * 校验表单
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.showDialog = false;
          this.doCreateLabel();
        } 
      });
    },

    /**
     * 执行创建
     */
    doCreateLabel() {
      this.$http.labelBankService.createLabel(this.label).then(() => {
        this.getTags();
      });
    },
    /**
     *添加标签
     */
    addTags(id) {
      this.curId = id;
      this.isShowTagsBox = true;
      this.$http.labelBankService
        .getTagsWithStatuteWord(this.curId)
        .then((res) => {
          this.chooseTags = res.data;
        });
    },
    /**
     * 获取标签
     */
    getTags() {
      this.$http.labelBankService.getLabelBankListAll().then((res) => {
        this.tags = res.data;
      });
    },
    /**
     * 添加标签
     */
    addTag(item) {
      this.$http.labelBankService
        .addTagToStatuteWord(this.curId, item)
        .then((res) => {
          this.chooseTags = res.data;
        });
    },
    /**
     * 移除tag
     */
    removeTag(item) {
      this.$http.labelBankService
        .removeTagFromStatuteWord(this.curId, item)
        .then((res) => {
          this.chooseTags = res.data.data;
        });
    },
    // 查看通知原件，获取原件地址
    noticeCard(id) {
      this.$http.statute.getReglationAddNotices(id).then((res) => {
        this.originalAddress = res.data.notice.originalAddress;
        this.$nextTick(() => {
          this.$refs.a_toggle.click(); //主动触发a标签事件
        });
      });
    },
    // 获得点击行的信息
    handleClick(row) {
      this.dialogVisible = true;
      this.currentCheckId = row.id;
      this.remarksContent = row.tag;
    },
    //关闭对话框
    cancelDialog() {
      this.dialogVisible = false;
      this.remarksContent = ''; //清空信息
    },
    //添加备注
    Determine() {
      this.$http.statute
        .addWordsRemarks({
          identifier: this.currentCheckId,
          tag: this.remarksContent
        })
        .then((res) => {
          this.$message({
            message: '备注添加成功',
            type: 'success'
          });
          this.getData(this.$route.params.id);
        });
      this.cancelDialog();
    },
    //搜索
    searchBtn() {
      this.currentPage = 1;
      this.$refs.pagniation.refreshPage()
      this.getData(this.$route.params.id);
    },
    //刷新
    refreshBtn() {
      this.form.keyWords = '';
      this.pageSize = 30;
      this.currentPage = 1;
      this.$refs.pagniation.refreshPage(); //重置页码,刷新表单
      this.getData(this.$route.params.id);
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.pageSize = page.pageSize;
      this.currentPage = page.currentPage;
      this.getData(this.$route.params.id);
    },
    getData(id) {
      let params = {
        pageSize: parseInt(this.pageSize),
        current: this.currentPage - 1,
        statuteId: id,
        literatureState:"ALL",
        keyWords: this.form.keyWords
      };
      this.$http.statute.getWords(params).then((res) => {
        this.tableData = res.data.content;
        this.totalNum = res.data.totalElements;
        this.totalPage = res.data.totalPages;
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
.selfDesign {
  color: #26beff;
  border: 1px solid #26beff;
}
.tagLabel {
  font-size: 14px;
  color: #5d687a;
  padding: 1em 0;
}
.chooseTagColor {
  color: #fff;
  background-color: #26beff;
}
.tagColor {
  background-color: #e1eafa;
}
.tagItem {
  display: inline-block;
  cursor: pointer;
  text-align: center;
  min-width: 80px;
  padding: 0.5em 1em;
  font-size: 12px;
  margin: 0 1.1em 1em;
  box-sizing: border-box;
}
/* .search-box {
  background: #fff;
  border-radius: 5px;
  border-bottom: 1px solid #edf1f7;
  padding: 15px;
  line-height: 40px;
  height: 40px;
  box-sizing: content-box;
} */

.regulation-tb {
  margin-top: 15px;
}

.box-card {
  width: 480px;
  height: 151px;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  box-shadow: 4px 0px 6px rgba(29, 106, 240, 0.25);
  position: fixed;
  right: -480px;
  top: 0;
  z-index: 3;
}

.box-card.active {
  right: 0;
}

.catalog-title {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 14px;
}
</style>
<template>
  <div class='printPreview-box'>
    <div ref='printBox' class="print-box">
      <div class="print-top">
        <span class="title">{{formTitle}}</span>
        <el-button type="primary"  size="small" @click='print' v-if='isShowPrintBtn'>打 印</el-button>
      </div>
      <ul>
        <Print-preview :model='item' v-for='(item,i) of templateForm' :key='i' :isLoop='true' :titleIndex='i+1' :sortIndex='i+1'></Print-preview>
      </ul>
    </div>
  </div>
</template>
<script>
import PrintPreview from './PrintPreview.vue';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      isShowPrintBtn: true,
      formTitle: '表单名字',
      templateForm: []
    };
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  created() {
    this.$http.formEnterService
      .printForms({ projectId: this.$route.params.projectId })
      .then((res) => {
        this.formTitle = res.data.projectName;
        this.templateForm = res.data.linesData[0].oneLineData;
      })
      .catch((err) => {
        this.$message({
          type: 'error',
          message: '没有找到此表单数据'
        });
      });
  },
  components: {
    'Print-preview': PrintPreview
  },
  methods: {
    print() {
      this.isShowPrintBtn = false;
      this.$nextTick(() => {
        var bdhtml = window.document.body.innerHTML; //获取当前页的html代码
        document.title = '中环康源信息技术有限公司';
        var printHtml = `<ul>${this.$refs.printBox.innerHTML}</ul>`;
        window.document.body.innerHTML = printHtml; //需要打印的页面
        window.document.body.style.overflow = 'auto';
        window.document.body.style.height = 'auto';
        window.print();
        window.document.body.innerHTML = bdhtml; //还原界面
        document.title = '表单打印';
        location.reload();
      });
    }
  }
};
</script>

<style>
@media print {
  .page-break {
    page-break-after: always !important;
  }
  /* @page {
    size: auto;
    margin: 10px;
  } */
}

.printPreview-box {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 15px 0px;
  background: #f0f0f0;
  overflow-y: auto;
  font-family: 'MicrosoftYaHei';
}

.print-box {
  width: 800px;
  margin: auto;
  padding-bottom: 15px;
  background: #fff;
  min-height: 97%;
}

.print-top {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  margin: auto;
  box-sizing: border-box;
  padding: 0 10px;
  border-bottom: 1px solid #26beff;
}

.print-top .title {
  font-size: 18px;
  font-weight: bold;
  color: #343a45;
}
</style>
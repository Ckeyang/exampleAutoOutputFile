/*
 * @Author: yinjie 
 * @Date: 2018-07-17 09:57:02 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-11-13 15:34:35
 */

<template>
  <div class="content-warp">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="关键字" label-width="70px">
            <el-input v-model="form.keyWords" placeholder="请输入词条关键字" size="small"  @keyup.enter.native="searchBtn" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col class='search-btn-box btn-float_right'>
          <el-button type="primary" size="small"  icon="el-icon-search" @click="searchBtn">搜索</el-button>
          <el-button size="small"  icon="el-icon-refresh" @click="refreshBtn">重置</el-button>
        </el-col>
      </template>
    </search-box>
    <div class="regulation-tb box-style_common" id="mathJax-box">
      <div class="tools-bar_common">
        <h5 class="table-title">词条</h5>
      </div>
      <vxe-table :data="tableData"
      style="width: 100%" 
      :max-height='winHeight - 326'
      show-header-overflow
      highlight-hover-row>
        <vxe-table-column field="serialNumber" width="80" title="序号">
        </vxe-table-column>
        <vxe-table-column field="type" title="类型" width="100">
        </vxe-table-column>
        <vxe-table-column field="catalog" title="目录" width="100">
        </vxe-table-column>
        <vxe-table-column title="内容">
          <template slot-scope="scope">
            <div v-html="scope.row.content"></div>
          </template>
        </vxe-table-column>
      </vxe-table>
      <pagniation :totalPage="totalPage" :totalNum="totalNum" :currentPage='form.current' @changePage="handleChangePage" ></pagniation>
    </div>
  </div>
</template>
<script>
import pagniation from '@/components/tools/Pagniation';
import preview from '@/components/tools/Preview.vue';
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters } from 'vuex';
export default {
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(['checkAuth'])
  },
  name:'standardWords',
  data() {
    return {
      form: {
        keyWords: '',
        current:0,
        pageSize:30,
      },
      tableData:[],
      totalPage:0,
      totalNum:0
    };
  },
  components: {
    pagniation,
    preview,
    SearchBox
  },
  //初始化数据]
  activated() {
    //转化mathJax文本
    this.$nextTick(() => {
      this.$mathJax();
    });
    if (this.routerData !== this.$route.params.id) {
      this.routerData = this.$route.params.id; //保存页面id
      this.refreshBtn();
    }
  },
  created(){
    //转化mathJax文本
    this.$nextTick(() => {
      this.$mathJax();
    });
    if (this.routerData !== this.$route.params.id) {
      this.routerData = this.$route.params.id; //保存页面id
      this.refreshBtn();
    }
  },
  methods: {

    //搜索
    searchBtn() {
      this.form.current = 0;
      this.getData();
    },
    //刷新
    refreshBtn() {
      this.form.keyWords = '';
      this.form.current = 0;
      this.getData();
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getData();
    },
    //获取词条列表
    getData() {
      const id = this.$route.params.id
      this.$http.standardService.getWordList({...this.form,dataId:id}).then((res) => {
        this.tableData = res.data.content;
        this.totalNum = res.data.totalElements;
        this.totalPage = res.data.totalPages;
        this.$nextTick(() => {
          this.$mathJax();
        });
      });
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
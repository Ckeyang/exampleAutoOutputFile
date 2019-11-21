<template>
  <div style="height:100%">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="关键字">
            <el-input
              v-model="form.customQuery.keyWords"
              placeholder="请输入关键字"
              clearable
              @keyup.enter.native="getDataList"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="advancedSerach(filterData)">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
        <filter-component
          v-model="filterData"
          :tableName="publicDataType"
          @advancedSerach="advancedSerach"
          :getOptionsFn="getOptionsFn"
          :columnKeys="columnKeys"
        />
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">{{publicDataType==='SAMPLING_RECORD'?'采样记录联动数据表':'防护用品联动数据表'}}</h5>
        <div style="float: right;">
          <el-button size="small" icon="iconfont icon-daoru" @click="importlist">导入</el-button>
          <el-dropdown size="small">
            <el-button size="small" icon="iconfont icon-daochu">导出</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="exportTemplate">导出模板</el-dropdown-item>
              <el-dropdown-item @click.native="exportList">导出数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <data-sort :dataList="form.columns" :tableName="publicDataType" @refreshData="getDataList(true)" />
          <dynamic-display-column :dataList="form.columns" :tableName="publicDataType" @refreshData="getDataList(true)" />
        </div>
      </div>
      <el-table :data="dataList" :max-height="winHeight - 330" style="width:100%">
        <template slot="empty">
          <br />
          <br />
          <img src="@/assets/empty.png" />
          <br />
          <span>暂无数据</span>
          <br />
          <br />
          <br />
          <br />
        </template>
        <el-table-column v-for="item in getRealTitle()" :key="item.id" :label="item.filedName" :prop="item.filedKey" show-overflow-tooltip>
          <template slot-scope="scope">
            <i
              v-if="typeof scope.row[item.filedKey] === `object` && scope.row[item.filedKey].defaultValue"
              class="iconfont icon-T"
              style="color:#58AFDB"
            ></i>
            {{ typeof scope.row[item.filedKey] === "object" ? scope.row[item.filedKey].value : scope.row[item.filedKey] }}
          </template>
        </el-table-column>
      </el-table>
      <pagniation
        :totalPage="totalPage"
        :currentPage="form.current"
        :totalNum="totalNum"
        @changePage="handleChangePage"
      ></pagniation>
    </div>
    <import-excle @importExcleData="importExcleData" type="EXCEL" ref="importExcle"></import-excle>
  </div>
</template>
<script>
import commonDatabase from "./commonDatabase.js";
import SearchBox from "@/components/tools/searchBox.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import importExcle from "@/components/tools/ImportExcle.vue";
import dataSort from "@/components/tools/dataSort/index.vue";
import filterComponent from "@/components/tools/filterComponent/index.vue";
import dynamicDisplayColumn from "@/components/tools/dynamicDisplayColumn/index.vue";
export default {
  name: 'database',
  data() {
    return {
      totalPage: 0,
      totalNum: 0,
      dataList: [],
      filterData: [],
      form: { pageSize: 30, current: 0, customQuery: { keyWords: "", componentId: this.$route.params.id }, columns: [] },
      curId: this.$route.params.id,
      publicDataType: this.$route.params.publicDataType,
      titleList: []
    };
  },
  mixins: [commonDatabase],
  watch: {
    $route(val) {
      this.curId = val.params.id;
      this.publicDataType = val.params.publicDataType;
      this.form.customQuery.componentId = val.params.id;
    }
  },
  components: { SearchBox, pagniation, dataSort, filterComponent, dynamicDisplayColumn, importExcle },
  created() {
    this.getTitleList();
    this.getDataList();
  },
  methods: {
    getTitleList() {
      this.$http.userService.getUserDisplaySortTableHead({ name: this.publicDataType }).then(res => {
        this.titleList = res.data.fieldConfigs;
        this.form.columns = res.data.fieldConfigs.map((item, i) => {
          item.weight = i;
          item.sort = item.sort || "ASC";
          return item;
        });
        // 获取数据
        // this.getContents();
      });
      // this.$http.commonDatabaseService.getMethodsStructure({ publicDataType: this.publicDataType }).then(res => {
      //   this.titleList = res.data;
      //   this.form.columns = res.data.map((item, i) => {
      //     item.weight = i;
      //     item.sort = item.sort || "ASC";
      //     return item;
      //   });
      // });
    },
    //导入excel返回的url
    importExcleData(url) {
      this.isUpload = true;
      this.$http.commonDatabaseService
        .importTemplate({
          componentId: this.curId,
          excelUrl: url,
          publicDataType: this.publicDataType
        })
        .then(res => {
          this.$message({
            type: "success",
            message: "导入成功"
          });
          this.getDataList(true);
        });
    },
    importlist() {
      this.$refs.importExcle.dialogVisible = true;
    },
    exportList() {
      this.$http.commonDatabaseService.exportData({ dataType: this.publicDataType }).then(res => {
        window.open(res.data);
      });
    },
    exportTemplate() {
      this.$http.commonDatabaseService.exportTemplate({ excelTemplateType: this.publicDataType }).then(res => {
        window.open(res.data);
      });
    },
    getRealTitle() {
      return this.titleList.filter(item => {
        if (item.displayable) {
          return item;
        }
      });
    },
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    getDataList(flag = false, filterColumns) {
      if (flag) {
        this.form.current = 0;
      }
      const { current, pageSize, customQuery } = this.form;
      const params = {
        current,
        pageSize,
        customQuery
      };
      params.columns = filterColumns || this.form.columns;
      if (this.publicDataType === "SAMPLING_RECORD") {
        this.$http.commonDatabaseService.getSamplingLinkageByParamsWithPage(params).then(res => {
          this.dataList = res.data.content;
          this.totalPage = res.data.totalPages;
          this.totalNum = res.data.totalElements;
        });
      } else {
        this.$http.commonDatabaseService.getDataLinkageByParamsWithPage(params).then(res => {
          this.dataList = res.data.content;
          this.totalPage = res.data.totalPages;
          this.totalNum = res.data.totalElements;
        });
      }
    },
    resetForm() {
      this.form.customQuery.keyWords = "";
      this.form.current = 0;
      this.getDataList();
    }
  }
};
</script>

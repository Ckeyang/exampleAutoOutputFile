<template>
  <div class="content-warp">
    <search-box :form='form'>
      <template slot='input'>
        <el-col :span='6'>
          <el-form-item label="标签筛选" label-width="80px">
            <el-select
              v-model="form.customQuery.labels"
              multiple
              filterable
              remote
              reserve-keyword
              collapse-tags
              size="medium"
              placeholder="请输入关键词"
              style="width:100%"
              :remote-method="getTags"
            >
              <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='6'>
          <el-button
            type='primary'
            size='small'
            icon='el-icon-search'
            @click='searchData'
          >搜索</el-button>
          <el-button
            size='small'
            icon='el-icon-refresh'
            @click='resetForm'
          >重置</el-button>
        </el-col>
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
          <div class="tools-bar_common">
            <h5 class="table-title">限值规定表-{{$route.params.name}}</h5>
            <div class="temp-box-btn">
              <data-sort :dataList='form.columns' :tableName='tableName' @refreshData="getData(true)" />
              <dynamic-display-column :dataList='form.columns' :tableName='tableName' @refreshData="getData(true)" />
            </div>
          </div>
          <vxe-table 
            style="width: 100%"
            v-show="showColumns.length"
            :max-height="winHeight - 370"
            v-loading='tableLoading'
            show-overflow
            show-header-overflow
            highlight-hover-row
            ref='vxeTable'
            border
            :optimization='{scrollY:{gt:200}}'
            >
            <vxe-table-column
              type="index"
              width="50"
              align="center"
              title="序号"
              fixed='left'>
            </vxe-table-column>
            <vxe-table-column
              :field="firstShowColumns.filedKey"
              min-width="150"
              align="center"
              :title="firstShowColumns.filedName"
              fixed='left'>
              <template slot-scope="scope" >
                <span>{{scope.row[firstShowColumns.filedKey].join(',')}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column 
            v-for="item of showColumns" 
            :key='item.filedKey'
            :field="item.filedKey"
            :title="item.filedName"
            min-width="160"> -->
            <template slot-scope="scope" >
              <span>{{filterType.includes(item.filedKey) ? scope.row[item.filedKey].join(',') : scope.row[item.filedKey]}}</span>
            </template>
            </vxe-table-column>
          </vxe-table>
          <pagniation
            :totalPage="totalPage"
            :totalNum="totalNum"
            :initPageSize='form.pageSize'
            :currentPage="form.current"
            @changePage="handleChangePage"
          ></pagniation>
        </div>
  </div>
</template>
<script>
import pagniation from "@/components/tools/Pagniation.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import dataSort from "@/components/tools/dataSort/index.vue";
import dynamicDisplayColumn from "@/components/tools/dynamicDisplayColumn/index.vue";
import { judgeIsChangeCurPage } from "../../../utils.js";
const tableNameType = {
  OCCUPATIONAL_HEALTH:'Limit_Regulation_Of_Occupational_Health',
  RADIATION_HEALTH:'Limit_Regulation_Of_Radiation_Health',
}
export default {
  components: { pagniation, SearchBox, dataSort, dynamicDisplayColumn },
  name: 'limitRegulationForm',
  data() {
    return {
      form:{
        customQuery:{
          labels:[],
        },
        columns:[],
        current: 0,
        pageSize: 30
      },
      firstShowColumns:{},
      filterType:['materialLabelIds','materialLabelNames','industryLabelIds', 'industryLabelNames','customLabelIds', 'customLabelNames'],
      tagList:[],
      tableTitle:'',
      tableLoading:false,
      totalPage: 0,
      totalNum: 0,
    };
  },
  created(){
    this.getData(true);
    this.getTags();
  },
  computed:{
    showColumns(){ // 显示的表头
      const columns = this.form.columns.filter(item => item.displayable)
      this.firstShowColumns = columns.length && this.filterType.includes(columns[0].filedKey) ? columns.shift() : {}
      return columns
    },
    tableName(){
      return tableNameType[this.$route.params.limitValueCategory] || ''
    }
  },
  methods: {
    getData(init = false){
      if(init){
        this.getTableHeade()
      }else{
        this.getContents()
      }
    },
    // 获取数据
    getContents(){
      const {limitValueCategory, evaluationCategory} = this.$route.params
      this.$http.paramterService.getRestrictiveFormList(limitValueCategory, evaluationCategory, this.form).then(res=>{
        this.$refs.vxeTable.reloadData(res.data.content || [])
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      }).finally(() =>{
        this.tableLoading = false;
      })
    },
    // 获取配置设置以及表头
    getTableHeade(){
      // 获取表头以及显示，排序配置
      this.tableLoading = true;
      this.$http.userService.getUserDisplaySortTableHead({name: this.tableName}).then(res =>{
        this.form.columns = res.data.fieldConfigs.map((item,i) => {
          item.weight = i;
          item.sort = item.sort || 'ASC'
          return item
        })
        // 获取数据
        this.getContents()
      })
    },
    searchData(){
      this.form.current = 0;
      this.getData()
    },
    resetForm(){
      this.form.customQuery.labels = []
      this.searchData()
    },
    getTags(query) {
      if (query) {
        this.$http.labelBankService.getLabel({ keywords: query }).then(res => {
          this.tagList = res.data;
        });
      } else {
        this.tagList = [];
      }
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getData();
    },
  }
};
</script>
<style scoped>
</style>

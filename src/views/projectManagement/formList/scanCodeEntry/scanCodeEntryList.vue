<template>
<div style="height:100%;background:#F0F3F5">
  <pageHeader>
    <template slot="title">
      <span>{{$route.params.companyName}}</span>
      <span class='header-title'>{{$route.params.entrustNumber}}</span>
    </template>
    <template slot="button">
      <el-button
        type="primary"
        class="header-button--primary"
        size="small"
        @click="backScanCodeEntryPage"
        v-show="isCheckAll"
      >返回扫码录入</el-button>
      <el-button
        type="primary"
        class="header-button--primary"
        size="small"
        @click="$router.push('/projectManagement/formList/proceed')"
        v-show="!isCheckAll"
      >完成录入</el-button>
    </template>
  </pageHeader>
  <div class="middle-box">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="8" v-if="!isCheckAll">
          <div class="scan-code-form">
            <div class="left-box">
              <div class="code-box" v-if='searchMode === "HAND"'>
                <i class="iconfont icon-sousuo"></i>
                <span>搜索</span>
              </div>
              <div class="code-box" v-show='searchMode === "SCAN_CODE"'>
                <i class="iconfont icon-i-saoyisao"></i>
                <span>扫一扫</span>
              </div> 
              <div class="arrow-box">
                <i class="icon-i-shangyitiao iconfont" @click='toggleSearchMode("SCAN_CODE")' ></i>
                <i class="icon-i-xiayitiao iconfont" @click='toggleSearchMode("HAND")' ></i>
              </div>
            </div>
            <el-input v-model="form.codeNumber" style="max-width:300px;" ref='searchInput' placeholder="请输入扫码内容" clearable @keyup.enter.native='getFormDataByScanCode' size='small' v-focus='!dialogVisible'></el-input>
            <el-button type="primary" size="small" icon="el-icon-search" @click="getFormDataByScanCode"  style="margin-left:15px;" v-show='searchMode === "HAND"'>搜索</el-button>
          </div>
        </el-col>
        <el-col :span="6" v-show="isCheckAll">
          <el-form-item label="关键字" label-width="60px">
            <el-input v-model="form.keyWords" placeholder="请输入关键字"  size='small' @keyup.enter.native='searchData' clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col class='search-btn-box' v-show="isCheckAll">
          <el-button type="primary" size="small" icon="el-icon-search" @click="searchData" >搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm" >重置</el-button>
        </el-col>
        <filter-component 
        v-model="filterData" 
        v-if="isCheckAll" 
        tableName='SCAN_CODE_ENTEY' 
        :searchNum='5' 
        :projectId='$route.params.projectId'
        :getOptionsParams='getOptionsParams'
        @advancedSerach='advancedSerach' 
        :columnKeys='columnKeys'  />
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">{{tableTitle}}</h5>
        <div>
          <el-button size="small" icon="iconfont icon-xiugai" @click="batchEdits" v-show="isCheckAll" :disabled="!checkboxTrIds.length">批量编辑</el-button>
          <el-button size="small" icon="iconfont icon-chakan" @click="isCheckAll = true" v-show="!isCheckAll">查看全部数据</el-button>
          <data-sort v-show="isCheckAll" :componentId='componentId' @refreshData="getScanCodeAllData()" />
          <table-head-show-list 
            :trDataList='trList' 
            :componentParentId='componentId'
            @checkTrChange='checkTrChange'/>
        </div>
      </div>
      <div class="table-box form_table"  v-loading='tableLoading'>
        <vxe-table
          :data="tdData"
          :key="tableKey"
          style="width:100%"
          v-if="!isShowEmptyTips"
          :max-height='winHeight - 326'
          show-overflow
          highlight-hover-row
          ref='scanCodeformTable'
          @select-change="handleSelectionChange"
          @select-all="handleSelectionChange"
          :row-class-name="tableRowClassName"
          row-id='trId'
          :select-config='{strict:true,checkRowKeys:[checkboxTrIds], checkMethod}'
          :optimization='{scrollY:{gt:100}}'
          header-row-class-name="cus-header-class">
          <vxe-table-column type="selection" width="60" align="center" fixed='left' :selectable='tableSelectable' v-if="isCheckAll"></vxe-table-column>
          <vxe-table-column
            v-for="(item) of isShowTr"
            :key="item.id"
            :title="item.name"
            min-width="200">
            <template slot-scope="scope" v-if="scope.row[item.id]">
              <div v-if="item.type === 'ADDRESSBOX'">{{scope.row[item.id] ? renderAddress(scope.row[item.id].addressValue) :'' }}</div>
              <div v-else-if="item.type === 'TEXTBOX'">{{scope.row[item.id] ? scope.row[item.id].stringValue : ''}}</div>
              <div v-else-if="item.type === 'IMAGEBOX'">
                <span v-if='!scope.row[item.id].imageValue.length || !scope.row[item.id].imageValue[0].url'>暂无图片</span>
                <el-button size="mini" type="primary" v-else plain @click="previewImg(scope.row[item.id].imageValue)">查看图片</el-button>
              </div>
              <div v-else-if="item.type === 'FILEBOX' || item.type === 'VIDEO'">
                  <span v-if='!scope.row[item.id].imageValue.length || !scope.row[item.id].imageValue[0].url'>{{item.type === 'FILEBOX' ? '暂无文件' : '暂无视频'}}</span>
                  <el-popover
                    placement="bottom"
                    width="200"
                    v-else
                    popper-class="file-popover"
                    trigger="click">
                  <ul class="file-box"  >
                    <li v-for="file in scope.row[item.id].imageValue" :key='file.url'>
                      <a :href="file.url" :title='file.name||""' target="_blank" :download='file.name||""' >
                        {{scope.row[item.id] ? file.name : ''}}
                      </a>
                    </li>
                  </ul>
                  <el-button slot="reference" size='mini' type="primary" plain>{{item.type === 'FILEBOX' ? '查看文件' : '播放视频'}}</el-button>
                  </el-popover>
              </div>
              <div v-else-if="item.type === 'CHECKBOX' || item.type === 'CASCADER' || item.type === 'MULTIPLE_COMBOBOX'">
                {{checkBoxAllowMoreValue(scope.row[item.id])}}
              </div>
              <div v-else-if="item.type === 'RADIOBOX' || item.type ==='COMBOBOX' || item.type === 'DATEPICKER'">
                {{scope.row[item.id] ? scope.row[item.id].stringValue : ''}}
              </div>
              <div v-else-if="item.type === 'DYNAMIC_CHOICE'" >
                {{scope.row[item.id] ? dynamicChoiceValues(scope.row[item.id].dynamicChoiceValues) : ''}}
              </div>
              <div v-else-if="item.type === 'INDUSTRY'" >
                {{scope.row[item.id] ? scope.row[item.id].industryList[0].label : ''}}
              </div>
              <div v-else-if="item.type === 'CUSTOMBOX'" style="width:210px">
                <div
                  class="custom-box"
                  :class="{'activeCustomBox':scope.row[item.id].isInvolve}">
                  <span
                    v-show="scope.row[item.id].isInvolve"
                    style="margin:0 6px;font-weight:normal">
                    {{scope.row[item.id].dataNumber}}
                  </span>
                  <span @click.stop>
                    <el-switch
                      v-model="scope.row[item.id].isInvolve"
                      class="small-switch"
                      disabled
                      style="position:relative;top:-1px">
                    </el-switch>
                  </span>
                  <span v-if="!scope.row[item.id].isInvolve" style="margin-left:5px;">未涉及</span>
                </div>
              </div>
              <div v-else-if='!item.type && item.id.indexOf("userName") > -1'>{{scope.row[item.id].stringValue || ''}}</div>
              <div v-else-if='!item.type'>{{Number(scope.row[item.id].stringValue) | formatDate}}</div>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" width="230" align="center" style="background: #fff;text-align: right;" fixed='right'> 
            <template slot-scope="scope">
              <div class="operation-icon">
                <i
                  class="iconfont icon-i-zuofei"
                  v-if="scope.row.valid"
                  @click='handleNullifyData(scope.row.trId, "unvalid")'
                  >作废</i>
                <i
                  class="iconfont icon-i-quxiaozuofei"
                  v-if="!scope.row.valid"
                  @click='handleNullifyData(scope.row.trId, "valid")'
                >取消作废</i>
                <i
                  class="iconfont icon-xiugai"
                  v-if="scope.row.valid"
                  @click="editForm(scope.row.trId, 'EDIT')"
                >编辑</i>
                <i
                  class="iconfont icon-xiugai"
                  v-if="scope.row.valid"
                  @click="editForm(scope.row.trId, 'COPY')"
                >添加平行样</i>
                <popoverTips v-if="!scope.row.valid">
                  <ul class='popover-tips-box'>
                    <li><div class="tips-item-title"><span>作废原因</span>：</div><p class="tips-item-content">{{scope.row.validStatusChangeRecord.reason}}</p></li>
                    <li><div class="tips-item-title"><span>作废人</span>：</div><span class="tips-item-content">{{scope.row.validStatusChangeRecord.operatePerson}}</span></li>
                    <li>
                      <div class="tips-item-title"><span>作废时间</span>：</div>
                      <span class="tips-item-content">
                        {{Number(scope.row.validStatusChangeRecord.operateTime) | formatDate('yyyy-MM-dd hh:mm')}}
                      </span>
                    </li>
                  </ul>
                </popoverTips>
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
        <pagniation :totalPage="totalPage" :totalNum="totalNum" :currentPage='current' @changePage="handleChangePage" ></pagniation>
      </div>
      <div v-if="isShowEmptyTips" class="empty-box">
        <img src="@/assets/empty.png" alt="暂无支持扫码搜索的控件">
        <p>暂无支持扫码录入的控件</p>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      v-el-drag-dialog
      :title="dialogTitle"
      @close='closeDialog'
      top='10vh'
      :width="componentValue.length > 1 ? '695px' : '600px'">
      <span slot="title" v-if="dialogType === 'SCAN_CODE'"> <span class='dialog-title'>{{dialogTitle}}</span> - <span class="cur-page">{{curIndex + 1}}</span>&nbsp;/&nbsp;{{componentValue.length || 1}}</span>
      <scan-code-entey-form 
        :componentData='componentData' 
        :curIndex='curIndex' 
        :totalNum='componentValue.length' 
        @handleChange='changeEditFormItem'
        @checkRules='handleCheckRules' />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size='medium'>取 消</el-button>
        <el-button type="primary" @click="saveData" size='medium' :loading="saveLoading">{{componentValue.length > 1 ? '保存所有':'保 存'}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="nullifyDialogVisible"
      :close-on-click-modal="false"
      v-el-drag-dialog
      :title="validType === 'unvalid'?'作废数据':'取消作废'"
      @close='closeNullifyDialog'
      top='10vh'
      width="30%">
      <nullify-data :trId='checkCurTrId' :type='validType' ref='nullifyData' interfaceType='scanCode' @refreshData='handleRefreshData' />
      <span slot="footer" class="dialog-footer">
        <el-button @click="nullifyDialogVisible = false" size='medium'>取 消</el-button>
        <el-button type="primary" @click="submitNullifyResion" size='medium' >确 定</el-button>
      </span>
    </el-dialog>
    <batch-edits ref="batchEdits" submitType='DETECTION_DATA' @refreshData="getScanCodeAllData()"/>
    <preview-img :previewData="previewData" :visible.sync='previewimgVisible'></preview-img>
  </div>
</div>
</template>
<script>
import pagniation from "@/components/tools/Pagniation.vue";
import SearchBox from "@/components/tools/searchBox.vue"; 
import tableHeadShowList from "@/components/tools/tableHeadShowList.vue";
import scanCodeEnteyForm from "./scanCodeEnteyForm.vue";
import batchEdits from "@/views/template/templatePreview/components/middle/components/batchEdits.vue";
import pageHeader from "@/components/tools/pageHeader.vue";
import previewImg from "@/components/tools/PreviewImg.vue";
import nullifyData from "@/views/template/templatePreview/components/middle/components/nullifyData.vue";
import formValidate from "@/views/template/templatePreview/components/middle/components/validate.js";
// import parsingRule from "@/components/tools/parsingRule.js";
import popoverTips from "@/components/tools/popoverTips.vue";
import dataSort from "@/views/template/templatePreview/components/middle/components/dataSort.vue";
import filterComponent from "@/components/tools/filterComponent/index.vue"; // 筛选组件
import FormRulesModule from "@/components/tools/applyRules.js"; // 规则执行模块
import { debouce } from "@/utils.js";
import { mapGetters } from "vuex";
let formRulesModule ;
export default {
  components:{ pagniation, SearchBox, tableHeadShowList, scanCodeEnteyForm, batchEdits, pageHeader, previewImg, nullifyData, popoverTips, dataSort, filterComponent},
  name:'scanCodeEntry',
  data(){
    return {
      form:{
        codeNumber:'',
        keyWords:'',
      },
      filterData:[],
      columnKeys:[],
      saveLoading:false,
      searchMode:'SCAN_CODE', // SCAN_CODE 扫码搜索 \ HAND 手动搜索
      tableKey:0,
      componentId:null, //该组件的id 
      checkboxTrIds:[], 
      checkCurTrId:null, // 编辑时选择的行id
      projectId:null, // 项目id 
      dialogVisible:false, // 扫码录入弹框
      validType:'unvalid',
      nullifyDialogVisible:false, // 作废数据弹框
      previewimgVisible:false, //图片预览弹框
      formId:'', // 表格表单的id
      current:0,
      pageSize:30,
      totalPage:0,
      totalNum:0,
      trList:[],
      tdData:[],
      tableComponentValue:[], // 表格数据集合
      tableLoading:false,
      componentData:[], // 表单结构
      componentValue:[], // 编辑表单的数据集合
      curIndex:0, // 当前显示的表单项索引
      dialogType:'SCAN_CODE', // SCAN_CODE 扫码、 EDIT 编辑 、 COPY 复制
      isCheckAll:false, // 是否查看全部
      isShowEmptyTips:false, // 是否显示空数据图片
      previewData: {
        dataList: [], //预览图片的数据
        currentIndex: 0 //当前选中的img
      },
    }
  },
  computed:{
    isShowTr(){
      let isShowList = this.trList.filter(item => item.display)
      isShowList.length && this.tableKey++ ; //没有表头不需要重绘
      return isShowList
    },
    queryDataIds(){
      return this.$route.query.queryDataIds ? JSON.parse(this.$route.query.queryDataIds) : null
    },
    tableTitle(){
      return this.isCheckAll ? this.$route.query.queryDataIds ? '未填完整数据' :'扫码录入-全部数据':'上次录入数据'
    },
    getOptionsParams(){
      return {
        filterOptionsQueryType:'SAMPLED',
        ids:this.queryDataIds
      }
    },
    dialogTitle(){
      return this.dialogType === 'EDIT' ? '编辑数据' : this.dialogType === 'COPY' ? '复制数据' : '扫码录入'
    },
    // 权限验证getter
    ...mapGetters(["checkAuth"])
  },
  created(){
    this.projectId = this.$route.params.projectId
    if(this.queryDataIds){ // 从数据处理过来
      this.isCheckAll = true
      this.getQueryDatas()
    }else{
      this.getTableData()
    }
  },
  mounted(){
    document.body.addEventListener('keydown', this.addKeyDownEvent)
    formRulesModule = new FormRulesModule() // 构建规则实列，用于保存规则初始化信息、执行规则等相关操作
  },
  watch:{
    isCheckAll(val){
      this.refreshData();
    }
  },
  destroyed(){
    formRulesModule = null; // 销毁规则模块
  },
  methods:{
    // 高级搜索
    advancedSerach(data) {
      this.current = 0;
      this.getScanCodeAllData(data)
    },
    // 设置可筛选的字段
    setColumnKeys(){
      const validateFileds = ['TEXTBOX','RADIOBOX','CHECKBOX','COMBOBOX','CASCADER','MULTIPLE_COMBOBOX','INDUSTRY', 'ADDRESSBOX'] // 需要过滤的类型
      const specialType = ['INDUSTRY','CHECKBOX','MULTIPLE_COMBOBOX'] // 为包含的类型
      this.columnKeys = this.trList.filterMap(item => {
        if(validateFileds.includes(item.type) && item.id.indexOf('zhky-formData') === -1){
          return {key:item.id, name:item.name, separator:specialType.includes(item.type) ? 'CONTAIN' : 'EQUAL'}
        }
        return false
      })
    },
    // 获取上一次录入的数据
    getTableData(){
      // 获取上一次表格数据
      const getLastScanCodeData = this.$http.laboratorySamplingService.getLastScanCodeData({ 
        projectId:this.projectId,
        userID:sessionStorage.userId,
        current:this.current,
        pageSize:this.pageSize
      })
      this.tableLoading = true;
      // 获取表格结构
      const getTableComponent = this.$http.laboratorySamplingService.getTitleList(this.projectId)
      let self = this
      Promise.all([getTableComponent, getLastScanCodeData]).then(res => {
        self.totalNum = res[1].data.totalElements;
        self.totalPage = res[1].data.totalPages;
        self.tableComponentValue = res[1].data.content || [];
        self.trList = self.getTrList(res[0].data.formComponents, res[0].data.dynamicDisplayColumnFlag);
        self.isShowEmptyTips = !self.trList.length
        self.splicingComponentValue(true, res[0].data.formComponents);
        self.componentData = res[0].data.formComponents;
        // self.dialogTitle = res[0].data.name;
        self.componentId = res[0].data.componentId;
        self.$nextTick(() => {
          self.initRules(res[0].data.rules, res[0].data.formComponents)
        }); 
      }).catch((err)=>{
        self.isShowEmptyTips = true
      }).finally(()=>{
        this.tableLoading = false;
      })
    },
    // 获取未填完整数据
    getQueryDatas(){
      // 获取表格结构
      const getTableComponent = this.$http.laboratorySamplingService.getTitleList(this.projectId)
      const getScanCodeAllData = this.$http.laboratorySamplingService.getScanCodeAllData({ 
        projectId:this.projectId,
        current:this.current,
        pageSize:this.pageSize,
        keyWords:this.form.keyWords,
        queryDataIds:this.queryDataIds,
        filter:{
          listData:[]
        }
      })
      let self = this
      Promise.all([getTableComponent, getScanCodeAllData]).then(res => {
        self.totalNum = res[1].data.totalElements;
        self.totalPage = res[1].data.totalPages;
        self.tableComponentValue = res[1].data.content || [];
        self.trList = self.getTrList(res[0].data.formComponents, res[0].data.dynamicDisplayColumnFlag);
        self.isShowEmptyTips = !self.trList.length
        self.splicingComponentValue(true, res[0].data.formComponents);
        self.componentData = res[0].data.formComponents;
        // self.dialogTitle = res[0].data.name;
        self.componentId = res[0].data.componentId;
        self.$nextTick(() => {
          self.initRules(res[0].data.rules, res[0].data.formComponents)
        });
      }).catch((err)=>{
        self.isShowEmptyTips = true
      })
    },
    // 初始化规则结构
    initRules(rules, componentData){
      if(!formRulesModule.componentRulesMap.size){
        formRulesModule.transformRules(rules)
        //保存初始的控件状态
        formRulesModule.saveOriginalComponentState(componentData)
      }
    },
    // 扫码查询数据
    getFormDataByScanCode(){
      this.$http.laboratorySamplingService.scanCodeEntry({ projectId:this.projectId, sampleSerialNumber:this.form.codeNumber }).then(res=>{
        this.componentValue = res.data || []
        if(!res.data || !res.data.length){
          this.$alertComponent(`没有找到条形码：${this.form.codeNumber}的相关信息！`,'',{
            confirmButtonText:'确定',
          }).then(()=>{
            this.$refs.searchInput.focus()
            this.form.codeNumber = ''
          })
          return 
        }
        this.dialogType = 'SCAN_CODE' // 扫码录入
        this.changeEditFormItem(0)
      })
    },
    // 获取上一次扫码数据
    getLastScanCodeData(){
      this.checkboxTrIds = [];
      this.tableLoading = true;
      this.$http.laboratorySamplingService.getLastScanCodeData({ 
        projectId:this.projectId,
        userID:sessionStorage.userId,
        current:this.current,
        pageSize:this.pageSize
      }).then(res =>{
        this.totalNum = res.data.totalElements;
        this.totalPage = res.data.totalPages;
        this.tableComponentValue = res.data.content;
        this.splicingComponentValue(true, this.componentData);
      }).finally(()=>{
        this.tableLoading = false;
      })
    },
    // 添加键盘事件
    addKeyDownEvent(e){
      if(e.keyCode === 13 && this.dialogVisible){
        this.saveData()
      }
    },
    //获取全部数据
    getScanCodeAllData(filterData = []){
      this.checkboxTrIds = [];
      this.tableLoading = true;
      this.$http.laboratorySamplingService.getScanCodeAllData({ 
        projectId:this.projectId,
        current:this.current,
        pageSize:this.pageSize,
        keyWords:this.form.keyWords,
        queryDataIds:this.queryDataIds,
        filter:{
          listData:filterData
        }
      }).then(res =>{
        this.totalNum = res.data.totalElements;
        this.totalPage = res.data.totalPages;
        this.tableComponentValue = res.data.content || []
        this.splicingComponentValue(true, this.componentData)
        const t = setTimeout(()=>{
          this.setColumnKeys()  // 设置可筛选的字段
          clearTimeout(t)
        }, 1500) 
      }).finally(()=>{
        this.tableLoading = false
      })  
    },
    searchData(){
      this.current = 0;
      this.getScanCodeAllData()
    },
    resetForm(){
      this.form.keyWords= '';
      this.current = 0;
      this.form.codeNumber = '';
      this.getScanCodeAllData()
    },
    // 表格编辑数据
    editForm(id, type){ 
      this.dialogType = type 
      this.checkCurTrId = id
      const obj = this.tableComponentValue.find(item => item.id === id)
      if(obj){
        this.splicingEditForm(obj, true)
        this.checkCurTrId = id
      }
    },
    // 改变编辑数据项
    changeEditFormItem(index){
      if(!this.formDataValidate(this.componentData)){
        return;
      }
      this.splicingEditForm(this.componentValue[index])
      this.curIndex = index
    },
    //获取表格选择项
    handleSelectionChange({selection}) {
      this.checkboxTrIds = selection.map(item => item.trId);
    },
   /**
    * @param { Array } values 该条数据 
    * @param { Bollean } isEdit 是否为表格行点击编辑, 表格行编辑时需要重新创建formValue对象
    */
    // 编辑表单时组装数据
    splicingEditForm(values,isEdit = false){  
      this.componentData = this.componentData.map(item => {
        let tempFormValue = values.dataAndAttributeDtoList.find(item1 => item1.controlId === item.id );
        if(tempFormValue){
          if(isEdit){
            item.formValue = JSON.parse(JSON.stringify(tempFormValue.formValue)) // 保存原始的value值，用于取消后的还原
          }else{
            item.formValue = tempFormValue.formValue   // 引用对象地址，修改后的值会同步在该对象，用于保存
          }
        }
        return item;
      });
      formRulesModule.implementApplys(null, this.componentData) // 打开窗口执行一次规则
      this.dialogVisible = true
    },
    //表格数据组装数据
    splicingComponentValue(isRefreshTable = true, componentData) {
      if (!this.tableComponentValue.length) {
        this.tdData = [];
        this.tableLoading = false
        return;
      }
      let tempData = []; //临时数组
      this.tableComponentValue.map(item => {
        let tempObj = {}; //临时对象
        for (let item1 of componentData) {
          for (let item2 of item.dataAndAttributeDtoList) {
            if (item2.controlId === item1.id) {
              if (item1.componentType === "CUSTOMBOX") {
                tempObj[item1.id] = {
                  dataNumber: item2.dataNumber, //该组件下的数据条数
                  name: item1.componentAttr.tag,
                  isInvolve: item2.involved, //是否涉及
                  id: item1.id, //自定义组件的id
                };
              } else {
                tempObj.connectionRuleId = item.connectionRuleId; //该行数据的关联规则id
                tempObj.batchAdaptationRuleId = item.batchAdaptationRuleId; //该行数据的适配规则id
                tempObj.formDataSourceType = item.formDataSourceType; //该行数据的适配规则id
                tempObj[item1.id] = item2.formValue;
                tempObj.addUserId = item.addUserId; //该行数据的用户id
              }
              tempObj.trId = item.id; // 该行数据的id
              tempObj.dataId = item.dataId; // 该行数据被引用的上级数据的行id
              tempObj.isQuoted = (item.dataId && item.dataId !=='0'); // 是否被引用
              tempObj.valid = item.valid; // 是否作废
              tempObj.validStatusChangeRecord = item.validStatusChangeRecord; // 作废原因
              tempObj.connectionFormDataIds = item.connectionFormDataIds; // 已关联的数据id
              tempObj.batchAdaptationDataList = item.batchAdaptationDataList; // 已关联适配的数据id
              break;
            }
          }
        }
        tempData.push(tempObj);
      });
      this.tdData = tempData;
      this.tableLoading = false
    },
    //表头列表
    getTrList(data, tableDisplayColumnFlag = false) {
      let count = 1; 
      return data.map(item => {
        let obj = {
          name: item.componentAttr.tag,
          type: item.componentType,
          id: item.id,
          display:item.display  //是否显示该表头
        };
        if(!tableDisplayColumnFlag){ // 是否设置了显示列
          if(item.componentType !== 'CUSTOMBOX'){
            obj.display = (count <= 5) // 没有设置则默认取前5列 + 所有组件
            count++
          }else{
            obj.display = true
          }
        }
        return obj
      });
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.pageSize = page.pageSize;
      this.current = page.currentPage - 1;
      this.refreshData();
    },
    closeDialog(){
      removeEventListener('keydown',this.addKeyDownEvent)
      this.form.codeNumber = ''
      this.checkboxTrIds = []
      this.checkCurTrId = null
      this.componentValue = []
    },
        // 作废数据、取消作废
    handleNullifyData(trId, type){
      this.nullifyDialogVisible = true,
      this.checkCurTrId = trId
      this.validType = type
    },
    // 提交作废数据 / 取消作废
    submitNullifyResion(){
      this.$refs.nullifyData.submit()
    },
    closeNullifyDialog(){
      this.$refs.nullifyData.reset()
    },
    // 保存数据
    saveData(){
      if(!this.formDataValidate(this.componentData)){
        return;
      }
      this.saveLoading = true
      let params = {}
      // 编辑数据的保存
      if(this.checkCurTrId){
        let componentValue = this.tableComponentValue.find(item => item.id === this.checkCurTrId)
        componentValue.dataAndAttributeDtoList = componentValue.dataAndAttributeDtoList.map(item => {
          this.componentData.map(item2 => {
            if(item.controlId === item2.id){
              item.formValue = JSON.parse(JSON.stringify(item2.formValue))
            }
            return item2
          })
          return item
        })
        params.listData = [componentValue]
      }else{
        // 扫码修改的保存
        params.listData = this.componentValue
      }
      if(this.dialogType === 'EDIT' || this.dialogType === 'SCAN_CODE'){
        this.$http.laboratorySamplingService.saveScanCodeEntryData(params).then(res =>{
          this.refreshData() // 刷新数据
          this.$message({
            message:'数据修改成功!',
            type:'success'
          })
          this.dialogVisible = false;
          this.dialogType = 'EDIT'
        }).finally(()=>{
           this.saveLoading = false
        })
      }else{
        this.$http.laboratorySamplingService.copyScanCodeEntryData(params.listData[0]).then(res =>{
          this.refreshData() // 刷新数据
          this.$message({
            message:'添加成功!',
            type:'success'
          })
          this.dialogVisible = false;
          this.dialogType = 'EDIT'
        }).finally(()=>{
           this.saveLoading = false
        })
      }
    },
    checkMethod ({ row }) {
      return row.valid
    },
    refreshData(){
      if(this.isCheckAll){
        this.getScanCodeAllData()
      }else{
        this.getLastScanCodeData()
      }
    },
    //校验数据
    formDataValidate(data){
      let errorMesg = []
      data.map(item => {
        const mesg = formValidate(item)
        mesg && errorMesg.push(...mesg)
        return item
      })
      if (errorMesg.length) {
        //显示错误信息
        let str = "";
        for (let item of errorMesg) {
          str += `<li>${item.name} : ${item.errorMesg}</li>`;
        }
        this.$message({
          dangerouslyUseHTMLString: true,
          duration: 3000,
          showClose: true,
          type: "error",
          message: `<ul style='line-height:20px;'>${str}</ul>`
        });
        return;
      }
      return true
    },
    //批量修改数据
    batchEdits() {
      const filterType= ['TEXTBOX','RADIOBOX','CHECKBOX','COMBOBOX','ADDRESSBOX','CASCADER','MULTIPLE_COMBOBOX','DYNAMIC_CHOICE','DATEPICKER'];
      let tempData = this.componentData.filterMap(item => {
        if(filterType.includes(item.componentType) 
          && 
          !item.id.includes('zhky-formData') 
          && 
          !item.componentAttr.primaryKey //过滤掉设置了主键的控件
          &&
          item.componentAttr.siteData // 现场字段
          ){  
          return {
            name:item.componentAttr.tag,
            id:item.id,
            disabled:false
          }
        }
      })
      this.$refs.batchEdits.openDialog(tempData, this.checkboxTrIds); //打开批量修改框
    },
    // 表格显示列设置
    checkTrChange(data){

    },
    // 切换录入搜索方式
    toggleSearchMode(type){
      this.searchMode = this.searchMode === 'SCAN_CODE' ? 'HAND':'SCAN_CODE'
      this.$refs.searchInput.focus()
    },

    //执行规则
    handleCheckRules: debouce(async function(fieldId, val){
      fieldId && formRulesModule.implementApplys(fieldId);
    }, 200),
    //返回扫码录入页面
    backScanCodeEntryPage(){
      this.isCheckAll = false;
    },
     // 多选框或者多选下拉框格式化数据
    checkBoxAllowMoreValue(data){
      let values = ''; 
      if(data){
        values = data.stringListValue.join(' \\ ')
        values = values + (data.stringListValue.length && data.stringValue ? ' \\ ' : '') + data.stringValue ; 
      }
      return values
    }, 
    //动态多选框
    dynamicChoiceValues(data) {
      return data.map(item => {
          if (item.otherValue && item.otherValue.length) {
            return `${item.choiceValue}(${item.otherValue
              .map(item2 => item2.value)
              .join("，")})`;
          }
          return item.choiceValue;
        })
        .join(" \\ ");
    },
    //渲染地址
    renderAddress(data) {
      return Object.values(data).join("");
    },
    //预览
    previewImg(data, curIndex = 0) {
      this.previewData.dataList = data;
      this.previewimgVisible = true
    },
    // 作废数据后刷新页面
    handleRefreshData(){
      this.refreshData()
      this.nullifyDialogVisible = false
    },
    // 已作废的数据不能选择
    tableSelectable(row){
      return row.valid // 是否作废
    },
    // 表格样式
    tableRowClassName({ row }) {
      if (this.checkboxTrIds.find(id => id === row.id)) {
        return 'checked-row';
      } 
      if (!row.valid) {
        return 'disabled-row'; // 已停用
      } 
      if (row.dataId ==="0") {
        return 'drlft-row'; // 游离数据
      }
      return '';
    },
  }
}
</script>

<style scoped>
.empty-box{
  text-align: center;
  padding: 15px;
  color: #BFBFBF;
  font-size: 12px;
}
.empty-box img{
  margin-bottom: 5px;
}
.middle-box{
  padding: 15px;
}
  .scan-code-form{
    display: flex;
    justify-content:flex-start;
  }
  .scan-code-form .left-box{
    line-height: 20px;
    margin:0 10px 0 0;
    color: #454545;
    display: flex;
    justify-content: space-between;
    border:1px solid #E0E0E0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  } 
  .scan-code-form .left-box .code-box{
    display: flex;
    margin: 0 15px;
    flex-direction: column;
    justify-content: center;
    min-width: 42px;
    text-align: center;
  }
  .scan-code-form .left-box .arrow-box{
    font-size: 13px;
    display: flex;
    width: 30px;
    flex-direction: column;
    justify-content: space-around;
  }
  .scan-code-form .code-box span{
    font-size: 14px;
    position: relative;
    top: 5px;
  }
  .scan-code-form .code-box .icon-i-saoyisao{
    font-size: 23px;
  }
  .scan-code-form .code-box .icon-sousuo{
    font-size: 20px;
  }
  .scan-code-form .left-box .arrow-box i{
    font-size: 12px;
    flex-grow: 1;
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    color: #1884CC;
    transition: all .1s;
    border:1px solid rgba(224,224,224,1);
  }
   .scan-code-form .left-box .arrow-box i:hover{
    color: #fff;
    background: #1884CC;
   }
  .scan-code-form .left-box .arrow-box .icon-i-shangyitiao,
  .scan-code-form .left-box .arrow-box .icon-i-xiayitiao{
    border-right: none;
    border-bottom:none;
  }
  .scan-code-form .left-box .arrow-box .icon-i-shangyitiao{
    border-top: none;
  }
  .search-box .scan-code-form >>> .el-input__inner {
    height: 62px;
    line-height: 62px;
  }
  .last-data-box{
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 5px 10px;
    border-bottom: 1px solid rgba(232,232,232,.6);
  }
  .last-data-box .title{
    font-weight:bold;
    font-size: 14px;
    line-height: 30px;
    color:rgba(89,89,89,1);
  }
  .cur-page{
    color: #107AC2;
  }
.file-box{
  line-height: 30px;
}
.file-box li{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 12px;
}
.file-box li:hover{
  background:#E6F9FF; 
}
.file-box li:hover a{
  color:#1d7fff;
  text-decoration: underline;
}
.file-box li a{
  color: #595959;
}
.custom-box {
  width: 90px;
  line-height: 31px;
  height: 30px;
  padding: 0 7px;
  background:rgba(255,255,255,1);
  border:1px solid rgba(232,232,232,1);
  border-radius: 4px;
  color: #BFBFBF;
}
.dialog-title{
  font-size: 15px;
  font-weight: bold;
  color: #1e2329;
}
</style>

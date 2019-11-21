<template>
  <div class="middle">
    <transition name="fade" mode="out-in">
      <ul
        class='box-style_common'
        style="height:100%;padding: 15px 34px;box-sizing:border-box;overflow-y: auto;"
        v-if="isBasic"
        v-loading='renderLoading'>
          <forms
            :model="item"
            v-for="(item,i) of fillableComponentData.concat(visibleComponentData)"
            :key="i"
            :isShowClear='true'
            :sortIndex="i"
            :isLoop="false"
            @handleApplyRules="checkRules"
          ></forms>
          <el-button
            type="primary"
            @click="editData"
            v-show="$route.params.action === 'edit' && componentData.length"
            size="medium"
          >保 存</el-button>
          <!-- <el-button
            type="primary"
            @click="saveBtn"
            v-show="$route.params.action === 'edit' && componentData.length"
            size="medium"
          >保 存</el-button> -->
      </ul>
    </transition>
    <search-box :form="searchForms" v-show="!isBasic" >
      <template slot="input">
        <el-col :span="6" >
          <el-form-item label="关键字">
            <el-input
              v-model="searchForms.keyWord"
              placeholder="回车查询关键字"
              size="small"
              @keyup.native.enter="searchData"
              @clear="searchData"
              clearable>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-button type="primary" size="small" icon="el-icon-search" @click="searchData">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm(true)">重置</el-button>
        </el-col>
        <filter-component v-model="filterData" :searchNum='5' tableName='FORM' :dataId='curTrId' @advancedSerach='advancedSerach' :columnKeys='columnKeys'  />
      </template>
    </search-box> 
    <div class='regulation-tb box-style_common' v-show="!isBasic" >
      <div class="tools-bar_common">
        <h5 class="table-title">{{ title }} <span class="tb-referenceText" :title="table_referenceText" v-if="table_referenceText">参考数据：{{table_referenceText}}</span></h5>
        <div style="display: flex;align-items: center">
            <el-button
                v-if='$route.params.action === "edit"'
                type="success"
                size="small"
                icon="iconfont icon-tianjia"
                @click="openDialog"
                :disabled="!isShowAddBtn || !assemblyInvolved"
              >新增数据</el-button>
        </div>
      </div>
      <div class="form-entey-toolbar">
        <div>
          <ul class="form-entey-left-toolbar" v-if="$route.params.action === 'edit'">
            <li v-show="curTrId">
              <el-button
                size="small"
                icon="iconfont icon-i-yinyong"
                @click="referenceData(curTrId, curId)">
                引用数据
              </el-button>
            </li>
            <li v-show="curTrId">
              <el-button
                size="small"
                icon="iconfont icon-i-quxiaoyinyong"
                :disabled="!checkboxTrId.length"
                @click="cancelReference">
                取消引用
              </el-button>
            </li>
            <li>
              <el-button
                size="small"
                icon="iconfont icon-xiugai"
                @click="batchEdits"
                :disabled="!checkboxTrId.length">批量修改</el-button>
            </li>
            <li>
              <el-button
                size="small"
                icon="iconfont icon-fuzhi"
                @click="batchCopy"
                :disabled="!checkboxTrId.length">
                批量复制
              </el-button>
            </li>
            <li>
              <el-button
                size="small"
                icon="iconfont icon-shanchu"
                @click="deleteTrData"
                :disabled="!checkboxTrId.length" >
                批量删除
              </el-button>
            </li>
            <li v-show="curTrId">
              <el-button
                size="small"
                icon="iconfont icon-i-fanhuishangyiji"
                @click="backUp(dataId)">
                返回上级
              </el-button>
            </li>
            <!-- <el-button
                  type="primary"
                  size="small"
                  icon="iconfont icon-xiazai"
                  @click="downloadTemplate"
                >下载模板</el-button>
                <el-button size="small" icon="iconfont icon-daoru" @click="openImportDialog">导入数据</el-button> -->
              <li v-if='isShowInvolvedSwitch'>
                <div class="involve-btn">
                  <span @click.stop>
                    <el-switch
                      class="small-switch"
                      v-model="assemblyInvolved"
                      :disabled="$route.params.action !== 'edit'"
                      @change="assemblyInvolvedChange"
                      style="position:relative;top:-1px"
                    ></el-switch>
                    <span class="switch-text">{{assemblyInvolved ? '涉及此内容':'不涉及此内容'}}</span>
                  </span>
                </div>            
              </li>   
          </ul>         
        </div>
        <div class="form-entey-right-toolbar">
          <data-sort :componentId='curId' @refreshData="getData" />
          <table-head-show-list 
            :trDataList='allTrList' 
            :componentParentId='curId'
            @refersh='getData'
            :popoverWidth='300'
            :isShowSaveBtn='true'
            style='margin-left:13px' 
            @checkTrChange='checkTrChange'/>
        </div>
      </div> 
      <div class="uninvolved-layer" v-show="!assemblyInvolved">
        <i class="iconfont icon-tishi">已经设置了不涉及此内容</i>
      </div>
      <!-- 消除基本信息的抖动 -->
      <div  v-loading='renderLoading' :style="{'height':(winHeight - 338) + 'px'}">
            <div v-if="trList.length" class="form_table form-enter-table">
              <vxe-table
                :data="tdData"
                border
                show-header-overflow
                style="width: 100%;"
                :max-height="winHeight - 338"
                show-overflow
                highlight-hover-row
                header-align='center'
                resizable
                ref='form_multipleTable'
                @select-change="handleSelectionChange"
                @select-all="handleSelectionChange"
                :row-class-name="tableRowClassName"
                row-id='id'
                :select-config='{strict:true,checkRowKeys:[checkboxTrId], checkMethod}'
                :optimization='{scrollY:{gt:100}}'
                :key="tableKey">
                <vxe-table-column type="selection" width="45" fixed='left' align='center' :selectable='tableSelectable'></vxe-table-column>
                <vxe-table-column
                  v-for="(item) in trList"
                  :key="item.id"
                  :title="item.name"
                  :width="columnWidth(item)">
                  <template slot-scope="scope">
                    <!-- 频率高的优先，提高性能 -->
                    <span v-if='["zhky-formData-createDate","zhky-formData-updateDate"].includes(item.id)'>
                      {{Number(scope.row.dataAndAttributeMap[item.id].formValue) | formatDate}}
                    </span>
                    <span v-else-if="['TEXTBOX','RADIOBOX','COMBOBOX','CHECKBOX'].includes(item.type)">{{scope.row.dataAndAttributeMap[item.id].formValue}}</span>
                    <el-button 
                      size="mini" 
                      v-else-if="item.type === 'IMAGEBOX' && scope.row.dataAndAttributeMap[item.id].formValue" 
                      type="primary" 
                      plain 
                      @click="previewImg(scope.row.dataAndAttributeMap[item.id].formValue)">查看图片</el-button>
                      <el-popover
                        v-else-if="item.type === 'FILEBOX' || item.type === 'VIDEO'"
                        placement="bottom"
                        width="200"
                        popper-class="file-popover"
                        trigger="click">
                        <ul class="file-box"  >
                          <li v-for="file in transformFiled(scope.row.dataAndAttributeMap[item.id])" :key='file'>
                            <a :href="file" :title='file||""' target="_blank" :download='file' >
                              {{file}}
                            </a>
                          </li>
                        </ul>
                        <el-button slot="reference" size='mini' type="primary" plain>{{item.type === 'FILEBOX' ? '查看文件' : '播放视频'}}</el-button>
                      </el-popover>
                    <div v-else-if="item.type === 'CUSTOMBOX'" >
                      <div
                        class="custom-box"
                        :class="{'activeCustomBox':scope.row.dataAndAttributeMap[item.id].involved}"
                      >
                        <span
                          style="margin:0 6px;font-weight:normal"
                          v-show="scope.row.dataAndAttributeMap[item.id].involved"
                        >{{scope.row.dataAndAttributeMap[item.id].dataNumber}}</span>
                        <span @click.stop>
                          <el-switch
                            v-model="scope.row.dataAndAttributeMap[item.id].involved"
                            class="small-switch"
                            :disabled="!scope.row.valid || $route.params.action !== 'edit'"
                            @change="involvedChange(item.id,scope.row.dataAndAttributeMap[item.id],scope.row,scope.row.dataAndAttributeMap[item.id].dataNumber)"
                            style="position:relative;top:-1px"
                          ></el-switch>
                        </span>
                        <span v-if="scope.row.dataAndAttributeMap[item.id].involved && scope.row.valid" @click.stop>
                          <el-tooltip effect="dark" content="引用" placement="top">
                            <i class="iconfont icon-yinyong" @click="referenceData(scope.row.id, item.id)" v-if="$route.params.action === 'edit'"></i>
                          </el-tooltip>
                          <el-tooltip effect="dark" content="详情" placement="top">
                            <i
                              class="iconfont icon-xiangqing"
                              @click="getCustomChild(scope.row,item)"
                            ></i>
                          </el-tooltip>
                        </span>
                        <span v-else-if="!scope.row.dataAndAttributeMap[item.id].involved" style="margin-left:20px;">未涉及</span>
                      </div>
                    </div>
                    <span v-else-if='["zhky-formData-createDate","zhky-formData-updateDate"].includes(item.id)'>
                      {{Number(scope.row.dataAndAttributeMap[item.id].formValue) | formatDate}}
                    </span>
                    <span v-else>{{scope.row.dataAndAttributeMap[item.id].formValue}}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column title='操作' width="295" fixed='right' >
                  <template slot-scope="scope">
                    <div class="operation-icon" v-if="$route.params.action !== 'view'">
                      <i
                        class="iconfont icon-i-zuofei"
                        v-if="scope.row.valid"
                        @click='handleNullifyData(scope.row.id, "unvalid")'
                      >作废</i>
                      <i
                        class="iconfont icon-i-quxiaozuofei"
                        v-if="!scope.row.valid"
                        @click='handleNullifyData(scope.row.id, "valid")'
                      >取消作废</i>
                      <popover-tips v-if='!scope.row.valid'>
                        <ul class='popover-tips-box'>
                          <li><div class="tips-item-title"><span>作废原因</span>：</div><p class="tips-item-content">{{scope.row.validStatusChangeRecord.reason}}</p></li>
                          <li><div class="tips-item-title"><span>作废人</span>：</div><span class="tips-item-content">{{scope.row.validStatusChangeRecord.operatePerson}}</span></li>
                          <li><div class="tips-item-title"><span>作废时间</span>：</div><span class="tips-item-content">{{
                            Number(scope.row.validStatusChangeRecord.operateTime) | formatDate('yyyy-MM-dd hh:mm')}}</span></li>
                        </ul>
                      </popover-tips>
                      <i
                        class="iconfont icon-xiugai"
                        v-if='scope.row.valid'
                        @click="handleEdit(scope.row, 'EDIT')">编辑</i>
                      <i class="iconfont icon-fuzhi" @click="handleEdit(scope.row,'COPY')" v-if='scope.row.valid'>复制</i>
                      <i
                        class="iconfont icon-guanlian"
                        @click="associatedData(scope.row)"
                        v-show="scope.row.valid && scope.row.connectionRuleId"
                      >关联</i>
                      <i
                        class="iconfont icon-i-piliangshipei"
                        @click="batchAdaptationData(scope.row)"
                        v-show="scope.row.valid && scope.row.batchAdaptationRuleId && scope.row.formDataSourceType !=='AUTOGENERATION'"
                      >批量适配</i>
                      <i
                        class="iconfont icon-i-fanhuishangyiji"
                        v-if='scope.row.dataId && scope.row.dataId !== "0" && !curTrId'
                        @click="backUp(scope.row.dataId, 'list')"
                      >返回上级</i>
                      <i
                        class="iconfont icon-shanchu"
                        v-if='scope.row.valid'
                        @click="handleDelete([scope.row.id])"
                      >删除</i>
                    </div>
                  </template>
                </vxe-table-column>
              </vxe-table>
            </div>
            <pagniation 
            v-show="tdData.length"
            :totalPage="totalPage" 
            :totalNum="totalNum" 
            :initPageSize='searchForms.pageSize'
            :currentPage='searchForms.current' 
            @changePage="handleChangePage" ></pagniation>
      </div>
       
    </div> 
    <div>
      <!-- 新增内容 -->
      <el-dialog
        v-el-drag-dialog
        :title="dialogTitleText"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        custom-class='form-data-dialog'
        width="575px">
        <!-- 参考数据 -->
        <div class="reference-box" v-if="form_referenceText" :title="form_referenceText"> 
          参考数据：{{form_referenceText}}
        </div>
        <div style="height:20px;" v-if="form_referenceText"></div>
        <div  class="dialog-content">
          <!-- 隐藏控件 -->
          <div style="text-align:center;margin-bottom: 10px;" v-show='collapse && visibleComponentData.length'>
            <el-button type="text" @click='handleCollapse(false)' size="small" class="collapse-btn">点击查看数据详情<i class="iconfont icon-xia el-icon--right"></i></el-button>
          </div>
          <forms
            :model="item"
            v-for="(item,i) of visibleComponentData"
            :key="item.id"
            :sortIndex="i"
            :isLoop="false"
            :isShowClear='true'
            v-show='!collapse'
            @handleApplyRules="checkRules">
          </forms>
          <div style="text-align:center;margin-bottom: 10px;" v-show='!collapse && visibleComponentData.length'>
            <el-button type="text" @click='handleCollapse(true)' size="small" class="collapse-btn">收起<i class="iconfont icon-shang el-icon--right"></i></el-button>
          </div>
          <forms
            :model="item"
            v-for="(item,i) of fillableComponentData"
            :key="item.id"
            :sortIndex="i"
            :isShowClear='true'
            :isLoop="false"
            @handleApplyRules="checkRules">
          </forms>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancleBtn" size='medium'>取 消</el-button>
          <el-button type="primary" @click="saveBtn" size='medium'>保 存</el-button>
        </div>
      </el-dialog>
      <!-- 其他功能 -->
      <el-dialog
        v-el-drag-dialog
        :title="dialogLayer.title"
        :visible.sync="dialogLayer.visible"
        :close-on-click-modal="false"
        width="30%"
        @close='handleClose'>
        <component :is="dialogLayer.component" ref="currentComponent" :type='validType' :trId='checkedTrId' @refreshData='handleRefreshData'></component>
        <div slot="footer" class="dialog-footer">
          <el-button size='medium' @click='dialogLayer.visible = false'>取 消</el-button>
          <el-button type="primary"  size='medium' @click="handleSubmit">保 存</el-button>
        </div>
      </el-dialog>
    </div>
    <import-excle @importExcleData="importExcleData" ref="importExcle"/>
    <reference-data ref="referenceData"  @refreshData="getData"/>
    <associated-data ref="associatedData" @refreshData="getData"/>
    <copy-data ref="copyData" @refreshData="getData"/>
    <preview-img :previewData="previewData" :visible.sync='previewimgVisible'></preview-img>
    <batch-edits ref="batchEdits" submitType='SITE_DATA' @refreshData="batchEditCb"/>
    <data-multiple-rules visible.sync="multipleRulesVisible" :ruleOptions='ruleOptions' @getRules='getCheckedRules'/>
    <batch-adaptation ref='batchAdaptationData' @refreshData="getData" />  
    <download ref="downloadComponent"/>
    <!-- 批量复制进度条 -->
    <customProgress :visible.sync='lockScreenConfig.visible' 
    :handleCount.sync='lockScreenConfig.handleCount'
    :totalCount.sync='lockScreenConfig.totalCount'
    progressTitle='正在复制'
    ></customProgress>
  </div>
</template>
<script>
import forms from "./ComponentWarp.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import previewImg from "@/components/tools/PreviewImg.vue";
import importExcle from "@/components/tools/ImportExcle.vue";
import referenceData from "./components/ReferenceData.vue"; // 引用数据
import batchEdits from "./components/batchEdits.vue";
import download from "@/components/tools/download.vue";
import associatedData from "./components/associatedData.vue";
import dataMultipleRules from "./components/dataMultipleRules.vue";
import dataSort from "./components/dataSort.vue"; // 数据排序
import tableHeadShowList from "@/components/tools/tableHeadShowList.vue";
import batchAdaptation from "./components/batchAdaptation.vue";
import parsingRule from "@/components/tools/parsingRule.js"; // 解析显示、值改变规则
import parsingFormula from "@/components/tools/parsingFormula.js"; // 解析公式规则
import SearchBox from "@/components/tools/searchBox.vue";
import copyData from "./components/copyData.vue";
import nullifyData from "./components/nullifyData.vue";
import formValidate from "./components/validate.js";
import popoverTips from "@/components/tools/popoverTips.vue";
import customProgress from "@/components/tools/customProgress/index.vue";
import filterComponent from "@/components/tools/filterComponent/index.vue"; // 筛选组件
import FormRulesModule from "@/components/tools/applyRules.js"; // 规则执行模块
import bus from '@/views/common/bus.js'
import { mapGetters } from "vuex";
import { debouce } from "@/utils.js";
let formRulesModule;
export default {
  data() {
    return {
      searchForms: {
        keyWord: "",
        pageSize: 30,
        current: 0,
      },
      assemblyInvolved:true, // 改组件数据是否涉及，默认为true
      allTrList:[], // 所有的表头
      parentCurrent:null, // 当前元素所关联的父级元素所在的页码，如果此页吗有值则以该页码查询
      collapse:true, // 表单折叠
      tableKey:0,  //用于重新渲染table
      renderLoading:false,
      isShowTable: false, //是否显示基础信息
      isShowTableBtn: true, //是否显示表格功能按钮，如果表格项全是组件则不显示
      componentData: [], //组件结构
      tdData: [], //多行展示的数据,
      trList: [], //表头
      dialogLayer:{  // 通用的dialog 弹窗展示
        title:'标题',
        visible:false,
        component:'nullifyData'
      },
      validType:'unvalid',  
      dialogFormVisible: false,
      previewimgVisible:false, //图片预览弹框
      multipleRulesVisible:false, // 多条批量适配规则选择弹框
      ruleOptions:[], // 多条批量适配规则列表
      dialogTitle: "ADD",
      componentValue: [], //组件值
      checkedTrId: "", //当前操作行的id
      parentTrId: null, // 父级组件的行id，用于返回上级时勾选
      checkboxTrId: [], //多选框选择的表格行id
      errorMesg: [], //错误提示信息
      dataId: "", //表格的行id，用于查找下级组件的数据
      parentIsMultipleCustomWidget: false, //当前组件是否可添加多行，父级组件的属性
      tableDisplayColumnFlag:false, // 当前表格是否设置显示列
      previewData: {
        dataList: [], //预览图片的数据
        currentIndex: 0 //当前选中的img
      },
      isRefreshData: true, //是否刷新数据
      totalNum: 0, //总数量
      totalPage: 0 ,//总页数
      showLoading:false,
      table_referenceText:'', // 上级参考数据表格显示
      form_referenceText:'', // 上级参考数据表单显示
      columnKeys:[], // 可搜索的字段列表
      filterData:[], // 筛选条件
      formDialogNode:null,
      loadingVisible:false,
      lockScreenConfig:{ // 锁屏进度数据
        visible:false,
        handleCount:0, // 已执行数量
        totalCount:1
      }
    };
  },
  props:{
    // 当前组件的parantId
    curId:{
      type:String
    },
    // 当前组件是否为基础组件
    isBasic:{
      type:Boolean,
      default:true
    },
    // 当前组件对应在父组件的dataId 数据ID
    curTrId:{
      type:String
    },
    title:String,
  },
  created() {
    window.onbeforeunload = function() { // 移除预览生成的表单
    const tempId = this.$route.params.projectId
    const tempIdentifier = this.$route.query.tempIdentifier // 模板聚合id
      tempIdentifier && this.$http.templateService
        .deletePreviewForm(tempIdentifier, tempId)
        .then(res => {
          window.onbeforeunload = null;
        });
      return null;
    };
  },
  computed: {
     //可填写的控件
    fillableComponentData() {
      return this.componentData.filter(
        item => !item.id.includes('zhky-formData') && item.componentAttr.visible && item.componentAttr.fillable
      );
    },
    //可见不可填的控件
    visibleComponentData() {
      return this.componentData.filter(
        item => !item.id.includes('zhky-formData') && item.componentAttr.visible && !item.componentAttr.fillable
      );
    },
    //是否显示添加数据按钮
    isShowAddBtn() {
      if (
        this.parentIsMultipleCustomWidget ||
        (!this.parentIsMultipleCustomWidget && !this.componentValue.length)
      ) {
        return true;
      }
      return false;
    },
    // 是否显示组件涉及开关
    isShowInvolvedSwitch(){
      return this.curId.split('-').length === 2
    },
    dialogTitleText(){
      return this.dialogTitle === 'ADD' ? '新增数据' : this.dialogTitle === 'EDIT' ? '编辑数据' : '复制数据'
    },
    queryDataIds(){
      return this.$route.query.queryDataIds && this.$route.query.curId === this.curId ? JSON.parse(this.$route.query.queryDataIds) : null
    }
  },
  watch: {
    curTrId(val) {
      this.dataId = val;
      this.filterData = [] // 清空筛选条件
      if (this.isRefreshData && !val) {
        this.isRefreshData = false; //curId不变，dataId改变也要刷新数据
        this.componentData = [];
        this.resetForm()
        this.tdData = [];
        this.getData()
        this.getComponentsData() // 获取表单结构
      }
    },
    curId(val,oldVal) {
      this.filterData = [] // 清空筛选条件
      if (this.isRefreshData) {
        this.resetForm()
        // this.trList = [];
        this.tdData = [];
        this.getData()
        if(!this.isBasic){
          this.getComponentsData() // 获取表单结构
        }
      }
    },
    isBasic(val, oldVal){
      if(val && !oldVal){
        this.componentData = [];
      }
    },
    dialogFormVisible(newVal) {
      if (!newVal) {
        const timer = setTimeout(()=>{
          this.form_referenceText = '';
          this.componentData = this.componentData.map(item => {
            item.formValue = {
              addressValue: {
                provinceValue: "",
                cityValue: "",
                countyValue: "",
                streetValue: ""
              },
              imageValue: [],
              dynamicChoiceValues:[],
              otherValues:[],
              industryList:[],
              stringListValue: item.componentAttr.defaultListBox.map(item => item),
              stringValue: item.componentAttr.defaultStringTextBox
            };
            item.componentAttr.fillable = formRulesModule.originalComponentState[
              item.id
            ].fillable;
            item.componentAttr.visible = formRulesModule.originalComponentState[
              item.id
            ].visible;
            return item;
          });
          this.collapse = true;
          this.backScrollTop() // 回到顶部
          clearTimeout(timer)
        }, 100)
      }
    }
  },
  components: {
    forms,
    pagniation, //页码
    previewImg, //预览图片
    importExcle, //导入数据
    referenceData, //引用数据
    download, //下载模板
    associatedData, //关联数据
    // batchEdits:()=> import('./components/batchEdits.vue'/* webpackChunkName: 'batchEdits' */) ,//批量编辑
    batchEdits,
    copyData, // 复制数据
    dataMultipleRules, // 多条规则显示框
    tableHeadShowList,
    batchAdaptation,
    SearchBox,
    popoverTips,
    dataSort, // 数据排序
    nullifyData, // 废止数据
    filterComponent ,
    customProgress
  },
  mounted(){
    formRulesModule = new FormRulesModule() // 构建规则实列，用于保存规则初始化信息、执行规则等相关操作
    bus.$on('webSocket', this.webSocketCb) // 添加websocket 事件监听
    bus.$on('ws_getTaskLockScreen', this.ws_getTaskLockScreen) // 添加锁屏事件监听
  },
  beforeDestroy(){
    formRulesModule = null;
    bus.$off('webSocket', this.webSocketCb) // 移除websocket 事件监听
    bus.$off('ws_getTaskLockScreen', this.ws_getTaskLockScreen) // 移除事件监听
  },
  methods: {
    // websocket推送回调
    webSocketCb(data){
      const timer = setTimeout(()=>{
        this.getData()
      }, 100)
    },
    // websocket锁屏推送回调, 更新进度
    ws_getTaskLockScreen(data){
      this.lockScreenConfig.handleCount = data.result.handleCount;
      this.lockScreenConfig.totalCount = data.result.totalCount;
    },
    // 高级搜索
    advancedSerach(data) {
      this.searchForms.current = 0;
      this.getNextDataAll(data)
    },
    // 设置可筛选的字段
    setColumnKeys(){
      const validateFileds = ['TEXTBOX','RADIOBOX','CHECKBOX','COMBOBOX','CASCADER','MULTIPLE_COMBOBOX','INDUSTRY', 'ADDRESSBOX'] // 需要过滤的类型
      const specialType = ['INDUSTRY','CHECKBOX','MULTIPLE_COMBOBOX'] // 为包含的类型
      this.columnKeys = this.componentData.filterMap(item => {
        if(validateFileds.includes(item.componentType) && item.id.indexOf('zhky-formData') === -1){
          return {key:item.id, name:item.componentAttr.tag, separator:specialType.includes(item.componentType) ? 'CONTAIN' : 'EQUAL'}
        }
        return false
      })
    },
    // 获取数据
    getData(){
      if (this.isBasic) { // 基础组件
        this.getFirstDataAll();
        this.assemblyInvolved = true
      } else {
        this.componentValue = [];
        this.getNextDataAll(this.filterData);
      }
    },
    // 新增、编辑时折叠表单
    handleCollapse(flag){
      this.collapse = flag
    },
    // 已作废的数据不能选择
    tableSelectable(row){
      return row.valid // 是否作废
    },
    //表头显示列
    checkTrChange(trList){
      this.trList = trList;
    },
    //渲染地址
    renderAddress(data) {
      return Object.values(data).join("");
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
    //获取第一级子组件
    getFirstDataAll() {
      this.renderLoading = true;
      this.showLoading = true;
      let _this = this;
      _this.trList = [];
      const params = {
        controlId: this.curId,
        ids: this.queryDataIds,
        ...this.searchForms
      }
      // this.parentCurrent && (params.current = this.parentCurrent) // 如果有需要查询的页码，则以该页码查询，查询一次后清空
      let promiseFn = [this.$http.formEnterService.getChildByParentId(this.curId, {identifier:this.curTrId}),this.$http.formEnterService.findFormDataByDataIdAndControlId(params)] // 查询结构接口
      Promise.all(promiseFn).then(function(results) {
        _this.isRefreshData = true;
        _this.componentValue = results[1].data.content;
        _this.parentIsMultipleCustomWidget = results[0].data.multipleCustomWidget;
        _this.tableDisplayColumnFlag = results[0].data.dynamicDisplayColumnFlag;      // 是否设置显示列
        _this.renderLoading = false;
        if (_this.componentValue.length) {
            //有数据
            _this.basicComponents(
              results[0].data.formComponents,
              results[1].data.content[0]
            );
          } else {
            //无数据
            _this.componentData = results[0].data.formComponents;
          }
          _this.$nextTick(()=>{
            // _this.transformRules(results[0].data.rules);
            // originalComponentState = _this.saveOriginalComponentState(
            //   results[0].data.formComponents
            // ); 
            // 初始化规则
            _this.initRules(results[0].data.rules, results[0].data.formComponents)
          })
        // 上级参考数据
        _this.table_referenceText = _this.form_referenceText = results[0].data.superRefData
      }).catch((err)=>{
        _this.renderLoading = false;
        err.status && this.$message.error('数据错误！')
      });
    },
    // 基础组件数据拼接
    basicComponents(componentData, componentValue) {
      this.componentData = componentData.map(item => {
        let tempFormValue = componentValue.dataAndAttributeDtoList.filter(
          item1 => { 
            return item1.controlId === item.id 
          }
        );
        if(tempFormValue.length){
          item.formValue = tempFormValue[0].formValue
        }
        return item;
      });
    },
    // 获取参考数据
    getReferenceData(dataId){
      this.$http.formEnterService.getChildByParentId(this.curId,{identifier:dataId}).then((res)=>{
        // 上级参考数据
        this.form_referenceText = res.data.superRefData
        this.table_referenceText = ''
      })
    },
    //获取后面的子组件
    getNextDataAll(filterData = []) {
      this.checkboxTrId = []
      this.renderLoading = true
      const params = {
        dataId: this.dataId,
        controlId: this.curId,
        ids: this.queryDataIds, 
        ...this.searchForms,
        filter:{
          listData:filterData
        }
      }
      this.parentCurrent && (params.current = this.parentCurrent) // 如果有需要查询的页码，则以该页码查询，查询一次后清空
      this.$http.formEnterService.getFormData(params).then((res)=>{
        this.trList = res.data.header
        this.tdData = res.data.rows.content || []
        this.totalNum = res.data.rows.totalElements;
        this.totalPage = res.data.rows.totalPages;
        // 上级参考数据
        this.table_referenceText = this.form_referenceText = res.data.superRefData
        this.parentIsMultipleCustomWidget = res.data.multipleCustomWidget;
        this.renderLoading = false;
        this.isRefreshData = true;
        this.assemblyInvolved = res.data.involved;
        this.$nextTick(()=>{
          this.uninvolvedLayer()
          if(this.parentTrId){ // 返回上级时勾选住上级数据
            this.checkboxTrId = [this.parentTrId]
            this.parentTrId = null
            this.toggleSelection()
          }
          if(this.parentCurrent){ // 查询后将定向页码赋值给页码组件
            this.searchForms.current = this.parentCurrent
            this.parentCurrent = null
          }
          this.toggleSelection()
        })
        this.$refs.form_multipleTable.refreshData() // 重新渲染table ， 避免错位, 注意此方法可能会导致后续代码停止执行
      }).catch((err)=>{
        this.isRefreshData = true;
        this.renderLoading = false;
        err.status && this.$message.error('数据错误！')
      })
    },
    // 判断是否锁屏
    judgeIsLockScreen(task){
      console.log(this.curId, task)
      if(task && this.curId === task.componentId){
        this.lockScreenConfig = {
          visible: true,
          handleCount: task.result.handleCount,
          totalCount: task.result.totalCount
        }
      }
         
    },
    //判断是否全是组件
    jugdeIsAllCustom(data1, data2) {
      if (
        !data1.some(item => item.componentType !== "CUSTOMBOX") &&
        !data2.length
      ) {
        this.isShowTableBtn = false;
        this.dialogTitle = "ADD";
        this.saveBtn();
      } else {
        this.isShowTableBtn = true;
      }
    },
    //预览模板
    getDataView() {
      this.$http.formEnterService.getChildByParentId(this.curId);
    },
    involvedChange(id,row, row2, dataNumber) {
      this.$nextTick(async () => {
        if(Number(dataNumber) > 0){
          row.involved = !row.involved;
          this.$message({
            type: "error",
            message: "组件下存在数据，请删除后再关闭！"
          });
          return 
        }
        try {
          const flag = await this.editInvoledState(id, row.involved, row2.id)
        } catch (error) {
          row.involved = !row.involved; // 修改失败将状态还原
        }
      });
    },
    //修改组件的涉及状态
    editInvoledState(id,isInvolved, dataId){
      return new Promise((resolve, reject)=>{
        this.$http.formEnterService.editSwatch(id, isInvolved, dataId).then(res => {
          resolve(true)
        }).catch(()=>{
          reject(false)
        });
      })
    },
    
    //打开对话框
    async openDialog() {
      if(!this.componentData.length){
        await this.getComponentsData() // 获取表单结构和数据
      }
      this.dialogTitle = "ADD";
      this.dialogFormVisible = true;
    },
    // 获取表单结构和数据
    getFormData(id){
      return this.$http.formEnterService.findSimpleFormDataById(id).then(res=>{
        this.basicComponents(this.componentData, res.data);
      })
      // const params = {
      //   dataId: this.dataId,
      //   controlId: this.curId,
      //   ids:[id],
      // }
      // let _this = this
      // const promiseFn = [this.$http.formEnterService.getChildByParentId(this.curId),
      // this.$http.formEnterService.findFormDataByDataIdAndControlId(params)] // 查询结构接口
      // return Promise.all(promiseFn).then(function(results) {
      //   //有数据
      //   _this.basicComponents(
      //     results[0].data.formComponents,
      //     results[1].data.content[0]
      //   );
      // })
    },
    // 获取表单结构
    getComponentsData(){
      return this.$http.formEnterService.getChildByParentId(this.curId).then(res=>{
        this.componentData = res.data.formComponents
        this.judgeIsLockScreen(res.data.task)
        // 初始化规则
        this.initRules(res.data.rules, this.componentData)
        const timer = setTimeout(()=>{
          this.allTrList = res.data.formComponents.map(item =>{ // 显示列来源
            return {
              display:item.display,
              id:item.id,
              name:item.componentAttr.tag,
            }
          })
          clearTimeout(timer)
        },300)
        const t = setTimeout(()=>{
          this.setColumnKeys()  // 设置可筛选的字段
          clearTimeout(t)
        }, 1000)
      })
    },
    //关闭对话框
    cancleBtn() {
      this.dialogFormVisible = false;
    },
    //删除数据
    handleDelete(ids) {
      this.$confirm("是否确认删除选中数据？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.formEnterService
          .deleteCurData({ identifiers: ids })
          .then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            const timer = setTimeout(()=>{ // 后台为异步，鬼知道
              this.getData(); //获取数据
              clearTimeout(timer)
            },300)
            if(this.tdData.length <= 1){ 
              this.searchForms.current = this.searchForms.current > 0  ? this.searchForms.current - 1 : 0 ; 
            }   
          })
          .catch(() => {});
      });
    },
    //编辑数据
    async handleEdit(row, type) {
      this.checkedTrId = row.id;
      await this.getFormData(row.id)
      formRulesModule.implementApplys(); 
      if (type === "EDIT") {
        this.dialogTitle = "EDIT"; // 编辑数据
      } else if (type === "COPY") {
        this.dialogTitle = "COPY";  // 复制数据
      }
      this.dialogFormVisible = true;
      if(row.dataId){
        this.getReferenceData(row.dataId)
      }
    },
    //新增/编辑数据
    saveBtn() {
      // 验证录入的数据
      for (let item of this.componentData) {
        if(item.componentAttr.fillable){  //只有可以录入的才进行验证
          const mesg = formValidate(item)
          mesg && this.errorMesg.push(...mesg)
        }; 
      }
      if (this.errorMesg.length) {
        //显示错误信息
        let str = "";
        for (let item of this.errorMesg) {
          str += `<li>${item.name} : ${item.errorMesg}</li>`;
        }
        this.$message({
          dangerouslyUseHTMLString: true,
          duration: 3000,
          showClose: true,
          type: "error",
          message: `<ul style='line-height:20px;'>${str}</ul>`
        });
        this.errorMesg.length = 0;
        return;
      }
      let params = {
        parentId: this.componentData[0].parentId,
        projectId: this.componentData[0].projectId,
        addUserId: sessionStorage.userId,
        addUserName: sessionStorage.userName,
        userId: sessionStorage.userId,
        dataId:this.dataId,
        audit: this.$route.params.action === "audit",
        dataAndAttributeDtoList: []
      };
      let checkedData = {} // 存放当前复制、编辑的原始数据
      this.componentData.forEach(item => {
        if(item.id.includes('zhky-formData')){ //过滤掉修改时间，创建人等基本信息
          return 
        }
        if (item.componentAttr.checkType === "CHECKBOX") {
          item.formValue.stringListValue = this.checkboxSort(item);
        }
        if(!item.componentAttr.visible){
          item.formValue = {
            addressValue: {
              provinceValue: "",
              cityValue: "",
              countyValue: "",
              streetValue: ""
            },
            imageValue: [],
            industryList:[],
            otherValues:[],
            dynamicChoiceValues:[],
            stringListValue: [],
            stringValue: ""
          };
        }
        // 回填设置 otherValues (后端使用) 
        const dataType = ['RADIOBOX','CHECKBOX','COMBOBOX','MULTIPLE_COMBOBOX']
        if(dataType.includes(item.componentType)){
          item.formValue.otherValues = this.backfillData(item);
        }
        const dataAndAttributeItem = {
          controlId: item.id,
          formValue: item.formValue,
          fieldId:item.componentAttr.fieldId,
          name: item.componentAttr.tag,
          userId: sessionStorage.userId,
          userName: sessionStorage.userName,
          type: item.componentType
        }
        // 过滤掉为空的行业列表
        if(item.componentType === 'INDUSTRY'){
          dataAndAttributeItem.formValue.industryList = dataAndAttributeItem.formValue.industryList.filter(item => item.label);
        }
        if(item.componentType === 'CUSTOMBOX' && this.dialogTitle === "COPY"){
          checkedData = this.tdData.find(obj => obj.id === this.checkedTrId)
          dataAndAttributeItem.involved = checkedData.dataAndAttributeMap[item.id].involved
        }
        if(item.componentType === 'CUSTOMBOX' && this.dialogTitle === "ADD"){
          dataAndAttributeItem.involved = true
        }
        params.dataAndAttributeDtoList.push(dataAndAttributeItem)
      });
      if (this.dialogTitle === "ADD") { // 新增
        this.$http.formEnterService.saveData(params).then(res => {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
          this.getData();
        });
      } else if(this.dialogTitle === "EDIT") { // 编辑
        let tdData = []
        if(this.isBasic){
          tdData = this.componentValue
        }else{
          tdData =  this.tdData
        }
        const obj = tdData.find(
          item2 => item2.id === this.checkedTrId
        )
        params.dataId = obj.dataId ;
        params.connectionFormDataIds = obj ? obj.connectionFormDataIds : [];
        this.$http.formEnterService
          .editCurData(this.checkedTrId, params)
          .then(res => {
            this.$message({
              type: "success",
              message: "保存成功!"
            });
            this.getData();
          });
      }else { // 单个复制
        params.dataId = this.getDataId()
        this.copyData(this.checkedTrId, params)
        const timer = setTimeout(()=>{
          this.cancleBtn();
          clearTimeout(timer)
        },250)
        return
      }
      this.cancleBtn();
    },
     //回填数据
    backfillData(data) {
      const listType = ['CHECKBOX','MULTIPLE_COMBOBOX']
      let tempData;
      if(listType.includes(data.componentType)){
        tempData = data.formValue.stringListValue
      }else{
        tempData = [data.formValue.stringValue]
      }
      return tempData.map(item => {
        const tempObj = data.componentAttr.choiceItemsChoiceBox.find(
          item2 => item2.choiceValue === item
        );
        return {
          choiceId: tempObj ? tempObj.choiceId : "",
          choiceValue: tempObj ? tempObj.choiceValue : ""
        };
      });
    },
    // 批量编辑执行回调
    batchEditCb(){
      this.$message({
        message: '任务提交成功！该任务执行时间可能较长，执行结果请<span style="color:#268FDF;">关注消息</span>',
        type: 'warning',
        dangerouslyUseHTMLString:true,
        showClose: true,
      });
    },
    //回填数据
    backfillData(data) {
      const listType = ['CHECKBOX','MULTIPLE_COMBOBOX']
      let tempData;
      if(listType.includes(data.componentType)){
        tempData = data.formValue.stringListValue
      }else{
        tempData = [data.formValue.stringValue]
      }
      return tempData.map(item => {
        const tempObj = data.componentAttr.choiceItemsChoiceBox.find(
          item2 => item2.choiceValue === item
        );
        return {
          choiceId: tempObj ? tempObj.choiceId : "",
          choiceValue: tempObj ? tempObj.choiceValue : ""
        };
      });
    },
    // 获取当前数据的dataId
    getDataId(){
      return this.tdData.find(item => item.id === this.checkedTrId).dataId
    },
    //获取表格选择项
    handleSelectionChange({selection}) {
      this.checkboxTrId = selection.map(item => item.id);
    },
    //基本信息的编辑
    editData() {
      if(this.componentValue.length){
        this.checkedTrId = this.componentValue[0].id;
        this.dialogTitle = "EDIT";
      }else{
        this.dialogTitle = "ADD";
      }
      this.saveBtn();
    },
    // 手动选中表格列
    toggleSelection() {
      if (this.checkboxTrId.length) {
        const rows = this.checkboxTrId.filterMap(id => {
        return this.tdData.find(item => item.id === id)
      })
        this.$refs.form_multipleTable.setSelection(rows, true);
      } else {
        this.$refs.form_multipleTable.clearSelection();
      }
    },
    //多选框排序
    checkboxSort(data) {
      let tempArr = [];
      data.componentAttr.choiceItemsChoiceBox.forEach(ele => {
        if (
          data.formValue.stringListValue.some(item => item === ele.choiceValue)
        ) {
          tempArr.push(ele.choiceValue);
        }
      });
      return tempArr;
    },
    //重置搜索条件
    resetForm(isReload = false){ //是否刷新一下数据
      formRulesModule.clear() //清空规则列表
      this.searchForms.keyWord = '';
      this.searchForms.current = 0;
      this.totalNum = 0 //总数量
      this.totalPage = 0 //总页数
      this.checkboxTrId = []
      this.checkedTrId = null
      isReload && this.getData()
    },
    searchData(){
      this.searchForms.current = 0
      this.checkboxTrId = []
      this.getData()
    },
    //获取自定义组件的数据
    getCustomChild(td, tr) {
      this.dataId = td.id;
      const row = {
        id:tr.id,
        dataId:td.id,
        name:tr.name
      }
      this.$emit("checkCustom", row); //改变当前id，渲染下级组件
    },
    //保存初始的控件状态
    saveOriginalComponentState(componentData) {
      let tempObj = {};
      componentData.forEach(item => {
        tempObj[item.id] = {
          fillable: item.componentAttr.fillable,
          visible: item.componentAttr.visible
        };
      });
      return tempObj;
    },
    //预览
    previewImg(data, curIndex = 0) {
      this.previewData.dataList = data.split(';').map(item => ({url:item,name:''}));
      this.previewimgVisible = true
    },
    //下载模板
    downloadTemplate() {
      let url = this.$http.fileService.downloadFile();
      this.$refs.downloadComponent.download(url + this.curId);
    },
    //批量删除
    deleteTrData() {
      this.handleDelete(this.checkboxTrId);
    },
    //上传excle
    openImportDialog() {
      this.$refs.importExcle.dialogVisible = true;
    },
    //导入数据
    importExcleData(url) {
      this.$http.formEnterService
        .importExcleData({ dataId: this.dataId || '', parentId: this.curId, url: url }).then(()=>{
          this.getData()
        })
    },
    // 作废数据、取消作废
    handleNullifyData(trId, type){
      this.dialogLayer = {
        title:type === 'valid' ? '取消作废':'作废数据',
        visible:true,
        component:'nullifyData'
      }
      this.checkedTrId = trId
      this.validType = type
    },
    //批量适配数据
    batchAdaptationData(row){
      this.$refs.batchAdaptationData.openDialog(
        row.id,
        row.batchAdaptationRuleId,
      ); 
    },
    //数据规则-关联数据
    associatedData(row) {
      this.$refs.associatedData.openDialog(
        row.id,
        this.curId,
        row.connectionRuleId
      ); //打开关联数据框
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
      this.$refs.batchEdits.openDialog(tempData, this.checkboxTrId); //打开批量修改框
    },
    // 批量复制
    batchCopy(){
      this.$http.formEnterService.batchCopy({listData:this.checkboxTrId}).then(()=>{
        this.lockScreenConfig.visible = true
      })
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.searchForms.pageSize = page.pageSize;
      this.searchForms.current = page.currentPage - 1;
      this.checkboxTrId = [];
      this.getData();
    },
    //引用数据
    referenceData(rowId, columnId) {
      this.$refs.referenceData.dialogVisible2 = true;
      this.$refs.referenceData.dataId = rowId;
      this.$refs.referenceData.getData(columnId);
    },
    //取消引用
    cancelReference(){
      this.$confirm('是否确定取消引用当前数据？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.formEnterService.disConnectQuoteData({
            dataId:this.curTrId,
            quotedIds:this.checkboxTrId
          }).then(res =>{
            this.$message({
              message: `成功取消引用 ${this.checkboxTrId.length} 条数据`,
              type: 'success'
            });
            this.getData()
          })
        })
    },
    /**
     * @param { String } id 数据id
     * @param { Object } formValue 表单数据
     */
    //复制数据
    copyData(id, formValue) { 
      let dataList = this.tdData.find(item => item.id === id).dataAndAttributeMap
      let hasDataAssemblyList = []
      for(let item of this.trList){
        if(item.type === 'CUSTOMBOX' && Number(dataList[item.id].dataNumber)){ // 筛选出组件下面数据不为0的组件
          hasDataAssemblyList.push({ 
            name:item.name,
            id:item.id,
            dataNum:dataList[item.id].dataNumber,
            isChoice:false
          })
        }
      }
      if(hasDataAssemblyList.length){
        this.$refs.copyData.openDialog(id, hasDataAssemblyList, formValue)
      }else{
        this.$http.formEnterService.saveData(formValue).then(res => {
          this.$http.formEnterService.copyData(id, res.data.id, { listData:[] }).then(res => {
            this.getData()
            this.$message({
              message:'复制成功！',
              type:'success'
            })
          })
        });
      }
    },
    /**
     * @param {String} dataId 上级组件的数据行id，用于勾选中 
     * @param {String} type 点击返回的类型  默认为组件顶部返回上级组件 list为点击列表项返回按钮返回到上级
     */
    // 返回上级
    backUp(dataId, type = null){
      this.$http.formEnterService.getFatherPage(dataId, {pageSize: this.searchForms.pageSize}).then(res=>{
        this.parentCurrent = res.data // 不能直接修改 current ，当此页码大于当前的总页数时，页码组件会重置页码为0
      }).finally(()=>{
        this.parentTrId = dataId;
        this.$emit('backUp', type)
      })
    },
    handleSubmit(){
      const { currentComponent } = this.$refs;
      currentComponent && currentComponent.submit()
    },
    handleClose(){
      const { currentComponent } = this.$refs
      currentComponent && currentComponent.reset()
    },
    // 获取选择的批量适配规则
    getCheckedRules(data){},
    // 初始化规则结构
    initRules(rules, componentData){
      if(!formRulesModule.componentRulesMap.size){
        formRulesModule.transformRules(rules)
        //保存初始的控件状态
        formRulesModule.saveOriginalComponentState(componentData)
      }
    },
    //校验规则
    checkRules:debouce(async function(fieldId, val){
      fieldId && formRulesModule.implementApplys(fieldId);
    }, 200),
    tableRowClassName({seq, row, rowIndex, $rowIndex}) {
      if (this.checkboxTrId.find(id => id === row.id)) {
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
    handleRefreshData(){
      this.getData()
      this.dialogLayer.visible = false
    },
    transformFiled(row){
      return row.formValue.split(';')
    },
    columnWidth(column){
      if(['IMAGEBOX','FILEBOX','VIDEO'].includes(column.type)){
        return 102
      }
      return column.type === 'CUSTOMBOX' ? 179 : column.setFixedColumnWidth ? parseInt(column.fixedColumnWidth) : 'auto'
    },
    // 一级组件的涉及
    async assemblyInvolvedChange(involved){
      this.assemblyInvolved = !involved
      try {
          const flag = await this.editInvoledState(this.curId, involved, '0')
          this.assemblyInvolved = involved
          this.$parent.$refs.formLeftTree.getInitData()
        } catch (error) {
          this.assemblyInvolved = !involved // 修改失败将状态还原
        }
    },
    // 不涉及的遮罩
    uninvolvedLayer(){
      const node = document.querySelector('.form-enter-table .vxe-table--body-wrapper');
      let layer = document.querySelector('.uninvolved-layer')
      layer.style.height = node.offsetHeight + 'px';
      layer.style.lineHeight = node.offsetHeight + 'px';
    },
    tableMinWidth(type){
      return type === 'CUSTOMBOX' ? 179 : 150
    },
    checkMethod ({ row }) {
      return row.valid
    },
    formatStringValue(type, value){
      if(["zhky-formData-createDate","zhky-formData-updateDate"].includes(item.id)){
        return 
      }
    },
    backScrollTop(){
      if(!this.formDialogNode){
        this.formDialogNode = document.querySelector('.form-data-dialog .el-dialog__body')
      }
      this.formDialogNode.scrollTop = 0 // 弹框关闭将滚动条滚至顶部
    }
  }
};
</script>
<style >
  .uninvolved-layer{
    position: absolute;
    left: 0;
    top:146px;
    width: 100%;
    text-align: center;
    background:rgba(255,248,227,1);
    z-index: 99;
  }
  .uninvolved-layer i.iconfont{
    font-style: normal;
    color: #D97716;
    cursor:default;
  }
</style>
<style scoped>
.yizuofei, .yizuofei::before{
  color: #FE413B !important;
}
[v-cloak] {
  display: none;
}
.icon-i-youlishuju,
.icon-i-youlishuju::before{
  cursor: default !important;
  color:#8C8C8C !important;;
}
.fade-enter-active{
  transition: all .3s; 
  /* transform: translateX(10px); */
}
.fade-enter{
  opacity: 0;
  /* transform: translateX(20px); */
}
.top-btn_box {
  display: flex;
  justify-content: space-between;
}
.top-btn_box >>> input::-webkit-input-placeholder {
  font-size: 12px;
}

.middle {
  background: #f0f0f0;
  height: 100%;
  border-radius: 5px;
}

.middle .title {
  font-size: 18px;
  height: 40px;
  font-weight: normal;
  line-height: 40px;
  text-indent: 10px;
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
.middle .title-list {
  padding: 10px 40px 10px 30px;
  background: #fff;
  border-radius: 4px;
  overflow: visible;
  color: #484848;
  text-align: left;
  background-color: #ffffff;
  border: solid 2px #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.formEntry i {
  color: #26beff;
  /* padding: 7px 3px 7px 7px; */
  border-radius: 6px;
  background: transparent;
  transition: all 0.3s;
  font-weight: normal !important;
}
.formEntry i.icon-xiugai,
.formEntry i.icon-fuzhi {
  margin-right: 8px;
}
.formEntry i:hover,
.icon-yinyong:hover {
  color: #1d7fff;
  /* background: #1d7fff; */
}
.describe-title {
  height: 120px;
  width: 100%;
  border: 1px dashed #26beff;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
}
.collapse-btn{
  border: 1px dashed #1884CC;
  width: 100%;
}
.collapse-btn:hover{
   background: rgba(230,249,255,1);
}
.middle .title:hover {
  outline: dashed 1px #aaaaaa;
}

.middle .title:focus {
  background: #f4f4f4;
  outline: none;
}

.describe-title i {
  color: #26beff;
}

.head {
  height: 28px;;
  margin-bottom: 10px;
  position: relative;
  border-bottom: 1px solid #DCE7F5;
}
.icon-xia,.icon-shang{
  transform: scale(.8)
}
.iconfont {
  font-size: 12px !important;
  cursor: pointer;
}
.regulation-tb {
  height:90%
}
.iconfont::before {
  margin-right: 3px;
}
.icon-yitianxie {
  display: inline-block;
  width: 95px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.entryForms >>> .el-table__fixed-right {
  background: #fff;
}
.custom-box {
  width: 142px;
  line-height: 31px;
  height: 32px;
  padding: 0 7px;
  background:rgba(255,255,255,1);
  border:1px solid rgba(232,232,232,1);
  border-radius: 4px;
  color: #BFBFBF;
}
.custom-box i {
  margin-left: 8px;
  color: #1884CC;
  font-weight: normal !important;
}
.custom-box .icon-yinyong {
  margin-left: 12px;
  padding: 2px;
  background: transparent;
  color: #1884CC;
}
.custom-box.activeCustomBox {
  border-color: #91D5F2;
  color: #262626
}
.custom-box.active-red {
  border-color: #f96868;
}
.error-mesg li {
  margin-bottom: 5px;
}
 .data-search-box .el-col{
  max-width:300px;
 }
 .tools-bar_common{
  border-bottom: none;
 }
 .backup-btn{
   position: relative;
   top:1px;
   margin: 0 13px;
 }
 .reference-box{
  width: 100%;
  position: absolute;
  top:55px;
  left: 0;
  height:32px;
  color: #E68517;
  text-indent: 12px;
  font-size: 12px;
  line-height: 32px;
  background:rgba(255,250,235,1);
  border-radius:2px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  z-index: 2222;
 }

 .table-title{
   display: flex;
   align-items: center;
 }
 .tb-referenceText{
   font-size: 12px;
   color: #E68517;
   display: inline-block;
   max-width: 29vw;
   text-overflow: ellipsis;
   white-space: nowrap;
   overflow: hidden;
   margin-left: 20px;
 }
 .involve-btn{
  width:128px;
  height:30px;
  margin-right: 12px;
  position: relative;
  top:1px;
  padding-left: 15px;
  line-height: 32px;
  background:rgba(255,255,255,1);
  border:1px solid rgba(224,224,224,1);
  border-radius:5px;
 }
 .switch-text{
   font-size: 12px;
   margin-left: 5px;
   color: #606266;
   position: relative;
   top: -1px;
 }
 .form-entey-toolbar{
   padding:0 10px 10px;
   display: flex;
   justify-content: space-between;
 }
  .form-entey-left-toolbar,
  .form-entey-right-toolbar{
    display: flex;
    justify-content: flex-start;
  }
  .form-entey-toolbar li{
    margin-right: 12px;
  }
@media screen and (max-width: 1280px){
  .tb-referenceText{
    max-width: 10vw;
  }
}
@media screen and (min-width: 1280px) and (max-width: 1366px){
  .tb-referenceText{
    max-width: 17vw;
  }
}
@media screen and (min-width: 1366px) and (max-width: 1600px){
  .tb-referenceText{
    max-width: 22vw;
  }
}
@media screen and (min-width: 1600px) and (max-width: 1920px){
  .tb-referenceText{
    max-width: 29vw;
  }
}
</style>
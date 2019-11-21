<template>
  <div>
    <el-dialog
      :title="dialogTitle === 'ADD' ? '新增共享件':'编辑共享件'"
      :visible.sync="dialogVisible"
      width="30%"
      v-el-drag-dialog
      :close-on-click-modal="false"
    >
      <div @click="hiddenSameNameList">
        <el-form
          :model="feildForm"
          ref="feildForm"
          label-position="top"
          :rules="rules"
          label-width="60px"
        >
          <el-form-item prop="category" label="业务类别">
            <el-select
              v-model="feildForm.category"
              placeholder="请选择业务类别"
              size="small"
              style="width:100%"
              :disabled="dialogTitle !== 'ADD' || !showCategory"
              clearable
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name" label="共享件名称">
            <div @click.stop>
              <!-- <el-input
                v-model="feildForm.name"
                placeholder="请输入共享件名称"
                size="small"
                clearable
                ref='inputFocus'
                @input="getSameNamePartsList"
                @focus="isShowSameNameList = true">
              </el-input> -->
              <keyListener 
                v-model="feildForm.name" 
                size='small' 
                inputRef='inputFocus' 
                @input="getSameNamePartsList"
                @focus="isShowSameNameList = true"  
                placeholder="请输入共享件名称" />
            </div>
            <div
              class="parst-search-box"
              v-show="isShowSameNameList && sameNameList.length"
              @click.stop="isShowSameNameList = true"
            >
              <div class="title-box">
                <h4 class="title">相似共享件字段一览表</h4>
                <i class="el-icon-close" @click.stop="isShowSameNameList = false"></i>
              </div>
              <el-scrollbar class="el-scrollbar_height">
                <ul class="field-box" @click="changeActiveNames" v-loading="loading">
                  <li v-for="(item) of sameNameList" :key="item.id">
                    <el-popover placement="right" width="280" trigger="hover">
                      <div class="popover-box">
                        <p>
                          <span>名字:</span>
                          {{item.name}}
                        </p>
                        <p>
                          <span>描述:</span>
                          {{item.describe}}
                        </p>
                      </div>
                      <span slot="reference">
                        <span class="filed-content">{{item.name}}</span>
                        <i class="iconfont icon-tupian" v-show="item.shareComponentType === 'IMAGE'"></i>
                        <span
                          v-for="icons of item.markingIcon"
                          :key="icons"
                          class="markingIcon"
                        >{{markingIcon(icons)}}</span>
                      </span>
                    </el-popover>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </el-form-item>
          <el-form-item prop="shareComponentType" label="类型">
            <el-select
              v-model="feildForm.shareComponentType"
              placeholder="请选择类型"
              size="small"
              style="width:100%"
              :disabled="dialogTitle !== 'ADD'"
              clearable
              @focus="isShowSameNameList = false"
            >
              <el-option
                v-for="item in feildTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="" v-if='isShowHideRuleSetting'>
            <el-checkbox v-model="feildForm.tableHeaderAndNumHidden" v-if="feildForm.shareComponentType === 'TABLE'">隐藏表号表名</el-checkbox>
            <el-checkbox v-model="feildForm.imageNameAndNumHidden" v-if="feildForm.shareComponentType === 'IMAGE'">隐藏图号图名</el-checkbox>
          </el-form-item>
          <el-form-item prop="sharePartsHideType" label="隐藏" v-if='isShowHideRuleSetting'>
            <el-select
              v-model="feildForm.hideRule.hideRuleType"
              placeholder="请选择隐藏规则"
              size="small"
              style="width:100%"
              clearable
            >
              <el-option
                v-for="item in sharePartsHideTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div class="hiderule-box" v-if="feildForm.hideRule.hideRuleType === 'CUSTOM_CONDITION_HIDDEN'"> 
              <tree-ship v-model="feildForm.hideRule.customHideRule" size='mini'>
                <template slot="name">如果</template>
              </tree-ship>
              <p class="hiderule-tips-text">为真，则隐藏</p>
            </div>
          </el-form-item>
          <el-form-item label="描述">
            <keyListener 
              v-model="feildForm.describe" 
              size='medium'
              type="textarea" 
              placeholder="请输入共享件名称" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleDialog" size="medium">取 消</el-button>
        <el-button
          type="primary"
          @click="saveBtn(true)"
          size="medium"
          v-show="feildForm.shareComponentType !== 'TABLE' && isShowAddRules"
        >规则配置</el-button>
        <el-button
          type="primary"
          @click="saveBtn()"
          size="medium"
          v-if="feildForm.shareComponentType !== 'TABLE'"
        >保 存</el-button>
        <el-button type="primary" @click="nextStep" v-else size="medium">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 设置表格 -->
    <el-dialog
      :title="tbDialogTitle"
      :visible.sync="tbDialogVisible"
      v-el-drag-dialog
      width="40%"
      :custom-class="hideDialog('tbDialogVisible') ? 'hideDialog' : '' "
      :close-on-click-modal="false">
      <div class="tableForm">
        <el-form
          :model="tableForm"
          ref="tableForm"
          label-position="left"
          inline-message
          label-width="110px"
        >
          <el-form-item label="表头选择">
            <el-radio-group v-model="tableForm.tableHeadType">
              <el-radio label="TOP">默认为行表头</el-radio>
              <el-radio label="LEFT">默认为列表头</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自动填充序号">
            <el-checkbox v-model="tableForm.serialType">勾选后随项目数据填充自动生成序号</el-checkbox>
          </el-form-item>
          <el-form-item
            label="选择表头数"
            style="margin-bottom:12px;"
          >
            <el-input-number v-model="tableForm.number" :min="1" size="mini" controls-position="right"></el-input-number>
          </el-form-item>
        </el-form>
        <div>
          <p class="tips">PS：点击确认建表后，即在生成的表格中新建表头以及配置规则！系统将在生 成报告的时候，自动根据规则在表头填充内容。</p>
        </div>
        <div class="table-box" ref='table-box'>
          <table class="tbData" border="1" >
            <thead>
              <tr>
                <th v-for="(item,index) of thData" :key="item.tableHeadId">
                  <div v-if='!item.isEdit'>
                    <span @click.stop="addThField(item)" class='name'>{{ item.tableHeadName || item.name }}</span>
                    <i
                      class="iconfont icon-i-shezhishuju"
                      @click.stop="editThField(item)"
                      title="设置共享件"
                      v-if="item.name !== '#'"
                    ></i>
                    <el-popover
                      placement="top"
                      width="160"
                      v-model="item.deletePopoverVisible"
                      >
                      <p>是否删除该列？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click.stop="item.deletePopoverVisible = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="deleteTr(item.tableHeadId,index)">确定</el-button>
                      </div>
                      <i
                        slot="reference"
                        class="iconfont icon-shanchu"
                        title="删除"
                        @click.stop="openTablePopoverVisible(item)"
                        v-if="item.name !== '#' && thData.length > 1">
                      </i>
                    </el-popover>
                    <i
                      class="iconfont icon-liecharu"
                      @click="insertTr(index)"
                      title="向右添加一列"
                    ></i>
                  </div>
                  <el-input v-model="item.tableHeadName" v-focus='item.tableHeadId === curcheckThId' placeholder="请输入表头名称" size='mini' v-else @blur='item.isEdit = false'></el-input>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="(item,index) of thData" :key="index">
                  <el-button
                    size="mini"
                    @click="addRules(item)"
                    v-if="item.tableHeadNode && !item.markingIcon.includes('PROJECT') && isShowAddRules"
                    :class="{'add-rules-style':judgeTrIsHaveRules(item.tableHeadId)}"
                  >规则配置</el-button>
                </td>
              </tr>
              <tr>
                <td v-for="(item,i) of thData" :key="i">
                  <el-popover
                      v-if="item.tableHeadNode && item.markingIcon.includes('PROJECT') && isShowAddRules"
                      placement="top"
                      width="220"
                      v-model="item.mergePopoverVisible"
                      title="项目数据合并设置"
                      >
                      <div class="data-merge-box">
                        <el-radio-group v-model="dataMergeForm.mergeType">
                          <el-radio label="NOT_MERGE">不合并</el-radio>
                          <el-radio label="MERGE_BY_DIMENSION">合并
                            <el-button size="mini" @click="addMergeRules(item)" v-if="dataMergeForm.mergeType === 'MERGE_BY_DIMENSION'" style="margin-left:10px;">选择维度字段</el-button>
                          </el-radio>
                        </el-radio-group>
                      </div>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click.stop="item.mergePopoverVisible = false">取消</el-button>
                        <el-button type="primary" size="mini" @click.stop="dataMergeComfirm(item.tableHeadId)">确定</el-button>
                      </div>
                      <el-button
                        size="mini"
                        slot="reference"
                        @click.stop="openMergePopoverVisible(item)"
                        :class="{'add-rules-style':item.dataMergeConfig && item.dataMergeConfig.mergeType ==='MERGE_BY_DIMENSION' }"
                      >项目数据合并</el-button>
                    </el-popover> 
                </td>
              </tr>
              <tr >
                <td v-for="(item,index) of thData" :key="index">
                  <el-checkbox v-model="item.hideInReport" v-show="item.tableHeadNode" >报告不显示</el-checkbox>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 表格数据输出过滤条件设置 -->
      <table-data-filter 
        :model='feildForm.filterRule'
        :title="tbDialogTitle" 
        :thData='thData' 
        :shareComponentRuleList='shareComponentRuleList'
        @change="getTableFilterRules"
        v-if='thData.length'/>
      <el-dialog
        width="35%"
        :title="thFieldForm.tableHeadName ? '设置'+ thFieldForm.tableHeadName + '表头共享件':'设置共享件'"
        :visible.sync="innerVisible"
        append-to-body
        v-el-drag-dialog
        :show-close="false"
        :close-on-click-modal="false"
        :custom-class="hideDialog('tbDialogVisible') ? 'hideDialog' : '' "
      >
        <el-form
          :model="thFieldForm"
          ref="thFieldForm"
          label-position="top"
          label-width="60px"
          :rules="thFieldRules"
        >
          <el-form-item prop="name" label="共享件名称" >
            <div @click.stop>
              <el-input
                v-model="thFieldForm.name"
                placeholder="请输入共享件名称"
                size="small"
                clearable
                class='shartPartName'
                @input="getPartsList"
                @focus="isShowSameNameList = true"
              ></el-input>
            </div>
            <div
              class="parst-search-box"
              v-show="isShowSameNameList && sameNameList.length"
              @click.stop="isShowSameNameList = true"
            >
              <div class="title-box">
                <h4 class="title">
                  相似共享件字段一览表
                  <span style="font-size:12px;">(双击选择该共享件)</span>
                </h4>
                <i class="el-icon-close" @click.stop="isShowSameNameList = false"></i>
              </div>
              <el-scrollbar class="el-scrollbar_height">
                <ul class="field-box" @click="changeActiveNames" v-loading="loading">
                  <li v-for="(item) of sameNameList" 
                    :key="item.id" 
                    @dblclick="choiceFiled(item)">
                    <el-popover placement="right" width="280" trigger="hover">
                      <div class="popover-box">
                        <p>
                          <span>名字:</span>
                          {{item.name}}
                        </p>
                        <p>
                          <span>描述:</span>
                          {{item.describe}}
                        </p>
                      </div>
                      <span slot="reference">
                        <span class="filed-content">{{item.name}}</span>
                        <i class="iconfont icon-tupian" v-show="item.shareComponentType === 'IMAGE'"></i>
                        <span
                          v-for="icons of item.markingIcon"
                          :key="icons"
                          class="markingIcon"
                        >{{markingIcon(icons)}}</span>
                      </span>
                    </el-popover>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="thFieldForm.describe"
              type="textarea"
              placeholder="请输入描述"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleThFieldDialog" size="medium">取 消</el-button>
          <el-button type="primary" @click="addOrdinaryField" size="medium">保 存</el-button>
        </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleTbDialog" size="medium">取 消</el-button>
        <el-button
          type="primary"
          @click="addTable('tableForm')"
          style="margin:10px 0 15px"
          v-show="isSetTable"
          size="medium"
        >确认建表</el-button>
        <el-button type="primary" @click="saveTable" v-show="!isSetTable" size="medium">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 提示编辑过后模板更新提示 -->
    <el-dialog width="35%" title="提示" :visible.sync="updateVisible" :close-on-click-modal="false" v-el-drag-dialog>
      <div class="update-tips_box">
        <i class="el-icon-warning"></i>
        <span>该共享件名称发生变化，请选择更新范围：</span>
        <p class="tips">PS：仅更新现行版本，历史版本不变。</p>
      </div>
      <div class="template-box">
        <el-checkbox-group v-model="checkedTemplates" @change="handleCheckedCitiesChange">
          <el-checkbox
            v-for="item of templatesOption"
            :label="item.value"
            :key="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div style="margin:30px 0 0 30px;">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkTempAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleUpdateVisible" size="medium">取 消</el-button>
        <el-button type="primary" @click="updateTemplate" :loading="updateVisibleLoading" size="medium">保 存</el-button>
      </span>
    </el-dialog>
    <reportRules 
    v-if="isShowReportRulesComponent"
    ref="cus-reportRules" 
    @getTrRules="getTrRules" 
    @refreshList="refreshShareParts" 
    @destroyed='destroyedReportRulesComponent'
    :tableheadShareParts='tableheadShareParts' />
     <!-- 选择共享件或者系统变量 -->
    <search-sharePart  @change="getCheckShareParts" valueType="string" ref='searchSharePart' :isTable='true' :tableheadShareParts='tableheadShareParts'/>
  </div>
</template>
<script>
import reportRules from "@/views/reportRules/index.vue";
import tableDataFilter from "./tableDataFilter.vue";
import TreeShip from "@/components/tools/TreeShip/TreeShip.vue";
import searchSharePart from "../../reportRules/components/searchSharePart.vue";
import keyListener from "@/components/tools/keyListener.vue";
import {guid, debouce} from "../../../utils.js";
const validateName = (rule, value, callback) => {
  if (value && /^[ ]*$/.test(value)) {
    callback(new Error('内容不能全为空格！'))
  }
  callback()
}
export default {
  name: "addSharedParts",
  components: { reportRules , tableDataFilter, TreeShip, searchSharePart, keyListener },
  data() {
    return {
      showCategory: true,
      //添加共享件
      feildForm: {
        name: "",
        category: "",
        categoryType:"",
        shareComponentType: "TEXT", //字段类型
        tableHeaderAndNumHidden:false,
        imageNameAndNumHidden :false,
        describe: "",
        tableHeadNode: [],
        tableHeadType: "NONE",
        serialType: "NONE",
        dataMergeConfig:{ // 数据合并
          mergeDimensionFields: [],
          mergeType: "NOT_MERGE"
        },
        hideRule:{
          customHideRule:[],
          hideRuleType:'NOT_HIDDEN'
        }, // 隐藏规则
        filterRule : {
          customFilterRule : [],
          filterRuleType : 'CUSTOM',
          tableHeadFilterRule : []
        }
      },
      dataMergeForm:{  // 数据合并表单
        mergeDimensionFields:[],
        mergeType:'NOT_MERGE'
      },
      //创建表头
      tableForm: {
        serialType: false,
        tableHeadType: "TOP",
        number: 3,
      },
      hideInReport:false, //该表头报告中是否不显示
      //添加共享件/添加表头字段
      thFieldForm: {
        name: "",
        describe: "",
        tableHeadName:'', //表头名称
        tableHeadNode: []
      },
      shareComponentRuleList: [], //规则
      rules: {
        name: [
          { required: true, message: "请输入共享件名称", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ],
        category: { required: true, message: "请选择业务类别", trigger: "change" },
      },
      thFieldRules:{
        name: [
          { required: true, message: "请输入共享件名称", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ]
      },
      editData: {}, //当前修改的共享件数据
      thData: [], //表头
      trScrollbarDistance: 0, //表头滚动条的%距离
      isSetTable: true, //是否创建一个表格模板
      curcheckThId: "", //当前选择的表头id
      curEditSharePartId: "", //当前修改的共享件id
      dialogTitle: "ADD", //对话框标题
      tbDialogTitle: "", //表格标题
      dialogVisible: false, //字段
      tbDialogVisible: false, //表格设置
      thFieldDialogTitle: "", //ADD 添加  EDIT 修改
      innerVisible: false, //内层添加表格字段
      updateVisible: false, //共享件编辑过后是否更新被引用的模版提示框
      categoryList: [], //评价大类
      curcheckThShrePartId: "", //当前设置表头的共享件id
      hideDialogList:[], //需要隐藏的弹框列表
      feildTypeList: [
        { label: "普通字段", value: "TEXT" },
        { label: "图片", value: "IMAGE" },
        { label: "表格", value: "TABLE" }
      ], //类型
      sharePartsHideTypeList:[
        { label: "不隐藏共享件", value: "NOT_HIDDEN"},
        { label: "无条件隐藏共享件", value: "MUST_BE_HIDDEN"},
        { label: "有条件隐藏共享件", value: "CUSTOM_CONDITION_HIDDEN"},
        // { label: "仅隐藏表号表名", value: "TABLE_HEADER_AND_NUM_HIDDEN"},
        // { label: "仅隐藏图号图名", value: "IMAGE_NAME_AND_NUM_HIDDEN"},
      ],
      hideTypeOptions:[],
      sameNameList: [], //相似列表
      isShowSameNameList: false, //是否显示相似列表
      loading: false,
      updateVisibleLoading: false, //更新范围loading
      activeNames: [], //保存展开的相似列表名字
      checkTempAll: false, //是否全选
      templatesOption: [], // 引用该字段的模板列表
      checkedTemplates: [],
      isIndeterminate: true,
      isShowReportRulesComponent:false,
    };
  },
  computed: {
    serialType() {
      return this.tableForm.serialType;
    },
    isShowEditRulesBtn(){
      return this.feildForm.shareComponentType !== 'TABLE' && this.dialogTitle !== 'ADD' && this.editData.markingIcon && (!this.editData.markingIcon.includes('PROJECT'))
    },
    tableheadShareParts(){
      return this.thData.map(item => ({id:item.tableHeadId,name:item.name})).filter(item => !['#','请建表头'].includes(item.name))
    }
  },
  props: {
    defaultFeildTypeList: {
      //可选的类型对应的value值
      type: Array,
      default: () => {
        return [];
      }
    },
    //是否显示规则配置按钮
    isShowAddRules:{
      type:Boolean,
      default:true
    },
    isShowHideRuleSetting:{ // 是否能够设置隐藏规则
      default:true,
    }
  },
  created() {
    this.initFeildTypeList(); //初始化共享件类型
    this.getCategories();
    let _this = this
    document.body.addEventListener('click', this.showSameNameList)
  },
  destroyed(){
    document.body.removeEventListener('click', this.showSameNameList)
  },
  watch: {
    serialType(val) {
      if (val) {
        this.thData.unshift({ name: "#", tableHeadId: guid() });
      } else {
        this.thData = this.thData.filter(item => item.name !== "#");
      }
    },
    dialogVisible(val) {
      if (!val && this.feildForm.shareComponentType !== "TABLE") {
        this.$refs["feildForm"].resetFields();
        this.editData = {};
        this.resetFeildForm()
      }
    },
    updateVisible(val) {
      if (!val) {
        this.checkTempAll = false;
        this.checkedTemplates = []
      }
    },
    innerVisible(val) {
      this.isShowSameNameList = val;
      if (!val) {
        this.$refs["thFieldForm"].resetFields();
        this.thFieldForm = {
          name: "",
          describe: "",
          tableHeadNode: [],
        };
        this.sameNameList = [];
      }else{
        this.$nextTick(() =>{
          document.querySelector('.shartPartName .el-input__inner').focus();
        }) 
      }
    },
    tbDialogVisible(val) {
      if (!val) {
        this.resetTable();
        this.shareComponentRuleList = [];
        this.$refs["feildForm"].resetFields();
        this.editData = {};
        this.resetFeildForm()
      }
    }
  },
  methods: {
    showSameNameList(){
      this.isShowSameNameList = false;
    },
    getSameNamePartsList:debouce(function(val){
      const newVal = val.replace(/^[ ]*$/, '')
      newVal && this.getSameNameParts(newVal)
    }, 300),
    getPartsList:debouce(function(val){
      const newVal = val.replace(/^[ ]*$/, '')
      newVal && this.getPartsList(newVal, 'TEXT')
    }, 300),
    /**
     * 获取类别树
     */
    getCategories() {
      this.$http.reportService.getCategoryTree().then(res => {
        this.categoryList = res.data.childList;
      });
    },
    //判断当前表头是否添加规则
    judgeTrIsHaveRules(id) {
      if (!this.shareComponentRuleList.length) {
        return false;
      }
      //共享件id
      return this.shareComponentRuleList.some(
        item => item.outputFieldId === id
      );
    },
    getCheckShareParts(data){
      const id = this.curcheckThId
      this.thData = this.thData.map(item =>{
        if(item.tableHeadId === id){
          item.dataMergeConfig = {
            mergeDimensionFields: data,
            mergeType: "MERGE_BY_DIMENSION"
          }
        }
        return item
      })
    },
    //全选
    handleCheckAllChange(val) {
      this.checkedTemplates = val ? this.templatesOption.map(item => item.value) : [];
      this.isIndeterminate = false;
    },
    //选中值改变
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkTempAll = checkedCount === this.templatesOption.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.templatesOption.length;
    },
    //关闭更新框
    cancleUpdateVisible() {
      this.updateVisible = false;
    },
    //更新模板
    updateTemplate() {

    },
    //隐藏相似列表
    hiddenSameNameList(e) {
      if (e.target.tagName.toUpperCase() !== "INPUT") {
        this.isShowSameNameList = false;
      }
    },
    openDialog(type, category = "", showCategory = true) {
      this.dialogTitle = type;
      this.isSetTable = type === "ADD";
      this.feildForm.category = category;
      this.feildForm.categoryType = category.split('-')[0]
      this.showCategory = showCategory;
      this.dialogVisible = true;
      if(showCategory) return
      this.$nextTick(()=>{
        //报告模板中自动获取焦点
        this.$refs.inputFocus.$el.firstElementChild.focus()
      })
    },
    cancleDialog() {
      this.dialogVisible = false;
    },
    //关闭表格设置框
    cancleTbDialog() {
      this.tbDialogVisible = false;
      // this.dialogVisible = true
    },
    //添加表格
    addTable() {
      this.$refs["tableForm"].validate(valid => {
        if (valid) {
          for (let i = 1; i <= this.tableForm.number; i++) { // deletePopoverVisible 删除弹框开关
            let obj = { name: "请建表头", tableHeadId: guid(), deletePopoverVisible:false, mergePopoverVisible:false }
            this.thData.push(obj);
          }
          this.isSetTable = false;
        }
      });
    },
    //重置表格
    resetTable() {
      this.$refs["tableForm"].resetFields();
      this.thData = [];
      this.isSetTable = true;
      this.tableForm = {
        serialType: false,
        tableHeadType: "TOP",
        number: 3
      };
    },
    //添加表格字段
    addThField(item) {
      if (item.name !== "#") {
        if(item.customerId){
          item.isEdit = true
          return
        }
        this.curcheckThId = item.tableHeadId;
        this.thFieldDialogTitle = 'ADD';
        this.innerVisible = true;
      }
    },
    //修改表头字段
    editThField(item){
       if(item.customerId){ //修改绑定的共享件
          this.thFieldForm = {
            name: item.name,
            tableHeadName:item.tableHeadName,
            describe: item.describe,
          }
          this.thFieldDialogTitle = 'EDIT';
        }else{
          //新增表头
          this.thFieldDialogTitle = 'ADD';
        }
      this.curcheckThId = item.tableHeadId;
      this.innerVisible = true; 
    },
    //添加字段保存
    saveBtn(isGoAddRules = false) {
      this.$refs["feildForm"].validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.feildForm));
          if (this.dialogTitle === "EDIT") {
            params.shareComponentRuleList = this.shareComponentRuleList;
          }
          params.tableHeadNode = this.thData
          this.saveShareParts(
            this.curEditSharePartId,
            params,
            this.dialogTitle,
            ["dialogVisible"],
            isGoAddRules
          );
        }
      });
    },
    /**
     * 保存共享件函数 
     * @param { String } id 当前修改字段的id
     * @param { Object } params 接口参数
     * @param { String } dialogTitle 新增还是修改 ADD / EDIT
     * @param { String } dialogVisible 要关闭的窗口 
     * @param { Boolean } isGoAddRules 是否去添加规则
     */
    saveShareParts(id, params, dialogTitle, dialogVisible,isGoAddRules) {
      //新增
      if (dialogTitle === "ADD") {
        this.$http.sharedPartsService
          .addSharePart(params)
          .then(res => {
            //关闭弹窗
            dialogVisible.forEach(ele => {
              ele === "innerVisible" && this.choiceFiled(res.data);  //将共享件插入表头
              this[ele] = false;
            });
            this.$message({
              message: "共享件添加成功",
              type: "success"
            });
            this.refreshShareParts(); //回调刷新共享池
            if(isGoAddRules){
              this.ordinaryFiledAddRules(res.data.id, params.name, params.shareComponentType) //去添加规则
            }
          })
      } else {
        // this.hideDialogList.push('innerVisible','tbDialogVisible') 
        // this.$confirm('您正在修改共享件, 是否继续?', '', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
          //修改
          this.$http.sharedPartsService.editSharePart(id, params).then(res => {
            // this.templatesOption = res.data.quoteRelationList;          //暂时停用更新模板
            // this.updateVisible = !!res.data.quoteRelationList.length;
            dialogVisible.forEach(ele => {
              ele === "innerVisible" && this.choiceFiled(res.data.shareComponent);  //将共享件插入表头
              this[ele] = false;
            });
            this.$message({
              message: "共享件修改成功",
              type: "success"
            });
            this.hideDialogList = []
            this.refreshShareParts(); //回调刷新共享池
            if(isGoAddRules){
              const {id, name, shareComponentType} = res.data.shareComponent
              this.ordinaryFiledAddRules(id, name, shareComponentType) //去添加规则
            }
          });
        // }).catch(()=>{
        //   this.hideDialogList = []
        // })
      }
    },
    //保存表格
    saveTable() {
      let params = JSON.parse(JSON.stringify(this.feildForm));
      params.tableHeadNode = JSON.parse(JSON.stringify(this.thData)).map(item =>{
            if(!item.dataMergeConfig){
              item.dataMergeConfig = {
                mergeDimensionFields:[],
                mergeType:'NOT_MERGE'
              }
            }
            return item
          });;
      params.tableHeadType = this.tableForm.tableHeadType;
      params.serialType = this.tableForm.serialType ? "YES" : "NO";
      params.shareComponentRuleList = this.shareComponentRuleList;
      if (!this.thData.some(item => item.name === "请建表头")) {
        if (this.tableForm.serialType) {
          params.tableHeadNode.splice(0, 1);
        }
        this.saveShareParts(this.curEditSharePartId, params, this.dialogTitle, [
          "dialogVisible",
          "tbDialogVisible"
        ]);
      } else {
        this.$message.error("有表头还未设置共享件");
      }
    },
    //取消添加表格字段
    cancleThFieldDialog() {
      this.innerVisible = false;
      this.$refs["thFieldForm"].resetFields();
      this.thFieldForm = {
        name: "",
        describe: "",
      };
    },
    //添加表格字段
    addOrdinaryField() {
      this.$refs["thFieldForm"].validate(valid => {
        if (valid) {
          let params = {
            name: this.thFieldForm.name,
            describe: this.thFieldForm.describe,
            category: this.feildForm.category,
            categoryType:this.feildForm.categoryType,
            tableHeadNode: [],
            enableOrDisable: "ENABLE",
            tableHeadType: "NONE",
            serialType: "NONE",
            shareComponentType: "TEXT" //字段类型
          };
          if(this.thFieldDialogTitle !== 'ADD'){
            this.hideDialogList.push('innerVisible','tbDialogVisible') 
            this.$confirm("<p class='comfire-title'>您正在修改共享件, 是否继续？</p><p class='comfire-text'>此操作将修改共享池的共享件。</p>",'',{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString:true,
              type: 'warning'
            }).then(() => {
              this.saveShareParts(
                this.curcheckThId,
                params,
                this.thFieldDialogTitle,
                ["innerVisible"]
              );
            }).catch(()=>{
              this.hideDialogList = []
            })
          }else{
            this.saveShareParts(this.curcheckThId, params, this.thFieldDialogTitle, ["innerVisible"]);
          }
        }
      });
    },
    //下一步设置表格
    nextStep() {
      this.$refs["feildForm"].validate(valid => {
        if (valid) {
          this.isShowSameNameList = false //关闭搜素显示框
          this.sameNameList = [];
          this.tbDialogTitle = this.feildForm.name;
          this.dialogVisible = false;
          this.$nextTick(() => {
            this.tbDialogVisible = true;
          });
          if (this.dialogTitle === "EDIT") {
            this.tableForm = {
              serialType: this.editData.serialType === "YES",
              tableHeadType: this.editData.tableHeadType,
              number: this.editData.tableHeadNode.length
            };
            this.thData = this.editData.tableHeadNode.map(item => {
              this.$set(item,'hideInReport',item.hideInReport || (false)) //初始化是否不显示字段
              this.$set(item,'tableHeadName',item.tableHeadName || '')
              this.$set(item,'isEdit',false) //是否在编辑表头名称
              return item
            });
            // this.thData = this.editData.tableHeadNode;
          }
        }
      });
    },
    //获取表格筛选规则
    getTableFilterRules(data){
      this.feildForm.filterRule = JSON.parse(JSON.stringify(data))
    },
    closeDeleteDialog(){
      document.body.click()
    },
    //删除表头
    deleteTr(tableHeadId, index) {
      this.thData.splice(index,1)
      // this.thData = this.thData.filter((item, i) => (item.tableHeadId !== tableHeadId && index != i));
      this.shareComponentRuleList = this.shareComponentRuleList.filter(item => item.outputFieldId !== tableHeadId)
      //规则删除后同步删除表格过滤规则里面选择的表头规则
      this.feildForm.filterRule.tableHeadFilterRule = this.feildForm.filterRule.tableHeadFilterRule.filter(item => item !== tableHeadId)
      this.closeDeleteDialog()
    },
    //插入表头
    insertTr(index) {
      let obj = {
        name: "请建表头",
        tableHeadId: guid(),
        deletePopoverVisible:false,
        mergePopoverVisible:false,
      }
      this.thData.splice(index + 1, 0 , obj)
      if(index === this.thData.length - 2){
        const timer = setTimeout(()=>{
          this.$refs['table-box'].scrollLeft = 10000; 
          clearTimeout(timer)
        },50)
      }
    },
    //表头字段添加规则
    addRules(item) {
      this.curcheckThShrePartId =
        this.dialogTitle === "EDIT" ? item.tableHeadId : item.id;
      let data = this.shareComponentRuleList.find(
        item2 => item2.outputFieldId === this.curcheckThShrePartId
      );
      this.loadReportRulesComponent([data, item.name, "TABLE", this.feildForm.category]);
    },
    // 加载规则设置组件
    loadReportRulesComponent(params){
      this.isShowReportRulesComponent = true;
      this.$nextTick(()=>{
        this.$refs["cus-reportRules"].openDialog(...params);
      })
    },
    // 销毁设置规则组件
    destroyedReportRulesComponent(){
      this.isShowReportRulesComponent = false
    },
    // 添加数据合并规则
    addMergeRules(item){
      this.curcheckThId = item.tableHeadId
      let mergeDimensionFields = []
      if(item.dataMergeConfig){
        mergeDimensionFields = item.dataMergeConfig.mergeDimensionFields
      }else{
        mergeDimensionFields = []
      }
      this.$refs.searchSharePart.openDialog(mergeDimensionFields) //重置搜索条件
    },
    //普通共享件设置规则
    ordinaryFiledAddRules(id, name, type) {
      this.$refs["cus-reportRules"].openDialog(id, name, type);
      this.$nextTick(() => {
        this.dialogVisible = false;
      });
    },
    /**
     * @param { Boolean } isDelete  是否删除规则
     * @param { Array } data  //规则数据
     *  */
    //获取表头规则     
    getTrRules(data,isDelete = false) {  
      if(isDelete){  
        this.shareComponentRuleList = this.shareComponentRuleList.filter(item => item.outputFieldId !== this.curcheckThShrePartId);
        //规则删除后同步删除表格过滤规则里面选择的表头规则
        this.feildForm.filterRule.tableHeadFilterRule = this.feildForm.filterRule.tableHeadFilterRule.filter(item => item !== this.curcheckThShrePartId)
      }else{
        for(let i = 0; i<this.shareComponentRuleList.length; i++){
          if (this.shareComponentRuleList[i].outputFieldId === this.curcheckThShrePartId) {
            this.shareComponentRuleList.splice(i,1,data)
            return 
          }
        }
        data.outputFieldId = this.curcheckThShrePartId;
        this.shareComponentRuleList.push(data);
      } 
    },
    //给表头选择共享件
    choiceFiled(data) {
      let sharePartId = '' //新选择的共享件id
      this.thData = this.thData.map(item => {
        if (item.tableHeadId === this.curcheckThId) {
          sharePartId = data.id  // 用于修改来源后修改对应规则绑定的来源id
          this.$set(data,'hideInReport',item.hideInReport || (false)) //报告不显示
          this.$set(data,'tableHeadName',item.tableHeadName || data.name) //表头名称
          this.$set(data,'isEdit',false) //是否在编辑表头名称
          return data;
        }
        return item;
      })
      //重新选择共享件，修改规则绑定的来源id
      this.shareComponentRuleList = this.shareComponentRuleList.map(item => {
        if(item.outputFieldId === this.curcheckThId){
          item.outputFieldId = sharePartId
        }
        return item
      })
      this.innerVisible = false;
    },
    //改变打开的列表
    changeActiveNames(e) {
      let id = e.target.getAttribute("data-id");
      if (e.target.tagName.toUpperCase() === "H5" || e.target.tagName.toUpperCase() === "SPAN") {
        if (this.activeNames.some(item => item === id)) {
          this.activeNames = this.activeNames.filter(item => item != id);
        } else {
          this.activeNames.push(id);
        }
      }
    },
    // 刷新回调
    refreshShareParts() {
      this.$emit("refreshShare");
    },
    //是否打开详情
    isOpen(id) {
      return this.activeNames.some(item => item === id);
    },
    // --------------------------------接口函数--------------------------------------------------
    //初始化类型
    initFeildTypeList() {
      if (!this.defaultFeildTypeList.length) {
        return;
      }
      this.feildTypeList = this.feildTypeList.filter(item => {
        return this.defaultFeildTypeList.some(item2 => item2 === item.value);
      });
    },
    //根据名称获取同一大类下面的相似共享件
    getSameNameParts(name, shareComponentType = "") {
      this.isShowSameNameList = true;
      this.$http.sharedPartsService
        .getSameNameParts({
          name,
          shareComponentType,
          category: this.feildForm.category
        })
        .then(res => {
          this.sameNameList = res.data;
        });
    },
    //根据名称获取同一大类下面的共享件
    getPartsList(name, shareComponentType = "") {
      this.isShowSameNameList = true;
      this.$http.sharedPartsService
        .getPartsList({
          name,
          shareComponentType,
          category: this.feildForm.category
        })
        .then(res => {
          this.sameNameList = res.data;
        });
    },

    //通过id获取共享件
    getSharedPartsFieldById(id) {
      this.curEditSharePartId = id;
      this.$http.sharedPartsService.getSharedPartsFieldById(id).then(res => {
        this.editData = this.fommatData(res.data)
        this.shareComponentRuleList = res.data.shareComponentRuleList || [];
        this.feildForm = {
          name: res.data.name,
          category: res.data.category,
          shareComponentType: res.data.shareComponentType, //字段类型
          tableHeaderAndNumHidden:res.data.tableHeaderAndNumHidden,
          imageNameAndNumHidden:res.data.imageNameAndNumHidden,
          describe: res.data.describe,
          tableHeadNode: [],
          hideRule:res.data.hideRule || {
            customHideRule:[],
            hideRuleType:'NOT_HIDDEN'
          }, // 隐藏规则
          filterRule : res.data.filterRule || {
            customFilterRule : [],
            filterRuleType : 'CUSTOM',
            tableHeadFilterRule : []
          }
        };
        this.openDialog("EDIT",res.data.category);
      });
    },
    // 格式化需要的结构
    fommatData(data){
      data.tableHeadNode.map(item =>{
        if(!item.dataMergeConfig){
          item.dataMergeConfig = { // 数据合并
            mergeDimensionFields: [],
            mergeType: "NOT_MERGE"
          }
        }
        return item
      })
      return data
    },
    //需要隐藏的弹框
    hideDialog(dialog){
      return this.hideDialogList.some(item => item === dialog )
    },
    // // 共享件类型改变
    // shareComponentTypeChange(type){
    //   this.HideTypeList(type)
    //   if(['IMAGE_NAME_AND_NUM_HIDDEN','TABLE_HEADER_AND_NUM_HIDDEN'].includes(this.feildForm.hideRule.hideRuleType)){
    //     this.feildForm.hideRule.hideRuleType = ''
    //   }
    // },
    // HideTypeList(type = 'TEXT'){
    //   if(type === 'TABLE'){
    //     this.hideTypeOptions = this.sharePartsHideTypeList.filter(item => item.value !== 'IMAGE_NAME_AND_NUM_HIDDEN')
    //   }else if(type === 'IMAGE'){
    //     this.hideTypeOptions = this.sharePartsHideTypeList.filter(item => item.value !== 'TABLE_HEADER_AND_NUM_HIDDEN')
    //   }else{
    //     this.hideTypeOptions = this.sharePartsHideTypeList.filter(item => !['TABLE_HEADER_AND_NUM_HIDDEN','IMAGE_NAME_AND_NUM_HIDDEN'].includes(item.value ))
    //   }
    // },
    //共享件隐藏类型改变
    hideRuleTypeChange(type){
      this.feildForm.hideRule.customHideRule = [] // 清空上次的规则设置
    },
    openTablePopoverVisible(item){
      document.body.click()
      setTimeout(()=>{
        item.deletePopoverVisible = true
      },50)
    },
    openMergePopoverVisible(item){
      document.body.click()
      setTimeout(()=>{
        item.mergePopoverVisible = true
      },50)
      if(!item.dataMergeConfig){
        item.dataMergeConfig = {
          mergeDimensionFields:[],
          mergeType:'NOT_MERGE'
        }
      }
      this.dataMergeForm.mergeDimensionFields = item.dataMergeConfig.mergeDimensionFields
      this.dataMergeForm.mergeType = item.dataMergeConfig.mergeType
    },
    dataMergeComfirm(id){
      this.thData = this.thData.map(item => {
        if(item.tableHeadId === id){
          item.dataMergeConfig.mergeDimensionFields = this.dataMergeForm.mergeType === 'NOT_MERGE' ? [] : this.dataMergeForm.mergeDimensionFields
          item.dataMergeConfig.mergeType = this.dataMergeForm.mergeType
          item.mergePopoverVisible = false
        }
        return item
      })
    },
    resetFeildForm(){
      this.feildForm = {
        name: "",
        category: "",
        categoryType:"",
        shareComponentType: "TEXT", //字段类型
        tableHeaderAndNumHidden:false,
        imageNameAndNumHidden :false,
        describe: "",
        tableHeadNode: [],
        tableHeadType: "NONE",
        serialType: "NONE",
        dataMergeConfig:{ // 数据合并
          mergeDimensionFields: [],
          mergeType: "NOT_MERGE"
        },
        hideRule:{
          customHideRule:[],
          hideRuleType:'NOT_HIDDEN'
        }, // 隐藏规则
        filterRule : {
          customFilterRule : [],
          filterRuleType : 'CUSTOM',
          tableHeadFilterRule : []
        }
      }
    },
    //列表被引用地方的图标
    markingIcon(type) {
      switch (type) {
        case "PROJECT":
          return "项";
        case "SUBSTANCE":
          return "物";
        case "REPORT":
          return "报";
      }
    },
  }
};
</script>
<style scoped>
.parst-search-box {
  border: 1px solid #dcdfe6;
  border-radius: 3px;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid #dcdfe6;
}

.title-box .title {
  margin-left: 18px;
}

.parst-search-box .el-scrollbar_height {
  height: 180px;
}

.tableForm .el-scrollbar_height {
  height: 110px;
}
.update-tips_box .tips {
  margin-left: 30px;
}
.el-icon-warning {
  color: #fc5a4c;
  margin-right: 10px;
}
.search-list .title:hover .icon-dianjixuanzhong {
  display: inline;
}

.search-list .title.active {
  color: #107AC2;
}
.tbData .iconfont:hover{
  color: #107AC2
}
.title-box .el-icon-close {
  margin-right: 10px;
  cursor: pointer;
}
.template-box {
  padding-left: 30px;
  margin-top: 20px;
  border-top: 1px solid #e6ecf5;
  border-bottom: 1px solid #e6ecf5;
}
.tableForm {
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #d5e0ed;
}

.tips {
  font-size: 12px;
  color: #96a2b3;
  line-height: 22px;
}

.tableForm .el-form-item {
  margin-bottom: 5px;
}

.tableForm >>> .el-form--label-top .el-form-item__label {
  line-height: inherit;
  padding: 0;
}
.table-box{
  overflow-x: auto;

}
.th-data {
  /* clear: both; */
  /* max-width: 5000px; */
  margin-top: 15px;
  /* overflow: hidden; */
  display: flex;
  flex-wrap: nowrap;
}

.th-data > li {
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #d5e0ed;
  border-right: none;
  white-space: nowrap;
}

.th-data li:first-child {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.th-data li:last-child {
  border-right: 1px solid #d5e0ed;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.tbData th i {
  font-size: 12px;
  cursor: pointer;
  color: #5d6a7a;
  transition: 0.3s;
  opacity: 0;
}

.tbData th span.name {
  cursor: pointer;
  color: #107AC2;
  margin-right: 10px;
}

.tbData th:hover i {
  opacity: 1;
}

.icon-shanchu,.icon-i-shezhishuju {
  margin-right: 5px;
}

.tbData {
    overflow-x: scroll;
  border-collapse: collapse;
  border: 1px solid #ebeef5;
  border-radius: 5px;
}

.tbData th {
  padding: 12px 10px;
  white-space: nowrap;
  color: #107AC2;
  border-bottom: 1px solid #ebeef5;
}

.tbData td {
  padding: 10px;
}

.icon-dianjixuanzhong {
  font-size: 12px;
  display: none;
  margin-right: 10px;
  color: #107AC2;
  transform: scale(0.8);
}
.add-rules-style {
  background: #107AC2;
  color: #fff;
  border-color: #107AC2;
}
.field-box {
  padding: 8px;
}
.field-box li {
  height: 31px;
  line-height: 31px;
  border-radius: 5px;
  padding: 0 8px;
  font-size: 12px;
  cursor: pointer;
  color: #3c4551;
}
.filed-content {
  max-width: 340px;
  margin-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.field-box i {
  font-size: 12px;
  margin-right: 3px;
  color: #107AC2;
}
.markingIcon {
  padding: 1px 5px;
  font-size: 12px;
  background: #107AC2;
  color: #fff;
  border-radius: 5px;
}
.field-box li:hover,
li.active-color {
  background: #edf5ff;
  color: #107AC2;
}
.popover-box {
  font-size: 12px;
}
.popover-box span {
  font-weight: bold;
  margin-right: 10px;
}
.popover-box p {
  line-height: 26px;
}
.hiderule-tips-text{
  position: absolute;
  text-indent: 10px;
  width: 100%;
  bottom: 0px;
  color: #595959;
  line-height: 32px;
  background: #F7F7F7;
}
.hiderule-box{
  margin-top: 5px;
  border:1px dashed #E0E0E0;
  border-radius: 5px;
  position: relative;
  padding-bottom: 30px;
}
.data-merge-box{
  margin-bottom: 10px;
}
.data-merge-box >>> .el-radio{
  display: block;
  margin-left: 0;
  line-height: 30px;
}
</style>

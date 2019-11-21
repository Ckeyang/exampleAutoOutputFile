<template>
  <div>
    <el-form ref="comditionForm" v-model="comditionForm" label-width="115px" label-position="left">
      <h4>条件设置</h4>
      <el-form-item label="数据来源" :rules="{ required: true}">
        <el-select
          v-model="comditionForm.dataSource"
          placeholder="请选择"
          style="width:215px"
          @change='dataSourceChange'
          size="mini"
        >
          <el-option
            v-for="item in dataSourceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="查找字段" :rules="{ required: true}">
        <el-tag
          :key="tag.id"
          v-for="tag of comditionForm.dataSourceDtoList"
          size="small"
          closable
          @close="handleClose(tag.id,'dataSourceDtoList')"
        >{{tag.name}}</el-tag>
          <el-button
            size="mini"
            class="checkSharePartBtn"
            @click="goCheckedSharePart('dataSourceDtoList')"
          >{{comditionForm.dataSource === 'PROJECTDATA'? '选择共享件（多选）' : '选择字段（多选）'}}</el-button>
      </el-form-item>
      <el-form-item label="根据条件" class="border-box">
        <el-tooltip   placement="top-start" effect="light" :offset='30'>
          <div slot="content" class="tips-content">
            1. 如只需对查找的字段进行输出设置，则无需设置条件<br/>
            2. 如需要根据一定的条件，对查找字段进行处理，则需要设置条件<br/>
            3. 选择了三种标签后，请选择标签值对应设置
          </div>
          <i class="tooltips-icon iconfont icon-wenhaomiaoshu"></i>
        </el-tooltip>
        <div style="position:relative;top:-40px;max-height:300px;overflow:auto"  >
          <tree-ship
            v-model="comditionForm.booleanExpressionList"
            :catogryType="catogryType"
            :fieldType="comditionForm.dataSource"
            mode="condition"
            size='mini'
          >
            <template slot="name">如果</template>
          </tree-ship>
        </div>
      </el-form-item>
      <h4>去重设置</h4>
      <el-form-item label="去重条件">
        <el-tag
          :key="tag.id"
          v-for="tag of comditionForm.distinctList"
          size="small"
          closable
          @close="handleClose(tag.id,'distinctList')"
        >{{tag.name}}</el-tag>
          <el-button
            size="mini"
            class="checkSharePartBtn"
            @click="goCheckedSharePart('distinctList')"
          >选择共享件（多选）</el-button>
      </el-form-item>
      <el-form-item label="排序规则">
        <el-tag
          :key="tag.id"
          v-for="tag of comditionForm.sortingRuleList"
          size="small"
          closable
          @close="handleClose(tag.id,'sortingRuleList')"
        >{{tag.name}}</el-tag> 
          <el-button
            size="mini"
            class="checkSharePartBtn"
            @click="goCheckedSharePart('sortingRuleList')"
          >选择共享件（多选）</el-button>
      </el-form-item>
      <h4>输出设置</h4>
      <el-form-item label="内容设置" >
        <div class="content-setting_box">
          <el-radio-group v-model="comditionForm.contentSettings" @change='handleContentSettingsChange'>
            <el-radio :label="item.id" v-for="item in contentSettingFilter" :key="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="字段分割设置" v-if="isShowFieldsplittingSetting">
        <ul class="filedSplitSet-box">
          <li v-for="(item,i) in comditionForm.fieldsplittingSetting" :key="i" :ref="'li'+i">
            <el-select
              v-model="item.id"
              placeholder="请选择"
              style="width:120px"
              size="mini"
              clearable
            >
              <el-option
                v-for="item2 in comditionForm.dataSourceDtoList"
                :key="item2.id"
                :label="item2.name"
                :value="item2.id"
                :disabled="duplicateRemoval(item2.id)"
              ></el-option>
            </el-select>
            <el-select
              v-model="item.lineSeparated"
              placeholder="请选择"
              style="width:80px;margin-left:5px;"
              size="mini"
              v-show="i !== comditionForm.fieldsplittingSetting.length - 1"
            >
              <el-option
                v-for="item2 in fieldsplittingSeparatorList"
                :key="item2.id"
                :label="item2.name"
                :value="item2.id"
              ></el-option>
            </el-select>
          </li>
        </ul>
      </el-form-item>
      <el-form-item
        label="格式设置"
        v-show="comditionForm.contentSettings === 'TEXTPROCESSING'">
        <el-scrollbar class="el-scrollbar_height">
          <div class="formatset-box">
            <el-radio-group v-model="formatSet" class="radio-group-box" @change="formatSetChange">
              <div v-show="judgeDataSourceType('TEXT')">
                <el-radio label="COLUMNNUMBER" >
                  <span>列序号</span>
                  <el-select
                    v-show="formatSet === 'COLUMNNUMBER'"
                    v-model="comditionForm.columnNumber"
                    placeholder="请选择"
                    style="width:100px;margin-left:5px;"
                    size="mini"
                  >
                    <el-option
                      v-for="item of serialNumberList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-radio>
                <el-radio label="LINESEPARATED" v-show="comditionForm.dataSourceDtoList.length <= 1">
                  <span>行分隔符</span>
                  <el-select
                    v-show="formatSet === 'LINESEPARATED'"
                    v-model="comditionForm.lineSeparated"
                    placeholder="请选择"
                    style="width:100px;margin-left:5px;"
                    size="mini"
                  >
                    <el-option
                      v-for="item in separatorList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-radio>
                <el-radio
                label="COLUMNNUMBERANDLINESEPARATED"
                v-show="comditionForm.dataSourceDtoList.length <= 1">
                  <span>列序号+行分隔</span>
                  <el-select
                    v-show="formatSet === 'COLUMNNUMBERANDLINESEPARATED'"
                    v-model="comditionForm.columnNumber"
                    placeholder="请选择"
                    style="width:90px;margin-left:5px;"
                    size="mini"
                  >
                    <el-option
                      v-for="item in serialNumberList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-show="formatSet === 'COLUMNNUMBERANDLINESEPARATED'"
                    v-model="comditionForm.lineSeparated"
                    placeholder="请选择"
                    style="width:90px;margin-left:5px;"
                    size="mini"
                  >
                    <el-option
                      v-for="item in separatorList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-radio>
              </div>
              <div v-show="judgeDataSourceType('TABLE')">
                <el-radio label="FORMFILL">
                  <span>表格自动填充</span>
                </el-radio>
                <el-radio label="COLUMNNUMBERANDTABLE">
                  <span>序号+表格</span>
                  <el-select
                    v-show="formatSet === 'COLUMNNUMBERANDTABLE'"
                    v-model="comditionForm.columnNumberAndTable"
                    placeholder="请选择"
                    style="width:100px;margin-left:5px;"
                    size="mini"
                  >
                    <el-option
                      v-for="item in serialNumberList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-radio>
                <el-radio
                  label="LINESEPARATEDANDTABLE"
                  v-show="comditionForm.dataSourceDtoList.length <= 1"
                >
                  <span>行分隔+表格</span>
                  <el-select
                    v-show="formatSet === 'LINESEPARATEDANDTABLE'"
                    v-model="comditionForm.lineSeparatedAndTable"
                    placeholder="请选择"
                    style="width:100px;margin-left:5px;"
                    size="mini"
                  >
                    <el-option
                      v-for="item in separatorList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-radio>            
              </div>
            </el-radio-group>
            <div class="setting-show-box">
              <h4 style="font-size:14px;">效果展示</h4>
              <div v-if="formatSet === 'COLUMNNUMBER'">
                <ul class="result-box">
                  <li
                    v-for="(item,i) in serialNumberExample[comditionForm.columnNumber]"
                    :key="i"
                  >{{item}} 字段示例</li>
                </ul>
              </div>
              <div class="result-box" v-else-if="formatSet === 'LINESEPARATED'">
                <span
                  v-for="(item,i) in separatorExample[comditionForm.lineSeparated]"
                  :key="i"
                >字段示例 {{i >= 2 ? '' : item}}</span>
              </div>
              <div class="result-box" v-else-if="formatSet === 'FORMFILL'">
                <el-table :data="tableData" border style="width: 100%" size="mini" key="FORMFILL">
                  <el-table-column label="物质名称" prop="name"></el-table-column>
                  <el-table-column label="列1"></el-table-column>
                  <el-table-column label="列2"></el-table-column>
                </el-table>
              </div>
              <div class="result-box" v-else-if="formatSet === 'COLUMNNUMBERANDLINESEPARATED'">
                <span
                  v-for="(item,i) in separatorExample[comditionForm.lineSeparated]"
                  :key="i"
                >{{serialNumberExample[comditionForm.columnNumber][i]}}字段示例 {{i >= 2 ? '' : item}}</span>
              </div>
              <div class="result-box" v-else-if="formatSet === 'COLUMNNUMBERANDTABLE'">
                <el-table :data="tableData" border style="width: 100%" size="mini" key='COLUMNNUMBERANDTABLE'>
                  <el-table-column label="物质名称"  >
                    <template slot-scope='scope' >
                      <div
                        v-for="(item,i) in serialNumberExample[comditionForm.columnNumberAndTable]"
                        :key="i"
                      >{{item}}{{tableData[i].name}}{{scope.name}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="列1"></el-table-column>
                  <el-table-column label="列2"></el-table-column>
                </el-table>
              </div>
              <div class="result-box" v-else-if="formatSet === 'LINESEPARATEDANDTABLE'">
                <el-table :data="tableData" border style="width: 100%" size="mini" key="LINESEPARATEDANDTABLE">
                  <el-table-column label="物质名称">
                    <template slot-scope='scope'>
                      <span
                        v-for="(item,i) in separatorExample[comditionForm.lineSeparatedAndTable || 'BLANK']"
                        :key="i"
                      >{{tableData[i].name}} {{i >= 2 ? '' : item}}{{scope.name}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="列1"></el-table-column>
                  <el-table-column label="列2"></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-form-item>
       <el-form-item
        label="格式设置"
        v-show="comditionForm.contentSettings === 'IMAGEOUTPUT'">
        <el-radio-group v-model="formatSet" >
          <el-radio :label="item.id" v-for="item in imageOutpoutList" :key="item.id">{{item.name}}</el-radio>
        </el-radio-group>
        <div>
          <img src="@/assets/yituyikuang.png" alt="一图一框" v-if='formatSet === "ONEIMAGEONEFRAME"'>
          <img src="@/assets/duotuyikuang.png" alt="多图一框" v-else>
        </div>
      </el-form-item>
    </el-form>
    <searchSharePart
      :searchType="searchType"
      @change="getCheckShareParts"
      :catogryType="catogryType" 
      ref='checkSharePart'
    />
  </div>
</template>
<script>
import searchSharePart from "./searchSharePart.vue";
import TreeShip from "@/components/tools/TreeShip/TreeShip.vue";
export default {
  components: { searchSharePart, TreeShip },
  name: "conditionRules",
  data() {
    return {
      comditionForm: {
        dataSource: "PROJECTDATA", //来源
        contentSettings: "RESULTSCOUNT",
        show: false,
        columnNumber: "ARAB",
        columnNumberAndTable: "ARAB",
        lineSeparated: "COMMA",
        lineSeparatedAndTable: "COMMA",
        formFill: false,
        dataSourceDtoList: [], //字段列表
        distinctList: [], //其他去重条件
        sortingRuleList: [], //排序条件
        fieldsplittingSetting: [], // 字段分割设置
        booleanExpressionList: []
      },
      // isIniting: false, //是否正在初始化数据
      //格式设置
      formatSet: "COLUMNNUMBER",
      curCheckedSharePartType: "", //当前选择共享件的选项  dataSourceDtoList 字段列表 、 distinctList 去重条件 、 sortingRuleList 排序条件
      checkSharePartList: [], //已选择的共享件
      dataSourceList: [
        // { name: "项目信息", id: "PROJECTBASICINFO" },
        // { name: "项目数据", id: "PROJECTDATA" },
        // { name: "依据列表", id: "ACCORDINGLIBRARY" },
        // { name: "设备列表", id: "EQUIPMENTLIST" },
        // { name: "物质列表", id: "MATERIALDATA" },
        // { name: "方法列表", id: "EVALUATIONMETHODLIBRARY" },
        // { name: "采样方式", id: "SAMPLINGMETHOD" },
        // { name: "限值规定", id: "LIMITSPECIFIED" },
        // { name: "采样记录联动数据表", id: "SAMPLING_RECORD_LINKAGE_FORM" },
        // { name: "防护用品联动数据表", id: "LABOUR_PROTECTION_FORM" },
      ], //数据来源枚举值列表
      contentSetting: [
        { name: "结果计数", id: "RESULTSCOUNT" },
        { name: "结果求和", id: "RESULTSUM" },
        { name: "范围值(最小-最大)", id: "RANGEVALUE" },
        { name: "最大值", id: "MAXVALUE" },
        { name: "最小值", id: "MINVALUE" },
        { name: "文本处理", id: "TEXTPROCESSING" },
        { name: "图片输出", id: "IMAGEOUTPUT" }
      ],
      imageOutpoutList:[
        { name: "一图一框", id: "ONEIMAGEONEFRAME" },
        { name: "多图一框", id: "MULTIPLEIMAGEONEFRAME" },
      ], // 图片输出格式
      //序号类型
      serialNumberList: [
        { name: "123", id: "ARAB" },
        { name: "无序号", id: "NONE" }
      ],
      //分隔符
      separatorList: [
        { name: "逗号 ，", id: "COMMA" },
        { name: "分号 ；", id: "SEMICOLON" },
        { name: "、", id: "CHARACTER" },
        { name: "空格", id: "BLANK" }
      ],
      fieldsplittingSeparatorList:[
        { name: "逗号 ，", id: "COMMA" },
        { name: "分号 ；", id: "SEMICOLON" },
        { name: "、", id: "CHARACTER" },
        { name: "空格", id: "BLANK" },
        { name: "-", id: "REDUCE" },
        { name: "+", id: "PLUS" },
        { name: "*", id: "ASTERISK" },
        { name: "&", id: "ALSO" },
        { name: "~", id: "WAVE" },
        { name: "\"", id: "LEFT_QUOTATION_MARK" },
        { name: "\"", id: "RIGHT_QUOTATION_MAR" },
        { name: "《", id: "LEFT_BOOK_TITLE_MARK" },
        { name: "》", id: "RIGHT_BOOK_TITLE_MARK" },
        { name: "（", id: "LEFT_PARENTHESIS" },
        { name: "）", id: "RIGHT_PARENTHESIS" },
        { name: "/", id: "RIGHT_SLASH" },
        { name: "\\", id: "LEFT_SLASH" },
        { name: "|", id: "VERTICAL_LINE" },
      ], // 字段分割设置
      //示例
      serialNumberExample: {
        I_II_III: ["Ⅰ", "Ⅱ", "Ⅲ"],
        ARAB: ["1", "2", "3"],
        CHARACTERS: ["一", "二", "三"],
        NONE: ["", "", ""]
      },
      separatorExample: {
        COMMA: [", ", ", ", ", "],
        SEMICOLON: ["; ", "; ", "; "],
        CHARACTER: [" 、 ", " 、 ", "、"],
        BLANK: [" ", " ", " "]
      },
      tableData: [{ name: "氨" }, { name: "汞" }, { name: "金" }]
    };
  },
  props: {
    //共享件类型
    catogryType: {
      type: String
    },
    sharedPartType:{ // 当前设置规则的共享件的类型
      type:String
    },
    defaultValue: {
      type: Object
    }
  },
  computed: {
    dataSourceDtoList() {
      return this.comditionForm.dataSourceDtoList;
       
    },
    // 需要选择共享件的类型
    searchType(){
      return this.comditionForm.dataSource === 'PROJECTDATA'? 'SHARE_PARTS' : this.comditionForm.dataSource
    },
    contentSettingFilter(){
      return this.contentSetting.filter(item => this.sharedPartType === 'IMAGE' ? item.id === 'IMAGEOUTPUT' : item.id !== 'IMAGEOUTPUT')
    },
    // 是否显示字段分割设置
    isShowFieldsplittingSetting(){
      return this.dataSourceDtoList.length > 1 && this.comditionForm.contentSettings === 'TEXTPROCESSING'
    }
  },
  created(){
    this.getDataSourceList() // 获取数据来源列表
  },
  watch: {
    sharedPartType:{
      handler(val) {
        if(val === 'IMAGE'){
          this.comditionForm.contentSettings = 'IMAGEOUTPUT'
          this.handleContentSettingsChange('IMAGEOUTPUT')
        }
      },
      immediate: true
    },
    value: {
      handler(val) {
        this.$emit("input", val);
      },
      deep: true,
      immediate: true
    },
    dataSourceDtoList(val) {
      if (val.length > 1) {
        this.comditionForm.contentSettings = "TEXTPROCESSING";
        ['COLUMNNUMBER','FORMFILL','COLUMNNUMBERANDTABLE'].includes(this.formatSet) || (this.formatSet = "COLUMNNUMBER");
      }
      //判断是否为多选,构造一个相同层级的数组用于存放字段分割设置
      this.settingFiledSplit(val);
    }
  },
  methods: {
    //初始化数据
    initData(data) {
      this.comditionForm = JSON.parse(JSON.stringify(data));
      let flag = this.contentSetting.some(
        item => item.id === data.contentSettings
      );
      if (!flag) {
        if(this.imageOutpoutList.some(item => item.id === data.contentSettings)){
          this.comditionForm.contentSettings = "IMAGEOUTPUT";
        }else{
          this.comditionForm.contentSettings = "TEXTPROCESSING";
        }
      }
      this.formatSet = data.contentSettings;
      if (data.dataSource === "PROJECTDATA") {
        //查询项目字段列表
        this.getSharePartByIds([
          ...data.distinctList,
          ...data.sortingRuleList,
          ...data.dataSourceDtoList
        ]);
      } else {
        //查询系统参数列表
        this.getSystemFileds(data.dataSource);
      }
    },
    // 获取数据来源列表
    getDataSourceList(){
      this.$http.sharedPartsRulesService.getDataSourceList().then(res =>{
        this.dataSourceList = res.data || []
      })
    },
    //字段分割选项去重
    duplicateRemoval(id) {
      return this.comditionForm.fieldsplittingSetting.some(
        item => item.id === id
      );
    },
    //获取选择的共享件
    getCheckShareParts(data) {
      this.comditionForm[this.curCheckedSharePartType] = data;
    },
    //构造一个相同层级的数组用于存放字段分割设置
    settingFiledSplit(data) {
      if (data.length > 1) {
        this.comditionForm.fieldsplittingSetting.length!==data.length?this.comditionForm.fieldsplittingSetting = data.map(item => ({
          id: item.id,
          lineSeparated: item.lineSeparated || "COMMA"
        })):null;
        this.comditionForm.fieldsplittingSetting[
          this.comditionForm.fieldsplittingSetting.length - 1
        ]["lineSeparated"] = "NO"; //最后一个设置为无
      } else {
        this.comditionForm.fieldsplittingSetting = [];
      }
    },
    //去掉选择的共享件
    handleClose(id, type) {
      this.comditionForm[type] = this.comditionForm[type].filter(
        item => item.id !== id
      );
      this.checkSharePartList = this.comditionForm[type];
      if (type === "dataSourceDtoList") {
        //判断是否为多选,构造一个相同层级的数组用于存放字段分割设置
        this.settingFiledSplit(this.comditionForm.dataSourceDtoList);
      }
    },
    //保存校验
    validateRules(){
      if(!this.comditionForm.dataSourceDtoList.length){
        this.$message.error('请选择查找字段');
        return false;
      }
      return true
    },
    //去选择共享件的类型
    goCheckedSharePart(type) {
      this.curCheckedSharePartType = type
      this.$refs.checkSharePart.openDialog(this.comditionForm[type])
    },
    saveConditionRules() {
      if(!this.validateRules()){
        return ;
      }
      this.comditionForm.sortingRuleList = this.comditionForm.sortingRuleList.map(
        item => item.id
      );
      this.comditionForm.distinctList = this.comditionForm.distinctList.map(
        item => item.id
      );
      this.comditionForm.dataSourceDtoList = this.comditionForm.dataSourceDtoList.map(
        item => item.id
      );
      //将文本处理用枚举值改为对应格式设置的枚举值，后端需要
      if (['TEXTPROCESSING','IMAGEOUTPUT'].includes(this.comditionForm.contentSettings)) {
        this.comditionForm.contentSettings = this.formatSet;
      }
      return JSON.parse(JSON.stringify(this.comditionForm));
    },
    // 内容设置变化改变初始化格式设置
    handleContentSettingsChange(val){
      if(val === 'TEXTPROCESSING'){
        this.formatSet = 'COLUMNNUMBER'
      }else if(val === 'IMAGEOUTPUT'){
        this.formatSet = 'ONEIMAGEONEFRAME'
      }
    },
    //格式选择改变，清空历史
    formatSetChange() {
      this.comditionForm.columnNumber = "ARAB";
      this.comditionForm.columnNumberAndTable = "ARAB";
      this.comditionForm.lineSeparated = "COMMA";
      this.comditionForm.lineSeparatedAndTable = "COMMA";
      this.comditionForm.formFill = false;
    },
    //根据id批量获取共享件
    getSharePartByIds(ids) {
      if(!ids || !ids.length){
        return ;
      }
      this.$http.sharedPartsRulesService
        .getSharePartByIds({ ids })
        .then(res => {
          this.initSharePartName("dataSourceDtoList", res.data);
          this.initSharePartName("sortingRuleList", res.data);
          this.initSharePartName("distinctList", res.data);
        });
    },
    //初始化选择的共享件名称
    initSharePartName(filedname, data) {
      this.comditionForm[filedname] = this.comditionForm[filedname].map(id => {
        let obj = data.find(item => item.id === id);
        return obj ? {
          id: obj.id,
          name: obj.name
        } : null
      }).filter(item => item);
    },
    // 数据来源改变，清空去重条件和查找字段和排序字段
    dataSourceChange(){
      this.comditionForm.dataSourceDtoList = [];
      this.comditionForm.distinctList = [];
      this.comditionForm.sortingRuleList = [];
    },
    //获取系统变量字段
    getSystemFileds(type) {
      this.$http.sharedPartsRulesService
        .getSystemFileds({ dataSourceEnum: type, bigCategoryId: this.catogryType })
        .then(res => {
          this.initSharePartName("dataSourceDtoList", res.data);
          this.initSharePartName("sortingRuleList", res.data);
          this.initSharePartName("distinctList", res.data);
        });
    },
    //重置表单
    resetForm() {
      this.comditionForm = {
        dataSource: "PROJECTDATA", //来源
        contentSettings: "RESULTSCOUNT",
        show: false,
        columnNumber: "ARAB",
        columnNumberAndTable: "ARAB",
        lineSeparated: "COMMA",
        lineSeparatedAndTable: "COMMA",
        formFill: false,
        dataSourceDtoList: [], //字段列表
        distinctList: [], //其他去重条件
        sortingRuleList: [], //排序条件
        fieldsplittingSetting: [], // 字段分割设置
        booleanExpressionList: []
      };
      this.formatSet = "COLUMNNUMBER"
      this.curCheckedSharePartType = ""; //当前选择共享件的选项  dataSourceDtoList 字段列表 、 distinctList 去重条件 、 sortingRuleList 排序条件
      this.checkSharePartList = []; //已选择的共享件
    },
    // 判断当前选择的字段的类型
    judgeDataSourceType(type){
      return this.dataSourceDtoList.length > 1 ? true : this.sharedPartType === type
    }
  }
};
</script>

<style scoped>
.content-setting_box {
  padding-bottom: 10px;
}
.content-setting_box >>> .el-radio-group .el-radio {
  margin: 5px 30px 5px 0;
}
.content-setting_box >>> .el-radio-group .el-radio:last-child {
  margin-right: 0;
}
.formatset-box {
  min-width: 600px;
  display: flex;
  justify-content: space-between;
}
.el-scrollbar_height {
  padding-bottom: 7px;
  border: 1px solid #d5e0ed;
  border-radius: 5px;
}
.formatset-box >>> .el-radio {
  display: block;
  margin: 8px 0;
  height: 28px;
  line-height: 28px;
}
.radio-group-box {
  width: 320px;
  padding-left: 10px;
  margin-bottom: 8px;
}
.setting-show-box {
  flex-grow: 1;
  padding: 0px 10px 10px;
  border-left: 1px solid #d5e0ed;
}
.result-box li {
  line-height: 24px;
}
.filedSplitSet-box li {
  float: left;
  margin-right: 10px;
}
.tooltips-icon{
  position: relative;
  left:-54px;
  cursor: pointer;
}
.tips-content{
  color: #606266;
}
.border-box >>> .el-form-item__content{
  border: 1px solid #dcdfe6;
  border-radius: 5px;
}
</style>

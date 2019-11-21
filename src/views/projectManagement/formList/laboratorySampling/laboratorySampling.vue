<template>
  <div class="bg_laboratory">
    <div class="laboratory_header">
      {{ companyName }} &nbsp;&nbsp;&nbsp;&nbsp; <span style="font-size:16px;">{{ entrustNumber }}</span>
      <el-button
        style="position:absolute;right:1em;top:.6em;background-color:#107AC2;border:1px solid #ffffff;"
        type="primary"
        @click="closeWindow()"
        >完成收样</el-button
      >
    </div>
    <div style="padding:1em;">
      <search-box :form="form">
        <template slot="input">
          <el-col :span="6" v-if="type === 'change'">
            <div class="scan-code-form">
              <div class="left-box">
                <div class="code-box">
                  <i class="iconfont icon-i-saoyisao"></i>
                  <span>扫一扫</span>
                </div>
              </div>
              <div class="change-box">
                <i @click="changeType()" class="iconfont icon-shang"></i>
                <i @click="changeType()" class="iconfont icon-xia"></i>
                <!-- <el-radio-group v-model="type">
                  <el-radio-button label="change"></el-radio-button>
                  <el-radio-button label="enter"></el-radio-button>
                </el-radio-group> -->
                <!-- <i class="iconfont icon-shang"></i>
                <i class="iconfont icon-xia"></i> -->
              </div>
              <el-input
                ref="sampleSerialNumber"
                v-model="form.sampleSerialNumber"
                placeholder="请输入扫码内容"
                clearable
                @input="createSampling"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="6" v-else>
            <div class="scan-code-form">
              <div class="left-box">
                <div class="code-box">
                  <i class="iconfont icon-sousuo"></i>
                  <span>搜索</span>
                </div>
              </div>
              <div class="change-box">
                <i @click="changeType()" class="iconfont icon-shang"></i>
                <i @click="changeType()" class="iconfont icon-xia"></i>
              </div>
              <el-input
                ref="sampleSerialNumber"
                v-model="form.sampleSerialNumber"
                placeholder="请输入内容"
                clearable
                v-on:keyup.enter.native="createSampling"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="6" v-if="type === 'enter'">
            <div class="scan-code-form">
              <el-button type="primary" style="height:52px" icon="el-icon-search" @click="createSampling()">搜索</el-button>
              <!-- <el-button @click="changeType">{{ type === "enter" ? "扫码搜索" : "手动搜索" }}</el-button> -->
            </div>
          </el-col>
        </template>
      </search-box>
      <div class="regulation-tb box-style_common">
        <div class="tools-bar_common">
          <h5 class="table-title">
            <el-radio-group
              v-model="menuType"
              size="small"
              @change="
                choiseValue = [];
                getDataList();
              "
            >
              <el-radio-button label="A">已收样</el-radio-button>
              <el-radio-button label="B">待收样</el-radio-button>
            </el-radio-group>
          </h5>
          <div>
            <el-button size="small" v-if="menuType === 'B'" @click="multipleChoise">批量收样</el-button>
            <data-sort :componentId="curId" @refreshData="getDataList" />
            <el-button size="small" icon="iconfont icon-daochu" v-if="menuType === 'A'" @click="showOutputBox = true"
              >导出数据</el-button
            >
            <table-head-show-list
              :trDataList="trList"
              :componentParentId="curId"
              style="margin-right:10px"
              @checkTrChange="checkTrChange"
            />
          </div>
        </div>
        <div
          class="table-box"
          v-loading="renderLoading"
          element-loading-background="rgba(0, 0, 0, 0.1)"
          v-show="isShowTr.length"
        >
          <el-table
            :data="tdData"
            :row-class-name="tableRowClassName"
            :max-height="winHeight - 320"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" v-if="menuType === 'B'" :selectable="filterSelection"> </el-table-column>
            <el-table-column v-for="(item, index) of isShowTr" :key="item.id" :label="item.name" min-width="200">
              <template slot-scope="scope" v-if="scope.row[item.id]">
                <img
                  v-show="index === 0 && !dialogVisible && isRepeat(scope.row.trId)"
                  class="rpsy"
                  src="@/assets/Mark@2x.png"
                />
                <div v-if="item.type === 'ADDRESSBOX'">
                  {{ scope.row[item.id] ? renderAddress(scope.row[item.id].addressValue) : "" }}
                </div>
                <div v-else-if="item.type === 'TEXTBOX'">{{ scope.row[item.id] ? scope.row[item.id].stringValue : "" }}</div>
                <div v-else-if="item.type === 'IMAGEBOX'">
                  <span v-if="!scope.row[item.id].imageValue.length || !scope.row[item.id].imageValue[0].url">暂无图片</span>
                  <el-button size="mini" type="primary" v-else plain @click="previewImg(scope.row[item.id].imageValue)"
                    >查看图片</el-button
                  >
                </div>
                <div v-else-if="item.type === 'FILEBOX' || item.type === 'VIDEO'">
                  <span v-if="!scope.row[item.id].imageValue.length || !scope.row[item.id].imageValue[0].url">{{
                    item.type === "FILEBOX" ? "暂无文件" : "暂无视频"
                  }}</span>
                  <el-popover placement="bottom" width="200" v-else popper-class="file-popover" trigger="click">
                    <ul class="file-box">
                      <li v-for="file in scope.row[item.id].imageValue" :key="file.url">
                        <a :href="file.url" :title="file.name || ''" target="_blank" :download="file.name || ''">
                          {{ scope.row[item.id] ? file.name : "" }}
                        </a>
                      </li>
                    </ul>
                    <el-button slot="reference" size="mini" type="primary" plain>{{
                      item.type === "FILEBOX" ? "查看文件" : "播放视频"
                    }}</el-button>
                  </el-popover>
                </div>
                <div v-else-if="item.type === 'CHECKBOX' || item.type === 'CASCADER' || item.type === 'MULTIPLE_COMBOBOX'">
                  {{ checkBoxAllowMoreValue(scope.row[item.id]) }}
                </div>
                <div v-else-if="item.type === 'RADIOBOX' || item.type === 'COMBOBOX' || item.type === 'DATEPICKER'">
                  {{ scope.row[item.id] ? scope.row[item.id].stringValue : "" }}
                </div>
                <div v-else-if="item.type === 'DYNAMIC_CHOICE'">
                  {{ scope.row[item.id] ? dynamicChoiceValues(scope.row[item.id].dynamicChoiceValues) : "" }}
                </div>
                <div v-else-if="item.type === 'INDUSTRY'">
                  {{ scope.row[item.id] ? scope.row[item.id].industryList[0].label : "" }}
                </div>
                <div v-else-if="item.type === 'CUSTOMBOX'" style="width:210px">
                  <div class="custom-box" :class="{ activeCustomBox: scope.row[item.id].isInvolve }">
                    <span style="margin:0 6px;font-weight:normal" v-show="scope.row[item.id].isInvolve">
                      组件数据量:{{ scope.row[item.id].dataNumber }}</span
                    >
                  </div>
                </div>
                <div v-else-if="!item.type && item.id.indexOf('userName') > -1">{{ scope.row[item.id].stringValue || "" }}</div>
                <div v-else-if="!item.type">{{ Number(scope.row[item.id].stringValue) | formatDate }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="265" style="background: #fff;text-align: right;" fixed="right">
              <template slot-scope="scope">
                <div class="operation-icon">
                  <i class="iconfont icon-chakan" @click="showDetail(scope.row.trId)">查看详情</i>
                  <i class="iconfont icon-shanchu" v-if="menuType === 'A'" @click="cancelSampling(scope.row.trId)">取消收样</i>
                  <i
                    class="iconfont icon-shanchu"
                    v-if="menuType === 'B' && checkValid(scope.row.trId)"
                    @click="disSampling(scope.row.trId)"
                    >作废</i
                  >
                  <i
                    class="iconfont icon-qiyong"
                    v-if="menuType === 'B' && !checkValid(scope.row.trId)"
                    @click="enableSampling(scope.row.trId)"
                    >取消作废</i
                  >
                  <el-popover v-if="menuType === 'B' && !checkValid(scope.row.trId)" placement="top" width="250">
                    <div>
                      作废原因：{{ getChangeRecord(scope.row.trId).reason }}<br />
                      操作人：&nbsp;&nbsp;&nbsp;&nbsp;{{ getChangeRecord(scope.row.trId).operatePerson }}<br />
                      操作时间：{{ translateDate(getChangeRecord(scope.row.trId).operateTime) }}
                    </div>
                    <i class="iconfont icon-chakan" slot="reference">查看原因</i>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <pagniation
            :totalPage="totalPage"
            :totalNum="totalNum"
            :currentPage="form.current"
            @changePage="handleChangePage"
          ></pagniation>
        </div>
        <div v-if="isShowEmptyTips" class="empty-box">
          <img src="@/assets/empty.png" alt="暂无支持扫码搜索的控件" />
          <p>暂无支持扫码录入的控件</p>
        </div>
      </div>
      <el-dialog :visible.sync="showOutputBox" title="导出数据" width="30%">
        <div>
          <el-radio-group v-model="outputForm.type">
            <el-radio label="1">导出所有数据</el-radio> <br />
            <el-radio label="2" style="margin:1em 0;"
              >根据 &nbsp;<el-select
                size="small"
                filterable
                :disabled="outputForm.type === '1'"
                style="width:120px"
                v-model="outputForm.groupBy"
              >
                <el-option
                  v-for="item in componentData"
                  :key="item.id"
                  :value="item.id"
                  :label="item.componentAttr.tag"
                ></el-option> </el-select
              >&nbsp;分组，并导出多组数据</el-radio
            >
          </el-radio-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="
              showOutputBox = false;
              outputForm.type = '1';
            "
            size="medium"
            >取 消</el-button
          >
          <el-button type="primary" @click="output()" size="medium">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :title="companyName" :visible.sync="dialogVisible" width="695px">
        <span slot="title">
          采样记录表 - <span class="cur-page">{{ curIndex + 1 }}</span
          >&nbsp;/&nbsp;{{ choiseValue.length || 1 }}</span
        >
        <div v-if="showTimer" class="warningBox">
          此窗口<span style="color:#FF3333"
            ><span>{{ time }}</span
            >s</span
          >后关闭
          <span
            style="float:right;margin-right:2em;
  cursor: pointer;color:#1890FF"
            @click="removeTimer"
            >取消关闭</span
          >
        </div>
        <scan-code-entey-form
          :isDisable="true"
          :componentData="componentData"
          :curIndex="curIndex"
          :totalNum="choiseValue.length"
          @handleChange="changeEditFormItem"
          @checkRules="handleCheckRules"
        />
      </el-dialog>
      <preview-img :previewData="previewData" :visible.sync="previewimgVisible"></preview-img>
    </div>
    <customLoading :visible.sync="isLoading" :delay="100">
      <p>正在批量收样中。。。</p>
    </customLoading>
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import previewImg from "@/components/tools/PreviewImg.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import scanCodeEnteyForm from "../scanCodeEntry/scanCodeEnteyForm.vue";
import environmental from "@/environmental/index.js";
import tableHeadShowList from "@/components/tools/tableHeadShowList.vue";
import parsingRule from "@/components/tools/parsingRule.js";
import dataSort from "@/views/template/templatePreview/components/middle/components/dataSort.vue"; // 数据排序
import FormRulesModule from "@/components/tools/applyRules.js"; // 规则执行模块
import customLoading from "@/components/tools/customLoading/index.vue";
import { debouce } from "@/utils.js";
let timer = null;
let intTimer = null;
const url = environmental.env().url;
let formRulesModule; // 规则模块
export default {
  components: {
    highlightWords,
    SearchBox,
    customLoading,
    pagniation,
    dataSort,
    preview,
    tableHeadShowList,
    scanCodeEnteyForm,
    previewImg
  },
  data() {
    return {
      form: { sampleSerialNumber: "", projectId: "", pageSize: 30, current: 0 },
      companyName: "东方日立（成都）电控设备有限公司",
      type: "change",
      menuType: this.$route.query.menuType || "A",
      projectId: "123",
      entrustNumber: "ZHKY（职）-2019-J0108",
      totalPage: 0,
      action: false,
      isLoading: false,
      totalNum: 0,
      previewimgVisible: false,
      previewData: {
        dataList: [], //预览图片的数据
        currentIndex: 0 //当前选中的img
      },
      dialogVisible: false,
      renderLoading: false,
      sampleCollection: false,
      curIndex: 0,
      timerSamp: null,
      trList: [],
      tdData: [],
      multipleSelection: [],
      showTimer: false,
      time: 0,
      isShowEmptyTips: false,
      componentData: [],
      componentValue: [],
      choiseValue: [],
      outputForm: { type: "1", groupBy: "" },
      showOutputBox: false,
      curId: ""
    };
  },
  computed: {
    isShowTr() {
      let isShowList = this.trList.filter(item => item.display);
      isShowList.length && this.tableKey++; //没有表头不需要重绘
      return isShowList;
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.choiseValue = [];
        this.$refs["sampleSerialNumber"].focus();
      }
    },
    time(val) {
      if (val === 0) {
        clearInterval(intTimer);
      }
    }
  },
  created() {
    this.getProject();
  },
  mounted() {
    formRulesModule = new FormRulesModule(); // 构建规则实列，用于保存规则初始化信息、执行规则等相关操作
  },
  destroyed() {
    formRulesModule = null; // 销毁规则模块
  },
  methods: {
    filterSelection(row,index){
      return this.checkValid(row.trId)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.filter(item => {
        if (this.checkValid(item.trId)) {
          return item;
        }
      });
    },
    multipleChoise() {
      let params = {
        listData: this.multipleSelection.map(item => {return item.trId})
      };
      this.isLoading = true;
      this.$http.laboratorySamplingService.multipleLaboratory(params).then(res => {
        this.isLoading = false;
        this.multipleSelection=[];
        this.getDataList();
      });
    },
    translateDate(date) {
      let day = new Date(date);
      return (
        day.getFullYear() +
        "年" +
        (day.getMonth() + 1) +
        "月" +
        day.getDate() +
        "日   " +
        day.getHours() +
        "-" +
        day.getMinutes()
      );
    },
    getChangeRecord(id) {
      return this.componentValue.find(item => item.id === id).validStatusChangeRecord;
    },
    checkValid(id) {
      return this.componentValue.find(item => {
        if (item.id === id) {
          return item;
        }
      }).valid;
    },
    tableRowClassName({ row, rowIndex }) {
      let obj = this.choiseValue.find(item => item.id === row.trId);
      if (!this.checkValid(row.trId) && this.menuType === "B") {
        return "disabledClass";
      } else if (this.menuType === "A" && !this.dialogVisible && obj && !obj.sampleCollection) {
        return "successClass";
      } else if (this.menuType === "A" && !this.dialogVisible && obj && obj.sampleCollection) {
        return "errorClass";
      }
      return "";
    },
    closeWindow() {
      window.close();
    },
    changeType() {
      this.type = this.type === "enter" ? "change" : "enter";
      this.$refs["sampleSerialNumber"].focus();
    },
    handleCheckRules: debouce(async function(fieldId, val) {
      formRulesModule.implementApplys(fieldId);
    }, 200),
    //预览
    previewImg(data, curIndex = 0) {
      this.previewData.dataList = data;
      this.previewimgVisible = true;
    },
    //动态多选框
    dynamicChoiceValues(data) {
      return data
        .map(item => {
          if (item.otherValue && item.otherValue.length) {
            return `${item.choiceValue}(${item.otherValue.map(item2 => item2.value).join("，")})`;
          }
          return item.choiceValue;
        })
        .join(" \\ ");
    },
    // 多选框或者多选下拉框格式化数据
    checkBoxAllowMoreValue(data) {
      let values = "";
      if (data) {
        values = data.stringListValue.join(" \\ ");
        values = values + (data.stringListValue.length && data.stringValue ? " \\ " : "") + data.stringValue;
      }
      return values;
    },
    //渲染地址
    renderAddress(data) {
      return Object.values(data).join("");
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    /**
     * @time 时间，单位秒
     */
    setTime(time) {
      this.time = time;
      let that = this;
      intTimer = setInterval(function() {
        that.time--;
      }, 1000);
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
    /**
     * @index 序号
     */
    changeEditFormItem(index) {
      this.splicingEditForm(this.choiseValue[index]);
      this.curIndex = index;
    },
    /**
     * @id 数据id
     */
    showDetail(id) {
      this.choiseValue = [];
      this.action = false;
      const obj = this.componentValue.find(item => item.id === id);
      this.choiseValue.push(obj);
      obj && this.splicingEditForm(obj);
      formRulesModule.implementApplys(); // 执行规则
      this.dialogVisible = true;
    },
    // 编辑表单时组装数据
    splicingEditForm(values) {
      this.sampleCollection = values.sampleCollection;
      this.componentData = this.componentData.map(item => {
        let tempFormValue = values.dataAndAttributeDtoList.find(item1 => item1.controlId === item.id);
        tempFormValue && (item.formValue = tempFormValue.formValue);
        item.componentAttr.fillable = false;
        return item;
      });
    },
    /**
     * 获取项目详情
     */
    getProject() {
      this.$http.projectService
        .getProjectById(this.$route.params.projectId)
        .then(res => {
          this.projectId = res.data.id;
          this.companyName = res.data.companyName;
          this.entrustNumber = res.data.entrustNumber;
          this.form.projectId = this.projectId;
        })
        .then(this.getTitleList);
    },
    /**
     * 获取标题
     */
    getTitleList() {
      this.renderLoading = true;
      this.$http.laboratorySamplingService
        .getTitleList(this.projectId)
        .then(res => {
          this.componentData = res.data.formComponents;
          this.curId = res.data.componentId;
          this.trList = this.getTrList(res.data.formComponents, res.data.dynamicDisplayColumnFlag);
          const timer = setTimeout(() => {
            this.initRules(res.data.rules, this.componentData);
            clearTimeout(timer);
          }, 100);
        })
        .then(this.getDataList)
        .catch(err => {
          this.isShowEmptyTips = true;
        })
        .finally(() => {
          this.renderLoading = false;
        });
    },
    // 初始化规则结构
    initRules(rules, componentData) {
      if (!formRulesModule.componentRulesMap.size) {
        formRulesModule.transformRules(rules);
        //保存初始的控件状态
        formRulesModule.saveOriginalComponentState(componentData);
      }
    },
    /**
     * 获取数据
     */
    getDataList() {
      this.renderLoading = true;
      if (this.menuType === "A") {
        this.$http.laboratorySamplingService.get(this.form).then(res => {
          this.componentValue = res.data.content;
          this.totalPage = res.data.totalPages;
          this.totalNum = res.data.totalElements;
          this.$refs["sampleSerialNumber"].focus();
          this.splicingComponentValue();
        });
      } else {
        this.$http.laboratorySamplingService.getWaitSampleCollectedListData(this.form).then(res => {
          this.componentValue = res.data.content;
          this.totalPage = res.data.totalPages;
          this.totalNum = res.data.totalElements;
          this.$refs["sampleSerialNumber"].focus();
          this.splicingComponentValue();
        });
      }
    },
    /**
     * 创建采样
     */
    createSampling() {
      if (!this.form.sampleSerialNumber) {
        return;
      }
      this.choiseValue = [];
      this.action = true;
      if (this.type === "change") {
        this.destroyTimer();
        this.timerSamp = setTimeout(this.getSampling, 800);
      } else {
        this.getSampling();
      }
    },
    destroyTimer() {
      clearTimeout(this.timerSamp);
      this.timerSamp = null;
    },
    getSampling() {
      this.$http.laboratorySamplingService
        .put(this.form)
        .then(res => {
          if (res.data.length === 0) {
            let number = this.form.sampleSerialNumber;
            this.$alertComponent(`没有找到条形码：${number}的相关信息！`, "", {
              confirmButtonText: "确定"
            }).then(() => {
              this.$refs["sampleSerialNumber"].focus();
            });
            this.form.sampleSerialNumber = "";
            return;
          } else {
            this.showTimer = false;
            // timer = setTimeout(this.displayDialog, 3000);
            this.choiseValue = res.data;
            this.sampleCollection = this.choiseValue[0].sampleCollection;
            this.changeEditFormItem(0);
            this.dialogVisible = false;
            this.form.sampleSerialNumber = "";
            this.menuType = "A";
            this.form.current = 0;
            // this.setTime(3);
          }
        })
        .then(this.getDataList);
    },
    isRepeat(id) {
      let obj = this.choiseValue.find(jtem => {
        if (id === jtem.id) {
          return jtem;
        }
      });

      return obj && obj.sampleCollection;
    },
    /**
     * 移除timer
     */
    removeTimer() {
      clearTimeout(timer);
      timer = null;
      this.showTimer = false;
    },
    /**
     * 隐藏dialog
     */
    displayDialog() {
      if (this.showTimer) {
        this.dialogVisible = false;
      }
      this.showTimer = false;
    },
    /**
     * 导出
     */
    output() {
      if (this.outputForm.type === "1") {
        this.outputForm.groupBy = "";
      }
      window.open(url + `/app/project/${this.projectId}/sample/export?groupBy=` + this.outputForm.groupBy);
      this.showOutputBox = false;
    },
    /**
     * 取消采样
     */
    cancelSampling(id) {
      this.$confirm("是否取消收样？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.laboratorySamplingService
          .delete(id)
          .then(() => {
            this.$message.success("取消成功");
          })
          .then(this.getDataList);
      });
    },
    /**
     * 作废数据
     */
    disSampling(id) {
      this.$prompt("确定作废这条数据吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputPlaceholder: "作废原因（200字以内）"
      })
        .then(({ value }) => {
          this.$http.laboratorySamplingService
            .validateAndInvalidateSamplingData({ ids: [id], reason: value, valid: false })
            .then(this.getDataList);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    /**
     * 取消作废
     */
    enableSampling(id) {
      this.$prompt("确定取消作废这条数据吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputPlaceholder: "取消作废原因（200字以内）"
      })
        .then(({ value }) => {
          this.$http.laboratorySamplingService
            .validateAndInvalidateSamplingData({ ids: [id], reason: value, valid: true })
            .then(this.getDataList);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    //表头显示列
    checkTrChange(trList) {
      this.trList = trList;
    },
    //组装数据
    splicingComponentValue(isRefreshTable = true, componentData = this.componentData) {
      this.checkedTrId = null;
      this.checkboxTrId = [];
      if (!this.componentValue.length) {
        this.tdData = [];
        this.renderLoading = false;
        return;
      }
      let tempData = []; //临时数组
      this.componentValue.map(item => {
        let tempObj = {}; //临时对象
        for (let item1 of componentData) {
          for (let item2 of item.dataAndAttributeDtoList) {
            if (item2.controlId === item1.id) {
              if (item1.componentType === "CUSTOMBOX") {
                tempObj[item1.id] = {
                  dataNumber: item2.dataNumber, //该组件下的数据条数
                  name: item1.componentAttr.tag,
                  isInvolve: item2.involved, //是否涉及
                  id: item1.id //自定义组件的id
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
              tempObj.isQuoted = item.dataId && item.dataId !== "0"; // 是否被引用
              tempObj.connectionFormDataIds = item.connectionFormDataIds; // 已关联的数据id
              tempObj.batchAdaptationDataList = item.batchAdaptationDataList; // 已关联适配的数据id
              break;
            }
          }
        }
        tempData.push(tempObj);
      });
      this.tdData = tempData;
      // isRefreshTable ? this.tableKey++ : '';
      this.renderLoading = false;
    },
    //表头列表
    getTrList(data, tableDisplayColumnFlag = false) {
      let count = 1;
      return data.map(item => {
        let obj = {
          name: item.componentAttr.tag,
          type: item.componentType,
          id: item.id,
          display: item.display //是否显示该表头
        };
        if (!tableDisplayColumnFlag) {
          // 是否设置了显示列
          if (item.componentType !== "CUSTOMBOX") {
            obj.display = count <= 5; // 没有设置则默认取前5列 + 所有组件
            count++;
          } else {
            obj.display = true;
          }
        }
        return obj;
      });
    }
  }
};
</script>
<style scoped>
.cur-page {
  color: #107ac2;
}
.scan-code-form .left-box .arrow-box {
  font-size: 13px;
  display: flex;
  width: 30px;
  flex-direction: column;
  justify-content: space-around;
}
.scan-code-form .left-box .arrow-box i {
  font-size: 12px;
  flex-grow: 1;
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  color: #1884cc;
  transition: all 0.1s;
  border: 1px solid rgba(224, 224, 224, 1);
}
.scan-code-form .left-box .arrow-box i.icon-active {
  color: #fff;
  background: #1884cc;
}
.scan-code-form .left-box .arrow-box .icon-shang,
.scan-code-form .left-box .arrow-box .icon-xia {
  border-right: none;
  border-bottom: none;
}
.scan-code-form .left-box .arrow-box .icon-shang {
  border-top: none;
}
.scan-code-form .left-box .code-box {
  display: flex;
  margin: 0 15px;
  flex-direction: column;
  justify-content: center;
  min-width: 42px;
  text-align: center;
}

.scan-code-form .code-box span {
  font-size: 14px;
  position: relative;
  top: 5px;
}
.scan-code-form .code-box .icon-i-saoyisao {
  font-size: 23px;
}
.scan-code-form .code-box .icon-sousuo {
  font-size: 20px;
}
.empty-box {
  text-align: center;
  padding: 15px;
  color: #bfbfbf;
  font-size: 12px;
}
.empty-box img {
  margin-bottom: 5px;
}
.change-box {
  line-height: 26px;
}
.change-box > i {
  padding: 6px 8px;
  box-sizing: border-box;
  font-size: 12px;
  color: #1884cc;
}
.change-box > i:hover {
  color: #ffffff;
  background-color: #1884cc;
}
.change-box .active {
  color: #ffffff;
  background-color: #1884cc;
}
.change-box > i:first-child {
  border-top: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 0 5px 0 0;
}
.change-box > i:last-child {
  border-top: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 0 0 5px 0;
}
.warningBox {
  padding: 0 1em;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 1em;
  background-color: #fff8e3;
  height: 40px;
  line-height: 40px;
}
.scan-code-form {
  display: flex;
  justify-content: space-between;
}
.scan-code-form .left-box {
  line-height: 20px;
  width: 70px;
  text-align: center;
  margin-left: 10px;
  padding-top: 3px;
  border: 1px solid #e0e0e0;
  border-radius: 5px 0 0 5px;
  color: #454545;
}
.scan-code-form .left-box > i {
  font-size: 23px;
}

.search-box .scan-code-form >>> .el-input__inner {
  height: 52px;
  line-height: 52px;
}
.bg_laboratory {
  background-color: rgba(240, 243, 245, 1);
  height: 100vh;
}
.laboratory_header {
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  background-color: rgba(16, 122, 194, 1);
  padding: 0 1em;
  box-sizing: border-box;
  color: #ffffff;
}
.rpsy {
  position: absolute;
  left: 6em;
  top: -0.5em;
  z-index: 99;
  width: 80px;
}
</style>

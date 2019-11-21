<template>
  <div>
    <el-dialog
      :title="sharedPartName+'的规则配置'"
      v-el-drag-dialog
      :visible.sync="dialogVisible"
      width="680px"
      @close='closeDialog'
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="115px" label-position="left">
        <el-form-item label="数据输出维度">
          <el-radio-group v-model="form.dimensionFields" @change="handleDimensionChange">
            <el-radio :label="false">无需维度</el-radio>
            <el-radio :label="true">多维度</el-radio>
          </el-radio-group>
          <el-tag
            :key="tag.id"
            v-for="tag of dimensionFieldList"
            size="small"
            closable
            @close="handleClose(tag.id)"
          >{{tag.name}}</el-tag>
            <el-button
              size="mini"
              class="checkSharePartBtn"
              v-show="form.dimensionFields"
              @click="checkDimensionField"
            >选择维度字段</el-button>
        </el-form-item>
        <el-form-item label="数据获取方式">
          <el-radio-group v-model="form.type" @change="handleTypeChange" >
            <el-radio label="JUDGEMENT">判断</el-radio>
            <el-radio label="FORMULA">公式</el-radio>
            <el-radio label="CONDITION">条件</el-radio>
          </el-radio-group>
          <el-popover
            placement="right"
            width="160"
            v-model="rulesDialogVisiable">
            <p>此操作将删除该规则, 是否继续？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="rulesDialogVisiable = false">取消</el-button>
              <el-button type="primary" size="mini" @click="clearAllRules">确定</el-button>
            </div>
            <span slot="reference" v-show="isHaveRules" class="remove-rules-box">
              <el-tooltip  effect="dark" content="删除该共享件规则" placement="right">
                <i class="iconfont icon-shanchu"></i>
              </el-tooltip>
            </span>
            <!-- <el-button slot="reference" v-show="isHaveRules" size='mini'>清除规则</el-button> -->
          </el-popover>
        </el-form-item>
        <div v-show="form.type !== 'JUDGEMENT' || isShowJudgeRules">
          <!-- <el-form-item label="规则配置" v-show="form.type !== 'JUDGEMENT' || isShowJudgeRules"> -->
          <!-- <judge-rules v-if="form.type === 'JUDGEMENT'" :catogryType="sharedPartObj.category" v-model="judgeCurItem" ref="JUDGEMENT"/> -->
          <judge-rules v-if="form.type === 'JUDGEMENT'" :catogryType="sharedPartObj.category" ref="JUDGEMENT"/>
          <formula-rules
           :catogryType="sharedPartObj.category"
            v-if="form.type === 'FORMULA'"
            ref="FORMULA"
          />
          <condition-rules :catogryType="sharedPartObj.category" :sharedPartType='sharedPartType' v-if="form.type === 'CONDITION'" ref="CONDITION"/>
          <!-- </el-form-item> -->
        </div>
      </el-form>
      <div class="rules-box" v-show="form.type === 'JUDGEMENT' && !isShowJudgeRules">
        <el-button
          size="mini"
          icon="iconfont icon-tianjia"
          style="margin:0 0 10px 15px;float:right"
          @click="createRule"
        >新增规则</el-button>
        <div class="table-box app-container" :key="tableKey">
          <vxe-table
            :data="shareComponentRuleForm.judgementRuleList"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            size="mini"
          >
            <vxe-table-column  title="名称（点击修改）" >
              <template slot-scope="scope">
                <span
                  v-if="!scope.row.isEdit"
                  @click="openEditJudgeRuleName(scope.row)"
                  :style="{color:scope.row.defaultRule ? '#F54A44': 'inherit'}"
                  style="cursor:pointer"
                >{{scope.row.name}}</span>
                <div class="edit-name_box" v-else>
                  <el-input v-model="scope.row.name" size="mini" placeholder="请输入名称" clearable></el-input>
                  <div class="td-icon_box">
                    <el-tooltip class="item" effect="dark" content="确定" placement="top">
                      <i class="iconfont icon-baocun" @click="handleEditJudgeRuleName(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="取消" placement="top">
                      <i
                        class="iconfont icon-quxiao"
                        @click="closeEditJudgeRuleName(scope.row)"
                      ></i>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column title="是否启用">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.enable" :disabled="scope.row.defaultRule"></el-checkbox>
              </template>
            </vxe-table-column>
            <vxe-table-column title="运行优先级" width="120">
              <template slot-scope="scope">
                <div class="operation-icon" v-if="!scope.row.defaultRule">
                    <i class="iconfont icon-xiayi" 
                      v-if="scope.$rowIndex < shareComponentRuleForm.judgementRuleList.length - 1"
                      @click="moveDown(scope.$rowIndex)" title="下移"></i>
                    <i
                      class="iconfont icon-shangyi"
                      v-if="scope.$rowIndex > 1"
                      title="上移"
                      @click="moveUp(scope.$rowIndex)"
                      :class="{'icon_style':scope.$rowIndex === shareComponentRuleForm.judgementRuleList.length - 1}"
                    ></i>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" fixed="right" width="120">
              <template slot-scope="scope">
                <div class="operation-icon">
                  <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top"> -->
                    <i class="iconfont icon-xiugai" @click="editRule(scope.row)" title="编辑"></i>
                  <!-- </el-tooltip> -->
                  <!-- <el-tooltip class="item" effect="dark" content="复制" placement="top"> -->
                    <i class="iconfont icon-fuzhi" @click="copyRule(scope.row)" title="复制" v-if="!scope.row.defaultRule"></i>
                  <!-- </el-tooltip> -->
                  <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top"> -->
                    <i class="iconfont icon-shanchu" @click="deleteRule(scope.$rowIndex)" title="删除" v-if="!scope.row.defaultRule"></i>
                  <!-- </el-tooltip> -->
                </div>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backRulesList" v-show="isShowJudgeRules" size="medium" >取 消</el-button>
        <el-button type="primary" @click="backRulesList('SAVE')" v-show="isShowJudgeRules" size="medium" >保 存</el-button>
        <el-button @click="dialogVisible = false" size='medium' v-show="!isShowJudgeRules">取 消</el-button>
        <el-button type="primary" @click="saveRules" size='medium' v-show="!isShowJudgeRules">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 选择共享件或者系统变量 -->
    <searchSharePart @change="getCheckShareParts" ref='searchSharePart' :isTable='sharedPartType === "TABLE"' :catogryType="sharedPartObj.category" :tableheadShareParts='tableheadShareParts'/>
  </div>
</template> 
<script>
import judgeRules from "./components/judgeRules.vue";
import formulaRules from "./components/formulaRules.vue";
import conditionRules from "./components/conditionRules.vue";
import searchSharePart from "./components/searchSharePart.vue";
import Sortable from "sortablejs";
export default {
  name: "reportRules",
  components: {
    conditionRules,
    formulaRules,
    judgeRules,
    searchSharePart
  },
  data() {
    return {
      form: {
        dimensionFields: false, //维度
        type: "JUDGEMENT" //规则类型
      },
      sharedPartObj: {}, //添加规则的共享件的
      sharedPartName:'',  //添加规则的共享件、或者表头的名字
      shareComponentRuleForm: {
        judgementRuleList: [{
          booleanExpressionList: [],
          defaultRule:true, // 是否为默认规则
          enable: true,
          name:'不满足条件(默认值)',
          untenableOut: "",
          tenableOut: "",
          isEdit: false,
          oldName:'不满足条件(默认值)',
          orderNo: 1
        }], //判断规则数组
        outputFieldId: "",
        shareComponentCondition: {},
        shareComponentFormula: null,
        type: "JUDGEMENT"
      }, //规则数组
      dimensionFieldList: [], //多维度选择的字段列表
      dialogVisible: false,
      rulesDialogVisiable:false, //规则清除弹框
      isShowJudgeRules: false, //是否显示规则添加,开始添加或编辑规则
      isHaveRules: false, //该共享件是否具有规则
      sortable: null,
      tableKey: 0,
      // newTableData: [], //排序后的列表
      judgeCurItem: {}, //当前判断规则的对象
      judgeType:'ADD', //判断规则设置的类型 add 新增 edit 修改
      sharedPartType: "TEXT", //共享件类型  TABLE 表格  TEXT为 普通, IMAGE 图片
    };
  },
  props:{
    tableheadShareParts:Array, // 该表格的表头列表
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.clearForm();
        // this.$emit("hidden");
      }
    },
    rulesType(val){
      if(val !== 'JUDGEMENT'){
        this.isShowJudgeRules = false;
      }
    },
    dimensionType(val){
      if(!val){
        this.dimensionFieldList = []
      }
    }
  },
  computed:{
    rulesType(){
      return this.form.type
    },
    //维度
    dimensionType(){  
      return this.form.dimensionFields
    }
  },
  methods: {
    createRule() {
      const judgementRuleList = this.shareComponentRuleForm.judgementRuleList
      if(!judgementRuleList){  //避免为null的情况
        this.shareComponentRuleForm.judgementRuleList = [{
          booleanExpressionList: [],
          defaultRule:true, // 是否为默认规则
          enable: true,
          name:'不满足条件(默认值)',
          untenableOut: "",
          tenableOut: "",
          isEdit: false,
          oldName:'不满足条件(默认值)',
          orderNo: 1
        }]
      }
      const orderNo = this.getMaxOrderNo()
      const itemObj = {
        booleanExpressionList: [],
        defaultRule:false, // 是否为默认规则
        enable: true,
        name:
          "规则" + orderNo,
        untenableOut: "",
        tenableOut: "",
        isEdit: false,
        oldName:
          "规则" + orderNo,
        orderNo: orderNo 
      }
      this.judgeCurItem = itemObj;
      this.openJudge(this.judgeCurItem);
      this.judgeType = 'ADD';
    },
    copyRule(item){
      const obj = JSON.parse(JSON.stringify(item));
      obj.orderNo = this.shareComponentRuleForm.judgementRuleList.length + 1;
      obj.name = item.name + '（副本）'
      obj.oldName = item.name + '（副本）'
      this.shareComponentRuleForm.judgementRuleList.push(obj)
    },
    editRule(item) {
      this.judgeCurItem = JSON.parse(JSON.stringify(item));
      this.judgeType = 'EDIT';
      this.openJudge(this.judgeCurItem)
    },
    // 打开设置判断组件
    openJudge(data){
      this.$refs['JUDGEMENT'].setValue(data)
      this.isShowJudgeRules = true;
    },
    deleteRule(index) {
      this.shareComponentRuleForm.judgementRuleList.splice(index, 1);
    },
    //获取当前最大的序号
    getMaxOrderNo() {
      if (!this.shareComponentRuleForm.judgementRuleList.length) {
        return 1;
      }
      let orderNoList = this.shareComponentRuleForm.judgementRuleList.map(
        item => item.orderNo
      );
      return Math.max.apply(this, orderNoList) + 1;
    },
    openDialog(data, sharedPartName = '',type = "TEXT", category) {    //params { type }  type表示 为table 则data为表格规则对象 ， 否则为共享件id
      this.sharedPartType = type;
      // this.formulaKey = true;
      if (type === 'TABLE') {
        this.initData(data);
        this.sharedPartObj.category = category
        this.sharedPartName = sharedPartName
      } else {
        this.getSharePartById(data);
      }
      this.dialogVisible = true;
    },
    //选择类型变化
    handleTypeChange(val) {},
    //维度选择变化
    handleDimensionChange(val) {},
    //去掉选择的共享件
    handleClose(id) {
      this.dimensionFieldList = this.dimensionFieldList.filter(
        item => item.id !== id
      );
    },
    //设置表格的编辑属性
    setEditProps() {
      this.shareComponentRuleForm.judgementRuleList = this.shareComponentRuleForm.judgementRuleList.map(
        item => {
          this.$set(item, "isEdit", false);
          this.$set(item, "oldName", item.name);
          return item;
        }
      );
    },
    //选择维度字段
    checkDimensionField(){
      this.$refs.searchSharePart.openDialog(this.dimensionFieldList) //重置搜索条件
    },
    //获取选的共享件
    getCheckShareParts(data) {
      this.dimensionFieldList = data;
    },
    //返回判断规则列表 
    backRulesList(type) {
      if(type === 'SAVE'){
        if(!this.judgeCurItem.tenableOut || this.judgeCurItem.tenableOut === '<p><br></p>'){
          this.$message.error('条件输出设置不能为空!');
          return;
        }
        if(this.judgeType === 'ADD'){
          this.shareComponentRuleForm.judgementRuleList.push(this.judgeCurItem)
        }else{
          this.shareComponentRuleForm.judgementRuleList = this.shareComponentRuleForm.judgementRuleList.map(item => {
            if(item.orderNo === this.judgeCurItem.orderNo){
              item = this.judgeCurItem
            }
            return item
          })
        }
      }
      this.isShowJudgeRules = false;
      this.judgeCurItem = {};
      // this.$refs['JUDGEMENT'].resetForm()
    },
    //上移
    moveUp(index) {
      let arr = this.shareComponentRuleForm.judgementRuleList.splice(index, 1);
      this.shareComponentRuleForm.judgementRuleList.splice(
        index - 1,
        0,
        arr[0]
      );
    },
    //下移
    moveDown(index) {
      let arr = this.shareComponentRuleForm.judgementRuleList.splice(index, 1);
      this.shareComponentRuleForm.judgementRuleList.splice(
        index + 1,
        0,
        arr[0]
      );
    },
    // 打开编辑判断规则名称input
    openEditJudgeRuleName(row){
      row.isEdit = !row.defaultRule; // 过滤掉默认规则, 默认规则不能编辑
    },
    // 执行编辑判断规则名称
    handleEditJudgeRuleName(row){
      row.isEdit = false;
      row.oldName = row.name;
    },
    // 取消编辑判断规则名称
    closeEditJudgeRuleName(row){
      row.isEdit = false;
      row.name = row.oldName;
    },
    //清除所有规则
    clearAllRules(){
      this.rulesDialogVisiable = false;
      this.saveRulesService('DELETE');
    },
    //清空表单
    clearForm() {
      this.form.type = "JUDGEMENT";
      this.form.dimensionFields = false;
      this.dimensionFieldList = []; //多维度选择的字段列表
      this.sharedPartObj = {};
      this.sharedPartType='TEXT'
      this.shareComponentRuleForm = {
        judgementRuleList: [{
          booleanExpressionList: [],
          defaultRule:true, // 是否为默认规则
          enable: true,
          name:'不满足条件(默认值)',
          untenableOut: "",
          tenableOut: "",
          isEdit: false,
          oldName:'不满足条件(默认值)',
          orderNo: 1
        }], //判断规则数组
        outputFieldId: "",
        shareComponentCondition: {},
        shareComponentFormula: null,
        type: "JUDGEMENT"
      }; //规则数组
      //多维度选择的字段列表
      this.isHaveRules = false;
      //该共享件是否具有规则
      this.judgeCurItem = {};
      this.isShowJudgeRules = false;
      const FORMULA = this.$refs["FORMULA"];
      const CONDITION = this.$refs["CONDITION"];
      FORMULA && FORMULA.resetForm();
      CONDITION && CONDITION.resetForm();
    },
    //-----------------------接口函数--------------------
    //根据id获取共享件
    getSharePartById(id) {
      this.$http.sharedPartsService.getSharedPartsFieldById(id).then(res => {
        this.sharedPartObj = res.data;
        this.sharedPartName = res.data.name
        if (
          res.data.shareComponentRuleList &&
          res.data.shareComponentRuleList.length
        ) {
          this.initData(res.data.shareComponentRuleList[0]);
        }
      });
    },
    //编辑初始化数据
    initData(data) {
      //有数据填充
      if (data) {
        this.shareComponentRuleForm = data;
        this.form = {
          dimensionFields: !!data.dimensionFields.length, //维度
          type: data.type //规则类型
        };
        data.dimensionFields.length &&
          this.getSharePartByIds(data.dimensionFields);
        this.isHaveRules = true;
        if (this.form.type === "JUDGEMENT") {
          this.setEditProps();
        } else if (this.form.type === "FORMULA") {
          this.$nextTick(() => {
            this.$refs[this.form.type].initData(
              this.shareComponentRuleForm.shareComponentFormula
            ); //初始化条件数据
          });
        }else if (this.form.type === "CONDITION") {
          this.$nextTick(() => {
            this.$refs["CONDITION"].initData(
              this.shareComponentRuleForm.shareComponentCondition
            ); //初始化条件数据
          });
        }
      }
    },
    //根据id批量获取共享件
    getSharePartByIds(ids) {
      this.$http.sharedPartsRulesService
        .getSharePartByIds({ ids })
        .then(res => {
          this.dimensionFieldList = res.data.map(item => ({
            id: item.id,
            name: item.name
          }));
        });
    },
    //保存规则
    saveRules() {
      if(this.form.dimensionFields && !this.dimensionFieldList.length){
        this.$message.error('请选择维度！');
        return ;
      }
      this.shareComponentRuleForm.dimensionFields = this.dimensionFieldList.map(
        item => item.id
      );
      this.shareComponentRuleForm.type = this.form.type;
      switch (this.form.type) {
        case "JUDGEMENT":
          if(!this.shareComponentRuleForm.judgementRuleList.length){
            this.$message.error('规则列表不能为空！');
            return ;
          }
          this.shareComponentRuleForm.judgementRuleList = this.shareComponentRuleForm.judgementRuleList.map(
            item => {
              // if (item.orderNo === this.judgeCurItem.orderNo) {
              //   item = { ...item, ...this.judgeCurItem };
              // }
              delete item.isEdit;
              delete item.oldName;
              return item;
            }
          );
          this.shareComponentRuleForm.shareComponentCondition = null;
          this.shareComponentRuleForm.shareComponentFormula = null;
          this.saveRulesService();
          break;
        case "FORMULA":
          let params = this.$refs[this.form.type].saveFormulaRules();
          if(!params) return ;
           
          this.shareComponentRuleForm.shareComponentFormula = params;
          this.shareComponentRuleForm.judgementRuleList = null;
          this.shareComponentRuleForm.shareComponentCondition = null;
          this.saveRulesService();
          break;
        default: {
          let params = this.$refs[this.form.type].saveConditionRules();
          if(!params) return ;
          this.shareComponentRuleForm.shareComponentCondition = params;
          this.shareComponentRuleForm.judgementRuleList = null;
          this.shareComponentRuleForm.shareComponentFormula = null;
          this.saveRulesService();
        };break;
      }
    },
     /**
     * @param { string } type  SAVE 保存 ， DELETE 删除
     *  */
    //保存规则函数
    saveRulesService(type = 'SAVE') {
      //表格表头添加规则
      if (this.sharedPartType === "TABLE") {
        this.$emit("getTrRules",this.shareComponentRuleForm, type !== 'SAVE');
        this.dialogVisible = false;
        this.$message({
           message: `${type === 'SAVE' ? '规则添加成功' : '规则已删除'}`,
          type: "success"
        });
      } else {
          if(type === 'SAVE'){
            //共享件添加规则
            this.shareComponentRuleForm.outputFieldId = this.sharedPartObj.id;
            this.sharedPartObj.shareComponentRuleList = [
              this.shareComponentRuleForm
            ];
          }else{ //清除规则
            this.sharedPartObj.shareComponentRuleList = null;
          }
          this.$http.sharedPartsRulesService
            .addSharePartRules(this.sharedPartObj.id, this.sharedPartObj)
            .then(res => {
              this.dialogVisible = false;
              this.$emit("refreshList");
              this.$message({
                message: `${type === 'SAVE' ? '规则添加成功' : '规则已删除'}`,
                type: "success"
              });
            });
        }
    },
    closeDialog(){
      this.$emit('destroyed') // 销毁组件
    },
    tableRowClassName({ row }) {
      return row.defaultRule ? 'drlft-row' : '';
    },
  },
};
</script>
<style scoped>
.rules-box {
  overflow: hidden;
}
.table-box >>> .vxe-table thead {
  color: rgb(47, 49, 51);
}
.edit-name_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.td-icon_box {
  margin-left: 5px;
  width: 60px;
  display: flex;
  color: #26beff;
  font-size: 13px;
  justify-content: space-around;
}
.td-icon_box i:hover {
  color: #107AC2;
  cursor: pointer;
}
/* .checkSharePartBtn {
  position: absolute;
  top: 6px;
  right: 0;
} */
.backBtn {
  position: absolute;
  left: 25px;
}
.remove-rules-box{
  margin-left: 37px;
  cursor: pointer;
}
.remove-rules-box:hover{
  color:#409eff;
}
.icon_style {
  margin-left: 33px;
}
</style>

<template>
  <div>
    <el-form ref="form" :model="formAttribute" label-width="70px" label-position="top">
      <el-form-item label="文本标签">
        <el-input
          v-model="formAttribute.tag"
          placeholder="请输入内容"
          size="mini"
          clearable
          v-show="formAttribute.fieldId"
        ></el-input>
        <el-button
          type="primary"
          size="mini"
          style="position: absolute;top:-29px;right:0"
          icon="iconfont icon-jia"
          @click="addFiled"
        >选择字段</el-button>
      </el-form-item>
      <div class="line"></div>
      <div>
        <h3 class="form-title">选项设置</h3>
        <div class="tabs-box">
          <el-radio-group v-model="formAttribute.choiceItemsType" size="mini" @change="choiceItemsTypeChange">
            <el-radio-button label="FIXED_ITEMS">固定值</el-radio-button>
            <el-radio-button label="DYNAMIC_TTEMS">动态数据</el-radio-button>
          </el-radio-group>
        </div>
        <div v-if="formAttribute.choiceItemsType === 'FIXED_ITEMS'">
          <draggable :list="formAttribute.choiceItemsChoiceBox" :options="dragOptions">
            <transition-group tag="ul" id="formAttribute" class="add-optionss">
              <li v-for="(item,index) of formAttribute.choiceItemsChoiceBox" :key="index">
                <el-checkbox v-model="item.chosen" v-if="['MULTIPLE_COMBOBOX','CHECKBOX'].includes(formAttribute.checkType)" style="margin-right:0"></el-checkbox>
                <el-checkbox v-model="item.chosen" v-else @change="(val) => handleChosenChange(val, index)" style="margin-right:0"> </el-checkbox>
                <el-input
                  v-model="item.choiceValue"
                  placeholder="请输入内容"
                  size="mini"
                  style="width:66%;margin-left:5px"
                ></el-input>
                <i class="iconfont icon-jia" @click="addOptions" v-if="index===0" title="增加"></i>
                <i class="iconfont icon-jian" v-else @click="deleteOptions(index)" title="减去"></i>
                <i class="iconfont icon-yidong middleDrag" title="移动"></i>
              </li>
            </transition-group>
          </draggable>
          <el-button
            type="primary"
            plain
            size="mini"
            icon="iconfont icon-piliangtianjia"
            @click="openDialog"
          >批量增加选项</el-button>
        </div>
        <div class="treeselect" v-else> 
          <el-form-item label="数据类型">
            <el-select
              v-model="formAttribute.choiceDynamicDataConfig.choiceDynamicDataType"
              size="mini"
              style="width:100%"
              placeholder="请选择数据类型"
              @change="handleDataTypeChange"
            >
              <el-option label="表单数据" value="FORM_DATA"></el-option>
              <el-option label="系统参数" value="SYSTEM_DATA"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="formAttribute.choiceDynamicDataConfig.choiceDynamicDataType === 'FORM_DATA'"
            label="表单"
          >
            <el-select
              v-model="formAttribute.choiceDynamicDataConfig.connectedformId"
              size="mini"
              style="width:100%"
              placeholder="请选择表单"
              clearable
              @change="handleChange"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item,index) of templateList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="formAttribute.choiceDynamicDataConfig.choiceDynamicDataType === 'SYSTEM_DATA'"
            label="系统参数"
          >
            <el-select
              v-model="formAttribute.choiceDynamicDataConfig.dataSourceEnum"
              size="mini"
              style="width:100%"
              placeholder="请选择系统参数"
              @change="handleChange"
            >
              <el-option :label="item.name" :value="item.id" v-for='item in dataSourceEnumList' :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="表单字段"
          >
            <el-select
              v-model="formAttribute.choiceDynamicDataConfig.connectedComponentIds"
              multiple
              size="mini"
              style="width:100%"
              placeholder="请选择字段"
            >
              <el-option
                v-for="item in filedList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="筛选条件" v-if='formAttribute.choiceDynamicDataConfig.connectedformId || formAttribute.choiceDynamicDataConfig.choiceDynamicDataType === "SYSTEM_DATA"'>
            <div>
              <el-button 
                type="primary" 
                size="mini" 
                plain 
                style="width:100%" 
                @click="openAddRulesDialog">
                {{formAttribute.choiceDynamicDataConfig.filterCondition.length ? '编辑筛选条件' : '添加筛选条件'}}
              </el-button>
            </div>
            <el-button  
              size="mini" 
              style="width:100%" 
              @click="formAttribute.choiceDynamicDataConfig.filterCondition = []">
              清除筛选条件
            </el-button>
          </el-form-item>
        </div>
      </div>
      <div>
        <div class="line" ></div>
        <h3 class="form-title">此题设置</h3>
        <div>
          <div class="form-item-box">
            <label class="el-form-item__label">允许其它值</label>
            <el-switch v-model="formAttribute.allowOtherValueChoiceBox"></el-switch>
          </div>
          <div class="form-item-box">
						<label class="el-form-item__label">加载历史记录</label>
						<el-switch v-model="formAttribute.showHistoryValue" ></el-switch>
					</div>
          <div v-if="formAttribute.allowOtherValueChoiceBox">
            <el-form-item label="填写设置" >
            <el-select v-model="formAttribute.inputModle.inputType" size="mini" style="width:100%">
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item,index) of validationSettings"
                :key="index"
              ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item :label="formAttribute.inputModle.inputType === 'NONE' ? '最少字数':'最小值'">
              <el-input v-model="formAttribute.minLengthTextBox" placeholder="请输入内容" size='mini'
              @input="(val) => { formAttribute.minLengthTextBox = Number(val)}" 
              @blur='validateNumber(formAttribute.minLengthTextBox,"minLengthTextBox")'></el-input>
            </el-form-item>
            <el-form-item :label="formAttribute.inputModle.inputType === 'NONE' ? '最多字数':'最大值'">
              <el-input v-model="formAttribute.maxLengthTextBox" placeholder="请输入内容" size='mini' 
              @input="(val) => { formAttribute.maxLengthTextBox = Number(val)}" 
              @blur='validateNumber(formAttribute.maxLengthTextBox,"maxLengthTextBox")'></el-input>
            </el-form-item>
          </div>
         
          <!-- <el-form-item label="字数限制" v-if="formAttribute.allowOtherValueChoiceBox">
            <el-input
              v-model="formAttribute.inputLimiteSizeChoiceBox"
              placeholder
              size="mini"
              style="width:70px;text-align:center"
              @blur="validateNumber(formAttribute.inputLimiteSizeChoiceBox)"
            ></el-input>
            <span style="color:#606266;margin-left:10px;">字</span>
          </el-form-item> -->
        </div>
      </div>
      <el-form-item label="布局">
				<fixed-column-width :formAttribute='formAttribute' />
      </el-form-item>
    </el-form>
    <!-- <el-dialog title="设置条件" :visible.sync="filterRulesDialogVisible" width="40%" :close-on-click-modal="false" v-el-drag-dialog>  -->
        <filter-rules 
          :templateId='formAttribute.choiceDynamicDataConfig.connectedformId'
          :bigCategoryId='bigCategoryId'
          :dataSourceType='dataSourceType'
          ref='filterRules'
          @getData='getFilterRules'/>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="closeFilterRulesDialog" size="medium">取 消</el-button>
        <el-button type="primary" @click="filterRulesDialogVisible = false" size="medium">保 存</el-button>
      </span>
    </el-dialog> -->

    <el-dialog title="添加选项" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" v-el-drag-dialog>
      <div style="margin-top:8px;">
        <span>每行代表一个选项，可以添加多个选项</span>
        <el-input
          v-model="datalist"
          type="textarea"
          placeholder="请输入选项"
          rows="4"
          style="margin-top:10px;"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="medium">取 消</el-button>
        <el-button type="primary" @click="addAllOptions" size="medium">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import filterRules from "@/components/tools/filterRules/index.vue";
import fixedColumnWidth from "./components/fixedColumnWidth.vue";
export default {
  props: ["formAttribute", "templateList","dataSourceEnumList"],
  data() {
    return {
      dialogVisible: false,
      filterRulesDialogVisible:false,
      tempFilterCondition:null, //临时备份筛选规则，用于还原
      datalist: "",
      filedList:[], // 表单或系统参数字段列表
      dragOptions: {
        handle: ".middleDrag",
        animation: 120,
        scroll: true,
        group: {
          pull: false,
          name: "sortlist"
        },
        ghostClass: "ghost-style"
      },
      systemParams: "", //系统参数选择结果
      validationSettings: [
        {
          label: "文本",
          value: "NONE"
        },
        {
          label: "数字",
          value: "NUMBERS"
        },
      ],
    }  
  },
  components: {
    draggable,
    filterRules,
    fixedColumnWidth // 设置列宽
  },
  computed: {
    dataSourceType(){
      if(this.formAttribute.choiceDynamicDataConfig.choiceDynamicDataType === 'FORM_DATA'){
        return 'FORM_DATA'
      }
      return this.formAttribute.choiceDynamicDataConfig.dataSourceEnum
    },
    connectedformId(){
      return this.formAttribute.choiceDynamicDataConfig.connectedformId
    },
    dataSourceEnum(){
      return this.formAttribute.choiceDynamicDataConfig.dataSourceEnum
    },
    // 大类
    bigCategoryId(){
      return this.$route.params.evaluateId.split("-").slice(0, 2).join("-");
    }
  },
  created() {
    this.getAssemblyTree();
  },
  watch: {
    dialogVisible() {
      this.datalist = "";
    },
    connectedformId(val){
      this.getAssemblyTree();
    },
    dataSourceEnum(val){
      this.getAssemblyTree();
    }
  },
  methods: {
    // 获取模板下的所有字段
    getAssemblyTree() {
      //查询表单字段
      if(this.formAttribute.choiceDynamicDataConfig.choiceDynamicDataType === 'FORM_DATA'){
        const formId = this.formAttribute.choiceDynamicDataConfig.connectedformId;
        formId && this.$http.templateService.getTreeListByTempId(formId).then(res => {
          this.filedList = res.data.map(item => {
            return {
              id:item.identifier,
              name:item.componentAttr.tag
            }
          })
        });
      }else{
        // 查询系统字段
        this.$http.systemParamsService.findListByEnum({
          dataSourceEnum:this.formAttribute.choiceDynamicDataConfig.dataSourceEnum,
          bigCategoryId:this.bigCategoryId
        }).then(res => {
          this.filedList = res.data
        });
      }
    },
    //数据类型改变，清空数据
    handleDataTypeChange(val) {
      this.formAttribute.choiceDynamicDataConfig.filterCondition = [] //清空筛选规则
      this.formAttribute.choiceDynamicDataConfig.connectedComponentIds = [];
      this.formAttribute.choiceDynamicDataConfig.connectedformId = "";
      this.formAttribute.choiceDynamicDataConfig.dataSourceEnum = "MATERIALDATA";
      this.filedList = []
      if (val === "SYSTEM_DATA") {
        this.getAssemblyTree()
      }
    },
    //获取模板下面的字段段树
    handleChange(id) {
      this.formAttribute.choiceDynamicDataConfig.filterCondition = [] //清空筛选规则
      this.formAttribute.choiceDynamicDataConfig.connectedComponentIds = [];
      id && this.getAssemblyTree();
    },
    addFiled() {
      this.$emit("openDialog");
    },
    getMaterialTreeSet(node) {
      return {
        id: node.id,
        label: node.componentAttr,
        children: node.subForms
      };
    },
    //单个增加选项
    addOptions() {
      this.formAttribute.choiceItemsChoiceBox.push({ 
        choiceId:null,
        chosen:false, // 是否设置为默认值
        choiceValue:"",
        otherValue:null
      });
    },
    //删除选项
    deleteOptions(index) {
      this.formAttribute.choiceItemsChoiceBox.splice(index, 1);
    },
    //验证输入格式
    validateNumber(val, type) {
      if (!val || !/^([1-9]\d*|0)$/.test(Number(val))) {
				this.$message({
					message: '请输入数字',
					type: 'warning',
					duration: '1000'
				});
				if (type === 'maxLengthTextBox') {
					this.formAttribute.maxLengthTextBox = 200;
				} else {
					this.formAttribute.minLengthTextBox = 1;
				}
			} else if (Number(this.formAttribute.minLengthTextBox) > Number(this.formAttribute.maxLengthTextBox)) {
				this.$message({
					message: '最小值不能大于最大值',
					type: 'warning',
					duration: '1000'
				});
				this.formAttribute.minLengthTextBox = 1;
      }
    },
    //批量增加
    addAllOptions() {
      this.formAttribute.choiceItemsChoiceBox.push(
        ...this.datalist.split("\n").map(item => {
          return { 
            choiceId:null,
            chosen:false, // 是否设置为默认值
            choiceValue:item,
            otherValue:null
          }
        })
      );
      this.closeDialog();
    },
    getSubstanceCategoryType() {},
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.datalist = "";
    },
    //打开对话框
    openDialog() {
      this.dialogVisible = true;
    },
    //打开添加筛选条件框
    openAddRulesDialog(){
      this.$refs.filterRules.openDialog(JSON.parse(JSON.stringify(this.formAttribute.choiceDynamicDataConfig.filterCondition || [])))
    },
    // 获取筛选条件设置
    getFilterRules(data){
      this.formAttribute.choiceDynamicDataConfig.filterCondition = data
    },
    closeFilterRulesDialog(){
      // this.filterRulesDialogVisible = false;
      // this.formAttribute.choiceDynamicDataConfig.filterCondition = JSON.parse(JSON.stringify(this.tempFilterCondition));
      // this.tempFilterCondition = null;
    },
    handleChosenChange(val, index){
      this.formAttribute.choiceItemsChoiceBox = this.formAttribute.choiceItemsChoiceBox.map((item,i) => {
        item.chosen = i === index ? val : false;
        return item
      })
    },
    choiceItemsTypeChange(type){
      this.handleDataTypeChange()
      if(type === 'DYNAMIC_TTEMS'){
        this.formAttribute.choiceItemsChoiceBox = this.formAttribute.choiceItemsChoiceBox.map((item) => {
          item.chosen = false;
          return item
        })
      }
    }
  }
};
</script>
<style lang="scss" scoped>
 
.add-optionss {
  max-height: 400px;
  overflow-y:auto;
  margin: 6px 0 10px 0;
}

.add-optionss > li {
  position: relative;
  margin-bottom: 7px;
}
.add-optionss i {
  position: absolute;
  right: 8px;
  top: 6px;
  color: #606266;
  cursor: pointer;
}

.add-optionss .icon-yidong {
  right: 30px;
  font-size: 14px;
}

.icon-piliangtianjia {
  font-size: 12px;
  margin-right: 3px;
}

.icon-tianjia {
  font-size: 14px;
  margin-right: 3px;
}

.tabs-box {
  margin: 10px 0;
}
.filter-box {
  font-size: 12px;
}
.filter-box .el-button {
  padding: 5px 7px;
}
</style>
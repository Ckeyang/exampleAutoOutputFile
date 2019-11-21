<template>
  <div>
    <el-form ref="form" v-model="formulaForm" label-width="115px" label-position="left">
      <el-form-item label="公式配置" :rules="{ required: true}">
        <el-radio-group v-model="formulaForm.formulaType" @change="formulaTypeChange">
          <el-radio label="BUSINESS">
            <span>业务公式</span>
            <el-select
              filterable
              v-model="formulaForm.formulaId"
              @change="checkedFormulaId"
              placeholder="请选择"
              style="width:160px;margin-left:5px"
              size="mini"
              v-show="formulaForm.formulaType === 'BUSINESS'"
            >
              <el-option
                v-for="item in formulaList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-radio>
          <el-radio label="CUSTOMIZE">
            <span>自定义公式</span>
          </el-radio>
          <el-radio label="BASIC">
            <span>基础公式</span>
            <el-select
              filterable
              v-model="formulaForm.formulaId"
              @change="checkedFormulaId"
              placeholder="请选择"
              style="width:160px;margin-left:5px"
              size="mini"
              v-show="formulaForm.formulaType === 'BASIC'"
            >
              <el-option
                v-for="item in formulaList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="表达式图例" v-show="(formulaForm.formulaType === 'BUSINESS'||formulaForm.formulaType === 'BASIC') && formulaImage">
        <div class="img-box">
          <img :src="formulaImage" alt="表达式图例"  style="width:240px;">
        </div>
      </el-form-item>
      <el-form-item label="公式表达式" v-if="formulaForm.formulaType==='CUSTOMIZE'">
        <el-tooltip   placement="top-start" effect="light" :offset='30'>
          <div slot="content" class="tips-content">四则运算先参数后四则，函数运算先函数后参数；</div>
          <i class="tooltips-item-icon iconfont icon-wenhaomiaoshu"></i>
        </el-tooltip>
        <div >
          <formula-rule v-model="formulaForm.stringExpression" :formulaList='formulaFuntionsList' :shareList='[]'/>
        </div>
      </el-form-item>
      <!-- :rules="{ required: true}" -->
      <el-form-item
        label="入参设置"
        :rules="{ required: true}"
        v-show="formulaForm.formulaType!='CUSTOMIZE'"
      >
        <el-form ref="form" v-model="formulaForm" label-width="115px" label-position="top" >
          <el-form-item
            label="检出限"
            v-show="formulaForm.formulaType === 'BUSINESS'"
            class="limit-box"
          >
            <el-button
              size="mini"
              @click="checkedLimitPart"
              :title="checkedLimit.id ? checkedLimit.name : ''"
              :class="{'checkedStyle' : checkedLimit.id }"
            >{{checkedLimit.id ? checkedLimit.name : '选择共享件'}}</el-button>
          </el-form-item>
          <!-- :rules="{ required: true}" -->
          <el-form-item :label="item.description + (item.unit && '( '+ item.unit+' )')" v-for="item in parametersList" :key="item.id">
            <div class="form-item_box">
              <div style="height:40px;min-width:170px;">
                <span class="form-item_name" :title="item.name">{{item.name}}</span>
                  <el-button
                    size="mini"
                    @click="checkSharePart(item.name,item.shareComponent)"
                    class="add-sharepart_btn"
                    :class="{'checkedStyle' : item.shareComponent }"
                    :title="item.shareComponent ? item.shareComponent.name : ''"
                  >{{item.shareComponent ? item.shareComponent.name : '选择共享件'}}</el-button>
              </div>
              <div class="default-value-box">
                <span class="form-item_value">默认值</span>
                <el-input
                  v-model="item.defaultValue"
                  @change='(val) => defaultValueChange(val, item)'
                  placeholder="请输入默认值"
                  size="mini"
                  style="width:100%"
                ></el-input>
              </div>
            </div>
          </el-form-item>
           <el-form-item label="修约条件" v-show="formulaForm.formulaType==='BUSINESS'" >
             <el-tooltip   placement="top-start" effect="light" :offset='30'>
              <div slot="content" class="tips-content">
                根据配置的条件，前往【方法列表】
                下寻找对应的修约规则。      
              </div>
              <i class="tooltips-icon iconfont icon-wenhaomiaoshu"></i>
            </el-tooltip>
            <div class="tree-ship">
              <tree-ship v-model="formulaForm.revisionCondition" :catogryType="catogryType" mode='condition' fieldType='EVALUATIONMETHODLIBRARY' ></tree-ship>
            </div>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="修约规则" v-show="formulaForm.formulaType!=='BUSINESS'">
        <revisionL :appendtobody="true" :model.sync="formulaForm.revisionRules" />
        <!-- <div class="remove-icon-box">
          <el-tooltip  effect="dark" content="删除修约规则" placement="right">
            <i class="iconfont icon-shanchu" @click="deleteRevisionRules" v-show='formulaForm.revisionRule && formulaForm.revisionRule.ruleType !=="NONE"'></i>
          </el-tooltip>
        </div> -->
      </el-form-item>
    </el-form>
    <searchSharePart
      isRadio
      @change="getCheckShareParts"
      ref="formulaSharePart"
    />
  </div>
</template>
<script>
import searchSharePart from "./searchSharePart.vue";
import TreeShip from "@/components/tools/TreeShip/TreeShip.vue";
import revisionL from "@/components/tools/revisionL/revisionL.vue";
import formulaRule from "@/components/formulaRule/formulaRule.vue";
import {validateNumber} from "@/utils.js";
export default {
  name: "formulaRules",
  components: { searchSharePart, TreeShip, formulaRule ,revisionL},
  data() {
    return {
      formulaForm: {
        formulaType: "BUSINESS", //公式分类
        formulaId: "", //公式id
        name:'', // 公式名称
        stringExpression:'', // 公式表达式
        revisionCondition:[], // 业务公式修约
        detectionLimit: "", //限值
        revisionRules: []
      },
      formulaImage:'', //公式图片地址
      formulaList: [], //公式列表
      formulaFuntionsList:[], // 公式函数列表
      parametersList: [], //选择的公式的参数列表
      checkSharePartList: [], //已选择的参数共享件
      currParamsName: "", //当前选择参数共享件的参数名称
      checkedLimit: {}, //当前选择的限值共享件
      curCheckSharePartType:{ //当前正在选择共享件的类型
        type:'' , // 类型   //limit 限值 | paramter 参数
        paramterName:'', //为paramter时的参数name
      },   
      sharePartList:[], // 共享件列表
    };
  },
  props: ["catogryType"],
  computed: {
    // //公式列表分类
    // formulaOptions() {
    //   return this.formulaList.filter(
    //     item => item.formulaType === this.formulaForm.formulaType
    //   );
    // }
  },
  created() {
    // this.getFormulaList(this.catogryType);
    this.getFormulaFuntions() // 获取函数列表
  },
  watch: {
    catogryType:{
      handler(val) {
      // 初始化公式列表
      this.getFormulaList(this.formulaForm.formulaType, val);
      },
      immediate: true
    }
    // catogryType(val){
    //   console.log(val,11)
    //   // 初始化公式列表
    //   this.getFormulaList(this.formulaForm.formulaType, val);
    // }
  },
  methods: {
    // 初始化数据
    initData(formulaData) {
      // 初始化公式列表
      this.getFormulaList(formulaData.formulaType);
      if (formulaData && typeof formulaData === "object") {
        this.parametersList = JSON.parse(
          JSON.stringify(formulaData.parameters)
        );
        let ids = this.parametersList
          .map(item => item.shareComponentId)
          .filter(item => !!item);
        ids.push(formulaData.detectionLimit);
        this.parametersList.length && this.getSharePartByIds(formulaData, ids); //查询共享件
        let { formulaId, formulaType, stringExpression ,name, revisionRules, revisionCondition } = { ...formulaData };
        this.formulaForm = {
          formulaType, //公式分类
          formulaId, //公式id
          stringExpression,
          revisionRules ,
          revisionCondition,
          name,
          detectionLimit: "" //限值
        };
      }
    },
    //初始化公式图片
    initFormulaImage(){
      const checkedFormulaOptions = this.formulaList.find(
            item => item.id === this.formulaForm.formulaId
          )
          console.log(this.formulaForm.formulaId)
      this.formulaImage = checkedFormulaOptions ? checkedFormulaOptions.image : ''
    },
    //根据id批量获取共享件
    getSharePartByIds(formulaData, ids) {
      if (!ids || !ids.length) {
        return;
      }
      this.$http.sharedPartsRulesService
        .getSharePartByIds({ ids })
        .then(res => {
          //编辑初始化数据
          //限值
          if (formulaData.detectionLimit) {
            //有限值
            this.checkedLimit = res.data.find(
              item => item.id === formulaData.detectionLimit
            );
            const sharePart = res.data.find(
              item => item.id === formulaData.detectionLimit
            );
            sharePart && (this.checkedLimit = { id:sharePart.id, name:sharePart.name })
          }
          //参数
          this.parametersList = this.parametersList.map(item => {
            let obj = null;
            for (const item2 of res.data) {
              if (item2.id === item.shareComponentId) {
                obj = item2;
                break;
              }
            }
            item.shareComponent = obj ? { id: obj.id, name: obj.name } : null;
            delete item.shareComponentId;
            return item;
          });
        });
    },
    getFormulaFuntions(){
      this.$http.ruleService.getFormulaFuntions().then((res)=>{
        this.formulaFuntionsList = res.data
      })
    },
    //获取选择公式的参数列表
    checkedFormulaId(val) {
      const checkedFormulaOptions =  this.formulaList.find(
            item => item.id === this.formulaForm.formulaId
          )
      this.parametersList = JSON.parse( JSON.stringify(checkedFormulaOptions.parameters));
      this.formulaImage = checkedFormulaOptions.image
      this.formulaForm.name = checkedFormulaOptions.name
      this.formulaForm.stringExpression = checkedFormulaOptions.expression
    },
    //选择共享件
    checkSharePart(name, shareComponent) {
      this.curCheckSharePartType.type = 'paramter'
      this.curCheckSharePartType.paramterName = name;
      this.$refs.formulaSharePart.openDialog(shareComponent ? [shareComponent] : [])
    },
    //获取选择的共享件
    getCheckShareParts(data) {
      if(this.curCheckSharePartType.type === 'limit'){
        this.checkedLimit = data.pop() || {};
      }else{
        this.parametersList = this.parametersList.map(item => {
          if (item.name === this.curCheckSharePartType.paramterName) {
            item.shareComponent = data.pop() || "";
          }
          return item;
        });
      }
    },
    //开始选择限值
    checkedLimitPart() {
      this.curCheckSharePartType.type = 'limit'
      this.$refs.formulaSharePart.openDialog([this.checkedLimit])
    },
    //--------------------接口函数---------------------
    //获取所有的公式列表
    getFormulaList(type, catogryType) {
      this.$http.sharedPartsRulesService.getFormulaList({formulaType:type || this.formulaForm.formulaType, businessCategoryType:catogryType || this.catogryType }).then(res => {
        this.formulaList = res.data;
        this.initFormulaImage()
      });
    },
    //校验参数是否选择共享件
    judgeIsCheckSharePart(parametersList) {
      return parametersList.some(
        item => item.required && !item.shareComponent && !item.defaultValue
      );
    },
    //删除修约规则
    deleteRevisionRules(){
      this.formulaForm.revisionRules = []
    },
    // 保存规则
    saveFormulaRules() {
      if (
        !this.formulaForm.formulaId &&
        this.formulaForm.formulaType != "CUSTOMIZE"
      ) {
        this.$message.error("请选择公式配置！");
        return;
      }
      if (this.judgeIsCheckSharePart(this.parametersList)) {
        this.$message.error("入参设置错误，无法保存!");
        return;
      }
      this.formulaForm.detectionLimit = this.checkedLimit.id; //限值id
      let parameters = this.parametersList.map(item => {
        let data = JSON.parse(JSON.stringify(item))
        data.shareComponentId = item.shareComponent ? item.shareComponent.id : '';
        delete data.shareComponent
        return data
      });
      return { ...this.formulaForm, parameters };
    },
    // 数字校验
    defaultValueChange(val, item){
      if(val && !validateNumber(val)){
        this.$message({
					message: '请输入有效的数字',
					type: 'error',
					duration: '1000'
        });
        this.$nextTick(()=>{
          item.defaultValue = ''
        })
      }else{
        this.$nextTick(()=>{
          item.defaultValue = val.length ? Number(val) : ''
        })
      }
    },
    //重置内容
    resetForm() {
      this.formulaForm = {
        formulaType: "BUSINESS", //公式分类
        formulaId: "", //公式id
        name:'', // 公式名称
        stringExpression:'', // 公式表达式
        revisionCondition:[], // 业务公式修约
        detectionLimit: "", //限值
        revisionRule: []
      };
      this.checkedLimit = {};
      this.parametersList = [];
      //选择的公式的参数列表
      this.checkSharePartList = [];
      this.formulaImage = ''
      //已选择的共享件
      this.currParamsName = ""; //当前选择共享件的参数名称
    },
    searchSharePartHide() {
      const searchSharePartNode = this.$refs.searchSharePart;
      if (Array.isArray(searchSharePartNode)) {
        searchSharePartNode.map(item => {
          //重置搜索条件
          item.clearForm();
        });
      }
      this.$refs.limitSharePart.clearForm();
    },
    //公式配置改变清空内容
    formulaTypeChange(type) {
      this.getFormulaList(type)
      this.formulaForm.formulaId = "";
      this.formulaForm.stringExpression = '';
      this.formulaImage = ''
      this.parametersList = [];
      this.checkSharePartList = [];
      this.currParamsName = ""; //当前选择共享件的参数名称
    }
  }
};
</script>

<style scoped>
.img-box{
  line-height: 0;
}
.form-item_box {
  display: flex;
  justify-content: flex-start;
}
.default-value-box {
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;
  margin-left: 25px;
}
.default-value-box >>> .el-input-number__decrease,
.default-value-box >>> .el-input-number__increase {
  display: none;
}
.form-item_name,
.add-sharepart_btn {
  display: inline-block;
  width: 50px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.form-item_value {
  display: inline-block;
  min-width: 60px;
  margin-right: 10px;
}
.add-sharepart_btn {
  width: 100px;
  margin: 5px 10px 0;
  float: right;
}
.checkedStyle {
  border-color: #98c5f5;
  color: #409eff;
}
.limit-box >>> .el-form-item__label {
  line-height: 34px;
}
.limit-box ::before{
  display: none;
}
.paramter-box {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  padding: 0 10px;
}
.tree-ship .treeBox{
  padding: 0;
  margin: 10px;
}
.tree-ship{
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  min-height: 80px;
}
.remove-icon-box{
  position: absolute;
  left:140px;
  top:0;
  cursor: pointer;
}
.remove-icon-box:hover{
  color: #409eff;
}
.tooltips-icon{
  position: absolute;
  left: 70px;
  cursor: pointer;
  top: -30px;
}
.tips-content{
  color: #606266;
}
.tree-ship{
  margin-top: 10px;
}
.tooltips-item-icon{
  position: absolute;
  left:-40px;
  cursor: pointer;
  color: #afb2b6;
}
.tooltips-item-icon:hover{
 color: #107AC2; 
}
</style>
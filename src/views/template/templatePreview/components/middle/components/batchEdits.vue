<template>
  <el-dialog title="批量修改" :visible.sync="dialogVisible" width="30%" v-el-drag-dialog :close-on-click-modal="false" @close='closeDialog'>
        <span class='data-num-tips'>（本次操作将编辑{{dataIdList.length}}条数据）</span>
        <ul>
          <li class="batch-item" v-for="(model,i) in batchList" :key='model.id'>
            <div class="label-box">
              <span>字段</span>
              <i class="iconfont icon-quxiao remove-btn" @click="removeItem(model.id)" v-show="i"></i>
            </div>
            <el-select
              style="width:100%;margin:3px 0 10px"
              size="small"
              v-model="model.id"
              placeholder="请选择字段"
              @change="handleControlChange"
              filterable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item of optionControlIds"
                :disabled="item.disabled"
                :key="item.id"
              ></el-option>
            </el-select>
          <!-- </el-form-item> -->
          <!-- <el-form-item label="修改值"> -->
            <span>修改值</span>
            <div v-if="model.componentType">
              <Cascader v-if="model.componentType ==='CASCADER'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Cascader>
              <Date-picker v-if="model.componentType ==='DATEPICKER'" :formAttribute='model.componentAttr' :formValue='model.formValue' />
              <Inputs v-if="model.componentType ==='TEXTBOX'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Inputs>
              <Check-box :key='model.id' v-if="model.componentType ==='CHECKBOX' || model.componentType ==='RADIOBOX' || model.componentType ==='COMBOBOX' || model.componentType ==='MULTIPLE_COMBOBOX'"
                :formAttribute='model.componentAttr' :formValue='model.formValue'>
              </Check-box>
              <Address v-if="model.componentType ==='ADDRESSBOX'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Address>
              <Dynamic-selection-box v-if="model.componentType ==='DYNAMIC_CHOICE'" :formAttribute='model.componentAttr' :formValue='model.formValue'></Dynamic-selection-box>
            </div>
          </li>
        </ul>
    <el-button size="small" :disabled="disabledAddbtn" plain icon="iconfont icon-tianjia" @click="addBatchItem" class="add-batch-item" style="width:100%">
      添加字段
    </el-button>
    <span slot="footer" class="dialog-footer" >
      <el-button @click="dialogVisible = false" size='medium'>取 消</el-button>
      <el-button type="primary" @click="batchEditDatas" size='medium'>保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import Inputs from '@/components/template/input.vue';
import CheckBox from '@/components/template/CheckBox.vue';
import Address from '@/components/template/Address.vue';
import DatePicker from '@/components/template/DatePicker.vue';
import Cascader from '@/components/template/Cascader.vue';
import DynamicSelectionBox from '@/components/template/DynamicSelectionBox.vue';
import formValidate from "./validate.js";
export default {
    name: "batchEdits",
  	components: {
		Inputs, //填空
		CheckBox, //单选、多选、下拉
		Address, //地址
		DatePicker, //时间控件
		Cascader, //多级下拉框
		DynamicSelectionBox //动态多选框
  },
  data() {
    return {
      dialogVisible: false,
      optionControlIds:[],
      batchList:[], // 保存修改的字段列表
      dataIdList: [], //选中的数据id集合
    };
  },
  props:{
    submitType:{ // 提交类型  SITE_DATA("现场数据"), DETECTION_DATA("检测数据")
      type:String,
      required:true
    },
  },
  computed:{
    disabledAddbtn(){
      return this.optionControlIds.length === this.batchList.length
    }
  },
  methods: {
    closeDialog() {
      const timer = setTimeout(()=>{
        this.dialogVisible = false;
        this.dataIdList = [];
        this.batchList = [];
        clearTimeout(timer)
      },500)
    },
    openDialog(data = [], checkedTrIds) {
      this.dialogVisible = true;
      this.optionControlIds = data
      this.addBatchItem()
      this.dataIdList = checkedTrIds;
    },
    // 从父级组件获取当控件内容
    getControlData(controlId){
      try {
        const data = this.$parent.componentData.find(item => item.id === controlId)
        return JSON.parse(JSON.stringify(data))
      } catch (error) {
        new Error('未找到此控件！')
      }
    },
    addBatchItem(){
      const {id} = this.optionControlIds.find(item => !item.disabled)
      this.batchList.push(this.getControlData(id))
      this.filterRepeat()
    },
    removeItem(id){
      this.batchList = this.batchList.filter(item => item.id !== id)
      this.filterRepeat()
    },
    handleControlChange(controlId){
      this.batchList = this.batchList.map(item =>{
        if(item.id === controlId){
          return this.getControlData(controlId)
        }
        return item       
      })
      this.filterRepeat()
    },
    // 禁选已使用的字段
    filterRepeat(){
      this.optionControlIds = this.optionControlIds.map(item => {
        item.disabled = this.batchList.some(item2 => item2.id === item.id);
        return item
      })
    },
    //批量修改数据
    batchEditDatas(formName) {
      if(this.validateForm()){
        return 
      }
      let params = { 
        controlDtoList:[],
        dataIdList:this.dataIdList,
        submitType: this.submitType,
        url: this.$route.fullPath
      }
      params.controlDtoList = this.batchList.map(item =>{
        return {
          controlId:item.id,
          formValue:item.formValue
        }
      })
      this.$http.formEnterService.batchEdits(params).then(res => {
        this.dialogVisible = false;
        this.$emit("refreshData");
      })
    },
    //格式验证
    validateForm(){
      let errorMesg = []
      /// 验证录入的数据
      for (let item of this.batchList) {
        if(item.componentAttr.fillable){  //只有可以录入的才进行验证
          const mesg = formValidate(item)
          mesg && errorMesg.push(...mesg)
        }; 
      }
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
        errorMesg.length = 0;
      }
      return errorMesg.length > 0
    }
  }
};
</script>
<style scoped>
.success-tips-box{
  text-align: center;
  line-height: 30px;
  margin-top: 10px;
}
.success-tips-box i{
  font-size: 24px;
  color: #52C41A;
}
.success-tips{
  color:#262626;
  font-size: 15px;
}
.success-text{
  color:#8C8C8C;
  font-size: 12px;
  margin-bottom: 20px;
}
.label-box{
  display: flex;
  justify-content: space-between;
}
.remove-btn{
  color: #595959;
  cursor: pointer;
  font-size: 13px;
}
.remove-btn:hover{
  color: #1884CC;
}
.remove-btn::before{
  color: #F64A4A;
  margin-right: 3px;
}
.batch-item{
  padding:5px 10px 5px 10px;
  background:rgba(245,245,245,1);
  border-radius:5px;
  margin-bottom: 5px;
}
.add-batch-item{
  width: 100%;
  margin-top: 15px;
  color:#595959;
  border-style: dashed;
  border-color: #CCCCCC;
}
.data-num-tips{
  color:#B3B3B3;
  position: absolute;
  top: 18px;
  left: 85px;
  font-size: 13px;
}
</style>

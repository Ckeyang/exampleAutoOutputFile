<template>
  <div class="com-input-box">
    <el-form label-position="top" label-width="80px" @submit.native.prevent>
      <el-form-item>
        <div v-show="!isAddChoiceItem">
          <el-select
            v-model="value1"
            placeholder="请选择"
            @change="getOneSelect"
            style="width:170px"
            size="small"
            clearable
            :disabled="!formAttribute.fillable">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="value2"
            placeholder="请选择"
            @change="getTowSelect"
            style="width:170px"
            size="small"
            clearable
            v-show="formAttribute.optionHierarchy>1"
            :disabled="!formAttribute.fillable">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="value3"
            placeholder="请选择"
            @change="getThreeSelect"
            style="width:170px"
            size="small"
            clearable
            v-show="formAttribute.optionHierarchy>2"
            :disabled="!formAttribute.fillable">
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="value4"
            placeholder="请选择"
            @change="getFourSelect"
            style="width:170px"
            size="small"
            clearable
            v-show="formAttribute.optionHierarchy>3"
            :disabled="!formAttribute.fillable">
            <el-option
              v-for="item in options4"
              :key="item.value"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div v-show="isAddChoiceItem" class="add-input-box">
           <el-input  
              placeholder="请输入内容" 
              size='small' 
              clearable 
              style="width:170px"
              v-for='(item, index) in tempChoiceItem'
              v-model="tempChoiceItem[index]"
              ref="addChioceInput" 
              :disabled="index < formValue.stringListValue.length" 
              :key="index"
              @keyup.enter.native="addChoiceItem"></el-input>
          </div>
         <!-- 添加选项 -->
        <div class="add-choice_item-box" >
          <el-button type="text" v-show="formAttribute.allowOtherValueChoiceBox && isAllowAddChoiceItems && !isAddChoiceItem" @click.stop="openAddItem" icon="iconfont icon-jia">添加其它值</el-button>
          <el-button type="text" style="margin-left:0" v-show="formAttribute.allowOtherValueChoiceBox && isAllowAddChoiceItems && isAddChoiceItem" @click.stop="addChoiceItem" icon="iconfont icon-baocun">保存</el-button>
          <el-button type="text" class="close-btn" v-show="formAttribute.allowOtherValueChoiceBox && isAllowAddChoiceItems && isAddChoiceItem" @click.stop="closeAddChoiceItem" icon="iconfont icon-quxiao">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { guid } from '@/utils.js'
export default {
  data() {
    return {
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      tempChoiceItem:[], // 临时的添加选项
      isAddChoiceItem:false // 是否显示添加输入框 
    };
  },
  props:{
    formAttribute:Object,
    formValue:Object,
    //curEnvironment 当前所在环境， template 模板 、 form 表单
    curEnvironment:{
      default:'template',
      type:String
    },
    // 是否可以添加选项， 在预览过程中不能添加
    isAllowAddChoiceItems:{
      default:true,
      type:Boolean
    },
    controlId:String  // 该控件id
  },
  created() {
    this.initData()
    let tempData = this.formAttribute.cascaderItemChoicBox.filter(
      item => !item.parentId
    );
    this.options1 = tempData[0] && tempData[0].label ? tempData : [];
  },
  computed: {
    cascaderItemChoicBox() {
      return this.formAttribute.cascaderItemChoicBox;
    }
  },
  watch: {
    cascaderItemChoicBox(newValue) {
      this.options1 = newValue.filter(item => !item.parentId);
    }
  },
  methods: {
    initData(){
      this.value1 = this.formValue.stringListValue[0] || "";
      this.value2 = this.formValue.stringListValue[1] || "";
      this.value3 = this.formValue.stringListValue[2] || "";
      this.value4 = this.formValue.stringListValue[3] || "";
      // this.formValue.stringListValue.map(item => this.cascaderItemChoicBox.)
      // this.options = this.formAttribute.cascaderItemChoicBox.filter(
      //   item => item.parentId === id
      // );
    },
    //添加选项
    addChoiceItem(){
      let isError = false
      if(this.tempChoiceItem.some(item => item === '')){
        this.$message({
          duration: 2000,
          showClose: true,
          type: "error",
          message: '选项内容不能为空'
        });
        return // 为空不能添加
      }  
      this.tempChoiceItem.slice(this.formValue.stringListValue.length).map(item => {
        if(this.cascaderItemChoicBox.some(item2 => item === item2.label)){
          this.$message({
            duration: 2000,
            showClose: true,
            type: "error",
            message: '选项不能重复'
          });
          isError = true
        }
        return 
      })
      if(isError) return
      // 判断是否在原始数据里选择了上级
      const listValue = this.formValue.stringListValue
      let parentId = null
      let choiceItemList = [...this.tempChoiceItem]
      if(listValue.length){
        const parentValue = listValue.pop() 
        parentId = this.cascaderItemChoicBox.find(item => item.label === parentValue).id // 找到父级节节点
        choiceItemList = choiceItemList.slice(listValue.length + 1) // 截取到新增的节点
      }
      // 建立级联关系
      let result = choiceItemList.reduce((pre, cur, index)=>{
        parentId = pre.length ? pre[index-1].id : parentId
        pre.push({
            'id':guid(),
            'label':cur,
            'parentId':parentId
          })
        return pre
      },[])
      if(this.curEnvironment === 'form'){
        this.$http.formEnterService.addControlChoiceItem(this.controlId, { 'cascaderItemChoicBox': result }).then(res =>{
          this.formAttribute.cascaderItemChoicBox = this.formAttribute.cascaderItemChoicBox.concat(result)
        })
      }else{
        this.formAttribute.cascaderItemChoicBox = this.formAttribute.cascaderItemChoicBox.concat(result)
      }
      this.formValue.stringListValue = [...this.tempChoiceItem]
      const list = ['value1','value2','value3','value4'].slice(0, this.formAttribute.optionHierarchy).filter(item => !this[item])
      result.map((item,index) =>{
        this[list[index]] = item.id
        if(list[index] === 'value1'){
          this.options1 =  this.formAttribute.cascaderItemChoicBox.filter(
            item2 => !item2.parentId
          );
        }else if(list[index] === 'value2'){
          this.options2 =  this.formAttribute.cascaderItemChoicBox.filter(
            item2 => item2.parentId === this.value1
          );
        } else if(list[index] === 'value3'){
          this.options3 =  this.formAttribute.cascaderItemChoicBox.filter(
            item2 => item2.parentId === this.value2
          );
        }else if(list[index] === 'value4'){
          this.options4 =  this.formAttribute.cascaderItemChoicBox.filter(
            item2 => item2.parentId === this.value3
          );
        } 
      })
      // result.map((label,index) => {
      //   const id = this.cascaderItemChoicBox.find(item2 => item2.label === label).id
      //   if(index === 0){
      //     // this.options2 = 
      //   }
      // })
      
      // this.value1 = this.value1 || result[0].id
      // this.value2 = this.value2 || result[1].id
      // this.value3 = this.value3 || result[2].id
      // this.value4 = this.value4 || result[3].id
      // this.getOneSelect(this.value1)
      // this.getTowSelect(this.value2)
      // this.getThreeSelect(this.value3)
      // this.getFourSelect(this.value4)
      // this.initData()
      this.isAddChoiceItem = false;
      this.tempChoiceItem = []
    },
    getOneSelect(id) {
      this.value2 = "";
      this.value3 = "";
      this.value4 = "";
      if(!id){
        this.formValue.stringListValue = []
        this.options2 = []
        this.options3 = []
        this.options4 = []
        return
      }
      this.options2 = this.formAttribute.cascaderItemChoicBox.filter(
        item => item.parentId === id
      );
      this.formValue.stringListValue = [
        this.options1.filter(item => item.id === this.value1)[0].label
      ];
    },
    getTowSelect(id) {
      this.value3 = "";
      this.value4 = "";
      if(!id){
        this.formValue.stringListValue = this.formValue.stringListValue.slice(0, 1)
        this.options3 = []
        this.options4 = []
        return
      }
      this.options3 = this.formAttribute.cascaderItemChoicBox.filter(
        item => item.parentId === id
      );
      this.formValue.stringListValue = [
        this.options1.filter(item => item.id === this.value1)[0].label,
        this.options2.filter(item => item.id === this.value2)[0].label
      ];
    },
    getThreeSelect(id) {
      this.value4 = "";
      if(!id){
        this.formValue.stringListValue = this.formValue.stringListValue.slice(0, 2)
        this.options4 = []
        return
      }
      this.options4 = this.formAttribute.cascaderItemChoicBox.filter(
        item => item.parentId === id
      );
       
      this.formValue.stringListValue = [
        this.options1.filter(item => item.id === this.value1)[0].label,
        this.options2.filter(item => item.id === this.value2)[0].label,
        this.options3.filter(item => item.id === this.value3)[0].label
      ];
    },
    getFourSelect(id) {
      if(!id){
        this.formValue.stringListValue = this.formValue.stringListValue.slice(0, 3)
        this.options4 = []
        return
      }
      this.formValue.stringListValue = [
        this.options1.filter(item => item.id === this.value1)[0].label,
        this.options2.filter(item => item.id === this.value2)[0].label,
        this.options3.filter(item => item.id === this.value3)[0].label,
        this.options4.filter(item => item.id === this.value4)[0].label
      ];
    },
    //显示新增控件
    openAddItem(){
      this.tempChoiceItem = [...Array(this.formAttribute.optionHierarchy - this.formValue.stringListValue.length)].map(item => '')
      this.tempChoiceItem = this.formValue.stringListValue.concat(this.tempChoiceItem)
      this.isAddChoiceItem = true
      this.$nextTick(()=>{
        this.$refs.addChioceInput[0].focus()
      })
    },
    // 关闭控件
    closeAddChoiceItem(){
      this.isAddChoiceItem = false;
      this.tempChoiceItem = []
    },
  }
};
</script>

<style scoped>
.add-choice_item-box{
  display: flex;
  justify-content: flex-start
}
.add-input-box div{
  margin-right: 5px;
}
.add-input-box i{
  cursor: pointer;
  margin-left: 5px;
  color: #1884CC;
}
.add-choice_item-box i:hover{
  color: #107AC2
}
.close-btn{
  color:#595959;
}
.add-choice_item-box .close-btn >>> i.iconfont{
  color: #F64A4A;
}
.add-choice_item-box .close-btn:hover{
  color: #F64A4A;
}
.tool-bar {
  position: absolute;
  right: 60px;
  top: 25px;
  width: 160px;
  display: flex;
  justify-content: space-between;
  font-size: 21px;
}

.tool-bar i {
  cursor: pointer;
}

.tool-bar i:hover {
  color: #26beff;
}

.index-sort {
  font-size: 20px;
  position: absolute;
  left: 15px;
  top: 25px;
}

.com-input-box {
   max-width: 500px;
}
</style>
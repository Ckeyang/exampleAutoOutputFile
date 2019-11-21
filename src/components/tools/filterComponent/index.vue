<template>
  <el-popover
    placement="bottom"
    width="550"
    v-model="filterVisible"
    trigger="click">
  <div click.stop>
    <p class="filter-title">筛选出符合以下条件的数据</p>
    <!-- <el-scrollbar class='filter-box'> -->
      <ul class="filter-box scrollbar-common-style" :key='filterKey'>
        <li v-for="item in filterData" :key="item.uid">
          <el-select v-model="item.key" placeholder="请选择" filterable size="mini" style="width:140px" @change="handelChange(item)">
            <el-option
              v-for="obj in columnKeys"
              :key="obj.key"
              :label="obj.name"
              :value="obj.key">
            </el-option>
          </el-select>
          <p class="separator">{{separatorObj[item.separator]}}</p>
          <div v-if='item.separator === "BETWEEN"' click.stop :key="item.uid">
            <el-date-picker
              v-model="item.startTime"
              size="mini"
              type="date"
              :clearable="false"
              value-format="timestamp"
              @change="startTimeChange(item)"
              @blur="startTimeBlur(item)"
              style="width:140px;"
              placeholder="选择开始时间">
            </el-date-picker>
            <span> ~ </span>
            <el-date-picker
              v-model="item.endTime"
              type="date"
              size="mini"
              :clearable="false"
              :picker-options="pickerOptions"
              @focus="endTimeFocus(item)"
              @change="endTimeChange(item)"
              @blur='endTimeBlur'
              value-format="timestamp"
              style="width:140px;"
              placeholder="选择结束时间">
            </el-date-picker>
          </div> 
          <div v-else >
            <el-select v-model="item.value" filterable placeholder="请选择" size="mini" style="width:140px">
              <el-option
                v-for="(list,i) in item.options"
                :key="i"
                :label="list.label"
                :value="list.value">
              </el-option>
            </el-select>
          </div>
          <el-button type="text" style="margin-left:7px" @click="deleteGroup(item.uid)" icon="iconfont icon-jian"></el-button>
        </li>
        <li>
          <el-button type="text" @click="addGroup" icon="iconfont icon-tianjia">添加筛选条件</el-button>
        </li>
      </ul> 
    <!-- </el-scrollbar> -->
    <div class="footer-box">
      <el-button type="primary" :disabled="!filterData.length" size="mini" style="margin-left:7px" @click="searchBtn" >筛选</el-button>
      <el-button type="text" style="margin-left:7px" @click="clearBtn" icon="iconfont icon-qingkong">清空</el-button>
    </div>
  </div>
    <el-badge :is-dot='!!filterData.length' class="filter-common-btn" slot="reference">
      <el-button type="text" icon="iconfont icon-shaixuan" >筛选</el-button>
    </el-badge>
  </el-popover>
</template>
<script>
import {guid} from '@/utils'
export default {
  name:'filterComponent',
  data() {
    return {
      filterData:[],
      filterVisible:false,
      filterKey:0,
      date:null,
      separatorObj:{
        'EQUAL':'=',
        'CONTAIN':'包含',
        'BETWEEN':'介于'
      }
    }
  },
  computed:{
     pickerOptions(){
       const _this = this
       return {
        disabledDate(time) {
          return time.getTime() < new Date(_this.date).getTime();
        }
       }
     }
  },
  props:{
    columnKeys:{  // 搜索字段
      default:() => []
    },
    tableName:{ // 表枚举
      type:String
    },
    getOptionsFn:{ // 通过字段id获取待选项函数
      type:Function
    },
    getOptionsParams:{ // 搜索的参数
      default:function(){
        return {}
      }
    },
    filterOptionsQueryType:{ // 扫码、收样
      default:'SAMPLED'
    },
    projectId:String, // 项目id
    searchNum:{ // 限制设置搜索条件个数
      default:20
    },
    stateList:{ // 项目状态列表
      type:Object
    },
    dataId:String, // 表单录入筛选时的父级行数据id
    filedState:String, // 状态字段
    value:Array
  },

  watch:{
    value(val){
      this.filterData = val
    },
    filterData(val){
      this.$emit('input', this.filterData)
    }
  },
  methods: {
    searchBtn(){
      let flag = false
      const data = this.filterData.map(item =>{
        if(!item.value && (!item.startTime || !item.endTime)){
          flag = true
        }
        return {
          key:item.key,
          value:item.value,
          separator:item.separator,
          startTime:item.startTime, 
          endTime:item.endTime, 
        }
      })
      if(flag) {
        this.$message.error('筛选条件设置不完整');
        return
      }
      this.$emit('advancedSerach', this.getSearchParams())
    },
    clearBtn(){
      this.filterData = []
      this.searchBtn()
    },
    // 获取搜索参数
    getSearchParams(){
      return this.filterData.map(item =>{
        return {
          key:item.key,
          value:item.value,
          separator:item.separator,
          startTime:item.startTime, 
          endTime:item.endTime, 
        }
      })
    },
    handelChange(item){
      item.separator = this.judgeSeparator(item.key)
      item.value = '';
      item.startTime = '';
      item.endTime = '';

      // 获取该字段对应的值
      switch(this.tableName){
        case 'FORM': { // 表单录入
          this.$http.formEnterService.getAllDataByControlId(item.key, {dataId:this.dataId}).then((res) =>{
            item.options = (res.data || []).map(item => {
              return {
                label:item,
                value:item
              } 
            })
          })
          break
        }
        case 'SCAN_CODE_ENTEY': { // 扫码录入
        const params = Object.assign(this.getOptionsParams)
        params.controlId = item.key
          this.$http.formEnterService.getAllDataByControlIdfromScanCode(this.projectId, params).then((res) =>{
            item.options = (res.data || []).map(item => {
              return {
                label:item,
                value:item
              } 
            })
          })
          break
        }
        default:{
          this.getOptionsFn({filedKey: item.key, name: this.tableName}).then((res) =>{
            if(item.key === this.filedState){
              item.options = (res.data || []).map(item => {
                return {
                  label:this.stateList[item],
                  value:item
                } 
              })
            }else{
              item.options = (res.data || []).map(item => {
                return {
                  label:item,
                  value:item
                } 
              })
            }
          })
        }
      }
    },
    addGroup(){
      if(this.filterData.length >= this.searchNum) {
        this.$message.error(`筛选条件最多设置${this.searchNum}条`);
        return
      }
      this.filterData.push({uid:guid(), key:'', value:'', separator:'EQUAL', options:[]})
    },
    deleteGroup(uid){
      this.filterData = this.filterData.filter(item => item.uid !== uid)
    },
    // 选项改变时改变规则符
    judgeSeparator(key = 'EQUAL'){
      return this.columnKeys.find(item => item.key === key).separator
    },
    startTimeChange(item){
      this.date = item.startTime;
      item.endTime = null;
      this.filterKey ++;
    },
    startTimeBlur(item){
      const t = setTimeout(()=>{
        this.filterVisible = true
        this.filterKey ++;
        this.date = item.startTime;
        item.endTime = null;
        clearTimeout(t)
      },5)
    },
    endTimeBlur(){
      const t = setTimeout(()=>{
        this.filterVisible = true;
        this.filterKey ++;
        clearTimeout(t)
      },5)
       
    },
    endTimeFocus(item){
      this.date = item.startTime || null
    }
  },
}
</script>
<style >
.filter-common-btn{
  position:absolute !important;
  right: 5px;
  top: 19px;
  line-height: 0;
}
.filter-common-btn .el-button{
  padding: 0
}
</style>
<style scoped>
.tools-btn{
  cursor: pointer;
  color: #1884CC;
  margin-left: 3px;
}
.filter-box{
  overflow: auto;
  max-height: 300px;
   
}
.filter-box li{
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.filter-title{
    margin-bottom: 6px;
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #595959;
    line-height: 20px;
}
.separator{
 width: 40px;
 text-align: center;
}
</style>

<template>
    <el-dialog
      :title="searchType === 'SHARE_PARTS'? '共享件' : '系统变量'"
      v-el-drag-dialog
      :visible.sync="sharePartsDialogVisible"
      width="32%"
      :close-on-click-modal="false"
      append-to-body>
      <div>
        <el-form ref="sharePartsFrom" :model="sharePartsFrom" label-width="60px" label-position="left" @submit.native.prevent>
          <el-form-item label="关键字">
            <div class="search-btn_box">
              <el-input placeholder="输入关键字" @input="keyWordsChange" size="small" suffix-icon="el-icon-search" v-model="sharePartsFrom.keyWords" clearable ></el-input>
              <!-- <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="serachData"
                  class="search-btn"
                >搜索</el-button> -->
            </div>
          </el-form-item>
        </el-form>
        <div>
          <ul class="radio-box" v-if="isShowProjectInfoBtn">
            <li @click="taggle('SHARE_PARTS')" :class="{'active':checkType === 'SHARE_PARTS'}">共享件列表</li>
            <li @click="taggle('PROJECTBASICINFO')" :class="{'active':checkType === 'PROJECTBASICINFO'}">项目信息</li>
          </ul>
          <h5 style="font-size:14px;" v-else>{{searchType === 'SHARE_PARTS' ? '共享件列表' : '字段列表'}}</h5>
          <!-- <el-scrollbar class="el-scrollbar_height" v-show="sharePartsList.length"> -->
            <div class="shareParts-box" v-loading='loading' >
              <p class="empty-text" v-if="isEmpty">暂无数据！</p>
              <el-checkbox-group v-model="checkSharePart" @change="handleChange" v-else >
                <virtual-list :size="31" :remain="8">
                  <el-checkbox
                    :label="valueType === 'string' ? item.id : JSON.stringify({id:item.id, name:item.name})"
                    v-for="item in sharePartsList"
                    :key="item.id"
                  >
                    <span>{{item.name}}</span>
                    <span
                      v-show="searchType === 'SHARE_PARTS'"
                      class="markingIcon"
                      :class="{'project-icon':icon === 'PROJECT','substance-icon':icon === 'SUBSTANCE','report-icon':icon === 'REPORT'}"
                      v-for="(icon,i) of item.markingIcon"
                      :key="i"
                    >{{icon === 'PROJECT' ? "项" : icon === 'SUBSTANCE'? '物' : icon === 'REPORT'? '报' :''}}</span>
                  </el-checkbox>
                </virtual-list>
                 
              </el-checkbox-group>
            </div>
          <!-- </el-scrollbar> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sharePartsDialogVisible = false" size="medium" >取 消</el-button>
        <el-button type='primary' @click="submitBtn" size="medium" >确 定</el-button>
      </span>
    </el-dialog>
</template>
<script>
import {debouce, throttle} from '@/utils'
import virtualList from 'vue-virtual-scroll-list'
export default {
  name: "searchSharePart",
  data() {
    return {
      sharePartsFrom: {
        keyWords: "",
      },
      checkType:'SHARE_PARTS', // 筛选的类型  SHARE_PARTS 共享件 、 PROJECTBASICINFO 项目信息
      sharePartsDialogVisible:false,
      checkSharePart: [], //选择的共享件
      sharePartsList: [], //共享件列表
      isEmpty:false,
      loading:false,
    };
  },
  props: {
    catogryType:{
      type:String,
      default:""
    },
    //是否单选
    isRadio: {
      type: Boolean,
      default: false
    },
    isShowProjectInfoBtn:{   // 是否可以选择项目信息， 判断规则会使用
      type: Boolean,
      default: false
    },
    searchType: {
      type: String,
      default: "SHARE_PARTS" //共享件
    },
    tableheadShareParts:{ // 所有表头
      type:Array,
      default:()=>[]
    },
    isTable:{  // 是否在本表格内选择表头
      type:Boolean,
      default:false
    },
    valueType:{  // value的类型  默认为对象， 如果值为id则传string
      default:"object",
    }
  },
  created() {
    // this.serachData();
  },
  // computed:{
  //   isEmpty(){
  //     return !this.sharePartsList.length
  //   }
  // },
  watch: {
    searchType(val) {
      this.checkType = val
      this.serachData();
    },
    sharePartsDialogVisible(val){
      if(!val){
        this.sharePartsFrom.keyWords = '';
        this.checkSharePart = [] //选择的共享件
        this.sharePartsList = [] 
      }
    }
  },
  methods: {
    keyWordsChange:debouce(function(){
      this.serachData()
      }, 300),
    openDialog(data){
      if(this.isTable){
        this.sharePartsList = JSON.parse(JSON.stringify(this.tableheadShareParts))
      }else{
        this.serachData();
      }
      if(this.valueType === 'object'){ // value 为对象
        this.checkSharePart = data.map(item => JSON.stringify(item))
      }else{ 
        this.checkSharePart = data.map(item => item) // value 为id
      }
      this.sharePartsDialogVisible = true;
    },
    //获取数据接口
    serachData() {
      const { keyWords }  = this.sharePartsFrom
      if(!this.isTable){
        this.loading = true
        if (this.checkType === "SHARE_PARTS") {
          this.getSharepartsList(); // 获取共享件
        } else{
          //查询系统参数字段
          this.getSystemFileds();
        }
      }else{
        // 前端搜索
        this.sharePartsList = this.tableheadShareParts.filter(item => !keyWords || (item.name.toLowerCase().indexOf(keyWords.toLowerCase()) > -1))
      }
    },
    clearForm() {
      this.sharePartsFrom = {
        keyWords: "", 
      };
    },
    //获取共享件列表
    getSharepartsList() {
      const params = {
        category:this.catogryType,
        keyWords:this.sharePartsFrom.keyWords,
        shareComponentTypes:['TEXT']
      }
      this.$http.sharedPartsService
        .getSharedPartsList(params)
        .then(res => {
          this.sharePartsList = res.data || [];
          this.isEmpty = !res.data.length
        }).finally(()=>{
          this.loading = false
        });;
    },
    //获取系统变量字段
    getSystemFileds() {
      this.$http.sharedPartsRulesService
        .getSystemFileds({ dataSourceEnum: this.checkType, bigCategoryId: this.catogryType, keyWords:this.sharePartsFrom.keyWords })
        .then(res => {
          this.sharePartsList = res.data || [];
          this.isEmpty = !res.data.length
        }).finally(()=>{
          this.loading = false;
        });
    },
    submitBtn(){
      const valueType = this.valueType
      const data = this.checkSharePart.map(item => valueType === 'object' ? JSON.parse(item) : item)
      this.$emit("change", data);
      this.sharePartsDialogVisible = false;
    },
    handleChange(val) {
      if(this.checkType === 'PROJECTBASICINFO'){
        return;
      }
      //单选
      if (this.isRadio) {
        this.checkSharePart = val.length ? [val.pop()] : []
      }
    },
    taggle(type){
      this.checkType = type
      this.checkSharePart = []
      this.serachData()
    },
  }
};
</script>

<style scoped lang='scss'>
.radio-box {
  display: flex;
  border: 1px solid #E8E8E8;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  position: relative;
  top: 11px;
  li {
    flex: 1;
    text-align: center;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: bold;
  }
  li:first-child {
    border-right: 1px solid #E8E8E8;
  }
  li.active {
    background: #C2EFFF;
    color: #107AC2;
    position: relative;
  }
  .active::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid #C2EFFF;
    position: absolute;
    bottom: -7px;
    left: 50%;
    transform: translateX(-3px);
  }
}
.search-btn_box {
  display:flex;
  align-items: center;
}
.search-btn {
  margin-left: 10px;
}
.markingIcon {
  font-size: 12px;
  padding: 0px 5px;
  border-radius: 4px;
  margin-left: 5px;
  color: #fff;
}
.shareParts-box{
  height: 250px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #E8E8E8;
}
.shareParts-box .el-checkbox:hover {
  background: #edf5ff;
}
.shareParts-box .el-checkbox-group .el-checkbox {
  display: block;
  margin: 5px 0;
  padding: 3px 10px;
}
.project-icon {
  background: #0cd0d0;
}
.substance-icon {
  background: #1d7fff;
}
.report-icon {
  background: #fc5a4c;
}
.empty-text {
  margin-top: 50px;
  margin-bottom: 50px;
  text-align: center;
}
.search-top_box {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

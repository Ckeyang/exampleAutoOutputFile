<template>
  <div>
    <el-dialog title="关联数据" :visible.sync="dialogVisible2" width="700px" v-el-drag-dialog :close-on-click-modal="false">
      <div class="serach-box">
        <el-input v-model="form.keyWord" placeholder="请输入关键字" size="small" clearable @keyup.enter.native="searchData"></el-input>
        <el-button type="primary" size="small" icon="el-serach" @click="searchData">搜 索</el-button>
        <table-head-show-list 
          :trDataList='trList' 
          :componentParentId='parentId'
          :popoverOffset='-20'
          @checkTrChange='checkTrChange'/>
      </div>
      <div style="min-height:200px" v-loading='loading'>
        <el-table
          :data="tdList"
          ref="multipleTable"
          style="width: 100%;margin-top:15px;"
          @select="handleSelectionChange"
          @select-all="handleSelectionChange"
          border
          size="mini"
          v-show="trList.length"
        >
          <el-table-column type="selection" width="55"></el-table-column>
           <el-table-column v-for="(item, index) of isShowTr" :key="index" :label="item.name">
            <template slot-scope="scope" v-if="scope.row[item.id]">
              <div v-if="item.type === 'ADDRESSBOX'">{{ scope.row[item.id] ? renderAddress(scope.row[item.id].addressValue) : '' }}</div>
              <div v-else-if="item.type === 'TEXTBOX'">{{ scope.row[item.id] ? scope.row[item.id].stringValue : '' }}</div>
              <div v-else-if="item.type === 'IMAGEBOX'">
                <span v-if='!scope.row[item.id].imageValue.length || !scope.row[item.id].imageValue[0].url'>暂无图片</span>
                <el-button size="mini" type="primary" v-else plain disabled :title='请到外层列表处查看'>查看图片</el-button>
              </div>
              <div v-else-if="item.type === 'FILEBOX' || item.type === 'VIDEO'">
                <span v-if='!scope.row[item.id].imageValue.length || !scope.row[item.id].imageValue[0].url'>{{item.type === 'FILEBOX' ? '暂无文件' : '暂无视频'}}</span>
                <el-popover
                  placement="bottom"
                  width="200"
                  v-else
                  popper-class="file-popover"
                  trigger="click">
                  <ul class="file-box"  >
                    <li v-for="file in scope.row[item.id].imageValue" :key='file.url'>
                      <a :href="file.url" :title='file.name||""' target="_blank" :download='file.name||""' >
                        {{scope.row[item.id] ? file.name : ''}}
                      </a>
                    </li>
                  </ul>
                  <el-button slot="reference" size='mini' type="primary" plain>{{item.type === 'FILEBOX' ? '查看文件' : '播放视频'}}</el-button>
                </el-popover>
              </div>
              <div v-else-if="item.type === 'CHECKBOX' || item.type === 'CASCADER' || item.type === 'MULTIPLE_COMBOBOX'">{{ scope.row[item.id] ? scope.row[item.id].stringListValue.join('\\') : '' }}</div>
              <div v-else-if="item.type === 'RADIOBOX' || item.type === 'COMBOBOX'">{{ scope.row[item.id] ? scope.row[item.id].stringValue : '' }}</div>
              <div v-else-if="item.type === 'DYNAMIC_CHOICE'">{{scope.row[item.id] ? dynamicChoiceValues(scope.row[item.id].dynamicChoiceValues) : ''}}</div>
              <div v-else-if='!item.type && item.id.indexOf("userName") > -1'>{{scope.row[item.id].stringValue || ''}}</div>
              <div v-else-if='!item.type'>{{ Number(scope.row[item.id].stringValue) | formatDate }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="medium">取 消</el-button>
        <el-button type="primary" @click="submitForm" size="medium">关 联</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import tableHeadShowList from "@/components/tools/tableHeadShowList.vue";
import {filterMap} from '@/utils'
export default {
  name: "associatedData",
  components:{ tableHeadShowList },
  data() {
    return {
      form: {
        keyWord: "",
        ruleId: "", //规则的id
        current: 0,
        pageSize: 30
      },
      loading:false,
      totalNum: 0,
      totalPage: '0',
      dialogVisible2: false,
      dataId: "", //点击关联的数据的id
      parentId:'', //点击关联的组件的id
      formComponents: [], //表格结构
      trList: [],
      tdList: [],
      formDatas: [], //表格数据
      quotedIds: [] //当前选择的关联数据id集合
    };
  },
  watch: {
    dialogVisible2(val) {
      if(!val){
        this.form = {
          keyWord: "",
          ruleId: "" //规则的id
        }
        this.dataId = '';
        this.formDatas = [];
        this.trList = [];
        this.tdList = [];
        this.formComponents = [];
        this.$refs.multipleTable.clearSelection();
      }
    }
  },
  computed:{
    isShowTr(){
      let isShowList = this.trList.filter(item => item.display)
      isShowList.length && this.tableKey++ ; //没有表头不需要重绘
      return isShowList
    }
  },
  methods: {
        //渲染地址
    renderAddress(data) {
      return Object.values(data).join("");
    },
    //通过id获取当前数据
    getFromDataById(id){
      this.$http.formEnterService.getFromDataById(id).then(res=>{
        this.quotedIds = res.data.connectionFormDataIds;
      })
    },
    //表头显示列
    checkTrChange(trList){
      this.trList = trList;
    },
    //动态多选框
    dynamicChoiceValues(data) {
      return data
        .map(item => {
          if (item.otherValue && item.otherValue.length) {
            return `${item.choiceValue}(${item.otherValue
              .map(item2 => item2.value)
              .join("，")})`;
          }
          return item.choiceValue;
        })
        .join("\\");
    },
    closeDialog() {
      this.dialogVisible2 = false;
    },
    /**
     * params{dataId} 数据行id
     * params{ruleId} 数据关联规则id
     *  */
    //打开弹框
    openDialog(dataId = "", parentId = '', ruleId = "") {
      this.form.ruleId = ruleId;
      this.parentId = parentId //当前查询的组件的id
      this.dataId = dataId;
      this.getFromDataById(dataId)
      this.getData();
      this.dialogVisible2 = true;
      this.loading = true
    },
    //关联数据
    submitForm() {
      this.$http.formEnterService
        .relationData(this.dataId, this.form.ruleId, {
          listData: this.quotedIds
        })
        .then(res => {
          this.dialogVisible2 = false;
          this.$message({
            type: "success",
            message: "关联成功"
          });
          this.$emit("refreshData");
        });
        
    },
    //获取表格选择项
    handleSelectionChange(val) {
      this.quotedIds = val.filterMap(item => {
        return item ? item.trId : false
      });
    },
    //搜索
    searchData() {
      this.getData();
    },
    //获取数据
    getData() {
      const { ruleId, ...params } = this.form
      this.$http.formEnterService
        .getRelationListByRuleId(this.dataId, ruleId, params)
        .then(res => {
          this.formComponents = res.data.formComponents;
          this.formDatas = res.data.formDatas;
          this.trList = this.getTrList(res.data.formComponents, res.data.dynamicDisplayColumnFlag);
          this.splicingComponentValue();
        });
    },
    //组装数据
    splicingComponentValue() {
      if (!this.formComponents.length) {
        this.tdList = [];
        return;
      }
      let tempData = []; //临时数组
      this.formDatas.map(item => {
        let tempObj = {}; //临时对象
        for (let item1 of this.formComponents) {
          for (let item2 of item.dataAndAttributeDtoList) {
            if (item2.controlId === item1.id) {
              tempObj.trId = item.id; //该行数据的id
              tempObj[item1.id] = item2.formValue;
              tempObj.addUserId = item.addUserId;
              break;
            }
          }
        }
        tempData.push(tempObj);
      });
      this.tdList = tempData;
      this.$nextTick(() => {
        this.toggleSelection(this.quotedIds);
        this.loading = false;
      });
    },
    //表头列表
      getTrList(data, tableDisplayColumnFlag = false) {
        let count = 1; 
        return data.map(item => {
          let obj = {
            name: item.componentAttr.tag,
            type: item.componentType,
            id: item.id,
            display:item.display  //是否显示该表头
          };
          if(!tableDisplayColumnFlag){ // 是否设置了显示列
            if(item.componentType !== 'CUSTOMBOX'){
              obj.display = (count <= 5) // 没有设置则默认取前5列 + 所有组件
              count++
            }else{
              obj.display = true
            }
          }
          return obj
        });
      },
    //初始化选择
    toggleSelection(rows) {
      if (rows && rows.length) {
        rows.map(item => {
          return this.tdList.find(item2 => item === item2.trId);
        }).forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      }else {
          this.$refs.multipleTable.clearSelection();
        }
    },
  }
};
</script>
<style scoped>
.serach-box {
  display: flex;
  justify-content: space-between;
}
.serach-box >>> button {
  margin-left: 15px;
}
</style>

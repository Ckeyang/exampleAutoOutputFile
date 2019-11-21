<template>
  <div>
    <el-dialog title="引用数据" :visible.sync="dialogVisible2" width="860px"  v-el-drag-dialog :close-on-click-modal="false"> 
      <div class="serach-box">
        <el-input v-model="form.keyWord" placeholder="请输入关键字" size="small" clearable @keyup.enter.native="searchData"></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click='searchData'>搜 索</el-button>
        <table-head-show-list 
          :trDataList='trList' 
          :componentParentId='parentId'
          :popoverOffset='-20'
          @checkTrChange='checkTrChange'/>
      </div>
      <div v-loading='loading' style='min-height:100px;margin-top:15px;'>
        <vxe-table 
        :data="tdList" 
        ref="referenceMultipleTable" 
        :key="tableKey" 
        v-if='trList.length' 
        show-overflow
        show-header-overflow
        highlight-hover-row
        max-height='420'
        style="width: 100%;"  
        @select-change="handelSelectionChange" 
        @select-all='handelSelectionChange' border size="mini" >
          <vxe-table-column type="selection" width="40" align="center" fixed='left'></vxe-table-column>
          <vxe-table-column v-for="(item, index) of isShowTr" :key="index" :title="item.name" width='100' show-overflow>
            <template slot-scope="scope" v-if="scope.row[item.id]">
              <span v-if="['TEXTBOX','RADIOBOX','COMBOBOX'].includes(item.type)">{{ scope.row[item.id] ? scope.row[item.id].stringValue : '' }}</span>
              <span v-else-if="item.type === 'CHECKBOX' || item.type === 'CASCADER' || item.type === 'MULTIPLE_COMBOBOX'">
                {{ scope.row[item.id] ? scope.row[item.id].stringListValue.join('\\') : '' }}
              </span>
              <span v-else-if="item.type === 'ADDRESSBOX'">{{ scope.row[item.id] ? renderAddress(scope.row[item.id].addressValue) : '' }}</span>
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
              <span v-else-if='!item.type && item.id.indexOf("userName") > -1'>{{scope.row[item.id].stringValue || ''}}</span>
              <span v-else-if='!item.type'>{{Number(scope.row[item.id].stringValue) | formatDate}}</span>
              <span v-else>{{ scope.row[item.id] ? scope.row[item.id].stringValue : '' }}</span>
            </template>
          </vxe-table-column>
        </vxe-table>
        <div v-show="tdList.length"><pagniation :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage" ref='pagniation'></pagniation></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="medium">取 消</el-button>
        <el-button type="primary" @click="submitForm()"  size="medium" title='引用选中数据' :disabled="!quotedIds.length">引 用</el-button>
        <el-button type="primary" @click="submitForm(true)"  size="medium" title='复制并引用选中数据' :disabled="!quotedIds.length">复制并引用</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import pagniation from '@/components/tools/Pagniation.vue';
  import tableHeadShowList from "@/components/tools/tableHeadShowList.vue";
  export default {
    name: 'referenceData',
    data() {
      return {
        form: {
          keyWord: '',
          current: 0,
          pageSize: 30
        },
        tableKey:0, // 用于强制刷新表格，防止抖动
        loading:false,
        totalNum: 0,
        totalPage: '0',
        dialogVisible2: false,
        trList: [],
        tdList: [],
        parentId: '', //临时存储传入的parentId
        componentValues: [],
        componentDatas: [],
        dataId: '', //表格行id
        quotedIds: [] ,//当前选择的关联数据id集合
      };
    },
    components: {
      pagniation,
      tableHeadShowList
    },
    watch:{
      dialogVisible2(val){
        if(!val){
          const timer = setTimeout(() => {
            this.resetData()
            clearTimeout(timer)
          },200);
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
      closeDialog() {
        this.dialogVisible2 = false;
      },
      //表头显示列
      checkTrChange(trList){
        this.trList = trList;
      },
      /**
       * @param { Boolean } isCopy 是否复制
       */
      //关联数据
      submitForm(isCopy = false) {
        if(!this.quotedIds.length) {
          this.$message.error('请选择引用数据！');
          return
        }
        this.$http.formEnterService
          .associatedData({
            dataId: this.dataId,
            needCopy:isCopy,
            quotedIds: this.quotedIds
          })
          .then((res) => {
            this.quotedIds = []
            this.closeDialog()
            this.getData(this.parentId);
            this.$emit('refreshData')
          })
      },
      //获取表格选择项
      handelSelectionChange({selection}) {
        this.quotedIds = selection.map((item) => item.trId)
      },
      //搜索
      searchData(){
        this.getData(this.parentId)
      },
      //获取数据
      getData(parentId) {
        this.quotedIds = []; // 每次查询清空已选择的行
        this.loading = true
        this.parentId = parentId;
        let _this = this;
        Promise.all([
          this.$http.formEnterService.getChildByParentId(parentId),
          this.$http.formEnterService.findAllSubDatas({
            parentId,
            ...this.form,
            filter:{
              listData:[]
            }
          })
        ]).then(function(results) {
          _this.componentValues = results[1].data.content;
          _this.totalNum=results[1].data.totalElements,
          _this.totalPage=results[1].data.totalPages,
          _this.componentDatas = results[0].data.formComponents;
          _this.trList = _this.getTrList(results[0].data.formComponents, results[0].data.dynamicDisplayColumnFlag);
          _this.splicingComponentValue();
        });
      },
      //组装数据
      splicingComponentValue() {
        if (!this.componentValues.length) {
          this.tdList = [];
          this.loading = false
          return;
        }
        let tempData = []; //临时数组
        this.componentValues.map((item) => {
          let tempObj = {}; //临时对象
          for (let item1 of this.componentDatas) {
            for (let item2 of item.dataAndAttributeDtoList) {
              if (item2.controlId === item1.id) {
                tempObj.trId = item.id; //该行数据的id
                tempObj[item1.id] = item2.formValue;
                tempObj.addUserId = item.addUserId;
                // tempObj.addTime = item.createdDate;
                // tempObj.addUserName = item2.userName;
                break;
              }
            }
          }
          tempData.push(tempObj);
        });
        this.tdList = tempData;
        this.loading = false
      },
      
    //渲染地址
    renderAddress(data) {
      return Object.values(data).join("");
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
       //动态多选框
    dynamicChoiceValues(data) {
      return data.map(item => {
          if (item.otherValue && item.otherValue.length) {
            return `${item.choiceValue}(${item.otherValue
              .map(item2 => item2.value)
              .join("，")})`;
          }
          return item.choiceValue;
        })
        .join("\\");
    },
    resetData(){
      this.form.current = 0;
      this.keyWord = ''
      this.$refs.pagniation.refreshPage();
      this.quotedIds = [];
      this.trList = [];
      this.tdList = [];
      this.componentValues = [];
      this.componentDatas = [];
      this.$refs.referenceMultipleTable.clearSelection();
    },
      //分页组件改变页码
      handleChangePage(page) {
        this.form.pageSize = page.pageSize;
        this.form.current = page.currentPage - 1;
        this.getData(this.parentId)
      }
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

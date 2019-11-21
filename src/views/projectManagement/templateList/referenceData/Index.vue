<template>
  <div style="position:relative" class="content-warp">
    <div class="container-left box-style_common">
      <treeList
        title="设置参考数据"
        emptyText=''
        @changeNode="getCheckAssemblyNode"
        :data="customTreeData"
        :isCheckedParent="true"
        :expandOn="false"
        :expandAll="true"
        :defaultProps="defaultProps"
        :defaultCheckKey="curCheckedAssemblyId"
      />
    </div>
    <div class="container-right">
      <search-box :form="form">
          <template slot="input">
            <el-col :span="6">
              <el-form-item label="关键字">
                <el-input
                  v-model="form.keyWords"
                  size="small"
                  placeholder="请输入关键文字"
                  clearable
                  @keyup.enter.native="searchData"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-search"
                @click="searchData"
              >搜索</el-button>
              <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </el-col>
          </template>
        </search-box>
      <div class="regulation-tb box-style_common" >
        <div class="tools-bar_common">
          <h5 class="table-title">
            设置参考数据
            <el-popover
              placement="right"
              width="650"
              trigger="hover">
              <img src="@/assets/reference.png" width="650" alt="">
              <i class="tooltips-icon iconfont icon-xiangqingshuoming" slot="reference"></i>
            </el-popover>
          </h5>
        </div>
        <div class="empty-box" v-show="!setReferenceData">
          <img src="@/assets/empty-2.png" />
          <p style="margin-top:10px;">已经到顶了</p>
        </div>
        <div v-show="setReferenceData">
          <div class="reference-box">
            <span class="reference-box-title">参考数据:</span>
            <div v-for="(tag,index) in checkedData" :key="tag.identifier">
              <span v-if="index" class="tag-spator">+</span>
              <el-tag @close="tagClose(tag)" type="info" closable size="small">{{tag.name}}</el-tag>
            </div>
          </div>
          <el-table :data="filterTableData" style="width: 100%" :max-height="winHeight - 240">
            <el-table-column label="" width="6"></el-table-column>
            <el-table-column label="选择">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.selected" @change="handleChange(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="字段"></el-table-column>
          </el-table>
          <div class="footer-box" v-show="tableData.length">
            <el-button size="medium" @click="resetCheckedData">取 消</el-button>
            <el-button type="primary" size="medium" @click="saveData">保 存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import treeList from "@/components/common/TreeList/Index.vue";
import SearchBox from "@/components/tools/searchBox.vue";
export default {
  name:'referenceData',
  data() {
    return {
      form: {
        keyWords: ""
      },
      searchText:"", // 搜索关键字
      defaultProps: {
        children: "subForms",
        label: "tag",
        id: "id"
      },
      setReferenceData:false, // 是否可选字段
      customTreeData: [], //左侧树形数据
      curCheckedAssemblyId: "", //当前的组件id
      tableData: [],
      checkedData: []
    };
  },
  components: {
    treeList,
    SearchBox
  },
  computed: {
    filterTableData() {
      const keyWords = this.searchText || "";
      return this.tableData.filter(
        item =>
          !keyWords ||
          item.name.toLowerCase().indexOf(keyWords.toLowerCase()) > -1
      );
    }
  },
  created() {
    this.getAssemblyData();
  },
  methods: {
    //获取选择的id
    getCheckAssemblyNode({ id, setReferenceData}) {
      this.checkedData = []; // 切换组件，清空已选择的内容
      this.setReferenceData = setReferenceData // 是否可以设置
      if(setReferenceData){
        this.getAllControlList(id)
      }else{
        this.tableData = []
        this.checkedData = []
      }
      this.curCheckedAssemblyId = id
    },
    // 获取组件树
    getAssemblyData() {
      const tempId = this.$route.params.tempId
      this.$http.projectTemplateService.findTemplateTreeByTemplateId(tempId).then(res =>{
        this.customTreeData.push(res.data)
      })
    },
    // 获取该组件的所有父级字段
    getAllControlList(id) {
      const tempId = this.$route.params.tempId
      this.$http.projectTemplateService.findRecursiveParentComponentList(id, {templateId: tempId}).then(res =>{
        this.tableData = res.data.map((item, i) => {
          item.weight = i
          if(item.selected){
            this.checkedData.push(item)
          }
          return item
        })
      })
    },
    searchData(){
      this.searchText = this.form.keyWords
    },
    // 获取选择的字段
    handleChange(node) {
      this.$nextTick(() => {
        if (node.selected) {
          if (this.checkedData.length >= 5) {
            this.$message.closeAll();
            this.$message.error("最多只能选择5个字段！");
            node.selected = false;
            return;
          }
          this.checkedData.push(node);
          this.checkedData.sort((prve, next) => prve.weight - next.weight); // 按字段的顺序排序
        } else {
          this.checkedData = this.checkedData.filter(
            item => item.identifier !== node.identifier
          );
        }
      });
    },
    tagClose(node) {
      this.checkedData = this.checkedData.filter(item => item.identifier !== node.identifier);
      node.selected = false; // 删除字段将字段取消选中， 这里使用对象引用直接修改，可能会出现问题
    },
    // 保存
    saveData() {
      const params = {
        componentId: this.curCheckedAssemblyId,
        displayIds: this.checkedData.map(item => item.identifier),
        templateId: this.$route.params.tempId
      }
      this.$http.projectTemplateService.saveReferenceData(params).then(res =>{
        this.$message({
          message: '参考数据设置成功！',
          type: 'success'
        });
      })
    },
    resetForm(){
      this.form.keyWords = ''
      this.searchText = ''
    },
    // 重置
    resetCheckedData(){
      this.checkedData.map(item => {
        item.selected = false
        return item
      })
      this.checkedData = []
      this.getAllControlList(this.curCheckedAssemblyId)
    }
  }
};
</script>
<style scoped>
.tools-bar_common {
  padding: 5px 15px;
}
.container-right .table-title::before {
  top: 12px;
}
.container-left {
  width: 250px;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}
.container-right {
  padding-left: 263px;
  height: 100%;
}
.footer-box {
  margin: 15px auto;
  text-align: center;
}
.icon-shezhi,
.icon-zidingyibianhao {
  cursor: pointer;
  color: #26beff;
  font-size: 12px;
}
.tooltips-icon{
  color: #1884CC
}
.reference-box{
  height: 60px;
  display: flex;
  padding-left: 16px;
  align-items: center;
  background: #FCFCFC;
}
.reference-box-title{
  font-size:13px;
  font-family:MicrosoftYaHei-Bold;
  font-weight:bold;
  margin-right: 10px;
  color:rgba(38,38,38,1);
}
.tag-spator{
  margin: 0 4px 0 7px;
  color: #999999
}
.empty-box{
  height: 300px;
  display: flex;
  color: #999999;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.regulation-tb{
  height: calc(100vh - 212px)
}
</style>

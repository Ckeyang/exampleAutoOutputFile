<template>
  <div class="regulation-tb box-style_common dashboard-container">
    <el-button @click="refershPage">测试刷新页面</el-button>
    <el-button @click="openDialog">打开弹框</el-button>
    <vxe-table
          ref="xTable"
          border
          :data='tableData'
          resizable
          highlight-hover-row
          show-overflow
          max-height="500"
          :row-class-name='rowClassName'
          :loading="loading">
          <vxe-table-column type="selection" tree-node></vxe-table-column>
          <vxe-table-column type="index" width="100"></vxe-table-column>
          <vxe-table-column field="name" fixed='left' title="Name" sortable ></vxe-table-column>
          <vxe-table-column field="age" title="Age"></vxe-table-column>
          <vxe-table-column field="sex" title="Sex" width="200"></vxe-table-column>
          <vxe-table-column field="rate" title="Rate" width="200"></vxe-table-column>
          <vxe-table-column field="region" title="Region" width="200"></vxe-table-column>
          <vxe-table-column field="time" title="Time" width="200"></vxe-table-column>
          <vxe-table-column field="address" title="Address" width="300" show-overflow></vxe-table-column>
          <vxe-table-column field="updateTime" title="UpdateTime" width="200"></vxe-table-column>
          <vxe-table-column field="createTime" title="CreateTime" width="200"></vxe-table-column>
          <vxe-table-column field="attr1" title="Attr1" width="200"></vxe-table-column>
          <vxe-table-column field="attr2" title="Attr2" width="200"></vxe-table-column>
          <vxe-table-column field="attr3" title="Attr3" width="200"></vxe-table-column>
          <vxe-table-column field="attr4" title="Attr4" width="200"></vxe-table-column>
          <vxe-table-column field="attr5" title="Attr5" width="200"></vxe-table-column>
          <vxe-table-column field="attr6" title="Attr6" width="200"></vxe-table-column>
          <vxe-table-column field="attr7" title="Attr7" width="200"></vxe-table-column>
          <vxe-table-column field="attr8" title="Attr8" width="200"></vxe-table-column>
          <vxe-table-column field="name" title="Name" width="200"></vxe-table-column>
          <vxe-table-column field="attr9" title="Attr9" width="200"></vxe-table-column>
          <vxe-table-column field="createTime" title="CreateTime" width="200"></vxe-table-column>
          <vxe-table-column width="200" fixed='right'>
            <template v-slot="{ row }">
              <el-button size="small" @click="edit(row)">编辑</el-button>
            </template>
          </vxe-table-column>
    </vxe-table>
  <!-- <el-table
          ref="xTable"
          border
          resizable
          show-overflow
          max-height="500"
          :data='tableData'
          :loading="loading">
          <el-table-column type="selection" width="100" fixed="left"></el-table-column>
          <el-table-column type="index" width="100"></el-table-column>
          <el-table-column :prop="item" :label="item"  width="200" v-for="item in headList" :key="item"></el-table-column>
          <el-table-column prop="age" label="Age" sortable width="200"></el-table-column>
          <el-table-column prop="sex" label="Sex" width="200"></el-table-column>
          <el-table-column prop="rate" label="Rate" width="200"></el-table-column>
          <el-table-column prop="region" label="Region" width="200"></el-table-column>
          <el-table-column prop="time" label="Time" width="200"></el-table-column>
          <el-table-column prop="address" label="Address" width="300" show-overflow></el-table-column>
          <el-table-column prop="updateTime" label="UpdateTime" width="200"></el-table-column>
          <el-table-column prop="createTime" label="CreateTime" width="200"></el-table-column>
          <el-table-column prop="attr1" label="Attr1" width="200"></el-table-column>
          <el-table-column prop="attr2" label="Attr2" width="200"></el-table-column>
          <el-table-column prop="attr3" label="Attr3" width="200"></el-table-column>
          <el-table-column prop="attr4" label="Attr4" width="200"></el-table-column>
          <el-table-column prop="attr5" label="Attr5" width="200"></el-table-column>
          <el-table-column prop="attr6" label="Attr6" width="200"></el-table-column>
          <el-table-column prop="attr7" label="Attr7" width="200"></el-table-column>
          <el-table-column prop="attr8" label="Attr8" width="200"></el-table-column>
          <el-table-column prop="name" label="Name" width="200"></el-table-column>
          <el-table-column prop="attr9" label="Attr9" width="200"></el-table-column>
          <el-table-column prop="createTime" label="CreateTime" width="200"></el-table-column>
          <el-table-column fixed="right" label="CreateTime" width="200">
            <template v-slot="{ row }">
              <el-button size="small" @click="edit(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table> -->
    <!-- <div class="tools-bar_common">
      <h5 class="table-title">待办事项</h5>
    </div>
    <div class="dashboard-box">
      <el-row :gutter="20" v-for="(item,index) in list" :key="index" class="grid-content-box">
        <el-col :span="4" v-for="item2 in item" :key="item2.projectStateInfo">
          <div class="grid-content" @click="goPage(item2)">
            <p class="grid-item-title">{{item2.projectStateInfo}}</p>
            <p class="grid-item-num"><countTo :startVal='0' :endVal='item2.size' :duration='1500' ></countTo></p>
          </div>
        </el-col>
      </el-row>
    </div> -->
    <!-- <el-form ref="form" :model="form" label-width="80px" v-for="n in formList" :key="n">
      <el-form-item label="活动名称">
        <el-select  placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form> -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="form" label-width="80px" v-for="(item, i) in formList" :key="i">
        <el-form-item label="活动名称">
          <!-- <el-input ></el-input> -->
          <el-select  placeholder="请选择活动区域" v-model="item.value">
            <el-option label="区域一" value="shanghai" v-for="k in 20" :key="k"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import countTo from 'vue-count-to';
export default {
  components:{countTo},
  data() {
    return {
      tableData: [],
      headList : ['name','age','sex','rate', "regin", 'time', 'address', 'updateTime',
      'createTime', 'attr1', 'attr2','attr3','attr4','attr5', 'attr6', 'attr7','attr8','attr9','name','age','sex','rate', "regin", 'time', 'address', 'updateTime',
      'createTime', 'attr1', 'attr2','attr3','attr4','attr5', 'attr6', 'attr7','attr8','attr9'  ],
      loading: false,
      dialogVisible:false,
      formList:[]
    };
  },
  created() {
     this.getData()
  },
  methods:{
    getData(){
      this.loading = true
            
            setTimeout(() => {
              // this.tableData = this.createData()
              // 使用函数式加载，阻断 vue 对大数组的双向绑定，大数据性能翻倍提升
              if (this.$refs.xTable) {
                this.$refs.xTable.loadData(this.createData())
              }
              this.loading = false
            }, 300)
    },
    createData(){
      return Array(3000).fill().map((item,i) => {
        const obj = {}
        for(let key of this.headList){
          obj[key] = key
        }
        obj.age = i
        return obj
      })
    },
    edit(row){
      row.name = '1212121121'
    },
    rowClassName({seq, row, rowIndex, $rowIndex}){
      // console.log(seq, row, rowIndex, $rowIndex)
      // return 'textRowClass'
    },
    openDialog(){
      this.formList = Array(100).fill({value:''})
      this.dialogVisible = true;
    },
    columnWidth(item){
      return ''
    },
    refershPage(){
      this.formList = 200
      // this.$store.commit({
      //   type:'refershHomeRouter',
      //   val:false
      // })
    }
  }
};
</script>
<style >
.textRowClass{
  color:red;
  background-color: salmon;
}
.vxe-table .vxe-body--row.row--hover{
  background-color: salmon;
}
</style>
<style scoped lang='scss'>
.dashboard-container {
  height: 100%;
}
.dashboard-box {
  width: 100%;
  padding: 20px 5px 20px 20px;
  box-sizing: border-box;
  .grid-content-box {
    width: 100%;
    margin-bottom: 20px;
  }
  .grid-content {
    height: 150px;
    background: #fff;
    border: 1px solid rgba(224, 224, 224, 1);
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-top: 4px solid #91d5f2;
    .grid-item-title {
      font-size: 15px;
      color: #454545;
      margin-bottom: 15px;
    }
    .grid-item-num {
      font-size: 30px;
      color: #1884cc;
    }
  }
  .grid-content:hover {
    background: #ebfaff;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>

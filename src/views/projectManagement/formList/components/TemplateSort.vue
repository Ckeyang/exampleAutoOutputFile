<template>
<div>
  <el-dialog title="设置顺序" :visible.sync="dialogViseble" width="34%" :close-on-click-modal="false">
    <div class="app-container" :key="tableKey">
      <div style="margin-bottom:10px">
        <el-cascader
          :options="categoriesList"
          size="small"
          filterable
          placeholder="请选择业务类别"
          v-model="businessCategoryType"
          :props="defaultProps"
          @change="categoryTypeChange"
        ></el-cascader>
      </div>
      <el-table :data="tableData" style="width: 100%" border row-key="id" size="mini" v-loading="loading" :empty-text="emptyText">
        <el-table-column prop="name" align="center" show-overflow-tooltip label="模板名称"></el-table-column>
        <el-table-column prop="description" align="center" show-overflow-tooltip label="模板描述"></el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope='scope'>
            <i class="iconfont icon-yidong middleDrag" title='拖动'></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <p style="font-size:12px;color:#96A2B3;margin-top:10px;">PS：该顺序会直接影响录入数据的顺序</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" size='medium'>取 消</el-button>
      <el-button type="primary" @click="saveTemplateSrot" size='medium'>保 存</el-button>
    </span>
  </el-dialog>
  <el-button
  size="small"
  icon="iconfont icon-shunxu"
  @click="openSortDialog"
  >设置顺序</el-button>
</div>
</template>
<script>
import Sortable from "sortablejs";
export default {
  name: "templateSort",
  data() {
    return {
      dialogViseble: false,
      emptyText:'请选择业务类别',
      tableData:[],
      businessCategoryType:[], // 业务类别
      sortable: null,
      loading:false,
      tableKey: 0,
      defaultProps: Object.freeze({
        children: "childList",
        label: "name",
        value: "id"
      }),
      newList: [] //排序后的列表
    };
  },
  props:{
    categoriesList:{ // 业务类别树
      default:() => []
    }
  },
  methods: {
    getAllTemplates(categoryType = []){
      if(!categoryType.length) return
      const params = {
        businessCategoryType:categoryType[categoryType.length - 1]
      }
      this.loading = true
      this.$http.projectTemplateService.getAllTemplatesByCategoryType(params).then(res =>{
        this.tableData = res.data || []
        this.tableData.length || (this.emptyText = '暂无模板')
        this.$nextTick(() => {
          this.setSort();
        });
      }).finally(()=>{
        this.loading = false
      })
    },
    categoryTypeChange(val){
      this.getAllTemplates(val)
    },
    openSortDialog(){
      this.dialogViseble = true;
      this.getAllTemplates(this.businessCategoryType);
    },
    //保存排序
    saveTemplateSrot() {
      this.$emit("saveTemplateSort", this.newList);
    },
    closeDialog() {
      this.dialogViseble = false;
      const timer = setTimeout(()=>{
        this.businessCategoryType = []
        this.emptyText = '请选择业务类别',
        this.tableData = []
        this.newList = []
        clearTimeout(timer)
      },500)
    },
    setSort() { 
      this.newList = JSON.parse(JSON.stringify(this.tableData));
      const el = document.querySelectorAll(
        ".app-container .el-table__body-wrapper > table > tbody"
      )[0];
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost",
        animation: 90,
        scroll: true,
        handle: ".middleDrag",
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: evt => {
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
          this.newList.splice(evt.newIndex, 0, tempIndex);
        }
      });
    }
  }
};
</script>
<style>
 
</style>

<style scoped>
.app-container{
  margin-top: 10px;
}
.app-container >>> .sortable-ghost{
  opacity: 0.5;
  background: #E6F9FF;
}
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
.icon-yidong {
  cursor: pointer;
}
.app-container >>> .el-table tr:hover,
.app-container >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #fff;
}
</style>

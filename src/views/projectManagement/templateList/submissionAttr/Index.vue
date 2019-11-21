<template>
  <div class='submissionAttr-container content-warp'>
    <div class='regulation-tb box-style_common'>
      <div class='tools-bar_common'>
        <h5 class='table-title'>{{tempName}}</h5>
      </div>
      <el-table
        :data='dataList'
        style='width: 100%'
        v-loading='loading'
        size='medium'
        :max-height='winHeight - 326'
        tooltip-effect='light'
      >
        <el-table-column
          prop='formName'
          label='字段'
          width='200'
        ></el-table-column>
        <el-table-column :render-header='renderSceneHeader' label="提交现场数据">
          <template slot-scope='scope'>
            <el-checkbox
              v-model='scope.row.siteData'
              @change='(val) => handleIsSceneChange(val, scope.row.formId)'
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label='提交检测数据' :render-header='renderTextHeader'>
          <template slot-scope='scope'>
            <el-checkbox
              v-model='scope.row.detectionData'
              @change='(val) => handleIsTextChange(val, scope.row.formId)'
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin:20px 0">
        <el-button type="primary" size="medium" @click="saveBtn" v-show="dataList.length">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'submissionAttr',
  data() {
    return {
      dataList: [],
      tempName:'模板名称',
      loading: false,
      isSceneIndeterminate:true,
      isTextIndeterminate:true
    };
  },
  created(){
    this.getData()
  },
  computed:{
    isSceneCheckAll(){
      const isCheckaAll = !this.dataList.some(item => !item.siteData)
      const isNotCheck = !this.dataList.some(item => item.siteData)
      this.isSceneIndeterminate = !isCheckaAll && !isNotCheck
      return isCheckaAll
    },
    isTextCheckAll(){
      const isCheckaAll = !this.dataList.some(item => !item.detectionData)
      const isNotCheck = !this.dataList.some(item => item.detectionData)
      this.isTextIndeterminate = !isCheckaAll && !isNotCheck
      return isCheckaAll
    }
  },
  methods: {
    getData() {
      this.loading = true
      this.$http.projectService.findTemplateComponentSubmissionById(this.$route.params.tempId).then(res =>{
        this.tempName = res.data.title || this.tempName;
        this.dataList = res.data.lines || []
        this.loading = false
      })
    },
    handleIsSceneChange(flag, id) {
      this.dataList = this.dataList.map(item => {
        if (item.formId === id) {
          item.detectionData = !flag;
        }
        return item
      });
    },
    handleIsTextChange(flag, id) {
      this.dataList = this.dataList.map(item => {
        if (item.formId === id) {
          item.siteData = !flag;
        }
        return item
      });
    },
    renderSceneHeader(h,{ column, $index }){
      let self = this
      return (
        h('span',[
          h('el-checkbox',{
            props: {value:this.isSceneCheckAll, indeterminate:this.isSceneIndeterminate},
            on: {  // table的事件
                'change': function (val) {
                  self.dataList = self.dataList.map(item => {
                    item.siteData = val
                    item.detectionData = !val
                    return item
                  })
                }
            },
            style: {
              marginRight:'10px'
            } 
          }),
          h('span',column.label)
        ])
     )
    },   
    renderTextHeader(h,{ column, $index }){
      let self = this
      return (
        h('span',[
          h('el-checkbox',{
            props: {value:this.isTextCheckAll, indeterminate:this.isTextIndeterminate},
            on: {  // table的事件
                'change': function (val) {
                  self.dataList = self.dataList.map(item => {
                    item.detectionData = val
                    item.siteData = !val
                    return item
                  })
                }
            },
            style: {
              marginRight:'10px'
            } 
          }),
          h('span',column.label)
        ])
     )
    },
    saveBtn(){
      const {tempIdentifier, tempId} = this.$route.params
      this.$http.projectService.setTemplateComponentSubmissionAttr(tempIdentifier, tempId,{lines:this.dataList}).then(res =>{
         this.$message({
          message: '提交属性设置成功!',
          type: 'success'
        });
        this.$router.push('/projectManagement/projectTemplateList')
      })
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.pageSize = page.pageSize;
      this.current = page.currentPage - 1;
      this.getData();
    }
  }
};
</script>

<style scoped>
</style>

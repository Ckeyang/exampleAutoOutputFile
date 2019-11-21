/**
  分派任务业务组件
 */
<template>
  <el-dialog
    title="分派任务"
    :visible.sync="dialogVisible"
    v-el-drag-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="30%">
    <el-form label-position="left" label-width="75px" >
      <el-form-item label="部门">
        <treeselect
          :options="departmentOptions"
          placeholder="请选择部门"
          :normalizer="normalizer"
          noOptionsText="暂无数据"
          noResultsText='没有相关数据'
          class="treeselect"
          @input='getUserListByDepartment'
          v-model="form.departmentId"/>
      </el-form-item>
      <el-form-item label="姓名">
        <div class="search-user-box">
          <el-input type="text" v-model="form.keyWords" placeholder="用户名搜索" size='small' @keyup.enter.native="getUserListByDepartment"></el-input>
          <el-button type="primary" @click="searchUser" size='small' icon="el-icon-search" style="margin-left:13px;line-height:1">搜 索</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div style="margin-top:12px;">
      <span style="font-size:14px;">人员列表</span>
      <p class="empty-text" v-show="!userList.length">暂无数据</p>
      <el-scrollbar class="el-scrollbar_height" v-show="userList.length">
        <div class="user-box">
          <el-checkbox-group v-model="form.selectUser">
            <el-checkbox v-for='item in userList' :label='item' :key='item.id'>{{item.realName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-scrollbar>
      <div class='tags-box' v-show='form.selectUser.length'>
        <el-tag
          v-for="tag in form.selectUser"
          :key="tag.id"
          size='medium'
          closable
          type='info'
          @close="handleClose(tag)">
          {{tag.realName}}
        </el-tag>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" size='medium'>取 消</el-button>
      <el-button type="primary" @click="submitBtn" size='medium'>确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name:'assignTasks',
  components:{ Treeselect },
  data(){
    return {
      form:{
        departmentId:null,
        keyWords:'',
        pageSize:1000,
        currentPage:0,
        selectUser:[], //选择的用户
      },
      projectId:'', //当前项目id
      projectUserIds:null, // 已选择分配了的人员id
      dialogVisible:false,
      userList:[],
      departmentOptions: [],
    }
  },
  props:{
    interfaceType:String // 接口类型
  },
  watch:{
    dialogVisible(val){
      if(!val){
        this.resetState()
      }
    },
    // userList(data){
    //   const selectUser = this.form.selectUser
    //   this.form.selectUser = data.filter(item => selectUser.some(item2 => item2.id === item.id))
    // }
  }, 
  created(){
    this.getDepartmentTree()
  },
  methods:{
    searchUser(){
      this.getUserListByDepartment()
    },
    openDialog(id, userIds = null){
      this.dialogVisible = true;
      this.projectId = id;
      this.projectUserIds = userIds;
      this.searchUser() //获取部门树
    },
    handleClose(tag){
      this.form.selectUser = this.form.selectUser.filter(item => item.id !== tag.id)
    },
    normalizer(node){
      return {
        id: node.id,
        label: node.name,
        children: node.children || undefined,
      }
    },
    //获取部门树
    getDepartmentTree(){
      this.$http.userService.getDepartmentTree().then((res)=>{
        this.departmentOptions = res.data || []
      })
    },
    //获取部门下面的人员
    getUserListByDepartment(val){
      const {departmentId, keyWords, pageSize, currentPage} = this.form
      this.$http.userService.getUserList({departmentId, keyWords, pageSize, currentPage}).then((res)=>{
        this.userList = res.data.content || []
        // 回填选中已分配了的人员
        if(this.projectUserIds){
          this.form.selectUser = (res.data.content || []).filter(item => this.projectUserIds.includes(item.id))
          this.projectUserIds = null
        }
      })
    },
    submitBtn(){
      if(!this.form.selectUser.length){
        this.$message.error('请选择分派人员!')
        return ;
      }
      const memberIds = this.form.selectUser.map(item => item.id)
      // const serverName = {
      //   'proceed_project':'assignTask_proceed',
      //   'my_project':'assignTask',
      // }
      const servers = this.$http.projectService[this.interfaceType]
      servers(this.projectId, { memberIds }).then((res)=>{
        this.$message({
          message: '任务分派成功！',
          type: 'success'
        });
        this.closeDialog()
        this.$emit('refreshData') //刷新页面
      })
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    resetState(){
      this.userList = [];
      this.form = {
        departmentId:null,
        keyWords:'',
        pageSize:1000,
        currentPage:0,
        selectUser:[], //选择的用户
      }
    }
  }
}
</script>

<style scoped>
.search-user-box{
    display: flex;
    align-items: center;
}
.user-box .el-checkbox:hover {
  background: #edf5ff;
}
.user-box .el-checkbox-group .el-checkbox {
  display: block;
  margin: 5px 0;
  padding: 3px 10px;
}
.el-scrollbar_height {
  height: 200px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #d5e0ed;
}
.tags-box{
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  padding: 2px 5px;
  background:rgba(255,255,255,1);
  border:1px solid rgba(213,224,237,1);
  border-radius:5px;
}
.tags-box .el-tag{
  margin: 3px 3px;
}
.vue-treeselect{
  top:4px;
}
.treeselect >>>.vue-treeselect__control,
.treeselect >>>.vue-treeselect__single-value,
.treeselect >>>.vue-treeselect__placeholder{
  line-height: 30px;
  height: 30px;
}
.empty-text{
  text-align: center;
  margin-top: 10px;
}
</style>
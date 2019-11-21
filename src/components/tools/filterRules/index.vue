<template>
  <el-dialog title="设置条件" :visible.sync="filterRulesDialogVisible" width="40%" :close-on-click-modal="false" v-el-drag-dialog> 
        <div class="groupBox">
          <div class="groupTitle">
            条件
            <span class="tool" @click="show=!show">
              {{show?'收起':'展开'}}&nbsp;&nbsp;
              <i
                :class="{'iconfont icon-shang':show,'iconfont icon-xia':!show}"
              ></i>
            </span>
          </div>
          <transition name="el-zoom-in-top">
            <div class="toolBox" v-show="show">
              <div class='title-box'>
                <span>符合以下条件</span>
                <span>
                  <el-button size="mini" icon="el-icon-delete" @click="cleanGroup">清除所有条件</el-button>
                  <el-button size="mini" type="success" icon="el-icon-plus" @click="addGroup">新建分组</el-button>
                </span>
              </div>
              <group
                mode='from'
                :componentList="componentList"
                :componentId="componentId"
                @changeComponentId="changeComponentId"
                v-for="(item,index) in groups"
                @connectGroup="connectGroup"
                @removeGroup="removeGroup"
                :key="index"
                :index="index"
                :model.sync="item"
              ></group>
            </div>
          </transition>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="filterRulesDialogVisible = false" size="medium">取 消</el-button>
          <el-button type="primary" @click="submitFilterRulesDialog" size="medium">保 存</el-button>
        </span>
  </el-dialog>
</template>
<script>
import group from "@/views/projectManagement/templateList/components/group.vue";
export default {
  name: "filterRules",
  data() {
    return {
      show: true,
      filterRulesDialogVisible:false,
      componentId: "",
      componentList: [],
      groups:[],
      rules: { name: { required: true, message: "必填" } }
    };
  },
  components: { group },
  props: {
    templateId: String, //字段来源模板id
    value:{
      type:Array
    },
    bigCategoryId:String, // 大类
    dataSourceType:String, //字段来源类型 
  },
  // watch:{
  //   dataSourceType(){
  //     this.getComponents();
  //   }
  // },
  methods: {
    // 打开弹框
    openDialog(data){
      this.getComponents();
      this.filterRulesDialogVisible = true;
      this.groups = JSON.parse(JSON.stringify(data));
    },
    // 保存
    submitFilterRulesDialog(){
      this.filterRulesDialogVisible = false;
      this.$emit('getData', JSON.parse(JSON.stringify(this.groups)))
    },
    changeComponentId(id) {
      this.componentId = id;
      this.getComponents();
    },
    getComponents() {
      if(this.dataSourceType === 'FORM_DATA'){
        this.$http.ruleService.getComponents(this.templateId, {
          componentId: this.componentId,
          bigCategoryId:this.bigCategoryId
        }).then(res => {
          this.componentList = res.data || [];
        });
      }else{
        this.$http.sharedPartsRulesService.getSystemFileds({ dataSourceEnum: this.dataSourceType, bigCategoryId:this.bigCategoryId }).then(res => {
          this.componentList = res.data || [];
        });
      }
    },
    connectGroup() {
      let length = this.groups.length;
      let i = 0;
      while (true) {
        if (i === length) {
          break;
        }
        this.groups[i].next.connectionType = this.groups[i + 1]
          ? this.groups[i + 1].previous.connectionType
          : "AND";
        this.groups[i].next.id = this.groups[i + 1]
          ? this.model.expressions[i + 1].id
          : "";
        this.groups[i + 1]
          ? (this.groups[i + 1].previous.id = this.groups[i].id)
          : null;
        i++;
      }
    },
    cleanGroup() {
      this.groups = [];
      this.componentId = "";
    },
    addGroup() {
      this.groups.push({
        expressions: [],
        id: this.getRoundId(),
        next: { connectionType: "AND", id: "" },
        previous: { connectionType: "AND", id: "" }
      });
      this.connectGroup();
    },
    removeGroup(index) {
      this.groups.splice(index, 1);
      if (this.groups.length === 0) {
        this.componentId = "";
      }
    },
    getRoundId() {
      let times = new Date().getTime();
      let random = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
      return times + "" + random;
    },
  }
};
</script>
<style lang="scss" scoped>
.toolBox {
  padding: 1em;
  color: #3c4551;
}
.toolBox > .title-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.groupBox {
  width: 100%;
  box-shadow: 0 0 5px #d5e0ed;
  box-sizing: border-box;
  border-radius: 6px;
}
.groupTitle {
  font-size: 12px;
  font-weight: bold;
  padding: 1em;
  position: relative;
  border-bottom: 1px solid #e6f0fc;
}
.groupTitle .tool {
  cursor: pointer;
  position: absolute;
  right: 2em;
  color: #1890ff;
} 
.groupTitle .tool i {
  font-size: 4px;
}
.descriptBox > span {
  color: #3c4551;
}
.descriptBox > div {
  padding: 1em;
  border: 1px solid #d5e0ed;
  color: #3c4551;
  border-radius: 6px;
}
.shezhi {
  width: 100%;
  }
.formBox {
  width: 50%;
  margin: 2em auto 0;
}
.table-title {
  margin-bottom: 15px;
}
.tools-bar {
  display: flex;
  justify-content: space-between;
} 
.table-title::before {
    content: "";
    display: inline-block;
    width: 2px;
    height: 30px;
    position: absolute;
    left: -1px;
    top: 12px;
    z-index: 999;
    background-color: #fc5a4c;
  }
 

</style>

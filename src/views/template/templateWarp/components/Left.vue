<template>
  <!-- <el-scrollbar :style="{height:(winHeight-64) +'px'}"> -->
    <div class="left" :style="{height:(winHeight-82) +'px'}">
      <div class="basicComponents components">
        <h6 class="box-title">
          <span>基础组件</span>
        </h6> 
        <draggable v-model="basicComponents" @end="onEnd" :move='onMove' :options="{group:{ name:'sortlist', pull:'clone',put:false},dragClass:'dragClass',scrollSensitivity:80}">
          <transition-group tag="ul" :data-disabled='true' class="components-box basic-components" v-loading="loading1" name='basic-component'>
            <li v-for="(item) of basicComponents" :key="item.identifier" :data-index="item.identifier"  @click.stop="getComponents">
              <i
                :class="componentsIcon(item.componentType)"
                class="iconfont"
                :data-index="item.identifier"
              ></i>
              <span
                :data-index="item.identifier"
                :class="{'tow-letter-space':setTowLetterSpace(item.componentType),'three-letter-space':setThreeLetterSpace(item.componentType)}"
              >{{item.componentAttr.tag}}</span>
            </li>
          </transition-group>
        </draggable>
      </div>
      <div class="components advanced-components">
        <h6 class="box-title red-title">
          <span>高级组件</span>
        </h6>
        <draggable v-model="complicatedComponents" @end="onEnd" :move='onMove' :options="{group:{ name:'sortlist', pull:'clone',put:false},dragClass:'dragClass',scrollSensitivity:80}">
          <transition-group tag="ul" :data-disabled='true' class="components-box complicatedComponents" v-loading="loading2" >
            <li v-for="(item,i) of complicatedComponents" :key="i" :data-index="item.identifier" @click.stop="getComponents">
              <i
                :class="componentsIcon(item.componentType)"
                class="iconfont"
                :data-index="item.identifier"
              ></i>
              <span
                :data-index="item.identifier"
                :class="{'tow-letter-space':setTowLetterSpace(item.componentType),'three-letter-space':setThreeLetterSpace(item.componentType)}"
              >{{item.componentAttr.tag}}</span>
            </li>
          </transition-group>
        </draggable>
      </div>
      <div class="customComponents components" :style="{minHeight:(winHeight-534) +'px'}">
        <h6 class="box-title orange-title">
          <span class="title">自定义组件</span>
          <i class="iconfont icon-baocun" @click="saveFolderSort" title="保存组件排序" v-if='withoutFolderAssemblyData.length > 2'></i>
        </h6>
        <div class="custom-components" v-loading="loading3">
          <div class="folder-box">
            <el-tree
              :data="folderAssemblyData"
              node-key="id"
              empty-text
              draggable
              :expand-on-click-node="false"
              :props="defaultProps"
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <el-tooltip class="item" effect="light" placement="right-start">
                  <div slot="content" style="width:200px;">
                    <p>名字 : {{node.label.folderName || node.label.name}}</p>
                    <p
                      v-show="node.label.folderDescription || node.label.descriptionCustomWidget"
                    >描述 : {{node.label.folderDescription || node.label.descriptionCustomWidget}}</p>
                  </div>
                  <span
                    class="el-tree-node__label"
                    @dblclick="getCustomAssemblyData(data)"
                  >
                  <i class="iconfont icon-wenjianjiaguanbi" v-if='node.label.folderName'></i>
                  {{ node.label.folderName || node.label.tag}}
                  </span>
                </el-tooltip>
                <el-dropdown
                  class="dropdown-box"
                  trigger='click'
                  @command="handleCommand"
                  v-if="data.componentType === 'CUSTOMBOX'"
                >
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{type:'EDITASSEMBLYCONTENT',id:data.identifier}">修改</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </el-tree>
          </div>
          <div class="custom-component_box">
            <el-tree
              :data="withoutFolderAssemblyData"
              empty-text
              node-key="id"
              draggable
              :props="defaultProps"
              :expand-on-click-node="false"
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <el-tooltip class="item" effect="light" placement="right" :offset="0">
                  <div slot="content" style="width:200px;">
                    <p>名字 : {{node.label.folderName || node.label.tag}}</p>
                    <p
                      v-show="node.label.folderDescription || node.label.descriptionCustomWidget"
                    >描述 : {{node.label.folderDescription || node.label.descriptionCustomWidget}}</p>
                  </div>
                  <span
                    class="el-tree-node__label"
                    @dblclick="getCustomAssemblyData(data)"
                  >{{node.label.folderName || node.label.tag}}</span>
                </el-tooltip>
                  <el-dropdown
                    class="dropdown-box"
                    @command="handleCommand"
                    trigger='click'
                    v-if="data.componentType === 'CUSTOMBOX'"
                  >
                    <span class="el-dropdown-link">
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        :command="{type:'EDITASSEMBLYCONTENT',id:data.identifier,data:data}"
                        v-if='checkAuth("RBAC_PERMISSION_api_app_componentOprchange_PUT")'
                      >修改</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <!-- 新增和编辑文件夹 -->
      <el-dialog
        v-el-drag-dialog
        :title="folderDialogTitle === 'ADD' ? '新增文件夹' : '编辑文件夹'"
        :visible.sync="folderDialogVisible"
        width="35%"
        :close-on-click-modal="false"
      >
        <el-form
          label-position="top"
          label-width="80px"
          :model="folderForm"
          ref="folderForm"
          :rules="folderFormRules"
        >
          <el-form-item label="文件夹名称" prop="folderName">
            <el-input v-model="folderForm.folderName" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="文件夹描述">
            <el-input
              v-model="folderForm.folderDescription"
              type="textarea"
              size="medium"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="folderDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveFileBtn('folderForm')">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 编辑组件属性 -->
      <el-dialog
        title="修改属性"
        v-el-drag-dialog
        :visible.sync="assemblyDialogVisible"
        width="35%"
        :close-on-click-modal="false"
      >
        <span slot="footer" class="dialog-footer">
          <el-button @click="assemblyDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="saveAssemblyBtn('')">保 存</el-button>
        </span>
      </el-dialog>
    </div>
  <!-- </el-scrollbar> -->
</template>
<script>
import draggable from 'vuedraggable';
import { mapGetters } from "vuex";
export default {
  components: {
    draggable
  },
  data() {
    return {
      basicComponents: [], //基础组件
      complicatedComponents: [], //高级组件
      customComponents: [], //自定义组件
      userId: sessionStorage.userId,
      loading1: true,
      loading2: true,
      loading3: true,
      folderForm: {
        folderName: "",
        folderDescription: "",
        applyingModelType: "" //文件夹类型  PROJECT为物质  ， REPORT 为项目报告 。 ....很无语
      },
      folderFormRules: {
        folderName: {
          required: true,
          message: "请输入文件夹名称",
          trigger: "blur"
        }
      },
      folderDialogVisible: false, //文件夹弹框
      folderDialogTitle: "ADD", //文件夹弹框标题   ADD : 新增  EDIT : 编辑
      checkFolderId: "", //当前选中的文件夹id
      assemblyDialogVisible: false, //组件弹框
      assemblyRelationDialogVisible: false,
      folderAssemblyData: [],
      withoutFolderAssemblyData: [],
      defaultProps: {
        children: "components",
        label: "componentAttr",
        id: "identifier"
      }
    };
  },
  props: ["isReload"],
  watch: {
    isReload(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getComponentsList();
      }
    },
    //监听文件夹弹框关闭
    folderDialogVisible(val) {
      if (!val) {
        this.$refs["folderForm"].resetFields();
        this.folderForm.folderName = "";
        this.folderForm.folderDescription = "";
      }
    },
    //监听弹框关闭
    assemblyDialogVisible(val) {
      if (!val) {
      }
    }
  },
  computed: {
    //基础组件和高级组件
    componentsData() {
      return [...this.basicComponents, ...this.complicatedComponents];
    },
     // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  created() {
    //初始化组件列表
    this.getComponentsList();
    this.folderForm.applyingModelType = this.$route.params.applyingModelType; //组件类型
  },

  methods: {
    allowDrop(draggingNode, dropNode, type) {
      if (
        dropNode.data.componentType === "FOLDER" &&
        draggingNode.data.componentType === "FOLDER" &&
        dropNode.data.componentAttr.identifier !== draggingNode.data.componentAttr.identifier && 
        type !== "inner"
      ) {
        return true;
      }
      return (
        type !== "inner" &&
        dropNode.data.parentId === draggingNode.data.parentId &&
        draggingNode.data.identifier !== dropNode.data.identifier
      );
    },
    allowDrag(draggingNode) {
      return true;
    },
    onMove(ele){
      return !ele.to.getAttribute('data-disabled')
    },
    onEnd(ele){
      if(!ele.to.getAttribute('data-disabled')){
        this.$emit('dragChange', true, ele.newIndex + 1);
      }
       return false
    },
    //组件操作
    handleCommand(command) {
      switch (command.type) {
        //修改组件
        case "EDITASSEMBLYCONTENT": {
          sessionStorage.templatePath = this.$route.path
          this.$router.push(`/assemblyEdit/${command.id}/${this.$route.params.evaluateId}/PROJECT`);
          break;
        }
      }
    },
    //保存组件和文件夹排序
    saveFolderSort() {
      let params = {
        folders: JSON.parse(JSON.stringify(this.folderAssemblyData)),
        withoutFoldercomponents: JSON.parse(
          JSON.stringify(this.withoutFolderAssemblyData)
        )
      };
      this.$http.templateService.saveFolderSort(params).then(res => {
        this.$message({
          message: "组件顺序保存成功！",
          type: "success"
        });
      });
    },
    //组件图标
    componentsIcon(type) {
      switch (type) {
        case "TEXTBOX":
          return "icon-tiankongti";
        case "RADIOBOX":
          return "icon-danxuan";
        case "CHECKBOX":
          return "icon-duoxuan";
        case "COMBOBOX":
          return "icon-xiala";
        case "ADDRESSBOX":
          return "icon-dizhi";
        case "IMAGEBOX":
          return "icon-shangchuantupian";
        case "FILEBOX":
          return "icon-shangchuanwenjian";
        case "VIDEO":
          return "icon-shipinshangchuan";
        case "CASCADER":
          return "icon-duojixiala";
        case "DATEPICKER":
          return "icon-riqi";
        case "DYNAMIC_CHOICE":
          return "icon-dongtaiduoxuankuang";
        case "MULTIPLE_COMBOBOX":
          return "icon-i-duoxuanxialakuang";
        case "SIGNATURE":
          return "icon-i-dianziqianming";
        case "INDUSTRY":
          return "icon-hangye";
      }
    },
    //两个字符设置间隔
    setTowLetterSpace(type) {
      return type === "ADDRESSBOX" || type === 'INDUSTRY';
    },
    //三个字符设置间隔
    setThreeLetterSpace(type) {
      return (
        type === "TEXTBOX" ||
        type === "RADIOBOX" ||
        type === "CHECKBOX" ||
        type === "COMBOBOX"
      );
    },
    //获取组件列表
    getComponentsList() {
      this.getBasicComponents();
      this.getComplicatedComponents();
      this.getCustomComponents();
    },
    //获取基础组件
    getBasicComponents() {
      this.$http.templateService.getBasicComponents().then(res => {
        this.basicComponents = res.data;
        this.loading1 = false;
      });
    },
    //获取高级组件
    getComplicatedComponents() {
      this.$http.templateService.getComplicatedComponents().then(res => {
        this.complicatedComponents = res.data;
        this.loading2 = false;
      });
    },
    //获取自定义组件
    getCustomComponents() {
      let params = {
        evaluationCategoryId: this.$route.params.evaluateId,
        applyingModelType: this.$route.params.applyingModelType
      };
      this.$http.templateService.getCustomComponents(params).then(res => {
        this.folderAssemblyData = res.data ? res.data.folders : [];
        this.withoutFolderAssemblyData = res.data
          ? res.data.withoutFoldercomponents
          : [];
        this.loading3 = false;
        this.$emit(
          "foldersLists",
          this.folderAssemblyData.map(item => ({
            value: item.componentAttr.identifier,
            label: item.componentAttr.folderName
          }))
        );
      });
    },
    //获取选择的组件
    getComponents(e) {
      if (
        e.target.tagName === "LI" ||
        e.target.tagName === "I" ||
        e.target.tagName === "DIV" ||
        e.target.tagName === "SPAN"
      ) {
        let param = this.componentsData.filter(
          item => item.identifier === e.target.getAttribute("data-index")
        );
        this.$emit("addComponents", JSON.parse(JSON.stringify(param[0])));
      }
    },
    //获取选择的自定义组件
    getCustomAssemblyData(data) {
      const fieldIds = this.mapTemplate(data.components)
      if(this.judgeFiledIsRepeat(fieldIds) && data.componentType === "CUSTOMBOX"){
        this.$emit("addComponents", JSON.parse(JSON.stringify(data)));
      } 
    },
    //判断组件的字段是否有和当前选择的字段有重复
    judgeFiledIsRepeat(fieldIds){
      let templateFiledIds = new Set(this.$store.state.ProjectChoiceFiled.curTemplateFiledIds)
      const repeatIds = fieldIds.filter(item => templateFiledIds.has(item.fieldId))
      if(repeatIds.length) {
        const h = this.$createElement;
        this.$message({
          dangerouslyUseHTMLString: true,
          duration:5000,
          showClose: true,
          message: h('ul', null, [h('ul', { style: 'margin-bottom: 2px;color: #f56c6c' } ,'添加失败,该组件包含已选择字段：'),repeatIds.map((item,i) => h('li', { style: 'color: #f56c6c' }, i+1 +'. '+item.name))]) ,
          type: 'error'
        });
        return false
      }
      return true
    },
    // 获取组件里的字段列表
    mapTemplate(data, fieldIds = []){
      data.forEach(item => {
        if (item.componentType === 'CUSTOMBOX' && Array.isArray(item.components)) {
          this.mapTemplate(item.components, fieldIds);
        } else {
          fieldIds.push({fieldId:item.componentAttr.fieldId,name:item.componentAttr.tag});
        }
      });
      return fieldIds;
    }
  }
};
</script>
<style scoped>
.left {
  overflow: auto;
  width: 236px;
  height: 100%;
  padding: 10px 5px 10px 10px;
  border-right: 1px solid rgba(213, 224, 237, 1);
}
 
.basic-components {
  min-height: 282px;
}
.advanced-components {
  min-height: 63px;
}
.components-box{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.components-box li {
  width: 96px;
  height: 30px;
  border: 1px solid transparent;
  background: #F2F6FA;
  border-radius: 2px;
  color: #5d687a;
  font-size: 12px;
  line-height: 30px;
  text-indent: 10px;
  margin-top: 10px;
  cursor: move;
  position: relative;
  display: block !important;
}
.components-box li.sortable-ghost{
  display: none !important;
}
li.custonComponents-list {
  width: 100%;
}
.tow-letter-space {
  letter-spacing: 10px;
}
.three-letter-space {
  letter-spacing: 6px;
}
.components-box li:hover{
  border-color: #107AC2;
  color: #107AC2;
  border-style: dashed;
}
.components-box li i::before{
  color: #7AA3CC;
}
.components-box li:hover i::before {
  color: #107AC2;
}
.box-title {
  font-size: 14px;
  display: flex;
  position: relative;
  align-items: center;
}
.context {
  text-align: center;
  height: 55px;
  color: #3c4551;
  line-height: 55px;
}

.box-title.red-title::before {
  background: #fc5a4c;
}

.box-title.orange-title::before {
  background: #feb639;
}

.box-title .icon-baocun {
  color: #1884CC;
  font-size: 14px;
  padding: 2px 3px 3px;
  border-radius: 4px;
  cursor: pointer;
}
.box-title .title{
  flex-grow: 1;
}
.box-title .icon-baocun:hover{
  background: #E6F9FF;
}
.components-box i {
  font-size: 12px;
  color: #3c4551;
}
.components-box i::before {
  color: #96a2b3;
}
i.custonConponen-icon {
  font-size: 14px;
  font-weight: bold;
  transform: rotate(90deg);
}

.el-tooltip .imgIcon {
  width: 14px !important;
  height: 15px !important;
  position: relative;
  top: -10px;
}

.custonIcon {
  position: relative;
  top: -12px;
}

.custom-name {
  display: inline-block;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.addFile {
  width: 100%;
  margin-top: 20px;
}
.components {
  margin-bottom: 10px;
  padding: 10px 10px;
  background: #fff;
  border: 1px solid rgba(213, 224, 237, 1);
  border-radius: 5px;
  box-shadow: 0 0 1px 1px rgba(176, 190, 209, 0.2);
}
.customComponents.components{
 margin-bottom: 0;
}
.custom-components{
  margin-top: 15px;
}
.custom-components >>> .el-tree-node__content {
  border: 1px solid transparent;
  margin-top: 5px;
  height: 36px;
  font-weight: bold;
  border-radius: 5px;
  font-family: "微软雅黑";
}
.folder-box >>> .el-tree__empty-block {
  display: none;
}
.folder-box .icon-wenjianjiaguanbi{
  font-size: 12px;
}
.custom-component_box >>> .el-tree-node__content:hover {
  background: #E6F9FF;
}
.folder-box >>> .el-tree-node__content:hover {
  border-color: #1884CC;
}
.custom-component_box >>> .el-tree-node__content:hover .el-tree-node__label,
.folder-box >>> .el-tree-node__content:hover .el-tree-node__label,
.folder-box >>> .el-tree-node__content:hover .el-icon-more,
.folder-box >>> .el-tree-node__content:hover .el-tree-node__expand-icon{
  color: #107AC2
}
.custom-component_box >>> .el-tree-node__content:hover,
.folder-box >>> .el-tree-node__children .el-tree-node__content:hover{
  border:1px dashed #107AC2;
  background:#E6F9FF;
}
.custom-component_box >>> .el-tree-node__content:hover .el-tree-node__label,
.custom-component_box >>> .el-tree-node__content:hover .el-tree-node__expand-icon,
.custom-component_box >>> .el-tree-node__content:hover .el-icon-more{
  color: #107AC2
}
.custom-components >>> .el-tree-node__expand-icon.is-leaf{
  color: transparent !important
}
.dropdown-box {
  margin-right: 10px;
  height: 38px;
  line-height: 38px;
}

.dropdown-box:hover .el-icon-more {
  color: #107AC2;
}

.custom-components >>> .custom-tree-node {
  font-size: 13px;
  color: #3c4551;
  display: flex;
  width: 100%;
  height: 38px;
  align-items: center;
  justify-content: space-between;
}
/* .icon-wenjianjiaguanbi{
  color: #627185;
} */
.custom-components >>> .custom-tree-node .el-tree-node__label {
  font-size: 13px;
  flex-grow: 1;
  width: 100px;
  margin-right: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.folder-box >>> .el-tree-node__content{
  border-color: #E0E0E0;
  font-weight: normal;
  background: #fff;
}
.folder-box >>> .el-tree-node__children .el-tree-node__content{
  font-weight: normal;
  background: #F2F6FA;
  border-color: transparent;
}
.custom-component_box >>> .el-tree-node__content {
  background: #F2F6FA;
  font-weight: normal;
}
.folder-box
  >>> .is-current
  > .el-tree-node__content
  > .el-tree-node__expand-icon.is-leaf,
.custom-component_box
  >>> .is-current
  > .el-tree-node__content
  > .el-tree-node__expand-icon.is-leaf {
  color: transparent;
  cursor: default;
}
.custom-components >>> .el-tree__drop-indicator {
  display: none;
}
.sortable-chosen{
  line-height: 50px;
  height: 50px;
  border-radius: 5px;
  border: 1px dashed #107AC2;
  color: #f3f5f6
}
</style>
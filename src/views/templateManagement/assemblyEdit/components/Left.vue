<template>
  <!-- <el-scrollbar :style="{height:(winHeight-82) +'px'}"> -->
    <div class="left" :style="{height:(winHeight-82) +'px'}">
      <div class="basicComponents components">
        <h6 class="box-title">
          <span>基础组件</span>
        </h6>
        <draggable v-model="basicComponents" @end="onEnd" :move='onMove' :options="{group:{ name:'sortlist', pull:'clone',put:true},dragClass:'dragClass',scrollSensitivity:80}">
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
      <div class="complicatedComponents components">
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
      <div class="customComponents components" :style="{minHeight:(winHeight-552) +'px'}">
        <h6 class="box-title orange-title">
          <span class="title">自定义组件</span>
          <!-- <el-tooltip class="item" effect="dark" content="保存组件排序" placement="right" v-if="withoutFolderAssemblyData.length > 2"> -->
            <i class="iconfont icon-baocun" @click="saveFolderSort" v-if="withoutFolderAssemblyData.length > 2" title="保存组件排序"></i>
          <!-- </el-tooltip> -->
        </h6>
        <div>
          <el-button
            type="success"
            icon="el-icon-plus"
            size="small"
            class="addFile"
            @click="addNewFolder"
          >新建文件夹</el-button>
        </div>
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
                <el-tooltip effect="light" placement="right" >
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
                  {{ node.label.folderName || node.label.tag}}</span>
                </el-tooltip>
                <el-dropdown
                  class="dropdown-box"
                  @command="handleCommand"
                  trigger='click'
                  v-if="data.componentType === 'CUSTOMBOX' || data.componentType === 'FOLDER'"
                >
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" v-if="data.componentType === 'FOLDER'">
                    <el-dropdown-item
                      :command="{type:'EDITFOLDER',id:node.label.identifier,folderName:node.label.folderName,folderDescription:node.label.folderDescription}"
                    >编辑</el-dropdown-item>
                    <el-dropdown-item
                      :command="{type:'DELETEFOLDER',id:node.label.identifier,isFlag:data.components.length}"
                    >删除</el-dropdown-item>
                  </el-dropdown-menu>
                  <el-dropdown-menu slot="dropdown" v-else>
                    <el-dropdown-item
                      :command="{type:'EDITASSEMBLYCONTENT',id:data.identifier,data:data}"
                    >修改</el-dropdown-item>
                    <el-dropdown-item :command="{type:'EDITASSEMBLYPOTOTYPE',data:data}">属性</el-dropdown-item>
                    <el-dropdown-item :command="{type:'DELETEASSEMBLY',id:data.identifier}">删除</el-dropdown-item>
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
                <el-tooltip class="item" effect="light" placement="right">
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
                    <el-dropdown-item :command="{type:'EDITASSEMBLYPOTOTYPE',data}">属性</el-dropdown-item>
                    <el-dropdown-item :command="{type:'DELETEASSEMBLY',id:data.identifier}" v-if='checkAuth("RBAC_PERMISSION_api_app_componentOprdelete_{identifier}_DELETE")'>删除</el-dropdown-item>
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
            <el-input v-model="folderForm.folderName" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="文件夹描述">
            <el-input v-model="folderForm.folderDescription" type="textarea" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="folderDialogVisible = false" size="medium">取 消</el-button>
          <el-button type="primary" @click="saveFileBtn('folderForm')" size="medium">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 编辑组件属性 -->
      <el-dialog
        title="修改属性"
        :visible.sync="assemblyDialogVisible"
        width="35%"
        v-el-drag-dialog
        :close-on-click-modal="false"
      >
        <el-form
          label-position="top"
          label-width="80px"
          :model="customAssemblyForm"
          ref="customAssemblyForm"
          :rules="customAssemblyRules"
        >
          <el-form-item label="类别" prop="evaluationCategoryId">
            <el-cascader
              :options="evaluateList"
              v-model="customAssemblyForm.evaluationCategoryId"
              placeholder="请选择评价类型"
              filterable
              disabled
              size="small"
              :props="{label:'name',value:'id',children:'childList'}"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="组件名称" prop="name">
            <el-input
              v-model="customAssemblyForm.name"
              placeholder="请输入组件名称"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="使用范围">
            <el-radio-group v-model="customAssemblyForm.privateCustomWidget" size="small">
              <el-radio :label="true">仅作者可用</el-radio>
              <el-radio :label="false">公开给所有用户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择文件夹">
            <el-select
              size="small"
              v-model="customAssemblyForm.folderId"
              placeholder="请选择文件夹"
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in folderAssemblyData"
                :key="item.componentAttr.identifier"
                :label="item.componentAttr.folderName"
                :value="item.componentAttr.identifier"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组件描述">
            <el-input
              size="small"
              v-model="customAssemblyForm.descriptionCustomWidget"
              type="textarea"
              placeholder="请输入组件描述"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
					<el-button @click="assemblyDialogVisible=false" size="medium">取 消</el-button>
          <el-button type="primary" @click="saveAssemblyBtn('customAssemblyForm')" size="medium">保 存</el-button>
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
    //判断是否全为空格
    const validateName = (rule, value, callback) => {
      if (value.match(/^[ ]*$/)) {
        callback(new Error("不能全为空格"));
      }
      callback();
    };
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
      customAssemblyForm: {
        name: "",
        evaluationCategoryId: [],
        folderId: "",
        descriptionCustomWidget: "",
        privateCustomWidget: false
      },
      //组件添加规则
      customAssemblyRules: {
        name: [
          { required: true, message: "请输入组件名称", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur"
          },
          { validator: validateName, trigger: "blur" }
        ],
        evaluationCategoryId: {
          required: true,
          message: "请选择评价类别",
          trigger: "blur"
        }
			},
			curCheckData:{}, //保存当前选择的组件
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
  props: ["isReload", "evaluateList"],
  watch: {
    isReload(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getCustomComponents();
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
    },
    //打开文件夹增加窗口
    addNewFolder() {
      this.folderDialogTitle = "ADD";
      this.folderDialogVisible = true;
    },
    //保存/编辑文件夹
    saveFileBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.folderDialogTitle === "ADD") {
            //新增
            this.$http.templateService
              .addNewfolder(this.folderForm)
              .then(res => {
                this.getCustomComponents();
                this.folderDialogVisible = false;
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
              })
          } else {
            //修改
            this.$http.templateService
              .editfolder({
                ...this.folderForm,
                identifier: this.checkFolderId
              })
              .then(res => {
                this.getCustomComponents();
                this.folderDialogVisible = false;
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
              })
          }
        }
      });
    },
    //删除文件夹
    deleteFolder(id) {
      this.$http.templateService
        .deleteFolder("folderId=" + params)
        .then(res => {
          this.getCustomComponents();
          this.$message({
            message: "文件夹已删除",
            type: "success"
          });
        });
    },
    //组件操作
    handleCommand(command) {
      switch (command.type) {
        //编辑文件夹
        case "EDITFOLDER": {
          this.folderForm.folderName = command.folderName;
          this.folderForm.folderDescription = command.folderDescription;
          this.folderDialogTitle = "EDIT";
          this.folderDialogVisible = true;
          this.checkFolderId = command.id; //暂存文件夹id
          break;
        }
        //删除文件夹
        case "DELETEFOLDER": {
          if (!command.isFlag) {
            this.$confirm("此操作将永久删除该文件夹, 是否继续?", "", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.$http.templateService
                  .deleteFolder("folderId=" + command.id)
                  .then(() => {
                    this.getCustomComponents();
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                  });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除"
                });
              });
          } else {
            this.$message.error("当前文件夹中存在组件不能删除");
          }
          break;
        }
        //修改组件
        case "EDITASSEMBLYCONTENT": {
          this.$emit(
            "handleCommand",
            JSON.parse(JSON.stringify(command.data)),
            "EDIT"
          );
          break;
        }
        //编辑组件属性
        case "EDITASSEMBLYPOTOTYPE": {
          this.curCheckData = command.data;
          let evaluateId = this.$route.params.evaluateId.split("-");
          this.customAssemblyForm.evaluationCategoryId = evaluateId.map(
            (item, i) => {
              return evaluateId.slice(0, i + 1).join("-");
            }
          );
          this.customAssemblyForm.name = command.data.componentAttr.tag;
          this.customAssemblyForm.folderId =
            command.data.componentAttr.folderId;
          this.customAssemblyForm.privateCustomWidget =
            command.data.componentAttr.privateCustomWidget;
          this.customAssemblyForm.descriptionCustomWidget =
            command.data.componentAttr.descriptionCustomWidget;
          this.assemblyDialogVisible = true;
          break;
        }
        //删除组件
        case "DELETEASSEMBLY": {
          this.$confirm("此操作将删除该组件, 是否继续?", "", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$http.templateService
                .deleteCustomAssembly(command.id)
                .then(res => {
                  this.$emit('deleteAssembly',command.id) //判断当前是否在修改此组件，是则清空编辑区的状态
                  this.getCustomComponents();
                  this.$message({
                    message: "组件已删除",
                    type: "success"
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
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
    //修改组件属性
    saveAssemblyBtn(formName) {
      this.$refs[formName].validate(valid => {
        let {
          name,
          folderId,
          privateCustomWidget,
          descriptionCustomWidget,
          evaluationCategoryId
        } = this.customAssemblyForm;
        let params = this.curCheckData;
        params.componentAttr.tag = name;
        params.componentAttr.folderId = folderId;
        params.componentAttr.privateCustomWidget = privateCustomWidget;
        params.componentAttr.descriptionCustomWidget = descriptionCustomWidget;
        if (valid) {
          this.$http.templateService
            .editCustomAssemblyProps({'component':params})
            .then(res => {
              this.assemblyDialogVisible = false
							this.curCheckData = {}
							this.getCustomComponents()
              this.$message({
                message: "修改成功",
                type: "success"
              });
            });
        }
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
          return "icon-i-shipinshangchuan";
        case "CASCADER":
          return "icon-duojixiala";
        case "DATEPICKER":
          return "icon-riqixuanze";
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
        this.withoutFolderAssemblyData =res.data ? res.data.withoutFoldercomponents : [];
        this.loading3 = false;
        this.$emit(
          "foldersLists",
          this.folderAssemblyData .map(item => ({
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
    },
     
  }
};
</script>
<style scoped>
.left {
  overflow: auto;
  width: 236px;
      height: 854px;
  padding: 10px 5px 10px 10px;
  border-right: 1px solid rgba(213, 224, 237, 1);
}
 
.basic-components {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  min-height: 282px;
}
 
.complicatedComponents {
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
  border-radius: 4px;
  color: #5d687a;
  font-size: 12px;
  line-height: 30px;
  text-indent: 10px;
  margin-top: 10px;
  cursor: move;
  display: block !important;
  position: relative;
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
  border-style: dashed;
  color: #107AC2;
}
.components-box li i::before{
  color: #7AA3CC;
}
.components-box li:hover i::before{
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
  background: #E6F9FF
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
.custom-components >>> .el-tree-node__content {
  border: 1px solid rgba(213, 224, 237, 1);
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
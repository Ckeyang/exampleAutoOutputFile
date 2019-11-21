<template>
  <div class="templateWarp" >
    <header>
      <div class="project-name">
        <el-tooltip class="item" effect="dark" content="返回模板页面" placement="top-start">
          <i class="iconfont icon-fanhui" @click="backTemplateEdit"></i>
        </el-tooltip>
        <span>{{assembltName}}</span> 
      </div>
      <div class="top-btn header-btn-style">
        <!-- <el-button type="success" size="small" @click="backTemplateList">返回列表</el-button> -->
        <i class="iconfont icon-qingkong" @click="clearTemplateData">清空</i>
        <i class="iconfont icon-i-yijianzhankai" @click='collapseAssembel'>{{foldingSwitch ? '一键收缩' : '一键展开'}}</i>
        <el-button type="primary" size="small" class="header-button--primary" @click="openSaveAssembly('保存组件')" :loading='saveLoading'>保存组件</el-button>
        <el-button type="primary" size="small" class="header-button--primary" @click="openSaveAssembly('另存为组件')" >另存为组件</el-button>
      </div>
    </header>
    <div class="templateWarp-box">
      <Left
        @addComponents="addComponents"
        @foldersLists="getFoldersLists"
        @deleteAssembly='deleteAssembly'
        @handleCommand="getEditAssmebly"
        @dragChange='changeisRightAttrFormShow'
        :isReload="isReload"
        :evaluateList='evaluateList'
      ></Left>
      <Middle
        @changeisRightAttrFormShow="changeisRightAttrFormShow"
        @formCopy="formCopy"
        @formDelete="formDelete"
        :templateForm="assmeblyList"
        :formAttrs="formAttrs"
        :currentIndex="currentIndex"
      ></Middle>
      <div
        class="right"
        :class="{'attrShow':isRightAttrFormShow}"
        @click.stop="isRightAttrFormShow=true"
      >
        <Right
          :currentItem="currentItem"
          :formAttr="formAttrs"
          :customAssembly="customAssembly"
          @recursionTemplate='handelRecursionTemplate'
        >></Right>
      </div>
    </div>
    <!-- 保存为组件 -->
    <el-dialog
      v-el-drag-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="35%"
      :close-on-click-modal="false"
    >
      <el-form
        label-position="top"
        label-width="80px"
        :model="customAssemblyForm"
        ref="customAssemblyForm"
        :rules="customAssemblyRules"
        style="width:100%"
      >
          <el-form-item label="类别" prop="evaluationCategoryId">
            <el-cascader
              size='small'
              :options="evaluateList"
              v-model="customAssemblyForm.evaluationCategoryId"
              placeholder="请选择评价类型"
              filterable
              disabled
              :props="{label:'name',value:'id',children:'childList'}"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="组件名称" prop="tag">
            <el-input v-model="customAssemblyForm.tag"  size='small' placeholder="请输入组件名称" clearable></el-input>
          </el-form-item>
           <el-form-item label="使用范围">
            <el-radio-group v-model="customAssemblyForm.privateCustomWidget">
              <el-radio :label="true">仅作者可用</el-radio>
              <el-radio :label="false">公开给所有用户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择文件夹">
            <el-select
              size='small'
              v-model="customAssemblyForm.folderId"
              placeholder="请选择文件夹"
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in foldersList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组件描述">
            <el-input
              size='small'
              v-model="customAssemblyForm.descriptionCustomWidget"
              type="textarea"
              placeholder="请输入组件描述"
              clearable
            ></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog" size='medium'>取 消</el-button>
        <el-button type="primary" @click="saveBtn('customAssemblyForm')" size='medium' :loading='saveLoading'>保 存</el-button>
      </span>
    </el-dialog>
    <!-- 组件修改关系确认,组件修改后是否影响引用组件 -->
    <el-dialog
      title="提示"
      v-el-drag-dialog
      :visible.sync="assemblyRelationDialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <!-- 内层组件的修改是否脱离影响 -->
      <div class="context" v-if="curCheckAssembly.assemblyType === 'quote'">
        <i class="el-icon-warning"></i>
        <span>是否脱离原始组件关系？脱离后原始组件修改将不会影响到本组件</span>
      </div>
      <!-- 外层组件修改及其影响 -->
      <div class="context" v-else>
        <i class="el-icon-warning"></i>
        <span v-show="curCheckAssembly.tips === 'ALL'">会对全部已被引用的组件同步更新操作</span>
        <span v-show="curCheckAssembly.tips === 'OWN'">只会对本组件保存，点击后将断开所有已被引用的组件关联</span>
        <span v-show="curCheckAssembly.tips === 'CHOICE'">选择的组件将进行同步更新操作，未被选中的组件将会断开与本组件的关联</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <div v-if="curCheckAssembly.assemblyType === 'quote'">
          <el-button type="primary" size="medium" @click="editAssmebly([],true)">保 留</el-button>
          <el-button type="primary" size="medium" @click="editAssmebly([],false)">脱 离</el-button>
          <el-button size="medium" @click="assemblyRelationDialogVisible=false">取 消</el-button>
        </div>
        <div v-else>
          <el-button
            type="primary"
            size="medium"
            @click="choiceAssemblyEditEffect('OWN')"
            @mouseenter.native="changeTips('OWN')"
            :class="{'activeHover':curCheckAssembly.tips === 'OWN'}"
          >影响自身</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="choiceAssemblyEditEffect('CHOICE')"
            @mouseenter.native="changeTips('CHOICE')"
            :class="{'activeHover':curCheckAssembly.tips === 'CHOICE'}"
          >选择影响</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="choiceAssemblyEditEffect('ALL')"
            @mouseenter.native="changeTips('ALL')"
            :class="{'activeHover':curCheckAssembly.tips === 'ALL'}"
          >影响全部</el-button>
          <el-button size="medium" @click="closeRelationDialog">取 消</el-button>
        </div>
        <!-- 内层选择列表 -->
        <el-dialog
          width="30%"
          v-el-drag-dialog
          title="请勾选需要影响的组件"
          :visible.sync="innerVisible"
          append-to-body
          :close-on-click-modal="false"
        >
          <div class="filedIdTree">
            <el-tree
              :data="assemblyEditEffectList"
              empty-text
              default-expand-all
              node-key="identifier"
              :props="editEffectListProps"
              ref="tree"
              :expand-on-click-node="false"
              show-checkbox
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <span class="el-tree-node__label">{{node.label}}</span>
              </span>
            </el-tree>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="medium" @click="colseInnerDialog">取 消</el-button>
            <el-button type="primary" size="medium" @click="saveChoiceAssemblyEdit">确 认</el-button>
          </span>
        </el-dialog>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Middle from "../../template/templateWarp/components/middle/Middle.vue";
import Left from "./components/Left.vue";
import Right from "../../template/templateWarp/components/Right.vue";
import { validateName } from "../../../utils.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      formAttrs: {
        formTitle: "组件管理", //表单标题
        type: "ASSEMBLY", //组件
        isShowFormAttr: false, //模板基本信息编辑是否显示
        isShowAssemblyAttr: false //组件基本信息编辑是否显示
      },
      assmeblyList: [], //当前的组件的内容
      currentIndex: 0, //当前高亮的index  1 开始
      isRightAttrFormShow: false, // 是否显示右侧属性栏
      customAssemblyForm: {
        tag: "",
        evaluationCategoryId: [],
        folderId: "",
        descriptionCustomWidget: "",
        privateCustomWidget: false
      },
      evaluateList: [], //评价类型列表
      //组件添加规则
      customAssemblyRules: {
        tag: [
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
      customAssembly: {
        component: {
          userId: sessionStorage.userId,
          identifier: "",
          rootComponentId:"",
          parentId: "-1",
          componentType: "CUSTOMBOX",
          componentAttr: {
            tag: "",
            name: "",
            folderId: "",
            privateCustomWidget: false,
            imagePathCustomWidget: "",
            descriptionCustomWidget: ""
          },
          components: []
        }
      },
      scrollbarNode:null, //滚动区域节点
      saveLoading:false, //保存组件时的状态
      templatePath:sessionStorage.templatePath, //上一步模板页面的路由地址
      foldersList: [], //文件夹列表
      curAssemblyState: "ADD", // 当前组件的操作状态   ADD 为新增组件、另存为  EDIT 为 修改
      foldingSwitch: false, //是否展开所有组件  //默认 false
      isReload: 0, //是否重新加载组件列表
      routerData: {}, //路由数据
      dialogTitle: "",
      dialogVisible: false, //对话框显示开关
      assemblyRelationDialogVisible: false, //组件关系影响弹框
      curCheckAssembly: {
        id: "", //当前选中的组件id
        assemblyType: "", // 组件的位置  'original' 为外部独立组件 ， 'quote' 为内部的引用组件,
        tips: "ALL" //不同操作状态下的提示语。   ALL 影响全部引用的组件， OWN：影响自己 ， CHOICE: 选择影响
      },
      assemblyEditEffectList: [], //该组件被引用的列表
      innerVisible: false,
      defaultProps: {
        children: "components",
        label: "componentAttr",
        id: "identifier"
      },
      editEffectListProps: {
        children: "componentRelates",
        label: "componentName",
        id: "identifier"
      },
    };
  },
  computed: {
    //当前的属性
    formAttribute() {
      return this.currentIndex
        ? this.assmeblyList[this.currentIndex - 1].componentAttr
        : {};
    },
    //当前的属性
    currentItem() {
      return this.currentIndex ? this.assmeblyList[this.currentIndex - 1] : {};
    },
    // 当前的组件类型
    attributeType() {
      return this.currentIndex
        ? this.assmeblyList[this.currentIndex - 1].componentType
        : "";
    },
    assembltName(){
      return this.customAssembly.component.componentAttr.tag || '组件管理'
    },
    // //是否引用自定义组件
    // saveType() {
    //   return this.assmeblyList.filter((item) => item.componentType === 'CUSTOMBOX').length > 0;
    // },
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  created() {
    this.getEvaluateList();
    if (this.$route.params.assmebalyId.length > 1) {
      this.getAssmeblys(this.$route.params.assmebalyId); //获取当前组件内容
    }
    let temData = this.$route.params.evaluateId.split("-");
    this.customAssemblyForm.evaluationCategoryId = temData.map((item, i) => {
      return temData.slice(0, i + 1).join("-");
    });
  },
  watch: {
    dialogVisible(newVal) {
      if (!newVal) {
        this.customAssemblyForm = {
          tag: "",
          folderId: "",
          evaluationCategoryId: this.customAssemblyForm.evaluationCategoryId,
          descriptionCustomWidget: "",
          privateCustomWidget: false
        };
      }
    },
    'assmeblyList.length':function(){
			this.handelRecursionTemplate()
		}
  },
  components: {
    Left, // 左边组件
    Middle, //中间表单
    Right //
  },
  beforeRouteLeave(to,from,next){
    this.assmeblyList = []
    this.handelRecursionTemplate()
    next()
  },
  mounted(){
		this.scrollbarNode = document.querySelector('.middle-box .middle');
  },
  methods: {
    handelRecursionTemplate(){
			//获取里面的filed字段列表
			this.$store.commit({  
				type:'recursionTemplate',
				val:this.assmeblyList
			})
		},
    //一键展开或收缩组件
    collapseAssembel() {
      this.foldingSwitch = !this.foldingSwitch;
      this.assmeblyList = this.assmeblyList.map(item => {
        if (item.componentType === "CUSTOMBOX") {
          item.componentAttr.foldingSwitch = this.foldingSwitch;
        }
        return item;
      });
    },
    //改变是否显示右侧属性设置  index为当前点击的index
    changeisRightAttrFormShow(val, index) {
      const item = JSON.parse(JSON.stringify(this.assmeblyList[index - 1]))
			this.$set(this.assmeblyList,index - 1, item)
      this.currentIndex = index;
      this.isRightAttrFormShow = val;
    },
    // 复制组件
    formCopy(index) {
      this.assmeblyList.splice(
        index,
        0,
        JSON.parse(JSON.stringify(this.assmeblyList[index]))
      );
      this.changeisRightAttrFormShow(true, index + 2); //显示属性栏
    },
    //删除表单元素
    formDelete(index) {
      this.assmeblyList.splice(index, 1);
      const len = this.assmeblyList.length
      if(!len){
        this.currentIndex = 0
        this.isRightAttrFormShow = false;
      }else if(index < len){
        this.currentIndex = index + 1
      }else{
        this.currentIndex = index
      }
    },
    //获取选择的组件
    addComponents(data) {
      if(this.currentIndex){
				this.assmeblyList.splice(this.currentIndex,0,JSON.parse(JSON.stringify(data)));
				this.currentIndex = this.currentIndex + 1;
			}else{
				this.assmeblyList.push(JSON.parse(JSON.stringify(data)));
				this.currentIndex = this.assmeblyList.length
			}
			this.isRightAttrFormShow = true;
			this.$nextTick(()=>{
				const itemTop = document.querySelector('.q_content.isActive').offsetTop 
				const offsetHeight = this.scrollbarNode.offsetHeight //可视区域高度
				if(itemTop > (offsetHeight / 2)){
					this.scrollbarNode.scrollTop = itemTop - offsetHeight + (offsetHeight / 2) + 100
				}else{
					this.scrollbarNode.scrollTop = 0
				}
			})
    },
    //所有的组件列表
    getFoldersLists(data) {
      this.foldersList = data;
    },
    //获取评价类型
    getEvaluateList() {
      this.$http.advisoryCategoryService.getAdvisoryCategoryTree().then(res => {
        this.evaluateList = res.data.childList;
      });
    },
    //去除空的数组
    reloadCategories(data) {
      let result = [];
      data.map(item => {
        let { id, name, childList } = item;
        if (childList.length > 0) {
          result.push({
            id: id,
            name: name,
            childList: this.reloadCategories(childList)
          });
        } else {
          result.push({
            id: id,
            name: name
          });
        }
      });
      return result;
    },
    // 根据id获取组件内容
    getAssmeblys(assmebalyId) {
      this.$http.templateService.getAssmeblysDataById(assmebalyId).then(res => {
        this.getEditAssmebly(res.data);
      });
    },
    //通过originalId获取该组件所引用的有关系的列表
    getAssemblyEditEffectList(originalId) {
      this.$http.templateService
        .getAssemblyEditEffectList(originalId)
        .then(res => {
          this.curAssemblyState = "EDIT";
          this.assemblyEditEffectList = res.data;
        });
    },
    //返回模板编辑
    backTemplateEdit() {
     const templatePath = sessionStorage.templatePath
     if(templatePath){
        this.$router.push(templatePath);
        delete sessionStorage.templatePath
      }else{
       this.$router.go(1);
      }
    },
    //判断是否在修改此组件
    deleteAssembly(id){
      if(this.customAssembly.component.identifier === id){
        this.isRightAttrFormShow = false;
        this.assmeblyList = [];
        this.curAssemblyState = "ADD";  
        this.defaultStatus() 
      } 
    },
    //修改组件,获取组件内容
    getEditAssmebly(data) {
      //修改组件
      if (this.assmeblyList.length) {
        this.$confirm("修改组件将清空当前内容, 是否继续?", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.currentIndex = 1;
          this.assmeblyList = data.components;
          this.customAssembly.component = data;
          this.customAssembly.component.components = []
          this.curAssemblyState = "EDIT";
          this.curCheckAssembly.assemblyType = data.parentId === '0' ? "original" : "quote"; //判断是实际组件还是引用组件
          this.getAssemblyEditEffectList(data.componentAttr.originalId); //查询该组件被引用的列表
          this.changeisRightAttrFormShow(true, 1); //显示属性栏
        });
      } else {
        this.assmeblyList = data.components;
        this.customAssembly.component = data;
        this.customAssembly.component.components = []
        this.curAssemblyState = "EDIT";
        this.curCheckAssembly.assemblyType = data.parentId === '0' ? "original" : "quote"; //判断是实际组件还是引用组件
        this.getAssemblyEditEffectList(data.componentAttr.originalId); //查询该组件被引用的列表
        this.changeisRightAttrFormShow(true, 1); //显示属性栏
      }
       
    },
    //改变tips
    changeTips(val) {
      this.curCheckAssembly.tips = val;
    },
    //选择组件修改的影响操作
    choiceAssemblyEditEffect(val) {
      switch (val) {
        case "OWN": {
          this.editAssmebly();
          this.dialogVisible = false;
          break;
        }
        case "CHOICE": {
          this.innerVisible = true;
          break;
        }
        case "ALL": {
          let ids = this.checkAllNode(
            this.assemblyEditEffectList,
            this.customAssembly.component.componentAttr.originalId,
            []
          );
          this.editAssmebly(ids);
        }
      }
    },
    //全选
    checkAllNode(data, originalId, ids) {
      for (let item of data) {
        // if (item.componentRelates.length) {
        //   this.checkAllNode(item.componentRelates, originalId, ids);
        // } else {
          ids.push(item.identifier);
        // }
      }
      return ids;
    },
    //打开保存组件弹框
    openSaveAssembly(val) {
      //当前状态为新增组件（新增保存、另存为）
      if (this.curAssemblyState === "ADD" || val === "另存为组件") {
        if (this.assmeblyList.length) {
          this.dialogTitle = val;
          this.dialogVisible = true;
        } else {
          this.$message({
            message: "组件内容不能为空！",
            type: "warning"
          });
        }
      } else { // 修改
        if (
          (this.assemblyEditEffectList.length &&
            this.curCheckAssembly.assemblyType === "original") ||
          (this.curCheckAssembly.assemblyType === "quote" &&
            this.customAssembly.component.componentAttr.keepConnection)
        ) {
          this.assemblyRelationDialogVisible = true;
        } else {
          // 直接保存组件
          this.editAssmebly();
        }
      }
    },
    //修改组件
    editAssmebly(influencedComponentIds = [], keepConnection = true) {
      // 组件校验
			if(this.templateValidate(this.assmeblyList)) return
      let params = {
        component: this.customAssembly.component, 
        influencedComponentIds,
        keepConnection
      };
      params.component.components = this.resetTemplateValue(this.assmeblyList),
      this.$http.templateService.editCustomAssembly(params).then((res) => {
        this.$message({
          message: "修改成功!",
          type: "success"
        });
        this.curAssemblyState = "ADD" //还原初始新增状态
        this.defaultStatus()
        this.assmeblyList = [];
        this.assemblyRelationDialogVisible = false;
        this.innerVisible = false;
        this.isReload++;
        if(res.data){
          this.$message({
            type:'error',
            message:res.data
          })
        }
      });
    },
    //选择影响的修改
    saveChoiceAssemblyEdit() {
      this.editAssmebly(this.$refs.tree.getCheckedKeys(true));
    },
    // 模板保存校验
		templateValidate(data){
			for(let item of data){
				// 校验列宽设置
				if(item.componentAttr.setFixedColumnWidth){
					if(Number(item.componentAttr.fixedColumnWidth) < 20 ){
						this.$message({
							message: `${item.componentAttr.tag} ：列宽不能小于20px`,
							type: 'error',
							duration: '1000'
						})
						return true
					}
				}
			}
		},
    //新增/另存为组件
    saveBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 组件校验
			    if(this.templateValidate(this.assmeblyList)) return
          this.customAssembly.component.components = this.resetTemplateValue(this.assmeblyList);
          this.customAssembly.component.componentAttr = JSON.parse(
            JSON.stringify(this.customAssemblyForm)
          );
          delete this.customAssembly.component.componentAttr.evaluationCategoryId;
          let len = this.customAssemblyForm.evaluationCategoryId.length;
          this.customAssembly.component.evaluationCategoryId = len
            ? this.customAssemblyForm.evaluationCategoryId[len - 1]
            : "";
          this.saveLoading = true //开始保存
          this.$http.templateService
            .saveCustomAssembly(this.customAssembly)
            .then(() => {
              this.saveLoading = false; 
              this.$message({
                message: "保存成功!",
                type: "success"
              });
              this.assmeblyList = [];
              this.defaultStatus() 
              this.cancelDialog();
              this.isReload++;
            }).catch(err =>{
              let trimer = setTimeout(()=>{
                this.saveLoading = false //保存结束	
                clearTimeout(trimer)
              },100)
            });     
          }
      })
    },
    //返回自定义组件默认状态
    defaultStatus() {
      this.customAssembly = {
        component: {
          identifier: "",
          rootComponentId:"",
          parentId: "-1",
          componentType: "CUSTOMBOX",
          componentAttr: {
            tag: "",
            name: "",
            privateCustomWidget: false,
            imagePathCustomWidget: "",
            descriptionCustomWidget: "",
            multipleCustomWidget: false
          },
          components: []
        }
      };
    },
    //清空内容
    clearTemplateData() {
      this.$confirm('<p class="comfire-title">当前模板内容未保存, 是否清空内容？</p><p class="comfire-text">您修改了模板内容但没有保存，清空内容会丢失您的修改</p>', '', {
				confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString:true,
				type: 'warning'
			}).then(() => {
				this.assmeblyList = [];
        this.curAssemblyState = "ADD";  
        this.defaultStatus() 
			}) 
      
    },
    //关闭组件添加框
    cancelDialog() {
      this.dialogVisible = false;
    },
    //关闭组件引用关系框
    closeRelationDialog() {
      this.assemblyRelationDialogVisible = false;
      this.curCheckAssembly.tips = "ALL";
    },
    //关闭内层引用组件列表选择框
    colseInnerDialog() {
      this.innerVisible = false;
    },
    //重置控件的值
		resetTemplateValue(data){
			for(let item of data){
				item.formValue = {
            addressValue: {
              provinceValue: "",
              cityValue: "",
              countyValue: "",
              streetValue: ""
            },
            imageValue: [],
						industryList:[],
            dynamicChoiceValues:[],
            stringListValue: [],
            stringValue: ""
					};
					// 默认值
				if(item.componentType === "TEXTBOX"){
					item.formValue.stringValue = item.componentAttr.defaultStringTextBox
				}else if(item.componentAttr.choiceItemsType === 'FIXED_ITEMS' && ['RADIOBOX','COMBOBOX'].includes(item.componentType)){
					for(let ele of item.componentAttr.choiceItemsChoiceBox){
						if(ele.chosen){
							item.formValue.stringValue = ele.choiceValue;
							item.componentAttr.defaultStringTextBox = ele.choiceValue
							break;						
						}
					}
				}else if(item.componentAttr.choiceItemsType === 'FIXED_ITEMS' && ['CHECKBOX','MULTIPLE_COMBOBOX'].includes(item.componentType))	{
					item.formValue.stringListValue = item.componentAttr.defaultListBox = item.componentAttr.choiceItemsChoiceBox.filterMap(ele => {
						if(ele.chosen){
							return ele.choiceValue
						}
					})
				} 
				if(item.components && item.components.length){
					this.resetTemplateValue(item.components)
				}
			}
			return data
		},
  }
};
</script>
<style scoped>
.templateWarp header {
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #107AC2;
}

.templateWarp {
  background: #f3f5f6;
  min-height: 100%;
  width: 100%;
}

.templateWarp-box {
  display: flex;
  height: 100%;
  justify-content: space-between;
}

.templateWarp-box .right {
  width: 240px;
	position: relative;
	right: -305px;
	height: calc(100vh - 82px);
	overflow: auto;
	padding: 10px 10px 15px 10px !important;
	transition: right 0.3s;
}

.templateWarp-box .right.attrShow {
  right: 0;
}

.top-btn {
  display: flex;
	/* width: 420px; */
	align-items: center;
	height: 32px;
	margin-right: 20px;
	justify-content: space-around;
}

.el-icon-warning {
  color: #fc5a4c;
  margin-right: 5px;
}

.activeHover {
  background: #26beff;
  border-color: #26beff;
}

.project-name {
  float: left;
  margin-left: 15px;
  font-size: 18px;
  color: #fff;
}

.filedIdTree {
  padding: 0 22px;
  margin-bottom: 10px;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  padding: 5px 0;
  margin: 15px 0;
  border-radius: 5px;
}
.filedIdTree >>> .el-dialog__body {
  padding: 0 25px;
}
.filedIdTree >>> .el-tree-node__content {
  height: 32px;
}
.icon-fanhui{
  cursor: pointer;
  margin-right: 20px;
  color: #fff;
  font-size: 18px;
}
.icon-qingkong{
  vertical-align: middle ;
  color: #fff;
  cursor: pointer;
  line-height: 32px;
  margin: 0 0 0 15px;
  font-size: 18px;
}
.icon-fanhui:hover,
.icon-qingkong:hover{
  color: #fff
}
</style>
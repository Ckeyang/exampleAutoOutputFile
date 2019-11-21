<template>
  <div class="templateWarp" >
    <header>
      <div class="project-name">{{formAttrs.formTitle}}</div>
      <div class="top-btn header-btn-style">
        <i class="iconfont icon-qingkong" @click="clearTemplateDataBtn">清空</i>
				<i class="iconfont icon-i-yulan" @click='previewTemplate'>预览</i>
				<i class="iconfont icon-i-yijianzhankai" @click='collapseAssembel'>{{foldingSwitch ? '一键收缩' : '一键展开'}}</i>
        <el-button type="primary" class="header-button--primary"  size="small" @click='saveTemplate' :loading="tempSaveLoading">保存模板</el-button>
        <el-button type="primary" class="header-button--primary"  size="small" @click='goAssemblyManagement'>组件管理</el-button>
        <el-button type="primary" class="header-button--primary"  size="small" @click='openSaveAssemblyDialog'>另存组件</el-button>
        <!-- <el-button type="primary"  size="small" @click='backTemplateList'>返回列表</el-button> -->
      </div>
    </header>
    <div class="templateWarp-box">
      <Left 
				@addComponents='addComponents'
				@getComponentsList='getComponentsList' 
				@dragChange='changeisRightAttrFormShow' 
				:isReload="isReload"  
				@foldersLists="getFoldersLists"></Left>
      <Middle @changeisRightAttrFormShow='changeisRightAttrFormShow' @formCopy='formCopy' @formDelete='formDelete' @changeTitle='changeTitle'
        :templateForm='templateForm' :formAttrs='formAttrs' :currentIndex='currentIndex' v-loading='isLoading'></Middle>
      <div class="right" id='right-box' :class="{'attrShow':isRightAttrFormShow}" @click.stop='isRightAttrFormShow=true'>
        <Right :currentItem='currentItem' :formAttr='formAttrs' @recursionTemplate='handelRecursionTemplate' ></Right>
      </div>
    </div>
		<el-dialog
      v-el-drag-dialog
      title="另存为组件"
      :visible.sync="assemblyDialogVisible"
      width="35%"
      :close-on-click-modal="false">
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
        <el-button @click="closeSaveAssembly" size='medium'>取 消</el-button>
        <el-button type="primary" @click="saveOtherAssembly('customAssemblyForm')" size='medium' :loading='assemblySaveLoading'>保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Left from './components/Left.vue';
import Right from './components/Right.vue';
import Middle from './components/middle/Middle.vue';
import { mapGetters } from 'vuex';
export default {
	data() {
		//判断是否全为空格
		const validateName = (rule, value, callback) => {
			if (value.match(/^[ ]*$/)) {
				callback(new Error('不能全为空格'));
			}
			callback();
		};
		return {
			formAttrs: {
				formTitle: '', //表单标题
				description: '', //表单描述,
				// groupId: '',
				// scope: '',
				isShowFormAttr: false, //模板基本信息编辑是否显示
				isShowAssemblyAttr: false //组件基本信息编辑是否显示
			},
			isLoading:true, //获取数据等待状态
			tempSaveLoading:false, //保存数据时等待的状态
			assemblySaveLoading:false, // 另存为组件loading
			evaluateList: [], //评价类型列表
			foldersList: [], //文件夹列表
			groupList: [], //项目库分组列表
			curState: '', //当前保存按钮的执行的操作  parmses  SAVETEMPLATE：保存模板 、SAVEFORM : 保存私有模板
			componentsList: [], //所有的组件列表
			templateForm: [],
			currentIndex: 0, //当前高亮的index  1 开始
			isRightAttrFormShow: false, // 是否显示右侧属性栏
			dialogVisible: false, //对话框显示开关
			assemblyDialogVisible:false,
			tipDialogVisible:false, //保存提示框
			saveTemplateSwitch: false, //是否为另存为模板
			template: {
				//模板对话框的信息
				name: '',
				description: '',
				groupId: '', //分组
				scope: '' // 使用范围
			},
			//组件表单
			customAssemblyForm: {
        tag: "",
        evaluationCategoryId: [],
        folderId: "",
        descriptionCustomWidget: "",
        privateCustomWidget: false
			},
			isReload:0, //变化刷新左侧组件列表
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
			foldingSwitch: false, //是否展开所有组件  //默认 false
			fileList: [], //上传的自定义组件图标文件
			routerData: {}, //路由数据
			dialogTitle: '',
			scrollbarNode:null, //滚动区域节点
			isShowGotoSubmissionAttrBtn:true, // 是否显示设置提交属性的弹框
			// regexpValidate: {
			// 	NONE: '^[\\s\\S]*$',
			// 	NUMBERS: '^(-?\\d+)(\\.\\d+)?$',
			// 	CHINESE: '^[\\u4e00-\\u9fa5]+$',
			// 	CHARACTERS: '^[a-zA-Z]+$',
			// 	PHONE_NUMBER: '^1[3|4|5|8][0-9]d{4,8}$',
			// 	EMAIL: '^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$'
			// }
		};
	},
	computed: {
		//当前的属性
		formAttribute() {
			return this.currentIndex ? this.templateForm[this.currentIndex - 1].componentAttr : {};
		},
		//当前的属性
		currentItem() {
			return this.currentIndex ? this.templateForm[this.currentIndex - 1] : {};
		},
		// 当前的组件类型
		attributeType() {
			return this.currentIndex ? this.templateForm[this.currentIndex - 1].componentType : '';
		},
		//是否引用自定义组件
		saveType() {
			return this.templateForm.filter((item) => item.componentType === 'CUSTOMBOX').length > 0;
		},
		// 使用对象展开运算符将 getter 混入 computed 对象中
		...mapGetters(['checkAuth'])
	},
	watch:{
		assemblyDialogVisible(val){
			if(!val){
				this.closeSaveAssembly()
			}
		},
		'templateForm.length':function(){
			this.handelRecursionTemplate()
		}
	},
	created() {
		this.routerData.tempIdentifier = this.$route.params.tempIdentifier;
		this.routerData.tempId = this.$route.params.tempId;
		this.getEvaluateList(); //初始化评价类型
		//获取模板
		if (this.routerData.tempId.length > 1) {
			this.getTemplate();
		}
	  //将字符串的评价类型转化未数组格式
		let temData = this.$route.params.evaluateId.split("-");
    this.customAssemblyForm.evaluationCategoryId = temData.map((item, i) => {
      return temData.slice(0, i + 1).join("-");
    });
	},
	components: {
		Left, // 左边组件
		Right, //右边属性设置
		Middle, //中间表单
		// Upload //文件上传
	},
	mounted(){
		this.scrollbarNode = document.querySelector('.middle-box .middle');
	},
	beforeRouteLeave(to,from,next){
    this.templateForm = []
    this.handelRecursionTemplate()
    next()
  },
	methods: {
		handelRecursionTemplate(){
			//获取里面的filed字段列表
			this.$store.commit({  
				type:'recursionTemplate',
				val:this.templateForm
			})
		},
		//一键展开或收缩组件
		collapseAssembel() {
			this.foldingSwitch = !this.foldingSwitch;
			this.templateForm = this.templateForm.map((item) => {
				item.componentAttr.foldingSwitch = this.foldingSwitch;
				return item;
			});
		},
		//改变是否显示右侧属性设置  index为当前点击的index
		changeisRightAttrFormShow(val, index) {
			const item = JSON.parse(JSON.stringify(this.templateForm[index - 1]))
			this.$set(this.templateForm,index - 1, item)
			this.currentIndex = index;
			this.isRightAttrFormShow = val;
		},
		//获取评价类型
		getEvaluateList() {
			this.$http.projectService.getEvaluateList().then((res) => {
				this.evaluateList = res.data.childList;
			});
		},
		// 复制组件
		formCopy(index) {
			this.templateForm.splice(index, 0, JSON.parse(JSON.stringify(this.templateForm[index])));
			this.changeisRightAttrFormShow(true, index + 2); //显示属性栏
		},
		//删除表单元素
		formDelete(index) {
			this.templateForm.splice(index, 1);
			this.currentIndex = index || 1;
			this.isRightAttrFormShow = false;
		},
		//获取选择的组件
		addComponents(data) {
			if(this.currentIndex){
				this.templateForm.splice(this.currentIndex,0,JSON.parse(JSON.stringify(data)));
				this.currentIndex = this.currentIndex + 1;
			}else{
				this.templateForm.push(JSON.parse(JSON.stringify(data)));
				this.currentIndex = this.templateForm.length
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
		//所有的文件夹列表
    getFoldersLists(data) {
      this.foldersList = data;
		},
		//打开保存组件窗口
		openSaveAssemblyDialog(){
			if(!this.templateForm.length){
				this.$message({
            message: "组件内容不能为空！",
            type: "warning"
				});
				return ;
			}
			this.assemblyDialogVisible = true
		},
		//另存为组件
		saveOtherAssembly(formName){
			this.$refs[formName].validate(valid => {
        if (valid) {
					if(this.templateValidate(this.templateForm)) return
					let paramsObj = {component:{}}
          paramsObj.component.components = this.resetTemplateValue(this.templateForm);
          paramsObj.component.componentAttr = JSON.parse(JSON.stringify(this.customAssemblyForm));
          delete paramsObj.component.componentAttr.evaluationCategoryId;
          let len = this.customAssemblyForm.evaluationCategoryId.length;
          paramsObj.component.evaluationCategoryId = len
            ? this.customAssemblyForm.evaluationCategoryId[len - 1]
            : "";
          this.assemblySaveLoading = true //开始保存
          this.$http.templateService
            .saveCustomAssembly(paramsObj)
            .then(() => {
              this.assemblySaveLoading = false; 
              this.$message({
                message: "保存成功!",
                type: "success"
              });
              this.templateForm = [];
              this.closeSaveAssembly();
              this.isReload++;
            }).catch(err =>{
              const timer = setTimeout(()=>{
                this.assemblySaveLoading = false //保存结束	
                clearTimeout(timer)
              },100)
            });     
          }
      })
		},
		//取消另存为组件
		closeSaveAssembly(){
			this.assemblyDialogVisible = false;
			this.customAssemblyForm = {
        tag: "",
        evaluationCategoryId: this.customAssemblyForm.evaluationCategoryId,
        folderId: "",
        descriptionCustomWidget: "",
        privateCustomWidget: false
			}
		},
		//去组件编辑页面
		goAssemblyManagement() {
			this.$confirmComponent('是否保存当前内容？','您可能修改了模板内容但没有保存，是否需要保存内容并继续？', {
        leftButtonText:'返回模板设计',
				confirmButtonText: "保存并继续",
				cancelButtonText: "不保存",
      })
      .then((state)=>{
        if(state === 'confirm'){
					this.dialogTitle = '保存模板';
					this.saveBtn(`/assemblyEdit/0/${this.$route.params.evaluateId}/${this.$route.params.applyingModelType}`); 
					sessionStorage.templatePath = this.$route.path
        }
      }).catch(()=>{
				sessionStorage.templatePath = this.$route.path
				this.$router.replace(`/assemblyEdit/0/${this.$route.params.evaluateId}/${this.$route.params.applyingModelType}`)
			})
		},
		//所有的组件列表
		getComponentsList(data) {
			this.componentsList = data;
		},
		/**
		 * @param { String } router  保存后需要跳转的路由 , 默认不跳转
		 * @param { Function } callback  保存后需要执行的放法, 默认不执行
		 */
		//保存模板  
		saveBtn(router = '', callback = null) {
			if (this.dialogTitle === '保存模板' || this.dialogTitle === '保存表单模板') {
				if(this.templateValidate(this.templateForm)) return
				let templateParams = {};
				templateParams.name = this.template.name;
				templateParams.description = this.template.description;
				templateParams.type = 'STANDARD';
				templateParams.categoryId = this.$route.params.applyingModelType;
				templateParams.projectId = '';
				templateParams.groupId = this.template.groupId;
				templateParams.scope = this.template.scope;
				templateParams.sourceTemplateId = this.template.sourceTemplateId || '';
				templateParams.dataId = this.template.dataId || '';
				templateParams.evaluationCategory = this.template.evaluationCategory || '';
				templateParams.components = this.resetTemplateValue(this.templateForm);
				console.log(1)
				//修改模板
				templateParams.identifier = this.routerData.tempId;
				const tempIdentifier = this.routerData.tempIdentifier
				this.tempSaveLoading = true //开始保存
				this.$http.projectService.editTemplate(tempIdentifier, templateParams.identifier, templateParams).then((res) => {
					this.formAttrs.formTitle = this.template.name; //修改模板同时刷新视图
					this.cancelDialog();
					if(res.data && this.isShowGotoSubmissionAttrBtn){
						this.isGotosubmissionAttrPage()
						return 
					}
					this.$message({
						message: "保存成功!",
            type: "success"
					})
					router && this.$router.replace(router);
					callback && callback()
				}).finally(()=>{
					let timer = setTimeout(()=>{
						this.tempSaveLoading = false //保存结束	
						clearTimeout(timer)
					},100)
				});
			}
		},
		// 是否取设置提交属性页面
		isGotosubmissionAttrPage(){
			this.$confirmComponent('模板保存成功！','当前模板内有扫码搜索共享件，是否现在就去设置检测数据提交属性？', {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				closeOnClickModal:false,
				type:'success',
				icon:'icon-i-chenggongtishi iconfont'
      })
      .then((state)=>{
        this.$router.replace(`/projectManagement/submissionAttr/${this.routerData.tempIdentifier}/${this.routerData.tempId}`)
      }).catch(()=>{
				this.$router.replace(`/projectManagement/projectTemplateList`) // 返回模板列表
			})
			 
		},
		//判断是否重名
		judgeRename(name, data) {
			return data.some((item) => item.componentAttr.name === name);
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

		//清空内容
		clearTemplateDataBtn() {
			this.$confirm('<p class="comfire-title">当前模板内容未保存, 是否清空内容？</p><p class="comfire-text">您修改了模板内容但没有保存，清空内容会丢失您的修改</p>', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				dangerouslyUseHTMLString:true,
				type: 'warning'
			}).then(() => {
				this.templateForm = []; //清空内容
				this.curState = '';
			}).catch(()=>{})         
		},
		cancelDialog() {
			this.dialogVisible = false;
			this.curState = '';
		},
		// 获取模板
		getTemplate() {
			this.$http.projectService.getTemplateById(this.routerData.tempId).then((res) => {
				if (res.data) {
					this.templateForm = res.data.components;
					this.formAttrs.formTitle = res.data.name;
					this.formAttrs.description = res.data.description;
					this.template.name = res.data.name;
					this.template.scope = res.data.scope;
					this.template.groupId = res.data.groupId;
					this.template.description = res.data.description;
					this.template.sourceTemplateId = res.data.sourceTemplateId || '';
					this.template.dataId = res.data.dataId || '';
					this.template.evaluationCategory = res.data.evaluationCategory || '' ;
				}
			}).finally(()=>{
				this.isLoading = false;
			});
		},
		//保存按钮
		saveTemplate() {
			// if (this.routerData.projectId.length > 1) {
				//保存私有模板(表单)
				// this.dialogTitle = '保存表单模板';
				// this.saveTemplateSwitch = true;
				// this.saveBtn();
			// } else {
				this.dialogTitle = '保存模板';
				this.saveBtn(); // 去设置提交属性页面
			// } 
		},
		//预览模板
		previewTemplate() {
			this.$confirmComponent('是否保存当前内容？','预览后会丢失未保存的内容，是否需要保存内容并继续？', {
        leftButtonText:'返回模板设计',
				confirmButtonText: "保存并继续",
      	cancelButtonText: "不保存",
      })
      .then((state)=>{
        if(state === 'confirm'){
					this.dialogTitle = '保存模板';
					this.isShowGotoSubmissionAttrBtn = false
					this.saveBtn(null,this.saveTempPreviewForm); 
        }
      }).catch(()=>{
				this.isShowGotoSubmissionAttrBtn = false
				this.saveTempPreviewForm() //生成临时表单
			})
		},
		//生成临时的表单进行预览
		saveTempPreviewForm(){
			// 模板校验
			if(this.templateValidate(this.templateForm)) return
			let templateParams = {};
				templateParams.name = this.formAttrs.formTitle;
				templateParams.type = 'STANDARD';
				templateParams.components = this.resetTemplateValue(this.templateForm);
				const {tempIdentifier, tempId} = this.routerData
				this.$http.templateService.previewTemplate(tempIdentifier,tempId, {components:templateParams.components}).then((res) => {
					this.$router.push({
						path:`/templatePreview/${templateParams.name}/%20/%20/${res.data}/view/template`,
						query:{ tempIdentifier }
					}); 
				});
		},
		//改变标题
		changeTitle(val) {
			if (this.curState === 'SAVEASSEMBLE') {
				//修改组件信息
				this.isRightAttrFormShow = true;
				this.formAttrs.isShowAssemblyAttr = true;
			} else {
				//修改模板信息
				// this.formAttrs.isShowFormAttr = true;
				this.isRightAttrFormShow = false;
			}
			this.currentIndex = 0;
			this.formTitle = val;
		},
		//重新获取模板或表单内容
		backTemplateEdit() {
			this.getTemplate();
		},
		//添加正则规则
		// addRegExpRules(data) {
		// 	data.forEach((ele) => {
		// 		if (ele.componentType === 'CHECKBOX' || ele.componentType === 'RADIOBOX' || ele.componentType === 'TEXTBOX') {
		// 			ele.componentAttr.inputModle.regex = this.regexpValidate[ele.componentAttr.inputModle.inputType];
		// 		}
		// 	});
		// 	return data;
		// }
	}
};
</script>
<style scopeed>
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
	align-items: center;
	height: 32px;
	margin-right: 20px;
	justify-content: space-around;
}

.project-name {
	float: left;
	margin-left: 15px;
	font-size: 20px;
	color: #fff;
}
.icon-qingkong:hover{
  color: #fff
}
.message-box .el-dialog__header{
	padding: 15px 15px 10px;
}
.message-box .el-dialog__header .el-dialog__title{
	font-weight: normal;
	font-size: 16px;
}
.message-box .el-dialog__body{
	border: none;
	padding:10px 15px;
}
.tip-box{
	display: flex;
	font-size: 14px;
	align-items: center;
}
.tip-icon{
	font-size: 24px;
	color: #e6a23c;
	margin-right: 10px;
}
</style>
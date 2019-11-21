<template>
  <div class="templateWarp" @click='isRightAttrFormShow=false;currentIndex=0'>
    <header> 
       <div class="project-name">{{formAttrs.formTitle}}</div>
      <div class="top-btn">
           <el-button type="primary" round size="small" @click='goAssemblyManagement'>组件管理</el-button>
              <el-button type="primary" round size="small" @click='backTemplateList'>返回列表</el-button>
        <el-button type="info" round size="small" @click='previewTemplate'>预览</el-button>
        <el-button type="info" round size="small" @click='collapseAssembel'>{{foldingSwitch ? '一键收缩' : '一键展开'}}</el-button>
        <!-- <el-button type="primary" round size="small" @click='releaseBtn' v-if='routerData.projectId.length>1 && checkAuth("RBAC_PERMISSION-templateList-public")'>发布</el-button> -->
        <el-button type="primary" round size="small" @click='saveTemplate' v-if='checkAuth("RBAC_PERMISSION-templateList-modify")'>{{routerData.projectId.length>1? '保存表单模板' : '保存模板'}}</el-button>
        <el-button type="primary" round size="small" @click='saveToTemplate'>另存为模板</el-button>
        <el-button type="primary" round size="small" @click='clearTemplateData'>清空</el-button>
      </div>
    </header>
    <div class="templateWarp-box">
      <Left  @addComponents='addComponents' @getComponentsList='getComponentsList'  :isReload='isReload'></Left>
      <Middle @changeisRightAttrFormShow='changeisRightAttrFormShow' @formCopy='formCopy' @formDelete='formDelete' @changeTitle='changeTitle'
        :templateForm='templateForm' :formAttrs='formAttrs' :currentIndex='currentIndex'></Middle>
      <div  class="right" :class="{'attrShow':isRightAttrFormShow}" @click.stop='isRightAttrFormShow=true'>
        <Right  :currentItem='currentItem'  :formAttr='formAttrs' :customAssembly='customAssembly'></Right>
      </div>
    </div>
    <!-- 保存为组件 -->
    <el-dialog :title='dialogTitle' :visible.sync="dialogVisible" width="35%" :close-on-click-modal='false'>
      <el-form label-position="left" label-width="70px" :model="customAssembly" v-show='!saveTemplateSwitch'>
        <el-form-item label="组件名称">
          <el-input v-model="customAssembly.component.componentAttr.name" size='small' style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="使用范围">
          <el-radio-group v-model="customAssembly.component.componentAttr.privateCustomWidget">
            <el-radio :label='true'>仅作者可用</el-radio>
            <el-radio :label="false">公开给所有用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="组件描述">
          <el-input v-model="customAssembly.component.componentAttr.descriptionCustomWidget" type='textarea' size='small' style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="图标设置">
          <Upload :fileRegexp='new RegExp(/^\.png$/)' :limit='1' v-model='fileList' tipMesg='只能上传png格式图片，且不超过500kb，建议图标大小14x14'></Upload>
        </el-form-item>
      </el-form>
      <el-form label-position="right" label-width="80px" :rules="templateRules1" ref="templateRuleForm" :model="template" v-show='saveTemplateSwitch'>
        <!-- <el-form-item label="模板类别">
          <el-radio-group v-model="template.type">
            <el-radio label="STANDARD">普通模板</el-radio>
            <el-radio label="RELATION">关系模板</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="template.name" style="width: 70%" placeholder="请输入模板名称"></el-input>
        </el-form-item>
         <el-form-item label="模板类型" prop="categoryId">
          <el-select v-model="template.categoryId" placeholder="请选择模板类型" style="width:70%" @change='getCategoryId'>
            <el-option :label="item.label" :value="item.id" v-for='item of categoryIdList' :key='item.id'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板分组" prop="groupId">
          <el-select v-model="template.groupId" placeholder="请选择模板分组" style="width: 51%">
            <el-option :label="item.label" :value="item.id" v-for='item of groupList' :key='item.id'></el-option>
          </el-select>
           <el-button type="primary" @click='innerVisible=true' >创建分组</el-button>
        </el-form-item>
        <el-form-item label="使用范围">
          <el-radio-group v-model="template.scope">
            <el-radio label="PRIVATE">仅作者可用</el-radio>
            <el-radio label="PUBLIC">公开给所有用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模板描述">
          <el-input type="textarea" v-model="template.description" placeholder="请输入模板描述" size='small' style="width: 70%"></el-input>
        </el-form-item>
         <!-- 内层dialog -->
        <el-dialog title="添加分组" :visible.sync="innerVisible" append-to-body :close-on-click-modal='false'>
          <el-form :model="groupForm" :rules="templateRules2" ref="ruleForm">
            <el-form-item label="分组名称" prop="name" label-width="120px">
              <el-input v-model="groupForm.name" auto-complete="off" placeholder="请选择分组名称" style="width:70%"></el-input>
            </el-form-item>
            <el-form-item label="模板类型" prop="categoryId" label-width="120px">
              <el-select v-model="groupForm.categoryId" placeholder="请选择模板类型" style="width:70%">
                <el-option :label="item.label" :value="item.id" v-for='item of categoryIdList' :key='item.id'></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeInnerVisible('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="confirmAddGroup('ruleForm')">保 存</el-button>
          </div>
        </el-dialog>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="saveBtn">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import Left from './components/Left.vue';
import Right from './components/Right.vue';
import Middle from './components/middle/Middle.vue';
import Upload from '@/components/tools/UpLoad.vue';
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
				formTitle: '模板标题', //表单标题
				description: '', //表单描述,
				groupId: '',
				categoryId: '',
				type: '',
				scope: '',
				isShowFormAttr: false, //模板基本信息编辑是否显示
				isShowAssemblyAttr: false //组件基本信息编辑是否显示
			},
			groupForm: {
				//添加分组
				name: '',
				categoryId: '' //类型
			},
			groupList: [], //项目库分组列表
			categoryIdList: [], //模板类型列表
			templateRules1: {
				name: [
					{ required: true, message: '请输入模板名称', trigger: 'blur' },
					{
						min: 2,
						max: 50,
						message: '长度在 2 到 50 个字符',
						trigger: 'blur'
					},
					{ validator: validateName, trigger: 'blur' }
				],
				groupId: { required: true, message: '请选择分组', trigger: 'blur' },
				categoryId: { required: true, message: '请选择类型', trigger: 'blur' }
			}, //模板添加规则
			templateRules2: {
				name: [
					{ required: true, message: '请输入模板名称', trigger: 'blur' },
					{
						min: 2,
						max: 50,
						message: '长度在 2 到 50 个字符',
						trigger: 'blur'
					},
					{ validator: validateName, trigger: 'blur' }
				],
				categoryId: { required: true, message: '请选择类型', trigger: 'blur' }
			},
			curState: '', //当前保存按钮的执行的操作  parmses  SAVETEMPLATE：保存模板 、 SAVEASSEMBLE:保存组件 、 SAVEFORM : 保存私有模板
			componentsList: [], //所有的组件列表
			templateForm: [], //当前的模板内容
			currentIndex: 0, //当前高亮的index  1 开始
			isRightAttrFormShow: false, // 是否显示右侧属性栏
			dialogVisible: false, //对话框显示开关
			innerVisible: false, //内层对话框
			saveTemplateSwitch: true, //是否为另存为模板
			template: {
				//模板对话框的信息
				name: '',
				description: '',
				groupId: '', //分组
				scope: '', // 使用范围
				type: 'STANDARD',
				categoryId: 'SUBSTANCE'
			},
			customAssembly: {
				component: {
					userId: sessionStorage.userId,
					identifier: '',
					parentId: '-1',
					componentType: 'CUSTOMBOX',
					componentAttr: {
						tag: '',
						name: '',
						privateCustomWidget: false,
						imagePathCustomWidget: '',
						descriptionCustomWidget: '',
						multipleCustomWidget: false
					},
					components: []
				}
			},
			foldingSwitch: false, //是否展开所有组件  //默认 false
			fileList: [], //上传的自定义组件图标文件
			isReload: 0, //是否重新加载组件列表
			routerData: {}, //路由数据
			dialogTitle: '保存组件',
			regexpValidate: {
				NONE: '^[\\s\\S]*$',
				NUMBERS: '^[0-9]*$',
				CHINESE: '^[\\u4e00-\\u9fa5]+$',
				CHARACTERS: '^[a-zA-Z]+$',
				PHONE_NUMBER: '^1[3|4|5|8][0-9]d{4,8}$',
				EMAIL: '^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$'
			}
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
	created() {
		this.routerData.projectId = this.$route.params.projectId;
		this.routerData.tempId = this.$route.params.tempId;
		//获取模板
		if (this.routerData.tempId.length > 1) {
			this.getTemplate();
		}
	},
	watch: {
		dialogVisible(newVal) {
			if (!newVal) {
				this.fileList = [];
				this.defaultStatus();
				if (this.dialogTitle === '另存为模板') {
					this.$refs['templateRuleForm'].resetFields(); //重置校验提示
					this.template.name = '';
					this.template.description = '';
					this.template.categoryId = 'SUBSTANCE';
					//改变模板类型时获取对应的分组列表
					this.template.groupId = this.categoryIdList.filter((item) => item.id === this.template.categoryId)[0].children.filter((item) => item.label === '未分组')[0].id;
					this.groupList = this.categoryIdList.filter((item) => item.id === 'SUBSTANCE')[0].children;
				}
			}
		}
	},
	components: {
		Left, // 左边组件
		Right, //右边属性设置
		Middle, //中间表单
		Upload //文件上传
	},
	methods: {
		//一键展开或收缩组件
		collapseAssembel() {
			this.foldingSwitch = !this.foldingSwitch;
			this.templateForm = this.templateForm.map((item) => {
				if (item.componentType === 'CUSTOMBOX') {
					item.componentAttr.foldingSwitch = this.foldingSwitch;
				}
				return item;
			});
		},
		//改变是否显示右侧属性设置  index为当前点击的index
		changeisRightAttrFormShow(val, index) {
			this.currentIndex = index;
			this.isRightAttrFormShow = val;
		},
		// 复制组件
		formCopy(index) {
			this.templateForm.splice(index, 0, JSON.parse(JSON.stringify(this.templateForm[index])));
			this.changeisRightAttrFormShow(true, index + 2); //显示属性栏
		},
		//删除表单元素
		formDelete(index) {
			this.templateForm.splice(index, 1);
			this.currentIndex = 0;
			this.isRightAttrFormShow = false;
		},
		//获取选择的组件
		addComponents(data) {
			this.templateForm.push(JSON.parse(JSON.stringify(data)));
			this.currentIndex = this.templateForm.length;
			this.isRightAttrFormShow = true;
		},
		//获取分组列表
		getGroupList() {
			this.$http.templateListService.getGroupsList().then((res) => {
				this.categoryIdList = res.data;
				this.getCategoryId(this.template.categoryId);
				if (!this.template.groupId) {
					let tempData = res.data.filter((item) => item.id === this.template.categoryId);
					this.template.groupId = tempData.length ? tempData.children.filter((item) => item.label === '未分组')[0].id : '';
				}
			});
		},
		//改变模板类型时获取对应的分组列表
		getCategoryId(id) {
			let data = this.categoryIdList.filter((item) => item.id === id);
			this.groupList = data.length ? data[0].children : [];
			this.template.groupId = '';
		},
		//所有的组件列表
		getComponentsList(data) {
			this.componentsList = data;
		},
		//打开对话框
		openSaveDialog(type) {
			if (type === 'ASSEMBLE') {
				this.dialogTitle = '另存为组件';
				this.saveTemplateSwitch = false;
			}
			this.dialogTitle = type === 'FORM' ? '另存为表单模板' : this.dialogTitle;
			if (!this.templateForm.length) {
				this.$message({
					message: '组件内容不能为空',
					type: 'warning'
				});
				return;
			}
			this.dialogVisible = true;
		},
		//关闭内层对话框
		closeInnerVisible(formName) {
			this.innerVisible = false;
			this.$refs[formName].resetFields();
		},
		//确认添加分组
		confirmAddGroup(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$http.templateListService
						.addGroup(this.groupForm)
						.then((res) => {
							this.$message({
								message: '分组添加成功',
								type: 'success'
							});
							this.$emit('refreshLeft');
							this.getGroupList();
							this.closeInnerVisible('ruleForm');
						})
						.catch((err) => {
							this.$message.error('该分组名已存在,请修改名字!');
						});
				} else {
					return false;
				}
			});
		},
		//返回模板列表
		backTemplateList() {},
		//去组件编辑页面
		goAssemblyManagement() {
			this.$router.push('/assemblyEdit/0/0/PROJECT');
		},
		//发布
		releaseBtn() {
			let data = this.addRegExpRules(this.templateForm);
			let templateParams = {};
			templateParams.name = this.formTitle;
			templateParams.type = 'STANDARD';
			templateParams.projectId = this.routerData.projectId;
			templateParams.components = data;
			this.$http.templateService.releaseForms(templateParams).then((res) => {
				this.$message({
					message: '表单发布成功',
					type: 'success'
				});
			});
		},
		//组件保存验证
		saveVidilate(type) {
			this.customAssembly.component.componentAttr.imagePathCustomWidget = this.fileList.length ? this.fileList[0].url : '';
			this.customAssembly.component.componentAttr.tag = this.customAssembly.component.componentAttr.name;
			if (this.templateForm.length == 1 && this.templateForm.some((item) => item.componentType === 'CUSTOMBOX')) {
				this.customAssembly.component.components = this.templateForm[0].components;
			} else {
				this.customAssembly.component.components = this.templateForm;
			}
			// return false;
			if (!this.templateForm.length) {
				this.$message({
					message: '组件内容不能为空！',
					type: 'error'
				});
				return false;
			} else if (type !== 'save' && !this.customAssembly.component.componentAttr.tag) {
				this.$message({
					message: '组件名称不能为空！',
					type: 'error'
				});
				return false;
			} else if (type !== 'save' && this.judgeRename(this.customAssembly.component.componentAttr.name, this.customAssembly.component.identifier, this.componentsList)) {
				this.$message({
					message: '组件名称已存在，请修改名字！',
					type: 'error'
				});
				return false;
			}
			if (this.templateForm.length == 1 && this.templateForm.some((item) => item.componentType === 'CUSTOMBOX')) {
				this.customAssembly.component.components = this.addRegExpRules(this.templateForm[0].components);
			} else {
				this.customAssembly.component.components = this.addRegExpRules(this.templateForm);
			}
			return true;
		},
		//保存/修改组件/另存为模板
		saveBtn() {
			if (this.dialogTitle === '另存为组件') {
				if (!this.saveVidilate()) {
					return false;
				}
				this.$http.templateService.saveCustomAssembly(this.customAssembly).then(() => {
					this.$message({
						message: '保存成功',
						type: 'success'
					});
					this.cancelDialog();
					this.isReload++;
				});
			} else if (this.dialogTitle === '保存组件') {
				// //修改组件
				if (!this.saveVidilate('save')) {
					return false;
				}
				this.$http.templateService.editCustomAssembly(this.customAssembly).then(() => {
					this.$message({
						message: '修改成功',
						type: 'success'
					});
					this.cancelDialog();
					this.isReload++;
				});
				//另存为模板
			} else if (this.dialogTitle === '另存为模板') {
				this.$refs['templateRuleForm'].validate((valid) => {
					if (valid) {
						let data = this.addRegExpRules(this.templateForm);
						let templateParams = Object.assign(this.template, {});
						templateParams.identifier = this.routerData.tempId;
						templateParams.components = data;
						this.$http.templateService
							.saveTemplate(templateParams)
							.then((res) => {
								this.$message({
									message: '模板保存成功！',
									type: 'success'
								});
								this.cancelDialog();
							})
							.catch((err) => {
								this.$message.error('模板名称已存在!');
							});
					}
				});
				//保存模板
			} else if (this.dialogTitle === '保存模板') {
				// this.$refs['templateRuleForm'].validate((valid) => {
				//   if (valid) {
				let templateParams = Object.assign(this.template, {});
				templateParams.components = this.addRegExpRules(this.templateForm);
				if (this.routerData.tempId.length > 1) {
					//修改模板
					templateParams.identifier = this.routerData.tempId;
					this.$http.templateService
						.editTemplate(templateParams.identifier, templateParams)
						.then((res) => {
							this.$message({
								message: '模板修改成功!',
								type: 'success'
							});
							this.formAttrs.formTitle = this.template.name; //修改模板同时刷新视图
							this.getTemplate(); //刷新模板
							this.cancelDialog();
						})
						.catch((err) => {
							// this.$message.error('模板名称已存在!');
						});
				} else {
					//新建模板
					// this.$http.templateService
					//   .saveTemplate(templateParams)
					//   .then((res) => {
					//     this.$message({
					//       message: '模板保存成功！',
					//       type: 'success'
					//     });
					//     this.formAttrs.formTitle = this.template.name; //修改模板同时刷新视图
					//     this.getTemplate(); //刷新模板
					//     this.cancelDialog();
					//   })
					//   .catch((err) => {
					//     this.$message.error('模板名称已存在!');
					//   });
				}
				//   }
				// });
			}
		},
		//判断是否重名
		judgeRename(name, id, data) {
			return data.some((item) => item.componentAttr.name === name && item.id !== id);
		},
		//返回自定义组件默认状态
		defaultStatus() {
			this.customAssembly = {
				component: {
					identifier: '',
					parentId: '-1',
					componentType: 'CUSTOMBOX',
					componentAttr: {
						tag: '',
						name: '',
						privateCustomWidget: false,
						imagePathCustomWidget: '',
						descriptionCustomWidget: '',
						multipleCustomWidget: false
					},
					components: []
				}
			};
		},
		//清空内容
		clearTemplateData() {
			this.templateForm = []; //清空内容
			this.formAttrs.formTitle = '模板标题';
			this.curState = '';
		},
		cancelDialog() {
			this.dialogVisible = false;
			this.curState = '';
		},
		// 获取模板
		getTemplate() {
			this.$http.templateService.getTemplateById(this.routerData.tempId).then((res) => {
				if (res.data) {
					this.templateForm = res.data.components || [];
					this.formAttrs.formTitle = res.data.name;
					this.formAttrs.description = res.data.description;
					this.formAttrs.categoryId = res.data.categoryId;
					this.formAttrs.type = res.data.type;
					this.formAttrs.scope = res.data.scope;
					this.formAttrs.groupId = res.data.groupId;
					// this.template.name = res.data.name;
					this.template.categoryId = res.data.categoryId;
					// this.template.scope = res.data.scope;
					this.template.groupId = res.data.groupId;
					// this.template.type = res.data.type;
					// this.template.description = res.data.description;
					this.getGroupList(); //初始化分组列表
				} else {
					this.$message.error('很抱歉，没有找到对应模板!');
				}
			});
		},
		//保存按钮
		saveTemplate() {
			if (this.routerData.projectId.length > 1) {
				//保存私有模板(表单)
				this.dialogTitle = '保存表单模板';
				this.saveTemplateSwitch = true;
				this.saveBtn();
				// this.openSaveDialog();
			} else {
				//保存模板
				if (!this.templateForm.length) {
					this.$message({
						message: '模板内容不能为空!',
						type: 'warning'
					});
					return;
				}
				this.dialogTitle = '保存模板';
				this.template.name = this.formAttrs.formTitle;
				this.template.type = this.formAttrs.type;
				this.template.groupId = this.formAttrs.groupId;
				this.template.categoryId = this.formAttrs.categoryId;
				this.template.scope = this.formAttrs.scope || 'PUBLIC';
				this.template.description = this.formAttrs.description;
				this.saveTemplateSwitch = true;
				this.saveBtn();
				// this.openSaveDialog();
			}
		},
		//另存为模板
		saveToTemplate() {
			if (!this.templateForm.length) {
				this.$message({
					message: '模板内容不能为空!',
					type: 'warning'
				});
				return;
			}
			this.saveTemplateSwitch = true;
			this.dialogTitle = '另存为模板';
			this.dialogVisible = true;
			this.template.scope = this.formAttrs.scope || 'PUBLIC';
		},
		//预览模板
		previewTemplate() {
			//保存模板
			let data = this.addRegExpRules(this.templateForm);
			let templateParams = {};
			templateParams.name = this.formAttrs.formTitle;
			templateParams.type = 'STANDARD';
			templateParams.components = data;
			const {identifier, tempId} = this.routerData
			this.$http.templateService.previewTemplate(tempId,{components:templateParams.components}).then((res) => {
				this.$router.push(`/templatePreview/${res.data}/0/view/template`);
			});
		},
		//改变标题
		changeTitle(val) {
			// if (this.curState === 'SAVEASSEMBLE') {
			//   //修改组件信息
			//   this.isRightAttrFormShow = true;
			//   this.formAttrs.isShowAssemblyAttr = true;
			// } else {
			//   //修改模板信息
			//   this.formAttrs.isShowFormAttr = true;
			//   this.isRightAttrFormShow = false;
			// }
			this.currentIndex = 0;
			this.formTitle = val;
			this.isRightAttrFormShow = false;
		},
		//添加正则规则
		addRegExpRules(data) {
			data.forEach((ele) => {
				if (ele.componentType === 'CHECKBOX' || ele.componentType === 'RADIOBOX' || ele.componentType === 'TEXTBOX') {
					ele.componentAttr.inputModle.regex = this.regexpValidate[ele.componentAttr.inputModle.inputType];
				}
			});
			return data;
		}
	}
};
</script>
<style scopeed>
header {
	width: 100%;
	height: 76px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: rgba(52, 58, 69, 1);
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
	background: #fff;
	border-left: 1px solid #dde5ed;
	padding: 20px 15px 20px 15px;
	transition: right 0.3s;
}
.templateWarp-box .right.attrShow {
	right: 0;
}

.top-btn {
	display: flex;
	/* width: 420px; */
	height: 32px;
	margin-right: 50px;
	justify-content: space-around;
}
.project-name {
	float: left;
	margin-left: 15px;
	font-size: 22px;
	color: #fff;
}
</style>
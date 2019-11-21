<template>
  <el-scrollbar :style="{height:(winHeight-76) +'px'}">
    <div class="left">
      <div class="basicComponents components">
        <h6 class="box-title">
          <span>基础组件</span>
        </h6>
        <ul @click.stop='getComponents' class="components-box basic-components" v-loading="loading1">
          <li v-for='(item,i) of basicComponents' :key='i' :data-index='item.identifier'>
            <i :class="componentsIcon(item.componentType)" class="iconfont" :data-index='item.identifier'>
              {{item.componentAttr.name}}</i>
          </li>
        </ul>
      </div>
      <div class="complicatedComponents components">
        <h6 class="box-title red-title">
          <span>高级组件</span>
        </h6>
        <ul @click.stop='getComponents' class="components-box complicatedComponents-box" v-loading="loading2">
          <li v-for='(item,i) of complicatedComponents' :key='i' :data-index='item.identifier'>
            <i :class="componentsIcon(item.componentType)" class="iconfont" :data-index='item.identifier'>
              {{item.componentAttr.name}}</i>
          </li>
        </ul>
      </div>
      <div class="customComponents components">
        <h6 class="box-title orange-title">
          <span>自定义组件</span>
          <el-tooltip class="item" effect="dark" content="保存组件排序" placement="right">
            <i class="iconfont icon-baocun" @click='saveFolderSort'></i>
          </el-tooltip>
        </h6>
        <div class="custom-compoments"  v-loading="loading3">
          <div class="folder-box">
            <el-tree :data="folderAssemblyData" node-key="id" empty-text='' draggable :expand-on-click-node='false' :props="defaultProps"
              :allow-drop="allowDrop" :allow-drag="allowDrag">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <el-tooltip class="item" effect="light" placement="right-start" >
                  <div slot="content" style="width:200px;">
                    <p>名字 : {{node.label.folderName || node.label.name}}</p>
                    <p v-show='node.label.folderDescription || node.label.descriptionCustomWidget'> 描述 : {{node.label.folderDescription || node.label.descriptionCustomWidget}}</p>
                  </div>
                  <span class="el-tree-node__label" @dblclick="getCustomAssemblyData(data)">{{ node.label.folderName || node.label.tag}}</span>
                </el-tooltip>
                <el-dropdown class="dropdown-box" @command="handleCommand"    v-if='data.componentType === "CUSTOMBOX"'>
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item :command='{type:"EDITASSEMBLYCONTENT",id:data.identifier}'>修改</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </el-tree>
          </div>
          <div class="custom-component_box">
            <el-tree :data="withoutFolderAssemblyData" empty-text='' node-key="id" draggable :props="defaultProps"
              :expand-on-click-node='false' :allow-drop="allowDrop" :allow-drag="allowDrag">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <el-tooltip class="item" effect="light" placement="right-start">
                  <div slot="content" style="width:200px;">
                    <p>名字 : {{node.label.folderName || node.label.tag}}</p>
                    <p v-show='node.label.folderDescription || node.label.descriptionCustomWidget'> 描述 : {{node.label.folderDescription || node.label.descriptionCustomWidget}}</p>
                  </div>
                  <span class="el-tree-node__label" @dblclick="getCustomAssemblyData(data)">{{node.label.folderName || node.label.tag}}</span>
                </el-tooltip>
                <el-dropdown class="dropdown-box" @command="handleCommand"   v-if='data.componentType === "CUSTOMBOX"'>
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command='{type:"EDITASSEMBLYCONTENT",id:data.identifier,data:data}'>修改</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <!-- 新增和编辑文件夹 -->
      <el-dialog :title='folderDialogTitle === "ADD" ? "新增文件夹" : "编辑文件夹"' :visible.sync="folderDialogVisible" width="35%"
        :close-on-click-modal='false'>
        <el-form label-position="top" label-width="80px" :model="folderForm" ref='folderForm' :rules="folderFormRules">
          <el-form-item label="文件夹名称" prop='folderName'>
            <el-input v-model="folderForm.folderName" size='medium' clearable></el-input>
          </el-form-item>
          <el-form-item label="文件夹描述">
            <el-input v-model="folderForm.folderDescription" type='textarea' size='medium' clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveFileBtn('folderForm')">保 存</el-button>
          <el-button @click="folderDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 编辑组件属性 -->
      <el-dialog title='修改属性' :visible.sync="assemblyDialogVisible" width="35%" :close-on-click-modal='false'>
        <span slot="footer" class="dialog-footer">
          <el-button @click="assemblyDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="saveAssemblyBtn('')">保 存</el-button>
        </span>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>
<script>
export default {
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
				folderName: '',
				folderDescription: '',
				applyingModelType: '' //文件夹类型  PROJECT为物质  ， REPORT 为项目报告 。 ....很无语
			},
			folderFormRules: {
				folderName: { required: true, message: '请输入文件夹名称', trigger: 'blur' }
			},
			folderDialogVisible: false, //文件夹弹框
			folderDialogTitle: 'ADD', //文件夹弹框标题   ADD : 新增  EDIT : 编辑
			checkFolderId: '', //当前选中的文件夹id
			assemblyDialogVisible: false, //组件弹框
			assemblyRelationDialogVisible: false,
			folderAssemblyData: [],
			withoutFolderAssemblyData: [],
			defaultProps: {
				children: 'components',
				label: 'componentAttr',
				id: 'identifier'
			}
		};
	},
	props: ['isReload'],
	watch: {
		isReload(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.getComponentsList();
			}
		},
		//监听文件夹弹框关闭
		folderDialogVisible(val) {
			if (!val) {
				this.$refs['folderForm'].resetFields();
				this.folderForm.folderName = '';
				this.folderForm.folderDescription = '';
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
		}
	},
	created() {
		//初始化组件列表
		this.getComponentsList();
		this.folderForm.applyingModelType = this.$route.params.applyingModelType; //组件类型
	},
	methods: {
		allowDrop(draggingNode, dropNode, type) {
			if (dropNode.data.componentType === 'FOLDER' && draggingNode.data.componentType === 'FOLDER' && type !== 'inner') {
				return true;
			}
			return type !== 'inner' && dropNode.data.parentId === draggingNode.data.parentId && draggingNode.data.identifier !== dropNode.data.identifier;
		},
		allowDrag(draggingNode) {
			return true;
		},
		//组件操作
		handleCommand(command) {
			switch (command.type) {
				//修改组件
				case 'EDITASSEMBLYCONTENT': {
					this.$router.push(`/assemblyEdit/${command.id}/0/PROJECT`);
					break;
				}
			}
		},
		//保存组件和文件夹排序
		saveFolderSort() {
			let params = {
				folders: JSON.parse(JSON.stringify(this.folderAssemblyData)),
				withoutFoldercomponents: JSON.parse(JSON.stringify(this.withoutFolderAssemblyData))
			};
			this.$http.templateService.saveFolderSort(params).then((res) => {
				this.$message({
					message: '组件排序已保存',
					type: 'success'
				});
			});
		},
		//组件图标
		componentsIcon(type) {
			switch (type) {
				case 'TEXTBOX':
					return 'icon-tiankongti';
				case 'RADIOBOX':
					return 'icon-danxuan';
				case 'CHECKBOX':
					return 'icon-duoxuan';
				case 'COMBOBOX':
					return 'icon-xiala';
				case 'ADDRESSBOX':
					return 'icon-dizhi';
				case 'IMAGEBOX':
					return 'icon-shangchuantupian';
				case 'FILEBOX':
					return 'icon-shangchuanwenjian';
				case 'VIDEO':
					return 'icon-shipinshangchuan';
				case 'CASCADER':
					return 'icon-riqi1';
				case 'DATEPICKER':
					return 'icon-duojixiala';
			}
		},
		//获取组件列表
		getComponentsList() {
			this.getBasicComponents();
			this.getComplicatedComponents();
			this.getCustomComponents();
		},
		//获取基础组件
		getBasicComponents() {
			this.$http.templateService.getBasicComponents().then((res) => {
				this.basicComponents = res.data;
				this.loading1 = false;
			});
		},
		//获取高级组件
		getComplicatedComponents() {
			this.$http.templateService.getComplicatedComponents().then((res) => {
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
			this.$http.templateService.getCustomComponents(params).then((res) => {
				this.folderAssemblyData = res.data.folders;
				this.withoutFolderAssemblyData = res.data.withoutFoldercomponents;
				this.loading3 = false;
				this.$emit('foldersLists', res.data.folders.map((item) => ({ value: item.componentAttr.identifier, label: item.componentAttr.folderName })));
			});
		},
		//获取选择的组件
		getComponents(e) {
			if (e.target.tagName === 'LI' || e.target.tagName === 'I' || e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
				let param = this.componentsData.filter((item) => item.identifier === e.target.getAttribute('data-index'));
				this.$emit('addComponents', JSON.parse(JSON.stringify(param[0])));
			}
		},
		//获取选择的自定义组件
		getCustomAssemblyData(data) {
			data.componentType === 'CUSTOMBOX' && this.$emit('addComponents', JSON.parse(JSON.stringify(data)));
		}
	}
};
</script>
<style scoped>
.left {
	width: 228px;
	height: 100%;
	padding: 15px 10px 15px 10px;
	border-right: 1px solid rgba(213, 224, 237, 1);
}

.basic-components {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	min-height: 240px;
}

.custom-compoments {
	min-height: 400px;
	margin-top: 15px;
}
.complicatedComponents-box {
	min-height: 36px;
}
.components-box li {
	width: 96px;
	height: 34px;
	border: 1px solid #cfd7e5;
	border-radius: 4px;
	color: #5d687a;
	font-size: 14px;
	line-height: 34px;
	text-indent: 10px;
	margin-top: 10px;
	cursor: pointer;
	position: relative;
}

li.custonComponents-list {
	width: 100%;
}

.components-box li:hover {
	border-color: #26beff;
	color: #26beff;
}

.box-title {
	font-size: 15px;
	display: flex;
	align-items: center;
}

.box-title::before {
	content: '';
	display: inline-block;
	width: 2px;
	height: 16px;
	position: relative;
	left: -10px;
	background: #1d7fff;
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
	color: #fff;
	background: rgba(38, 190, 255, 1);
	font-size: 14px;
	padding: 2px 3px 3px;
	border-radius: 4px;
	margin-left: 107px;
	cursor: pointer;
}

.components-box i {
	font-size: 14px;
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

.custom-compoments >>> .el-tree-node__content {
	border: 1px solid rgba(213, 224, 237, 1);
	margin-top: 5px;
	height: 36px;
	font-weight: bold;
	border-radius: 5px;
	font-family: '微软雅黑';
}

.custom-compoments >>> .el-tree-node__content:hover {
	background: rgba(235, 247, 255, 1);
	border: 1px solid rgba(38, 190, 255, 1);
}

.dropdown-box {
	margin-right: 10px;
	height: 38px;
	line-height: 38px;
}

.dropdown-box:hover .el-icon-more {
	color: #26beff;
}

.custom-compoments >>> .custom-tree-node {
	font-size: 13px;
	color: #3c4551;
	display: flex;
	width: 100%;
	height: 38px;
	align-items: center;
	justify-content: space-between;
}

.custom-compoments >>> .custom-tree-node .el-tree-node__label {
	font-size: 13px;
	flex-grow: 1;
	width: 100px;
	margin-right: 5px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.folder-box >>> .el-tree-node__children .el-tree-node__content,
.custom-component_box >>> .el-tree-node__content {
	background: #e6f0fc;
	font-weight: normal;
}

.folder-box >>> .is-current > .el-tree-node__content,
.custom-component_box >>> .is-current > .el-tree-node__content {
	background: rgba(235, 247, 255, 1);
	border: 1px solid rgba(38, 190, 255, 1);
}

.folder-box >>> .is-current > .el-tree-node__content > .custom-tree-node,
.custom-compoments >>> .is-current > .el-tree-node__content .el-tree-node__expand-icon {
	color: #26beff;
}

.folder-box >>> .is-current > .el-tree-node__content > .el-tree-node__expand-icon.is-leaf,
.custom-component_box >>> .is-current > .el-tree-node__content > .el-tree-node__expand-icon.is-leaf {
	color: transparent;
	cursor: default;
}

.custom-compoments >>> .el-tree__drop-indicator {
	display: none;
}

/* .custom-compoments>>>.el-tree-node__children .is-current>.el-tree-node__content {
    background: rgba(38, 190, 255, 1);
  }
  .custom-compoments>>>.el-tree-node__children .is-current>.el-tree-node__content {
    background: rgba(38, 190, 255, 1);
  } */
</style>
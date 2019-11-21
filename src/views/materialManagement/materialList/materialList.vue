<template>
    <div class="content-warp">
        <div class="regulation-tb">
        <el-row>
          <el-col class="box" :span='4'>
            <div class="box" style="height:80vh;background:#fff">
              <el-input
                placeholder="输入关键字进行过滤"
                size="mini"
                v-model="filterTree">
              </el-input>
              <div style="height:10px;"></div>
              <el-tree
                :data="materialTypeTree"
                accordion
                default-expand-all
                ref="tree"
                :props="{id:'id',label:'name',children:'subclass'}"
                :filter-node-method="filterNode"
                :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span class="tree-name" @click='getDataList(data.id)'>{{ node.label }}</span>
                  &nbsp;&nbsp;
                  <span>
                    <el-dropdown trigger="click" @command="handleCommand">
                      <i class='el-icon-more'></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item  command='createNewMaterialType' :data='data'>创建类别</el-dropdown-item>
                        <el-dropdown-item  command='editMaterialType' :data='data'>重命名</el-dropdown-item>
                        <el-dropdown-item v-if="data.substanceCategoryType!=='SUBSTANCE_CATEGORY'" command='editMaterialTypeTempalte' :data='data'>绑定模板{{data.templateId?'(已绑定)':''}}</el-dropdown-item>
                        <el-dropdown-item v-if="data.applicationType!=='SYSTEM'" command='deleteMaterialType' :id='data.id'>删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                </span>
              </el-tree>  
            </div>
          </el-col>
          <el-col class="box" :span='20'>
              <div class="search-box">
                  <el-form :model="form" label-width="70px">
                      <el-row type="flex" class="search-row" justify="start">
                          <div>
                              <el-form-item label="物质名称">
                                  <el-input v-model="form.name" size="medium" clearable></el-input>
                              </el-form-item>
                          </div>
                          <div>
                              <el-form-item label="生产厂家">
                                  <el-input v-model="form.manufacturer" size="medium" clearable></el-input>
                              </el-form-item>
                          </div>
                          <div>
                              <el-form-item label="CAS NO">
                                  <el-input v-model="form.casNo" size="medium" clearable></el-input>
                              </el-form-item>
                          </div>
                          <div>
                              <el-form-item label="规格型号">
                                  <el-input v-model="form.model" size="medium" clearable></el-input>
                              </el-form-item>
                          </div>
                          <div>
                            <el-button type="primary" size="medium"  icon="el-icon-search" round @click="getDataList()">搜索</el-button>
                            <el-button type="success" size="medium" class="entry-btn" icon="el-icon-plus" round @click="createNewMaterial">新增</el-button>
                          </div>
                      </el-row>
                  </el-form>
              </div>
              <el-table :data="dataList">
               <el-table-column label="序号" type="index"></el-table-column>
               <el-table-column v-for="(item,index) in title" :key="index" :label="item.value" :prop="item.key">
                 <template slot-scope="scope">
                   <span v-html="item.key==='formula'?translateFormula(scope.row[item.key]): item.key==='category'?scope.row.category.name:scope.row[item.key]"></span>
                  
                 </template>
               </el-table-column>
               <el-table-column label="操作" width="180" fixed="right">
                 <template slot-scope="scope">
                   <div class="operation-icon">
                      <i class="iconfont icon-chakan icon-edit" @click="openMaterialWindow(scope.row.id,scope.row.templateId,'view')">查看</i>
                      <i class="iconfont icon-xiugai icon-edit" @click="editMaterial(scope.row)">编辑</i>
                      <i class="iconfont icon-shanchu icon-edit" @click="doDeleteMaterial(scope.row.id)">删除</i>
                    </div>
                 </template>
               </el-table-column>
              </el-table>
              <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage" ></pagniation>
          </el-col>
        </el-row>
        <el-dialog
              width="50%"
              title="模板选择"
              :visible.sync="dialogTemplateBox"
              append-to-body>
              <el-table :data="materialTemplate">
               <el-table-column prop="name" label="模板名称"></el-table-column>
               <el-table-column prop="createBy" label="创建人"></el-table-column>
               <el-table-column prop="remark" label="备注"></el-table-column>
               <el-table-column label="操作" width="150" fixed="right">
                 <template slot-scope="scope">
                    <div class="operation-icon">
                      <i class="iconfont icon-chakan icon-edit" @click="openWindow(scope.row.id,'view')">查看</i>
                      <i class="iconfont icon-xiugai icon-edit" @click="bindMaterial(scope.row.id);doSaveMaterialTemplate()">{{materialType.templateId===scope.row.id?'解绑':'绑定'}}</i>
                    </div>
                 </template>
               </el-table-column>
              </el-table>
              <pagniation :totalPage="tTotalPage" :currentPage='formMaterialType.current' :totalNum="tTotalNum" @changePage="tHandleChangePage" ></pagniation>
            <div style="padding:.5em;text-align:center;">
              <el-button type="info" @click="dialogTemplateBox=false;">关闭</el-button>
              <!-- <el-button type="primary" @click="doSaveMaterialTemplate">确定</el-button> -->
            </div>
        </el-dialog>
        <el-dialog :title="curId===''?'新建物质类别':'编辑物质类别'" :visible.sync="dialogMaterialType" width="30%">
           <el-dialog
              width="50%"
              title="模板选择"
              :visible.sync="dialogTemplate"
              append-to-body>
              <el-table :data="materialTemplate">
               <el-table-column prop="name" label="模板名称"></el-table-column>
               <el-table-column prop="createBy" label="创建人"></el-table-column>
               <el-table-column prop="remark" label="备注"></el-table-column>
               <el-table-column label="操作" wdith="150" fixed="right">
                 <template slot-scope="scope">
                    <div class="operation-icon">
                      <i class="iconfont icon-chakan icon-edit" @click="openWindow(scope.row.id,'view')">查看</i>
                      <i class="iconfont icon-xiugai icon-edit" @click="bindMaterial(scope.row.id)">{{materialType.templateId===scope.row.id?'解绑':'绑定'}}</i>
                    </div>
                 </template>
               </el-table-column>
              </el-table>
              <pagniation :totalPage="tTotalPage" :currentPage='formMaterialType.current' :totalNum="tTotalNum" @changePage="tHandleChangePage" ></pagniation>
            <div style="padding:.5em;text-align:center;">
              <el-button type="info" @click="dialogTemplate=false">关闭</el-button>
              <!-- <el-button type="primary" @click="dialogTemplate=false">确定</el-button> -->
            </div>
            </el-dialog>
          <el-form :model="materialType" ref="materialType" :rules="{name:{required:true,message:'必填'}}">
              <el-form-item label="物质名称" prop="name">
                <el-input v-model="materialType.name"></el-input>
              </el-form-item>
              <el-form-item v-if="curId===''" label="物质模板" prop="templateId">
                <span>{{materialType.templateName}}</span> &nbsp;&nbsp;&nbsp;&nbsp;
                <el-button @click="showTemplateBox">选择模板</el-button>
              </el-form-item>
              <el-form-item style="text-align:right">
                <el-button type="primary" @click="doSaveMaterialType">确定</el-button>
                <el-button type="info" @click="dialogMaterialType=false">取消</el-button>
              </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog :title="curId===''?'新建物质':'编辑物质'" :visible.sync="dialogVisible" width="30%">
            <el-form :model="material" ref="material" :rules="chooseRule">
              <el-form-item label="物质类别" prop="materialType">
                <!-- 下拉框的树 -->
                <treeselect 
                v-model="material.categoryId" 
                placeholder="请选择" 
                noOptionsText="没有数据"
                :default-expand-level="3"
                @select="getSubstanceCategoryType"
                :options="materialTypeTree"
                :normalizer="getMaterialTreeSet"/>
              </el-form-item>
              <el-form-item label="物质名称" prop="name">
                <el-input v-model="material.name" maxlength="32"></el-input>
              </el-form-item>
              <el-form-item label="CAS NO" prop="casNo" v-if="categoryType==='CHEMISTRY_SINGLE'">
                <el-input v-model="material.casNo" maxlength="32"></el-input>
              </el-form-item>
              <el-form-item label="分子式" prop="formula" v-if="categoryType==='CHEMISTRY_SINGLE'">
                <el-input v-model="material.formula" maxlength="32">
                  <template slot="append">
                    <span v-html="translateFormula(material.formula)"></span>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="分成/组成信息" prop="compositions" v-if="categoryType==='CHEMISTRY_MIXTURE'">
                 <el-button @click="addComponents" size="mini">添加</el-button>
                  <el-table :data="material.compositions">
                    <el-table-column label="中文名称">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.cnName" size="mini"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="英文名称">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.enName" size="mini"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="CAS NO">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.casNo" size="mini"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="比例">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.proportion" size="mini"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column width="50">
                      <template slot-scope="scope">
                      <div class="operation-icon">
                        <i class="iconfont icon-shanchu" title="删除" @click="deleteComposition(scope.$index)"></i>
                      </div></template>
                    </el-table-column>
                  </el-table>
              </el-form-item>
              <el-form-item label="生产厂家" prop="manufacturer" v-if="categoryType==='CHEMISTRY_MIXTURE'">
                <el-input v-model="material.manufacturer"  maxlength="100"> </el-input>
              </el-form-item>
              <el-form-item label="规格型号" prop="model" v-if="categoryType==='CHEMISTRY_MIXTURE'">
                <el-input v-model="material.model" maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input  
                  type="textarea" 
                  v-model="material.remark" 
                  maxlength="100"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入备注">
                </el-input>
              </el-form-item>
              <el-form-item style="text-align:right">
                <el-button type="primary" @click="doSaveMaterial">{{curId?'下一步':'确定'}}</el-button>
                <el-button type="info" @click="dialogVisible=false;getDataList(form.categoryId)">取消</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="重复物质" :visible.sync="dialogRepeatVisible" width="50%">
          <el-table :data="repeatData">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="name" label="物质名称"></el-table-column>
            <el-table-column label="物质类别">
              <template><span>混合物质</span></template>
            </el-table-column>
            <el-table-column prop="manufacturer" label="生产厂家"></el-table-column>
            <el-table-column prop="model" label="规格型号"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <div class="operation-icon">
                        <i class="iconfont icon-chakan icon-edit" @click="openMaterialWindow(scope.row.id,scope.row.templateId,'view')">查看</i>
                        <i class="iconfont icon-xiugai icon-edit" @click="editMaterial(scope.row)">编辑</i>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="padding:.5em; text-align:center;">
            <el-button type="info" @click="dialogRepeatVisible=false" size="mini">取消</el-button>
            <el-button type="primary" @click="doCreateMaterialForce" size="mini">继续新增</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>
<script>
import highlightWords from '@/components/tools/HighlightWords.vue';
import pagniation from '@/components/tools/Pagniation.vue';
import preview from '@/components/tools/Preview.vue';
import { getTitle } from './defaultTitle.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'substanceList',
  components: { Treeselect, highlightWords, pagniation, preview },
  data() {
    return {
      filterTree: '',
      formMaterialType: {
        id: '',
        pageSize: 30,
        current: 0
      },
      form: {
        categoryId: '',
        name: '',
        pageSize: 30,
        current: 0
      },
      dialogVisible: false,
      dialogMaterialType: false,
      dialogTemplate: false,
      dialogTemplateBox: false,
      dialogRepeatVisible: false,
      curId: '',
      title: [],
      rules: {
        one: {
          category: { required: true, message: '必填' },
          name: { required: true, message: '必填' },
          casNo: { required: true, message: '必填' },
          formula: [
            {
              required: true,
              message: '必填'
            },
            {
              validator: this.checkFormula,
              trigger: 'blur'
            }
          ]
        },
        two: {
          category: { required: true, message: '必填' },
          name: { required: true, message: '必填' },
          compositions: [
            { required: true, message: '必填' },
            {
              validator: this.checkCompositions,
              trigger: 'blur'
            }
          ]
        },
        three: {
          category: { required: true, message: '必填' },
          name: { required: true, message: '必填' }
        }
      },
      categoryType: '',
      material: {}, //物质
      materialType: {}, //物质类别
      curMaterialType: {}, //选中的物质类别
      dataList: [], //table数据
      totalPage: 0,
      tTotalNum: 0,
      tTotalPage: 0,
      totalNum: 0,
      chooseRule: {},
      repeatData: [],
      materialTypeTree: [], //物质类别树
      materialTemplate: [] //物质模板
    };
  },
  activated() {
    this.getDataList();
    this.getMaterialTypeList();
  },
  watch: {
    filterTree(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    /**
     * 校验compositions
     */
    checkCompositions(rule, value, callback) {
      if (value.length < 2) {
        callback(new Error('最少两条数据'));
      }
      if (value) {
        let list = value.filter((item) => {
          if (!item.cnName || !item.proportion) {
            return item;
          }
        });
        if (list.length > 0) {
          callback(new Error('中文名称和比例必须填写'));
        }
        callback();
      }
    },
    /**
     * 获取rule
     */
    getRules() {
      if (this.material.substanceCategoryType === 'CHEMISTRY_SINGLE') {
        this.categoryType = 'CHEMISTRY_SINGLE';
        this.chooseRule = this.rules.one;
      } else if (this.material.substanceCategoryType === 'CHEMISTRY_MIXTURE') {
        this.categoryType = 'CHEMISTRY_MIXTURE';
        this.chooseRule = this.rules.two;
      } else {
        this.categoryType = 'OTHER';
        this.chooseRule = this.rules.three;
      }
    },
    deleteComposition(index) {
      // console.log(scope);
      this.material.compositions.splice(index, 1);
    },
    /**
     * 添加物质分成成分
     */
    addComponents() {
      this.material.compositions = this.material.compositions || [];
      this.material.compositions.push({
        cnName: '',
        enName: '',
        casNo: '',
        proportion: ''
      });
    },
    /**
     * 检查分子式
     */
    checkFormula(rule, value, callback) {
      let reg = /[^0-9A-Za-z.]/g;
      if (reg.test(value)) {
        callback(new Error('分子式只能输入数字，字母和英文的点'));
      }
      if (value.trim() === '') {
        callback(new Error('不能为空'));
      }
      callback();
    },
    /**
     * 获取物质类型
     */
    getSubstanceCategoryType(node) {
      this.material.substanceCategoryType = node.substanceCategoryType;
      this.getRules();
    },
    /**
     * 翻译forMula
     */
    translateFormula(formula) {
      if (!formula) {
        return '';
      } else {
        let reg = /[a-zA-Z](\d+)/g;
        let list = formula.match(reg);
        if (!list) {
          return formula;
        }
        let result = formula;
        list.map((e) => {
          let first = e.substr(0, 1);
          let num = e.split(first)[1];
          let domNum = '<sub>' + num + '</sub>';
          result = result.replace(e, first + domNum);
        });
        return result;
      }
    },
    /**
     * 打开新窗口
     */
    openWindow(tempId = 0, action) {
      let localPath =
        location.href.split(this.$route.path)[0] +
        '/templateEdit/' +
        0 +
        '/' +
        tempId +
        '/' +
        action;
      window.open(localPath);
    },
    openMaterialWindow(materialId, tempId, action) {
      // `templatePreview/${projectId}/${tempId}/edit`
      if (action === 'view') {
        let localPath =
          location.href.replace(this.$route.path, '') +
          '/printPreviewForm/' +
          materialId;
        window.open(localPath);
      } else {
        let localPath =
          location.href.split(this.$route.path)[0] +
          '/templatePreview/' +
          materialId +
          '/' +
          tempId +
          '/' +
          action;
        window.open(localPath);
      }
    },
    /**
     * formatter table
     */
    formatter(row, column) {
      if (column.property === 'category') {
        return row.category.name;
      } else if (column.property === 'formula') {
        return this.translateFormula(row.formula);
      } else {
        return row[column.property];
      }
    },
    /**
     * 展示模板box
     */
    showTemplateBox() {
      this.dialogTemplate = true;
    },
    /**
     * 获取模板
     */
    getMaterialTemplateList() {
      this.formMaterialType.id = this.materialType.templateId;
      this.$http.materialService
        .getMaterialTemplateUnbindList(this.formMaterialType)
        .then((res) => {
          this.materialTemplate = res.data.content;
          this.tTotalPage = res.data.totalPages;
          this.tTotalNum = res.data.totalElements;
        });
    },
    /**
     * 获取树设置
     */
    getMaterialTreeSet(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.subclass
      };
    },
    /**
     * 创建新的物质
     */
    createNewMaterial() {
      this.dialogVisible = true;
      this.curId = '';
      this.material = {
        name: '',
        casNo: '',
        formula: '',
        compositions: [],
        remark: '',
        manufacturer: '',
        model: '',
        substanceCategoryType: ''
      };
      this.getRules();
    },
    /**
     * 创建新的物质类别
     */
    createNewMaterialType(data) {
      this.dialogMaterialType = true;
      this.curMaterialType = data;
      this.curId = '';
      this.materialType = {
        name: '',
        rankType: 'CUSTOM',
        parentId: data.id,
        substanceCategoryType: 'OTHER',
        templateId: ''
      };
      this.getMaterialTemplateList();
    },
    /**
     * 绑定模板
     */
    bindMaterial(id) {
      if (id === this.materialType.templateId) {
        this.materialType.templateId = '';
      } else {
        this.materialType.templateId = id;
      }
    },
    /**
     * 获取模板名称
     */
    getTemplateName() {
      if (this.materialType.templateId === '') {
        return '无';
      }
      return this.materialTemplate.find((e) => {
        e.id === this.materialType.templateId;
      }).name;
    },
    /**
     * 编辑物质
     */
    editMaterial(item) {
      this.curId = item.id;
      this.material = item;
      this.material.categoryId = item.category.id;
      this.material.substanceCategoryType = item.category.substanceCategoryType;
      this.getRules();
      this.dialogVisible = true;
      this.dialogRepeatVisible = false;
    },
    /**
     * 编辑物质类别
     */
    editMaterialType(item) {
      this.curId = item.id;
      this.materialType = item;
      this.dialogMaterialType = true;
      this.getMaterialTemplateList();
    },
    /**
     * 编辑物质类别模板
     */
    editMaterialTypeTempalte(item) {
      this.curId = item.id;
      this.materialType = item;
      this.dialogTemplateBox = true;
      this.getMaterialTemplateList();
    },
    /**
     * 过滤节点
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /**
     * 命令控制
     */
    handleCommand(method, target) {
      this[method](target.$attrs.id || target.$attrs.data);
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    //分页组件改变页码
    tHandleChangePage(page) {
      this.formMaterialType.pageSize = page.pageSize;
      this.formMaterialType.current = page.currentPage - 1;
      this.getMaterialTemplateList();
    },
    /**
     * 获取material列表
     */
    getDataList(id = '') {
      this.form.categoryId = id;
      this.$http.materialService.getMaterialList(this.form).then((res) => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
        this.title = getTitle(this.dataList[0]);
      });
    },
    /**
     * 获取materialType列表
     */
    getMaterialTypeList() {
      this.$http.materialService.getMaterialTypeList({}).then((res) => {
        this.materialTypeTree = this.reloadMaterialType(res.data);
      });
    },
    /**
     * 过滤subclass为空
     */
    reloadMaterialType(data) {
      let result = [];
      data.map((item) => {
        let {
          id,
          name,
          rankType,
          parentId,
          substanceCategoryType,
          applicationType,
          subclass,
          templateId
        } = item;
        if (subclass.length > 0) {
          result.push({
            id: id,
            name: name,
            rankType: rankType,
            applicationType: applicationType,
            parentId: parentId,
            substanceCategoryType: substanceCategoryType,
            templateId: templateId,
            subclass: this.reloadMaterialType(subclass)
          });
        } else {
          result.push({
            id: id,
            name: name,
            rankType: rankType,
            applicationType: applicationType,
            parentId: parentId,
            substanceCategoryType: substanceCategoryType,
            templateId: templateId
          });
        }
      });
      return result;
    },
    /**
     * 获取重复的物质
     */
    getRepeatDataList() {
      this.$http.materialService
        .getMaterialList({
          pageSize: 1000,
          current: 0,
          categoryId: this.material.categoryId,
          manufacturer: this.material.manufacturer,
          model: this.material.model,
          name: this.material.name
        })
        .then((res) => {
          this.repeatData = res.data.content;
        });
    },
    /**
     * 执行保存物质类别
     */
    doSaveMaterialType() {
      if (!this.checkForm('materialType')) {
        return;
      }
      if (!this.curId) {
        this.doCreateMaterialType();
      } else {
        this.doUpdateMaterialTypeName();
      }
    },
    /**
     * 保存物质
     */
    doSaveMaterial() {
      if (!this.checkForm('material')) {
        return;
      }
      if (!this.curId) {
        this.doCreateMaterial();
      } else {
        this.doUpdateMaterial();
      }
    },
    checkForm(formName) {
      let flag = false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          return false;
        }
      });
      return flag;
    },
    /**
     * 创建物质
     */
    doCreateMaterial() {
      this.material.force = false;
      this.$http.materialService
        .createMaterial(this.material)
        .then((res) => {
          this.dialogVisible = false;
          this.$message.success('添加成功');
          this.openMaterialWindow(res.data.id, res.data.templateId, 'edit');
          this.getDataList();
        })
        .catch((e) => {
          if (e.data.status === 100004) {
            this.dialogRepeatVisible = true;
            this.getRepeatDataList();
          }
        });
    },
    /**
     * 强行新增物质
     */
    doCreateMaterialForce() {
      this.material.force = true;
      this.$http.materialService.createMaterial(this.material).then((res) => {
        this.dialogRepeatVisible = false;
        this.dialogVisible = false;
        this.$message.success('添加成功');
        this.openMaterialWindow(res.data.id, res.data.templateId, 'edit');
        this.getDataList();
      });
    },
    /**
     * 执行保存模板绑定操作
     */
    doSaveMaterialTemplate() {
      this.$http.materialService
        .updateMaterialTemplate(this.curId, this.materialType)
        .then(() => {
          // this.dialogTemplateBox = false;
          this.$message.success('修改成功');
          this.getMaterialTypeList();
        });
    },
    /**
     * 执行修改物质
     */
    doUpdateMaterial() {
      this.$http.materialService
        .updateMaterial(this.curId, this.material)
        .then(() => {
          this.dialogVisible = false;
          this.$message.success('修改成功');
          this.openMaterialWindow(this.curId, this.material.templateId, 'edit');
          this.getDataList();
        });
    },
    /**
     * 执行修改
     */
    doUpdateMaterialTypeName() {
      this.$http.materialService
        .updateMaterialTypeName(this.curId, this.materialType)
        .then(() => {
          this.dialogMaterialType = false;
          this.$message.success('修改成功');
          this.getMaterialTypeList();
        });
    },
    /**
     * 创建物质类别
     */
    doCreateMaterialType() {
      this.$http.materialService
        .createMaterialType(this.materialType)
        .then(() => {
          this.dialogMaterialType = false;
          this.$message.success('添加成功');
          this.getMaterialTypeList();
        });
    },
    /**
     * 删除物质
     */
    doDeleteMaterial(id) {
      this.$confirm('是否删除此物质?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.doDeleteProject(id);
        this.$http.materialService.deleteMaterial(id).then(() => {
          this.$message.success('删除成功');
          this.getDataList();
        });
      });
    },
    /**
     * 删除物质类型
     */
    deleteMaterialType(id) {
      this.$confirm('是否删除此物质类别?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.materialService.deleteMaterialType(id).then(() => {
          this.$message.success('删除成功');
          this.getMaterialTypeList();
        });
      });
    },
    resetForm() {
      this.form = {
        categoryId: '',
        name: '',
        pageSize: 30,
        current: 0
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.tree-name {
  color: rgba(52, 58, 69, 1);
  font-size: 14px;
}
.box {
  padding: 0.5em;
}
.el-tree {
  background: none;
}
.search-box {
  background: #fff;
  border-radius: 5px;
}

.search-row {
  border-bottom: 1px solid #edf1f7;
  padding: 15px;
  line-height: 40px;
  background: #fff;
  height: 40px;
  box-sizing: content-box;
}
.search-row > div {
  text-align: center;
  margin: 0 0.5em;
  width: 200px;
}
.search-row > div:nth-last-child(1) {
  text-align: center;
  width: 250px;
}
.tools-bar {
  margin: 18px 0;
  overflow: hidden;
}

.tools-bar .tb-title {
  color: #343a45;
  font-weight: bold;
  width: 120px;
  display: inline-block;
  border-left: 3px solid #26beff;
  padding-left: 15px;
}

.custom-tree-node {
  .el-icon-more {
    opacity: 0;
  }
}
.custom-tree-node:hover {
  .el-icon-more {
    opacity: 1;
    transition: 1s all;
  }
}
</style>
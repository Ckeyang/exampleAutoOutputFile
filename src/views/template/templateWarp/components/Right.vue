<template>
  <div class="box-style_common attrShowRight-box">
    <div v-if='currentItem'>
      <h6 class="box-title">
        <span>组件属性</span>
      </h6>
      <input-attr
        :formAttribute="currentItem.componentAttr"
        :formValue='currentItem.formValue'
        @openDialog="openDialog1"
        v-if="currentItem.componentType==='TEXTBOX'"
      ></input-attr>
      <datapicker-attr
        :formAttribute="currentItem.componentAttr"
        @openDialog="openDialog1"
        v-else-if="currentItem.componentType==='DATEPICKER'"
      ></datapicker-attr>
      <Cascader-attr
        :formAttribute="currentItem.componentAttr"
        @openDialog="openDialog1"
        v-else-if="currentItem.componentType==='CASCADER'"
      ></Cascader-attr>
      <check-box
        :formAttribute="currentItem.componentAttr"
        @openDialog="openDialog1"
        :currentItem="currentItem"
        :templateList="formList"
        :dataSourceEnumList='dataSourceEnumList'
        v-else-if="currentItem.componentType==='RADIOBOX' || currentItem.componentType==='CHECKBOX' || currentItem.componentType==='COMBOBOX' || currentItem.componentType==='MULTIPLE_COMBOBOX'"
      ></check-box>
      <address-attr
        :formAttribute="currentItem.componentAttr"
        @openDialog="openDialog1"
        v-else-if="currentItem.componentType==='ADDRESSBOX'"
      ></address-attr>
      <Custom-template-attr
        :formAttribute="currentItem.componentAttr"
        @openDialog="openDialog1"
        v-else-if="currentItem.componentType==='CUSTOMBOX'"
      ></Custom-template-attr>
      <upload-attr
        :formAttribute="currentItem.componentAttr"
        @openDialog="openDialog1"
        v-else-if="currentItem.componentType==='FILEBOX' || currentItem.componentType==='IMAGEBOX' || currentItem.componentType==='VIDEO'"
        :currentItem="currentItem"
      ></upload-attr>
      <!-- <Custom-assembly-attr :customAssembly='customAssembly' @openDialog='openDialog1' v-else-if='formAttr.isShowAssemblyAttr'></Custom-assembly-attr> -->
      <dynamic-selection-boxAttr
        :formAttribute="currentItem.componentAttr"
        @openDialog="openDialog1"
        v-else-if="currentItem.componentType==='DYNAMIC_CHOICE' || currentItem.componentType==='DYNAMIC_SINGLE_CHOICE' || currentItem.componentType==='DYNAMIC_MULT_CHOICE'"
        :currentItem="currentItem"
      ></dynamic-selection-boxAttr>
      <Signature-attr
        :formAttribute="currentItem.componentAttr"
        @openDialog="openDialog1"
        v-else-if="currentItem.componentType==='SIGNATURE'"
        :currentItem="currentItem"
      ></Signature-attr>
      <Industry-groups-attr
        :formAttribute="currentItem.componentAttr"
        @openDialog="openDialog1"
        v-else-if="currentItem.componentType==='INDUSTRY'"
        :currentItem="currentItem"
      ></Industry-groups-attr>
    </div>
    <el-dialog
      title="选择模板字段"
      :visible.sync="dialogVisible"
      width="30%"
      v-el-drag-dialog
      :close-on-click-modal="false"
    >
      <div class="filedIdTree">
        <div class="tem-search-box">
          <el-input v-model="formName" placeholder="请输入字段名称" size="small" clearable></el-input>
          <el-button
            type="primary"
            size="small"
            style="margin:0 0 0 15px"
            icon="el-icon-search"
            @click="searchData"
          >搜 索</el-button>
          <el-button
            type="primary"
            size="small"
            style="margin:0 0 0 15px"
            icon="el-icon-plus"
            @click="addSharedParts"
          >新 增</el-button>
        </div>
        <p class="empty-text" v-if="!fieldData.length">暂无共享件</p>
        <el-scrollbar class="el-scrollbar_height" v-loading="loading" v-else>
          <ul class="field-box">
            <li
              v-for="item of fieldData"
              :key="item.id"
              :class="{'active-color':currChecked.id === item.id}"
              @dblclick="choiceFiled(item.id,item.name)"
              @click.stop="clickFiled(item.id,item.name)"
            >
              <el-popover placement="right" width="280" trigger="hover">
                <div class="popover-box">
                  <p>
                    <span>名字:</span>
                    {{item.name}}
                  </p>
                  <p v-show='item.describe'>
                    <span>描述:</span>
                    {{item.describe}}
                  </p>
                </div>
                <span slot="reference">
                  <span class="filed-content">{{item.name}}</span>
                  <i class="iconfont icon-tupian" v-show="item.shareComponentType === 'IMAGE'"></i>
                  <span
                    v-for="icons of item.markingIcon"
                    :key="icons"
                    class="markingIcon"
                  >{{markingIcon(icons)}}</span>
                </span>
              </el-popover>
              <i
                class="iconfont icon-yishiyongziyang"
                style="float:right"
                v-show="isChecked(item.id)"
              ></i>
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="saveField" size="medium">保 存</el-button>
      </span>
    </el-dialog>
    <div class="add-shared_parts">
      <add-shared-parts
        ref="sharedPartsField"
        :defaultCategoryId="categoryIdProps"
        :defaultFeildTypeList="['TEXT','IMAGE']"
        :isShowAddRules='false'
        :isShowHideRuleSetting='false'
        @refreshShare="getSharedPartsList"
      />
    </div>
  </div>
</template>
<script>
import inputAttr from "@/components/attribute/InputAttr.vue";
import checkBox from "@/components/attribute/RadioAttr.vue";
import AddressAttr from "@/components/attribute/AddressAttr.vue";
import CustomTemplateAttr from "@/components/attribute/CustomTemplateAttr.vue";
import uploadAttr from "@/components/attribute/uploadAttr.vue";
import TemplateAttr from "@/components/attribute/TemplateAttr.vue";
// import CustomAssemblyAttr from "@/components/attribute/CustomAssemblyAttr.vue";
import datapickerAttr from "@/components/attribute/DatapickerAttr.vue";
import CascaderAttr from "@/components/attribute/CascaderAttr.vue";
import DynamicSelectionBoxAttr from "@/components/attribute/DynamicSelectionBoxAttr.vue";
import SignatureAttr from "@/components/attribute/SignatureAttr.vue";
import IndustryGroupsAttr from "@/components/attribute/IndustryGroupsAttr.vue";
import AddSharedParts from "@/views/sharedParts/components/AddSharedParts.vue";
 
export default {
  data() {
    return {
      formName: "", //表单搜索名称
      filterText: "", //关键字筛选
      currChecked: {}, //临时保存当前点击的字段
      fieldData: [], //共享件字段列表
      filedldList: [], //某个表单下的所有字段列表，动态表单使用
      formList: [], //项目下所有的表单
      loading: true,
      dialogVisible: false,
      dataSourceEnumList:[],
      categoryIdProps: this.$route.params.evaluateId
        .split("-")
        .slice(0, 2)
        .join("-"),
      defaultProps: {
        children: "childList",
        label: "name",
        id: "id"
      }
    };
  },
  props: ["currentItem", "formAttr", "templateData"],
  components: {
    inputAttr, //填空
    checkBox, //单选、多选、下拉
    AddressAttr, //地址
    CustomTemplateAttr, // 自定义组件
    uploadAttr,
    TemplateAttr, //模板的基本信息
    // CustomAssemblyAttr, // 组件的基本信息
    datapickerAttr, //时间控件
    CascaderAttr, //多级下拉
    DynamicSelectionBoxAttr, //动态多选框
    AddSharedParts, //添加共享件
    SignatureAttr,
    IndustryGroupsAttr
  },
  computed:{
    curTemplateFiledIds(){
      return this.$store.state.ProjectChoiceFiled.curTemplateFiledIds
    }
  },
  created() {
    this.getSharedPartsList();
    this.getChoiceDynamicDataType() // 获取系统参数可选列表
    this.getAllForm(); //获取同评价类别下面所有的模板
  },
  watch: {
    formName() {
      this.getSharedPartsList();
    },
    dialogVisible(val) {
      if (!val) {
        this.filterText = "";
        this.currChecked = {}
      }
    },
  },
  methods: {
    openDialog1() {
      this.dialogVisible = true;
    },
    // 获取系统参数可选列表
    getChoiceDynamicDataType(){
      this.$http.templateService.getChoiceDynamicDataType().then(res=>{
        this.dataSourceEnumList = res.data || []
      })
    },
    //打开添加共享件窗口
    addSharedParts() {
      let category = this.$route.params.evaluateId
        .split("-")
        .slice(0, 2)
        .join("-");
      this.$refs.sharedPartsField.openDialog("ADD", category, false);
    },
    //获取项目下所有的表单
    getAllForm() {
      this.$http.templateService
        .getFromList(this.$route.params.evaluateId)
        .then(res => {
          this.formList = res.data;
        });
    },
    // // 获取表单下的所有字段
    // getAssemblyTree(id) {
    //   this.$http.templateService.getTreeListByTempId(id).then(res => {
    //     this.filedldList = res.data;
    //   });
    // },
    //获取共享件字段
    getSharedPartsList() {
      this.loading = true;
      this.$http.sharedPartsService
        .getSharedPartsInTempalte({
          category: this.$route.params.evaluateId
            .split("-")
            .slice(0, 2)
            .join("-"),
          name: this.formName
        })
        .then(res => {
          this.fieldData = res.data;
          this.loading = false;
        })
    },
    //判断是否已使用
    isChecked(id) {
      return (
        !!this.curTemplateFiledIds.length &&
        this.curTemplateFiledIds.some(item => item === id)
      );
    },
    //双击快速选择
    choiceFiled(id, name) {
      this.clickFiled(id, name);
      this.saveField();
    },
    //点击字段
    clickFiled(id, name) {
      this.currChecked = {
        id,
        name
      }; 
    },
    //选择该字段
    saveField() {
      if (this.currChecked.id) {
        if(this.isChecked(this.currChecked.id)){
          this.$message({
            message: "该字段已使用,请重新选择!",
            type: "warning"
          });
          return 
        }
        this.currentItem.componentAttr.fieldId = this.currChecked.id;
        this.currentItem.componentAttr.tag = this.currChecked.name;
        this.dialogVisible = false;
        this.$emit('recursionTemplate')
      } else {
        this.$message({
          message: "请选择共享件字段",
          type: "warning"
        });
      }
    },
    //列表被引用地方的图标
    markingIcon(type) {
      switch (type) {
        case "PROJECT":
          return "项";
        case "SUBSTANCE":
          return "物";
        case "REPORT":
          return "报";
      }
    },
    searchData() {
      this.getSharedPartsList();
    }
  }
};
</script>
<style scoped>
.attrShowRight-box {
  min-height: calc(100vh - 106px);
  padding: 10px;
  box-sizing: content-box;
}
.filedIdTree {
  margin-bottom: 10px;
  overflow: hidden;
}
.empty-text {
  text-align: center;
  margin-top: 20px;
  color: #9ba1a9;
}
.field-box {
  padding: 8px;
}
.field-box li {
  height: 31px;
  line-height: 31px;
  border-radius: 5px;
  padding: 0 8px;
  font-size: 12px;
  cursor: pointer;
  color: #3c4551;
}
.filed-content {
  max-width: 340px;
  margin-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.field-box i {
  font-size: 14px;
  margin-right: 3px;
  color: #0cd0d0;
}
.markingIcon {
  padding: 1px 5px;
  font-size: 12px;
  background: #0cd0d0;
  color: #fff;
  border-radius: 5px;
}
.field-box li:hover,
li.active-color {
  background: #edf5ff;
  color: #107AC2;
}

.el-scrollbar_height {
  height: 300px;
  margin: 15px 0;
  border-radius: 4px;
  border: 1px solid #d5e0ed;
}
.box-title {
  font-size: 15px;
  display: flex;
  position: relative;
  align-items: center;
}
.tem-search-box {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.tem-search-box >>> .el-input {
  flex-grow: 1;
}
.custom-tree-node {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.popover-box {
  font-size: 12px;
}
.popover-box span {
  font-weight: bold;
  margin-right: 10px;
}
.popover-box p {
  line-height: 26px;
}
.icon-yishiyongziyang {
  color: #3DA5F4;
  font-size: 15px;
  margin-left: 6px;
  vertical-align: middle;
}

.box-title i {
  display: inline-block;
  height: 15px;
  width: 4px;
  margin-right: 8px;
  background: #3DA5F4;
}
.add-shared_parts >>> .el-form--label-top .el-form-item__label {
  line-height: 30px;
}
.add-shared_parts >>> .el-form-item {
  margin-bottom: 20px;
}

</style>
<template>
  <div class="content-warp">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="业务类别">
            <el-select v-model="form.evaluationCategory" size="small" style="width:100%">
              <el-option v-for="(item, index) in advisoryCategory" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物质类别">
            <el-select v-model="form.substanceCategoryType" @change="getDataList(true)" size="small" style="width:100%">
              <el-option value="" label="全部"></el-option>
              <el-option
                v-for="(item, index) in materialTypeTree"
                :key="index"
                :value="item.substanceCategoryType"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="名称">
            <el-input v-model="form.name" size="medium" @keyup.enter.native="getDataList" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="CAS No.">
            <el-input v-model="form.casNo" size="medium" @keyup.enter.native="getDataList" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物质代号">
            <el-input v-model="form.codeName" size="medium" @keyup.enter.native="getDataList" clearable></el-input>
          </el-form-item>
        </el-col>
      </template>
      <template slot="button">
        <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList(true)">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="tb-title">物质列表</h5>
        <!-- <div>
          <el-button
            type="success"
            size="small"
            class="entry-btn"
            icon="el-icon-plus"
            @click="createNewMaterial"
          >新增物质</el-button>
        </div> -->
      </div>
      <vxe-table :data="dataList" :max-height="winHeight - 366" 
        show-header-overflow
        show-overflow
        highlight-hover-row>
        <vxe-table-column title="序号" type="index"></vxe-table-column>
        <vxe-table-column title="物质类别" field="substanceCategoryType">
          <template slot-scope="scope">{{ keys[scope.row.substanceCategoryType] }}</template>
        </vxe-table-column>
        <vxe-table-column title="物质名称" field="name" width="350px"></vxe-table-column>
        <vxe-table-column title="CAS No." field="casNo"></vxe-table-column>
        <vxe-table-column title="分子式" field="formula">
          <template slot-scope="scope">
            <span v-html="translateFormula(scope.row.formula)"></span>
          </template>
        </vxe-table-column>
        <vxe-table-column title="别名" field="alias"></vxe-table-column>
        <vxe-table-column title="物质代号" field="codeName" show-overflow-tooltip></vxe-table-column>
        <vxe-table-column title="业务类别" field="evaluationCategoryNames" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.evaluationCategoryNames.join("、") }}
          </template>
        </vxe-table-column>
        <!-- <vxe-table-column v-for="(item,index) in title" :key="index" :label="item.value" :prop="item.key">
                  <template slot-scope="scope">
                    <span v-html="item.key==='formula'?translateFormula(scope.row[item.key]): item.key==='category'?scope.row.category.name:scope.row[item.key]"></span>
                    
                  </template>
        </vxe-table-column>-->
        <vxe-table-column title="操作" width="180px" fixed="right">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i class="iconfont icon-chakan icon-edit" @click="openWindow(scope.row.id, 'view')">查看</i>
              <!-- <i class="iconfont icon-xiugai icon-edit" @click="addRevision(scope.row.id)" v-if="checkAuth('RBAC_PERMISSION_api_app_substances_static_form_revisionRule_POST')">添加修约</i> -->
              <!-- <i class="iconfont icon-xiugai icon-edit" @click="editMaterial(scope.row)">编辑</i>
              <i class="iconfont icon-shanchu icon-edit" @click="doDeleteMaterial(scope.row.id)">删除</i> -->
            </div>
          </template>
        </vxe-table-column>
      </vxe-table>
      <pagniation
        :totalPage="totalPage"
        :currentPage="form.current"
        :totalNum="totalNum"
        @changePage="handleChangePage"
      ></pagniation>
    </div>
    <revision ref="revision" @up="up" @down="down"></revision>
    <el-dialog :title="curId === '' ? '新建物质' : '编辑物质'" :visible.sync="dialogVisible" width="30%">
      <el-form :model="material" ref="material" :rules="rules" label-position="top" label-width="120px">
        <el-form-item label="物质类别" prop="substanceCategoryTree">
          <el-cascader
            :options="materialTypeTree"
            v-model="material.substanceCategoryTree"
            :props="{ label: 'name', children: 'subclass', value: 'substanceCategoryType' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="物质名称" prop="name">
          <el-input v-model="material.name" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="物质别名" prop="alias">
          <el-input v-model="material.alias" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="物质代号" prop="codeName">
          <el-input v-model="material.codeName" maxlength="32"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogVisible = false;
            getDataList();
          "
          >取消</el-button
        >
        <el-button type="primary" @click="doSaveMaterial">{{ curId ? "下一步" : "确定" }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import Revision from "../revision/revision.vue";
import { mapGetters } from "vuex";
export default {
  name: "materialList",
  components: { highlightWords, SearchBox, pagniation, preview, Revision },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  data() {
    return {
      curId: "",
      dialogVisible: false,
      materialTypeTree: [],
      advisoryCategory: [],
      form: {
        substanceCategoryType: "",
        name: "",
        pageSize: 30,
        current: 0
      },
      rules: {
        substanceCategoryTree: { required: true, message: "必填" },
        name: { required: true, validator: this.checkName, message: "必填" }
      },
      material: {
        name: "",
        substanceCategoryTree: [],
        substanceCategoryType: ""
      },
      totalPage: 0,
      totalNum: 0,
      keys: {
        CHEMISTRY: "化学类",
        BIOLOGY: "生物类",
        POWER_FREQUENCY_ELECTRIC_FIELD: "工频电场",
        HAND_VIBRATION: "手传振动",
        MICROWAVE: "微波辐射",
        ULTRAVIOLET_RADIATION: "紫外辐射（紫外线）",
        HF_ELECTROMAGNETIC_FIELD: "高频电磁场",
        UHF_RADIATION: "超高频辐射",
        NOISES: "噪声",
        HIGH_TEMPERATURE: "高温",
        // NON_NOISE_WORK_PLACE:"非噪声工作地点噪声",
        // NOISE_WORK_PLACE_OF_PULSE:"工作场所脉冲噪声",
        ARC_WELDING_LIGHT: "紫外辐射（电焊弧光）",
        ILLUMINATION: "照度",
        PHYSICS: "物理因素",
        OTHER: "未收录物质",
        DISSOCIATE_SILICA: "游离SO₂"
      },
      dataList: []
    };
  },
  mounted() {
    let that = this;
    window.onfocus = function() {
      that.getDataList();
    };
  },
  activated() {
    this.getDataList();
    this.getMaterialTypeList();
    this.getAdvisoryCategory();
  },
  created(){
    this.getDataList();
    this.getMaterialTypeList();
    this.getAdvisoryCategory();
  },
  methods: {
    getAdvisoryCategory() {
      this.$http.advisoryCategoryService.getAdvisoryCategoryTree().then(res => {
        this.advisoryCategory = res.data.childList || [];
      });
    },
    up(id) {
      let index = this.dataList.findIndex(item => item.id === id);
      if (index - 1 >= 0) {
        this.$refs.revision.nextRevision(this.dataList[index - 1].id);
      } else if (index - 1 === -1 && this.form.current === 0) {
        this.$message.error("我是有上限的");
      } else {
        this.form.current = this.form.current - 1;
        this.$http.staticMaterialService
          .getList(this.form)
          .then(res => {
            this.dataList = res.data.content;
            this.totalPage = res.data.totalPages;
            this.totalNum = res.data.totalElements;
          })
          .then(() => {
            this.$refs.revision.nextRevision(this.dataList[this.dataList.length - 1].id);
          });
      }
    },
    down(id) {
      let index = this.dataList.findIndex(item => item.id === id);
      if (index < this.dataList.length - 1) {
        this.$refs.revision.nextRevision(this.dataList[index + 1].id);
      } else if (this.form.pageSize > this.dataList.length) {
        this.$message.error("我是有底限的");
      } else {
        this.form.current = this.form.current + 1;
        this.$http.staticMaterialService.getList(this.form).then(res => {
          if (res.data.length === 0) {
            this.$message.error("我是有底限的");
            this.form.current = this.form.current - 1;
            throw "GG";
          } else {
            this.dataList = res.data.content;
            this.totalPage = res.data.totalPages;
            this.totalNum = res.data.totalElements;
            this.$refs.revision.nextRevision(this.dataList[0].id);
          }
        });
      }
    },
    addRevision(id) {
      this.$refs.revision.addRevision(id);
    },
    checkName(rule, value, callback) {
      if (value.trim() === "") {
        callback(new Error("必填"));
      }
      callback();
    },
    getCatorgory(val) {
      this.form.substanceCategoryType = val[val.length - 1];
      this.getDataList(true);
    },
    getMaterialCatorgory(val) {
      this.material.substanceCategoryType = val[val.length - 1];
    },
    /**
     * 获取materialType列表
     */
    getMaterialTypeList() {
      this.$http.materialService.getMaterialTypeList({}).then(res => {
        this.materialTypeTree = this.reloadMaterialType(res.data);
      });
    },
    /**
     * 过滤subclass为空
     */
    reloadMaterialType(data) {
      let result = [];
      data.map(item => {
        let { id, name, rankType, parentId, substanceCategoryType, applicationType, subclass, templateId } = item;
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
    doDeleteMaterial(id) {
      this.$confirm("是否删除此物质?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.staticMaterialService.delete(id).then(() => {
          this.$message.success("删除成功");
          this.getDataList();
        });
      });
    },
    editMaterial(item) {
      this.curId = item.id;
      this.material = item;
      this.dialogVisible = true;
    },
    doSaveMaterial() {
      this.$refs["material"].validate(valid => {
        if (valid) {
          console.log(this.curId);
          this.curId ? this.updateMaterial() : this.createMaterial();
        }
      });
    },
    updateMaterial() {
      this.material.substanceCategoryType = this.material.substanceCategoryTree[this.material.substanceCategoryTree.length - 1];
      this.$http.staticMaterialService.update(this.curId, this.material).then(() => {
        this.openWindow(this.curId);
        this.dialogVisible = false;
        this.getDataList();
      });
    },
    createMaterial() {
      this.material.substanceCategoryType = this.material.substanceCategoryTree[this.material.substanceCategoryTree.length - 1];
      this.$http.staticMaterialService.create(this.material).then(res => {
        this.openWindow(res.data);
        this.dialogVisible = false;
        this.getDataList();
      });
    },
    openWindow(id, action = "edit") {
      let localPath = location.href.split(this.$route.path)[0] + `/materialDataInput/${id}/${action}`;
      window.open(localPath);
    },
    /**
     * 创建新的物质
     */
    createNewMaterial() {
      this.dialogVisible = true;
      this.curId = "";
      this.material = {
        name: "",
        substanceCategoryTree: [],
        substanceCategoryType: ""
      };
    },
    /**
     * 翻译forMula
     */
    translateFormula(formula) {
      if (!formula) {
        return "";
      } else {
        let reg = /[a-zA-Z](\d+)/g;
        let list = formula.match(reg);
        if (!list) {
          return formula;
        }
        let result = formula;
        list.map(e => {
          let first = e.substr(0, 1);
          let num = e.split(first)[1];
          let domNum = "<sub>" + num + "</sub>";
          result = result.replace(e, first + domNum);
        });
        return result;
      }
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    getDataList(reset = false) {
      if (reset) {
        this.form.current = 0;
      }
      this.$http.staticMaterialService.getList(this.form).then(res => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
        // this.title = getTitle(this.dataList[0]);
      });
    },
    resetForm() {
      this.form = {
        substanceCategoryType: "",
        name: "",
        pageSize: 30,
        current: 0
      };
      this.getDataList();
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

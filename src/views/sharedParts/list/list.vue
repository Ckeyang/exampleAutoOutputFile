<template>
  <div class="content-warp">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
          <el-form-item label="排序">
            <el-select v-model="form.shortBy" style="width:100%">
              <el-option value="name" label="名称"></el-option>
              <el-option value="version" label="版本高低"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="类型">
            <el-select v-model="form.shareComponentType" style="width:100%">
              <el-option value label="全部"></el-option>
              <el-option value="TEXT" label="普通"></el-option>
              <el-option value="TABLE" label="表格"></el-option>
              <el-option value="IMAGE" label="图片"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务类别">
            <el-select v-model="form.evaluationCategoryId" style="width:100%">
              <el-option value label="全部"></el-option>
              <el-option v-for="item in categories" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规则">
            <el-select v-model="form.hasRule" style="width:100%">
              <el-option value label="全部"></el-option>
              <el-option value="true" label="有"></el-option>
              <el-option value="false" label="无"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="form.isDisable" style="width:100%">
              <el-option :value="null" label="全部"></el-option>
              <el-option :value="false" label="停用"></el-option>
              <el-option :value="true" label="启用"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键字">
            <el-input v-model="form.keyWords" placeholder="请输入关键字" clearable @keyup.enter.native="getDataList"></el-input>
          </el-form-item>
        </el-col>
      </template>
      <template slot="button">
        <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="tb-title">共享件列表</h5>
        <div>
          <el-button
            v-if="dataList.length != 0 && checkAuth('RBAC_PERMISSION_api_app_shareComponent_POST')"
            size="mini"
            type="success"
            icon="el-icon-plus"
            @click="openAddDialog"
            >新增共享件</el-button
          >&nbsp;&nbsp;
        </div>
      </div>
      <div class="tac" v-if="dataList.length === 0" style="margin-top:100px;">
        <div>
          <img src="@/assets/no-data.png" />
        </div>
        <span>没有共享件,请新增共享件</span>
        <br />
        <br />
        <el-button size="mini" type="success" icon="el-icon-plus" @click="openAddDialog">新增共享件</el-button>
      </div>
      <el-table v-else :max-height="winHeight - 370" :data="dataList">
        <el-table-column label="共享件名称" prop="name">
          <template slot-scope="scope">
            {{ scope.row.name }}
            <el-tag v-if="scope.row.shareComponentType === 'TEXT'" size="mini" style="margin-left:2px;">字段</el-tag>
            <el-tag v-else-if="scope.row.shareComponentType === 'IMAGE'" size="mini" style="margin-left:2px;">图片</el-tag>
            <el-tag v-else size="mini" style="margin-left:2px;">表格</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="使用场景" prop="markingIcon" width="100">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              type="info"
              v-for="j in scope.row.markingIcon"
              :key="j"
              :class="{ wz: j === 'REPORT', xm: j === 'PROJECT' }"
              >{{ j === "REPORT" ? "报" : j === "PROJECT" ? "项" : "规" }}</el-tag
            >
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="类型" prop="shareComponentType" width="50">
        </el-table-column> -->
        <el-table-column label="规则" prop="name">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              v-for="(jtem, index) in scope.row.shareComponentRuleList"
              :type="keyColr[jtem.type]"
              :key="index"
              >{{ key[jtem.type] }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="action" width="320">
          <template slot-scope="scope">
            <div class="toolBar operation-icon">
              <i title="查看" class="iconfont icon-yulan" @click="showDetail(scope.row)">查看</i>
              <i
                title="规则配置"
                class="iconfont icon-guizeshezhi"
                @click="addRules(scope.row)"
                v-if="scope.row.markingIcon.indexOf('PROJECT') === -1 && scope.row.shareComponentType !== 'TABLE'"
                >规则设置</i
              >
              <i
                title="编辑"
                class="iconfont icon-xiugai"
                @click="onEditSharedPart(scope.row.id, scope.row.markingIcon.indexOf('PROJECT') > -1)"
                >编辑</i
              >
              <i title="复制" class="iconfont icon-fuzhi" @click="onCopy(scope.row.id)">复制</i>
              <i
                title="停用"
                v-if="scope.row.enableOrDisable === 'ENABLE' && !checkQuoteRelation(scope.row.quoteRelation)"
                class="iconfont icon-tingyong"
                @click="stopUse(scope.row)"
                >停用</i
              >
              <i
                title="启用"
                v-if="scope.row.enableOrDisable === 'DISABLE'"
                class="iconfont icon-qiyong"
                @click="stopUse(scope.row)"
                >启用</i
              >
              <i
                title="删除"
                v-if="checkQuoteRelation(scope.row.quoteRelation) && scope.row.enableOrDisable === 'ENABLE'"
                class="iconfont icon-shanchu"
                @click="deleteUse(scope.row)"
                >删除</i
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagniation
        :totalPage="totalPages"
        :currentPage="form.current"
        :totalNum="totalNumber"
        @changePage="handleChangePage"
      ></pagniation>
      <!-- <div class="tac" v-if="dataList.length === 0" style="margin-top:100px;">
        <div>
          <img src="@/assets/no-data.png" />
        </div>
        <span>没有共享件,请新增共享件</span>
        <br />
        <br />
        <el-button size="mini" type="success" icon="el-icon-plus" @click="openAddDialog">新增共享件</el-button>
      </div>
      <div class="pr" v-else>
        <ListTree
          ref="listtree"
          :data="dataList"
          position="right"
          :totalPage="totalPages"
          :totalNumber="totalNumber"
          @loadMore="loadMore"
          @onClick="showDetail"
          @onChange="getDataList"
          @onEdit="onEditSharedPart"
          @addRules="addRules"
        />
      </div> -->
    </div>
    <Detail ref="detailBox" :detailId="curId" />
    <div>
      <add-shared-parts
        ref="sharedPartsField"
        :defaultFeildTypeList="[]"
        :isShowAddRules="isShowAddRules"
        @refreshShare="getDataList(true)"
      />
      <add-shared-parts-rules
        ref="cus-addSharedPartsRules"
        v-if="rulesKey"
        @refreshList="getDataList(true)"
        @hidden="rulesKey = false"
      />
    </div>
  </div>
</template>
<script>
import Detail from "../components/detail.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import AddSharedParts from "../components/AddSharedParts.vue";
import addSharedPartsRules from "@/views/reportRules/index.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import { mapGetters } from "vuex";
import { setTimeout } from "timers";
export default {
  name: "sharedPartsList",
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  components: {
    pagniation,
    Detail,
    SearchBox,
    AddSharedParts,
    addSharedPartsRules
  },
  data() {
    return {
      totalPages: 0,
      totalNumber: 0,
      form: {
        isDisable: null,
        current: 0,
        pageSize: 30,
        shortBy: "",
        category: "",
        hasRule: "",
        shareComponentType: "",
        keyWords: ""
      },
      key: {
        CONDITION: "条件规则",
        FORMULA: "公式规则",
        JUDGEMENT: "判断规则"
      },
      keyColr: {
        CONDITION: "danger",
        FORMULA: "primary",
        JUDGEMENT: "warning"
      },
      isShow: false,
      categories: [],
      dataList: [],
      curItem: {},
      curId: "",
      rulesKey: true,
      isShowAddRules: true //是否显示规则设置
    };
  },
  activated() {
    this.getDataList();
    this.getCategories();
  },
  created() {
    this.getDataList();
    this.getCategories();
  },
  methods: {
    onCopy(id) {
      this.$http.sharedPartsService.copySharePart(id).then(() => {
        this.$message.success("复制成功");
        this.getDataList();
      });
    },
    stopUse(item) {
      let flag = item.enableOrDisable === "DISABLE" ? "ENABLE" : "DISABLE";
      if (item.quoteRelation) {
        let list = "";
        Object.values(item.quoteRelation)
          .map(item => {
            return { key: item.split("-")[0], value: item.split("-")[1] };
          })
          .map(item => {
            let url =
              item.key === "PROJECT" ? "/#/projectManagement/projectTemplateList" : "/#/reportTemplateManagement/list/all";
            list += "<li><a style='color:#26beff' href='" + url + "'>" + item.value + "</a><li>";
          });
        this.$notify({
          title: "",
          dangerouslyUseHTMLString: true,
          message: "<strong>此共享件正在被使用<strong>，使用的模板有:<br/>" + list,
          duration: 2500
        });
        // this.$message({
        //   type: "warning",
        //   dangerouslyUseHTMLString: true,
        //   message: "<strong>此共享件正在被使用<strong>，使用的模板有:<br/><br/>" + list.toString(),
        //   duration:2500
        // });
        return;
      }
      this.$confirm("此操作将" + (flag === "ENABLE" ? "启用" : "禁用") + "数据, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.sharedPartsService.stopUseSharedPart(item.id, flag).then(() => {
          this.$emit("onChange");
        });
      });
    },
    deleteUse(item) {
      this.$confirm("此操作将删除数据, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.sharedPartsService.deleteSharedPart(item.id).then(this.getDataList);
      });
    },
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    checkQuoteRelation(t) {
      let flag = false;
      if (t && Object.keys(t).length === 0) {
        flag = true;
      }
      return flag;
    },
    getCategorieByTypeForm() {
      let result = this.categories.find(item => {
        if (item.id === this.form.categoryType) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
    /**
     * 获取分类
     */
    getCategorie(val) {
      this.form.category = val[val.length - 1];
    },
    loadMore(params) {
      this.form.current = params.current;
      this.form.pageSize = params.size;
      this.getDataList(false);
    },
    /**
     * 获取行业分类
     */
    getCategories() {
      this.$http.advisoryCategoryService.getAdvisoryCategoryTree().then(res => {
        this.categories = res.data.childList;
      });
    },
    reloadCategories(data) {
      let result = [];
      data.map(item => {
        let { id, name, childList } = item;
        if (childList && childList.length > 0) {
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
    getDataList(flag = false) {
      if (flag) {
        this.form.current = 0;
      }
      this.isShow = false;
      this.$http.sharedPartsService.getSharedParts(this.form).then(res => {
        this.dataList = res.data.content;
        this.totalPages = res.data.totalPages;
        this.totalNumber = res.data.totalElements;
      });
    },
    resetForm() {
      this.form = {
        shortBy: "",
        isDisable: null,
        current: 0,
        pageSize: 30,
        category: "",
        hasRule: "",
        shareComponentType: "",
        keyWords: ""
      };
      this.totalNumber = 0;
      this.totalPages = 0;
      this.getDataList();
    },
    showDetail(item) {
      this.curItem = item;
      this.curId = item.id || item.tableHeadId;
      this.$refs.detailBox.isShow();
    },
    //新增共享件
    openAddDialog() {
      this.isShow = true;
      setTimeout(() => {
        this.$refs.sharedPartsField.openDialog("ADD");
        this.isShowAddRules = true;
      }, 500);
    },
    onEditSharedPart(id, isFlag = true) {
      this.isShow = true;
      setTimeout(() => {
        this.$refs.sharedPartsField.getSharedPartsFieldById(id);
        this.isShowAddRules = !isFlag;
      }, 500);
    },
    //添加规则
    addRules({ id, name, shareComponentType }) {
      this.isShow = true;
      setTimeout(() => {
        this.rulesKey = true;
        this.$nextTick(() => {
          this.$refs["cus-addSharedPartsRules"].openDialog(id, name, shareComponentType);
        });
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
.pr {
  position: relative;
}
.tac {
  text-align: center;
}
.regulation-tb {
  background-color: #fff;
  font-size: 14px;
}
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
.label {
  font-size: 12px;
  display: inline-block;
  padding: 0.2em;
  margin: 0 0.2em;
}
.wz {
  background-color: rgba(61, 165, 244, 0.2); //#1d7fff;
  color: rgba(61, 165, 244, 1);
  border-color: rgba(61, 165, 244, 0.1);
  // border: 2px solid #1d7fff;
  // border-radius: 6px;
}
.gz {
  background-color: #a37aff;
  color: #fff;
  border: 2px solid #a37aff;
  border-radius: 6px;
}
.xm {
  background-color: rgba(24, 185, 212, 0.2); // #26beff;
  color: rgba(24, 185, 212, 1);
  border-color: rgba(24, 185, 212, 0.1);
  // border: 2px solid #26beff;
  // border-radius: 6px;
}
</style>

<template>
  <div>
    <search-box>
      <template slot="input">
        <el-col :span="5">
          <el-form-item label-width="80px" align="left" label="类型">
            <el-select v-model="form.methodType" size="small" style="width:100%;" @change="getDataList(true)">
              <el-option value="ALL" label="全部"></el-option>
              <el-option value="ACQUISITION_METHOD" label="采集方法"></el-option>
              <el-option value="ANALYSIS_METHOD" label="分析方法"></el-option>
              <el-option value="EVALUATE_METHOD" label="评价方法"></el-option>
              <el-option value="OTHER" label="其他"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label-width="80px" align="left" label="修约状态">
            <el-select v-model="form.revisionStatus" size="small" style="width:100%;" @change="getDataList(true)">
              <el-option value="ALL" label="全部"></el-option>
              <el-option value="REVISED" label="有修约"></el-option>
              <el-option value="NONE" label="无修约"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="标签筛选" label-width="80px">
            <el-select
              v-model="form.labelIds"
              multiple
              filterable
              remote
              reserve-keyword
              collapse-tags
              size="medium"
              placeholder="请输入关键词"
              style="width:100%"
              :remote-method="getTags"
            >
              <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label-width="100px" align="left" label="关键字">
            <el-input v-model="form.keyWords" size="small" placeholder="请输入关键字"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList(true)">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-col>
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="tb-title">业务类别:{{ evaluate.businessCategoryName }}</h5>
        <div style="float: right;">
          <el-button size="small" @click="setSuper">高级功能</el-button>
          <table-head-show-list
            :trDataList="evaluate.idAndNameList"
            :componentParentId="evaluate.businessCategoryIds[0]"
            style="margin-right:10px"
            @checkTrChange="getTitleList"
          />
          <el-button type="success" size="small" class="entry-btn" icon="el-icon-plus" @click="createMethod()"
            >添加方法</el-button
          >
        </div>
      </div>
      <el-table :data="dataList" :max-height="winHeight - 340">
        <template slot="empty">
          <br />
          <br />
          <img src="@/assets/empty.png" />
          <br />
          <span>暂无数据</span>
          <br />
          <br />
          <br />
          <br />
        </template>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column v-for="jtem in getRealTitle()" :key="jtem.id" :label="jtem.name" :prop="jtem.id"></el-table-column>
        <el-table-column label="操作" width="350" fixed="right">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i class="iconfont icon-i-biaoqian" @click="editTags(scope.row.methodDataId)">标签</i>
              <i class="iconfont icon-bianji" @click="edit(scope.row.methodDataId)">编辑</i>
              <i class="iconfont icon-tianjia" @click="revisionRule(scope.row.methodDataId)">添加修约</i>
              <!-- <revisionRule
                :isMethod="true"
                :methodId="scope.row.methodDataId"
                size="mini"
                btnTilte="添加修约"
                hasRuleBtnTilte="编辑修约"
                @getValue="getDataList()"
              ></revisionRule> -->
              <i class="iconfont icon-fuzhi" @click="copy(scope.row.methodDataId)">复制</i>
              <i class="iconfont icon-shanchu" @click="deleteMethod(scope.row.methodDataId)">删除</i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagniation
        :totalPage="totalPage"
        :currentPage="form.current"
        :totalNum="totalNum"
        @changePage="handleChangePage"
      ></pagniation>
    </div>
    <el-dialog
      :visible.sync="visible"
      width="30%"
      :title="isSuper ? '高级功能' : methodAction === 'create' ? '添加方法' : methodAction === 'copy' ? '复制方法' : '编辑方法'"
      :close-on-click-modal="false"
      @close="getTitleList"
    >
      <div v-if="isSuper">
        <div style="padding:1em;">
          允许自由设置表头字段，适用在当前一级业务类别下所有的添加方法列表里。这些表
          头字段可以与方法、标签等产生关联，以供规则调用。
        </div>
        <el-table border :data="titleList.filter(item => !item.fixed)">
          <el-table-column label="表头" prop="name">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" :disabled="scope.row.fixed" @input="scope.row.update = '1'"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="65">
            <template slot-scope="scope">
              <div v-show="!scope.row.fixed">
                <i class="iconfont icon-baocun" v-if="scope.row.update" @click="saveTitle(scope.row)">保存</i>
                <i class="iconfont icon-shanchu" v-else @click="deleteTitle(scope.row)">删除</i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="padding:1em;">
          <i class="iconfont icon-tianjia" @click="addTitle">添加</i>
        </div>
      </div>
      <div v-else>
        <el-form ref="inputForm" :model="curItem" label-position="top">
          <el-form-item label="类型" prop="methodType" :rules="{ required: true, message: '必填' }">
            <el-radio-group v-model="curItem.methodType">
              <el-radio value="ACQUISITION_METHOD" label="ACQUISITION_METHOD">采集方法</el-radio>
              <el-radio value="ANALYSIS_METHOD" label="ANALYSIS_METHOD">分析方法</el-radio>
              <el-radio value="EVALUATE_METHOD" label="EVALUATE_METHOD">评价方法</el-radio>
              <el-radio value="OTHER" label="OTHER">其他</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="内容" prop="content" :rules="{ required: true, message: '必填' }">
            <keyListener v-model="curItem.content" type="textarea" :rows="3" size="small" inputRef="inputFocus" placeholder="" />
          </el-form-item>
          <el-form-item v-for="(item, index) in curItem.titleList" v-show="!item.fixed" :key="index" :label="item.name">
            <el-input v-model="item.value" @input="$forceUpdate()" :ref="'test' + index"></el-input>
          </el-form-item>
          <el-form-item v-if="curItem.titleList.length === 2">
            暂无数据，如需添加额外内容，请进高级功能设置表头字段
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" v-if="!isSuper" class="dialog-footer">
        <el-button
          @click="
            isSuper = false;
            visible = false;
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="saveMethod">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修约配置" :visible.sync="revisionBox">
      <revisionL :appendtobody="true" :model.sync="revisionRules"></revisionL>
      <span slot="footer" v-if="!isSuper" class="dialog-footer">
        <el-button @click="revisionBox = false">取 消</el-button>
        <el-button type="primary" @click="saveRevision">保 存</el-button>
      </span>
    </el-dialog>
    <tagComponent ref="tagscomponent" :isBatchLabe="false" @submit="saveTags" @close="getDataList"></tagComponent>
  </div>
</template>
<script>
import revisionL from "@/components/tools/revisionL/revisionL.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import tagComponent from "@/components/tools/tagComponent.vue";
import tableHeadShowList from "@/components/tools/tableHeadShowList.vue";
import keyListener from "@/components/tools/keyListener.vue";
import { getTitle } from "../../../components/tools/TreeShip/titleList";
export default {
  name: "evaluateDetail",
  data() {
    return {
      visible: false,
      isSuper: false,
      revisionBox: false,
      methodAction: "",
      form: {
        methodType: "ALL",
        revisionStatus: "ALL",
        labelIds: [],
        structureId: this.$route.params.id,
        keyWords: "",
        current: 0,
        pageSize: 30
      },
      action: this.$route.query.action,
      curId: "",
      revisionRules: [],
      curItem: {
        titleList: []
      },
      tags: [],
      titleList: [],
      dataList: [],
      evaluate: { idAndNameList: [], businessCategoryIds: [] },
      totalPage: 0,
      totalNum: 0,
      evaluateId: this.$route.params.id
    };
  },
  watch: {
    visible(val) {
      if (!val) {
        this.$refs.inputForm.resetFields();
      }
    },
    $route(val) {
      this.evaluateId = val.params.id;
      this.form.structureId = val.params.id;
      this.action = val.query.action;
    }
  },
  components: { pagniation, SearchBox, tagComponent, tableHeadShowList, revisionL, keyListener },
  activated() {
    this.getTitleList();
    this.getDataList();
  },
  methods: {
    filterHandler(value, row, column) {
      return !row.fixed;
    },
    getRealTitle() {
      if (!this.evaluate.idAndNameList) {
        return [];
      }
      return this.evaluate.idAndNameList.filter(item => {
        if (item.display) {
          return item;
        }
      });
    },
    saveRevision() {
      this.$http.evaluateService.updateMethodRevision(this.curId, { revisionRules: this.revisionRules }).then(() => {
        this.getDataList();
        this.revisionBox = false;
      });
    },
    saveMethod() {
      let list = this.curItem.titleList.filter(item => {
        if (!item.fixed) {
          return item;
        }
      });
      this.curItem.dataQueryList = list.map(item => {
        return {
          structureId: item.id,
          value: item.value
        };
      });
      if (this.methodAction === "create" || this.methodAction === "copy") {
        this.$http.evaluateService
          .createMethod(this.curItem)
          .then(() => {
            this.$message.success("创建成功");
            this.visible = false;
          })
          .then(this.getDataList);
      } else {
        this.$http.evaluateService
          .updateMethod(this.curItem.id, this.curItem)
          .then(() => {
            this.$message.success("编辑成功");
            this.visible = false;
          })
          .then(this.getDataList);
      }
    },
    createMethod() {
      this.methodAction = "create";
      this.visible = true;
      this.isSuper = false;
      this.curItem = {
        methodType: "ACQUISITION_METHOD",
        content: "",
        businessCategoryIds: this.evaluate.businessCategoryIds,
        businessClassification: this.evaluate.businessClassification,
        structureId: this.evaluateId,
        titleList: JSON.parse(JSON.stringify(this.titleList)),
        dataQueryList: []
      };
    },
    revisionRule(methodId) {
      this.curId = methodId;
      this.$http.evaluateService.getMethodRevision(methodId).then(res => {
        this.revisionRules = res.data || [];
        this.revisionBox = true;
      });
    },
    editTags(id) {
      this.$http.evaluateService.getMethodsById(id).then(res => {
        this.curItem = res.data;
        this.curItem.titleList = [];
        const { materialLabelIds, industryLabelIds, customLabelIds } = this.curItem;
        this.$refs.tagscomponent.openDialog(materialLabelIds, industryLabelIds, customLabelIds);
      });
    },
    openTags() {},
    getTags(query) {
      if (query !== "") {
        this.$http.labelBankService.getLabel({ keywords: query }).then(res => {
          this.tags = res.data;
        });
      } else {
        this.tags = [];
      }
    },
    addTitle() {
      this.titleList.push({
        display: true,
        fixed: false,
        name: ""
      });
    },
    deleteTitle(item) {
      this.$confirm(
        "该表头在列表下可能已有数据，请确认是否删除？一旦删除，该表头下的所有数据都将从列表中删除，请谨慎操作。",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$http.evaluateService.deleteStructure(this.evaluateId, item.id).then(this.getTitleList);
      });
    },
    saveTitle(item) {
      item.update = null;
      this.$http.evaluateService
        .saveStructure(this.evaluateId, {
          businessCategoryIds: this.evaluate.businessCategoryIds,
          businessClassification: this.evaluate.businessClassification,
          structureIdAndNameList: this.titleList
        })
        .then(() => {
          this.$message.success("保存成功");
        })
        .then(this.getTitleList);
    },
    getTitleList() {
      this.$http.evaluateService.getMethodsStructure(this.evaluateId).then(res => {
        this.evaluate = res.data;
        let { idAndNameList } = this.evaluate;
        this.titleList = JSON.parse(JSON.stringify(idAndNameList));
      });
    },
    setSuper() {
      this.visible = true;
      this.isSuper = true;
    },
    saveSuper() {
      this.$http.evaluateService
        .saveSuper()
        .then(() => {
          this.$message.success("设置成功");
        })
        .then(this.getTitleList);
    },
    saveTags(params, cb) {
      this.$http.evaluateService
        .putTags(this.curItem.id, {
          labelIds: params.labelIds,
          labelType: params.labelType
        })
        .then();
      cb();
    },
    edit(id) {
      this.methodAction = "edit";
      this.$http.evaluateService.getMethodsById(id).then(res => {
        this.curItem = res.data;
        this.curItem.titleList = this.titleList.map(item => {
          let obj = res.data.dataQueryList.find(jtem => {
            if (jtem.structureId === item.id) {
              return jtem;
            }
          });
          return { id: item.id, name: item.name, fixed: item.fixed, display: item.display, value: obj ? obj.value : "" };
        });
        this.visible = true;
        this.isSuper = false;
      });
    },
    copy(id) {
      this.$http.evaluateService.getMethodsById(id).then(res => {
        this.curItem = res.data;
        this.curItem.titleList = this.titleList.map(item => {
          let obj = res.data.dataQueryList.find(jtem => {
            if (jtem.structureId === item.id) {
              return jtem;
            }
          });
          return { id: item.id, name: item.name, fixed: item.fixed, display: item.display, value: obj ? obj.value : "" };
        });
        this.curItem.materialLabelIds = [];
        this.curItem.industryLabelIds = [];
        this.curItem.customLabelIds = [];
        this.curItem.labelIds = [];
        this.methodAction = "copy";
        this.visible = true;
        this.isSuper = false;
      });
    },
    deleteMethod(id) {
      this.$confirm("是否删除此方法?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.evaluateService.deleteMethod(id).then(() => {
          this.$message.success("删除成功");
          this.getDataList();
        });
      });
    },
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    getDataList(flag = false) {
      if (flag) {
        this.form.current = 0;
      }
      this.$http.evaluateService.getMethods(this.form).then(res => {
        this.dataList = res.data.content;
        this.totalPage = res.data.totalPages;
        this.totalNum = res.data.totalElements;
      });
    },
    resetForm() {
      this.form.methodType = "ALL";
      this.form.revisionStatus = "ALL";
      this.form.labelIds = [];
      this.form.keyWords = "";
      this.form.current = 0;
      this.form.pageSize = 30;
      this.getDataList();
    }
  }
};
</script>
<style lang="scss" scoped>
.iconfont {
  cursor: pointer;
}
</style>

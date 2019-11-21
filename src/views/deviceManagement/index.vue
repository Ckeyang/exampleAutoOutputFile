<template>
  <div class="content-warp">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="6">
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
              <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键字">
            <el-input
              v-model="form.keyWords"
              size="small"
              placeholder="请输入关键字"
              v-on:keyup.enter.native="getDataList"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col class="search-btn-box">
          <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-col>
      </template>
    </search-box>
    <div class="diathesis-box regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">设备列表</h5>
        <div>
          <el-button size="small" icon="iconfont icon-piliangtianjiabiaoqian" :disabled="choiseItems.length === 0" @click="openMultipleTag"
            >批量添加标签</el-button
          >
          <el-button size="small" icon="iconfont icon-xiazai" @click="downLoadTemplate">下载模板</el-button>
          <el-button
            size="small"
            icon="iconfont icon-daoru"
            v-if="checkAuth('RBAC_PERMISSION_api_app_equipment_importEquipment_POST')"
            @click="importlist"
            >导入</el-button
          >
          <el-button size="small" icon="iconfont icon-daochu" @click="exportList">导出</el-button>
          <el-popover placement="bottom" width="100" trigger="click" style="margin-right:0">
            <div class="tableHeadChoiceBox">
              <el-checkbox-group v-model="checkedTrList" @change="handleCheckedTrChange">
                <el-checkbox v-for="item in trDataList" :label="item" :key="item">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div style="border-top:1px solid #E6ECF5;margin:15px 0"></div>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-button size="small" icon="iconfont icon-biaoqian" @click="dialogVisible = false" slot="reference"
              >设置显示列</el-button
            >
          </el-popover>
        </div>
      </div>
      <div v-loading="isUpload">
        <vxe-table
          :data="dataList"
          :max-height="winHeight - 370"
          :key="tableKey"
          show-header-overflow
          show-overflow
          highlight-hover-row
          style="width:100%"
          ref='vxeTable'
          v-loading='renderLoading'
          @select-change="handleSelectionChange"
          @select-all="handleSelectionChange"
          :optimization='{scrollY:{gt:200}}'
        >
          <vxe-table-column type="selection" width="55"></vxe-table-column>
          <vxe-table-column
            v-for="item of showTrList"
            :key="item.filed"
            :title="item.name"
            :field="item.filed"
            min-width="150"
          ></vxe-table-column>
          <vxe-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <div class="operation-icon">
                <i class="iconfont icon-i-biaoqian" @click="addTags(scope.row)">标签</i>
                <i class="iconfont icon-shanchu" @click="remove(scope.row.id)">删除</i>
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
      <pagniation
        :totalPage="totalPage"
        :currentPage="form.current"
        :totalNum="totalNum"
        @changePage="handleChangePage"
      ></pagniation>
    </div>
    <download ref="downLoadComponent" />
    <import-excle @importExcleData="importExcleData" type="EXCEL" ref="importExcle"></import-excle>
    <tagComponent ref="multipleTag" :isBatchLabe="isBatchLabe" @submit="saveMultipleTag" @close="getDataList"></tagComponent>
  </div>
</template>
<script>
import pagniation from "@/components/tools/Pagniation.vue";
import download from "@/components/tools/download.vue";
import importExcle from "@/components/tools/ImportExcle.vue";
import tagComponent from "@/components/tools/tagComponent.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import { mapGetters } from "vuex";
export default {
  name:'deviceParameters',
  data() {
    return {
      form: {
        keyWords: "",
        current: 0,
        pageSize: 30
      },
      isUpload: false,
      totalNum: "", //总数量
      totalPage: "", //总页数
      dataList: [], //设备列表
      renderLoading:false,
      choiseItems: [],
      tags: {
        ids: [],
        labelIds: [],
        labelType: ""
      },
      curId: "",
      tagList: [],
      tableKey: 0,
      isBatchLabe: false,
      dialogVisible: false, //动态表头选择框
      trDataList: [
        "序号",
        "设备分类",
        "仪器设备名称",
        "规格型号",
        "仪器管理编号",
        "检出限",
        "校准日期",
        "校准系数",
        "检定/校准证书",
        "量程最小值",
        "量程最大值",
        "生产厂家",
        "到货时间",
        "出厂编号",
        "备注"
      ], //设备所有表头列表
      checkAll: false,
      checkedTrList: ["仪器设备名称", "规格型号", "仪器管理编号", "生产厂家"], //选中的表头
      isIndeterminate: true
    };
  },
  components: {
    pagniation,
    download,
    importExcle,
    tagComponent,
    SearchBox
  },
  activated() {
    this.getDataList();
  },
  computed: {
    ...mapGetters(["checkAuth"]),
    /**
     *  private String no;   //序号
     *  private String classification;  //分类
     *  private String equipmentName;   //名称
     *  private String specification;  //规格型号
     *  private String serialNum;   //仪器管理编号
     *  private String detectionLimit;  //检出限
     *  private String calibrationDate;  //校准日期
     *  private String calibrationCoefficient; //校准系数
     *  private String calibrationCertificate;//检定/校准证书
     *  private String rangeMinimum;  //量程最小值
     *  private String rangeMaximum;   //量程最大值
     *  private String manufacturer;  //生产厂家
     *  private String arrivalDate;   //到货时间
     *  private String manufactureSerialNum;  //出厂编号
     *  private String note;  //备注
     */
    showTrList() {
      this.tableKey++; //重新渲染table，防止抖动
      return this.checkedTrList.map(item => {
        let filed = "";
        switch (item) {
          case "序号":
            filed = "no";
            break;
          case "设备分类":
            filed = "classification";
            break;
          case "仪器设备名称":
            filed = "equipmentName";
            break;
          case "规格型号":
            filed = "specification";
            break;
          case "仪器管理编号":
            filed = "serialNum";
            break;
          case "检出限":
            filed = "detectionLimit";
            break;
          case "校准日期":
            filed = "calibrationDate";
            break;
          case "校准系数":
            filed = "calibrationCoefficient";
            break;
          case "检定/校准证书":
            filed = "calibrationCertificate";
            break;
          case "量程最小值":
            filed = "rangeMinimum";
            break;
          case "量程最大值":
            filed = "rangeMaximum";
            break;
          case "生产厂家":
            filed = "manufacturer";
            break;
          case "到货时间":
            filed = "arrivalDate";
            break;
          case "出厂编号":
            filed = "manufactureSerialNum";
            break;
          case "备注":
            filed = "note";
            break;
        }
        return { name: item, filed };
      });
    }
  },
  methods: {
    getTags(query) {
      if (query !== "") {
        this.$http.labelBankService.getLabel({ keywords: query }).then(res => {
          this.tagList = res.data;
        });
      } else {
        this.tagList = [];
      }
    },
    saveMultipleTag(data, cb) {
      this.isBatchLabe
        ? (this.tags.ids = this.choiseItems.map(item => {
            return item.id;
          }))
        : (this.tags.ids = [this.curId]);
      this.tags.labelIds = data.labelIds;
      this.tags.labelType = data.labelType;
      cb();
      this.$http.deviceService.saveDeviceTags(this.tags).then(res => {
        this.$message.success("设置成功");
        // this.getDataList();
      });
    },
    //获取设备列表
    getDataList() {
      this.isUpload = false;
      this.renderLoading = true
      this.$http.deviceService.getDevicesList(this.form).then(res => {
        this.dataList = res.data.content;
        this.totalNum = res.data.totalElements;
        this.totalPage = res.data.totalPages;
        this.$nextTick(()=>{
          this.$refs.vxeTable.refreshData()
        })
      }).finally(()=>{
        this.renderLoading = false;
      });
    },
    addTags(item) {
      this.isBatchLabe = false;
      this.curId = item.id;
      let { materialLabelIds, industryLabelIds, customLabelIds } = item;
      this.$refs.multipleTag.openDialog(materialLabelIds, industryLabelIds, customLabelIds);
    },
    remove(id) {
      this.$confirm("此操作将永久删除该设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.deviceService.removeDevice(id).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getDataList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    openMultipleTag() {
      this.isBatchLabe = true;
      this.$refs.multipleTag.openDialog();
    },
    handleSelectionChange(val) {
      this.choiseItems = val;
    },
    //获取表格选择项
    handleSelectionChange({selection}) {
      this.choiseItems = selection;
    },
    //导入列表
    importlist() {
      this.$refs.importExcle.dialogVisible = true;
    },
    //导出列表
    exportList() {
      this.$http.deviceService.exportTemplate().then(res => {
        window.open(res.data);
        // this.$refs.downLoadComponent.download(
        //   this.$http.deviceService.doenLoad(res.data)
        // );
      });
    },
    //导入excel返回的url
    importExcleData(url) {
      this.isUpload = true;
      this.$http.deviceService
        .importTemplate({ path: url })
        .then(res => {
          this.$message({
            type: "success",
            message: "导入成功"
          });
          this.getDataList();
        })
        .catch(this.getDataList);
    },
    //下载模板
    downLoadTemplate() {
      this.$http.deviceService.downLoadTemplate().then(res => {
        this.$refs.downLoadComponent.download(res.data.url);
      });
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    //全选
    handleCheckAllChange(val) {
      this.checkedTrList = val ? this.trDataList : [];
      this.isIndeterminate = false;
    },
    //判断是否全选了
    handleCheckedTrChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.trDataList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.trDataList.length;
    },
    resetForm() {
      this.form.keyWords = "";
      this.form.labelIds = [];
      this.getDataList();
    }
  }
};
</script>
<style scoped>
.search-box {
  background: #fff;
  border-radius: 5px;
}
.search-row {
  border-bottom: 1px solid #edf1f7;
  padding: 15px;
  line-height: 40px;
  height: 40px;
  box-sizing: content-box;
}
.search-row > .el-col {
  margin-right: 30px;
  text-align: center;
  width: 245px;
}
.diathesis-box {
  margin-bottom: 13px;
}
.diathesis-box >>> .el-popover {
  padding-right: 0;
}
.tableHeadChoiceBox {
  max-height: 400px;
  overflow: auto;
}
.iconfont {
  cursor: pointer;
}
</style>

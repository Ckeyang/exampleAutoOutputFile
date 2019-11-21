<template>
  <div style="height:100%">
    <search-box :form="form">
      <template slot="input">
        <el-col :span="5">
          <el-form-item label="关键字">
            <el-input
              v-model="form.keywords"
              size="small"
              placeholder="请输入关键字"
              clearable
              @keyup.enter.native="getDiathisiList(true)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="业务类别">
            <el-select
              v-model="form.evaluationCategory"
              placeholder="请选择业务类别"
              @change="getSubstanceCategoryList"
              size="small"
              style="width:100%"
            >
              <el-option
                v-for="item in evaluationCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="物质类别">
            <el-cascader
              :options="substanceCategoryList"
              :props="defualtProps"
              change-on-select
              clearable
              v-model="form.substanceCategoryType"
              placeholder="请选择物质类别"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col class='search-btn-box'>
          <el-button type="primary" size="small" icon="el-icon-search" @click="getDiathisiList(true)">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh"  @click="resetForm">重置</el-button>
        </el-col>
      </template>
    </search-box>
    <!-- 因素列表 -->
    <div class="diathesis-box regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="table-title">物质因素列表</h5>
      </div>
      <div
        v-if="currentSubstanceCategoryType !== 'CHEMISTRY' && currentSubstanceCategoryType !== 'BIOLOGY' "
      >
        <el-table  :data="dataList" style="width:100%" size="small" :empty-text="tableEmptyText">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column label="业务分类" prop="businessClassification"></el-table-column>
          <el-table-column label="业务类别" prop="detectionCategory"></el-table-column>
          <el-table-column label="所属检测类别" prop="detectionCategory"></el-table-column>
          <el-table-column label="物质代号" prop="codeName"></el-table-column>
          <el-table-column label="物质名称" prop="name"></el-table-column>
          <!-- <el-table-column label="限值有效位" prop></el-table-column>
          <el-table-column label="限值规定名称">
            <template >
              <span>{{limitName}}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            label="查看详情"
            width="120"
            center
            v-if="currentSubstanceCategoryType !== 'DISSOCIATE_SILICA' && currentSubstanceCategoryType !== 'OTHER' && currentSubstanceCategoryType"
          >
            <template slot-scope="scope">
              <div class="operation-icon">
                <i class="iconfont icon-chakan" @click="checkMore(scope.row.identifier)">查看详情</i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <chemistry :dataList="dataList" v-else-if="currentSubstanceCategoryType === 'CHEMISTRY'"/>
      <biology :dataList="dataList" v-else-if="currentSubstanceCategoryType === 'BIOLOGY'"/>
      <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage" ref='pagniation'></pagniation>
    </div>
    <component :is="componentName"  :dataList="detaildDataList"></component>
    <!-- <high-themperature
      :dataList="detaildDataList"
      is="currentSubstanceCategoryType === 'HIGH_TEMPERATURE'"
    /> -->
    <!-- <noise :dataList="detaildDataList" v-if="currentSubstanceCategoryType === 'NOISES'"/>
    <ultraviolet-radiationTable
      :dataList="detaildDataList"
      v-else-if=" currentSubstanceCategoryType ==='ULTRAVIOLET_RADIATION'"
    />
    <highFrequency-radiation
      :dataList="detaildDataList"
      v-else-if=" currentSubstanceCategoryType ==='UHF_RADIATION'"
    />
    <highFrequency-electromagnetic
      :dataList="detaildDataList"
      v-else-if=" currentSubstanceCategoryType ==='HF_ELECTROMAGNETIC_FIELD'"
    />
    <microwave-adiation
      :dataList="detaildDataList"
      v-else-if=" currentSubstanceCategoryType ==='MICROWAVE'"
    />
    <handTransmitted-vibration
      :dataList="detaildDataList"
      v-else-if=" currentSubstanceCategoryType ==='HAND_VIBRATION'"
    />
    <powerFrequency-electric
      :dataList="detaildDataList"
      v-else-if=" currentSubstanceCategoryType ==='POWER_FREQUENCY_ELECTRIC_FIELD'"
    /> -->
  </div>
</template>
<script>
import highThemperature from "./components/highThemperature.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import noise from "./components/noise.vue";
import chemistry from "./components/chemistry.vue";
import biology from "./components/biology.vue";
import ultravioletRadiationTable from "./components/ultravioletRadiationTable.vue";
import highFrequencyRadiation from "./components/highFrequencyRadiation.vue";
import highFrequencyElectromagnetic from "./components/highFrequencyElectromagnetic.vue";
import microwaveAdiation from "./components/microwaveAdiation.vue";
import handTransmittedVibration from "./components/handTransmittedVibration.vue";
import powerFrequencyElectric from "./components/powerFrequencyElectric.vue";
import SearchBox from "@/components/tools/searchBox.vue";
export default {
  name:'substanceFactor',
  data() {
    return {
      form: {
        keywords: "",
        categoryType:'',
        evaluationCategory: "",
        substanceCategoryType: [],
        pageSize: 30,
        current: 0
      },
      defualtProps: {
        label: "name",
        children: "subclass",
        value: "substanceCategoryType"
      },
      tableEmptyText:'暂无数据，请选择业务类别！',
      currentSubstanceCategoryType: "", //当前的物质类别
      totalNum: "", //总数量
      totalPage: "", //总页数
      categoryTree:[], // 业务类别树
      categoryTypeList:[], //业务分类列表
      evaluationCategoryList: [], //业务类别列表
      substanceCategoryList: [], //物质类别列表
      dataList: [], //因素列表
      detaildDataList: [] //物质详情列表
    };
  },
  components: {
    highThemperature,
    noise,
    chemistry,
    biology,
    ultravioletRadiationTable,
    pagniation,
    highFrequencyRadiation,
    powerFrequencyElectric,
    handTransmittedVibration,
    microwaveAdiation,
    highFrequencyElectromagnetic,
    SearchBox
  },
  created() {
    // this.getDiathisiList('','init');
    this.getCategories();
  },
  computed: {
    componentName(){
      this.detaildDataList = []
      switch(this.currentSubstanceCategoryType){
        case 'HIGH_TEMPERATURE': return 'highThemperature'
        case 'NOISES': return 'noise'
        case 'ULTRAVIOLET_RADIATION': return 'ultravioletRadiationTable'
        case 'UHF_RADIATION': return 'highFrequencyRadiation'
        case 'UHF_RADIATION': return 'highFrequencyRadiation'
        case 'HF_ELECTROMAGNETIC_FIELD': return 'highFrequencyElectromagnetic'
        case 'MICROWAVE': return 'microwaveAdiation'
        case 'HAND_VIBRATION': return 'handTransmittedVibration'
        case 'POWER_FREQUENCY_ELECTRIC_FIELD': return 'powerFrequencyElectric'
      }
    },
    limitName() {
      let obj = this.substanceCategoryList.find(
        item => item.substanceCategoryType === "PHYSICS"
      );
      let subObj;
      if (obj) {
        subObj = obj.subclass.find(
          item =>
            item.substanceCategoryType === this.currentSubstanceCategoryType
        );
      }
      return subObj ? subObj.name : "";
    }
  },
  watch:{
    'form.evaluationCategory':function(val){
      this.tableEmptyText = val ? '暂无数据':'暂无数据，请选择业务类别！'
    }
  },
  methods: {
    //获取数据
    getDiathisiList(isRefresh = false) {
      const { evaluationCategory } = this.form
      if(!evaluationCategory){
         this.$message.error('请选择业务类别！')
        return
      }
      this.tableEmptyText = '暂无数据！'
      if(isRefresh){
        this.form.current = 0;
        this.$refs.pagniation.refreshPage()
      }
      let len = this.form.substanceCategoryType.length;
      this.currentSubstanceCategoryType = len
        ? this.form.substanceCategoryType[len - 1]
        : "";
      // this.dataList = []; //因素列表
      // this.detaildDataList = []; //物质详情列表
      const { pageSize, current, keywords } = this.form;
      this.$http.paramterService
        .getDiathisiList({
          pageSize,
          current,
          keywords,
          categoryId:evaluationCategory,
          type: len ? this.form.substanceCategoryType[len - 1] : ""
        })
        .then(res => {
          this.dataList = res.data.content;
          this.totalNum = res.data.totalElements; //总数量
          this.totalPage = res.data.totalPages; //总页数
        });
    },
    getEvaluationCategoryList(id){
      this.evaluationCategoryList = this.findChildrenCategory(id, this.categoryTree)
      this.form.evaluationCategory = '';
      // this.substanceCategoryList = []
      this.dataList = []; //因素列表
      this.detaildDataList = []; //物质详情列表
      this.currentSubstanceCategoryType = ''
      this.tableEmptyText = '暂无数据，请选择业务类别！'
      this.form.current = 0;
      this.totalNum = 0;
      this.totalPage = 0;
      this.$refs.pagniation.refreshPage()
    },
    /**
     * 获取评价分类树
     */
    getCategories() {
      this.$http.reportService.getCategoryTree().then(res => {
        if(!res.data || !res.data[0]){
          this.$message.error('请先创建业务类别!');
          return 
        }
        this.categoryTypeList = res.data.map(item => ({
          id: item.id,
          name: item.name
        }));
        this.categoryTree = res.data
      });
    },
    findChildrenCategory(id, data) {
      return data.find(item => item.id === id).childList
    },
    //获取物质类别
    getSubstanceCategoryList(id) {
      // this.form.substanceCategoryType = [];
      this.$http.paramterService
        .getSubstanceCategoryList({ detectionCategoryId: id })
        .then(res => {
          this.substanceCategoryList = this.reloadMaterialType(res.data || []);
        });
    },
    //查看详情
    checkMore(id) {
      this.$http.paramterService.getSubstanceDetails(id).then(res => {
        this.detaildDataList = res.data;
      });
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDiathisiList();
    },
    /**
     * 过滤subclass为空
     */
    reloadMaterialType(data) {
      let result = [];
      data.map(item => {
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
    resetForm() {
      this.form ={
        keywords: "",
        categoryType:'',
        evaluationCategory: "",
        substanceCategoryType: [],
      },
      this.currentSubstanceCategoryType = "";
      this.dataList = [];
      this.detaildDataList = [];
      this.$refs.pagniation.refreshPage()
      this.getDiathisiList();
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
</style>

<template>
  <div class="diathesis-box regulation-tb box-style_common" v-show='dataList.length'>
    <div class="tools-bar_common">
      <h5 class="table-title">物质因素列表</h5>
    </div>
    <div>
      <el-table  :data="dataList" style="width:100%" border size="small" :max-height='winHeight - 346'>
        <el-table-column label="紫外光谱分类" prop>
          <template slot-scope="scope">
            <span>{{transformValue(scope.row.occupationalHealthLimit)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="8H辐照度(μW/cm2)" prop='exposureOfWorkday'></el-table-column>
        <el-table-column label="8H照射量(mJ/cm2)" prop='irradianceOfWorkday'></el-table-column>
      </el-table>
    </div>
    <!-- <Pagniation/> -->
  </div>
</template>
<script>
// import Pagniation from "@/components/tools/Pagniation.vue";
export default {
  name: "ultravioletRadiationTable",
  data() {
    return {};
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        [];
      }
    }
  },
  components: {
    // Pagniation
  },
  // props: ["dataList"],
  methods: {
    transformValue(type) {
      switch (type) {
        case "UVB":
          return "中波紫外线";
        case "UVC":
          return "短波紫外线";
        case "ARC_WELDING_LIGHT":
          return "电焊弧光";
        case "ARC_WELDING_OF_THREESIXFIVE":
          return "电焊弧光(波段=365)";
        case "ARC_WELDING_OF_TWONINEZERO":
          return "电焊弧光(波段=290)";
        case "ARC_WELDING_OF_TWOFIVEFOUR":
          return "电焊弧光(波段=254)";
        case "MICROWAVE_OF_CONTINUOUS":
          return "连续微波";
        case "MICROWAVE_OF_PULSE":
          return "脉冲微波";
        case "MICROWAVE_OF_CONTINUOUS_OR_PULSE":
          return "连续微波或脉冲微波";
      }
    }
  }
};
</script>

<style scoped>
</style>
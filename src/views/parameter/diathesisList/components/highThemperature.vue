<template>
  <div class="diathesis-box regulation-tb box-style_common" v-show='dataList.length'>
    <div class="tools-bar_common">
      <h5 class="table-title">具体限值规定-高温</h5>
    </div>
    <div>
      <p style="font-size:12px;margin-bottom:10px;color:#3C4551">高温劳动强度WBGT限值（℃）</p>
      <el-table  :data="dataList" style="width:100%" border size="small">
        <el-table-column label="接触时间">
          <template slot-scope="scope">
            <span>{{transformValue(scope.row.occupationalHealthLimit)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Ⅰ 级" prop="firstGrade"></el-table-column>
        <el-table-column label="Ⅱ 级" prop="secondGrade"></el-table-column>
        <el-table-column label="Ⅲ 级" prop="thirdGrade"></el-table-column>
        <el-table-column label="Ⅳ 级" prop="fourthGrade"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "highThemperature",
  data() {
    return {
    };
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        [];
      }
    }
  },
  methods: {
    transformValue(type) {
      switch (type) {
        case "PERCENT_OF_HUNDRED":
          return "100%";
        case "PERCENT_OF_SEVENTY_FIVE":
          return "75%";
        case "PERCENT_OF_FIFTY":
          return "50%";
        case "PERCENT_OF_TWENTY_FIVE":
          return "25%";
      }
    }
  }
};
</script>

<style scoped>
</style>

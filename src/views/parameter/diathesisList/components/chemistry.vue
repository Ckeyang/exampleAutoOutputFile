<template>
  <el-table  :data="dataList" style="width:100%" border size="small" :max-height='winHeight - 346'>
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column label="所属检测类别" prop="detectionCategory" width="100"></el-table-column>
    <el-table-column label="物质代号" prop="codeName"></el-table-column>
    <el-table-column label="物质名称" prop="name" width="280"></el-table-column>
    <el-table-column label="限值规定名称" prop>
      <el-table-column label="MAC" prop="mac"></el-table-column>
      <el-table-column label="PC-TWA" prop="pctwa"></el-table-column>
      <el-table-column label="PC-STEL" prop="pcstel"></el-table-column>
      <el-table-column label="EL" prop="el"></el-table-column>
      <el-table-column label="PC-TWA总尘" prop="pctwaTotalDust"></el-table-column>
      <el-table-column label="PC-TWA呼尘" prop="pctwaRespirableDust"></el-table-column>
      <el-table-column label="IDLH浓度" prop="idlhConcentration"></el-table-column>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "chemistry",
  props: {
    dataList: {
      type: Array,
      default: () => {
        [];
      }
    }
  }
};
</script>

<style scoped>
</style>
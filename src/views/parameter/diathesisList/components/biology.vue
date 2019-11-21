<template>
  <el-table  :data="dataList" style="width:100%" border size="small" :max-height='winHeight - 346'>
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column label="所属检测类别" prop="detectionCategory"></el-table-column>
    <el-table-column label="物质代号" prop="codeName"></el-table-column>
    <el-table-column label="物质名称" prop="name"></el-table-column>
    <el-table-column label="限值规定名称" prop>
      <el-table-column label="MAC" prop="mac"></el-table-column>
      <el-table-column label="PC-TWA" prop="pctwa"></el-table-column>
      <el-table-column label="PC-STEL" prop="pcstel"></el-table-column>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "biology",
  props: ["dataList"],
};
</script>

<style scoped>
</style>
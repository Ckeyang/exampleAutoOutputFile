<template>
  <div class='block-checkbox'>
    <el-checkbox v-model='formAttribute.setFixedColumnWidth' @change='handleChange'>是否设置固定列宽</el-checkbox>
    <el-tooltip
      placement='top-start'
      effect='light'
      :offset='30'
    >
      <div
        slot='content'
        class='tips-content'
      >默认为自适应</div>
      <i class='tooltips-icon iconfont icon-wenhaomiaoshu'></i>
    </el-tooltip>
    <div v-if='formAttribute.setFixedColumnWidth'>
      <el-input
        v-model='formAttribute.fixedColumnWidth'
        style='width:100px'
        placeholder='列宽>=20px'
        size='mini'
        @blur='validateFixedColumnWidth'
      ></el-input>
      <span style='color:#606266'>（单位：px）</span>
    </div>
  </div>
</template>
<script>
export default {
  props:['formAttribute'],
  methods: {
    // 校验列宽设置
    validateFixedColumnWidth() {
      let val = this.formAttribute.fixedColumnWidth
      const reg = /^(-)?([1-9]\d*|0)$/
      if (!String(val) || !reg.test(Number(val))) {
        this.$message({
          message: '请输入有效的列宽',
          type: 'error',
          duration: '1000'
        })
        this.formAttribute.fixedColumnWidth = ''
      } else {
        if (Number(val) < 20) {
          this.$message({
            message: '列宽不能小于20px',
            type: 'error',
            duration: '1000'
          })
          this.formAttribute.fixedColumnWidth = 20
        }
        if (Number(val) > 1000) {
          this.$message({
            message: '列宽不能大于1000px',
            type: 'error',
            duration: '1000'
          })
          this.formAttribute.fixedColumnWidth = 1000
        }
      }
    },
    handleChange(val){
      val || (this.formAttribute.fixedColumnWidth = '')
    }
  }
};
</script>
<style scoped>
</style>

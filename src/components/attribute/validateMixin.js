export default {
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
        }
        if (Number(val) > 500) {
          this.$message({
            message: '列宽不能大于500px',
            type: 'error',
            duration: '1000'
          })
        }
      }
    }
  }
}

<template>
  <div class='com-input-box'>
    <div class='time-picker-box' :class="{'isFocus':isFocus,'disabled':cusDisabled}" @click="clickInput">
      <el-input
        type='input'
        class='timePicker'
        size='small'
        v-model='hour'
        ref='hour'
        :disabled="cusDisabled"
        @focus="isFocus = true"
        @blur="isFocus = false"
        @input='formatHour'
      ></el-input>
      <span class="colon">:</span>
      <el-input
        type='input'
        class='timePicker'
        size='small'
        ref='minute'
        :disabled="cusDisabled"
        @focus="isFocus = true"
        @blur="isFocus = false"
        @input='formatMin'
        v-model='minute'
      ></el-input>
    </div>
    <span class="time-tips">24小时制</span>
    <el-button type="text" class="nowTimeBtn" @click="getNowTime">获取系统时间</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hour: "",
      minute: "",
      isFocus: false // HOUR / MIN
    };
  },
  props: ["formValue","cusDisabled"], //   formValue表单控件的值
  watch: {
    "formValue.stringValue": {
      handler:function(val) {
        if(val){
          try {
            this.minute = val.match(/时(\S*)分/)[1]
            this.hour = val.match(/(\S*)时/)[1]
          } catch (error) {
            this.formValue.stringValue = ''
          }
        }else{
          this.minute = '';
          this.hour = ''
        }
        this.$emit('change', val)
      },
      immediate:true
    },
    isFocus(flag){
      if(!flag){
        if(!this.hour){
          this.minute && (this.hour = '00')
          return 
        }
        if((typeof this.hour === 'number' && this.hour <= 2) || (typeof this.hour === 'string' && this.hour.length === 1)){
          this.hour+='0'
        }
        let minute = this.minute.padEnd(2, '0')
        if(minute > 59){
          minute = '59'
        }
        console.log(this.hour,minute)
        this.minute = minute
        this.formValue.stringValue = `${this.hour}时${minute}分`;
      }
    }
  },
  methods: {
    formatHour(val) {
      this.$nextTick(() => {
          let newVal = val.replace(/[^\d]/g, "").substr(0, 2)
          if(newVal && newVal[0] != 0){
            newVal = Number(newVal) 
              if(newVal > 2 && newVal<= 9){
              newVal = '0'+ newVal
            }else if(newVal > 23){
              newVal = '23'
            }
          }
        this.hour = newVal;
        if((newVal.length >= 2) || (typeof newVal === 'number' && newVal.toString().length >= 2)) {
          this.$refs.minute.focus();
          this.$refs.minute.select();
        }
      });
    },
    formatMin(val) {
      this.$nextTick(() => {
        let newVal = val.replace(/[^\d]/g, "").substr(0, 2)
        this.minute = newVal
        if(newVal.length >= 2){
          this.$refs.minute.blur()
          // 取消聚焦
        }
      });
    },
    clickInput(){
      this.$refs.hour.select() // 无力吐槽的需求
    },
    //获取当前时间
    getNowTime(){
      const date = new Date()
      let hour = date.getHours()
      let minute = date.getMinutes()
      hour = hour < 10 ? '0'+hour : hour
      minute = minute < 10 ? '0'+ minute : minute
      this.formValue.stringValue = hour + '时'+ minute + '分'
    }
  },
};
</script>
<style scoped>
.com-input-box {
  max-width: 500px;
}
.colon{
  font-weight: bold
}
.time-picker-box.disabled{   
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
.nowTimeBtn{
  position: absolute;
  top: 3px;
  left: 230px;
  font-size: 12px;
}
.time-tips{
  color: #BFBFBF;
  position: absolute;
  top: 5px;
  line-height: 34px;
  left: 146px;
  font-size: 12px;
}
.time-picker-box {
  width: 125px;
  height: 32px;
  line-height: 30px;
  background: #fff;
  border-radius: 4px;
  margin: 5px 0;
  border: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
}
.time-picker-box >>> .timePicker {
  width: 60px;
}
.timePicker >>> .el-input__inner {
  text-align: center;
  border: none !important;
  outline: none !important;
  box-shadow: inherit !important;
}
 
</style>

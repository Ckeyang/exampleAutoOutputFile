<template>
  <div>
    <div class="com-input-box">
      <el-form label-position="top" label-width="80px" :model="formValue" @submit.native.prevent>
        <el-form-item v-if="formAttribute.dateType === 'TIME'">
          <date-time-picker
            :disabled="!formAttribute.fillable"
            :formValue="formValue"
            :cus-disabled="!formAttribute.fillable"
            @change='handelChange'
          />
        </el-form-item>
        <el-form-item v-if="formAttribute.dateType === 'YEAR'">
          <el-date-picker
            v-model="formValue.stringValue"
            type="year"
            format="yyyy年"
            value-format="yyyy年"
            placeholder="请选择年代"
            size="small"
            @change='handelChange'
            :disabled="!formAttribute.fillable"
          ></el-date-picker>
        </el-form-item>
        <el-form-item v-if="formAttribute.dateType ==='YEAR_MONTH'">
          <el-date-picker
            v-model="formValue.stringValue"
            type="month"
            format="yyyy年MM月"
            value-format="yyyy年MM月"
            placeholder="请选择年月"
            size="small"
            :disabled="!formAttribute.fillable"
            @change='handelChange'
          ></el-date-picker>
        </el-form-item>
        <el-form-item v-if="formAttribute.dateType === 'YEAR_MONTH_DAY'">
          <el-date-picker
            v-model="formValue.stringValue"
            type="date"
            format="yyyy年MM月dd日"
            value-format="yyyy年MM月dd日"
            placeholder="请选择日期"
            size="small"
            :disabled="!formAttribute.fillable"
            @change='handelChange'
          ></el-date-picker>
        </el-form-item>
        <el-form-item v-if="formAttribute.dateType === 'YEAR_MONTH_DAY_TIME'">
          <el-date-picker
            v-model="formValue.stringValue"
            type="datetime"
            format="yyyy年MM月dd日 HH时mm分"
            value-format="yyyy年MM月dd日 HH时mm分"
            placeholder="选择日期时间"
            size="small"
            :disabled="!formAttribute.fillable"
            @change='handelChange'
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import dateTimePicker from "./DateTimePicker.vue";
import { formatDate } from "@/utils.js";
export default {
  data() {
    return {};
  },
  watch: {
    id(val) {
			this.initTime()
    },
    dateType() {
      this.formValue.stringValue = '';
    }
  },
  created() {
		this.initTime() // 自动获取当前时间
  },
  computed:{
    dateType(){
      return this.formAttribute.dateType
    }
  },
  components: { dateTimePicker },
  props:{
    formAttribute:{},
    formValue:{},
    id:{},
    type:{ // 当前组件所再的环境  template 、 form 
      default:'template'
    }
  },
  methods: {
		initTime(){
			if(this.type === 'form' && this.formAttribute.dateType === 'YEAR_MONTH_DAY' && !this.formValue.stringValue){
				// 没有值自动设置为当前时间
				this.formValue.stringValue = formatDate(new Date().getTime(),'yyyy年MM月dd日')
			}
    },
    handelChange(val) {
      if(val && this.formAttribute.ruleAvailable){
        this.$emit("handleApplyRule", val); // 去执行规则
      }
    },
	}
};
</script>
<style scoped>
.com-input-box {
  max-width: 500px;
}

.active-red {
  border-color: red;
}
</style>
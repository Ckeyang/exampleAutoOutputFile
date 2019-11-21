<template>
  <div class="address-box">
    <el-form label-position="top" label-width="80px" @submit.native.prevent>
      <el-form-item>
        <el-select
          v-model="formValue.addressValue.provinceValue"
          :disabled="!formAttribute.fillable"
          placeholder="省/自治区/直辖市"
          size="small"
          filterable
          :loading='loading'
          @focus="initProvinceData"
          @change="getProvinceData"
          value-key="id"
          style="width:33%"
        >
          <el-option
            v-for="item of provinceData"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
        <el-select
          v-model="formValue.addressValue.cityValue"
          :disabled="!formAttribute.fillable"
          placeholder="市"
          size="small"
          value-key="id"
          @change="getCountryData"
         style="width:33%"
        >
          <el-option v-for="item of cityData" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
        <el-select
          v-model="formValue.addressValue.countyValue"
          :disabled="!formAttribute.fillable"
          placeholder="区县"
          size="small"
          style="width:32%"
        >
          <el-option
            v-for="item of countryData"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
        <div class="streetValue-box">
          <el-input
            style="margin-right:5px;width:50%"
            type="textarea"
            :autosize="{ minRows: 2,maxRows:2}"
            :disabled="!formAttribute.fillable"
            clearable
            placeholder="乡镇"
            v-model="formValue.addressValue.townValue"
            v-if='!hideInput.includes("townValue")'
          ></el-input>
          <el-input
            style="flex-grow: 2"
            type="textarea"
            :autosize="{ minRows: 2,maxRows:2}"
            :disabled="!formAttribute.fillable"
            clearable
            placeholder="详细信息"
            v-model="formValue.addressValue.streetValue"
          ></el-input>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      provinceData: [],
      cityData: [],
      countryData: [],
      province: "", //选中的省会
      citys: "", //选中的城市
      loading:true, 
    };
  },
  props:{
    formAttribute:{},
    formValue:{},
    hideInput:{
      type:Array,
      default:()=> []
    }
  },
  created(){
    this.initProvinceData()
  },
  methods: {
    //初始化省会数据
    initProvinceData(){
      const provinceData = this.$store.state.Checkbox.captionsList
      if(provinceData.length){
        this.provinceData = provinceData;
        this.loading = false
        this.initCityData();
      }else{
        this.getAddressData("ZONE");
      }
    },
    // 初始化市
    initCityData(){
      const provinceValue = this.formValue.addressValue.provinceValue
      if(provinceValue){
        let data = this.provinceData.find(
          item => item.name === provinceValue
        );
        try {
          this.getAddressData(data.id, "PROVINCE");
        } catch (error) {}
      }
    },
    // 初始化区县
    initCountryData(){
      const cityValue = this.formValue.addressValue.cityValue
      console.log(cityValue)
      if(cityValue){
        let data = this.cityData.find(
          item => item.name === cityValue
        );
        try {
          this.getAddressData(data.id, "CITY");
        } catch (error) {} 
      }
    },
    //获取所有的省会
    getAddressData(id, type) {
      this.$http.statute.getCityesForId(id).then(res => {
        if (type === "PROVINCE") {
          this.cityData = res.data;
          this.initCountryData()
        } else if (type === "CITY") {
           
          this.countryData = res.data;
        } else {
          this.provinceData = res.data;
          this.loading = false
          this.initCityData()
          this.$store.commit({type:'saveCaptionsList', data : res.data}) //持久化数据
        }
      });
    },
    //获取选中的省会
    getProvinceData(value) {
      //清除历史数据
      this.formValue.addressValue.cityValue = "";
      this.formValue.addressValue.countyValue = "";
      this.cityData = [];
      this.countryData = [];
      let data = this.provinceData.filter(
        item => item.name === this.formValue.addressValue.provinceValue
      );
      this.getAddressData(data[0].id, "PROVINCE");
    },
    //获取选中的城市
    getCountryData(value) {
      //清除历史数据
      this.formValue.addressValue.countyValue = "";
      this.countryData = [];
      let data = this.cityData.filter(
        item => item.name === this.formValue.addressValue.cityValue
      );
      this.getAddressData(data[0].id, "CITY");
    }
  }
};
</script>
<style scoped>
.address-box {
	 max-width: 550px;
}
.streetValue-box{
  display: flex;
}

</style>
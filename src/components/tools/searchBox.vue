<template>
  <div class="search-box box-style_common">
    <el-form ref="form" :model="form" :label-width="labelWidth" @submit.native.prevent >
      <div class="paddingBox">
        <div class="flexBox">
          <slot name="input"></slot>
          <el-row class="search-btn-box">
            <slot name="button"></slot>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "searchBox",
  props: {
    form: { type: Object, default: function(){return {}} },
    labelWidth:{
      default:'80px'
    }
  }
};
</script>
<style  scoped>
.paddingBox {
  padding: 10px 10px;
}
.flexBox {
  display: flex;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  line-height: 50px;
  min-height: 50px;
}
.flexBox >>> .el-col:not(.search-btn-box){
  min-width: 230px;
}
</style>
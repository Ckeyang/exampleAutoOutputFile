<template>
  <div>
    <el-form ref="form" label-width="115px" label-position="left">
      <el-form-item label="判断条件" class="border-box" v-show='!judgeForm.defaultRule'>
        <el-tooltip   placement="top-start" effect="light" :offset='30'>
          <div slot="content" class="tips-content">1. 无需设置判断条件，也可直接输出某内容</div>
          <i class="tooltips-icon iconfont icon-wenhaomiaoshu"></i>
        </el-tooltip>
        <div style="position:relative;top:-40px;max-height:300px;overflow:auto">
          <tree-ship v-model="judgeForm.booleanExpressionList" :catogryType="catogryType" size='mini'>
            <template slot="name">如果</template>
          </tree-ship>
        </div>
      </el-form-item>
      <el-form-item label="满足条件输出" :rules="{ required: true}">
          <div class="palette" >
            <wang-editor
              ref="sharedEditor"
              editorId="sharedEditor"
              :height="'200px'"
              v-model="judgeForm.tenableOut"
              :isDisabledToolbar="false"
            ></wang-editor>
        </div>
        <el-button @click="choicSharePart" class="choicSharePart" size='medium'>插入共享件</el-button>
      </el-form-item>
    </el-form>
    <searchSharePart
      isRadio
      isShowProjectInfoBtn
      :catogryType='catogryType'
      @change="getCheckShareParts"
      ref="j-searchSharePart"
    />
  </div>
</template>
<script>
import WangEditor from "@/components/wangEditor/wangEditor.vue";
import TreeShip from "@/components/tools/TreeShip/TreeShip.vue";
import searchSharePart from "./searchSharePart.vue";
export default {
  name: "judgeRules",
  components: { searchSharePart, WangEditor, TreeShip },
  data() {
    return {
      judgeForm:{
        booleanExpressionList: [],
        enable: false,
        name: "",
        // untenableOut: "",
        tenableOut: "",
        orderNo: 0,
        defaultRule:false,
      },
      dimensionFieldList: [], //已选择的共享件
    };
  },
  props: {
    //共享件类型
    catogryType: {
      type: String
    }
  },
  methods: {
    setValue(data){
      this.judgeForm = data;
      this.setDefaultValue(data.tenableOut)
    },
    setDefaultValue(dom){
      this.$refs.sharedEditor.setDefaultValue(dom || '<p></br></p>');
    },
    clearEditorValue(){
      this.$refs.sharedEditor.clearEditorValue();
    },
    //设置共享件dom
    setEditorDom(dom) {
      this.$refs.sharedEditor.addHtml(dom);
    },
    createSpanDom(data, params = "id") {
      if(!data) return ''
      let dom =
        "<span style='color:red;text-decoration:underline' fieldid='" +
        data[params] +
        "'><strong>" +
        data.name +
        "</strong></span><span>&nbsp;</span>";
      return dom;
    },
    //选择共享件
    choicSharePart() {
      this.$refs['j-searchSharePart'].openDialog([])
    },
    //获取选择的共享件
    getCheckShareParts(data) {
      data.forEach(item =>{
        this.setEditorDom(this.createSpanDom(item, "id"));
      })
    },
    searchSharePartHide(){
      this.$refs['j-searchSharePart'].clearForm() //重置搜索条件
    },
    resetForm(){
      this.$refs.sharedEditor.clearEditorValue();
    },
  }
};
</script>

<style scoped>
.output-box,
.clearfix {
  display: flex;
  justify-content: space-between;
}
.box-card {
  width: 48.5%;
}
.palette {
  height: 220px;
}
.clearfix {
  line-height: 20px;
}
.output-box >>> .el-card__body {
  padding: 14px;
  min-height: 70px;
}
.box-card .text {
  margin-top: 10px;
  word-wrap: break-word;
  line-height: 20px;
  color: #68788c;
}
.box-card.is-always-shadow, .box-card.is-hover-shadow:focus, .box-card.is-hover-shadow:hover{
  box-shadow: none;
  border-color: #dcdfe6;
}
.choicSharePart {
  position: relative;
  top: -13px;
}
.tooltips-icon{
  position: relative;
  left:-54px;
  cursor: pointer;
}
.tips-content{
  color: #606266;
}
.border-box >>> .el-form-item__content{
  border: 1px solid #dcdfe6;
  border-radius: 5px;
}
</style>
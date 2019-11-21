<template>
    <li class="q_content" :class='{"dashBorder":sortIndex,"page-break":sortIndex,"base-q_content":model.type !== "CUSTOMBOX"}'>
        <div style="margin:5px 0 5px;">
            <span   class='name-style' :class='{"titleColor":sortIndex,"baseTitle":model.type !== "CUSTOMBOX"}'>{{model.name}}</span>
            <span class="question-box">
                <span v-if='model.type === "TEXTBOX" || model.checkType === "RADIOBOX" || model.type === "COMBOBOX" || model.type === "DATEPICKER"'>
                    &nbsp;&nbsp; &nbsp;{{model.formValue.stringValue}}
                </span>
                <span v-else-if='model.type === "CASCADER" || model.checkType === "CHECKBOX"'>
                    &nbsp;&nbsp; &nbsp;{{model.formValue.stringListValue.push(model.formValue.stringListValue).join(" / ")}}
                </span>
                <span v-else-if='model.type === "ADDRESSBOX"'>
                    &nbsp;&nbsp; &nbsp;{{Object.values(model.formValue.addressValue).split(' / ')}}
                </span>
            </span>
        </div>
        <div v-if='model.type ==="CUSTOMBOX" && isLoop && model.linesData.length'>
          <div class="sub-question" v-for='(lineIndex,index2) of model.linesData'
              :key='index2'>
            <ul class="dataNum">
                  <Print-preview v-for='(subItem,index) of lineIndex.oneLineData' :key='index' :model='subItem' :isLoop='isLoop' :titleIndex='titleIndex_Fn(index)'></Print-preview>
            </ul>
          </div>       
        </div>
    </li>
</template>
<script>
export default {
  name: 'Print-preview',
  props: ['model', 'sortIndex', 'isLoop', 'titleIndex'],
  data() {
    return {
      isCollapse: true
    };
  },
  computed: {
    IP() {
      return this.$store.state.Jurisdiction.IP;
    }
  },
  methods: {
    titleIndex_Fn(index) {
      if (index + 1) {
        return this.titleIndex + '-' + (index + 1);
      } else {
        return this.sortIndex;
      }
    }
  }
};
</script>
<style scoped>
.index-sort {
  font-size: 14px;
  font-weight: bold;
  color: #606266;
  position: absolute;
  /* left: -40px; */
}

.dataNum {
  border: 1px dashed #6062663b;
  margin-bottom: 15px;
  /* padding-right: 10px; */
}
.q_content.dashBorder {
  border: 1px dashed #6062663b;
}
.q_content {
  margin: 15px 17px 15px 17px;
  border: 1px solid #6062663b;
  padding: 0 20px;
  border-radius: 3px;
}
.name-style {
  font-family: 'MicrosoftYaHei-Bold';
  font-weight: bold;
  font-size: 14px;
  color: rgba(52, 58, 69, 1);
}
.first-index {
  top: 26px;
}
.titleColor {
  font-size: 16px;
  font-weight: 700;
  color: #5d687a !important;
}
.baseTitle {
  color: #343a45;
  font-weight: 400;
}
.base-q_content {
  padding: 0 10px;
}
.index-sort.split-line {
  top: 15px;
}

.question-box {
  color: #5d687a;
  font-size: 14px;
}
</style>
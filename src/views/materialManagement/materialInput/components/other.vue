<template>
  <div class="otherInput">
    <h3 id="OTHER">其他信息</h3>
    <el-form label-position="top">
      <el-form-item label="危险性概述"  v-show="isShow('haxardsSummarizing')">
        <keyListenerInput type="textarea" v-model="model.haxardsSummarizing" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="致癌、致敏、皮肤吸收会引起全身反应"  v-show="isShow('untowardEffect')&&model.substanceCategoryType === 'CHEMISTRY'">
        <el-checkbox-group v-model="model.untowardEffect">
          <el-checkbox label="皮"></el-checkbox>
          <el-checkbox label="G1"></el-checkbox>
          <el-checkbox label="G2B"></el-checkbox>
          <el-checkbox label="G4"></el-checkbox>
          <el-checkbox label="敏"></el-checkbox>
          <el-checkbox label="G2A"></el-checkbox>
          <el-checkbox label="G3"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否为高毒物质"  v-show="isShow('isExtremelyToxicSubstance')&&model.substanceCategoryType === 'CHEMISTRY'">
        <el-radio-group v-model="model.isExtremelyToxicSubstance">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="防护用品选用类型" v-show="isShow('choiceProtectiveArticles')&&model.substanceCategoryType === 'CHEMISTRY'" multiple>
        <!-- <keyListenerInput type="textarea" v-model="model.haxardsSummarizing" rows="3"></keyListenerInput> -->
        <el-select v-model="model.choiceProtectiveArticles" multiple style="width:300px;">
          <el-option value="颗粒物呼吸防护用品防护级别：KN90" label="颗粒物呼吸防护用品防护级别：KN90"></el-option>
          <el-option value="颗粒物呼吸防护用品防护级别：KN95" label="颗粒物呼吸防护用品防护级别：KN95"></el-option>
          <el-option value="颗粒物呼吸防护用品防护级别：KN100" label="颗粒物呼吸防护用品防护级别：KN100"></el-option>
          <el-option value="颗粒物呼吸防护用品防护级别：KP90" label="颗粒物呼吸防护用品防护级别：KP90"></el-option>
          <el-option value="颗粒物呼吸防护用品防护级别：KP95" label="颗粒物呼吸防护用品防护级别：KP95"></el-option>
          <el-option value="颗粒物呼吸防护用品防护级别：KP100" label="颗粒物呼吸防护用品防护级别：KP100"></el-option>
          <el-option value="防毒面具：送风过滤式半面罩" label="防毒面具：送风过滤式半面罩"></el-option>
          <el-option value="防毒面具：自吸过滤式半面罩" label="防毒面具：自吸过滤式半面罩"></el-option>
          <el-option value="防毒面具：送风过滤式全面罩" label="防毒面具：送风过滤式全面罩"></el-option>
          <el-option value="防毒面具：自吸过滤式全面罩" label="防毒面具：自吸过滤式全面罩"></el-option>
          <el-option value="防毒面具：隔绝式呼吸防护用品" label="防毒面具：隔绝式呼吸防护用品"></el-option>
          <!-- <el-option  value="防毒面具：送风过滤式全面罩" label="防毒面具：送风过滤式全面罩"></el-option > -->
          <el-option value="单一防毒：1号（B型）滤毒盒" label="单一防毒：1号（B型）滤毒盒"></el-option>
          <el-option value="单一防毒：3号（A型）滤毒盒" label="单一防毒：3号（A型）滤毒盒"></el-option>
          <el-option value="单一防毒：4号（K型）滤毒盒" label="单一防毒：4号（K型）滤毒盒"></el-option>
          <el-option value="单一防毒：7号（E型）滤毒盒" label="单一防毒：7号（E型）滤毒盒"></el-option>
          <el-option value="单一防毒：8号（H2S型）滤毒盒" label="单一防毒：8号（H2S型）滤毒盒"></el-option>
          <el-option value="单一防毒：4号（K型）滤毒鑵" label="单一防毒：4号（K型）滤毒鑵"></el-option>
          <el-option value="单一防毒：5号（CO型）滤毒鑵" label="单一防毒：5号（CO型）滤毒鑵"></el-option>
          <el-option value="单一防毒：8号（H2S型）滤毒鑵" label="单一防毒：8号（H2S型）滤毒鑵"></el-option>
          <el-option value="综合防毒：1号（B型）滤毒鑵" label="综合防毒：1号（B型）滤毒鑵"></el-option>
          <el-option value="综合防毒：3号（A型）滤毒鑵" label="综合防毒：3号（A型）滤毒鑵"></el-option>
          <el-option value="综合防毒：7号（E型）滤毒鑵" label="综合防毒：7号（E型）滤毒鑵"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="急救措施"  v-show="isShow('emergencyTreatment')">
        <keyListenerInput type="textarea" v-model="model.emergencyTreatment" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="消防措施" v-show="isShow('fireFightingMeasures')">
        <keyListenerInput type="textarea" v-model="model.fireFightingMeasures" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="泄漏应急处理" v-show="isShow('emergencyHandlingOfLeakage')">
        <keyListenerInput type="textarea" v-model="model.emergencyHandlingOfLeakage" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="操作处置与储存" v-show="isShow('handlingAndStorage')">
        <keyListenerInput type="textarea" v-model="model.handlingAndStorage" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="接触控制/个体防护" v-show="isShow('touchOrIndividualProtection')">
        <keyListenerInput type="textarea" v-model="model.touchOrIndividualProtection" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="理化特性" v-show="isShow('physicochemicalProperties')">
        <keyListenerInput type="textarea" v-model="model.physicochemicalProperties" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="化学稳定性和反应活性" v-show="isShow('chemicalStabilityAndReactivity')">
        <keyListenerInput type="textarea" v-model="model.chemicalStabilityAndReactivity" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="毒理学资料" v-show="isShow('toxicologicalData')">
        <keyListenerInput type="textarea" v-model="model.toxicologicalData" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="生态学资料" v-show="isShow('ecologicalData')">
        <keyListenerInput type="textarea" v-model="model.ecologicalData" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="废弃处置" v-show="isShow('disposal')">
        <keyListenerInput type="textarea" v-model="model.disposal" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="运输信息" v-show="isShow('transportInformation')">
        <keyListenerInput type="textarea" v-model="model.transportInformation" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="法规信息" v-show="isShow('regulatoryInformation')">
        <keyListenerInput type="textarea" v-model="model.regulatoryInformation" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="其他信息" v-show="isShow('otherInformation')">
        <keyListenerInput type="textarea" v-model="model.otherInformation" rows="3"></keyListenerInput>
      </el-form-item>
      <el-form-item label="备注" v-show="isShow('remark')">
        <keyListenerInput type="textarea" v-model="model.remark" rows="3"></keyListenerInput>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import keyListenerInput from "@/components/tools/keyListener.vue";
export default {
  name: "otherInput",
  props: { model: Object, action: String },
  components: { keyListenerInput },
  watch: {
    model: {
      handler(val) {
        this.$emit("update:model", val);
      },
      deep: true,
      immediate: true
    }
  },
  methods:{
     isShow(params) {
       console.log(params,this.model[params], this.action === "view")
      if (!this.model[params] && this.action === "view") {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.otherInput {
  background-color: #ffffff;
  padding: 1em;
}
</style>

<script>
import Vue from "vue";
import Vuex from "vuex";
//----------------------自定义modules------------
import Jurisdiction from "./modules/Jurisdiction.js";
import Tags from "./modules/tags.js";
import Checkbox from "./modules/checkbox.js";
import ProjectChoiceFiled from "./modules/projectChoiceFiled.js";
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    Jurisdiction, //权限库
    Tags, //选项卡
    Checkbox, // 多选框，下拉框，单选框
    ProjectChoiceFiled // 项目模板共享件打标记
  }
});
</script>
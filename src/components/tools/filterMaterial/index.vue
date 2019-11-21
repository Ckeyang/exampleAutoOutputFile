<template>
  <div>
    <el-dialog title="选择适用物质" append-to-body :close-on-click-modal="false" :visible.sync="isShow" width="30%">
      <el-form>
        <el-form-item label="物质类别">
          <el-cascader
            :options="materialTypeTree"
            clearable
            @change="getCatorgory"
            :props="{ label: 'name', children: 'subclass', value: 'substanceCategoryType' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="物质列表">
          <el-input
            v-model="form.name"
            placeholder="回车进行搜索"
            size="medium"
            @keyup.enter.native="getDataList"
            clearable
          ></el-input>
          <div class="chooseBox" v-show="dataList.length != 0">
            <el-checkbox-group v-model="chooseItem">
              <el-checkbox v-for="item in dataList" :label="JSON.stringify(item)" :key="item.id">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
            <!-- <el-checkbox v-for="item in dataList" :checked="isChecked(item.id)" @change="checked(item)" :key="item.id">{{
              item.name
            }}</el-checkbox> -->
          </div>
          <div style="text-align:center;">
             <span class="yxwz" @click="isShowChoiceItem=!isShowChoiceItem"> 已选物质 {{isShowChoiceItem?'收起':'展开'}}</span>
           </div>
          <div class="tagBox" v-show="isShowChoiceItem">
            <el-tag
              style="margin-right:1em;"
              v-for="(item,index) in chooseItem"
              closable
              @close="deleteChoose(item)"
              :key="index"
              type="info"
              >{{ JSON.parse(item).name }}</el-tag
            >
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="doSaveMaterial">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "filterMaterial",
  data() {
    return {
      form: { substanceCategoryType: "", name: "", current: 0, pageSize: 1000 },
      isShow: false,
      isShowChoiceItem:false,
      chooseItem: [],
      dataList: [],
      materialTypeTree: []
    };
  },
  props: {
    visible: { type: Boolean, default: false },
    value: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  watch: {
    isShow: {
      handler(val) {
        if (!val) {
          this.chooseItem = [];
        } else {
          this.chooseItem = this.value.map(item => {
            let { id, name } = item;
            return JSON.stringify({ id, name });
          });
        }
        this.$emit("update:visible", val);
      }
    },
    visible: {
      handler(val) {
        this.isShow = val;
      },
      immediate: true
    }
  },
  created() {
    this.getMaterialTypeList();
  },
  methods: {
    checked(item) {
      let { id, name } = item;
      let index = this.chooseItem.findIndex(item => item.id === id);
      index === -1 ? this.chooseItem.push({ id, name }) : this.deleteChoose({ id, name });
    },
    deleteChoose(obj) {
      let index = this.chooseItem.findIndex(item => item === obj);
      this.chooseItem.splice(index, 1);
      this.$forceUpdate();
    },
    isChecked(id) {
      let index = this.chooseItem.findIndex(item => item.id === id);
      return index === -1 ? false : true;
    },
    getDataList(reset = false) {
      this.$http.staticMaterialService.getList(this.form).then(res => {
        this.dataList = res.data.length!=0?res.data.content.map(item => {
          let { id, name } = item;
          return { id, name };
        }):[];
        // this.title = getTitle(this.dataList[0]);
      });
    },
    getCatorgory(val) {
      this.form.substanceCategoryType = val[val.length - 1];
      this.getDataList(true);
    },
    getMaterialTypeList() {
      this.$http.materialService.getMaterialTypeList({}).then(res => {
        this.materialTypeTree = this.reloadMaterialType(res.data);
      });
    },
    doSaveMaterial() {
      this.$emit("input", this.chooseItem.map(item=>JSON.parse(item)));
      this.isShow = false;
    },
    /**
     * 过滤subclass为空
     */
    reloadMaterialType(data) {
      let result = [];
      data.map(item => {
        let { id, name, rankType, parentId, substanceCategoryType, applicationType, subclass, templateId } = item;
        if (subclass.length > 0) {
          result.push({
            id: id,
            name: name,
            rankType: rankType,
            applicationType: applicationType,
            parentId: parentId,
            substanceCategoryType: substanceCategoryType,
            templateId: templateId,
            subclass: this.reloadMaterialType(subclass)
          });
        } else {
          result.push({
            id: id,
            name: name,
            rankType: rankType,
            applicationType: applicationType,
            parentId: parentId,
            substanceCategoryType: substanceCategoryType,
            templateId: templateId
          });
        }
      });
      return result;
    }
  }
};
</script>
<style lang="scss" scoped>
.chooseBox {
  margin-top: -0.2em;
  padding: 0 1em;
  max-height: 230px;
  overflow: auto;
  border: 1px solid #dcdfe6;
  .el-checkbox{
    margin:1px 0;
  }
}
.tagBox {
  margin-top: 0.1em;
  padding: 0 1em;
  max-height: 80px;
  overflow: auto;
  border: 1px dashed #dcdfe6;
}
.yxwz{
  color:#107AC2;
  font-size: 12px;
  cursor: pointer;
}
</style>

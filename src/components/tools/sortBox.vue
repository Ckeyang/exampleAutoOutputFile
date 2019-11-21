<template>
  <div class="app-container">
    <el-table :data="value" style="width: 100%" border :row-key="roWkey" size="mini" :row-class-name="tableRowClassName">
      <el-table-column
        v-for="(item, index) in props"
        :key="index"
        :prop="item.key"
        align="center"
        show-overflow-tooltip
        :label="item.label"
        :formatter="item.formatter"
      >
      </el-table-column>
      <!-- <el-table-column prop="name" align="center" show-overflow-tooltip label="模板名称"></el-table-column>
      <el-table-column prop="description" align="center" show-overflow-tooltip label="模板描述"></el-table-column> -->
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <i :key="scope.row.id" class="iconfont icon-yidong middleDrag" title="拖动"></i>&nbsp;&nbsp;
          <i v-show="isDivision" @click="division(scope.row)" class="iconfont  icon-i-fenge" title="分割"></i>
          <!-- <slot name="otherBtn" :data="scope.row"></slot> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import Sortable from "sortablejs";
export default {
  name: "SortBox",
  props: {
    value: Array,
    roWkey: { type: String, default: "id" },
    props: {
      type: Array,
      default: function() {
        return [{ key: "name", label: "名称" }, { key: "description", label: "描述" }];
      }
    },
    isDivision: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  watch: {
    value(val) {
      this.$emit("input", val);
    }
  },
  created() {
    setTimeout(this.setSort, 500);
  },
  methods: {
    /**
     * 列表分割线
     */
    tableRowClassName({ row, rowIndex }) {
      if (row.split) {
        return "isDivision";
      }
      return "";
    },
    /**
     * 分割
     */
    division(item) {
      item.split = !item.split;
    },
    /**
     * 初始化sortable
     */
    setSort() {
      const el = document.querySelectorAll(".app-container .el-table__body-wrapper > table > tbody")[0];
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost",
        animation: 120,
        scroll: true,
        handle: ".middleDrag",
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: evt => {
          let item = this.value[evt.oldIndex];
          this.value.splice(evt.oldIndex, 1);
          this.value.splice(evt.newIndex, 0, item);
        }
      });
    }
  }
};
</script>

<style scoped>
.icon-star {
  margin-right: 2px;
}
i {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
.icon-yidong {
  cursor: pointer;
}
/* .app-container >>> .el-table tr:hover,
.app-container >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #fff;
} */
</style>

<template>
  <el-table :data="formatData" :row-class-name="showRow" v-bind="$attrs">
    <el-table-column v-if="!columns.length" width="50" align="center">
      <template slot-scope="scope">
        <!-- <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span> -->
        <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="scope.row._expanded" class="icon-expanded el-icon-arrow-right"></i>
          <i v-else class="el-icon-arrow-right"></i>
        </span>
      </template>
    </el-table-column>
    <el-table-column v-else v-for="(column, index) in columns" :key="index" :label="column.label" :width="column.width">
      <template slot-scope="scope">
        <!-- <span v-if="!index" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span> -->
        <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="scope.row._expanded" class="icon-expanded el-icon-arrow-right"></i>
          <i v-else class="el-icon-arrow-right"></i>
        </span>
        {{scope.row[column.value]}}
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</template>

<script>
export default {
  name: 'treeTable',
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: { // 字段列表
      type: Array,
      default: () => []
    },
    expandAll: { // 是否全部展开
      type: Boolean,
      default: false
    },
    props:{
      default:()=>({
        children:'children'
      })
    }
  },
  computed: {
    // 格式化数据源
    formatData() {
      return this.tableTransform(this.data, this.expandAll)
    }
  },
  methods: {
    // 树形结构转换
    tableTransform(data, expandAll, parent = null, level = null){
      let tmp = []
      data.forEach((record) => {
        if (record._expanded === undefined) {
          this.$set(record, '_expanded', expandAll)
        }
        let _level = 1
        if (level !== undefined && level !== null) {
          _level = level + 1
        }
        this.$set(record, '_level', _level)
        // 如果有父元素
        if (parent) {
          this.$set(record, '_parent', parent)
        }
        tmp.push(record)
        if (record[this.props.children] && record[this.props.children].length > 0) {
          const children = this.tableTransform(record[this.props.children], expandAll, record, _level)
          tmp = tmp.concat(children)
        }
      })
      return tmp
    },
    // 表格行显示的隐藏
    showRow(row) {
      const show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
      row.row._show = show
      if(row._level > 1){
         return show ? 'treeTableShowClass treeChild' : 'treeTableHideClass treeChild' 
      }
      return show ? 'treeTableShowClass' : 'treeTableHideClass'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record[this.props.children] && record[this.props.children].length > 0)
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  .treeTableShowClass{
    animation:treeTableShow .8s;
    -webkit-animation:treeTableShow .8s;
  }
  .treeTableHideClass{
    display: none !important
  }
  .treeChild{
    background-color: red 
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  .processContainer{
    width: 100%;
    height: 100%;
  }
  .tree-ctrl{
    cursor: pointer;
  }
  .icon-expanded.el-icon-arrow-right{
    transform: rotate(90deg)
  }
  .el-icon-arrow-right{
    color: #666;
    transition: transform .2s
  }
</style>

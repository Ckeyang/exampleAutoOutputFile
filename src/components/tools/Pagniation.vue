<template>

    <!-- 页码 -->
    <div v-show='totalNum' class="pagniation-box">
      <div
        style="float: left;"
        class="pages"
      >
        <span class="el-pagination__total">共{{totalNum || 0}}条</span>
        <el-select
          v-model="pageSize"
          size="small"
          @change="pageSizeChange"
          placeholder="10条/页"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div style="float: right;">
        <div style="float: left;">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-count="Number(totalPage)"
            @current-change='handleCurrentChange'
            :current-page.sync="current"
          >
          </el-pagination>
        </div>
        <div class="page-jump">
          <div class="demo-input-suffix">
            前往
            <el-input
              v-model="jumpPage"
              type="text"
              style="width:auto"
              @keyup.enter.native="pageJump"
            >
            </el-input>
            页
            <el-button
              size="small"
              @click="pageJump"
              style="padding: 5px 15px;line-height: inherit"
            >跳转</el-button>
          </div>
        </div>
      </div>
    </div>

</template>
<script>
export default {
  data() {
    return {
      jumpPage: 1,
      current: 1, //当前页码
      pageSize: 30, //每页行数
    };
  },
  props:{
    'totalPage':{
      default: 0
    },
    'totalNum':{
      default: 0
    },
    'initPageSize':{
      default: 30
    },
    'currentPage':{
      default:0,
      type:Number
    },
    options:{
      default:()=>[
        {
          value: 10,
          label: "10条/页"
        },
        {
          value: 20,
          label: "20条/页"
        },
        {
          value: 30,
          label: "30条/页"
        },
        {
          value: 40,
          label: "40条/页"
        },
        {
          value: 500,
          label: "500条/页"
        },
        {
          value: 1000,
          label: "1000条/页"
        },
        {
          value: 1500,
          label: "1500条/页"
        }
      ],
      type:Array
    }
  },
  created(){
    this.current = this.currentPage + 1;
    this.pageSize = this.initPageSize;
  },
  watch: {
    // pageSize(val, oldval) {
    //   if (val != oldval) {
    //     this.current = 1;
    //     this.getData();
    //   }
    // },
    currentPage(val){
      this.current = val + 1;
      this.jumpPage = val + 1;
    },
  },
  methods: {
    //跳转至某页
    pageJump() {
      if (
        parseInt(this.jumpPage) &&
        parseInt(this.jumpPage) <= this.totalPage
      ) {
        this.current = parseInt(this.jumpPage);
        this.getData();
      }
    },
    pageSizeChange(){
      this.current = 1;
      this.getData();
    },
    handleCurrentChange(page) {
      this.current = page;
      this.getData();
    },
    getData() {
      this.jumpPage = this.current
      this.$emit("changePage", {
        pageSize: this.pageSize,
        currentPage: this.current
      });
    },
    //重置页码
    refreshPage() {
      this.current = 1;
      this.jumpPage = 1;
    }
  }
};
</script>
<style scoped>
.pagniation-box{
  background: #fff;
  padding: 15px 10px; 
  overflow: hidden;
}
</style>


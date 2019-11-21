<template>
  <el-popover placement="bottom" width="300" trigger="click" v-model="popoverVisible" @hide="popoverHide" popper-class='tableHeadChoicePopper' >
    <div class="tableHeadChoiceBox" @mouseleave="isShowLayer = false">
      <div class="sort-search-box">
        <el-input v-model="keyWords" placeholder="请输入内容" size="small" suffix-icon="el-icon-search" ></el-input>
        <!-- <el-button type="primary" size="small">搜索</el-button> -->
      </div>
      <ul class="sort-box">
        <li v-for="item in filterDataList" :key="item.id">
          <el-checkbox v-model="item.isChecked" @change="handleChange(item)">
            <span :title="item.label" >{{item.label}}</span>
          </el-checkbox>
          <div v-show="item.isChecked">
            <span class="ascending-order order" :class="{'active':item.order}" @click="handleSort(item, true)">升序</span>
            <span class="descending-order order" :class="{'active':!item.order}" @click="handleSort(item, false)">降序</span>
          </div>
        </li>
      </ul>
      <div class="sort-footer-box" @mouseleave="isShowLayer = false">
        <span @mouseover="isShowLayer = true" >已选{{checkedData.length}}项</span>
        <div>
          <el-button size="small" @click="reset">取消</el-button>
          <el-button type="primary" size="small" @click="submit">保存</el-button>
        </div>
      </div>
      <div class="layer" v-show="isShowLayer && checkedData.length" @mouseover="isShowLayer = true" @click="isShowLayer = false">
        <ul class="layer-box sort-box">
          <li v-for="item in checkedData" :key="item.id">
            <el-checkbox v-model="item.isChecked" @change="handleChange(item)">
              <span :title="item.label" >{{item.label}}</span>
            </el-checkbox>
            <div v-show="item.isChecked">
              <span class="ascending-order order" :class="{'active':item.order}" @click="handleSort(item, true)">升序</span>
              <span class="descending-order order" :class="{'active':!item.order}" @click="handleSort(item, false)">降序</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-button slot="reference" size="small" icon='iconfont icon-shujupaixu' @click="getData">数据排序</el-button>
  </el-popover>
</template>

<script>
export default {
  name: "dataSort", // 数据排序
  data() {
    return {
      keyWords: "",
      dataList: [],
      timer:null,
      popoverVisible:false,
      isShowLayer:false, // 是否显示已选项集合
      checkedData:[] // 已选择的数据
    };
  },
  props: {
    componentId:String, // 组件id
  },
  computed:{
    filterDataList(){
      const keyWords = this.keyWords;
      return this.dataList.filter(
        item =>
          !keyWords ||
          item.label.toLowerCase().indexOf(keyWords.toLowerCase()) > -1
      );
    }
  },
  methods: {
    // 获取设置记录
    getData(){
      clearTimeout(this.timer)
      this.$http.formEnterService.getUserPersonalizedOrder(this.componentId).then(res =>{
        this.getAllcontrollist(res.data ? res.data .componentOrderSettings : [])
        res.data= null
      })    
    },
    // 从父级组件获取所有控件
    getAllcontrollist(componentOrderSettings){
      let data = []
      this.$parent.componentData.map((item,i) => {
        if(['VIDEO', 'IMAGEBOX', 'FILEBOX', 'SIGNATURE', 'CUSTOMBOX'].includes(item.componentType) || !item.componentType){
          return item
        }
        const temp = componentOrderSettings.find(item2 => item2.controlId === item.id) 
        let obj = {
          id:item.id,
          label:item.componentAttr.tag,
          isChecked: false,
          order: true, // true 升序 、 false 降序
          weight:i // 权重，用于排序
        }
        if(temp){ // 赋值上一次的值
          obj.isChecked = true
          obj.order = temp.positiveOrder,
          obj.label = temp.controlName
          this.checkedData.push(obj)
        }
        data.push(obj)
        return item
      })
      this.dataList = data
    },
    submit(){
      const params = {
        componentId:this.componentId,
        componentOrderSettings:this.checkedData.map(item => {
          return {
            controlId: item.id,
            controlName: item.label,
            positiveOrder: item.order
          }
        })
      }
      this.$http.formEnterService.saveUserPersonalizedOrder(params).then(res =>{
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
        this.popoverVisible =false
        const timer = setTimeout(()=>{
          this.$emit('refreshData')
        },500)
      })
    },
    handleChange(node){
      this.$nextTick(() => {
        if(node.isChecked){
          if(this.checkedData.length >= 5){
            this.$message.closeAll();
            this.$message.error('最多只能选择5个字段！');
            node.isChecked = false
            return 
          }
          this.checkedData.push(node)
          this.checkedData.sort((prve, next) => prve.weight - next.weight) // 按字段的顺序排序
        }else{
          this.checkedData = this.checkedData.filter(item => item.id !== node.id)
        }
      });
    },
    handleSort(item, val){
      item.order = val
    },
    popoverHide(){
      this.timer = setTimeout(()=>{
        this.checkedData = []
        this.dataList = []
        clearTimeout(this.timer)
      },600)
    },
    reset(){
      this.popoverVisible = false
    }
  }
};
</script>
<style scoped>
  .sort-box >>> .el-checkbox{
    max-width: 200px;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>

<style scoped lang='scss'>
.tableHeadChoiceBox{
  margin-top: 10px;
  position: relative;
}
.sort-search-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
}
.sort-box{
  margin-top: 10px;
  max-height: 300px;
  overflow-y:auto; 
  li{
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    .ascending-order{
      margin-right: 8px;
    }
    .order{
      cursor: pointer;
      &.active{
        color: #1890FF
      }
    }
  }
  li:hover{
    background: #E6F9FF;
  }
}
.sort-footer-box{
  border-top: 1px solid rgb(230, 236, 245);
  padding:12px 10px 2px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.layer{
  position:absolute;
  bottom: 47px;
  left: 0;;
  z-index: 2;
  width:100%;
  height:calc(100% - 37px);
  background:rgba(0,0,0,.45);
}
.layer-box{
  position:absolute;
  bottom:0;
  left: 0;;
  width: 100%;
  padding: 10px 0;
  background: #fff;
  z-index: 222;
}
</style>

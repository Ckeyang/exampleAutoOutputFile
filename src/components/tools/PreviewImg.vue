<template>
    <div class="preview-box" >
        <el-dialog :title="title" :visible.sync="dialogVisible" width="760px" @close='closeDialog'>
            <div>
                <el-carousel ref="previewCarousel" trigger="click" height="400px" :initial-index='initialIndex' @change='handleChange' :autoplay="false">
                    <el-carousel-item v-for="item in previewData.dataList" :key="item.url" >
                        <img :src="item.url" alt="加载失败" class="img-item">
                    </el-carousel-item>
                </el-carousel>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name: 'previewImg',
  data() {
    return {
      dialogVisible: false,
      title:'',
      initialIndex:0
    };
  },
  props: ['previewData','visible'],
  watch: {
    visible(val){
      this.initialIndex = 0
      this.dialogVisible = val
      // if(!val){
      //   this.$refs.previewCarousel.setActiveItem(0)
      // }
    }
  },
  methods:{
    handleChange(index){
      const currItem = this.previewData.dataList[index]
      this.title = (currItem.name || '图片预览') + ` (${index + 1}/${this.previewData.dataList.length})`
    },
    closeDialog(){
      this.$emit('update:visible',false)
    }
  }
};
</script>
<style scoped>
  .preview-box .img-item{
    width: 510px;
    height: 350px;
    object-fit: contain;
    text-align: center;
    margin-top: 20px;
  }
</style>



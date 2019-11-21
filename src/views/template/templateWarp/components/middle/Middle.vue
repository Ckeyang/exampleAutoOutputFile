<template>
  <div class="middle-box">
    <!-- <el-scrollbar :style="{height:(winHeight-76) +'px'}"> -->
      <div class="middle" ref='templateFormBox' :style="{height:(winHeight-76) +'px'}">
        <div class="from-box"  v-if="templateForm.length">
          <div class="describe-title">
            <div>
              <i class="el-icon-edit"></i> {{ formAttrs.type === 'ASSEMBLY' ? '点击左侧组件创建自定义组件！选中组件可以在右边设置组件属性' : '点击左侧组件创建模板！选中组件可以在右边设置组件属性'}}。
            </div>
          </div>
        </div>
        <!-- 表单列表 -->
        <div @click.stop>
          <draggable :list="templateForm" :options="dragOptions" @end='dragEnd' @start='dragStart' >
            <transition-group tag="ul" id="templateForm" class="question">
              <forms :model='item' v-for='(item,i) of templateForm' :key='i' :isLoop='true' :titleIndex='i+1' :sortIndex='i+1' :currentIndex='currentIndex'
                @formDelete='formDelete' @changeisRightAttrFormShow='changeisRightAttrFormShow' @formCopy='formCopy'></forms>
            </transition-group>
          </draggable>
        </div>
      </div>
    <!-- </el-scrollbar> -->
    <backTop scrollbarClass='.middle-box .middle'  />
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import forms from './ComponentWarp.vue';
import backTop from '@/components/tools/backTop.vue';
export default {
	data() {
		return {
			dragOptions: {
				animation: 120,
				handle: '.middleDrag',
				scroll: true,
				group: {
					pull: true,
					name: 'sortlist'
				},
				ghostClass: "ghost-style"
			},
			isScrollTop: false, // 是否滚动内容，初次进入不滚动
			templateFormLength: 0, //记录当前模板的内容长度，判断是否在增加模板
			isShowBackTop: false, //是否显示回到顶部按钮
		};
	},
	props: ['templateForm', 'currentIndex', 'formAttrs'],
	components: {
		forms,
		draggable,
		backTop
	},
	methods: {
		//改变是否显示右侧属性设置  index为当前点击的index
		changeisRightAttrFormShow(val, index) {
			this.$emit('changeisRightAttrFormShow', val, index);
		},
		// 复制组件
		formCopy(index) {
			this.$emit('formCopy', index);
		},
		//删除表单元素
		formDelete(index) {
			this.$emit('formDelete', index);
		},
		//拖动开始
		dragStart(ele) {
			this.changeisRightAttrFormShow(true, ele.oldIndex + 1);
		},
		//拖动结束
		dragEnd(ele) {
			this.changeisRightAttrFormShow(true, ele.newIndex + 1);
		},
		//改变表单标题
		changeTitle() {
			this.$emit('changeTitle', this.formTitleTemp);
		},
	}
};
</script>
<style scoped>
.middle-box >>> .el-loading-mask{
	background: #f3f5f7
}
.middle {
	background: #f3f5f6;
	overflow: auto;
	padding: 10px 15px 30px;
}

.middle .title {
	font-size: 18px;
	height: 40px;
	font-weight: normal;
	line-height: 40px;
	text-indent: 10px;
	border: none;
	width: 100%;
}
.middle-box {
	flex-grow: 1;
}

.middle .title-list {
	padding: 10px 40px 10px 30px;
	background: #fff;
	border-radius: 4px;
	overflow: visible;
	color: #484848;
	text-align: left;
	background-color: #ffffff;
	border: solid 2px #ffffff;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.describe-title {
	height: 90px;
	width: 100%;
	border: 1px dashed #107AC2;
	font-size: 14px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #fff;
}

.middle .title:hover {
	outline: dashed 1px #aaaaaa;
}

.middle .title:focus {
	background: #f4f4f4;
	outline: none;
}

.describe-title i {
	color: #107AC2;
}

.from-box {
	display: none;
}

 
</style>
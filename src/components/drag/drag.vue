<template>
      <div @mousedown="startDrag()" class="drag"  @mouseup="drop" @mouseup.stop.prevent="pointStop" :style="ckStyle">
        <ckSvg v-if='svg' :width="width" :svg="svg" :height="height"/>
        <span v-for="(item,index) in points" :ref='"point"+index'
         :index="index" :key='index' v-if='svg.type==="polygon"' 
         :style="getPosition(item)" class="point" @mousedown.stop.prevent="point"></span>
        <span class="zoom" @mousedown.stop.prevent="zoom" @mouseup.stop.prevent="zoomStop"></span>
      </div>
</template>
<script>
import ckSvg from '@/components/drag/svg.vue';
export default {
  name: 'ck-drag',
  data() {
    return {
      item: this.value,
      isDrag: false,
      isZoomDrag: false,
      choosePoint: [],
      offsetLeft: 0,
      choosePointIndex: null,
      pointDrag: false,
      points: this.svg.points,
      width: 120,
      height: 120,
      left: 0,
      top: 0,
      ckStyle: {
        left: '20px',
        top: '80px'
      },
      offsetTop: 0,
      pointPosition: { x: 0, y: 0 },
      mouseDownPosition: { x: 0, y: 0 }
    };
  },
  mounted() {
    this.$el.parentNode.addEventListener('mousemove', this.drag, true);
    this.$el.parentNode.addEventListener('mousemove', this.zoomMove, true);
    this.$el.parentNode.addEventListener('mousemove', this.pointMove, true);
  },
  components: { ckSvg },
  props: {
    value: Object,
    svg: Object
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.ckStyle.width = this.width + 'px';
      this.ckStyle.height = this.height + 'px';
    },
    setVmodel() {
      this.$emit('input', this.item);
    },
    /**
     * 拖拽
     */
    drag() {
      if (this.isDrag) {
        this.offsetLeft = this.$el.parentNode.offsetLeft || 0;
        this.offsetTop = this.$el.parentNode.offsetTop || 0;
        let position = this.getCenter(this.getMousePosition());
        this.ckStyle.left = this.checkZoo('left', position.x) + 'px';
        this.ckStyle.top = this.checkZoo('top', position.y) + 'px';
        this.item.num = this.ckStyle.top;
        this.setVmodel();
      }
    },
    /**
     * 获取position
     */
    getPosition(item) {
      return {
        left: item.split(',')[0] + 'px',
        top: item.split(',')[1] + 'px'
      };
    },
    /**
     * 放大缩小 拖拽
     */
    zoomMove() {
      if (this.isZoomDrag) {
        let position = this.getMousePosition();
        this.ckStyle.width =
          position.x - this.mouseDownPosition.x + this.width + 'px';
        this.ckStyle.height =
          position.y - this.mouseDownPosition.y + this.height + 'px';
        this.ckStyle = Object.assign({}, this.ckStyle);
      }
    },
    /**
     * 判断是否超出
     */
    checkZoo(hor, value) {
      let result = 0;
      if (hor === 'left') {
        let width = this.$el.parentNode.clientWidth;
        result = value - this.offsetLeft > 0 ? value - this.offsetLeft : result;
        result =
          value - this.offsetLeft + this.width > width
            ? width - this.width
            : result;
      } else if (hor === 'top') {
        let height = this.$el.parentNode.clientHeight;
        result = value - this.offsetTop > 0 ? value - this.offsetTop : 0;
        result =
          value - this.offsetTop + this.height > height
            ? height - this.height
            : result;
      }
      return result;
    },
    /**
     * 缩放
     */
    zoom() {
      this.mouseDownPosition = this.getMousePosition();
      this.isZoomDrag = true;
    },
    /**
     * 缩放停止
     */
    zoomStop() {
      this.width = Number(this.ckStyle.width.split('px')[0]);
      this.height = Number(this.ckStyle.height.split('px')[0]);
      this.isZoomDrag = false;
    },
    /**
     * 释放
     */
    drop() {
      this.isDrag = false;
    },
    /**
     * 开始拖拽
     */
    startDrag() {
      this.isDrag = true;
    },

    /**
     * 坐标移动
     */
    pointMove() {
      if (this.pointDrag && this.$refs['point' + this.choosePointIndex]) {
        let position = this.getMousePosition();
        this.left =
          position.x - this.pointPosition.x + Number(this.choosePoint[0]);
        this.top =
          position.y - this.pointPosition.y + Number(this.choosePoint[1]);

        this.points[this.choosePointIndex] = this.left + ',' + this.top;
        this.points = Object.assign({}, this.points);
        // this.ckStyle = Object.assign({}, this.ckStyle);
      }
    },
    /**
     * 开始
     */
    point($event) {
      this.pointDrag = true;
      this.choosePointIndex = $event.target.getAttribute('index');
      this.choosePoint = this.points[this.choosePointIndex].split(',');
      this.pointPosition = this.getMousePosition();
    },
    /**
     * 结束
     */
    pointStop() {
      if (this.pointDrag) {
        this.pointDrag = false;
        let list = [];
        for (let i in this.points) {
          list.push(this.points[i]);
        }
        let obj = { type: this.svg.type, points: list };
        this.$emit('update:svg', obj);
        this.choosePointIndex = '';
      }
    },
    /**
     * 获取鼠标坐标
     */
    getMousePosition() {
      let event = window.event;
      return { x: event.clientX, y: event.clientY };
    },
    /**
     * 获取图形中心坐标
     */
    getCenter(position) {
      return {
        x: position.x - this.width / 2,
        y: position.y - this.height / 2
      };
    },
    onChange() {
      this.$emit('changeData', this.data);
      this.$emit('changeStyle', this.ckStyle);
      this.$emit('changeName', this.name);
    }
  }
};
</script>
<style lang="scss" scoped>
.drag {
  position: absolute;
  z-index: 99999999;
  overflow: hidden;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0);
  .zoom {
    cursor: se-resize;
    position: absolute;
    display: none;
    margin-left: -0.4em;
    margin-top: -0.4em;
    width: .8em;
    height: .8em;
    background-color: rgb(0, 0, 0);
    z-index: 2;
    right: 0;
    bottom: 0;
  }
  .point {
    position: absolute;
    cursor: pointer;
    display: none;
    margin-left: -0.3em;
    margin-top: -0.3em;
    width: 0.6em;
    height: 0.6em;
    background-color: rgba(0, 0, 0, 0.7);
  }
}
.drag:hover {
  background-color: rgba(0, 0, 0, 0.3);
  .zoom {
    display: inline-block;
  }
  .point {
    display: inline-block;
  }
}
</style>

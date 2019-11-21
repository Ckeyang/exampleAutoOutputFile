<template>
    <div>
        <svg :width="width" :height="height" version="1.1"
            xmlns="http://www.w3.org/2000/svg">
            <rect v-if="svg.type==='rect'" :width="width" :height="height"
                style="fill:rgb(0,0,255);"/>
            <circle v-if="svg.type==='circle'"  :cx="width/2" :cy="height/2" :r="r"
                style="fill:rgb(0,0,255);"/>
            <polygon v-if="svg.type==='polygon'" :points="svg.points"
                style="fill:rgb(0,0,255);"/>
            <ellipse v-if="svg.type==='ellipse'" style="fill:rgb(0,0,255);"
             :cx="width/2" :cy="height/2" :rx="rx" :ry="ry"></ellipse>
        </svg>
    </div>
</template>
<script>
export default {
  name: 'ckSvg',
  props: { width: Number, height: Number, svg: Object },
  data() {
    return {
      rx: this.width / 2,
      ry: this.height / 2,
      r: this.height > this.width ? this.width / 2 : this.height / 2
    };
  },
  watch: {
    width(val) {
      this.r = this.height > this.width ? this.width / 2 : this.height / 2;
      this.rx = val / 2;
    },
    height(val) {
      this.ry = val / 2;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

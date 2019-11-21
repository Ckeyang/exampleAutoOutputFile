<template>
    <div class="palette" v-show="visible" @click="close">
        <div class="paletteBox" @click.stop>
          <slot/>
        </div>
    </div>
</template>
<script>
export default {
  name: 'palette',
  props: { visible: Boolean, default: false },
  methods: {
    close() {
      this.$emit('update:visible', false);
    }
  }
};
</script>
<style lang="scss" scoped>
.palette {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;
  background-color: RGBA(0, 0, 0, 0.5);
  .paletteBox {
    position: relative;
    width: 500px;
    height: 500px;
    background-color: #ffffff;
    background-image: -webkit-linear-gradient(
        180deg,
        #e0e0e0 1px,
        transparent 1px
      ),
      -webkit-linear-gradient(90deg, #e0e0e0 1px, transparent 1px);
    background-size: 10px;
  }
}
</style>
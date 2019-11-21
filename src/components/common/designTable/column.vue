<template>
    <div class="item_column"  @mousedown="startMove">
       <div><slot name='name'/></div>
       <div><slot name='button'/></div>
    </div>
</template>
<script>
export default {
  name: 'column',
  data() {
    return {
      isMove: false
    };
  },
  props: { model: Object },
  mounted() {
    this.model.offsetLeft = this.$el.offsetLeft;
    console.log(this.model)
    this.$emit('update:model', this.model);
  },
  methods: {
    startMove() {
      this.isMove = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.item_column {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 120px;
  height: 120px;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 60px;
    border: 1px solid #ccc;
  }
}
</style>

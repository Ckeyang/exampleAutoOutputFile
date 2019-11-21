<template>
    <div class="platte">
      <slot name='column'/>
    </div>
</template>
<script>
export default {
  name: 'designTable',
  data() {
    return {
      isMove: false
    };
  },
  props: { value: Array }
};
</script>

<style lang="scss" scoped>
.platte {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5em;
  border: 1px solid #ccc;
}
</style>

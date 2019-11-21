<template>
    <div class="top">
       <div class="title"> {{name}}</div>
       <div>
           <slot/>
       </div>
    </div>
</template>
<script>
export default {
  name: 'top',
  props: { name: String }
};
</script>
<style lang="scss" scoped>
.top {
  width: 100%;
  height: 76px;
  display: flex;
  color: #f3f5f6;
  padding: 0 3em;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  background: rgba(52, 58, 69, 1);
  .title {
    font-size: 20px;
  }
}
</style>

<template>
  <header>
    <div class='top-btn'>
      <div class='form-title'>
        <slot  name="title" />
      </div>
    </div>
    <div class='top-btn' >
      <slot name="button" />
    </div>
  </header>
</template>

<script>
export default {
  name:'pageHeader'
};
</script>

<style scoped lang='scss'>
header {
  width: 100%;
  height: 60px;
  display: flex;
  color: #f3f5f6;
  justify-content: space-between;
  align-items: center;
  background: #107ac2;
  .top-btn {
    display: flex;
    height: 32px;
    margin: 0 16px 0 14px;
    justify-content: space-around;
    .form-title {
      display: flex;
      align-items: center;
      font-size: 20px;
      .header-title{
        font-size: 20px;
        margin-left: 8px;
      }
    }
  }
}
</style>

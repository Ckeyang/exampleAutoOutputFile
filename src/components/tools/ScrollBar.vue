<template>
    <div class="scroll-bar" :style="{'top':0+'px','height':bHeight+'px'}">

    </div>
</template>
<script>
export default {
  props: ['bHeight']
};
</script>

<style scoped>
.scroll-bar {
  position: absolute;
  right: 0;
  top: 0;
  width: 8px;
  border-radius: 8px;
  background: rgb(201, 200, 200);
}
</style>

<template>
  <div class="middle">
        <slot/>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.middle {
  padding: 1em 2em;
  background-color: #FFFFFF;
  height: 100vh;
  overflow-y: auto;
  width: 770px;
  margin: 0 auto;
  box-sizing: border-box;
}
::-webkit-scrollbar {
    width: .5em;
}
 
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}
 
::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}
</style>
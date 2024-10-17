<template>
  <div id="app">
    <ButtonList />
    <VirtualScroll />
  </div>
</template>

<script>
import ButtonList from "./components/ButtonList.vue";
import VirtualScroll from "./components/VirtualScroll.vue";

export default {
  components: {
    ButtonList,
    VirtualScroll,
  },
};
</script>

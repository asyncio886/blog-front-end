<template>
  <div class="app">
    <div>
      <TopMenu />
    </div>
    <div class="main-container">
      <RouterView />
    </div>
    <Bottom />
  </div>
</template>

<script setup lang="ts">
import Bottom from './components/Bottom.vue';
import TopMenu from "@/components/TopMenu.vue";
</script>
<style scoped lang="less">
.app {
  background-image: url("@/assets/background.jpg");
  background-repeat: repeat-y;
  background-size: cover;
  background-attachment: fixed;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  max-height: 100vh;
  overflow: scroll;
}

.main-container {
  margin: 5px auto;
  transition: box-shadow 0.3s;
  padding: 5px;
  border-radius: 5px;
  background-color: rgba(240, 248, 255, 0.651);
  background-attachment: fixed;
   @media screen and (max-width: 750px) {
    width: 100vw;
    flex-direction: column;
  }

  @media screen and (min-width: 750px) {
    width: 80vw;
  }

  &:hover {
    box-shadow: rgba(82, 82, 82, 0.414) 5px 5px 10px;
  }

  min-height: 95vh;
}
</style>


<template>
  <div>
    <TopMenu/>
  </div>
  <div class="main-container">
        <RouterView />
  </div>
  <Bottom />
</template>

<script setup lang="ts">
import Bottom from './components/Bottom.vue';
import TopMenu from "@/components/TopMenu.vue";
</script>
<style scoped lang="less">
.main-container{
  margin: 5px auto;
  transition: box-shadow 0.3s;
  padding: 5px;
  border-radius: 5px;
  @media screen and (max-width: 750px) {
    width: 100vw;
    flex-direction: column;
  }
  @media screen and (min-width: 750px) {
    width: 80vw;
  }
  &:hover {
    box-shadow:  rgba(82, 82, 82, 0.414) 5px 5px 10px ;
  }
  min-height: 95vh;
}
</style>


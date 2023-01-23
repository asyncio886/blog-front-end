<template>
    <div>
        <h2>
            热门
            <hr>
        </h2>
    </div>
    <div v-for="item in refWebConfig.hotArticles.value" :key="item.simpleArticle.aid">
        <p style="cursor: pointer"  @click="goToDetail(item.simpleArticle.aid)">
            <a>
                <b>{{ item.simpleArticle.title }}</b>
            </a>
        </p>
        <p>
            {{ item.simpleArticle.description }}
        </p>
        <hr style="opacity: 0.5;">
    </div>
</template>

<script lang="ts" setup>
import useWebConfig from "@/store/webConfig";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
const webConfig = useWebConfig();
const refWebConfig = storeToRefs(webConfig);
onBeforeMount(() => {
    webConfig.getCardHotArticles();
})

function goToDetail(aid: number) {
    window.open(`/detail/${aid}`)
}
</script>
<style>
* {
    margin: 0px;
    padding: 0px;
}
</style>
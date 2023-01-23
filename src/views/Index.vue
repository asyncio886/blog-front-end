<template>
    <div>
        <div v-if="articleList == null">

        </div>
        <div v-else>
            <div style="display: flex;" class="all-container">
                <div class="show-container">
                    <ArticleList :data="articleList.dataList" />
                    <Row :justify="`center`" :style="{padding: `5px`}">
                        <Pagination v-model:current="pnIndex" :total="articleList.sum" />
                    </Row>
                </div>
                <div class="admin-user-container">
                    <PersonCard />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { getArticlesByTagId, getArticlesNormal } from '@/api/articleApi';
import { PageDto, SimpleArticleWithAuthorInfo } from '@/api/declare';
import ArticleList from '@/components/article/ArticleList.vue';
import PersonCard from '@/components/PersonCard.vue';
import { getPageNumber } from '@/utils/PageUtils';
import { Ref, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Pagination, Row } from "ant-design-vue";
import useWebConfig from "@/store/webConfig";
const router = useRouter();
const route = useRoute();
const pnSize = 8;
const webConfig = useWebConfig();
const articleList: Ref<PageDto<SimpleArticleWithAuthorInfo> | null> = ref(null);
const pnIndex = ref(getPageNumber(route.query.pn as any));
watch(() => router.currentRoute.value.query, async (query) => {
    let tagId = webConfig.getTagId(query.tag as string | undefined), pn = getPageNumber(query.pn as any);
    if (tagId == null) {
        articleList.value = (await getArticlesNormal(pn, pnSize)).data;
    }
    else {
        articleList.value = (await getArticlesByTagId(tagId, pn, pnSize)).data;
    }
}, {
    immediate: true,
    deep: true
})
watch(pnIndex, () => {
    if(route.query.tag == undefined) {
        router.push(`/?pn=${pnIndex.value}`);
    }
    else {
        router.push(`/?tag=${route.query.tag}&pn=${pnIndex.value}`);
    }
});

</script>
<style lang="less">
.show-container {
    flex-grow: 1;
}

.admin-user-container {
    max-width: 33%;
    min-width: 33%;
    @media screen and (max-width: 500px) {
        max-width: 100%;
    }
}

.all-container {
    @media screen and (max-width:500px) {
        flex-direction: column;
    }
}
</style>
<template>
    <Empty v-if="dataList == null || dataList.length == 0">
        <template #description>
            <span style="opacity: 0.6;">
                空空如也
            </span>
        </template>
    </Empty>
    <div v-else>
        <div v-for="item in dataList" :key="item.aid" @click="goToDetail(item.aid)" style="cursor: pointer;">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <hr>
        </div>
        <Row :justify="`center`" :style="{padding: '5px'}">
            <Pagination v-model:current="currentPage" :total="sum" :page-size="6" />
        </Row>
    </div>
</template>
<script lang="ts" setup>
import { searchArticles } from '@/api/articleApi';
import { BlogArticle } from '@/api/declare';
import RouteKeys from '@/constant/RouteKeys';
import { getPageNumber } from '@/utils/PageUtils';
import { notice } from '@/utils/messageUtils';
import { Ref, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Pagination, Row, Empty } from 'ant-design-vue';
const router = useRouter();
const dataList: Ref<null | BlogArticle[]> = ref(null);
const sum: Ref<number> = ref(0);
const currentPage: Ref<number> = ref(getPageNumber(router.currentRoute.value.query.pn as any));
watch(() => router.currentRoute.value.query, async () => {
    const query = router.currentRoute.value.query;
    let pn = getPageNumber(query.pn as any);
    let kw = query.kw as string;
    let res = await searchArticles(kw, pn);
    if (res.ok && res.data != null) {
        dataList.value = res.data.dataList;
        sum.value = res.data.sum;
    }
    else {
        notice("搜索出错了");
    }
}, {
    immediate: true,
    deep: true
})
watch(currentPage, (pn) => {
    router.push({
        name: RouteKeys.Search.name,
        query: {
            kw: router.currentRoute.value.query.kw,
            pn: pn
        }
    })
});

function goToDetail(aid: number) {
    router.push({
        name: RouteKeys.Detail.name,
        params: {
            aid
        }
    })
}
</script>
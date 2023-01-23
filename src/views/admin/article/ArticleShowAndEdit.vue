<template>
    <div>
        <AdminArticleTable :data-source="dataSource" @delete-article="deleteDataSourceArticle"/>
        <Row :justify="`center`" :style="{padding: '10px'}">
            <Pagination v-model:current="refAdminArticleStore.currentPage.value" :total="refAdminArticleStore.articles.value.sum"
                :page-size="refAdminArticleStore.defaultSize.value" />
        </Row>
    </div>
</template>
<script setup lang="ts">
import { ArticleTableItem, PageDto, SimpleArticleWithAuthorInfo } from '@/api/declare';
import AdminArticleTable from '@/components/admin/AdminArticleTable.vue';
import useAdminArticleStore from "@/store/adminArticlesStore";
import { storeToRefs } from 'pinia';
import { Pagination, Row } from "ant-design-vue";
import { ref, watch } from 'vue';
const adminArticleStore = useAdminArticleStore();
const refAdminArticleStore = storeToRefs(adminArticleStore);
const dataSource = ref<ArticleTableItem[]>([]);
function transArticlePageDtoToTable(pageDto: PageDto<SimpleArticleWithAuthorInfo>): ArticleTableItem[] {
    let res: ArticleTableItem[] = []
    for (let i = 0; i < pageDto.dataList.length; i++) {
        let at = pageDto.dataList[i];
        let temp: ArticleTableItem = {
            title: at.simpleArticle.title,
            aid: at.simpleArticle.aid,
            username: at.userInfo.username,
            likeCount: at.simpleArticle.likeCount,
            watchCount: at.simpleArticle.watchCount,
        };
        res.push(temp);
    }
    return res;
}
let componentLoaded = false;
watch(refAdminArticleStore.currentPage, async () => {
    // 防止组件重新创建时有拉一边原数据
    if(refAdminArticleStore.hasLoadOnce.value && !componentLoaded) {
        componentLoaded = true;
    }
    else {
        await adminArticleStore.getArticles(refAdminArticleStore.currentPage.value);
        componentLoaded = true;
    }
    dataSource.value = transArticlePageDtoToTable(refAdminArticleStore.articles.value);
},{
    immediate: true
})
function deleteDataSourceArticle(aid: number) {
    for(let i = 0;i < dataSource.value.length;i++) {
        if(dataSource.value[i].aid == aid) {
            dataSource.value.splice(i, 1);
            refAdminArticleStore.articles.value.sum--;
        }
    }
}
</script>